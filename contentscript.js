document.addEventListener('dragover', e => {
  if (e.dataTransfer.types.includes('text/plain') &&
     !e.dataTransfer.types.includes('text/uri-list') &&
      e.target.tagName != 'INPUT' &&
      e.target.tagName != 'TEXTAREA') {
    e.dataTransfer.dropEffect = 'link';
    e.preventDefault();
  }
}, false);
document.addEventListener('drop', e => {
  if (e.target.tagName != 'INPUT' &&
      e.target.tagName != 'TEXTAREA') {
    chrome.runtime.sendMessage(e.dataTransfer.getData('text/plain'));
    e.preventDefault();
  }
}, false);
