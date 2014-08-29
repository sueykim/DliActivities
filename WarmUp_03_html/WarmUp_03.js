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
	
	//Default values (for testing)
		mediaPath = "sampleData/";	
		xmlFilename = mediaPath + "warmup03_no_namespaces.xml";
		jsonFilename = mediaPath + "warmup03_no_namespaces.js";
/*	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		//Default values (for testing)
		mediaPath = "sampleData/";	
		xmlFilename = mediaPath + "warmup03_no_namespaces.xml";
		jsonFilename = mediaPath + "warmup03_no_namespaces.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename  = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		jsonFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  ".js" ;
		
		$('.activity_hd').html('');
		$('.activity_description').html('');
	}
	
*/	
	$('.activity_hd').html('');
	$('.activity_description').html('');
	testVideoSupport();
	cssFilename = "styles/warmup_03_dliLearn.css";
	loadActivity(parseXml);
}); 

var numItems;

// To display ruby tag
var isJapanese = false;

function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/6);
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	
	$(xml).find("item").shuffle();
	
	loadSet(0);
}

function loadSet(value){
	currentSet = value;

	updateSetText();

	resetActivity();
	
	//Load bubbles
	for(var i=0; i< 6; i++){
		en_text = $(xml).find("item").eq(currentSet*6 + i).find("lang_en").text();
		lang_tl = $(xml).find("item").eq(currentSet*6 + i).find("lang_tl").text();
		
		$("#div_leftCol" + (i + 1) + " div").text(en_text);
		
		//$("#rightColLabel"+ (i + 1)).text(lang_tl);
		if (!isJapanese) {
			$("#rightColLabel"+ (i + 1)).html(lang_tl);
		}
		else {
			// To display ruby tag
			$("#rightColLabel"+ (i + 1)).html(displayRubyTag(lang_tl));
		}
	}

	$("div[id^=rightColLabel]").shuffle();
}

var completedArr = [];

function isSetCompleted(){
	for(var i=1; i<7; i++){
		if(completedArr[i] != true){
			return false;
		}
	}
	
	return true;
}


function resetActivity(){
	for(var i = 1; i < 7; i++){		
		$("#div_leftCol" + i).removeClass("divBtnDone");
		$("#div_leftCol" + i).addClass("divBtn");
		
		$("#div_rightCol" + i).removeClass("divBtnDone");
		$("#div_rightCol" + i).addClass("divBtn");
	}
	
	completedArr = [];
	
	$("div[id^=rightColLabel]").sortElements(function(a, b){
	    return $(a).attr("id") > $(b).attr("id") ? 1 : -1;
	});
	
	$("#videoContainer").html("");
}

function leftColDown(value){
	//If this bubble has already been solved then 
	//there is no need to do anything else.
	if(completedArr[value] == true){
		return;
	}
	
	currentLeftColIndex = value;

	var theItem = $(xml).find("item").eq(currentSet*6 + currentLeftColIndex - 1)
	var mediaType = theItem.find("media_type").text();
	var fileInput = theItem.find("file_input").text();
	
	switch(mediaType.toLowerCase()){
		case "video":
			var videoName = fileInput.substring(0, fileInput.lastIndexOf("."));
			loadVideo(mediaPath, videoName);
			break;
		case "image":
			$("#videoContainer").html($("<img src='" + mediaPath + "png/" 
													+ fileInput + "'></img>"))
			break;
	}

	var theAudio = theItem.find("file_audio").text();
	if (theAudio != undefined && theAudio.length > 0){
		audio_play_file(removeFileExt(theAudio),mediaPath);
	}	
	
	//Set left col bubble style
	$("#div_leftCol" + currentLeftColIndex).removeClass("divBtn");
	$("#div_leftCol" + currentLeftColIndex).addClass("divBtnSelected");
	
	//Set all bubble styles
	for(var i = 1; i < 7; i++){
		if(value == i){
			continue;
		}
		
		if(completedArr[i] == true){
			continue;
		}
		
		$("#div_leftCol" + i).removeClass("divBtnSelected");
		$("#div_leftCol" + i).addClass("divBtn");
	}
}

var currentLeftColIndex = -1;
var currentRightColIndex;
var itemCorrectToggle = false;

function rightColDown(value){
	itemCorrectToggle = false; //Just to make sure this isn't a problem
	
	if(currentLeftColIndex == -1){
		return;
	}
	
	currentRightColIndex = value.id.substr(value.id.length -1, 1);
	
	var labelSel = "#" + value.id + " div";
	var labelId = $(labelSel).attr("id");
	var currentRightColLabelIndex = labelId.substr(labelId.length -1, 1);

	$("#div_rightCol" + currentRightColIndex).addClass("divBtnSelected");

	var matchIndex = currentRightColLabelIndex;
	
	if(matchIndex == currentLeftColIndex){
		itemCorrectToggle = true;
		var feedbackText = $(xml).find("item").eq(
							currentSet*6 + currentLeftColIndex - 1).find("feedback").text();
		showFeedback("correct", feedbackText);
		completedArr[currentLeftColIndex] = true;
	}else{
		var feedbackText = $(xml).find("item").eq(
							currentSet*6 + currentLeftColIndex - 1).find("hint").text();
		showFeedback("incorrect", feedbackText);
	}
}

function swapDivs(oneIndex, twoIndex){
	var div_1 = $("#div_rightCol" + oneIndex).html();
	var div_2 = $("#div_rightCol" + twoIndex).html();
	$("#div_rightCol" + oneIndex).html(div_2);
	$("#div_rightCol" + twoIndex).html(div_1);
}



function loadNextSet(){
	if(currentSet + 1 == numSets){
            	if(parent.activityCompleted){
            		parent.activityCompleted(1,0);
            	}else{
		  showFeedback("activity_completed");
                  }
	}else{
	      loadSet(currentSet + 1);
	        }
}

function showFeedback(value, textInput){
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
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
			$("#feedbackText").html(text);
			break;
		case "completed":
			$("#feedbackHeader").html("Activity Completed");
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			
			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			}

			setCompletedShown = true;
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("OK");
			activityCompletedShown = true;
			break;
	}
	
	$('#feedback').show();
	
	$("#feedbackText").mCustomScrollbar();
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}
var completedFeedbackShown = false;
var setCompletedShown = false;
var activityCompletedShown = false;


function closeFeedback(){
	if($("#feedbackBtn").text()=="OK" && $("#feedbackHeader").text() != "Set Completed" && $("#feedbackHeader").text() != "Activity Completed")
             	answerAttemptsNum++;
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();

//        $("#div_leftCol" + currentRightColIndex).removeClass("divBtnSelected");
        $("#div_rightCol" + currentRightColIndex).removeClass("divBtnSelected");
        $("#div_rightCol" + currentLeftColIndex).addClass("divBtn");
	if(!activityCompletedShown){
		$("#clickGuard").css("display","none");
	}

	if(setCompletedShown){
		setCompletedShown = false;
		loadNextSet();
	}
	
	if(itemCorrectToggle){
		//Need this here to prevent this second from being run 
		//twice (if set completed feedback runs)
		itemCorrectToggle = false; 

		swapDivs(currentLeftColIndex, currentRightColIndex);
		$("#div_rightCol" + currentLeftColIndex).removeClass("divBtn");
		$("#div_rightCol" + currentLeftColIndex).addClass("divBtnDone");  // divBtnSelected
		$("#div_leftCol" + currentLeftColIndex).removeClass("divBtnSelected");
		$("#div_leftCol" + currentLeftColIndex).addClass("divBtnDone");
		currentLeftColIndex = -1;
		
		if(isSetCompleted()){
			showFeedback("set_completed");
		}
	}
	
	//checkActivityCompleted();

	
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

function rtMouseOver(obj){
	if(currentLeftColIndex != -1){
		mouseOver(obj);
	}
}

function rtMouseOut(obj){
	if(currentLeftColIndex != -1){
		mouseOut(obj);
	}
}

function mouseOver(obj){
	$(obj).removeClass("noHoverStyle");
	$(obj).addClass("hoverStyle");
}

function mouseOut(obj){
	$(obj).removeClass("hoverStyle");
	$(obj).addClass("noHoverStyle");
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
