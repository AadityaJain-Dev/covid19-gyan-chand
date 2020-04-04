'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');


const cors = require('cors')({ origin: true});
const admin = require('firebase-admin');
const serviceAccount = require('./admin-sdk.json');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://eyantra-hackathon-kqmkts.firebaseio.com",
});

const { SessionsClient } = require('dialogflow');
const app = express()




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
res.send('Hello World!')}
);


// for populating stats of all countries
app.post('/firebase-database-countries-data', (req, res) => {
		
		// Get a database reference to our blog
		var db = admin.database();
		var state_stats = db.ref("countries-data/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('Data for countries has been updates');   


});




// for populating stats of all indian states
app.post('/firebase-database-india-states-data', (req, res) => {
		
		// Get a database reference to our blog
		var db = admin.database();
		var state_stats = db.ref("india-states-data/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('Data for indian states has been updates');  


});






// for populating stats of all indian districts
app.post('/firebase-database-india-districts-data', (req, res) => {
		
		// Get a database reference to our blog
		var db = admin.database();
		var state_stats = db.ref("india-districts-data/");
		
		let post_data = req.body;
		//console.log(post_data);

		state_stats.set (post_data);

		res.status(200).send('Data for indian districts has been updates');  


});






// this api can be used to integrate with any platform or webapp
app.get('/dialogflow_bot_api', (request, response) => {
		
	  cors(request, response, async () => {
		const { queryInput, sessionId } = request.body;


		const sessionClient = new SessionsClient({ credentials: serviceAccount  });
		const session = sessionClient.sessionPath('eyantra-hackathon-kqmkts', sessionId);


		const responses = await sessionClient.detectIntent({ session, queryInput});

		const result = responses[0].queryResult;

		response.send(result);
	  });  


});





// route for handeling dialogflow fulfillment

app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

	// dialogflow function for fetching stats of a district state
  function specific_country () {
	const country_name = agent.parameters.countries;
	  
    //agent.add('Please wait while we fetch latest data from our database.');
	return admin.database().ref('countries-data/'+country_name).once("value").then((snapshot) => {
      var total_deaths = snapshot.child('worldometers_deaths').val();
	  var total_cases = snapshot.child('worldometers_total_cases').val();
      agent.add('The total cases in '+country_name+' are: '+total_cases+' and the total death toll is: '+total_deaths+'\n\n. Source: www.worldometers.info\n\n.Disclaimer: This data changes rapidly, so what’s shown may be out of date. Also, data from different sources may vary.');
    });
  }
  
  
  // dialogflow function for fetching stats of a district state
  function specific_district () {
	const district_name = agent.parameters.indian_districts;
	  
    //agent.add('Please wait while we fetch latest data from our database.');
	return admin.database().ref('india-districts-data/'+district_name).once("value").then((snapshot) => {
	  var total_cases = snapshot.child('covid19india_confirmed_cases').val();
      agent.add('The total confirmed cases in '+district_name+' are: '+total_cases+'\n\n. Source: www.covid19india.org\n\nDisclaimer: This data changes rapidly, so what’s shown may be out of date. Also, data from different sources may vary.');
    });
  }
  
  
  
  

    // dialogflow function for fetching stats of a specific state
  function specific_state () {
	const state_name = agent.parameters.indian_states;
	  
    //agent.add('Please wait while we fetch latest data from our database.');
	return admin.database().ref('india-states-data/'+state_name).once("value").then((snapshot) => {
      var total_cured = snapshot.child('mohfw_cured').val();
	  var total_deaths = snapshot.child('mohfw_deaths').val();
	  var total_cases = snapshot.child('mohfw_total').val();
      agent.add('The total confirmed cases in '+state_name+' are: '+total_cases+' out of which '+total_cured+' are cured or discharged and the total death toll is: '+total_deaths+'\n\n. Source: www.mohfw.gov.in\n\n.Disclaimer: This data changes rapidly, so what’s shown may be out of date. Also, data from different sources may vary.');
    });
  }
  
  





    // dialogflow function for serving stats from all states of india
  function all_indian_states () {
	
	agent.add('We are working on this feature for providing data of all the states in India');	

  }
  




    // dialogflow function for serving stats from all countries
  function all_countries () {
	
	agent.add('We are working on this feature for providing data of all the countries');	

  }
  


  // dialogflow function for serving stats from all the districts of india
  function all_indian_districts () {
	
	agent.add('We are working on this feature for providing data of all the districts in India');	

  }
  

  // dialogflow function for serving latest news from database
  function latest_news () {
	
	agent.add('We are working on this feature');	

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