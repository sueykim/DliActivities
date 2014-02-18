var currentSet = 0;
var itemTotal = 0;
var itemXML;
var textDirection = "LeftToRight";
var steps = new Array();

$(document).ready(function() {	
	$('#feedback').hide();

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_46.css";
	xmlFilename = mediaPath + "enabling46.xml";
	//jsonFilename = mediaPath + "enabling57_categorization.js";
	keyboardFilename = "../common/keyboards/test_keyboard.js";

	loadActivity(parseXml);  // loads any url parameter values then calls parseXml

}); 

String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

//parse xml
function parseXml(t_xml){
	xml = t_xml;
	numSets = $(xml).find("step").length;
	initializeSets(numSets, function() {
		loadSet(0);
	});
}

function initializeSets(setCount, callback)
{
	for (var i = 0; i < setCount; i++)
	{
		var thisStep = $(xml).find("step")[i];
		var stepItem = new Step(thisStep, i);
		steps.push(stepItem);
	}

	loadSet(0);
}

function loadSet(setIndex)
{
	currentSet = setIndex;  // required
	clearView();
	loadView();

	// common calls
	audioInit();
	updateSetText();
	updateNavButtons();
}

function storeValues(answerCount)
{
	var controlType = answerCount >= 2 ? "drop" : "edit";
	for (var messageIndex = 0; messageIndex < steps[currentSet].messages.length; messageIndex++)
	{
		var answers = new Array();
		var who 	= $("#{0}_who_{1}_{2}".format(controlType, currentSet, messageIndex)).val();
		var time 	= $("#{0}_time_{1}_{2}".format(controlType, currentSet, messageIndex)).val();
		var day 	= $("#{0}_day_{1}_{2}".format(controlType, currentSet, messageIndex)).val();
		var message = $("#edit_message_{0}_{1}".format(currentSet, messageIndex)).val();
		answers.push(who);
		answers.push(time);
		answers.push(day);
		answers.push(message);
		steps[currentSet].messages[messageIndex].storeAnswers(answers);
	}

}

function playIntro()
{
	$("#phoneImage").attr("src", "images/phone_still.gif");
	audio_play_file( steps[currentSet].introAudio.split(".")[0] , mediaPath);
	$("#introMessageText").show();

	if ($("#pickUpPhone").css("display") != "none")
	{
		buildTabs();
	}
}

function playMessage(messageIndex)
{
	audio_play_file( steps[currentSet].messages[messageIndex].audioFile.split(".")[0] , mediaPath);
}

function playHint(messageIndex, type)
{
	var audioHint = steps[currentSet].messages[messageIndex].getItemHint(type);
	audio_play_file( audioHint.split(".")[0] , mediaPath);
}

function checkMessageAnswers(messageIndex)
{
	storeValues(steps[currentSet].messages[messageIndex].checkCount);
	$(".incorrectAnswer").removeClass("incorrectAnswer");
	var wrongAnswers = steps[currentSet].messages[messageIndex].getWrongAnswers();
	var correctAnswers = steps[currentSet].messages[messageIndex].getCorrectAnswers();
	if (wrongAnswers.length == 0)
	{
		// all answered correctly
	}
	else
	{
		// disable correct answers
		for (var i = 0; i < correctAnswers.length; i++)
		{
			if (correctAnswers[i] != 'message')
			{
				// var selectedAnswer = $("#drop_{0}_{1}_{2}".format(correctAnswers[i], currentSet, messageIndex)).val();
				var selectedAnswer = steps[currentSet].messages[messageIndex].getStudentAnswer(correctAnswers[i]);

				$("#edit_{0}_{1}_{2}".format(correctAnswers[i], currentSet, messageIndex)).val(selectedAnswer);

				$("#Dropdown_{0}_{1}_{2}".format(correctAnswers[i], currentSet, messageIndex)).hide();					
				$("#edit_{0}_{1}_{2}".format(correctAnswers[i], currentSet, messageIndex)).show();


				$("#edit_{0}_{1}_{2}".format(correctAnswers[i], currentSet, messageIndex)).addClass("ui-state-disabled");
				$("#edit_{0}_{1}_{2}".format(correctAnswers[i], currentSet, messageIndex)).attr("disabled", "disabled"); 
			}
		}		


		if (steps[currentSet].messages[messageIndex].checkCount >= 2)
		{
			//$(".notepadFormItem").show();
			//$(".notepadDropdown").hide();

			// highlight wrong answers
			for (var i = 0; i < wrongAnswers.length; i++)
			{
				if (wrongAnswers[i] != 'message')
				{
					// Dropdown_time_0_0 show()
					// edit_time_0_0 hide()

					//$("#Dropdown_{0}_{1}_{2}".format(wrongAnswers[i], currentSet, messageIndex)).addClass("ui-state-disabled");
					$("#Dropdown_{0}_{1}_{2}".format(wrongAnswers[i], currentSet, messageIndex)).show();					
					$("#edit_{0}_{1}_{2}".format(wrongAnswers[i], currentSet, messageIndex)).hide();

					$("#drop_{0}_{1}_{2}".format(wrongAnswers[i], currentSet, messageIndex)).addClass("incorrectAnswer");
				}
			}
		}
		else
		{
			// highlight wrong answers
			for (var i = 0; i < wrongAnswers.length; i++)
			{
				$("#edit_{0}_{1}_{2}".format(wrongAnswers[i], currentSet, messageIndex)).addClass("incorrectAnswer");
				$("#EditBox_message_{0}_{1}".format(currentSet, messageIndex)).addClass("incorrectAnswer");
			}
		}

		if ($("#edit_message_{0}_{1}".format(currentSet, messageIndex)).val() != "")
		{
			$("#EditBox_message_{0}_{1}".format(currentSet, messageIndex)).removeClass("incorrectAnswer")
		}

	}
}

function debug(message, append)
{ 
	return;
	if (append)
		$("#debugDiv").append("<br />" + message);
	else
		$("#debugDiv").html(message);

	$("#debugDiv").show();
}

function checkAnswers()
{
	var stepObj = steps[currentSet];
}