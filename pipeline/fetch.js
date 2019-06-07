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

    var promises = [];

    promises.push(request.getAsync({
      url: API + "/" + program.accountType + '/' + program.accountId + '/multiload',
      headers: { 'apikey': program.token },
      "rejectUnauthorized": false,
    }));

    promises.push(request.getAsync({
      url: API + "/" + program.accountType + '/' + program.accountId + '/run',
      headers: { 'apikey': program.token }
    }));

    return Promise.all(promises).then((response) => {

      var multiLoadResponse = response[0];
      var runsResponse = response[1];

      if (multiLoadResponse.statusCode === 404 || runsResponse.statusCode === 404) {
        throw new Error("Couldn't load data: Access denied.");
      }

      if (multiLoadResponse.statusCode !== 200 || runsResponse.statusCode !== 200) {
        throw new Error("Couldn't load data: System temporarily unavailable.");
      }

      try {
        var multiLoadBody = JSON.parse(response[0].body);
        var runsBody = JSON.parse(response[1].body);
      } catch(e) {
        throw new Error("Couldn't load data: Error parsing JSON. Details: " + e.toString());
      }

      if (multiLoadBody.error || runsBody.error) {
        throw new Error(multiLoadBody.error || runsBody.error);
      }

      var rawData = multiLoadBody;
      rawData.runs = runsBody.runs.items;

      rawData.directory = rawData.directory.tree;
      return rawData;

    });
  }
}
