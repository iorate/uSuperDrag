chrome.storage.sync.get({
  searchUrl: 'https://www.google.com/search?q=%s'
}, items => {
  document.querySelectorAll('[data-translate]').forEach((element, index, elements) => {
    element.textContent = chrome.i18n.getMessage(element.dataset.translate);
  });
  document.getElementById('search-url').value = items.searchUrl;
  document.getElementById('save').addEventListener('click', () => {
    chrome.storage.sync.set({
      searchUrl: document.getElementById('search-url').value
    }, () => {
      const saveStatus = document.getElementById('save-status');
      saveStatus.style = 'display:inline';
      setTimeout(() => {
        saveStatus.style = 'display:none';
      }, 1000);
    });
  });
});
