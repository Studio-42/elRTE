<?php

echo '<pre>';
print_r($_POST);

$file = './autosave/save-'.(count(scandir('./autosave'))-1).'.txt';
$str = '';
foreach ($_POST as $n => $v) {
	$str .= $n.":\n".$v."\n\n";
}

file_put_contents($file, $str);

?>