var mkdirp = require("mkdirp");
var fs = require('fs-extra');
var ejs = require('ejs');
var sanitizeForFilename = require("sanitize-filename");
var generateActionList = require('../_shared/nightwatch/generateActionList').generateActionList;
var _ = require('lodash');
var util = require('../_shared/util');
var beautify = require('js-beautify').js_beautify;

module.exports.generate = function() {

  // generate directories.
  const commonDirPath = this.topDirPath + "/common";
  const componentsDirPath = this.topDirPath + "/components";
  const testDirPath = this.topDirPath + "/tests";

  mkdirp.sync(commonDirPath);
  mkdirp.sync(componentsDirPath);
  mkdirp.sync(testDirPath);

  this.folders.forEach((folderPath) => mkdirp.sync(this.topDirPath + "/tests/" + folderPath));

  // Generate contents of tests and components in memory.
  // var componentCode = generateComponentCode(this.components);
  this.tests.forEach((test) => test.content = generateTestCode(test, this.components));

  // Create actual files with contents generated above.
  // fs.writeFileSync(commonDirPath + "/components.js", componentCode);
  this.tests.forEach((test) => {
    var fileName = util.buildTestClassName(test.name);
    fs.writeFileSync(testDirPath  + "/" + test.folderPath + fileName + ".cs", test.content)
  });

  // Finish generation.
  this.onComplete();
}

function generateTestCode(test, components) {

  var baseUrl = _.find(test.variables, {name: "baseUrl"});

  var code = `
  using NUnit.Framework;
  using NUnit;
  using OpenQA.Selenium;
  using OpenQA.Selenium.Chrome;
  using System;
  
  [TestFixture]
  
  public class ${util.buildTestClassName(test.name)}
  
  {
  
     private IWebDriver driver;

     [SetUp]

     public void SetupTest()
     {
         driver = new ChromeDriver();
         driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(30);
         driver.baseUrl = "${baseUrl.defaultValue}";
     }
 
     [TearDown]
     public void TeardownTest()
     {
         driver.Quit();
     }
 
     [Test]
 
     public void testMethod()
 
     {
         String title = driver.Title;
     }
  
  }
    `;

  return beautify(code, { indent_size: 2 });

}
