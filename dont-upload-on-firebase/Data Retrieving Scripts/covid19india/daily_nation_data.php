<?php

//uncomment below lines for debugging
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/


//start time for calculation
$executionStartTime = microtime(true);


//get contents from json file
$data=file_get_contents("https://api.covid19india.org/data.json");
$data = json_decode($data, true); // setting it true for converting returned object into an associative array


//generating json data to be sent firebase function
echo"{";



// now retrieving data from json file & converting it into proper format so that it can be saved into database.



	$cases_time_series=$data['cases_time_series'];
	
	//print_r($districts);
	
	foreach ($cases_time_series as $cases_time_serie) {
		
				$date="$cases_time_serie[date]";
				$dailyconfirmed="$cases_time_serie[dailyconfirmed]";
				$dailydeceased="$cases_time_serie[dailydeceased]";
				$dailyrecovered="$cases_time_serie[dailyrecovered]";
				$totalconfirmed="$cases_time_serie[totalconfirmed]";
				$totaldeceased="$cases_time_serie[totaldeceased]";
				$totalrecovered="$cases_time_serie[totalrecovered]";		
		
		

    echo "\n'$date': {\n'Daily Confirmed':'$dailyconfirmed',\n'Daily Deceased':'$dailydeceased',\n'Daily Recovered':'$dailyrecovered',\n'Total Confirmed':'$totalconfirmed',\n'Total Deceased':'$totaldeceased',\n'Total Recovered':'$totalrecovered'\n},";
		
	}
	

echo"}";
?>