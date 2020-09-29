function buildIcon() {
  let img = document.createElement("img");
  img.setAttribute("src", chrome.runtime.getURL("verified-24px.svg"));
  img.setAttribute("class", "did-checkmark");
  return img;
}
window.onload = function () {
  console.log("loaded");
  let titles = document.querySelectorAll(".item-title");
  console.log(titles.length);
  titles.forEach((x) => x.append(buildIcon()));
};
