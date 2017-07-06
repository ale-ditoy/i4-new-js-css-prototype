/**
 * TODO:
 * - ensure that only one frame can be edited at a time
 * - retain the image plugin for medium-editor
 *
 * possible in place text editors:
 * - https://yabwe.github.io/medium-editor/ (the current one)
 *   - https://stackoverflow.com/questions/38297277/how-can-i-add-a-class-to-current-active-paragraph-in-medium-editor?rq=1 (for tweaking medium editor)
 *   - https://stackoverflow.com/questions/36481065/medium-editor-insert-button-lighter-example-then-the-plugins-out-there
 * - http://jakiestfu.github.io/Medium.js/docs/
 * - https://github.com/jessegreathouse/TinyEditor (old and unmaintained)
 * - http://wysiwygjs.github.io/
 * - http://summernote.org/getting-started/
 * - https://quilljs.com/docs/formats/
 * - https://github.com/neilj/Squire
 * - https://github.com/guardian/scribe
 *
 * eventually add and use this polifill: https://github.com/WebReflection/dom4
 * - document.querySelector("p").closest(".near.ancestor")
 */

/**
 * nodelists do not have a forEach method
 */
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, array[i], i);
  }
};

/**
 * return the first ancestor with the className or null if none found
 */
var getAncestorByClassName = function(element, className) {
    while ((element = element.parentNode) && ((typeof element.classList == 'undefined') || !element.classList.contains(className)));
    return element;
}

var EditPlaceholder = function(height) {
    this.DOM = document.createElement('span');
    this.DOM.className = 'i4-edit-asterisk';
    this.DOM.innerHTML = '';

    this.resize = function(height) {
        this.DOM.style.height = height;
    }.bind(this);

    this.DOM.onclick = function(e) {
        this.DOM.parentNode.insertBefore(editToolbar.DOM, this.DOM);
        editToolbar.show();
        // first insert the toolbar, then read the offsetWeight
        editToolbar.move((this.DOM.style.left, e.layerY - (editToolbar.DOM.offsetHeight / 2)) +'px');
        editOverlay.hide()
    }.bind(this);

    this.DOM.onmouseover = function(e) {
        editOverlay.resize(this.DOM.parentNode.offsetWidth+'px', this.DOM.parentNode.offsetHeight+'px');
        editOverlay.show();
        this.DOM.parentNode.insertBefore(editOverlay.DOM, e.target);
    }.bind(this)
    this.DOM.onmouseout = function(e) {
        editOverlay.hide();
    }
}

var EditToolbar = function() {
    this.DOM = document.createElement('span');
    this.DOM.className = 'i4-edit-toolbar';
    this.DOM.innerHTML = '<i class="fa fa-pencil i4-edit-tool-edit" aria-hidden="true"></i> <i class="fa fa-cog" aria-hidden="true"></i> <i class="fa fa-bars" aria-hidden="true"></i> <i class="fa fa-trash-o" aria-hidden="true"></i> <i class="fa fa-close i4-edit-tool-close" aria-hidden="true"></i>';

    forEach(this.DOM.querySelectorAll('.i4-edit-tool-edit'), function(e) {
        e.onclick = function() {
            var wrapper = getAncestorByClassName(e, 'i4-edit-wrapper');
            var edit = wrapper.getElementsByClassName('i4-edit')[0];
            if (edit.classList.contains('i4-edit-text')) {
                edit.classList.add('i4-editable');
                var editor = new MediumEditor('.i4-editable');
            }

            this.hide();
        }.bind(this);
    }.bind(this));

    forEach(this.DOM.querySelectorAll('.i4-edit-tool-close'), function(e) {
        e.onclick = function() {
            this.hide();
        }.bind(this)
    }.bind(this));


    this.move = function (left, top) {
        this.DOM.style.left = left;
        this.DOM.style.top = top;
    }.bind(this);

    this.show = function() {
        this.DOM.style.display = 'block';
    }.bind(this);

    this.hide = function() {
        this.DOM.style.display = 'none';
    }.bind(this);
}
var editToolbar = new EditToolbar();

var EditOverlay = function() {
    this.DOM = document.createElement('span');
    this.DOM.className = 'i4-edit-overlay';
    this.DOM.innerHTML = '';

    this.resize = function(width, height) {
        this.DOM.style.width = width;
        this.DOM.style.height = height;
    }

    this.show = function() {
        this.DOM.style.display = 'block';
    };

    this.hide = function() {
        this.DOM.style.display = 'none';
    };
}
var editOverlay = new EditOverlay();

var EditInplaceSave = function() {
    this.DOM = document.createElement('span');
    this.DOM.className = 'i4-edit-inplace-toolbar';
    this.DOM.innerHTML = '<i class="fa fa-floppy-o" aria-hidden="true"> <i class="fa fa-close" aria-hidden="true"></i>';

    this.DOM.onclick = function(e) {
        console.log('this', this);
        this.DOM.style.display = 'none';
    }.bind(this);

    this.show = function() {
        this.DOM.style.display = 'block';
    }.bind(this);

    this.hide = function() {
        this.DOM.style.display = 'none';
    }.bind(this);
}
var editInplaceSave = new EditInplaceSave();

var EditWrapper = function() {
    this.DOM = document.createElement('div');
    this.DOM.className = 'i4-edit-wrapper';
    this.DOM.innerHTML = '';
}

forEach(document.querySelectorAll('.i4-edit'), function(element) {
    // element.style.backgroundColor = 'orange';
    var parent = element.parentNode;
    editWrapper = new EditWrapper();
    parent.insertBefore(editWrapper.DOM, element);
    editWrapper.DOM.insertBefore(element, editWrapper.DOM.firstChild);

    asterisk = new EditPlaceholder();
    editWrapper.DOM.insertBefore(asterisk.DOM, editWrapper.DOM.firstChild);
    asterisk.resize(element.offsetHeight+'px');
});


