var _ = require('lodash');
var Actions = require('./ActionConsts');
var URL = require('url-parse');
var actionDefs = require('./ActionDefs');
var sanitizeForFilename = require("sanitize-filename");

module.exports.getDefaultLaunchUrlInfo = function (actions) {

  var launchUrl;
  var path;

  actions.forEach((action, idx) => {
    if (idx === 0 || idx == 1) {
      if (action.type === Actions.FULL_PAGELOAD || action.type === Actions.PAGELOAD) {
        var url = new URL(action.value);
        launchUrl = url.origin;
        path = action.value.replace(url.origin, "");
      }
    }
  });

  return {
    launchUrl,
    path
  };
};

module.exports.getValueParamsForComponent = function (action, component) {

  var params = [];

  component.variables.forEach((variable) => {

    var variableInAction = _.find(action.variables, {id: variable.id});

    if (variableInAction) {
      params.push("\`" + variableInAction.value + "\`");
    } else {
      params.push("\`" + variable.defaultValue + "\`");
    }

  });

  return params;

};

module.exports.getKeyParamsForComponent = function(component) {

  var params = [];

  component.variables.forEach((variable) => {
    params.push(variable.name);
  });

  return params;

}

module.exports.buildParamStringFromArray = function (params) {
  var paramString = "";

  params.forEach((param, idx) => {
    if (idx !== params.length - 1) {
      paramString += param + ", "
    } else {
      paramString += param;
    }
  });

  return paramString;

};

module.exports.getNWKeyValueFromCode = function (keyCode) {
  switch(keyCode) {
    case "Enter":
      return "browser.Keys.ENTER";
    case "Escape":
      return "browser.Keys.ESCAPE";
    default:
      return "unknown";
  }
};

module.exports.buildActionDescription = function(action) {

  var actionDescription = _.find(actionDefs, {value: action.type});
  var description;

  if (actionDescription) {
    description = actionDescription.name;
  } else {
    description = action.type;
  }

  if (_.isString(action.value)) {
    description += ` "${action.value}"`;
  }

  return description;
};

module.exports.buildTestClassName = function(name) {
  return sanitizeForFilename(name).replace(/\W|_/g, "");
};

module.exports.sanitizeForMethodName = function(name) {
  return sanitizeForFilename(name).replace(/\W|_/g, "");
};