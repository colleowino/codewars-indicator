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
    console.log(extractMeta(x));
    x.append(buildIcon());
  });
}
let existingTitles = [];

function snagLink(url) {
  const bits = url.split("/");
  return bits[bits.length - 1];
}

function processList() {
  let newTitles = document.querySelectorAll(".item-title");
  let chosen = [];
  newTitles.forEach((x) => {
    const svg = buildIcon();
    if (!x.lastChild.isEqualNode(svg)) {
      chosen.push(x);
    }
  });
  addCheckMarks(chosen);
}

const config = { attributes: false, childList: true, subtree: true };

const callback = function (mutationsList, observer) {
  observer.disconnect();
  processList();
  observer.observe(document.querySelector(".items-list"), config);
};

let taskLists = document.querySelector(".items-list");
const observer = new MutationObserver(callback);
observer.observe(taskLists, config);

// window.addEventListener("load", (event) => {
//   console.log("page is fully loaded");
// });

const pages = {
  KATA: "kata",
  USER: "user",
  KATALIST: "katalist",
};

function whichPage() {
  const url = window.location.href;
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

let currentPage = whichPage();
console.log(currentPage);
if (currentPage == pages.KATA) {
  processList();
}
if (currentPage == pages.KATALIST) {
  processList();
}
if (currentPage == pages.USER) {
  processList();
}
