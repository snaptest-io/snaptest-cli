var flatGenerator = require('./flat');

function generate(testData) {

  // when there are more styles, do the switching here:
  flatGenerator(testData);

}

module.exports = {
	generate: generate,
	styles: ["flat"]
};