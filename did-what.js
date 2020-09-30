function buildIcon() {
  let img = document.createElement("img");
  img.setAttribute("src", chrome.runtime.getURL("verified-24px.svg"));
  img.setAttribute("class", "did-checkmark");
  return img;
}

function extractMeta(node) {
  return {
    kyu: node.querySelector("span").innerText,
    label: node.querySelector("a").innerText,
    link: snagLink(node.querySelector("a").href),
  };
}

function addCheckMarks(titles) {
  titles.forEach((x) => {
    x.append(buildIcon());
  });
}
let existingTitles = [];

function snagLink(url) {
  const bits = url.split("/");
  return bits[bits.length - 1];
}

function setupObserver() {
  const config = { attributes: false, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
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

function processList(solved, page) {
  let newTitles = document.querySelectorAll(".item-title");
  let chosen = [];
  let toUpdate = [];
  newTitles.forEach((x) => {
    let meta = extractMeta(x);
    const svg = buildIcon();
    if (!x.lastChild.isEqualNode(svg)) {
      if (solved[meta.link]) {
        chosen.push(x);
      } else {
        if (page == pages.MINE) {
          toUpdate.push(meta);
        }
      }
    }
  });
  updateSolved(toUpdate);
  addCheckMarks(chosen);
}

function updateComplete(status) {
  console.log(statu);
}

function updateSolved(payload) {
  console.log(payload);
  // chrome.runtime.sendMessage(payload, (data) => updateComplete(data));
}

let currentPage = whichPage();

function dataProcessFunction(params) {
  // console.log(params);
  if (currentPage == pages.KATA) {
    processList(params, currentPage);
  }
  if (currentPage == pages.KATALIST) {
    processList(params, currentPage);
  }
  if (currentPage == pages.USER) {
    processList(params, currentPage);
  }
  if (currentPage == pages.MINE) {
    processList(params, currentPage);
  }
}

chrome.runtime.sendMessage("http://localhost:3000/completed", (data) =>
  dataProcessFunction(data)
);
