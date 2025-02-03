(function () {
  let autoPopupEnabled = false;

  // Improved storage handling
  chrome.storage.sync.get('autoPopup', (data) => {
    autoPopupEnabled = data.autoPopup || false;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.autoPopup) {
      autoPopupEnabled = changes.autoPopup.newValue;
    }
  });

  // More robust link detection
  function findLinkElement(element) {
    while (element && element !== document.body) {
      if (element.tagName?.toLowerCase() === 'a') return element;
      element = element.parentElement;
    }
    return null;
  }

  // Better event handling for YouTube and other sites
  function handleLinkClick(e) {
    if (!autoPopupEnabled) return;

    // Ignore right-clicks (button === 2)
    if (e.button === 2) return;

    const link = findLinkElement(e.target);
    if (!link?.href) return;

    // Get the onclick attribute
    const onclickAttr = link.getAttribute('onclick') || '';
    const hasWindowOpenBlank = onclickAttr.includes('window.open') && onclickAttr.includes('_blank');

    if (
      e.ctrlKey ||
      e.metaKey ||
      e.button === 1 || // Middle-click
      link.target === '_blank' ||
      hasWindowOpenBlank
    ) {
      e.preventDefault();
      e.stopImmediatePropagation(); // Critical for intercepting default behavior

      try {
        chrome.runtime.sendMessage({ type: 'openPopup', url: link.href });
      } catch (error) {
        console.log('Extension reloaded - please refresh the page');
      }
    }
  }

  // Capture-phase listeners to intercept events early
  document.addEventListener('click', handleLinkClick, true);
  document.addEventListener('auxclick', handleLinkClick, true);
})();
