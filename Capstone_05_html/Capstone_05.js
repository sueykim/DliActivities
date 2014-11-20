$(document).ready(function() {
	audioInit();
	
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedback').hide();
	
	// Default values (for testing)
	//mediaPath = "sampleData/";
	cssFilename = "styles/Capstone_05_default.css";
	
	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		
		// For performance
		xmlFilename = mediaPath + "vb_02_01_06_05_noNamespaces.xml";
		jsonFilename = mediaPath + "vb_02_01_06_05_noNamespaces.js";
	}
	/*
	else {
		// For performance
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
	}
	*/

	testVideoSupport();
	
	loadjscssfile("../common/css/dlilearn_activities.css", "css");
	loadActivity(parseXml);
});

var numItemsPerSet = 0;

// to put responses
var responseArray = [];

var setObject;
var setObjectArray = [];
var tempResponses;

// To show feedback for second incorrect answer
var feedbackForSecondIncorrectAnswerTextArray = [];

// To differentiate clickGuard height depending on number of items either under 6 or maximum 8
var maxResponseLength = 0;

// To check answer status 
// 0: no trial, 1: first incorrect answer, 2: second incorrect answer, 3: correct answer
var answerItemStatusArray = [];  

// To display ruby tag
var isJapanese = false;

String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

function parseXml(t_xml){
	xml = t_xml;
	numSets = $(xml).find("item").length;
	
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	
	// Randomize sets
	$(xml).find("item").shuffle();
	
	// To show feedback for second incorrect answer
	$(xml).find("item").each(function(){
		var tempResponse = "";
		$(this).find("response").each(function(){
			tempResponse += $(this).text() + "<br>";
		});
		feedbackForSecondIncorrectAnswerTextArray.push(tempResponse);
	});
	
	// Randomize responses on sets
	$(xml).find("item").each(function(){
		randomizeSet(this);
	});
	
	answerItemStatusArray = new Array(numSets);
	for(var i=0; i<numSets; i++){
		answerItemStatusArray[i] = 0;
	}
	
	$(xml).find("item").each(function(){
		setObject = new Object();
		
		var tempResponseArray = [];
		$(this).find("response").each(function(){
			tempResponseArray.push($(this).attr("sequen"));
		});
		responseArray.push(tempResponseArray);

		setObject.fileVideo = $(this).find("file_video").text();
		setObject.responseA = tempResponseArray;
		setObject.responseAnswered = tempResponseArray;
		setObject.hint = $(this).find("hint").text();
		setObject.feedback = $(this).find("feedback").text();
		setObjectArray.push(setObject);
	});
	
	// To differentiate interface depending on number of items either under 6 or maximum 8
	var responseLengthArray = [];
	$(setObjectArray).each(function(){
		responseLengthArray.push(this["responseA"].length);
	});
	
	maxResponseLength = Math.max.apply(null, responseLengthArray);	
	
	if (maxResponseLength > 6) {
		$('#feedback').css('max-height', '260px');
		$('#feedbackText').css('max-height', '164px');
		$('#choicesC5').css('height', '386px');
		$('#container_setDiv').css('top', '404px');
		$('#sortableDivOutside').css('height', '390px');
	}
	else {
		$('#feedback').css('max-height', '170px');
		$('#feedbackText').css('max-height', '74px');
		$('#choicesC5').css('height', '296px');
		$('#container_setDiv').css('top', '314px');
		$('#sortableDivOutside').css('height', '300px');
	}
	
	loadSet(0);

	// To integrate into the framework
	$('#prev').click(function () {
		prevClick();
	});
	
	$('#next').click(function () {
		nextClick();
	});

	$( "#sortableDiv" ).sortable({
		containment: "#sortableDivOutside", 
		axis: "y",
		update: function( event, ui ) {
			tempResponses = new Array();
			
			$(this).find('div').each(function(){
				tempResponses.push(setObjectArray[currentSet]["responseAnswered"][extractLastNumber($(this).attr("id"))]);
			});
		}
	});
	
}

function randomizeSet(xml){
	$(xml).find("response").shuffle();
}

function nextClick(){
	if(setBtnLock)
		return;

	if(currentSet != numSets - 1){
		setObjectArray[currentSet]["responseAnswered"] = tempResponses;
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(setBtnLock)
		return;
	
	if(currentSet != 0){
		setObjectArray[currentSet]["responseAnswered"] = tempResponses;
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;

function loadSet(value){
	currentSet = value;
	setCompletedShown = false;
	updateSetText();
	
	tempResponses = setObjectArray[currentSet]["responseAnswered"];
	
	//To show the feedback panel in the initial loading
	//$('#feedback').show();
	//Not to show the feedback panel in the initial loading
	$('#feedback').hide();
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	
	listOfResponses(currentSet);
	answeredStatusCheck(currentSet);
	
	if (answerItemStatusArray[value]>1) {
		//Load video
		playVideoHold(1);
		
		$('#checkAnswerBtn').prop('disabled', true);
		$('#checkAnswerBtn').text('Answered');
	}
	else {
		//Play video
		playVideo(1);
	
		$('#checkAnswerBtn').removeProp('disabled');
		$('#checkAnswerBtn').text('Check Answer');
	}
}

function listOfResponses(setNumber) {
	var itemNumber=0;
	
	$('#sortableOrderDiv').html("");
	$('#sortableDiv').html("");
	
	$(xml).find("item").each(function(){
		if (itemNumber == setNumber) {
			var responseId = 0
			
			for (var i = 0; i < setObjectArray[setNumber]["responseAnswered"].length; i++) {
				$(this).find("response").each(function(){
					if ( $(this).attr("sequen") == setObjectArray[setNumber]["responseAnswered"][i]) {
						$('#sortableOrderDiv').append('<div id="sortableOrderId_' + responseId 
							+ '" class="sortableOrderDivItem">' 
							+ (responseId+1) + '. '
							+ '</div>');
						
						$('#sortableDiv').append('<div id="sortableId_' + responseId 
							+ '" class="sortableDivItem boxBGForChoice">'
							+ '<span class="sortableSpanItem">'
							+ $(this).text()
							+ '</span>'
							+ '</div>');
						responseId++;
					}
				});
			};
		}
		itemNumber++;
	});
}

function clickCheckAnswerButton(){
	sortableItemStatusCheckAfterCheckAnswer(currentSet);
}

function sortableItemStatusCheckAfterCheckAnswer(setNumber) {
	var numberOfCorrectAnswers = 0;
	
	setObjectArray[currentSet]["responseAnswered"] = tempResponses;
	
	numItemsPerSet = setObjectArray[currentSet]["responseAnswered"].length;
	
	for (var i = 0; i < numItemsPerSet; i++) {
		if (i == setObjectArray[currentSet]["responseAnswered"][i]){
			numberOfCorrectAnswers++;
		}
	}
	
	if (numberOfCorrectAnswers == numItemsPerSet){
		answerItemStatusArray[setNumber]=3;
	}
	else{
		answerItemStatusArray[setNumber]++;
	}
	
	var feedbackForFirstIncorrectAnswer;
	
	if (numberOfCorrectAnswers < 2){
		feedbackForFirstIncorrectAnswer = numberOfCorrectAnswers + " out of " + numItemsPerSet  
			+ " answer is correct. Please try again.";
	}
	else{
		feedbackForFirstIncorrectAnswer = numberOfCorrectAnswers + " out of " + numItemsPerSet  
			+ " answers are correct. Please try again.";
	}
	
	if (answerItemStatusArray[setNumber]==3){
		showFeedback("correct",$($(xml).find("feedback")[currentSet]).text());
		$('#checkAnswerBtn').prop('disabled', true);
		$('#checkAnswerBtn').text('Answered');
	}
	else if (answerItemStatusArray[setNumber]==2){
		answerItemStatusArray[setNumber]++;
		
		////var feedbackForSecondIncorrectAnswerCombined = "The correct answer is:<br>" + $($(xml).find("hint")[currentSet]).text();
		var feedbackForSecondIncorrectAnswerCombined = "The correct answer is:<br>" + feedbackForSecondIncorrectAnswerTextArray[currentSet];
		showFeedback("incorrect",feedbackForSecondIncorrectAnswerCombined);
		
		$('#checkAnswerBtn').prop('disabled', true);
		$('#checkAnswerBtn').text('Answered');
	}
	else if (answerItemStatusArray[setNumber]==1){
		////var feedbackForFirstIncorrectAnswerCombined = "Hint:<br>" + feedbackForFirstIncorrectAnswer;
		var feedbackForFirstIncorrectAnswerCombined = "Hint:<br>" + $($(xml).find("hint")[currentSet]).text();
		showFeedback("incorrect",feedbackForFirstIncorrectAnswerCombined);
	}
	
	listOfResponses(currentSet);
}

function answeredStatusCheck(setNumber) {
	if (answerItemStatusArray[setNumber]<2){
		$('#clickGuard').css('display', 'none');
	}
	else{
		$('#clickGuard').css('display', 'block');
	}
}

function playVideoHold(index){
	var file_video = $($(xml).find("file_video")[currentSet]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideoNoPlayYet(mediaPath, file_video);
}

function playVideo(index){
	var file_video = $($(xml).find("file_video")[currentSet]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideo(mediaPath, file_video);
}

function showFeedback(value, textInput){
	//Enable the clickguard
	// To differentiate clickGuard height depending on number of items either under 6 or maximum 8
	if (maxResponseLength > 6) {
		$('#clickGuard').css('height', '450px');
	}
	else {
		$('#clickGuard').css('height', '360px');
	}
	
	$('#clickGuard').css('display', 'block');
	$('#clickGuard').css('z-index', $('#feedback').css('z-index')-2);
	
	//Clear the dialog box
	$("#feedbackHeader").removeClass('feedbackHeaderColor');
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
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
			$("#feedbackHeader").addClass('feedbackHeaderColor');
			$("#feedbackHeader").html('<img  id="incorrect_img"  alt="incorrect" src="../common/img/feedback_incorrect.png" style="width:139px;height:38px;" border="0">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img id="correct_img"  alt="correct" src="../common/img/feedback_correct.png" style="width:122px;height:38px;" border="0">');
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			break;
	}
	
	$('#feedbackHeader').show();
	$('#feedbackText').show();
	$('#feedbackBtn').show();
	$('#feedback').show();
	
	$("#feedbackText").mCustomScrollbar();
}

function closeFeedback(){
	//Not to show the feedback panel in the initial loading
	$('#feedback').hide();
	
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	
	if (answerItemStatusArray[currentSet]>1){
		$('#clickGuard').css('display', 'block');
		$('#clickGuard').css('z-index', '5');
		$('.playBtn').css('z-index', '6');
	}
	else{
		$('#clickGuard').css('z-index', '5');
		$('#clickGuard').css('display', 'none');
		$('.playBtn').css('z-index', '6');
	}
	
	// To differentiate clickGuard height depending on number of items either under 6 or maximum 8
	if (maxResponseLength > 6) {
		$('#clickGuard').css('height', '394px');
	}
	else {
		$('#clickGuard').css('height', '304px');
	}
	checkCompleted();
}

var completedFeedbackShown = false;

function checkCompleted(){
	var totalCorrectNumber = 0;
	
	for (var i = 0; i < answerItemStatusArray.length; i++) {
		if (answerItemStatusArray[i]==3) {
			totalCorrectNumber++;
		}
	}
	
	if(totalCorrectNumber==answerItemStatusArray.length){
		if(completedFeedbackShown){
			return;
		}
		
		completedFeedbackShown = true;
		
		playVideoHold(1);
		
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed");
		}
	}
	
	if (answerItemStatusArray[currentSet]>1 && totalCorrectNumber!=answerItemStatusArray.length){
		nextClick();
	}
}

function loadNextSet(){
	if(currentSet + 1 == numSets){
		activityCompletedShown = true;
	
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed");
		}
	}else{
		loadSet(currentSet + 1);
	}
}
