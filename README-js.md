# edit mode with pure js

- each aggregator item must have an enclosing item

## Notes

possible in place text editors:

- https://yabwe.github.io/medium-editor/ (the current one)
  - https://stackoverflow.com/questions/38297277/how-can-i-add-a-class-to-current-active-paragraph-in-medium-editor?rq=1 (for tweaking medium editor)
  - https://stackoverflow.com/questions/36481065/medium-editor-insert-button-lighter-example-then-the-plugins-out-there
- http://jakiestfu.github.io/Medium.js/docs/
- https://github.com/jessegreathouse/TinyEditor (old and unmaintained)
- http://wysiwygjs.github.io/
- http://summernote.org/getting-started/
- https://quilljs.com/docs/formats/
- https://github.com/neilj/Squire
- https://github.com/guardian/scribe

eventually add and use this polifill: https://github.com/WebReflection/dom4

- document.querySelector("p").closest(".near.ancestor")

## Todo

- ensure that only one frame can be edited at a time
  - block also the sidemarks?
- get the id from the data- and fake the save + close
  - remove the border from the editable
- retain the image plugin for medium-editor

