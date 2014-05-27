$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	$("#clickGuard").css("display", "none");
    
	if(document.getElementById('audioPlayer').play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}
	
	////if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";
		xmlFilename = "sampleData/Enabling_68_sample.xml";
		jsonFilename = "sampleData/Enabling_68_sample.js";
////	}
/*	else{
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		$(".activity_hd").html('');
		$(".activity_description").html('');
	}  */

	setState(currentState);
	cssFilename = "styles/enabling_68_dlilearn.css";
	loadActivity(parseXml);
});

var jSection;

// To display ruby tag
var isJapanese = false;

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

function parseXml(t_xml){
        // To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

        // true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");

	numSets = $(xml).find("set").length;

	$(xml).find("set").each(function(){
		$($(this).find("item")).shuffle();
	});
	
	loadSet(0);
}

function loadSet(value){
	currentSet = value;
	jSection = $($(xml).find("set")[currentSet]);

	$($("#img_container").find("img")).shuffle();

	if(jSection.attr("completed") != undefined &&
		jSection.attr("completed") == "true"){
			itemCompleted = true;
			$('.itemImg').addClass("imageCompleted");
	}else{
		itemCompleted = false;
			$('.itemImg').removeClass("imageCompleted");
	}

	//Load images
	for(var i=0; i < jSection.find("item").length; i++){
		if(itemCompleted){
			$('#img' + i).attr("src",mediaPath + "png/" + $(jSection.find("image_color")[i]).text());
		}else{
			$('#img' + i).attr("src",mediaPath + "png/" + $(jSection.find("image_grey")[i]).text());
		}
	}
	
	generateIntroPage();

	updateNavButtons();
	
	numItems = 5; //todo
	
	//setState("greeting");
	//in case of "no grammar note"
	if($(jSection.find("explanation")).text().length > 0){
		//Show the intro page()
		setState("greeting");
	}else{
		setState("questions");
	}
	
	loadItem(0);
}

var currentItem = 0;
function loadItem(value){
	currentItem = value;
	//$('#itemText').text($(jSection.find("phrase_complete_TL")[currentItem]).text());
	if (!isJapanese) {
		$('#itemText').html($(jSection.find("phrase_complete_TL")[currentItem]).text());
	}
	else {
		// To display ruby tag
		$('#itemText').html(displayRubyTag($(jSection.find("phrase_complete_TL")[currentItem]).text()));
	}

        if($("#img" + currentItem).hasClass("imageCompleted")){
          $('#itemText').css('color', 'green')
          var itemTextHtml = $('#itemText').html();
          itemTextHtml += '<img  id="itemdone" src="../common/img/feedback_correct_icon.png" border="0">';
          $('#itemText').html(itemTextHtml);
//          alert($('#itemText').html())
        }else{
           $('#itemText').css('color', 'black')
        }
          
	updateItemNavButtons()
	if(currentItem != 0)
  	   $("#itemText").mCustomScrollbar();
}

var audioPlaying = false;

function playAudio(){
	audioPlaying = true;
	
	document.getElementById("nextItemBtnClickGuard").style.display = "block";
	document.getElementById("prevItemBtnClickGuard").style.display = "block";
	
	document.getElementById("nextBtnClickGuard").style.display = "block";
	document.getElementById("prevBtnClickGuard").style.display = "block";
	
	var file_audio = $(jSection.find("object_audio")[currentItem]).text();
	g_dontStart = true;
	audio_play_file(removeFileExt(file_audio), mediaPath );
	
	//todo - highlight words
	//var itemHtml = $("#itemText").text();
	var itemHtml = $("#itemText").html();

	var keyword = $(jSection.find("keyword_TL")[currentItem]).text();
	var re = new RegExp(keyword,"g");    
	
	var keyWBolded =  "<b>" + keyword + "<\/b>"
        var keyMatch = itemHtml.match(keyWBolded, "g")

        if(!keyMatch)
            itemHtml = itemHtml.replace(re,"<b>" + keyword + "</b>");
        ////else
          ////alert('match')


	$("#itemText").html(itemHtml);


	//add event listener for audio finished
	document.getElementById('audioPlayer').addEventListener('ended', audioEnded);
	document.getElementById('audioPlayer').play();	
}	

function imageClicked(value){
	if(audioPlaying == true){
		return;
	}

	if($("#img" + currentItem).hasClass("imageCompleted")){
		//Item  already finished so just ignore the click
		return;
	}
	
	var jItem = $(jSection.find("item")[currentItem]);
        if (homeworkStatus) {
      	   logStudentAnswer(
      		currentSet,
      		jItem.find("keyword_TL").text(),
      		$(jSection.find("keyword_TL")[value]).text()
      	   );
      	}

	if(jItem.attr("timesTried") == undefined){
		jItem.attr("timesTried", 1);
	}else{
		jItem.attr("timesTried",
			parseInt(jItem.attr("timesTried")) + 1
		);	
	}

	if (homeworkStatus) {
	   logStudentAnswerAttempts(
		currentSet,
		jItem.attr("timesTried"));
       }

	if(currentItem == value){
		feedbackCorrectShown = true;
                $('#itemText').css('color', 'green');
                $("#img" + currentItem).addClass("imageCompleted")
		showFeedback("correct", $(jSection.find("feedback")[value]).text());
	}else{
		//todo - show incorrect bubble
		showFeedback("incorrect", "");
	}
}

function showFeedback(value, textInput){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	$("#feedbackButtonImgContainer").html("");
			
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
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackButtonImgContainer").html(
					'');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_correct.png">');
			$("#feedbackButtonImgContainer").html(
					'');
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");

			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("OK");
			}
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").hide();
			////$("#feedbackBtn").html("");
			////$("#feedbackBtn").css("height", "24px");
			break;
	}
	$("#feedbackText").mCustomScrollbar();
	$('#feedback').show();

}


var feedbackCorrectShown = false;
var itemCompleted = false;
var setCompleted = false;
var activityCompletionShown = false;
function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#clickGuard").css("display","none");
	$("#feedbackButtonImgContainer").html("");

	//checkCompleteSet();
    
    if(feedbackCorrectShown){
    	feedbackCorrectShown = false;

    	$('#img' + currentItem).attr("src",mediaPath + "png/" + $(jSection.find("image_color")[currentItem]).text());
    	$('#img' + currentItem).addClass("imageCompleted")
//    	alert('$(".imageCompleted").length: ' + $(".imageCompleted").length)
//    	alert('jSection.find("item").length: ' + jSection.find("item").length)
    	var itemMaxLengthPerSet = Math.min(jSection.find("item").length, 5)
    	if($(".imageCompleted").length == itemMaxLengthPerSet){
    		setCompleted = true;
    		//alert('set completed');
    		jSection.attr("completed","true");
    		showFeedback("set_completed");
  	}else{
    		nextItemClick();
    	}
    }else if(setCompleted){
    	jSection.attr("completed","true");
    	nextClick();

    	if($(xml).find("set").length == 
    		$(xml).find("set[completed='true']").length &&
    		!activityCompletionShown){
    			activityCompletionShown = true;
//    			alert('all done');
    			if(parent.activityCompleted){
					parent.activityCompleted(1,0);
					$("#clickGuard").css("display","block");
				}else{
					showFeedback("activity_completed");
					$("#clickGuard").css("display","block");
				}
    		}
    }

}

function nextClick(){
	if(setBtnLock)
		return;
		
	if(currentSet == numSets - 1){
		
	}else{	
		loadSet(currentSet + 1);
                setCompleted = false;
	}
}

function audioEnded(){
	//$('#itemText').text($(jSection.find("phrase_complete_TL")[currentItem]).text());
	if (!isJapanese) {
		$('#itemText').html($(jSection.find("phrase_complete_TL")[currentItem]).text());
	}
	else {
		// To display ruby tag
		$('#itemText').html(displayRubyTag($(jSection.find("phrase_complete_TL")[currentItem]).text()));
	}

	updateItemNavButtons();
	updateNavButtons();
	audioPlaying = false;
        $("#itemText").mCustomScrollbar();
}


function playCallback(){
	//todo - Enable all elements
	//todo - images
}

function questionsClicked(){
	setState("questions");
}

function grammerNoteClicked(){
	setState("greeting");
}

function questionsUp(){
	$("#questionsButton").css("border-color","#F5F5F5");
}

function questionsOut(){
	$("#questionsButton").css("border-color","lightgray");
}

function questionsOver(){
	$("#questionsButton").css("border-color","#F5F5F5");
}

function playExAudio(value){
	var file_audio = $(jSection.find("object_audio")[value]).text();
	g_dontStart = false;
	audio_play_file(removeFileExt(file_audio), mediaPath );
}

function generateIntroPage(){
	//$("#explanationLabel").html($(jSection.find("explanation")).text());
	//$("#phraseTLLabel").text($(jSection.find("phrase_TL")).text());
	$("#phraseENLabel").text($(jSection.find("grammar_note phrase_EN")).text());
	
	
	//Todo - make this random
	$("#ex1PhraseENLabel").text($(jSection.find("item phrase_EN")[0]).text());
	//$("#ex1PhraseTLLabel").text($(jSection.find("phrase_complete_TL")[0]).text());
	$("#ex2PhraseENLabel").text($(jSection.find("item phrase_EN")[1]).text());
	//$("#ex2PhraseTLLabel").text($(jSection.find("phrase_complete_TL")[1]).text());
	
	if (!isJapanese) {
		$("#explanationLabel").html($(jSection.find("explanation")).text());
		$("#phraseTLLabel").html($(jSection.find("phrase_TL")).text());
		$("#ex1PhraseTLLabel").html($(jSection.find("phrase_complete_TL")[0]).text());
		$("#ex2PhraseTLLabel").html($(jSection.find("phrase_complete_TL")[1]).text());
	}
	else {
		// To display ruby tag
		$("#explanationLabel").html(displayRubyTag($(jSection.find("explanation")).text()));
		$("#phraseTLLabel").html(displayRubyTag($(jSection.find("phrase_TL")).text()));
		$("#ex1PhraseTLLabel").html(displayRubyTag($(jSection.find("phrase_complete_TL")[0]).text()));
		$("#ex2PhraseTLLabel").html(displayRubyTag($(jSection.find("phrase_complete_TL")[1]).text()));
	}
}

var currentState = "greeting";
function setState(value){
	currentState = value;
	switch(currentState){
		case "greeting":
			$("#grammar").removeClass("hidden");
			$("#questionsButton").removeClass("hidden");
			$("#grammerNoteButton").addClass("hidden");
			$("#main").addClass("hidden");
			$("#itemNumDiv").addClass("hidden");
			$("#nextItemDiv").addClass("hidden");
			$("#prevItemDiv").addClass("hidden");
			$("#setDiv").addClass("hidden");
			$("#nextDiv").addClass("hidden");
			$("#prevDiv").addClass("hidden");
			$("#id_prev_nextItem_div").addClass("hidden");
			$("#id_prev_next_div").addClass("hidden");
			break;
		case "questions":
			$("#grammar").addClass("hidden");
			$("#questionsButton").addClass("hidden");
			$("#id_prev_nextItem_div").removeClass("hidden");
			//$("#grammerNoteButton").removeClass("hidden");
			if($(jSection.find("explanation")).text().length > 0){
				$("#grammerNoteButton").removeClass("hidden");
			}
			$("#main").removeClass("hidden");
			$("#itemNumDiv").removeClass("hidden");
			$("#nextItemDiv").removeClass("hidden");
			$("#prevItemDiv").removeClass("hidden");
			
			if(numSets > 1){
				$("#setDiv").removeClass("hidden");
				$("#id_prev_next_div").removeClass("hidden");
			}
			
			$("#nextDiv").removeClass("hidden");
			$("#prevDiv").removeClass("hidden");
			break;
	}
}

var itemBtnLock = false;

function nextItemClick(){
	if(itemBtnLock)
		return;
		
	if((currentItem + 1) != numItems){
		loadItem(currentItem + 1);
	}
}

function prevItemClick(){
	if(itemBtnLock)
		return;
	
	currentItem--;
	
	if(currentItem < 0){
          if ($(jSection.find("explanation")).text().length > 0)
		setState("greeting");
          loadItem(0);
	}else {
		loadItem(currentItem);
	}
}

function updateItemNavButtons(){
	updateItemSetText();
	
	document.getElementById("nextItemBtnClickGuard").style.display = "none";
	document.getElementById("prevItemBtnClickGuard").style.display = "none";
	
	if(currentItem == numItems - 1){
		document.getElementById("nextItemBtnClickGuard").style.display = "block";
	}
	document.getElementById("item_prev").disabled = currentItem == 0 && $(jSection.find("explanation")).text().length < 1 ? true : false;

}

function updateItemSetText(){
	document.getElementById('itemNumText').innerHTML = (currentItem + 1) + "/" + numItems;
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
