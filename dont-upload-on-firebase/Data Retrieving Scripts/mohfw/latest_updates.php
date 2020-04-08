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
$randomString="";






//generate random string
function generateRandomString($length = 30) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}




//generating html with required firebase libraries, web app configuration & Initialization
echo"{";


foreach($html->find("#latest-update > div > div.equal-height") as $news){

foreach($news->find("div > div") as $actual_news){
	
	
			//generate random news for this news
			$ran_name=generateRandomString();

			// extracting url from news (if any)
			if(preg_match_all('/<a[^>]+href=([\'"])(?<href>.+?)\1[^>]*>/i', $actual_news, $result)){
			if (!empty($result)) {
				$url=$result['href'][0];
				}}
		
		
		
			// strip all html tags
			$actual_news=strip_tags("$actual_news","");	
			
			
			// removing unwanted stuff
			$actual_news=str_replace(" 			","","$actual_news");
			$actual_news=substr($actual_news,10);
			$actual_news=str_replace("'","",$actual_news);
			$actual_news=str_replace("&amp;","",$actual_news);
			$actual_news=str_replace(".","",$actual_news);

	
	
	
	echo"\n'$ran_name':{\n'news_text':'$actual_news',\n'news_url':'$url'\n},";
	
			
}

}



  


echo"}";
?>