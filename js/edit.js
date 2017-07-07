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

var EditWrapper = function() {
    this.DOM = document.createElement('div');
    this.DOM.className = 'i4-edit-wrapper';
    this.DOM.innerHTML = '';
}

var EditPlaceholder = function(height) {
    this.DOM = document.createElement('div');
    this.DOM.className = 'i4-edit-sidemark';
    this.DOM.innerHTML = '';

    this.resize = function(height) {
        this.DOM.style.height = height;
    }.bind(this);

    this.DOM.onclick = function(e) {
        if (!editInplaceToolbar.isVisible()) {
            this.DOM.parentNode.insertBefore(editToolbar.DOM, this.DOM);
            editToolbar.show();
            // first insert the toolbar, then read the offsetWeight
            editToolbar.move((this.DOM.style.left, e.layerY - (editToolbar.DOM.offsetHeight / 2)) +'px');
            editOverlay.hide()
        }
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
                editInplaceToolbar.setTarget(edit);
                var editor = new MediumEditor('.i4-editable');
                editInplaceToolbar.setEditor(editor);
                editInplaceToolbar.setSaveAction(function(e) {
                    console.log('id', this.target.dataset.id);
                    console.log('do the saving');
                    this.close();
                })
                editInplaceToolbar.show();
                wrapper.appendChild(editInplaceToolbar.DOM);
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

var EditInplaceToolbar = function() {
    this.DOM = document.createElement('div');
    this.DOM.className = 'i4-edit-inplace-toolbar';
    this.DOM.innerHTML = '<i class="fa fa-floppy-o i4-edit-save" aria-hidden="true"> <i class="fa fa-close i4-edit-close" aria-hidden="true"></i>';
    this.target = null;
    this.editor = null;

    /**
     * @param target the DOM element
     */
    this.setTarget = function(target) {
        this.target = target;
        this.target.classList.add('i4-editable');
    }.bind(this);
    this.setEditor = function(editor) {
        this.editor = editor;
    }.bind(this);

    this.close = function(e) {
        this.target.classList.remove('i4-editable');
        this.editor.destroy();
        this.DOM.style.display = 'none';
    }.bind(this);

    this.save = function(e) {
        // by default do nothing
    }.bind(this);

    var closeButton = this.DOM.getElementsByClassName('i4-edit-close')[0];
    closeButton.onclick = function(e) {
        this.close(e)
    }.bind(this);

    var saveButton = this.DOM.getElementsByClassName('i4-edit-save')[0];
    saveButton.onclick = function(e) {
        this.save();
        this.close();
    }.bind(this);

    this.setSaveAction = function (action) {
        this.save = action;
    }.bind(this);

    this.show = function() {
        this.DOM.style.display = 'block';
    }.bind(this);

    this.hide = function() {
        this.DOM.style.display = 'none';
    }.bind(this);

    this.isVisible = function() {
        return this.DOM.style.display == 'block';
    }
}
var editInplaceToolbar = new EditInplaceToolbar();

forEach(document.querySelectorAll('.i4-edit'), function(element) {
    // element.style.backgroundColor = 'orange';
    var parent = element.parentNode;
    editWrapper = new EditWrapper();
    parent.insertBefore(editWrapper.DOM, element);
    editWrapper.DOM.insertBefore(element, editWrapper.DOM.firstChild);

    var sidemark = new EditPlaceholder();
    editWrapper.DOM.insertBefore(sidemark.DOM, editWrapper.DOM.firstChild);
    sidemark.resize(element.offsetHeight+'px');
});
