<?php

// Script to enable or disable WebSanitize filtering
// This script uses a GET variable to write to a file that either enables or disables the plugin WebSanitize

error_reporting(E_ALL);
ini_set('display_errors', 1);

$WS_Toggle = $_GET['websanitize'];

// Clear the current contents of the file ready for update
$handle = fopen( __DIR__ .'/websanitize.txt', 'r+') or die('Wasnt able to read the file');
ftruncate($handle, 0);

// Write the new toggle to the file to activate/deactivate
$data = $WS_Toggle;
fwrite($handle, $data);

fclose($handle);
