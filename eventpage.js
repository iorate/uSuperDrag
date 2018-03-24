chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.storage.sync.get({
    searchUrl: 'https://www.google.com/search?q=%s'
  }, items => {
    const keyword = encodeURIComponent(message);
    chrome.tabs.create({url: items.searchUrl.replace('%s', keyword).replace('%S', keyword)});
  });
});
