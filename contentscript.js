chrome.storage.sync.get({
  enableTextSearch: true,
  searchUrl: 'https://www.google.com/search?q=%s',
  enableLinkOpen: true,
  enableLinkTextSelect: false
}, items => {
  if (items.enableTextSearch || items.enableLinkOpen) {
    document.addEventListener('dragover', e => {
      if (e.dataTransfer.types.includes('text/uri-list')) {
        if (items.enableLinkOpen) {
          e.dataTransfer.dropEffect = 'link';
          e.preventDefault();
        }
      } else if (e.dataTransfer.types.includes('text/plain')) {
        if (items.enableTextSearch &&
            e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') {
          e.dataTransfer.dropEffect = 'link';
          e.preventDefault();
        }
      }
    }, false);
    document.addEventListener('drop', e => {
      if (e.dataTransfer.types.includes('text/uri-list')) {
        if (items.enableLinkOpen) {
          chrome.runtime.sendMessage(e.dataTransfer.getData('URL'));
          e.preventDefault();
        }
      } else if (e.dataTransfer.types.includes('text/plain')) {
        if (items.enableTextSearch &&
            e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') {
          const keyword = encodeURIComponent(e.dataTransfer.getData('text/plain'));
          chrome.runtime.sendMessage(items.searchUrl.replace(/%s/gi, keyword));
          e.preventDefault();
        }
      }
    }, false);
  }
  if (items.enableLinkTextSelect) {
    // https://gist.github.com/Griever/5005165
    // The original code is copyrighted by Griever and licensed under MIT license.
    function LinkDragSelection() {
      this.init.apply(this, arguments);
    }
    LinkDragSelection.prototype = {
      moved_flag: false,
      init: function(event) {
        this.range = document.caretRangeFromPoint(event.pageX - scrollX, event.pageY - scrollY);
        var sel = getSelection();
        if (!sel.isCollapsed && sel.getRangeAt(0).isPointInRange(this.range.startContainer, this.range.startOffset)) {
          return;
        }
        this.screenX = event.screenX;
        this.screenY = event.screenY;
        addEventListener("mousemove", this, false);
        addEventListener("mouseup", this, false);
      },
      uninit: function() {
        removeEventListener("mousemove", this, false);
        removeEventListener("mouseup", this, false);
        removeEventListener("dragstart", this, false);
        setTimeout(function() {
          removeEventListener("click", this, false);
        }.bind(this), 100);
      },
      handleEvent: function(event) {
        switch(event.type) {
          case "mousemove":
            if (this.moved_flag) {
              var range = document.caretRangeFromPoint(event.pageX - scrollX, event.pageY - scrollY);
              if (range) {
                getSelection().extend(range.startContainer, range.startOffset);
              }
            } else {
              this.moveX = event.screenX;
              this.moveY = event.screenY;
              this.checkXY();
            }
            break;
          case "mouseup":
            this.uninit();
            break;
          case "dragstart":
            event.currentTarget.removeEventListener(event.type, this, false);
            if (this.moved_flag) {
              event.preventDefault();
              event.stopPropagation();
            } else {
              this.checkXY();
            }
            break;
          case "click":
            event.currentTarget.removeEventListener(event.type, this, false);
            if (!getSelection().isCollapsed) {
              event.preventDefault();
              event.stopPropagation();
            }
            break;
        }
      },
      selectionStart: function() {
        this.moved_flag = true;
        getSelection().collapse(this.range.startContainer, this.range.startOffset);
        addEventListener("dragstart", this, false);
        addEventListener("click", this, false);
      },
      checkXY: function() {
        var x = Math.abs(this.screenX - this.moveX);
        var y = Math.abs(this.screenY - this.moveY);
        if (x >= 4 && x > y) {
          this.selectionStart();
        } else if (y >= 4) {
          this.uninit();
        }
      },
    };
    addEventListener("mousedown", function(event) {
      if (event.button != 0 || event.altKey) {
        return;
      }
      if (!event.target.webkitMatchesSelector('a[href], a[href] *')) {
        return;
      }
      new LinkDragSelection(event);
    }, false);
  }
});
