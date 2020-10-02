chrome.runtime.onConnect.addListener(handlePort);

function handlePort(port) {
  port.onMessage.addListener(function (msg) {
    if (msg.fetchData) {
      fetch("http://localhost:3000/completed")
        .then((response) => response.json())
        .then((responseText) => {
          let ids = {};
          let totalIds = 0;
          responseText.forEach((element) => {
            ids[element.id] = true;
            totalIds += 1;
          });
          // console.log(totalIds);
          port.postMessage({ dataAvailable: true, data: ids });
        })
        .catch((error) => {
          console.log("error");
          port.postMessage({ errorOccured: true, error });
        });
    }
    if (msg.updateData) {
      fetch("http://localhost:3000/completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg.payload),
      })
        .then((responseText) => {
          console.log("updated the list");
          port.postMessage({ dataUpdated: true, responseText });
        })
        .catch((error) => {
          console.log("error");
          port.postMessage({ errorOccured: true, error });
        });
    }
  });
}
