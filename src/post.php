<?php
set_magic_quotes_runtime(0);
// if (isset($_GET['debug']))
// {
// 	echo '<pre>';
// 	print_r($_POST);
// }
// else
// 	echo $_POST['editor'];


echo stripslashes($_POST['editor']) ;