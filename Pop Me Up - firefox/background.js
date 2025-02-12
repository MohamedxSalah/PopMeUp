// When the extension is installed, set up defaults and create the context menu.
chrome.runtime.onInstalled.addListener(() => {
  // Set default autoPopup setting to false if not already set.
  chrome.storage.sync.get(['autoPopup'], (result) => {
    if (result.autoPopup === undefined) {
      chrome.storage.sync.set({ autoPopup: false });
    }
  });

  // Create a context menu item for links.
  chrome.contextMenus.create({
    id: "openInPopup",
    title: "Open link in popup",
    contexts: ["link"]
  });
});

// Handle clicks on the context menu item.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openInPopup") {
    openLinkInPopup(info.linkUrl);
  }
});

// Listen for messages from content script (or popup if you expand functionality).
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "openPopup" && message.url) {
    openLinkInPopup(message.url);
  }
});

// Function to open a link in a new popup window.
function openLinkInPopup(url) {
  chrome.windows.create({
    url: url,
    type: "popup",
    width: 800,
    height: 600
  });
}
