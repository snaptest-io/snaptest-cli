// var flatGenerator = require('./flat');

function generate() {

  this.generateFolders();

  this.forEachFolder();

  this.forEachTest();

}

module.exports = {
  generate: generate,
  styles: ["flat"]  // declare the styles if there are more than one.
};