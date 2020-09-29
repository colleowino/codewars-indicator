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
  console.log(chosen.length);
  addCheckMarks(chosen);
}

let taskLists = document.querySelector(".items-list");
const config = { attributes: false, childList: true, subtree: true };

const callback = function (mutationsList, observer) {
  console.log("change detected");
  observer.disconnect();
  processList();
  observer.observe(taskLists, config);
};

const observer = new MutationObserver(callback);
observer.observe(taskLists, config);
