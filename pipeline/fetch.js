var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var API =  'https://api.prolificdevs.com/api/snaptest/1';

module.exports = (program) => {
  if (program.inputFile) {
    console.log("Loading test JSON file from %s.", process.cwd() + "/" + program.inputFile);
    return new Promise((resolve, reject) => {
      try {
        var testData = require(process.cwd() + "/" + program.inputFile);
        testData.directory = testData.directory.tree;
        return resolve(testData);
      } catch(e) {
        return reject(e);
      }
    });
  } else {
    return request.getAsync({
      url: API + "/" + program.accountType + '/' + program.accountId + '/multiload',
      headers: { 'apikey': program.token },
      "rejectUnauthorized": false,
    }).then((response) => {
      var rawData = JSON.parse(response.body);
      if (rawData.error) throw new Error(rawData.error);
      rawData.directory = rawData.directory.tree;
      return rawData;
    });
  }
}
