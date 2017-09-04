var flatGenerator = require('./flat');

function generate() {

  // when there are more styles, do the switching here:
  flatGenerator.call(this);

}

module.exports = {
	generate: generate,
	styles: ["flat"]
};