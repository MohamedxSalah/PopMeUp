chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "openLinkPopup",
    title: "Pop Me Up",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "openLinkPopup") {
    const linkUrl = info.linkUrl;
    chrome.tabs.sendMessage(tab.id, { action: "openPopup", linkUrl });
  }
});
