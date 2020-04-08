const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

// you have to generate your own service accout key
const admin = require('firebase-admin');
const serviceAccount = require('./admin-sdk.json');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://eyantra-hackathon-kqmkts.firebaseio.com",
});


const app = express()
// Get database reference
var db = admin.database();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
res.status(403).send('403 Forbidden')}
);


// for populating db with stats of all countries
app.post('/firebase-database-countries-data', (req, res) => {
		

		var state_stats = db.ref("countries-data/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('Data for countries has been updates');   


});




// for populating db with stats of all indian states
app.post('/firebase-database-india-states-data', (req, res) => {
		

		var state_stats = db.ref("india-states-data/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('Data for indian states has been updates');  


});






// for populating db with stats of all indian districts
app.post('/firebase-database-india-districts-data', (req, res) => {
		
		
		var state_stats = db.ref("india-districts-data/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('Data for indian districts has been updates');  


});



// for populating db with latest news updates from mohfw website
app.post('/firebase-mohfw-news-updates', (req, res) => {
		

		var state_stats = db.ref("india-mohfw-news-updates/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('latest news updates from mohfw website added');  


});



// for populating db with daily cases
app.post('/firebase-covid19-cases-time-series', (req, res) => {
		

		var state_stats = db.ref("india-covid19-cases-time-series/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('daily report data with date added.');  


});



// for populating db with daily test data

/*
app.post('/firebase-covid19-tested-records', (req, res) => {
		

		var state_stats = db.ref("india-covid19-tested-records/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('data of all test records added.');  


});

*/

















































// route for handeling dialogflow fulfillment

app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

	// dialogflow function for fetching stats of a district state
  function specific_country () {
	const country_name = agent.parameters.countries;
	  
    
	return db.ref('countries-data/'+country_name).once("value").then((snapshot) => {
      var total_deaths = snapshot.child('worldometers_deaths').val();
	  var total_cases = snapshot.child('worldometers_total_cases').val();
	  
	  
	  	  	if(agent.locale === 'hi'){
		// if hindi
	      agent.add(country_name+'  में अभी तक कुल  '+total_cases+' मामले पाए गए है और अभी तक  '+total_deaths+' लोगों की मृत्यु हो चुकी है डेटा  \n\n. स्रोत: www.worldometers.info\n\n. सुचना: यह डेटा तेज़ी से बदलता है, इसलिए जो दिखाया गया है वह थोड़ा पुराना रिकॉर्ड हो सकता है। और अलग स्रोतों के डेटा अलग हो सकते हैं।');
	}else{
		// for english (indian or any)
	      agent.add('The total cases in '+country_name+' are: '+total_cases+' and the total death toll is: '+total_deaths+'\n\n. Source: www.worldometers.info\n\n.Disclaimer: This data changes rapidly, so what’s shown may be out of date. Also, data from different sources may vary.');	
	}

    });
  }
  
  
  // dialogflow function for fetching stats of a district state
  function specific_district () {
	const district_name = agent.parameters.indian_districts;
	  
    
	return db.ref('india-districts-data/'+district_name).once("value").then((snapshot) => {
	  var total_cases = snapshot.child('covid19india_confirmed_cases').val();
	  
	  
	  	  	if(agent.locale === 'hi'){
		// if hindi
	      agent.add(district_name+'  में अभी तक कुल '+total_cases+' मामले पाए गए है \n\n. डेटा स्रोत: www.covid19india.org\n\n सुचना: यह डेटा तेज़ी से बदलता है, इसलिए जो दिखाया गया है वह थोड़ा पुराना रिकॉर्ड हो सकता है। और अलग स्रोतों के डेटा अलग हो सकते हैं।');
	}else{
		// for english (indian or any)
	      agent.add('The total confirmed cases in '+district_name+' are: '+total_cases+'\n\n. Source: www.covid19india.org\n\nDisclaimer: This data changes rapidly, so what’s shown may be out of date. Also, data from different sources may vary.');
	}

      
    });
  }
  
  
  
  

    // dialogflow function for fetching stats of a specific state
  function specific_state () {
	const state_name = agent.parameters.indian_states;
	  
    
	return db.ref('india-states-data/'+state_name).once("value").then((snapshot) => {
		
		
		var active_cases = snapshot.child('covid19india_active_cases').val();
		var confirmed = snapshot.child('covid19india_confirmed').val();
		var deaths = snapshot.child('covid19india_deaths').val();
		var last_updated = snapshot.child('covid19india_last_updated').val();
		var recovered = snapshot.child('covid19india_recovered').val();
		var state_name = snapshot.child('covid19india_state_name').val();
	  
	  
	  
	  	if(agent.locale === 'hi'){
		// if hindi
	      agent.add(state_name+' में अभी तक कुल  '+confirmed+' मामले पाए गए है  जिसमें से '+recovered+' ठीक या डिस्चार्ज हो गए है और अभी भी   '+active_cases+' लोग बीमार है, अभी तक '+deaths+' लोगो की मृत्यु हो चुकी है , यह डाटा  '+last_updated+' तक का है \n\n. डेटा स्रोत: www.covid19india.org\n\n. सुचना: यह डेटा तेज़ी से बदलता है, इसलिए जो दिखाया गया है वह थोड़ा पुराना रिकॉर्ड हो सकता है। और अलग स्रोतों के डेटा अलग हो सकते हैं।');
	}else{
		// for english (indian or any)
	      agent.add('The total confirmed cases in '+state_name+' are: '+confirmed+', out of which '+recovered+' have recovered and '+active_cases+' are still infected. The death toll is '+deaths+'. This data was updated on '+last_updated+'\n\n. Source: www.covid19india.org\n\nDisclaimer: This data changes rapidly, so what’s shown may be out of date. Also, data from different sources may vary.');	
	}

    });
  }
  
  





    // dialogflow function for serving stats from all states of india
  function all_indian_states () {
	
	if(agent.locale === 'hi'){
		// if hindi
	agent.add('यह फ़ंक्शन अभी उपलब्ध नहीं है लेकिन यह जल्द ही उपलब्ध हो जाएगा।');
	}else{
		// for english (indian or any)
	agent.add('This function is currently unavailable but it will get available soon.');	
	}
  }
  




    // dialogflow function for serving stats from all countries
  function all_countries () {
	
	if(agent.locale === 'hi'){
		// if hindi
	agent.add('यह फ़ंक्शन अभी उपलब्ध नहीं है लेकिन यह जल्द ही उपलब्ध हो जाएगा।');
	}else{
		// for english (indian or any)
	agent.add('This function is currently unavailable but it will get available soon.');	
	}
  }
  


  // dialogflow function for serving stats from all the districts of india
  function all_indian_districts () {
	
	if(agent.locale === 'hi'){
		// if hindi
	agent.add('यह फ़ंक्शन अभी उपलब्ध नहीं है लेकिन यह जल्द ही उपलब्ध हो जाएगा।');
	}else{
		// for english (indian or any)
	agent.add('This function is currently unavailable but it will get available soon.');	
	}
  }
  

  // dialogflow function for serving latest news from database
  function latest_news () {
	
	if(agent.locale === 'hi'){
		// if hindi
	agent.add('यह फ़ंक्शन अभी उपलब्ध नहीं है लेकिन यह जल्द ही उपलब्ध हो जाएगा।');

	}else{
		// for english (indian or any)
	agent.add('This function is currently unavailable but it will get available soon.');

	
	}
  }


  // dialogflow intents mapping
  let intentMap = new Map()
  intentMap.set('stats> specific country', specific_country);
  intentMap.set('stats> specific indian district', specific_district);
  intentMap.set('stats> specific indian state', specific_state);
  intentMap.set('stats> all indian states', all_indian_states);
  intentMap.set('stats> all countries', all_countries);
  intentMap.set('stats> all indian districts', all_indian_districts);
  intentMap.set('Latest update', latest_news);
  agent.handleRequest(intentMap)
})














//run app
exports.app = functions.https.onRequest(app);