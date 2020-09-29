function buildIcon() {
  let img = document.createElement("img");
  img.setAttribute("src", chrome.runtime.getURL("verified-24px.svg"));
  img.setAttribute("class", "did-checkmark");
  return img;
}

function addCheckMarks(titles) {
  titles.forEach((x) => x.append(buildIcon()));
}
let existingTitles = [];

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

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
});
