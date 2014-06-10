$(document).ready(function() {
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = mediaPath + "levantine_enabling09_noNamespaces.xml";
		jsonFilename = mediaPath + "levantine_enabling09_noNamespaces.js";
/*		
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = mediaPath + "levantine_enabling09_noNamespaces.xml";
		jsonFilename = mediaPath + "levantine_enabling09_noNamespaces.js";
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
*/	
	cssFilename = "styles/enabling_09_dlilearn.css";
	testVideoSupport();
	
	//Create Drag Bubble
	for(var i  = 1; i<7; i++){
		$('#dragBubble_' + i).draggable({ revert: true, containment:"#main" });
	}
	
	//Create drop targets	
	for(var i  = 1; i<6; i++){
		$( "#dropTarget_" + i ).droppable({
			hoverClass: "dropTargetHover",
			drop: dropFunction}); 
	}
	
	loadActivity(parseXml);
}); 

var numItems;
var numItemsPerSet = 5;

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;

function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/5);
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	//Randomize sets
	//$(xml).find("item").shuffle()
	
	loadSet(0);
}

function loadSet(value){
	currentSet = value;
	
	setCompletedShown = false;
	
	$(".dragBubbleText").shuffle();
	
	$('.dragBubble').draggable( 'enable' );

	updateSetText();
	
	$(".dragBubble").css("display", "block");
	
	//Load drag bubbles
	for(var i  = 1; i<6; i++){
		$('#dragBubbleText_' + i).text(
				$($(xml).find("lang_en")[(currentSet*numItemsPerSet) + i - 1]).text()
			);
	}
	//Load the distractor
	var distracter = '';
	if (currentSet < numSets-1){
		distracter = $($(xml).find("lang_en")[((currentSet+1)*numItemsPerSet) + 2]).text();
	}
	else{
		distracter = $($(xml).find("lang_en")[((currentSet-1)*numItemsPerSet) + 2]).text();
	}
	$('#dragBubbleText_6').text(distracter);
	
	//Load drop bubbles
	for(var i  = 1; i<6; i++){
		$("#dropTarget_" + i).droppable( 'enable' );
		$("#dropTarget_" + i).removeClass("itemDropped");
		$("#dropTarget_" + i).addClass("itemNotCompleted");
		$("#dropTarget_" + i).removeClass("itemCompleted");
		
		
		$('#dropTargetText_' + i).text(
				$($(xml).find("lang_en")[(currentSet*numItemsPerSet) + i - 1]).text()
			);
		$('#dropTargetText_' + i).addClass("displayNone");
	}
        
 $(".dragBubbleText").mCustomScrollbar({
                contentTouchScroll:false   //// to make DragNdrop and mCustomscrollbar in a same box to be workable in an ipad (touch screen). Otherwise, DragNdrop doesn't work in an ipad.
                }); 
}

function playVideo(index){
	var file_video = $($(xml).find("file_video")[
					(currentSet*numItemsPerSet) + index - 1]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	//alert( file_video );
        loadVideo(mediaPath, file_video);
	
}

function extractLastLetter(value){
	return value.substr(value.length - 1, value.length);
}

function dropFunction(event, ui ) {
	$("#clickGuard").css("display","block");

	var dropTargetNumGot = extractLastLetter($(this).attr("id"));
	
	var dropTargetNumLookingFor = extractLastLetter(
							$(ui.draggable.find(".dragBubbleText")[0]).attr("id"));
		
	//Play audio
/*	var file_video = $($(xml).find("file_video")[
					(currentSet*numItemsPerSet) + (dropTargetNumGot - 1)]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideo(mediaPath, file_video);
*/	
	if(dropTargetNumLookingFor == dropTargetNumGot){
		$(ui.draggable).css("display", "none");
		$(this).addClass("itemCompleted");
		$(this).addClass("itemDropped");
		$(this).removeClass("itemNotCompleted");
		
		$(this).find(".dropTargetText").removeClass("displayNone");
	        $(this).find(".dropTargetText").mCustomScrollbar();
		
		showFeedback("correct", 
			$($(xml).find("feedback_l1")[(currentSet*numItemsPerSet) + (dropTargetNumGot - 1)]).text());
	}else{
		showFeedback("incorrect", 
			$($(xml).find("hint_l1")[(currentSet*numItemsPerSet) + (dropTargetNumGot - 1)]).text());
	}	
}

function showFeedback(value, textInput){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	
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
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png" width="139px" height:38px">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png" width="122px" height:38px">');
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			
			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			}
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			////$("#feedbackBtn").html("Next Activity");
			$("#feedbackBtn").hide();
			break;
	}
	$("#feedbackText").mCustomScrollbar();

	//$('#feedback').show();
}

	
function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();

	$("#clickGuard").css("display","none");
	
	checkCompleted();
	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var setCompletedShown = false;
var activityCompletedShown = false;

function checkCompleted(){
	if(setCompletedShown && !activityCompletedShown){
		//Check for activity completed
		loadNextSet();
	}else if(!setCompletedShown){
		//Check for set completed
		if($(".displayNone").length == 0){
			setCompletedShown = true;
			showFeedback("set_completed");
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
			$("#clickGuard").css("display","block");
		}else{
			showFeedback("activity_completed");
                        $("#clickGuard").css("display","block");
		}
	}else{
		loadSet(currentSet + 1);
	}
}

function getPassedParameters()
{
	mediaPath = getURL_Parameter("mediaPath");
	xmlPath   = getURL_Parameter("xmlPath");
	return mediaPath != 'undefined';
}
function getURL_Parameter(param) {
    var urlQuery = location.href.split("?")
    if (typeof urlQuery == 'undefined')
        return 'undefined';

    if (urlQuery.length < 2)
        return 'undefined';

    var urlItems = urlQuery[1].split("&")
    var paramCount = urlItems.length;
    for (i = 0; i < paramCount; i++) {
        paramItem = urlItems[i].split("=");
        paramName = paramItem[0];
        paramValue = paramItem[1];

        if (param == paramName) {
            return paramValue;
        }
    }
    return 'undefined';
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
	
	//$('#feedbackText').show();

	if ($("#feedbackHeader").html() == "Set Completed") {
		answerAttemptsNum--;
	}
}
