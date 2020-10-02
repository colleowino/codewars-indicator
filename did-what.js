const port = chrome.runtime.connect({ name: "serverConnection" });

let GLOBAL_KATA_IDS = {
  "563a631f7cbbc236cf0000c2": true,
};

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
  if (currentPage != pages.MINE) {
    return true;
  }
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
    markCompletedKatas(GLOBAL_KATA_IDS);
    collectUnsavedKatas(GLOBAL_KATA_IDS);
    observer.observe(document.querySelector(".items-list"), config);
  });
  // scrollToBottom();
  observer.observe(document.querySelector(".items-list"), config);
}

function scrollToBottom() {
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

port.onMessage.addListener(function (resp) {
  if (resp.dataAvailable) {
    GLOBAL_KATA_IDS = resp.data;
    markCompletedKatas(GLOBAL_KATA_IDS);

    if (currentPage != pages.KATA) {
      console.log("some kata list is here");
      setupDOMObserver();
    }

    if (currentPage == pages.KATA) {
      let kataHeading = document.querySelector("h4").parentElement;
      let link = window.location.href.split("/");
      let kataId = link[link.length - 1];
      if (GLOBAL_KATA_IDS[kataId]) {
        kataHeading.append(buildIcon());
      }
    }
  }

  if (resp.dataUpdated) {
    markCompletedKatas(GLOBAL_KATA_IDS);
  }

  if (resp.errorOccured) {
    console.log("Network Missing");
  }
});

port.postMessage({ fetchData: true });
