document.addEventListener('DOMContentLoaded', () => {
  const autoPopupCheckbox = document.getElementById('autoPopupCheckbox');
  const middleClickPopupCheckbox = document.getElementById('middleClickPopupCheckbox');
  
  // Retrieve the current settings from storage.
  chrome.storage.sync.get(['autoPopup', 'middleClickPopup'], (data) => {
    autoPopupCheckbox.checked = data.autoPopup || false;
    middleClickPopupCheckbox.checked = data.middleClickPopup || false;
  });
  
  // When the autoPopup checkbox is toggled, update the setting in storage.
  autoPopupCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ autoPopup: autoPopupCheckbox.checked });
  });
  
  // When the middleClickPopup checkbox is toggled, update the setting in storage.
  middleClickPopupCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ middleClickPopup: middleClickPopupCheckbox.checked });
  });
});