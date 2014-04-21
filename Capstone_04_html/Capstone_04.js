$(document).ready(function() {
	audioInit();
	
	$('#feedback').show();
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	$('#feedback').hide();

	$('#submitBtn').text("In Process");
	
	// To see the status of answering questions whether they are checked or not.
	$('#submitBtnDiv').hide();
	
	// Default values (for testing)
	//mediaPath = "sampleData/";
	cssFilename = "styles/Capstone_04_default.css";
	
	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		
		// For performance
		xmlFilename = xmlPath + "vb_02_01_06_04_noNamespaces.xml";
		jsonFilename = xmlPath + "vb_02_01_06_04_noNamespaces.js";
	}
	/*
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
	*/
	
	testVideoSupport();

	loadActivity(parseXml);
});

var numItems;
var numItemsPerSet = 2;

var answerItemArray = [];
var answerItemCheckedArray = [];
var answerItemResultArray = [];
var activityMode;

var choiceRadioButtonImageCheckedArray = [];
var correctAnswerArray = [];

// For homework
var homeworkStatus;
var answerAttemptsArray = [];

// To display ruby tag
var isJapanese = false;

// For homework
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
	numItems = $(xml).find("file_video").length;
	
	numSets = Math.ceil(numItems/numItemsPerSet);
	
	// EXAM for assessment and undefined for performance
	activityMode = $(xml).find("content").attr("mode");
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	
	// Randomize sets
	/* $(xml).find("item").each(function(){
		randomizeSet(this);		
	}); */

	answerItemArray = new Array(numSets);
	answerItemCheckedArray = new Array(numSets);
	answerItemResultArray = new Array(numSets);
	
	choiceRadioButtonImageCheckedArray.length = numItemsPerSet;
	correctAnswerArray = new Array(numItemsPerSet);
	
	// For homework
	answerAttemptsArray.length = numSets;
	for (var i=0; i<answerAttemptsArray.length; i++){
		answerAttemptsArray[i] = 0;
	}
	
	loadSet(0);

	// To integrate into the framework
	$('#prev').click(function () {
			prevClick();
		});
	$('#next').click(function () {
			nextClick();
		});
}

function randomizeSet(xml){
	$(xml).find("file_video").shuffle();
}

function nextClick(){
	if(setBtnLock)
		return;

	if(currentSet != numSets - 1){
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(setBtnLock)
		return;
	
	if(currentSet != 0){
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;

function loadSet(value){
	currentSet = value;
	setCompletedShown = false;
	updateSetText();
	
	//To show the feedback panel in the initial loading
	//$('#feedback').show();
	//Not to show the feedback panel in the initial loading
	$('#feedback').hide();
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	
	for(var i  = 1; i<3; i++){
		//$('#choiceText_' + i).text(
		//	$($(xml).find("choice")[(currentSet*numItemsPerSet) + i - 1]).text()
		//);

		if (i==1) {
			$('#choiceText_' + i).html("Movie A");
		}
		else {
			$('#choiceText_' + i).html("Movie B");
		}
	
		correctAnswerArray[i-1] = $($(xml).find("file_video")[(currentSet*numItemsPerSet) + i - 1]).attr("crrt");
		
		
		var file_video = $($(xml).find("file_video")[(currentSet*numItemsPerSet) + i - 1]).text();
		file_video = file_video.substring(0, file_video.lastIndexOf("."));
		var vidContainer = "videoContainer" + i;
		var vidTag = "videoTag" + i;
		loadVideo(mediaPath, file_video, vidContainer, vidTag, false );
		
	var videoTagInfo = document.getElementById("videoTag" + i);
	videoTagInfo.pause();
	}
	
	//Load question
	if (!isJapanese) {
		$('#questionText').html(
			(currentSet+1) + ". " + $($(xml).find("question")[currentSet]).text()
		);
	}
	else {
		// To display ruby tag
		$('#questionText').html(
			(currentSet+1) + ". " + displayRubyTag($($(xml).find("question")[currentSet]).text())
		);
	}
	
	//Load video
	//playVideoHold(1);
	
	//Load radio buttons
	for (var i=0; i<4; i++){
		$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_off.png');
	}
	
	radioButtonImageUnchecked(currentSet);
	
	$('.choice').click(function () {
		var clickedChoice = extractLastNumber($(this).attr("id"));
		for (var i=0; i<4; i++){
			if (i == (clickedChoice-1)){
				$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_on.png');
				choiceRadioButtonImageCheckedArray[i] = true;
			}
			else {
				$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_off.png');
				choiceRadioButtonImageCheckedArray[i] = false;
			}
		}
		radioButtonImageClick();
	});
}

// To use radio button image
function radioButtonImageClick(){
	radioButtonImageStatusCheck(currentSet);
}

function radioButtonImageStatusCheck(setNumber) {
	var selected = false;
	for (var i = 0; i < choiceRadioButtonImageCheckedArray.length; i++) {
		if (choiceRadioButtonImageCheckedArray[i]) {
			selected = true;

			// Inital, undefined
			answerItemArray[setNumber] = i;
			answerItemCheckedArray[setNumber] = selected;
			answerItemResultArray[setNumber] = correctAnswerArray[i];

			if (!(activityMode=="EXAM")){
				if (answerItemResultArray[setNumber]){
					// After answering correctly in each set
					// Enable the clickguard
					$('#clickGuard').css('height', '420');
					$('#clickGuard').css('display', 'block');
					$('#clickGuard').css('z-index', '5');
					$('.playBtn').css('z-index', '6');
					
					showFeedback("correct",$($(xml).find("feedback")[currentSet]).text());
				}
				else{
					showFeedback("incorrect",$($(xml).find("hint")[currentSet]).text());
				}
			}
			break;
		}
	}
	
	var checkedNumber = 0;
	var missingSets ="";
	for (var i = 0; i < answerItemCheckedArray.length; i++) {
		if (answerItemCheckedArray[i]) {
			checkedNumber++;
		}
		else{
			missingSets= missingSets + (i+1) + ", ";
		}
	}

	$('#submitBtn').text("In Process: " + missingSets);
	
	if (checkedNumber == answerItemCheckedArray.length){
		if (activityMode=="EXAM"){
			$('#submitBtn').text("SUBMIT");
			$('#submitBtnDiv').show();
		}
	}
}

function radioButtonImageUnchecked(setNumber) {
	if (!(activityMode=="EXAM")){
		if (!answerItemResultArray[setNumber]){
			$('#clickGuard').css('display', 'none');
		}
		else{
			$('#clickGuard').css('display', 'block');
			$('#feedbackHeader').hide();
			$('#feedbackText').hide();
			$('#feedbackBtn').hide();
			$('#clickGuard').css('height', '420');
		}
	}
	
	for (var i = 0; i < choiceRadioButtonImageCheckedArray.length; i++) {
		if (answerItemCheckedArray[setNumber]==undefined || i!=answerItemArray[setNumber]){
			$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_off.png');
		}
		else{
			$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_on.png');
		}
	}
}

function playVideoHold(index){
	var file_video = $($(xml).find("file_video")[currentSet]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideoNoPlayYet(mediaPath, file_video);
}

function playVideo(btnNo){
	var videoTagInfo = "videoTag" + (btnNo+1);

	for (var i=0; i<numItemsPerSet; i++) {
		if (i!= (btnNo)) {
			var vidTagNoPlay = "videoTag" + (i+1);
			window.document.getElementById(vidTagNoPlay).pause();
		}
	}
	
	var file_video = $($(xml).find("file_video")[(currentSet*numItemsPerSet) + btnNo]).text();
		file_video = file_video.substring(0, file_video.lastIndexOf("."));
		var vidContainer = "videoContainer" + (btnNo+1);
		var vidTag = "videoTag" + (btnNo+1);
	
	loadVideo(mediaPath, file_video, vidContainer, vidTag, false );
}

function showFeedback(value, textInput){
	//Enable the clickguard
	$('#clickGuard').css('height', '500');
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
			
			//$("#feedbackHeader").html("Incorrect");
			$("#feedbackHeader").html('<img  id="incorrect_img"  alt="incorrect" src="../common/img/feedback_incorrect.png" style="width:139px;height:38px;" border="0">');
			
			$("#feedbackText").html(text);
			break;
		case "correct":
			//$("#feedbackHeader").html("Correct");
			$("#feedbackHeader").html('<img id="correct_img"  alt="correct" src="../common/img/feedback_correct.png" style="width:122px;height:38px;" border="0">');
			
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			if (activityMode=="EXAM"){
				$("#feedbackText").html("Score: " + text + "%");
			}
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
	
	if (activityMode=="EXAM"){
		$('#clickGuard').css('z-index', '6');
		$('#clickGuard').css('display', 'block');
	}
	else{
		if (answerItemResultArray[currentSet]){
			$('#clickGuard').css('display', 'block');
			$('#clickGuard').css('z-index', '5');
			$('.playBtn').css('z-index', '6');
		}
		else{
			$('#clickGuard').css('z-index', '5');
			$('#clickGuard').css('display', 'none');
			$('.playBtn').css('z-index', '6');
		}
	}
	
	$('#clickGuard').css('height', '420');
	checkCompleted();
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var completedFeedbackShown = false;
var finalScore=0;

function checkCompleted(){
	if (!(activityMode=="EXAM")){
	    // For performance
		var totalCheckedNumber = 0;
		var totalCorrectNumber = 0;
			
		for (var i = 0; i < answerItemCheckedArray.length; i++) {
			if (answerItemCheckedArray[i]) {
				totalCheckedNumber++;
			}

			if (answerItemResultArray[i]) {
				totalCorrectNumber++;
			}
			
		}
		
		if(totalCorrectNumber==answerItemCheckedArray.length){
			if(completedFeedbackShown){
				return;
			}
			
			completedFeedbackShown = true;
		
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}else{
				clickSubmitButton();
				showFeedback("activity_completed", finalScore);
			}
		}
	}
	else{
    	// For assessment
		if(completedFeedbackShown){
			return;
		}
		
		completedFeedbackShown = true;
		
		//Check to see if we're in a container (such as Gateway)
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed", finalScore);
			
			//Enable the clickguard
			$('#clickGuard').css('display', 'block');
		}
	}
	
	// For homework
	if (homeworkStatus) {
		checkAnswers();
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

function clickSubmitButton(){
	var checkedNumber2 = 0;
	var missingSets = "";
	var correctAnswers = 0;
	
	for (var i = 0; i < answerItemCheckedArray.length; i++) {
		if (answerItemCheckedArray[i]) {
			checkedNumber2++;
		}
		else{
			missingSets= missingSets + i + ", ";
		}
		
		if (answerItemResultArray[i]) {
			correctAnswers++;
		}
	}
	
	finalScore =  Math.ceil((correctAnswers/answerItemCheckedArray.length)*100);

	checkCompleted();
}

// For homework
function checkAnswers(){
	answerAttemptsArray[currentSet]++;
	
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";
	
	var answerItemTextArray = [];
	var correctAnswerTextArray = [];
	
	if (!(activityMode=="EXAM")) {
		questionID = currentSet;
		answer = $('#choiceText_' + (answerItemArray[currentSet]+1)).text();
		context += $($(xml).find("question")[currentSet]).text() + " -- ";
		for (var i=0; i<correctAnswerArray.length; i++) {
			if (correctAnswerArray[i]) {
				context += $('#choiceText_' + (i+1)).text();
			}
		}
		answerAttempts = answerAttemptsArray[currentSet].toString();
		
		// To see attempts - temp
		//$("#feedbackText").html("Homework//answerAttemptsArray: " + "<br>"+ answerAttemptsArray.toString());
	}
	else {
		answerItemTextArray.length = numSets;
		correctAnswerTextArray.length = numSets;
		
		for (var i=0; i<correctAnswerTextArray.length; i++) {
			var correctAnswerTextTemp = "";
			
			correctAnswerTextTemp += $($(xml).find("question")[i]).text() + " -- ";
		
			for (var j=0; j<numItemsPerSet; j++) {
				if (j == answerItemArray[i]) {
					answerItemTextArray[i] = $($(xml).find("choice")[(i*numItemsPerSet) + j]).text();
				}
				if ($($(xml).find("choice")[(i*numItemsPerSet) + j]).attr("crrt")) {
					correctAnswerTextTemp += $($(xml).find("choice")[(i*numItemsPerSet) + j]).text();
				}
			}
			
			correctAnswerTextArray[i] = correctAnswerTextTemp;
		}
		
		answer = answerItemTextArray;
		context = correctAnswerTextArray;
		
		answerAttempts = "Score: " + finalScore + "%";
		
		// To see a score for assessment - temp
		//$("#feedbackText").html("Assessment HW// " + answerAttempts);
	}
	
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	//$('#feedbackText').show();
}
