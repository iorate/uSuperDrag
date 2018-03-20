document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get({
    searchUrl: 'https://www.google.com/search?q=%s'
  }, function(items) {
    document.getElementById('search-url').value = items.searchUrl;
    document.getElementById('save').addEventListener('click', function() {
      chrome.storage.sync.set({
        searchUrl: document.getElementById('search-url').value
      }, function() {
        var saveStatus = document.getElementById('save-status');
        saveStatus.textContent = 'Saved!';
        setTimeout(function() {
          saveStatus.textContent = '';
        }, 1000);
      });
    });
  });
});
