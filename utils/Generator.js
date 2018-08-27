var mkdirp = require("mkdirp");

module.exports = function(testData, generator) {

  // Add any SnapTest generator API methods here.
  testData.onComplete = function() {
    console.log("Tests generated in " + testData.topDirPath);
    console.log("SnapTest generation complete.");
  };

  return function() {
    if (generator.generate) {
      mkdirp.sync(testData.topDirPath);
      generator.generate.apply(testData);
    } else {
      throw new Error("Generator must implement a \'generate\' method.");
    }

  }

};