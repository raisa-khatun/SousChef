var recipesDoc = null;
var currentRecipe = null;

let numberOfIngredients = 0;
let numberOfSteps = 0;
let steps_count=0;
var flag=0
var check=0 

function oopsie(){
    $("#Message").text("Oopsie woopsie! uwu We made a messy wessy! Our code mookeys are working VEWY HAWD to fix this!");
}

function unoopsie(){
    $("#Message").text("Your Cookbook");
}

function populate(recipe){
    console.log(recipe);

    // Empty previous ingredients and steps before populating the page
   /* $("#ingredients").empty();
    $("#steps").empty(); */
    
    if(recipe.name != undefined && recipe.name != null){
            $("#recipe_name_edit").val(recipe.name);
    }else{
            $("#recipe_name_edit").val("not listed");
    }
    //serving_size_edit 
    if(recipe.num_servings != undefined && recipe.num_servings != null){
            $("#serving_size_edit").val(recipe.num_servings);
    }else{
            $("#serving_size_edit").val("not listed");
    } 
    if (recipe.prep_time != undefined && recipe.prep_time != null){
        $("#prep_time_edit").val(recipe.prep_time);
    } else {
        $("#prep_time_edit").val("not listed");
    }

    if (recipe.cook_time != undefined && recipe.cook_time != null) {
        $("#cook_time_edit").val(recipe.cook_time);
    } else {
        $("#cook_time_edit").val("not listed");
    }
    /*var ingreds = recipe.ingredients;
    for (var i in ingreds){
        console.log(ingreds[i]);
        $("#ingredients").append('<li>'+ingreds[i].quantity+" "+ingreds[i].unit+" of "+ingreds[i].name+"</li>");
    }
    var steps = recipe.directions
    for (var i in steps){
        $("#steps").append("<li>"+steps[i]+"</li>");
    } */
}

function renderIngredientsAndSteps(recipe){
    var buildHtml = "";
    var ingredients = recipe.ingredients;
    var steps = recipe.directions;
    if(ingredients!=null && steps!=null){
      var length = ingredients.length;
      numberOfIngredients = length;
      //var steps_field = null;
      //var ingredient_field=null;

    //Dynamically creating ingredients as a table (Ingredient Name, Quantity , Unit)
      for(var i=0; i<length ;i++){
          if(ingredients[i] != null){
            var ingredient_field = $(document.createElement('input'))
                                 .attr("type", "text")
                                 .attr("placeholder", "name")
                                 .attr("class", "input-1 input-edit")
                                 .attr("value",ingredients[i].name)
                                 .attr("style","width: 252px");

            var amount_field = $(document.createElement('input'))
                                 .attr("type", "text")
                                 .attr("placeholder", "amount")
                                 .attr("class", "input-1 input-edit")
                                 .attr("value",ingredients[i].quantity)
                                 .attr("style","width: 252px");

            var unit_field = $(document.createElement('select'))
                             .attr("class", "input-1 input-edit")
                             .attr("style","width: 252px")
                             .append("<option>"+ingredients[i].unit+"</option>")
                             .append("<option>unit</option>")
                             .append("<option>teaspoon</option>")
                             .append("<option>tablespoon</option>")
                             .append("<option>ounce</option>")
                             .append("<option>cup</option>")
                             .append("<option>gill</option>")
                             .append("<option>gram</option>")
                             .append("<option>pound</option>")
                             .append("<option>gallon</option>")
                             .append("<option>ml</option>")
                             .append("<option>liter</option>")
            
             ingredient_li=$(document.createElement('li'))
                                //.append("<h2>"+"Ingredient: "+countIngredients+"</h2>")
                                .append(ingredient_field)
                                .append(amount_field)
                                .append(unit_field)
                                .append("<span class='ing-default-remove'>&times;</span>")
                                .append("<br><br>"); 

            $(".ingredient-fields").append(ingredient_li);                
            /*  buildHtml += "<div class=\"row-upload row ing\"><tr class=\"col-md-12\" style='border:1px solid #dddddd;'><td class='tdid' style='padding-left:10px;'></td><td class='tdid' style='padding-left:10px;'><textarea id='ingname"+(i+1)+"' name='ingname"+(i+1)+"' class=\"input-edit\" maxlength='252' value=\"dummy\" style='width: 250px;color: rgb(119, 119, 119);margin-left: 50px;'>"+ingredients[i].name+"</textarea></td><td class='tdid' style='padding-left:10px;'><textarea id='quantity"+(i+1)+"' name='quantity"+(i+1)+"' class=\"input-edit\" maxlength='252' style='width: 250px;'>"+ingredients[i].quantity+"</textarea></td><td class='tdid' style='padding-left:10px;'><textarea id='unit"+(i+1)+"' name='unit"+(i+1)+"' class=\"input-edit\" maxlength='252' style='width: 250px;'>"+ingredients[i].unit+"</textarea></td><td><span class='ing-default-remove'>&times;</span></td></tr></div>"; */
          }
      }

     /* document.getElementById('stepsAndIngredientsDiv').innerHTML = buildHtml;*/
    }
    
    if(steps!=null){
      length = steps.length;
      numberOfSteps = length;
      //Dynamically creating steps as a list of textboxes
      for(var j=0;j<length;j++){
          steps_field = $(document.createElement('input'))
             .attr("type", "textarea")
             .attr("class", "input-edit")
             .attr("id", "step"+(j+1))
             .attr("value", steps[j]);
          var span_rmv=$(document.createElement('span'))
                        .attr( 'class','ing-default-remove')
                        .append("&times;")
          var li_step=$(document.createElement('li')).append(steps_field).append(span_rmv)
          $(".steps-field").append(li_step).append("<br />");

      }          
    }
    
    
      
}

function updateRecipe(){
    
    if(!validateRecipe("update-modal-content",".input-edit","updateDialog")){
        return;
    }
        
		// Create an empty recipe object which will be populated with recipe information
    var old_recipename={};
    let recipe_container={}
    recipe_container.old_name={};
		recipe_container.recipe = {};
		recipe_container.recipe.ingredients = [];
		recipe_container.recipe.directions = [];

		// Grab recipe name and prepTime TODO get cook time and number of servings
		recipe_container.recipe.name = $("#recipe_name_edit").val();
		recipe_container.recipe.prep_time = $("#prep_time_edit").val();
    recipe_container.recipe.cook_time = $("#cook_time_edit").val();
    recipe_container.recipe.num_servings = $("#serving_size_edit").val();

    old_recipename.name=$("#recipeList option:selected").text()
    console.log("upto edit")
    flag=1
    var ing_count = $('.ingredient-fields li').length;

   
    // FOR NEWLY ADDED FIELDS
    for (let i = 1; i <= ing_count; i++) {
    let ingredient_new = {};
      let new_ing_name = $('.ingredient-fields li:nth-of-type('+ i +') input:nth-of-type(1)').val();
      let new_ing_amt = $('.ingredient-fields li:nth-of-type('+ i +') input:nth-of-type(2)').val();
      let new_ing_type = $('.ingredient-fields li:nth-of-type('+ i +') select:nth-of-type(1)').val();

      ingredient_new.name = new_ing_name;
      ingredient_new.quantity = new_ing_amt;
      ingredient_new.unit = new_ing_type;

      recipe_container.recipe.ingredients.push(ingredient_new);
    }

    steps_count=$('.steps-field li').length;
    let current_Step="";
		// Grab all step information
		for (let i = 1; i <= steps_count;i++) {
			// Create empty object to fill individual ingredient information into
			//let step = {};
			//let stepId = '#step' + i;
      
			// Get info for the step
		  current_Step = $('.steps-field li:nth-of-type('+ i +') input').val();

			console.log('steps debug: '+steps_count + current_Step);

			// Push step
			recipe_container.recipe.directions.push(current_Step);
		}

        recipe_container.old_name=old_recipename;

        if(compare(currentRecipe,recipe_container.recipe)){
            popUpMessage("update-modal-content","Recipe is already up to date!",true,'updateDialog');
            return;
        }


		let url;
		if (window.location.href.includes('localhost')) {
			url = 'http://localhost:5000/update';
		} else if (window.location.href.includes('https://sous-chef-assistant.herokuapp.com/')) {
			url = 'https://sous-chef-assistant.herokuapp.com/update';
		} else if (window.location.href.includes('http://sous-chef-assistant.herokuapp.com/')) {
			url = 'http://sous-chef-assistant.herokuapp.com/update';
		} else if (window.location.href.includes('https://master-heroku-souchef.herokuapp.com/')) {
			url = 'https://master-heroku-souchef.herokuapp.com//update';
		} else if (window.location.href.includes('http://master-heroku-souchef.herokuapp.com/')) {
			url = 'http://master-heroku-souchef.herokuapp.com/';
		} else{
            url = 'https://session-management-souchef.herokuapp.com/update';
        }

		// Make an ajax call to post the data to the database
		$.ajax({
			contentType: 'application/json',
			url : url,
			type : 'POST',
			data : JSON.stringify(recipe_container),
			dataType:'text',

      async:false,

			// Let user know of success

			success : function(data) {
				console.log('post was successful!');
                currentRecipe = recipe_container.recipe;
                //function popUpMessage(divID,message,isError,id)
                popUpMessage("update-modal-content","Your recipe was updated successfully!",false,'updateDialog');
                $("#form-area_edit :input").prop("disabled", true);
                $('.input-edit').css("color","#777");
			},
			// Let user know of failure
			error : function(request,error)
			{
				console.log('post failed!');
				// Create failure elements
                popUpMessage("update-modal-content","Failed to update the recipe, try after sometime!",true,'updateDialog');
                $("#form-area_edit :input").prop("disabled", true);
                $('.input-edit').css("color","#777");
			}
		});
	 // end of button upload handler
	}

function deleteRecipe(recipe) {
  let request_doc = {};
  request_doc.recipeName = recipe.name

  let url;
  if (window.location.href.includes('localhost')) {
    url = 'http://localhost:5000/delete';
  } else if (window.location.href.includes('https://sous-chef-assistant.herokuapp.com/')) {
    url = 'https://sous-chef-assistant.herokuapp.com/delete';
  } else if (window.location.href.includes('http://sous-chef-assistant.herokuapp.com/')) {
    url = 'https://sous-chef-assistant.herokuapp.com/delete';
  } else if (window.location.href.includes('https://master-heroku-souchef.herokuapp.com/')) {
    url = 'https://master-heroku-souchef.herokuapp.com/delete';
  } else if (window.location.href.includes('http://master-heroku-souchef.herokuapp.com/')) {
    url = 'http://master-heroku-souchef.herokuapp.com/delete';
  }

  $.ajax({
		contentType: 'application/json',
		url : url,
		type : 'DELETE',
		data : JSON.stringify(request_doc),
		dataType:'text',

		// Let user know of success
		success : function(data) {
			console.log('post was successful!');
			// Create success element
              document.getElementById("responseTxt").innerHTML = "Your recipe was deleted successfully!";
			// Append to container div on page
			//$("#form-area").append(success_text).append("<br />");
		},

		// Let user know of failure
		error : function(request,error)
		{
			console.log('post failed!');
			// Create failure elements
              document.getElementById("responseTxt").innerHTML = "Failed to delete the recipe, try after some time";
			/*let failure_text = document.createElement('h3');
			failure_text.innerHTML = "Your recipe was not uploaded!";

			let failure_desc_text = document.createElement('p');
			failure_desc_text.innerHTML = "Please recheck your form data and try again";

			// Append to container div on page
			$("#form-area").append(failure_text).append("<br />").append(failure_desc_text); */
		}
	});
}

function fetchRecipe(){
  let url;
    if (window.location.href.includes('localhost')) {
        url = 'http://localhost:5000/cookbook';
    } else if (window.location.href.includes('https://sous-chef-assistant.herokuapp.com/')) {
        url = 'https://sous-chef-assistant.herokuapp.com/cookbook';
    } else if (window.location.href.includes('http://sous-chef-assistant.herokuapp.com/')) {
        url = 'http://sous-chef-assistant.herokuapp.com/cookbook';
    } else if (window.location.href.includes('https://master-heroku-souchef.herokuapp.com/')) {
        url = 'https://master-heroku-souchef.herokuapp.com/cookbook';
    } else if (window.location.href.includes('http://master-heroku-souchef.herokuapp.com/')) {
        url = 'http://master-heroku-souchef.herokuapp.com/cookbook';
    } else{
            url = 'https://session-management-souchef.herokuapp.com/cookbook';
    }

    
    //jquery }getJSON() isn't working for me, trying code from
    //if (window.location.href.includes('https://master-heroku-souchef.herokuapp.com/'))
    // https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested instead
    $.ajax({
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        url: url,
        success: function(result){
            console.log("hello");
            console.log(result);
            recipesDoc = result;
            //console.log("Here is the recipe json :"+recipesDoc.recipes.getJSON().toString());
            $.each(recipesDoc.recipes, function(index, value) {
                $("#recipeList").append($("<option></option>").attr("value",index)
                .text(value.name));
            });
            if (recipesDoc.recipes.length > 0){
                var defaultRecipe = recipesDoc.recipes[0];
                currentRecipe = defaultRecipe;
                 $.when(renderIngredientsAndSteps(defaultRecipe)).done(function(){
                        populate(defaultRecipe);
                        $("#form-area_edit :input").prop("disabled", true);

                 });
            }
            $("#recipeList").change(function() {
                var selected = $(this).val();
                console.log("input: " + selected);
                var  recipe = recipesDoc.recipes[parseInt(selected)];
                currentRecipe = recipe;
                document.getElementById('stepsList').innerHTML = "";
                document.getElementById('stepsAndIngredientsDiv').innerHTML = "";
                 $.when(renderIngredientsAndSteps(recipe)).done(function(){
                        populate(recipe);
                        $("#form-area_edit :input").prop("disabled", true);
                        $('.ing-default-remove').hide(); 
                 });
            });
           $('.ing-default-remove').hide();                        
        }
        

    });//ajax call to populate recipe ends.


}

$(document).ready(function() {
    fetchRecipe(); 
    $('#add_steps').hide();
    $('#add_ingredients').hide(); 
    $("#cancel").on("click",function(){
      document.getElementById('stepsList').innerHTML = "";
      document.getElementById('stepsAndIngredientsDiv').innerHTML = "";
      $.when(renderIngredientsAndSteps(currentRecipe)).done(function(){
              populate(currentRecipe);
              $("#form-area_edit :input").prop("disabled", true);
       }); 
      $("#form-area_edit :input").prop("disabled", true);
      $('.input-edit').css("color","#777");

    });
              
    $('.input-edit').css("color","#777");

    $("#enableEdit").on("click",function(){
        $("#form-area_edit :input").prop("disabled", false);
        $('.ing-default-remove').show();
        $('#add_steps').show();
        $('#add_ingredients').show();
        $('.input-edit').css("color","#eee");
         //Removes an ingredient after rendering 
        $('.ing-default-remove').click(function(){
          $(this).parent().remove();
        })
    });

   var countIngredients=numberOfIngredients;
   var countSteps=numberOfSteps;

    $("#add_steps").click(function(event){
        event.preventDefault();
        countSteps++;
        var steps_field = $(document.createElement('input'))
                         .attr("type", "textarea")
                         .attr("class", "input-edit")
                         
                         //.attr("id", stepId);
        var step_li=$(document.createElement('li'))                   
                    .append(steps_field)
                    .append("<span class='remove-step'>&times;</span>")
                    .append("<br />");

     
        $(".steps-field").append(step_li);
        $(".remove-step").click(function(){
            console.log("step removed");
            $(this).parent().remove();

        })
     
    });

            
    $("#add_ingredients").click(function(event){
        event.preventDefault();
        // alert("INg button clicked");
        countIngredients++;
        var ingredient_field = $(document.createElement('input'))
                                 .attr("type", "text")
                                 .attr("placeholder", "name")
                                 .attr("class", "input-1 input-edit")
                                 .attr("style","width: 252px");

        var amount_field = $(document.createElement('input'))
                             .attr("type", "text")
                             .attr("placeholder", "amount")
                             .attr("class", "input-1 input-edit")
                             .attr("style","width: 252px");

        var unit_field = $(document.createElement('select'))
                         .attr("name", " ")
                         .attr("class", "input-1 input-edit")
                         .attr("style","width: 252px")
                         .append("<option>Select...</option>")
                         .append("<option>unit</option>")
                         .append("<option>teaspoon</option>")
                         .append("<option>tablespoon</option>")
                         .append("<option>ounce</option>")
                         .append("<option>cup</option>")
                         .append("<option>gill</option>")
                         .append("<option>gram</option>")
                         .append("<option>pound</option>")
                         .append("<option>gallon</option>")
                         .append("<option>ml</option>")
                         .append("<option>liter</option>")
        
        var ingredient_li=$(document.createElement('li'))
                            //.append("<h2>"+"Ingredient: "+countIngredients+"</h2>")
                            .append(ingredient_field)
                            .append(amount_field)
                            .append(unit_field)
                            .append("<span class='remove-ig'>&times;</span>")
                            .append("<br><br>"); 

        $(".ingredient-fields").append(ingredient_li);
            

        $(".remove-ig").click(function(){
            //$(this).event.preventDefault();
            $(this).parent().remove();    
            console.log("Remove clicked")
        });
                    
    });

    $("#update").on("click",function(){
        
        updateRecipe();
        console.log("Upto update click")
        console.log("steps len:"+$(".steps-field li").length);
        location.reload();
      });


      $("#delete").on("click",function(){
        console.log(currentRecipe);
        deleteRecipe(currentRecipe);
        window.location.reload();
      });

});

function jsonCallback(jsonObject){
    console.log(jsonObject);
    recipesDoc = jsonObject;
}
