var currentSet = 0;
var currentAudio = "";
var itemTotal = 0;
var itemXML;
var textDirection = "LeftToRight";
var scenarioTableTitle;
var activitySets = new Array();

$(document).ready(function() {	
	$('#feedback').hide();

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_56.css";
	xmlFilename = mediaPath + "enabling56_sample.xml";
	jsonFilename = mediaPath + "enabling56_sample.js";
	keyboardFilename = "../common/keyboards/test_keyboard.js";
	audioInit();
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
	numSets = $(xml).find("set").length;
	initializeSets(numSets, function() {
		loadSet(currentSet);
	});
}

function initializeSets(setCount, callback)
{
	scenarioTableTitle = $(xml).find("scenarioTableTitle").text();
	for (var i = 0; i < setCount; i++)
	{
		var thisSet = $(xml).find("set")[i];
		var activitySet = new ActivitySet(thisSet);
		activitySets.push(activitySet);
	}

	if (typeof callback == "function") callback();
}

function loadSet(setIndex)
{
	currentSet = setIndex;
	updateSetText();
	updateNavButtons();
	setScenarioTitles(activitySets[setIndex]);
	showScenarioTable(activitySets[setIndex]);
}

function checkAnswer(rowID)
{
	var setObj = activitySets[currentSet];
	// preserve selected row
	setObj.activityTable.setSelectedRow(rowID);	

	// remove all borders
	$(".tableRow").removeClass("rowBorderCorrect");
	$(".tableRow").removeClass("rowBorderWrong");

	// Check Answer
	var isCorrect = setObj.activityTable.rows[rowID].isCorrect();
	// apply border
	var borderStyle = isCorrect ? "rowBorderCorrect" : "rowBorderWrong";
	$("#row_{0}".format(rowID)).addClass(borderStyle);

	if (!isCorrect)
	{
		setObj.wrongAnswerCount++;
		if (setObj.wrongAnswerCount > 2)
		{
			// show feedback for correct.  Mark and highlight correct
			setCorrectRow();
			var activityComplete = setScenarioComplete();
			if (!activityComplete)
			{
				showFeedback("incorrect", setObj.correctFeedback);
			}
		}
		else if (setObj.wrongAnswerCount > 1)
		{
			showFeedback("hint", setObj.hint);
		}
	}
	else
	{
		// correct answer
		var activityComplete = setScenarioComplete();
		if (!activityComplete)
			showFeedback("correct", setObj.correctFeedback);
	}
	setFeedBackStatus(isCorrect);
	if (activityComplete)
	{
		showFeedback("activity_completed", setObj.correctFeedback); 
		if (typeof parent.framework != "undefined")
		{
			parent.framework.ActivityComplete();
		}
	}
}

function setScenarioComplete()
{
	var setObj = activitySets[currentSet];
	setObj.answeredCorrectly = true;

	// check to see if all scenarios are complete
	var completeCount = 0;
	for (var i = 0; i < activitySets.length; i++)
	{
		if (activitySets[i].answeredCorrectly)
			completeCount++;
	}

	return completeCount == activitySets.length;
}