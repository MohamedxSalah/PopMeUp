(function () {
  let autoPopupEnabled = false;
  let middleClickPopupEnabled = false;

  // Improved storage handling
  chrome.storage.sync.get(['autoPopup', 'middleClickPopup'], (data) => {
    autoPopupEnabled = data.autoPopup || false;
    middleClickPopupEnabled = data.middleClickPopup || false;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.autoPopup) {
        autoPopupEnabled = changes.autoPopup.newValue;
      }
      if (changes.middleClickPopup) {
        middleClickPopupEnabled = changes.middleClickPopup.newValue;
      }
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

  // Handle link clicks
  function handleLinkClick(e) {
    // Ignore right-clicks (button === 2)
    if (e.button === 2) return;

    const link = findLinkElement(e.target);
    if (!link?.href) return;

    // Get the onclick attribute
    const onclickAttr = link.getAttribute('onclick') || '';
    const hasWindowOpenBlank = onclickAttr.includes('window.open') && onclickAttr.includes('_blank');

    const isSpecialClick = e.ctrlKey || e.metaKey || link.target === '_blank' || hasWindowOpenBlank;

    const isLeftClick = e.button === 0;
    const isMiddleClick = e.button === 1;

    // Determine whether to intercept the click
    if (
      (autoPopupEnabled && isSpecialClick && isLeftClick) || // Intercept left-clicks when autoPopup is enabled and it's a special click
      (middleClickPopupEnabled && isMiddleClick)             // Intercept middle-clicks when middleClickPopup is enabled
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
