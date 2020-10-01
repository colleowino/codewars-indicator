chrome.runtime.onConnect.addListener(handlePort);

function handlePort(port) {
  port.onMessage.addListener(function (msg) {
    if (msg.fetchData) {
      fetch("http://localhost:3000/completed")
        .then((response) => response.json())
        .then((responseText) => {
          let ids = {};
          responseText.forEach((element) => {
            ids[element.link] = true;
          });
          port.postMessage({ useData: true, data: ids });
        });
    }
  });
}

// chrome.runtime.onInstalled.addListener(function () {
//   chrome.webNavigation.onCompleted.addListener(
//     function () {
//       alert("This is my favorite website!");
//     },
//     { url: [{ urlMatches: "https://www.codewars.com/" }] }
//   );
// });

var eventList = [
  // "onBeforeNavigate",
  // "onCreatedNavigationTarget",
  // "onCommitted",
  // "onCompleted",
  // "onDOMContentLoaded",
  // "onErrorOccurred",
  // "onReferenceFragmentUpdated",
  "onTabReplaced",
  "onHistoryStateUpdated",
];

// eventList.forEach(function (e) {
//   chrome.webNavigation[e].addListener(function (data) {
//     if (typeof data) console.log(chrome.i18n.getMessage("inHandler"), e, data);
//     else console.error(chrome.i18n.getMessage("inHandlerError"), e);

//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       try {
//         chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (
//           response
//         ) {
//           console.log(response.farewell);
//         });
//       } catch (error) {
//         console.log("somethings awry");
//       }
//     });
//   });
// });

// chrome.runtime.onMessage.addListener(function (url, sender, onSuccess) {
// fetch(url)
//   .then((response) => response.json())
//   .then((responseText) => {
//     let ids = {};
//     responseText.forEach((element) => {
//       ids[element.link] = true;
//     });
//     onSuccess(ids);
//   });
//   return true; // Will respond asynchronously.
// });

// chrome.tabs.query({ url: "https://www.codewars.com/*" }, function (tabArray) {
//   let Tab = tabArray[0];
//   console.log(Tab);
//   var port = chrome.tabs.connect(Tab.id, { name: "dtb" });
//   // const url = "http://localhost:3000/completed";
//   port.postMessage({ greeting: "hello", data: [1, 2, 3], dataReady: true });
//   console.log(port);
//   // fetch(url)
//   //   .then((response) => response.json())
//   //   .then((responseText) => {
//   //     let ids = {};
//   //     responseText.forEach((element) => {
//   //       ids[element.link] = true;
//   //     });
//   //   });
// });
