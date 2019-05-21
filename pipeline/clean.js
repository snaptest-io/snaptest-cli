var rimraf = require('rimraf');

module.exports = (userData) => {
  return new Promise((resolve, reject) => {

    console.log("Removing previous tests.");

    rimraf(userData.topDirPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(userData);
      }
    });
  });
}