const Actions = require('./ActionConsts');

var actionDefs = [
  { name: "...", value: "", isDefault: true },
  { name: "Click element", value: Actions.MOUSEDOWN},
  { name: "Press key...", value: Actions.KEYDOWN},
  { name: "Change input to...", value: Actions.INPUT},
  { name: "Form submit", value: Actions.SUBMIT},
  { name: "Mouse over", value: Actions.MOUSEOVER},
  { name: "Focus", value: Actions.FOCUS},
  { name: "Blur", value: Actions.BLUR},
  { name: "Pause", value: Actions.PAUSE },
  { name: "Execute script", value: Actions.EXECUTE_SCRIPT },
  { name: "Drag and drop", value: "", disabled: true},
  { name: "Scroll window to...", value: Actions.SCROLL_WINDOW},
  { name: "Scroll window to el", value: Actions.SCROLL_WINDOW_ELEMENT},
  { name: "Scroll element to...", value: Actions.SCROLL_ELEMENT},
  { name: "El text is...", value: Actions.TEXT_ASSERT},
  { name: "Path is...", value: Actions.PATH_ASSERT},
  { name: "El text matches regex...", value: Actions.TEXT_REGEX_ASSERT},
  { name: "Input value is...", value: Actions.VALUE_ASSERT},
  { name: "El is present", value: Actions.EL_PRESENT_ASSERT},
  { name: "El is not present", value: Actions.EL_NOT_PRESENT_ASSERT},
  { name: "El style is...", value: Actions.STYLE_ASSERT},
  { name: "Load page...", value: Actions.FULL_PAGELOAD},
  { name: "Back", value: Actions.BACK},
  { name: "Forward", value: Actions.FORWARD},
  { name: "Refresh", value: Actions.REFRESH},
  { name: "Init page...", value: Actions.PAGELOAD},
  { name: "Focus on window", value: Actions.CHANGE_WINDOW},
  { name: "Component", value: Actions.COMPONENT },
  { name: "url change indicator", value: Actions.URL_CHANGE_INDICATOR },
  { name: "Take screenshot", value: Actions.SCREENSHOT},
  { name: "SEO meta scan", value: Actions.META_SCAN}
];

module.exports = actionDefs;
