var _ = require('lodash');
var deepClone = require('deep-clone');
var treeUtils = require('../utils/tree');

module.exports = (userData, program) => {
  return new Promise((resolve, reject) => {

    console.log("Preparing test data for generation.");

    var fullDirectory = deepClone(userData.directory);
    var directory;
    var tagFilters;
    var testTagsMap =
      userData.testsInTags ? buildTestTagsMap(userData.testsInTags)
        : userData.testsInTagsMap ? userData.testsInTagsMap
        : {};

    var settings = buildSettings(userData.settings || [])

    if (program.tags) {
      try {
        program.tags = JSON.parse(program.tags);
        tagFilters = deriveTagFilters(program.tags);
      } catch (e) {
        return reject("Couldn't parse tags argument (-e).  Please check syntax. Example: [0,123,124,125]");
      }
    }

    if (program.folder) {
      directory = deepClone(treeUtils.findNodeById(userData.directory, program.folder));
      if (!directory) {
        return reject("Couldn't find directory: " + program.folder + ".  Has it been deleted?");
      }
    } else {
      directory = deepClone(userData.directory);
    }

    // add some helper methods to the trees.
    treeUtils.enhanceTree(fullDirectory);
    treeUtils.enhanceTree(directory);

    var foldersToGen = [];
    var tests = [];
    var components = [];
    var topDirName = program.topDirName || "snaptests";

    treeUtils.walkThroughTreeNodes(directory, function(node, parent, idx) {

      var newFolderPath = (node.type !== "component" && node.type !== "test") ? node.module : "";
      var pathToRoot = "";

      treeUtils.walkUpParents(node, (parent) => {
        if (parent.root) return;
        newFolderPath = parent.module + "/" + newFolderPath;
        if (parent !== directory) pathToRoot = "../" + pathToRoot;
      });

      node.folderPath = newFolderPath.toLowerCase();

      if (node.children && idx !== 0) {  // case: node is folder
        foldersToGen.push(node.folderPath);
      }
      else if (node.type === "test") {

        // the node only has the test ID.  Find the test and add some node metadata to it.
        var test = _.find(userData.tests, {id: node.testId});
        if (test) {
          test.nodeId = node.id;
          test.folderPath = node.folderPath;
          test.pathToRoot = pathToRoot;
          tests.push(test);
        }
      }
      else if (node.type === "component") {
        // the node only has the component ID.  Find the component and add some node metadata to it.
        var component = _.find(userData.tests, {id: node.testId});
        if (component) {
          component.nodeId = node.id;
          component.folderPath = node.folderPath;
          component.pathToRoot = pathToRoot;
          components.push(component);
        }
      }
    });


    // Apply tag filters to tests.
    if (tagFilters)
      tests = tests.filter((test) => {
        if (tagFilters.operator === "and") {
          var missingTags = tagFilters.tags.filter((tag) => !testTagsMap[test.id] || testTagsMap[test.id].indexOf(tag) === -1);
          return missingTags.length === 0;
        } else {
          var matchingTags = tagFilters.tags.filter((tag) => testTagsMap[test.id] && testTagsMap[test.id].indexOf(tag) !== -1);
          return matchingTags.length > 0;
        }
      });

    console.log("Total Tests: ", tests.length);

    return resolve({
      topDirName: topDirName,
      topDirPath: process.cwd() + "/" + topDirName,
      directory,
      components: components,
      tests: tests,
      envs: userData.envs || userData.dataProfiles || [],
      runs: userData.runs,
      folder: program.folder,
      style: program.style,
      framework: program.framework,
      folders: foldersToGen,
      settings: settings,
      raw: {
        directory: fullDirectory,
        tests: userData.tests,
        components: userData.components
      },
    });

  });
};

function deriveTagFilters(programTags) {
  // Turns [ 0(or)/1(and), tagA, tagB ] into { operator: "and", tags: [tagA, tagB]}
  // Future enhancement: Accept [ 0/1, [0/1, tagA, tagB], [0/1, tagA, tagB]] for nested tag selection.
  var simpleTagFilter = {
    operator: "or",
    tags: []
  };

  programTags.forEach((token, idx) => {
    if (idx === 0 && token === 1) simpleTagFilter.operator = "and" ;
    else simpleTagFilter.tags.push(token)
  });

  return simpleTagFilter;

}

function buildTestTagsMap(testsInTags) {
  return testsInTags.reduce((last, next) => {
    if (!last[next.test_id]) {
      last[next.test_id] = [next.tag_id];
    } else {
      last[next.test_id].push(next.tag_id)
    }
    return last;
  }, {});
}

function buildSettings(settingsArray) {
  var settings = {
    globalTimeout: 5000
  }

  for (var i = 0; i < settingsArray.length; i++) {
    var item = settingsArray[i]

    if (item.key === "globalTimeout") {
      try {
        settings.globalTimeout = parseInt(item.value)
      } catch(e) {
        console.log("Error parsing global timeout.  Reverting to default of 5 seconds.");
      }
    }
  }

  return settings
}
