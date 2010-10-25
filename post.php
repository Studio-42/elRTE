<?php
header('Content-Type', 'text/html; charset=utf-8');
// echo '<pre>';
// print_r($_POST);

$file = './autosave/save-'.(count(scandir('./autosave'))-1).'.txt';
$str = '';
foreach ($_POST as $n => $v) {
	echo $n.":<br/>".stripslashes($v).'<br style="clear:both"/><hr>';
	$str .= $n.":\n".$v."\n\n";
}

file_put_contents($file, $str);

?>