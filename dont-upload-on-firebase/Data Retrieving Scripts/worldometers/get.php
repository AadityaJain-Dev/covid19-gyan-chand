<?php
//start time for calculation
$executionStartTime = microtime(true);

//file name in which you wanna save data
$file = 'file.html';






// send http request & get file contents
$context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));

/*
// initially i was using the data from google 
// but i found worldometers more updated & reliable,
// i am leaving the code to get data from google in the file, just in case if you people at eyanta wanna use it

$html=file_get_contents("https://www.google.com/covid19-map/",false,$context);
*/
$html=file_get_contents("https://www.worldometers.info/coronavirus/countries-where-coronavirus-has-spread/",false,$context);











// Write the contents to the file
file_put_contents($file, $html);


$executionEndTime = microtime(true);
$seconds = $executionEndTime - $executionStartTime; // time taken

//Printing information
echo "<script>console.log( 'The script took $seconds to execute.' );</script>";
echo"<h3>I saved the html file you requested successfully.</h3><p>The script took $seconds to execute.</p>";
?>