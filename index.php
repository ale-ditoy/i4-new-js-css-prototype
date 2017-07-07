<?php

include_once('vendor/autoload.php');

function debug($label, $value) {
    echo("<pre>$label: ".str_replace('<', '&lt;', print_r($value, 1))."</pre>\n");
}

class Id {
    public static function next() {
        static $id = 0;
        $id++;
        return $id;
    }
}

class Text
{
    private $type = null;
    private $content = null;
    private $style = null;
    private $id = null;
    private $encloser = null;
    public function getEncloser() { return  $this->encloser; }
    public function __construct($type, $content, $style = null) {
        $this->type = $type;
        $this->content = $content;
        $this->style = $style;
        $this->id = Id::next();
        $this->encloser = new ContentEncloser();
    }
    public function render_edit() {
        $this->encloser->addData('id', $this->id);
        return $this->render();
    }
    public function render() {
        $this->encloser->addClass('i4-edit-text');
        if ($this->type == 'text') {
            $this->encloser->setTag($this->style);
            return $this->encloser->renderOpen().$this->content.$this->encloser->renderClose();
        } elseif ($this->type == 'textarea') {
            return $this->encloser->renderOpen()."\n".$this->content."\n".$this->encloser->renderClose();
        }
    }
}

class Image
{
    private $url = null;
    private $id = null;
    private $encloser = null;
    public function getEncloser() { return  $this->encloser; }
    public function __construct($url) {
        $this->url = $url;
        $this->id = Id::next();
        $this->encloser = new ContentEncloser();
    }
    public function render_edit() {
        $this->encloser->addData('id', $this->id);
        return $this->render();
    }
    public function render() {
        return $this->encloser->renderOpen().'<img src="'.$this->url.'">'.$this->encloser->renderClose();
    }
}

class Aggregator
{
    private $item = [];
    public function add($item) {
        $this->item[] = $item;
    }
    public function render() {
        return implode("\n", array_map(function($i) { return $i->render();}, $this->item));
    }
    public function render_edit() {
        $items = array_map(function($i) {
            $i->getEncloser()->addClass('i4-edit');
            return $i->render_edit();
        }, $this->item);
        return implode("\n", $items);
    }
}

class ContentEncloser
{
    private $tag = 'div';
    public function setTag($tag) { $this->tag = $tag; }
    private $id = null;
    public function setId($id) { $this->id = $id; }
    private $class = [];
    public function addClass($class) { $this->class[] = $class; }
    private $data = [];
    public function addData($key, $value) { $this->data[$key] = $value; }

    public function renderOpen() {
        $result = [];
        $result[] = $this->tag;
        if (isset($this->id)) {
            $result[] = 'id="'.$this->id.'"';
        }
        if (!empty($this->class)) {
            $result[] = 'class="'.implode(' ', $this->class).'"';
        }
        foreach ($this->data as $key => $value) {
            $result[] = 'data-'.$key.'="'.$value.'"';
        }
        return '<'.implode(' ', $result).'>';
    }
    public function renderClose() {
        return '</'.$this->tag.'>';
    }
}
class Content
{
    private $aggregator = null;
    public function __construct($aggregator) {
        $this->aggregator = $aggregator;
    }
    public function render() {
        if (array_key_exists('edit', $_REQUEST)) {
            return $this->aggregator->render_edit();
        } else {
            return $this->aggregator->render();
        }
    }
}

$aggregator = new Aggregator();
$aggregator->add(new Text('text', 'title', 'h1'));
$aggregator->add(new Text('textarea', "<ul>\n<li>first item</li>\n<li>a second one</li>\n</ul>"));
$aggregator->add(new Image('img/tv-test.png'));

$content = new Content($aggregator);

$script = [];
if (array_key_exists('edit', $_REQUEST)) {
    $script[] = 'js/edit.js';
    $script[] = 'js/medium.min.js';
}

$css = [
    'css/style.css'
];
if (array_key_exists('edit', $_REQUEST)) {
    $css[] = 'css/font-awesome.min.css';
    $css[] = 'css/themes/default.min.css';
    $css[] = 'css/medium-editor.min.css';
    $css[] = 'css/edit.css';
}

$template = new \Ditoy\Tiny\Template();
$template->set('content', $content);
$template->set('style', implode("\n", array_map(function($s) { return '<link rel="stylesheet" href="'.$s.'">'; }, $css)));
$template->set('script', implode("\n", array_map(function($s) { return '<script src="'.$s.'"></script>'; }, $script)));
if (file_exists('project/template/index.php')) {
    echo $template->fetch('project/template/index.php');;
} else {
    echo $template->fetch('template/index.php');;
}
