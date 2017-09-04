var mkdirp = require("mkdirp");
var fs = require('fs-extra');
var path = require('path');
var sanitizeForFilename = require("sanitize-filename");
var beautify = require('js-beautify').js_beautify;
var varname = require('varname');
var generateActionList = require('../_shared/chromeless/generateActionList').generateActionList;
var util = require('../_shared/util');
var ejs = require('ejs');

module.exports = function (testData) {

  var topDirPath = process.cwd() + "/" + testData.topDirName;
  var commonDirPath = topDirPath + "/common";
  var testPath = topDirPath + "/tests";

  mkdirp.sync(topDirPath);
  mkdirp.sync(testPath);

  // generate skeleton directories
  testData.folders.forEach((folderPath) => {
    mkdirp.sync(topDirPath + "/tests/" + folderPath)
  });

  mkdirp.sync(topDirPath + "/common");

  // Generate contents of tests
  testData.tests.forEach((test) => {
    test.content = generateTestCode(test, testData.components);
  });

  var componentCode = generateComponentCode(testData.components);

  // Create file process
  testData.tests.forEach((test) => {
    fs.writeFileSync(testPath  + "/" + test.folderPath + sanitizeForFilename(test.name) + ".js", test.content);
  });

  fs.writeFileSync(commonDirPath + "/components.js", componentCode);

  // create shim assets via EJS
  var driverString = fs.readFileSync(__dirname + "/../_shared/chromeless/assets/chromeless-shims.ejs", 'utf8');
  var driver = ejs.render(driverString, {cli: true, extension: false});
  fs.writeFileSync(commonDirPath + "/chromeless-shims.js", driver);

  process.exit();

};

function generateComponentCode(components) {

  var generatedCompCode = "";

  components.forEach((component) => {

    var actionListCode = generateActionList(component.actions, components);
    var cArguments = util.getKeyParamsForComponent(component);

    generatedCompCode += `
      chromeless.snapComponents.${varname.camelback(component.name)} = async function(${util.buildParamStringFromArray(cArguments)}) {
      
        await this${actionListCode};
        
        return new Chromeless({}, this);
        
      }.bind(chromeless);
    `;

  });

  var resultCode = `
  
      const { Chromeless} = require('chromeless')
  
      module.exports.bindComponents = function(chromeless) {
      
      chromeless.snapComponents = {};
      ${generatedCompCode}
      
    }
  `;


  return beautify(resultCode, { indent_size: 2 });

}

function generateTestCode(test, components) {

  var generatedCode = generateActionList(test.actions, components);
  var defaultLaunchUrlInfo = util.getDefaultLaunchUrlInfo(test.actions);

  var code =
    ` 
      const { Chromeless } = require('chromeless')

      const TIMEOUT = 10000; 
      const random= "" + parseInt(Math.random() * 1000000);
      const random1 = "" + parseInt(Math.random() * 1000000);
      const random2 = "" + parseInt(Math.random() * 1000000);
      const random3 = "" + parseInt(Math.random() * 1000000);
      
      async function run() {
        
        const baseUrl = "${defaultLaunchUrlInfo.launchUrl}";
        const chromeless = new Chromeless()
        require('./../${test.pathToRoot}common/chromeless-shims.js').bindShims(chromeless);
        
        await chromeless${generatedCode}

        await chromeless.end();   
         
      };
      
      run().catch(console.error.bind(console))

    `;

  return beautify(code, { indent_size: 2 });

}


