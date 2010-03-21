<?php

if (isset($_GET['debug']))
{
	echo '<pre>';
	print_r($_POST);
}
else
	echo $_POST['editor'];


