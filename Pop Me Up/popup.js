document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('autoPopupCheckbox');
  
  // Retrieve the current autoPopup setting from storage.
  chrome.storage.sync.get('autoPopup', (data) => {
    checkbox.checked = data.autoPopup || false;
  });
  
  // When the checkbox is toggled, update the setting in storage.
  checkbox.addEventListener('change', () => {
    chrome.storage.sync.set({ autoPopup: checkbox.checked });
  });
});
