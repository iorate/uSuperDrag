chrome.storage.sync.get({
  enableTextSearch: true,
  searchUrl: 'https://www.google.com/search?q=%s',
  enableLinkOpen: true,
  enableLinkTextSelect: false
}, items => {
  for (let element of document.querySelectorAll('[data-translate]')) {
    element.textContent = chrome.i18n.getMessage(element.dataset.translate);
  }

  const enableTextSearch = document.getElementById('enable-text-search');
  const searchUrl = document.getElementById('search-url');
  const enableLinkOpen = document.getElementById('enable-link-open');
  const enableLinkTextSelect = document.getElementById('enable-link-text-select');
  const save = document.getElementById('save');
  const saveStatus = document.getElementById('save-status');

  enableTextSearch.checked = items.enableTextSearch;
  searchUrl.value = items.searchUrl;
  enableLinkOpen.checked = items.enableLinkOpen;
  enableLinkTextSelect.checked = items.enableLinkTextSelect;

  searchUrl.disabled = !enableTextSearch.checked;
  enableTextSearch.addEventListener('change', () => {
    searchUrl.disabled = !enableTextSearch.checked;
  }, false);

  save.addEventListener('click', () => {
    chrome.storage.sync.set({
      enableTextSearch: enableTextSearch.checked,
      searchUrl: searchUrl.value,
      enableLinkOpen: enableLinkOpen.checked,
      enableLinkTextSelect: enableLinkTextSelect.checked
    }, () => {
      saveStatus.style = 'display:inline';
      setTimeout(() => {
        saveStatus.style = 'display:none';
      }, 1000);
    });
  }, false);
});
