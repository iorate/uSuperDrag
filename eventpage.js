chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.create({url: message});
});
