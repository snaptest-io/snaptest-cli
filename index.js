#!/usr/bin/env node
var program = require('commander');
var packageInfo = require('./package.json');
var Generator = require('./Generator');
var VERSION = require('./package.json').version;

/* Official SnapTest generators: */
var generators = {
  nightwatch: require("nightwatch-generator"),
  chromeless: require("chromeless-generator"),
  csharp: require('csharp-generator')
};

program
	.version(packageInfo.version)
    .option('-f, --folder <folder>', 'The test folder to generate')
    .option('-e, --tags <tags>', 'Tags to generate (in array form)')
    .option('-t, --token <token>', 'Your SnapTest auth token')
    .option('-a, --account-type <accountType>', 'Context type - user, org, or project')
    .option('-d, --account-id <accountId>', 'Context type - \'me\' or the id')
    .option('-o, --topDirName <name>', 'The name of the top level directory')
    .option('-v, --version', 'Get the version of snaptest-cli')
    .option('-r, --framework <framework>', 'The choice of framework to generate')
    .option('-s, --style <style>', 'The style/flavor of the framework you to generate')
    .option('-i, --inputFile <inputFile>', 'Generate from a JSON test file')
    .option('-c, --pathToGen <pathToGen>', 'Path to custom generator')
    .parse(process.argv);

/* Set the active generator */
var generator;

if (program.framework) {
  generator = generators[program.framework];
  if (!generator) exitWithError("Official framework \'" + program.framework + "\' doesn't exist.");
} else if (program.pathToGen) {
  try {
    generator = require(process.cwd() + "/" + program.pathToGen);
    if (typeof generator.generate !== "function") exitWithError("Custom generator at path " + (process.cwd() + program.pathToGen) + " does not export a generate method.");
  } catch(e) {
    exitWithError("Custom generator error: " + e.toString() + e.stack);
  }
} else {
  exitWithError("Please specify an official generator with -r, or a custom generator path with -c (--help for more info).");
}

if (generator.styles && generator.styles.length > 1 && !program.style)
  exitWithError("Please select the framework style with -s.  Options:  " + generator.styles);

if (generator.styles && generator.styles.length > 1 && generator.styles.indexOf(program.style) === -1)
  exitWithError("Style " + program.style + " for framework "+ program.framework + " doesn't exist.");

if (typeof program.token === 'undefined' && typeof program.inputFile === "undefined")
  exitWithError('Please supply an auth token via -t <token> or supply a test JSON file with -i <inputFile>.');

if (typeof program.inputFile === "undefined" && (typeof program.accountType === 'undefined' || typeof program.accountId === 'undefined'))
  exitWithError('Please supply your accounts context type and context id using -ct <contexttype> and -ci <contextid>, or supply a test JSON file with -i <inputFile> .');

if (typeof program.framework === 'undefined' && typeof program.pathToGen === "undefined")
  exitWithError('no framework given.');

/* Load and prepare the test data for generation */

console.log("snaptest-cli@" + VERSION);
console.log("Generating new tests using %s.", program.framework);

var fetch = require('./pipeline/fetch');
var prep = require('./pipeline/prep');
var clean = require('./pipeline/clean');
var error = require('./pipeline/error');

fetch(program)
  .catch((error) => exitWithError("Could not obtain the content for this user. reason: " + error))
  .then((userData) => prep(userData, program))
  .then(clean)
  .then((preppedData) => Generator(preppedData, generator)())
  .catch(error);

function exitWithError(error) {
  console.error(error);
  process.exit(1);
}
