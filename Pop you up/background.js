let extensionEnabled = false;

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('extensionState', function (data) {
    extensionEnabled = data.extensionState === 'enabled';
    toggleExtensionState();
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'enableExtension') {
    extensionEnabled = true;
    toggleExtensionState();
    notifyPopup();
  } else if (request.action === 'disableExtension') {
    extensionEnabled = false;
    toggleExtensionState();
    notifyPopup();
  } else if (request.action === 'getExtensionState') {
    sendResponse({ extensionState: extensionEnabled ? 'enabled' : 'disabled' });
  }
});

function toggleExtensionState() {
  chrome.storage.sync.set({ extensionState: extensionEnabled ? 'enabled' : 'disabled' });
}

function notifyPopup() {
  chrome.runtime.sendMessage({ action: 'updateButtonState', extensionState: extensionEnabled ? 'enabled' : 'disabled' });
}
