// chrome.runtime.onInstalled.addListener(function () {
//   chrome.webNavigation.onCompleted.addListener(
//     function () {
//       alert("This is my favorite website!");
//     },
//     { url: [{ urlMatches: "https://www.codewars.com/" }] }
//   );
// });

console.log("its happening");
var eventList = [
  "onBeforeNavigate",
  "onCreatedNavigationTarget",
  "onCommitted",
  "onCompleted",
  "onDOMContentLoaded",
  "onErrorOccurred",
  "onReferenceFragmentUpdated",
  "onTabReplaced",
  "onHistoryStateUpdated",
];

eventList.forEach(function (e) {
  chrome.webNavigation[e].addListener(function (data) {
    if (typeof data) console.log(chrome.i18n.getMessage("inHandler"), e, data);
    else console.error(chrome.i18n.getMessage("inHandlerError"), e);
  });
});
