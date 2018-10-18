import * as intent from './intents/intents'

// Global variables
var stepDict = {name: "", index: null, currentIndex: null, previousIndex: null, stepRequest: null};

async function handle_fulfillment(req, res) {
    let response = {};
    let response_text;
    let data = req.body;
    let displayName = data.queryResult.intent.displayName;
    
    /*Switch to route all the different Intents to their specific
    functions and retrieve the response message*/
    switch (displayName) {
        //Match for Ingredient and Follow up ingredients
        case "Ingredient-Intent":
        case "Ingredient-Intent-Follow-Up":
            // Get Ingredient asked for from database
            let ingredient = data.queryResult.parameters.ingredient;
            response_text = await intent.get_ingredient(ingredient, data);
            break;
        //Match for List of all ingredients and retrieve the response text
        case "List-Ingredients":
            response_text = await intent.get_ingredient_list();
            break;
        //Match for first step and retrieve the response text
        case "first-step":
            response_text = await intent.getFirstStep(stepDict);
            break;
        //Match for next step and retrieve the response text
        case "next-step":
            stepDict.name = "nextStep";
            response_text = await intent.getStepByIndex(stepDict);
            break;
        //Match for repeating step
        case "repeat-step":
            stepDict.name = "repeatStep";
            response_text = await intent.getStepByIndex(stepDict);
            break;
        //Match for the previous step
        case "previous-step":
            stepDict.name = "previousStep";
            response_text = await intent.getStepByIndex(stepDict);
            break;
        //Match for any requested step
        case "requested-step":
            stepDict.name = "requestedStep";
            stepDict.stepRequest = data.queryResult.parameters.number;
            response_text = await intent.getStepByIndex(stepDict);
            break;
        //Match for getting the remaining number of steps
        case "remaining-steps":
            response_text = await intent.getTotalNumberOfSteps(stepDict);
            break;
        //Match for set up intent
        case "Setup-Intent":
            let projectID = data.session.split('/')[1];
            let sessionID = data.session.split('/')[4];
            intent.update_session_entity(projectID, sessionID);
            response_text = "Let's get cooking!";
            break;
        //Match for cook time intent and retrieve the response text
        case "Cook-Time-Intent":
            response_text = await intent.getCookTime();
            break;
        //Match for prep time intent and retrieve the response text
        case "Prep-Time-Intent":
            response_text = await intent.getPrepTime();
            break;
    }
    // Set response text
    response.fulfillmentText = response_text;

    if (response.fulfillmentText != null
      && response.fulfillmentText.length > 1) {
        res.status(201);
      } else {
        res.status(500);
      }
    
    // Send response message back
    res.json(response);
}

export default handle_fulfillment;
