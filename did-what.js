function buildIcon() {
  let img = document.createElement("img");
  img.setAttribute("src", chrome.runtime.getURL("verified-24px.svg"));
  img.setAttribute("class", "did-checkmark");
  return img;
}

function snagLink(url) {
  const bits = url.split("/");
  return bits[bits.length - 1];
}

function extractMeta(node) {
  return {
    kyu: node.querySelector("span").innerText,
    label: node.querySelector("a").innerText,
    id: snagLink(node.querySelector("a").href),
  };
}

function addCheckMarks(titles) {
  titles.forEach((x) => {
    x.append(buildIcon());
  });
}

function setupObserver() {
  const config = { attributes: false, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    console.log("-- status updated -- ");
    observer.disconnect();
    processList();
    observer.observe(document.querySelector(".items-list"), config);
  };

  let taskLists = document.querySelector(".items-list");
  const observer = new MutationObserver(callback);
  observer.observe(taskLists, config);
}

const pages = {
  KATA: "kata",
  USER: "user",
  KATALIST: "katalist",
  MINE: "myown",
};

function whichPage() {
  const url = window.location.href;
  if (/colleowino\/completed$/.test(window.location.href)) {
    return pages.MINE;
  }
  if (/completed$/.test(window.location.href)) {
    return pages.USER;
  }
  if (/kata\/latest|search/.test(window.location.href)) {
    return pages.KATALIST;
  }
  if (/kata\/\w+$/.test(window.location.href)) {
    return pages.KATA;
  }
}

function processList(solved = {}, page = pages.MINE) {
  let newTitles = document.querySelectorAll(".item-title");
  let chosen = [];
  let toUpdate = [];
  newTitles.forEach((x) => {
    let meta = extractMeta(x);
    const svg = buildIcon();
    if (!x.lastChild.isEqualNode(svg)) {
      if (solved[meta.id]) {
        chosen.push(x);
      } else {
        if (page == pages.MINE) {
          console.log("some updating to be done");
          toUpdate.push(meta);
        }
      }
    }
  });
  addCheckMarks(chosen);
  return toUpdate;
}

let currentPage = whichPage();

function dataProcessFunction(params) {
  // console.log(params);
  if (currentPage == pages.KATA) {
    return processList(params, currentPage);
  }
  if (currentPage == pages.KATALIST) {
    return processList(params, currentPage);
  }
  if (currentPage == pages.USER) {
    return processList(params, currentPage);
  }
  if (currentPage == pages.MINE) {
    const unrecorded = processList(params, currentPage);
    setupObserver();
    return unrecorded;
  }
}

console.log("Debug: executing content script");
const port = chrome.runtime.connect({ name: "knockknock" });

port.postMessage({ fetchData: true });

port.onMessage.addListener(function (msg) {
  if (msg.useData) {
    console.log(msg.data);
    toUpdate = dataProcessFunction(msg.data);
    console.log(toUpdate);
    port.postMessage({ updateData: true, payload: toUpdate });
  }

  if (msg.dataUpdated) {
    console.log(msg.responseText);
  }
});

console.log("Debug: End of script");
