/**
 * nodelists do not have a forEach method
 */
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, array[i], i);
  }
};

var editPlaceholder = document.createElement('span');
editPlaceholder.className = 'i4-edit-asterisk';
editPlaceholder.innerHTML = '';

var editToolbar = document.createElement('span');
editToolbar.className = 'i4-edit-toolbar';
editToolbar.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i> <i class="fa fa-bars" aria-hidden="true"></i> <i class="fa fa-trash-o" aria-hidden="true"></i> <i class="fa fa-close" aria-hidden="true"></i>';
editToolbar.onclick = function() {
    this.style.display = 'none';
}

var editOverlay = document.createElement('span');
editOverlay.className = 'i4-edit-overlay';
editOverlay.innerHTML = '';

forEach(document.querySelectorAll('.i4-edit'), function(element) {
    // element.style.backgroundColor = 'orange';
    asterisk = editPlaceholder.cloneNode(true);
    asterisk.style.height = element.offsetHeight+'px';
    asterisk.onclick = function(e) { // events cannot be cloned
        editToolbar.style.display = 'block';
        editToolbar.style.left = this.style.left;
        this.parentNode.insertBefore(editToolbar, this);
        editToolbar.style.top = (e.layerY - (editToolbar.offsetHeight / 2)) +'px'; // first insert it, then read the offsetWeight
        editOverlay.style.display = 'none';
    }
    asterisk.onmouseover = function(e) { // events cannot be cloned
        editOverlay.style.width = this.parentNode.offsetWidth+'px';
        editOverlay.style.height = this.parentNode.offsetHeight+'px';
        editOverlay.style.display = 'block';
        this.parentNode.insertBefore(editOverlay, this);
    }
    asterisk.onmouseout = function(e) { // events cannot be cloned
        editOverlay.style.display = 'none';
    }
    element.insertBefore(asterisk, element.firstChild);
});


