const port = chrome.runtime.connect({ name: "serverConnection" });

const pages = {
  KATA: "kata",
  USER: "user",
  KATALIST: "katalist",
  MINE: "myown",
};

function identifyPage() {
  const page = window.location.href;
  if (/colleowino\/completed$/.test(page)) {
    return pages.MINE;
  }
  if (/completed$/.test(page)) {
    return pages.USER;
  }
  if (/kata\/latest|search/.test(page)) {
    return pages.KATALIST;
  }
  if (/kata\/\w+$/.test(page)) {
    return pages.KATA;
  }
}

let currentPage = identifyPage();

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

function extractKata(node) {
  return {
    kyu: node.querySelector("span").innerText,
    label: node.querySelector("a").innerText,
    id: snagLink(node.querySelector("a").href),
  };
}

let ids = {
  "563a631f7cbbc236cf0000c2": true,
  "55ccdf1512938ce3ac000056": true,
  "540c33513b6532cd58000259": true,
};

function markCompletedKatas(completedKatas) {
  let kataTitles = document.querySelectorAll(".item-title");
  const svg = buildIcon();

  kataTitles.forEach((title) => {
    const metaData = extractKata(title);
    if (completedKatas[metaData.id] && !title.lastChild.isEqualNode(svg)) {
      title.append(buildIcon());
    }
  });
}

function collectUnsavedKatas(completedKatas) {
  let kataTitles = document.querySelectorAll(".item-title");
  let unsavedKatas = [];

  kataTitles.forEach((title) => {
    const kata = extractKata(title);
    if (!completedKatas[kata.id]) {
      completedKatas[kata.id] = true;
      unsavedKatas.push(kata);
    }
  });
  if (unsavedKatas.length > 0) {
    port.postMessage({ updateData: true, payload: unsavedKatas });
  }
  return true;
}

let observer = null;

function setupDOMObserver() {
  const config = { attributes: false, childList: true, subtree: true };

  observer = new MutationObserver((mutations) => {
    observer.disconnect();
    markCompletedKatas(ids);
    if (currentPage == pages.MINE) {
      collectUnsavedKatas(ids);
    }

    observer.observe(document.querySelector(".items-list"), config);
  });
  observer.observe(document.querySelector(".items-list"), config);
}

console.log("Debug: executing content script");

function scrollToBottom() {
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

port.onMessage.addListener(function (resp) {
  if (resp.dataAvailable) {
    ids = resp.data;
    markCompletedKatas(ids);

    if (currentPage == pages.MINE || currentPage == pages.USER) {
      collectUnsavedKatas(ids);
      setupDOMObserver();
    }
  }

  if (resp.dataUpdated) {
    markCompletedKatas(ids);
  }
});

port.postMessage({ fetchData: true });

console.log("Debug: End of script");
