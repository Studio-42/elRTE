<?php
header('Content-Type', 'text/html; charset=utf-8');
// echo '<pre>';
// print_r($_POST);

if (!function_exists('scandir')) {
	function scandir($dir) {
		$files = array();
		$dh  = opendir($dir);
		while (false !== ($filename = readdir($dh))) {
		    $files[] = $filename;
		}

		sort($files);
		return $files;
	}
	
}

$file = './autosave/save-'.(count(scandir('./autosave'))-1).'.txt';
$str = '';
foreach ($_POST as $n => $v) {
	$v = stripslashes($v);
	echo $n.":<br/>".$v.'<br style="clear:both"/><hr>';
	$str .= $n.":\n".$v."\n\n";
}

file_put_contents($file, $str);

?>