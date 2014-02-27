$(document).ready(function() {
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	audioInit();
	
	//Create Drag Bubble
	for(var i  = 0; i < numDragBubbles; i++){
		$('#dragBubble_' + (i + 1)).draggable({ revert: true , stack: "div"});
	}
	
	//Create drop targets	
	for(var i  = 0; i < numDropTargets; i++){
		$( "#dropTarget_" + (i + 1)).droppable({
			hoverClass: "dropTargetHover",
			drop: dropFunction}); 
	}

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_01_default.css";
	xmlFilename = mediaPath + "levantine_enabling01_noNamespaces.xml";
	jsonFilename = mediaPath + "levantine_enabling01_noNamespaces.js";

	loadActivity(parseXml);
	
	if(params["debug"] != null){
		showAnswers = true;
	}
	
	if(params["cssFilename_state2"] != null){
		cssFilename_state2 = params["cssFilename_state2"] ;
	}
}); 

var cssFilename_state2 = "styles/Enabling_01_dliLearn_state2.css";

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;

function setState(value){
	switch(value){
		case "2":
			$(".activity_description").text("Leason 2: Click the play button. " +
				"Listen to the audio. Select the image that corresponds to " + 
				"the target language.");
		
			if(cssFilename_state2 != ""){
				loadjscssfile(cssFilename_state2, "css");
			}
		
			$("#dragBubbles").css("display", "none");
			$("#playBtnText").css("display", "block");
			currentState = 2;
			$(".dropTargetText").css("display", "none");
			$(".dropTarget").addClass("notHoveredOver");
			$(".dropTargetImg").removeClass("dropTargetImg")
								.addClass("clickImage");
			$(".dragBubble").css("display", "none");
			
			$(".dropTarget").hover(
				function () {
					if(!disableHover){
						$(this).removeClass("notHoveredOver");
						$(this).addClass("hoveredOver");
					}
				},
				function () {
					$(this).addClass("notHoveredOver");
					$(this).removeClass("hoveredOver");
				}
			);
			
			$(".dropTarget").click(
				function (){
					if(!disableHover){
//						$("#clickGuard").css("display","block");
						disableHover = true;
						
						var index = extractLastNumber($(this).find("img").attr("id"));
						
						var jItem = $($(xml).find("item")
										[(state2CurrentSet * numDropTargets) + state2CurrentSetIndex]);
										
						//$("#playBtnText").text(jItem.find("phrase_tl").text());
						
						//Logging section
						var itemIndex = jItem.attr("origIndex");
						
						logStudentAnswer("1:" + itemIndex,	
									jItem.find("file_graphic").text(),
									$(this).find("img").attr("src").
										replace(mediaPath + "png/", ""));
						
						if(jItem.attr("timesTried") == undefined){
							jItem.attr("timesTried", 1);
						}else{
							jItem.attr("timesTried",
								parseInt(jItem.attr("timesTried")) + 1
							);	
						}
										
						logStudentAnswerAttempts("1:" + 
									itemIndex, jItem.attr("timesTried"));
						//End logging section
						
						if(index == state2CurrentSetIndex + 1){
							state2FeedbackType = "correct";
							showFeedback("correct", jItem.find("feedback_l2").text());
						}else{
							state2FeedbackType = "incorrect";
							switch(state2NumberIncorrectTries){
								case 0:
									state2NumberIncorrectTries++;
									showFeedback("incorrect", "Hint: " + jItem.find("hint_l2").text());
									break;
								case 1:
									state2NumberIncorrectTries++;
									showFeedback("incorrect", "Hint: " + jItem.find("hint_l2").text());
									break;
								case 2:
									state2FeedbackType = "auto_correct";
									showFeedback("incorrect", 
											"Incorrect. The correct answer is: " + 
											jItem.find("feedback_l2").text());
									break;
							}
						}
					}
				}
			);
			
			$("#playBtn").css("display","block");
			
			state2LoadSet(0);
					
			break;
	}
}

function state2LoadSet(value){
	state2CurrentSet = value;
	state2CurrentSetIndex = 0;
	setCompletedShown = false;
	
	$("#clickGuard").css("display","none");
	
	document.getElementById('setIndex').innerHTML = (state2CurrentSet + 1) + "/" + numSets;
	
	//Load image buttons
	for(var i=0; i<numDropTargets; i++){
		var jItem = $($(xml).find("item")
						[state2CurrentSet * numDropTargets + i]);
					
		$("#dropTargetImg_" + (i+1)).attr("src", mediaPath + "png/" 
									+ jItem.find("file_graphic").text());
	}
	
	$(".clickImage").shuffle()
	
	state2NumberIncorrectTries = 0;
	loadState2CurrentSetIndex();
}

function loadState2CurrentSetIndex(){
	disableHover = true;
	//Load audio and text
	var jItem = $($(xml).find("item")
					[state2CurrentSet * numDropTargets + state2CurrentSetIndex]);
					
	state2CurrentAudioFile = jItem.find("file_audio").text();
	$("#playBtnText").text("Play Audio");
	$(".dropTarget").addClass("ui-state-disabled");
}

var disableHover = true;
var state2CurrentAudioFile = "";
var state2CurrentSetIndex = 0;
var state2CurrentSet = 0;
var currentState = 1;
var state2FeedbackType;

function playAudio(value){
	disableHover = false;
	$("#playBtnText").text("");
	$(".dropTarget").removeClass("ui-state-disabled");
	audio_play_file(removeFileExt(state2CurrentAudioFile), mediaPath);;
}

var showAnswers = false;

var numDragBubbles = 12;
var numDropTargets = 6;

function parseXml(t_xml){
	numSets = $(xml).find("item").length / numDropTargets;
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	
	//Randomize sets
	$(xml).find("section").each(function(){
		randomizeSet(this);		
	});
	
	jSection = $($(xml).find("section")[0]);
	
	loadSet(0);

	if(params["state"] != null){
		setState(params["state"]);
	}
}

function randomizeSet(xml){
	$(xml).find("item").shuffle()
}

var jSection;

function loadSet(value){
	currentSet = value;
	
	$('.dragBubble').draggable( 'enable' );
	$('.dragBubble').css("display", "block");

	//Give randomness to the sets
	$(".dragBubbleText").shuffle();

	setCompletedShown = false;

	//Update set text
	document.getElementById('setIndex').innerHTML = (currentSet + 1) + "/" + numSets;

	
	//Load drag bubble answers
	for(var i  = 0; i< numDropTargets; i++){
		var txt = $(jSection.find("lang_tl")[
					(currentSet * numDropTargets) + i]).text();
		txt = txt.replace(/[|][|]/g, " ");
		
		// To display ruby tag
		txt = displayRubyTag(txt);
		//$('#dragBubbleText_' + (i + 1)).text(txt);
		$('#dragBubbleText_' + (i + 1)).html(txt);
	}
	
	//Load six more answers from the previous or next set
	//Note- This creates a requirement for at least two sets in the activity.
	// Also note that this loading logic means that the total number of items
	// in the section be a modulus of numDropTargets (otherwise you'll get blank
	// drag bubbles)
	var distractorSet = 1;
	if(currentSet > 0){
		distractorSet = currentSet - 1;
	}
	
	//Load the drag bubble text
	for(var i  = 0; i< numDropTargets; i++){
		var txt = $(jSection.find("lang_tl")[
					(distractorSet * numDropTargets) + i]).text();
		txt = txt.replace(/[|][|]/g, " ");
		// To display ruby tag
		txt = displayRubyTag(txt);
		//$('#dragBubbleText_' + (i + numDropTargets + 1)).text(txt);
		$('#dragBubbleText_' + (i + numDropTargets + 1)).html(txt);
	}
	
	//If a drag bubble doesn't have text then hide it
	numDragBubblesInSet = 0;
	$(".dragBubble").each(function(){
		if($(this).find(".dragBubbleText").text() == ""){
			$(this).css("display", "none");
		}else{
			numDragBubblesInSet++;
			$(this).css("display", "block");
		}
	});
		
	//Load drop bubbles
	for(var i  = 0; i<numDropTargets; i++){
		var itemIndex = (value * numDropTargets) + i;

		$("#dropTarget_" + (i + 1)).droppable( 'enable' );
		
		if(showAnswers){
			//$('#dropTargetText_' + (i + 1)).text(
			//	$(jSection.find("phrase_tl")[itemIndex]).text());	
			// To display ruby tag
			$('#dropTargetText_' + (i + 1)).html(
				$(jSection.find("lang_tl")[itemIndex]).html());					
		}else{
			$('#dropTargetText_' + (i + 1)).text("");			
		}
		
				
		var imgPath = mediaPath + 'png/' + 
							$(jSection.find("file_graphic")[itemIndex]).text()
		
		$("#dropTargetImg_" + (i + 1)).attr( 'src', imgPath );
	}
	
	
}

var numDragBubblesInSet;

function dropFunction(event, ui ) {
	//$("#clickGuard").css("display","block");
	
	var dropTargetNum = extractLastNumber($(this).attr("id"));
	
	var dragTextNum = extractLastNumber(
							$(ui.draggable.find(".dragBubbleText")[0]).attr("id"));
	
	var dragBubbleNum = extractLastNumber($(ui.draggable).attr("id"));
		
	//Play audio
	/*var file_audio = $(jSection.find("file_audio")[dropTargetNumGot - 1]).text();
	audio_play(mediaPath + "mp3/" + file_audio);*/
	
	var itemIndex = $(xml).
			find("phrase_tl:contains('" +
				$("#dragBubbleText_" + dropTargetNum).text()
				+ "')").
			parent().attr("origIndex");
	
	logStudentAnswer("0:" + itemIndex,	
				$("#dragBubbleText_" + dropTargetNum).text(),
				$("#dragBubbleText_" + dragTextNum).text());
	
	var jXmlItem = $(jSection.find("item")[
				(currentSet * numDropTargets) + dropTargetNum - 1]); 		
	if(jXmlItem.attr("timesTried") == undefined){
		jXmlItem.attr("timesTried", 1);
	}else{
		jXmlItem.attr("timesTried",
			parseInt(jXmlItem.attr("timesTried")) + 1
		);	
	}
					
	logStudentAnswerAttempts("0:" + 
				itemIndex, jXmlItem.attr("timesTried"));
	
	if(dragTextNum == dropTargetNum ){
		//Show image
		//ui.draggable.draggable( 'disable' );
		$(this).droppable( 'disable' );
		
		$("#dragBubble_" + dragBubbleNum).css("display", "none");
		
		//$("#dropTargetText_" + dropTargetNum).
		//		text($("#dragBubbleText_" + dragTextNum).text());
		// To display ruby tag
		$("#dropTargetText_" + dropTargetNum).
				html($("#dragBubbleText_" + dragTextNum).html());		
		
		showFeedback("correct", $(jSection.find("feedback_l1")
						[((currentSet * numDropTargets) + dropTargetNum - 1)]).text());
	}else{
		showFeedback("incorrect", $(jSection.find("hint_l1")
						[((currentSet * numDropTargets) + dropTargetNum) - 1]).text());
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
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
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
	$("#clickGuard").css("display","block");
	$('#feedback').show();
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}

function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();

	$("#clickGuard").css("display","none");
	
	switch(currentState){
		case 1:
			handleFeedbackClosed();
			break;
		case 2:
			handleFeedbackClosed2();
			break;
	}
	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var setCompletedShown = false;
var activityCompletedShown = false;

function handleFeedbackClosed(){
	if(setCompletedShown ){
		//Check for activity completed
		if(currentSet + 1 == numSets){
			//Load state 2
			setState("2");
		}else{
			loadSet(currentSet + 1);
		}
	}else{
		//Check for set completed
		var dragCompleted = $(".dragBubble").filter(
			function(){ 
				if(this.style.display == 'none' &&
					$(this).find(".dragBubbleText").text() != ""){
					return true;		
				}else{
					return false;
					
				}
			});
		
		if(dragCompleted.length == numDropTargets){
			setCompletedShown = true;
			showFeedback("set_completed");
		}
		
		// For homework
		if (homeworkStatus) {
			checkAnswers();
		}
	}	
}

var state2NumberIncorrectTries = 0;

function handleFeedbackClosed2(){
	$("#playBtnText").text("");
	
	if(activityCompletedShown == true){
		return;
	}
	
	if(setCompletedShown ){
		//The set was completed and the set_completed feedback shown
		if(state2CurrentSet + 1 == numSets){
			activityCompletedShown = true;
			
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}else{
				showFeedback("activity_completed");
			}
		}else{
			state2LoadSet(state2CurrentSet + 1);
		}
	}else{
		//Handle correct or incorrect feedback shown
		switch(state2FeedbackType){
			case "auto_correct":
			case "correct":
				if(state2CurrentSetIndex + 1 == numDropTargets){
					setCompletedShown = true;
					showFeedback("set_completed");
				}else{
					//Load the next set
					state2CurrentSetIndex++;
					state2NumberIncorrectTries = 0;
					loadState2CurrentSetIndex();
				}
				break;
			case "incorrect":
				//Do nothing
				loadState2CurrentSetIndex();
				break;
		}
		
		// For homework
		if (homeworkStatus) {
			checkAnswers();
		}
	}			
	}			

// For homework
function checkAnswers(){
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";

	answerAttemptsNum++;

	questionID = parseInt(currentState.toString() + currentSet.toString());
	answer = "--";
	context = "--";
	answerAttempts = answerAttemptsNum.toString();
	
	// To see attempts - temp
	//$("#feedbackText").html("Homework//answerAttempts: " + answerAttempts);
	
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	//$('#feedbackText').show();
}
