<?php

// dont judge me for this, it was easy to do it this way then editing that whole other file.


// API URL, cloud function URL
$url = '';

// Create a new cURL resource
$ch = curl_init($url);

// Setup request to send json via POST
$contents=file_get_contents("https://---------------------/save_data.php");

//fixing json
$contents=str_replace("'",'"',$contents);
$contents=str_replace("},}","}}",$contents);


//$payload = json_encode($contents);
$payload = $contents;

// Attach encoded JSON string to the POST fields
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

// Set the content type to application/json
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

// Return response instead of outputting
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the POST request
$result = curl_exec($ch);

// Close cURL resource
curl_close($ch);

echo "Data for indian districts has been updates";

?>