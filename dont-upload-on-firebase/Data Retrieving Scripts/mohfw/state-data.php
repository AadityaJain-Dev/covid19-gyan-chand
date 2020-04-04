<?php

//uncomment below lines for debugging
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/


//start time for calculation
$executionStartTime = microtime(true);

//for dom
include("dom.php");


//get contents from html file
$html=file_get_html("file.html");

// declaring array for saving table row data 
$rowData = array();





//generating html with required firebase libraries, web app configuration & Initialization
echo"{";



// now retrieving data from html file & converting it into proper format so that it can be saved into database.

// for each table row
foreach($html->find("#state-data > div > div > div > div > table > tbody > tr") as $row){
    // initialize array to store the cell data from each row
    $array_data = array();
	$td_count=1;
    foreach($row->find('td') as $cell) {
		if($td_count==1){}else{
        // push the cell's text to the array
        $array_data[] = $cell->plaintext;
		}
		$td_count=$td_count+1;
    }
    $rowData[] = $array_data;

  }
  


// popping 2 element from array
// one was empty & other one had unwanted values
array_pop($rowData);
array_pop($rowData);



// for debugging
//print_r($rowData);


foreach ($rowData as $row => $tr) {
	$td_count=1;

    foreach ($tr as $td){

		if($td_count==1){

		// these 3 can use issue in data entry so, removing them
		$td=str_replace("'","",$td);
		$td=str_replace("&amp;","",$td);
		$td=str_replace(".","",$td);


		if($td=="West Bengal"){$is_stop=1;}
			echo "\n\n'$td': {\n";
		}
		elseif($td_count==2){
			echo "'mohfw_total': '$td',\n";
		}
		elseif($td_count==3){
			echo "'mohfw_cured': '$td',\n";
		}
		elseif($td_count==4){
			echo "'mohfw_deaths': '$td'\n";
		}else{}
		$td_count=$td_count+1;
		
	}


		if($td_count>1){
			echo"},";
			}
}

echo"}";
?>