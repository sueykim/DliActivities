var webglMode = true;

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;

//todo load webgl supporting js's dynamically

$(document).ready(function() {	
	testVideoSupport();
	
	$('#feedback').hide();
	
	if(!window.WebGLRenderingContext){
		webglMode = false
	}
       // alert(webglMode)
	if ( getPassedParameters() == false){
	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/DiceGame_default.css";
	xmlFilename = mediaPath + "DiceGame_EnglishTestData.xml";
	jsonFilename = mediaPath + "DiceGame_EnglishTestData.js";
	//keyboardFilename = "sampleData/keyboard.js";
       }
       else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		$('.activity_hd').html('');
		$('.activity_description').html('');
	}
	cssFilename = "styles/dicegame_dliLearn.css";

	loadActivity(parseXml);
	
	$("#main").css("opacity", "0");
	$("#clickToRoll").css("display", "block");
}); 

var scrollbarLoaded = false;
function loadScrollbar(){
	if(!scrollbarLoaded){
		$("#keyboardContainer").mCustomScrollbar();
		scrollbarLoaded = true;
	}
}

function stageBubbles(pronounIndex, infinitiveIndex){
	var pronTop = (3 - pronounIndex) * 72 + 40;
	$('#pronoun_' + pronounIndex).animate( {
		left: '265px',
		top: pronTop + 'px'
	} );
	
	var infTop = (3 - infinitiveIndex) * 72 + 40;
	$('#infinitive_' + infinitiveIndex).animate( {
		left: '-269px',
		top: infTop + 'px'
	} );
}

function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

var PRONOUN_HEIGHT = 0;
var INFINITIVE_HEIGHT = 0;

function keyboardLoadCallback(){
	$(".div_submit").click(function(){
		submitClicked();
	});
	
	$(".div_del").click(function(){
		delClicked();
	});
	$(".div_space").click(function(){
                spaceClicked();
        });
	
	$("#keyboard > .letter").click(function(){
		letterClicked(this);		
	});
	
	$("#keyboard > div").addClass("noSelect");
	
	$("#keyboardContainer").css("opacity", "0");
}

function resetBubbles(){
	//boxes[0].shadowCast = true;
	//boxes[1].shadowCast = true;
	if(webglMode){
		boxes[0].shadowCast = false;
		boxes[1].shadowCast = false;
	}
	
	var i = 1;
	$("#main").find("div[id^='pronoun_']").each(function(){
		$(this).css("left","0px");
		$(this).css("top", (i * PRONOUN_HEIGHT) + "px");
		i++;
	});
	
	i = 1;
	$("#main").find("div[id^='infinitive_']").each(function(){
		$(this).css("left","0px");
		$(this).css("top", (i * INFINITIVE_HEIGHT) + "px");
		i++;
	});
}

//var pronounsAlreadyDrawn = new Array();
var infinitivesAlreadyDrawn = new Array();
//var randPronounValue;
//var randInfinitiveValue;
var userScore = 0;
var possibleScore = 0;

var rollAlreadyFinished = false;
function clickToRoll(){
	$("#clickToRoll").css("display", "none");
	$("#main").css("opacity", "1");
	
	rollAlreadyFinished = false;
	
	if(webglMode){
		resetPositions();
	}else{
		$("#img_dice1").attr("src", "")
		$("#img_dice2").attr("src", "")
		$("#videoTag").css("display", "block")
		$("#img_dice1").css("display", "none")
		$("#img_dice2").css("display", "none")
		$('#videoTag')[0].play()
	}
}

function activityVideoCompleted(){
	rollFinished()
} 

var diceRollLog;
var pronounDie;
var infinitiveDie;

function rollFinished(){
	if(rollAlreadyFinished){
		return;
	}
	
	rollAlreadyFinished = true;
	
	if($("#main").css("opacity") == "0"){
		return; //initial roll while canvas is hidden
	}
	
	$("#main").css("opacity", "1");
	
	secondTry = false;
	
	//Get random pronoun
	if(webglMode){
		pronounDie = matchDice(boxes[1].rotation);
		infinitiveDie = matchDice(boxes[0].rotation);
	}else{
		pronounDie = getRandomNumber(1, $(".pronoun").length)
		infinitiveDie = getRandomNumber(1, $(".infinitive").length)
	}
	
	//Has this pair been thrown before?
	//If so try to find an unmatched infinitive
	while(1){
		var infinitiveReplaced = false;
		
		for(var i = 0 ; i < diceRollLog.length ; i++){
			var log = diceRollLog[i];
			
			if(log.pronoun == pronounDie && 
					log.infinitive == infinitiveDie){
				//Get random infinitive
				infinitiveReplaced = true;
				infinitiveDie = getRandomNumber(1, $(".infinitive").length);
			}
		}
		
		if(!infinitiveReplaced){
			break;
		}
	}
	
	diceRollLog.push({pronoun:pronounDie, infinitive:infinitiveDie});
	
	/*if(pronounsAlreadyDrawn[pronounDie] == undefined){
		pronounsAlreadyDrawn[pronounDie] = true;
		randPronounValue = pronounDie;
	}else{
		while(1){
			randPronounValue = getRandomNumber(1, $(".pronoun").length);
			
			if(pronounsAlreadyDrawn[randPronounValue] == undefined){
				pronounsAlreadyDrawn[randPronounValue] = true;
				break;
			}
		}
	}
	
	if(infinitivesAlreadyDrawn[infinitiveDie] == undefined){
		infinitivesAlreadyDrawn[infinitiveDie] = true;
		randInfinitiveValue = infinitiveDie;
	}else{
		//Get random infinitive
		while(1){
			randInfinitiveValue = getRandomNumber(1, $(".infinitive").length);
			
			if(infinitivesAlreadyDrawn[randInfinitiveValue] == undefined){
				infinitivesAlreadyDrawn[randInfinitiveValue] = true;
				break;
			}
		}
	}*/
	
	//setDieOrientation(1, randPronounValue );
	if(webglMode){
		setDieOrientation(0, infinitiveDie );
		
		setTimeout(function(){
				boxes[0].position = [6,-3,-5];
				boxes[1].position = [-6,-3,-5];
				
				boxes[0].shadowCast = false;
				boxes[1].shadowCast = false;
				
				stageBubbles(pronounDie, infinitiveDie);
				
				$("#keyboardContainer").css("opacity", "1");			
			},1500);
	}else{
		$("#videoTag").css("display", "none")
		$("#img_dice1").css("display", "block")
		$("#img_dice2").css("display", "block")
		$("#img_dice1").attr("src", mediaPath + "png/" + pronounDie + ".png")
		$("#img_dice2").attr("src", mediaPath + "png/" + infinitiveDie + ".png")
		$("#videoContainer").css("background-image", "url('../common/img/bg_WITH_shadow.png')")
		stageBubbles(pronounDie, infinitiveDie)
		$("#keyboardContainer").css("opacity", "1")
	}
}


var questionCount;

function updateScore() {
	$("#scoreText").text(userScore + "/" + possibleScore);
}


function parseXml(t_xml){
	if(params["webglMode"] != undefined &&
		params["webglMode"] == "false"){
		webglMode = false
	}
	
	if(keyboardFilename.length == 0){
		keyboardLayout();
	}
	
	numSets = $(xml).find("section").length;
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");

	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
		
	/*//Randomize sets
	$(xml).find("section").each(function(){
		randomizeSet(this);		
	});*/
	
	questionCount = $(xml).find("verb").length * numTakes;
	
	if(webglMode){
		loadjscssfile("diceCode.js", "js", diceCodeLoaded)
	}else{
		startUpNoWebGL()
	}
}

function startUpNoWebGL(){
	webglMode = false;
	$("#canvas").css("display", "none")
	var file_video = "video.mp4";
	//alert(mediaPath)
	loadVideoNoPlayYet("sampleData/", removeFileExt(file_video), "DiceGame_html");
	document.getElementById('videoTag').addEventListener('ended', activityVideoCompleted);

	//Check that the ended event was in fact set
	if(document.getElementById('videoTag').ended == undefined){
		alert("Video ended event not supported. Activity unable to continue.")
		re
	}

	loadSet(currentSet);
}

function diceCodeLoaded(){
	if(!startUp()){
		startUpNoWebGL()
	}else{
		loadSet(currentSet);
	}
}

function keyboardLayout() {
	//Generate the characters that should be in the keyboard
	var kbHtml = '<div id="keyboard">';

	//var maxKeys = 20;
	var keyObj = {};
	
	$($(xml).find("conjugation").text().replace(/[ ]/g,"").toLowerCase().split("").filter(function(itm,i,a){
	    return i==a.indexOf(itm);
	})).each(function(i,val){	
		keyObj[val] = val;
	});
	
	$.each(keyObj, function(i,val){
		kbHtml += '<div class="letter noSelect">' +
						val + '</div>';
	});
	
	kbHtml += 	'<div class="div_space">Space</div>' +
	                '<div class="div_del">Del</div>' +
                        '<div class="div_submit">Submit</div></div>';
	
	$("#keyboardContainer").append($(kbHtml));
	
	$('#keyboard > .letter').shuffle(); 
	
	keyboardLoadCallback();
}

function spaceClicked(){
	$("#inputText").append(' ');

}
function delClicked(){
	var input = $("#inputText").text();
	
	if(input.length > 0){
		input = input.substring(0, input.length - 1);
		$("#inputText").text(input);
	}	
}

function letterClicked(node){
	$("#inputText").append($(node).html());
} 

function randomizeSet(xml){
	$(xml).find("item").shuffle()
}

var jSection;
var numItemsInSet = -1;
var maxNumberItemsInSet = 9;
var answeredItems = 0;
var answeredItemsInSet = 0;


function loadSet(value){
	currentSet = value;
	gotoNextQuestion = false;
	
	diceRollLog = new Array();
	//pronounsAlreadyDrawn = new Array();
	infinitivesAlreadyDrawn = new Array();
	
	////$(".dragBubbleTextContainer").shuffle();
	
	jSection = $($(xml).find("section")[currentSet]);

	//Load drag bubbles
	for(var i  = 1; i<maxNumberItemsInSet + 1; i++){
		var infinitive = $(jSection.find("pronoun")[i-1]).text();
		
		$('#pronoun_' + i).css("top", (i * PRONOUN_HEIGHT) + "px" );
		
		if(infinitive.length > 0){
			$('#pronounText_' + i).text(infinitive);
			$("#pronounTextContainer_" + i ).parent().css("display", "block");
		}else{
			$('#pronounText_' + i).text("");
			$("#pronounTextContainer_" + i ).parent().css("display", "none");
		}
	}
	
	//Load infinitives
	numItemsInSet = jSection.find("infinitive").length;
	answeredItemsInSet = 0;
	
	for(var i  = 1; i<maxNumberItemsInSet + 1; i++){
		var infinitive = $(jSection.find("infinitive")[i-1]).text();
		
		$('#infinitive_' + i).css("top", (i * INFINITIVE_HEIGHT) + "px" );
		
		if(infinitive.length > 0){
			$('#infinitiveText_' + i).text(infinitive);
			$("#infinitive_" + i).css("display", "block");
		}else{
			$('#infinitiveText_' + i).text("");
			$("#infinitive_" + i).css("display", "none");
		}
	}
	
	nextQuestion();
	
	loadScrollbar();
}

function showFeedback(value, textInput){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").show();
	//$("#clickGuard").css("display","block");
	
	var text = "";
	if (!isJapanese) {
		text = textInput;
	}
	else {
		// To display ruby tag
		text = displayRubyTag(textInput);
	}
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			break;
	}
	
	// To see attempts - temp
	/*
	if (homeworkStatus) {
		$("#feedback").css("z-index", "10");
		$("#keyboardContainer").css("z-index", "0");
	}
	*/
	
	$('#feedback').show();
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}

var secondTry = false;
var gotoNextQuestion = false;

function submitClicked(){
/*-check for correct word
	-if not then feedback incorrect
		-if second time then feedback incorrect and correct answer
	Answer:
		-tag the bubbles so we don't do them again
		-update questions answered status
		-update score
		-check for finished with set
			-if not last set load next set
				-clear all tagged bubbles
		-if last set do activity completed */
	var submitted = $("#inputText").text();
	var answer = $($(jSection.find("verb")[infinitiveDie - 1]).
								find("conjugation")[pronounDie - 1]).
								text();	
	
	//Logging
	/*
	logStudentAnswer(
		currentSet,
		answer,	
		submitted
	);
	
	if(secondTry){
		logStudentAnswerAttempts(
			currentSet,
			2);
	}else{
		logStudentAnswerAttempts(
			currentSet,
			1);
	}
	*/
	
	
	if(submitted.toLowerCase() == answer.toLowerCase()){
		//Correct
		answeredItems++;
		answeredItemsInSet++;
		
		userScore += infinitiveDie + pronounDie;
		possibleScore += infinitiveDie + pronounDie;	
	
		gotoNextQuestion = true;
		showFeedback("correct", answer)
	
		updateScore();
	}else{
		//Wrong
		if(secondTry){
			gotoNextQuestion = true;
			showFeedback("incorrect", 'The correct answer is "' + answer + '".');
			possibleScore += infinitiveDie + pronounDie;	

			answeredItems++;
			answeredItemsInSet++;
		
			updateScore();
		}else{
			secondTry = true;
			showFeedback("incorrect", "Please review your answer and try again");
		}
	}
}

function nextQuestion(){
	$("#clickToRoll").css("display", "block");
	$("#inputText").text("");
	$("#main").css("opacity", "0");
	$("#keyboardContainer").css("opacity", "0");
	updateQuestions();
	resetBubbles();

	// To see attempts - temp
	/*
	if (homeworkStatus) {
		$("#feedback").css("z-index", "10");
		$("#keyboardContainer").css("z-index", "0");
	}
	*/
}


function updateQuestions(){
		$("#answeredText").text((answeredItems + 1) + " out of " + questionCount);
}

function closeFeedback(){
	$('#feedback').hide();
	// To see attempts - temp
	/*
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	*/
	
	//$("#clickGuard").css("display","none");
	
	if(answeredItemsInSet == numItemsInSet){
		//Set is finished
		if(currentSet + 1 == numSets &&
			currentTake + 1 == numTakes){
			if(!activityCompletedShown){
				activityCompletedShown = true;
			        showFeedback("activity_completed");
				$("#feedbackBtn").css("display", "none");
				if(parent.activityCompleted){
					parent.activityCompleted(1,0);
				}
			}
		}else{
			loadNextSet();
		}
	}else if(gotoNextQuestion){
		//Set is not finished
		nextQuestion();
		gotoNextQuestion = false;
	}
	
	// For homework
	if (homeworkStatus) {
		checkAnswers();
	}
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var activityCompletedShown = false;

var currentTake = 0;
var numTakes = 2;

function loadNextSet(){
	if(currentTake + 1 != numTakes ){
		currentTake++;
		loadSet(currentSet);		
	}else{
		currentTake = 0;
		loadSet(currentSet + 1);
	}
}

// For homework
function checkAnswers(){
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";

	answerAttemptsNum++;

	questionID = parseInt(currentSet.toString());
	answer = "--";
	context = "--";
	answerAttempts = answerAttemptsNum.toString();
	
	// To see attempts - temp
	//$("#feedbackText").html("Homework//answerAttempts: " + answerAttempts + " - " + questionID);
		
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	// To see attempts - temp
	/*
	$('#feedbackText').show();
	$("#feedback").css("z-index", "0");
	$("#keyboardContainer").css("z-index", "10");
	*/
}