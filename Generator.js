var mkdirp = require("mkdirp");
var ActionInfo = require('./constants/ActionInfo');

module.exports = function(generatorContext, generator) {

  // Add any SnapTest generator API methods here.
  generatorContext.onComplete = function() {
    console.log("Tests generated in " + generatorContext.topDirPath);
    console.log("SnapTest generation complete.");
  };

  generatorContext.ActionInfo = ActionInfo;

  return function() {
    if (generator.generate) {
      mkdirp.sync(generatorContext.topDirPath);
      generator.generate.apply(generatorContext);
    } else {
      throw new Error("Generator must implement a \'generate\' method.");
    }

  }

};