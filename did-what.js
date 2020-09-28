window.onload = function () {
  let titles = document.querySelectorAll(".item-title");
  let first = titles[0];
  let img = document.createElement("img");
  img.setAttribute("src", chrome.runtime.getURL("verified-24px.svg"));
  img.setAttribute("class", "did-checkmark");
  first.append(img);
};
