document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get('extensionState', function (data) {
    updateButtonState(data.extensionState);
  });

  document.getElementById('enableExtension').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'enableExtension' });
  });

  document.getElementById('disableExtension').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'disableExtension' });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateButtonState') {
    updateButtonState(request.extensionState);
  }
});

function updateButtonState(extensionState) {
  document.getElementById('enableExtension').disabled = extensionState === 'enabled';
  document.getElementById('disableExtension').disabled = extensionState === 'disabled';
}
