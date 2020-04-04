<?php

//uncomment below lines for debugging
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/


//start time for calculation
$executionStartTime = microtime(true);


/*
//if for some reason you wanna read the local json you can using this code
$data=file_get_contents("file.json");
*/


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
		
		
		// you can using below code if you wanna save district name inside the district object
		//echo "'$district_name': {\ncovid19india_district_name: '$district_name',\ncovid19india_confirmed_cases: '$confirmed_cases'},\n";
    
    
    //i am not doing that to keep my DB look clean
    echo "\n'$district_name': {\n'covid19india_confirmed_cases': '$confirmed_cases'\n},";
		
	}
}

echo"}";
?>