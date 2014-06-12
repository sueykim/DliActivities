$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').hide();
	$("#feedbackBtn").hide();


	mediaPath = "sampleData/";
	xmlFilename = "sampleData/enabling04_noNamespaces.xml";
	jsonFilename = "sampleData/enabling04_noNamespaces.js";
	//keyboardFilename = "sampleData/test_keyboard.js";
	cssFilename = "styles/enabling_04_dlilearn.css";
	
	$('.activity_hd').html('');
	$('.activity_description').html('');	
	loadActivity(parseXml);

	if(params["debug"] != null){
		showAnswers = true;
	}
	
	if(!showAnswers){
		$("#word").css("-moz-user-select", "none");
		$("#word").css("-webkit-user-select", "none");
	}
}); 


var showAnswers = false;

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;

function parseXml(t_xml){
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	if(keyboardFilename.length == 0){
		keyboardLayout();
	}
	var tally = 0;
	$(xml).find("image").each(function(){
		$("#carousel1").append('<img id="img_' + tally + '" class = "cloudcarousel" ' + 
					' src="' + mediaPath + '/png/' + $(this).text() + '" alt="Flag 1 Description" ' + 
					' title="Flag 1 Title" onclick="imageClicked(' + tally + ')"/>');
		tally++;
	})
	
	carousel = $("#carousel1").CloudCarousel(		
		{			
			xPos: 260,
			yPos: -30,
			altBox: $("#alt-text"),
			titleBox: $("#title-text"),
			yRadius: -10,
			yCentre: 30
		}
	);
	
	$("#carousel1 div").css("left", "163px");
	$("#carousel1 div").css("top", "50px");
	
}

var scrollbarLoaded = false;
function loadScrollbar(){
	if(!scrollbarLoaded){
		$("#keyboardContainer").mCustomScrollbar();
		scrollbarLoaded = true;
	}
}

function keyboardLayout() {
	//Generate the characters that should be in the keyboard
	var kbHtml = '<div id="keyboard">';
	
	var maxKeys = 20;
	var keyObj = {};
	//Load the necessary keys first
	$(xml).find("[missing_letter]").each(function(i,val){	
		keyObj[$(this).attr("missing_letter")] = 
				$(this).attr("missing_letter");
	});
	
	//Load the distractors next
	var output = ""
	var first = true;
	$(xml).find("lang_tl_word_text").each(function(i,val){
	    if(first){
	        first = false;
	        output = $(this).text();   
	    }else{
	        output += "||" + $(this).text();
	    }
	});
	
	$.each(output.replace(/[ ]/g, "").split("||"), function(i,val){
		keyObj[val] = val;				
	});

	
	$.each(keyObj, function(i,val){
		kbHtml += '<button onclick="letterClicked(this)">' +
						val + '</button>'
	});
	
	kbHtml += '</div>';
	$("#keyboardContainer").append($(kbHtml));
	
	$('#keyboard > button').shuffle();
}
function prevClick(){
	timesTried = 0;
	mysteryLetterIndex = 0;
	
	if($("#selectedImageDiv").hasClass("selected")){
		setState("unselect");
	}
	
	rotate(1);
}

function setState(value){
	switch(value){
		case "select":
			$("#selectedImageDiv").removeClass("unselected");
			$("#selectedImageDiv").addClass("selected");
			
			$("#keyboardContainer").removeClass("unselected");
			$("#keyboardContainer").addClass("selected");
			
			$("#wordContainer").removeClass("unselected");
			$("#wordContainer").addClass("selected");
			
			$("#feedback").show();
			
			break;
		case "unselect":
			$("#selectedImageDiv").removeClass("selected");
			$("#selectedImageDiv").addClass("unselected");
			
			$("#keyboardContainer").removeClass("selected");
			$("#keyboardContainer").addClass("unselected");
			
			$("#wordContainer").removeClass("selected");
			$("#wordContainer").addClass("unselected");
			
			$("#feedback").hide();
			
			break;
	}
}

function nextClick(){
	timesTried = 0;
	mysteryLetterIndex = 0;
	
	if($("#selectedImageDiv").hasClass("selected")){
		setState("unselect");
	}
	
	rotate(-1);
}

var carousel;

function rotate(value){
	carousel.data('cloudcarousel').rotate(value);
}

function findTopImgId(){
	var images = $("#carousel1 div img");
	
	images.sort(function(a, b){
     	return (parseInt($(b).css('z-index')) - parseInt($(a).css('z-index')));
	});
	

	/* For testing
	var output = "";
	images.each(function(){
		output = output + $(this).attr("id") + "\n";
	});
	alert(output);*/
	
	return $(images[0]).attr("id");
}

function playAudio(){
	var file_audio = $($(xml).find("lang_tl_phrase_audio")[currentSelectedIndex]).text();
	audio_play_file(removeFileExt(file_audio) ,mediaPath);
}

var currentSelectedIndex = 0;
var timesTried = 0;
var item;
function imageClicked(index){
	//check if image is the front one
	if(findTopImgId() != "img_" + index){
		return;
	}
	
	currentSelectedIndex = index;
	
	//Check to see if the image has already been solved
	if($("#img_" + index).attr("src") == "../common/img/grayOut.png"){
		return;
	}
	
	//Image is the front one and unsolved
	setState("select");
	
	//Load image
	var imgPath = $("#img_" + index).attr("src");
	$("#selectedImage").attr("src", imgPath);

	//Construct and load the phrase
	item = $(xml).find("item")[index];
	var words = $(item).find("lang_tl_phrase_text").text().split("||");
	var hints = $(item).find("hint");
	var wordOrder = parseInt($(item).find("lang_tl_word_order").text()) - 1; 
	
	var output = "";
	//Loop words
	
	
	for(var i = 0; i< words.length; i++){
		
		var word = words[i];
		
		if(i == wordOrder){
			//At the substitution word
			var letters = word.split("");
			
			output = output + " ";
			
			//Loop through all letters
			for(var j = 0; j < letters.length; j++){
				var letter = letters[j];
				var substitutionFound = false;
				
				for(var k = 0; k < hints.length; k++){
					if(parseInt($(hints[k]).attr("letter_order")) == j + 1){
						delete hints[k];
						substitutionFound = true;
						break;
					}
				}
				
				//If letter is a substituion
				if(substitutionFound){
					output = output + "<span class='hideText'>" + letter + "</span>";
				}else{
					//else, just append the letter to the word string
					output = output + letter ;
				}
			}
		}else{
			//Not substitution word so just append to output
			if(output.length != 0){
				output = output + " " ;
			}
			
			output = output + word ;
		}
	}
	
	$("#word").html(output);


	loadScrollbar();
	}


var mysteryLetter;
var mysteryLetterIndex = 0;
function letterClicked(node){
	timesTried++;
	
	//Grab the mystery letter
	mysteryLetter = $($("#word span")[mysteryLetterIndex]).text().toLowerCase();
	$($("#word span")[mysteryLetterIndex]).text($(node).html());
	$($("#word span")[mysteryLetterIndex]).removeClass("hideText");
	$($("#word span")[mysteryLetterIndex]).addClass("unhideText");
	
	
	if($(node).html().toLowerCase() == mysteryLetter){
		if(mysteryLetterIndex == $(item).find("hint").length - 1){
			showFeedback("correct", $($(xml).find("feedback")[currentSelectedIndex]).text());
		}else{
			showFeedback("correct", $($(xml).find("global_hint")[currentSelectedIndex]).text());
		}
		timesTried = 0;
	}else{
		if(timesTried == 2){
			showFeedback("incorrect", $(
										$(
											$(item).find("hint")
										)[mysteryLetterIndex]
									).text()
								);
			
			forceCorrect = true; //force it to grey out the item
			
			//Replace the mystery letter
			$($("#word span")[mysteryLetterIndex]).addClass("unhideText");
			$($("#word span")[mysteryLetterIndex]).removeClass("hideText");
			$($("#word span")[mysteryLetterIndex]).text(mysteryLetter);
			
			timesTried = 0;
		}else{
			forceCorrect = false;
			showFeedback("incorrect", $($(xml).find("global_hint")[currentSelectedIndex]).text());
		}
	}
}

function rotateUntilNotMatched(){
	timesTried = 0;
	mysteryLetterIndex = 0;
	mysteryLetter = "";
	rotate(1);
}

function grayOutImg(index){
	$("#img_" + index).attr("src", "../common/img/grayOut.png");
}

var lastFeedback;
var forceCorrect = false;

function showFeedback(value, textInput){
	$("#clickGuard").css("display","block");
	
	lastFeedback = value;
	//Clear the dialog box
    $('#feedback').html("");
	$('#feedback').html('<h2 id="feedbackHeader">Set completed</h2><p id="feedbackText">Set completed text</p><button id="feedbackBtn" onclick="{closeFeedback();}">OK</button>');
	$("#feedbackBtn").show();
	
	var text = "";
	if (!isJapanese) {
		text = textInput;
	}
	else {
		//todo To display ruby tag
		text = displayRubyTag(textInput);
	}
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_correct.png">');
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("Next Activity");
			$("#feedbackBtn").css("height", "55px");
			break;
	}
	
	$('#feedback').show();
	if ($("#feedbackText").height()> 205) {
		$("#feedbackText").css({"height": "210px", "padding":"0px 0px 0px 10px"});
		$("#feedbackText").mCustomScrollbar();
	}
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}

function closeFeedback(){
	$("#clickGuard").css("display","none");
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	
	//Replace the mystery letter
	$($("#word span")[mysteryLetterIndex]).addClass("hideText");
	$($("#word span")[mysteryLetterIndex]).removeClass("unhideText");
	$($("#word span")[mysteryLetterIndex]).text(mysteryLetter);
	
	if(lastFeedback == "correct" || forceCorrect){
		if(mysteryLetterIndex == $(item).find("hint").length - 1){
			setState("unselect");
			
			grayOutImg(currentSelectedIndex);
			
			forceCorrect = false;
			if(!checkCompleted()){
				rotateUntilNotMatched();
			}
		}else{
			$($("#word span")[mysteryLetterIndex]).addClass("unhideText");
			$($("#word span")[mysteryLetterIndex]).removeClass("hideText");
			$($("#word span")[mysteryLetterIndex]).text(mysteryLetter);
			
			mysteryLetterIndex++;
		}
	}
	
	if(!activityCompletedShown){
		if(checkCompleted()){
			activityCompletedShown = true;
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}else{
				showFeedback("activity_completed");
			}
		}
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

function checkCompleted(){
	//If not completed 
	for(var i=0; i < $(xml).find("item").length; i++){
	 	if($("#img_" + i).attr("src") != "../common/img/grayOut.png"){
			return false; //Not completed
		}
	}
	
	return true;
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
}
