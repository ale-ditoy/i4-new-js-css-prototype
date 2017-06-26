<?php

include_once('vendor/autoload.php');

function debug($label, $value) {
    echo("<pre>$label: ".str_replace('<', '&lt;', $print_r($value, 1))."</pre>\n");
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
    public function __construct($type, $content, $style = null) {
        $this->type = $type;
        $this->content = $content;
        $this->style = $style;
        $this->id = Id::next();
    }
    public function render() {
        if ($this->type == 'text') {
            return "<".$this->style.">".$this->content."</".$this->style.">";
        } elseif ($this->type == 'textarea') {
            return "<div>".$this->content."</div>";
        }
    }
}

class Image
{
    private $url = null;
    private $id = null;
    public function __construct($url) {
        $this->url = $url;
        $this->id = Id::next();
    }
    public function render() {
        return "<img src=\"".$this->url."\">";
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
}

$content = new Aggregator();
$content->add(new Text('text', 'title', 'h1'));
$content->add(new Text('textarea', "<ul>\n<li>first item</li>\n<li>a second one</li>\n</ul>"));
$content->add(new Image('img/tv-test.png'));

$template = new \Ditoy\Tiny\Template();
$template->set('content', $content);
if (file_exists('project/template/index.php')) {
    echo $template->fetch('project/template/index.php');;
} else {
    echo $template->fetch('template/index.php');;
}
?>
