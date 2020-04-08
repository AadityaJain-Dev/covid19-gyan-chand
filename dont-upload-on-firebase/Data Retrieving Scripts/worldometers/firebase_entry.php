<?php


// your cloud function url
$cloud_function="";

//php hosting url
$hosting_url="";




// API URL
$url = "$cloud_function/app/firebase-database-countries-data";

// Create a new cURL resource
$ch = curl_init($url);

// Setup request to send json via POST
$contents=file_get_contents("$hosting_url/worldometers/save_data.php");

//fixing json
$contents=str_replace("'",'"',$contents);
$contents=str_replace("},}","}}",$contents);
$contents=str_replace("Japan (+Diamond Princess)","Japan",$contents);


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

echo "Data for countries has been updates";

?>