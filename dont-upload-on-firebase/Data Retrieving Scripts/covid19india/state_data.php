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
$data=file_get_contents("https://api.covid19india.org/data.json");
$data = json_decode($data, true); // setting it true for converting returned object into an associative array


//generating json data to be sent firebase function
echo"{";



// now retrieving data from json file & converting it into proper format so that it can be saved into database.



	$states=$data['statewise'];
	
	//print_r($districts);
	
	foreach ($states as $state) {
				$active="$state[active]";
				$confirmed="$state[confirmed]";
				$deaths="$state[deaths]";
				$lastupdatedtime="$state[lastupdatedtime]";
				$recovered="$state[recovered]";
				$state_name="$state[state]";
				$statecode="$state[statecode]";		
				
				
		// these 3 can use issue in data entry so, removing them
		$state_name=str_replace("'","",$state_name);
		$state_name=str_replace("&amp;","",$state_name);
		$state_name=str_replace(".","",$state_name);
		
		

    
    //i am not doing that to keep my DB look clean
    echo "\n'$state_name': {\n'covid19india_state_name': '$state_name',\n'covid19india_state_code':'$statecode',\n'covid19india_confirmed':'$confirmed',\n'covid19india_deaths':'$deaths',\n'covid19india_active_cases': '$active',\n'covid19india_last_updated':'$lastupdatedtime',\n'covid19india_recovered':'$recovered'\n},";
		
	}
	


echo"}";
?>