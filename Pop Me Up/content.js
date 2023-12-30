chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openPopup") {
    const linkUrl = request.linkUrl;
    const popupWindow = window.open(linkUrl, "_blank", "width=600,height=400");
    if (!popupWindow) {
      alert("Popup blocked. Please allow popups for this site.");
    }
  }
});
