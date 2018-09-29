import get_ingredient from './ingredient_intent'
import update_session_entity from './setup_intent'
import getFirstStep from'./firststep_intent'
import getIndexByStep from'./nextstep_intent'

var express = require('express');
const bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bodyparser.json());

let port = process.env.PORT || 5000; // process.env.PORT used by Heroku
let index=1;
let currentIndex=null;
let previousIndex=null;

app.get('/', function (req, res) {
  res.send('Welcome to the cooking assistant!');
});


app.post('/fulfillment', async function (req,res) {

  console.log('got fulfillment request');
  let response = {};
  let response_text;

  let data = req.body;

  // Match for Ingredient-Intent
  if (data.queryResult.intent.displayName == 'Ingredient-Intent'
    || data.queryResult.intent.displayName == 'Ingredient-Intent-Follow-Up') {

    // Get Ingredient asked for from database
    let ingredient = data.queryResult.parameters.ingredient;
    let ingredient_info = await get_ingredient(ingredient);

    // If Ingredient was found, return ingredient info. If not, return error message
    if (ingredient_info != null) {

      // If non-plural units, and plural amount, make unit plural
      if (ingredient_info.quantity != 1 && ingredient_info.unit[ingredient_info.unit.length - 1] != 's') {
        ingredient_info.unit += "s";

      // If non-plural amount, but plural units
      } else if (ingredient_info.quantity == 1 && ingredient_info.unit[ingredient_info.unit.length - 1] == 's') {
        ingredient_info.unit = ingredient_info.unit.slice(0,-1);
      }

      // Don't say unit if unit is same as name (E.G. 1 egg, 1 orange)
      if (ingredient_info.unit == ingredient_info.name) {
        response_text = 'You need ' + ingredient_info.quantity + ' ' + ingredient_info.unit;
      } else {
        response_text = 'You need ' + ingredient_info.quantity + ' ' + ingredient_info.unit + ' of ' + ingredient_info.name;
      }
    } else {
      response_text = ingredient + ' is not in the recipe';
    }   
  }

  // Match for First Step
  else if (data.queryResult.intent.displayName =='first.step') {
    let firstStep = await getFirstStep();
    if (firstStep != null) {
      response_text = firstStep;
    }
    else response_text = "I don't know"; 
    index = 1;
    currentIndex=0; 
  } 

  // Match for Next Step
  else if (data.queryResult.intent.displayName=='next.step') {
    console.log("index:"+index);
    let step = await getIndexByStep(index);
    currentIndex=index;
    previousIndex=index-1;
    index = index + 1;
    if (step != null) {
      response_text = step;
    }
    else response_text = "End of steps";
  }
  //Match for Repeat step
  else if(data.queryResult.intent.displayName=='repeat.step'){
     if(currentIndex==null){
      response_text="What shall I repeat?";
    }
    else {
      let currentStep= await getIndexByStep(currentIndex);
      if(currentStep!=null){
        response_text=currentStep;
      }
      else
        response_text="which step to repeat"
    }
    
  }
  //Match for previous step
  if(data.queryResult.intent.displayName=='previous.step'){
    if(previousIndex==null){
      response_text="Which step you want?";
    }
    else{
      let previousStep=await getIndexByStep(previousIndex);
      if(previousStep!=null){
        response_text=previousStep;
      }
      else response_text="Which step you want?"
    }

  }
  
 
  // Match for Set Up Intent
  else if (data.queryResult.intent.displayName == 'Setup-Intent'){
    let projectID = data.session.split('/')[1]
    let sessionID = data.session.split('/')[4]
    update_session_entity(projectID,sessionID);
    response_text = "Let's get cooking!"
  }

  // Set response text
  response.fulfillmentText = response_text;

  // Send response
  res.json(response);
});

app.listen(port, function () {
  console.log('Cooking server listening on port ' + port);
});
