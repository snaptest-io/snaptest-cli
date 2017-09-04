var mkdirp = require("mkdirp");
var fs = require('fs-extra');
var ejs = require('ejs');
var path = require('path');
var sanitizeForFilename = require("sanitize-filename");
var beautify = require('js-beautify').js_beautify;
var varname = require('varname');
var generateActionList = require('../_shared/nightwatch/generateActionList').generateActionList;
var _ = require('lodash');
var util = require('../_shared/util');


module.exports = function () {


  // generate directories.
  const commonDirPath = this.topDirPath + "/common";
  const testPath = this.topDirPath + "/tests";

  mkdirp.sync(testPath);
  mkdirp.sync(commonDirPath);
  this.folders.forEach((folderPath) => mkdirp.sync(this.topDirPath + "/tests/" + folderPath));


  // Generate contents of tests and components in memory.
  var componentCode = generateComponentCode(this.components);
  this.tests.forEach((test) => test.content = generateTestCode(test, this.components));


  // Create actual files with contents generated above.
  fs.writeFileSync(commonDirPath + "/components.js", componentCode);
  this.tests.forEach((test) => fs.writeFileSync(testPath  + "/" + test.folderPath + sanitizeForFilename(test.name) + ".js", test.content));


  // Create driver file.
  var driverString = fs.readFileSync(__dirname + "/../_shared/nightwatch/assets/snaptest-nw-driver.ejs", 'utf8');
  var driver = ejs.render(driverString, { cli: true, extension: false, globalTimeout: 10000 });
  fs.writeFileSync(commonDirPath + "/snaptest-nw-driver.js", driver);


  // Finish generation.
  this.onComplete();

};

function generateComponentCode(components) {

  var generatedCompCode = "";

  components.forEach((component) => {

    var actionListCode = generateActionList(component.actions, components);
    var cArguments = util.getKeyParamsForComponent(component);

    generatedCompCode += `
    browser.components.${varname.camelback(component.name)} = function(${util.buildParamStringFromArray(cArguments)}) {
      return browser${actionListCode}
    };
`;

  });

  var resultCode = `
      module.exports.bindComponents = function(browser) {
      
      browser.components = {};
      ${generatedCompCode}
      
    }
  `;


  return beautify(resultCode, { indent_size: 2 });

}

function generateTestCode(test, components) {

  var baseUrlVariable = _.find(test.variables, {name: "baseUrl"});
  var code =
    ` 
      const TIMEOUT = 10000; 
      const random= "" + parseInt(Math.random() * 1000000);
      const random1 = "" + parseInt(Math.random() * 1000000);
      const random2 = "" + parseInt(Math.random() * 1000000);
      const random3 = "" + parseInt(Math.random() * 1000000);
      
     
      module.exports = {
        "${test.name.replace(/['"]/g, "\\'")}" : function (browser) {
          
          require('./../${test.pathToRoot}common/snaptest-nw-driver.js').bindHelpers(browser);
          require('./../${test.pathToRoot}common/components.js').bindComponents(browser);
          
          ${ baseUrlVariable ? (`var baseUrl = browser.launchUrl || \`${baseUrlVariable.defaultValue}\`;`) : ""}
          ${ defineTestVariables(test) }
          
          browser${generateActionList(test.actions, components)}
            .end();
        }
      };
    `;

  return beautify(code, { indent_size: 2 });

}

function defineTestVariables(test) {

  var variableDefs = "";

  test.variables.forEach((variable) => {
    if (variable.name !== "baseUrl") {
      variableDefs += `const ${variable.name} = \`${variable.defaultValue}\`;`;
    }
  });

  return variableDefs;
}

