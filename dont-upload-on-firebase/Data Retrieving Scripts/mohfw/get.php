<?php
//start time for calculation
$executionStartTime = microtime(true);

//file name in which you wanna save data
$file = 'file.html';

// send http request & get file contents
$context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
$html=file_get_contents("https://www.mohfw.gov.in/",false,$context);

// Write the contents to the file
file_put_contents($file, $html);


$executionEndTime = microtime(true);
$seconds = $executionEndTime - $executionStartTime; // time taken

//Printing information
echo "<script>console.log( 'The script took $seconds to execute.' );</script>";
echo"<h3>I saved the html file you requested successfully.</h3><p>The script took $seconds to execute.</p>";
?>