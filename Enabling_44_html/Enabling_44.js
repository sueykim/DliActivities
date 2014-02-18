var currentSet = 0;
var itemTotal = 0;
var itemXML;
var textDirection = "LeftToRight";
var steps = new Array();
var moveInterval;
var wordDisplayInterval;
var currentTimePosition = 0;
var answerAttempts = 0;


$(document).ready(function() {	
	$('#feedback').hide();

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_44.css";
	xmlFilename = mediaPath + "enabling44_categorization.xml";
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
	testVideoSupport();
	for (var i = 0; i < setCount; i++)
	{
		var thisStep = $(xml).find("step")[i];
		var stepItem = new Step(thisStep, i);
		var containerWidth = parseInt($("#mainBox").css("width"));
		var containerHeight = parseInt($("#mainBox").css("height"));
		stepItem.setScatteredLocations(containerWidth, containerHeight);
		steps.push(stepItem);
	}

	loadSet(0);
}

function loadSet(setIndex)
{
	answerAttempts = 0;
	clearInterval(wordDisplayInterval);
	clearInterval(moveInterval);

	$("#replaceWordsLink").hide();
	$("#checkAnswerLink").hide();
	$("#activityNavButtons").hide();
	currentTimePosition = 0;
	currentSet = setIndex;  // required
	clearView();
	displayCategoryWords(setIndex);

	if (!steps[currentSet].videoPlayedYet)
	{
		playVideo();
		var mediaLength = steps[currentSet].mediaLength;
	}
	else
	{
		// just show the words somewhat quickly
		$("#videoContainer").hide();
		reScatterWords();
		var mediaLength = -1;
	}

	wordDisplayInterval = setInterval(function() {
		currentTimePosition = currentTimePosition + 1000;
		displayTimedWords(mediaLength);
	}, 1000);



	audioInit();
	updateSetText();
	updateNavButtons();

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

function dropFunction(event, ui ) 
{
	var dropObj = $(this);
	var dragObj = $(ui.draggable);

	var dragCategory = dragObj.attr("id").split("_")[1];
	var dragID 		 = dragObj.attr("id").split("_")[2];

	var dropCategory = dropObj.attr("id").split("_")[1];
	var dropID 		 = dropObj.attr("id").split("_")[2];


	$(this).droppable( 'disable' );
	
	// ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
	$(dragObj).hide();
	$(dropObj).text( $(dragObj).text() );
	ui.draggable.draggable( 'option', 'revert', false ); 

	// attach the word object to the dropWord dom element
	$("#dragWord_{0}_{1}".format(dragCategory, dragID)).data('dropWordID', "{0}_{1}".format(dropCategory, dropID));

	if ((dropCategory == dragCategory)) // && (dragID == dropID))
	{
		steps[currentSet].categories[dragCategory].words[dragID].setCorrect();
	}
	else
	{
		steps[currentSet].categories[dropCategory].addIncorrectAnswer($(dragObj).text());
	}

	steps[currentSet].categories[dragCategory].words[dragID].isPlaced = true;

	if (steps[currentSet].allWordsPlaced())
	{
		$("#checkAnswerLink").show();
	}

}

function reScatterWords(maxWidth)
{
	clearInterval(moveInterval);
	maxWidth = typeof maxWidth == 'undefined' ? 0 : maxWidth;
	var containerWidth = parseInt($("#mainBox").css("width"));
	var containerHeight = parseInt($("#mainBox").css("height"));
	steps[currentSet].excludedAreas = [];
	steps[currentSet].setScatteredLocations(containerWidth - maxWidth, containerHeight);
	scatterWords();
}

function scatterWords()
{
	steps[currentSet].clearWrongAnswers();
	moveInterval = setInterval(function() {
		steps[currentSet].scatterWords();
	}, 5);

	// setTimeout(function() {
	// 	clearInterval(moveInterval);
	// }, 6000);

} 

function checkAnswers()
{
	answerAttempts++;	
	var stepObj = steps[currentSet];
	var wordCount = stepObj.wordCount();
	var correctCount = setDropCompletedDropStyles();

	// log student answer / attempts
	var contextArr = stepObj.getAllWords();
	var answerArr = stepObj.getStudentAnswers();
	var context = '';
	var answer = '';

	for (var i = 0; i < contextArr.length; i++) context += contextArr[i] + ' ';
	for (var i = 0; i < answerArr.length; i++) answer += answerArr[i] + ' ';

	logStudentAnswer(currentSet, answer, context);
	logStudentAnswerAttempts(currentSet, answerAttempts);

	// update ui accordingly
	if (correctCount < wordCount)
	{
		stepObj.complete = false;
		$("#replaceWordsLink").show();
		showFeedback('incorrect', stepObj.hint)
	}
	else
	{
		stepObj.complete = true;
		showFeedback('correct', stepObj.feedback)
		$("#replaceWordsLink").hide();
		if (isActivityComplete())
		{
			parent.framework.ActivityComplete();
		}
	}
	$("#checkAnswerLink").hide();
}

function isActivityComplete()
{
	var correctCount = 0;
	for (var i = 0; i < steps.length; i++)
	{
		if (steps[i].complete == true) correctCount++;
	}

	return correctCount == steps.length;
}

