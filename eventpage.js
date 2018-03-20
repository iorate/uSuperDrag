chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  chrome.storage.sync.get({
    searchUrl: 'https://www.google.com/search?q=%s'
  }, function(items) {
    var keyword = encodeURIComponent(message);
    chrome.tabs.create({url: items.searchUrl.replace('%s', keyword).replace('%S', keyword)});
  });
});
