<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js"></script>
  </head>
  <body>
		<p><a href="?edit">edit</a> <a href="?">no edit</a></p>
		<div class="content">
			<?= $content->render() ?>
		</div>
  </body>
</html>
