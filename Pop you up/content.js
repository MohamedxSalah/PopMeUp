let extensionEnabled = false;

chrome.storage.sync.get('extensionState', function (data) {
  extensionEnabled = data.extensionState === 'enabled';
  toggleExtensionState();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleExtension') {
    extensionEnabled = !extensionEnabled;
    toggleExtensionState();
  } else {
    console.error('Unknown action in content.js:', request.action);
  }
});

// Listen for changes in extension state
chrome.storage.onChanged.addListener(function (changes) {
  if (changes.extensionState) {
    extensionEnabled = changes.extensionState.newValue === 'enabled';
    toggleExtensionState();
  }
});

document.addEventListener('click', function (event) {
  const target = event.target;

  if (extensionEnabled) {
    handleLinkClick(target);
  }
});

function toggleExtensionState() {
  // Update the extension state directly without sending a message to the background script
  chrome.storage.sync.set({ extensionState: extensionEnabled ? 'enabled' : 'disabled' });
}

function handleLinkClick(target) {
  // Check if the target or its parent is a link
  const link = findParentLink(target);

  if (link && link.rel && link.rel.includes('noopener')) {
    event.preventDefault();
    window.open(link.href, '_blank', 'width=600,height=400');
  }
}

function findParentLink(element) {
  // Traverse up the DOM to find the nearest parent link
  while (element && element.tagName !== 'A') {
    element = element.parentNode;
  }

  return element;
}
