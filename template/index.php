<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <?= $style ?>

  </head>
  <body>
		<p><a href="?edit">edit</a> <a href="?">no edit</a></p>
		<div class="content">
			<?= $content->render() ?>

		</div>
        <?= $script ?>

  </body>
</html>
