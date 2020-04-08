<?php

//uncomment below lines for debugging
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/


//start time for calculation
$executionStartTime = microtime(true);



//get contents from json file
$data=file_get_contents("https://api.covid19india.org/v2/state_district_wise.json");
$data = json_decode($data, true); // setting it true for converting returned object into an associative array


//generating json data to be sent firebase function
echo"{";



// now retrieving data from json file & converting it into proper format so that it can be saved into database.


foreach ($data as $info) {
	$districts=$info['districtData'];
	foreach ($districts as $district) {
		$district_name="$district[district]";
		$confirmed_cases="$district[confirmed]";
		
		// these 3 can use issue in data entry so, removing them
		$district_name=str_replace("'","",$district_name);
		$district_name=str_replace("&amp;","",$district_name);
		$district_name=str_replace(".","",$district_name);
		
    
    //i am not doing that to keep my DB look clean
    echo "\n'$district_name': {\n'covid19india_confirmed_cases': '$confirmed_cases'\n},";
		
	}
}

echo"}";
?>