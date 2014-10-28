// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	var statusParameters = getPassedParameters();
	
	//Default values (for testing)
	mediaPath = "sampleData/";		
	xmlFilename = "sampleData/WarmUp_04_noNamespaces.xml";
	jsonFilename = "sampleData/WarmUp_04_noNamespaces.js";

	
	$('.drag').draggable({ revert: true });

	$( "#drop" ).droppable({
		hoverClass: "dropTargetHover",
		drop: dropHandler}); 
		
	cssFilename = "styles/warmUp_04_dliLearn.css";
	loadActivity(parseXml);
}); 

var numSets = 0;
var NUM_DRAG_BUBBLES = 6;

var orderIndexArray = [];

// To display ruby tag
var isJapanese = false;

function parseXml(t_xml){
	numSets = Math.ceil($(xml).find("item").length / NUM_DRAG_BUBBLES);
	
	$(xml).find("item").shuffle();
		
		
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	loadSet(0);
}

var numAnsweredInSet = 0;

function loadSet(value){
	$('.drag').removeClass("correct");
	$('.drag').draggable( 'enable' );
	
	currentSet = value;
	updateSetText();
	
	orderIndexArray = [];
	numAnsweredInSet = 0;
	
	for(var i=0; i < NUM_DRAG_BUBBLES; i++){
		//Load drag bubble text
		//$("#drag" + i).text(
		//	$($(xml).find("tl_word")[i + (currentSet * NUM_DRAG_BUBBLES)]).text()
		//);
		if (!isJapanese) {
			$("#drag" + i).html(
				$($(xml).find("tl_word")[i + (currentSet * NUM_DRAG_BUBBLES)]).text()
			);
		}
		else {
			// To display ruby tag
			$("#drag" + i).html(
				displayRubyTag($($(xml).find("tl_word")[i + (currentSet * NUM_DRAG_BUBBLES)]).text())
			);
		}
		
		orderIndexArray[i] = i;
		
	}
	
	//Set up the order to display the drop targets
	orderIndexArray = shuffleArray(orderIndexArray);
	
	loadStage();
}

var audioFile;
var currentDropItem;

function loadStage(){
	currentDropItem = $($(xml).find("item")[
						(currentSet * NUM_DRAG_BUBBLES) + 
						orderIndexArray[numAnsweredInSet]]);
	
	//image
	var fileName = $($(currentDropItem).find("image")).text();
	$("#stageImg").attr("src", mediaPath + "png/" + fileName);
	
	//audio
	audioFile = $($(currentDropItem).find("audio")).text();
	
}

function dropHandler(event, ui ){
	var dragIndex = extractLastNumber($(ui.draggable).attr("id"));
	
	if(orderIndexArray[numAnsweredInSet] == dragIndex){
		$(ui.draggable).addClass("correct");
		$(ui.draggable).draggable( 'disable' );
		$(ui.draggable).text($($(currentDropItem).find("en_word")).text())
		
		//$("#correctAnswer").text($(ui.draggable).text());
		$("#correctAnswer").html($(ui.draggable).html());
		
		showFeedback("correct", $($(currentDropItem).find("feedback")).text())
	}else{
		showFeedback("incorrect", $($(currentDropItem).find("hint")).text())
	}
	
}

function playAudio(){
	audio_play_file(removeFileExt(audioFile),mediaPath);
}


var feedbackState;
function showFeedback(value, textInput){
	feedbackState = value;
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	
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
			
			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			}
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("Next Activity");
			break;
	}
	
	$('#feedback').show();
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}

var activityCompletedShown = false;

function closeFeedback(){
	if($("#feedbackBtn").text()=="OK" && $("#feedbackHeader").text() != "Set Completed")
	    answerAttemptsNum++;

	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#correctAnswer").text("");
	
	if(!activityCompletedShown){
		$("#clickGuard").css("display","none");
	}
	
	switch(feedbackState){
		case "correct":
			feedbackState = "";
			
			numAnsweredInSet++;
			if(numAnsweredInSet == NUM_DRAG_BUBBLES){
				showFeedback("set_completed");
			}else{
				loadStage();
			}
			
			break;
		case "set_completed":
			if(!activityCompletedShown){
				loadNextSet();
			}
			
			break;
	}

	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/

	// For homework
	if (homeworkStatus) {
		checkAnswers();
	}
}

var setCompletedShown = false;
var activityCompletedShown = false;


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

	////answerAttemptsNum++;  

	questionID = parseInt(currentSet.toString());
	answer = "--";
	context = "--";
	answerAttempts = answerAttemptsNum.toString();
	
	// To see attempts - temp
	//$("#feedbackText").html("Homework//answerAttempts: " + answerAttemptsNum.toString());

	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	//$('#feedbackText').show();
}