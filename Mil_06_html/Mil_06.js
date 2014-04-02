$(document).ready(function() {	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	mediaPath = "sampleData/";
	cssFilename = "styles/Mil_06.css";
	xmlFilename = mediaPath + "sample.xml";
	jsonFilename = mediaPath + "sample.js";
	
	loadActivity(parseXml);
}); 

function parseXml(t_xml){
	numSets = $(xml).find("set").length
	loadSet(currentSet)
}

var jSet
function loadSet(value){
	attemptCount = 1
	
	$("#selections > div").removeAttr("selected")
	
	jSet = $($(xml).find("set")[currentSet])

	if(jSet.find("> stml_media").text().length > 0){
		$('#vids > iframe').get(0).contentWindow.location.replace("video.html?mediaPath=" + mediaPath + 
									"&video=" + jSet.find("> stml_media").text());
	}
									
	$('#vids > iframe').get(1).contentWindow.location.replace("about:blank");

	$('#selections > div').shuffle();

	if(params['standardMode'] == 'true'){
		$('#selections .selText').each(function(index, value){
			$(value).text("Answer " + (index + 1))
		})
	}else{
		$("#sel1 > .selText").text(jSet.find("> correct_response_en").text())
		$("#sel2 > .selText").text(jSet.find("> d_1_en").text())
		$("#sel3 > .selText").text(jSet.find("> d_2_en").text())
	}
	
	updateSetText()
}

function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#correctAnswer").text("");
	$("#clickGuard").css("display","none");
	
	
	if(params['standardMode'] == 'true' && 
				lastFeedbackValue == 'incorrect' &&
				attemptCount == 1){
		clearItems()
		attemptCount++
	}else{
		checkActivityCompleted();
	}
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var completedFeedbackShown = false;
var attemptCount = 1;

function checkActivityCompleted(){
	if(completedFeedbackShown){
		return;
	}

	if(currentSet + 1 == numSets){
		completedFeedbackShown = true;
		
		$("#clickGuard").css("display","block");
		
		//Check to see if we're in a container (such as Gateway)
		if(parent.activityCompleted){
			if(params['standardMode'] == 'true'){
				parent.activityCompleted(setPassed,0)
			}else{
				parent.activityCompleted(1,0)
			}
		}else{
			showFeedback("completed")
		}
		
	}else{
		loadSet(currentSet++)
	}
}

var lastFeedbackValue
var setPassed = true;

function showFeedback(value, text){
	lastFeedbackValue = value
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html("Incorrect");
			
			$("#feedbackText").html(text);
			
			//Button text should be different for standardMode	
			if(params['standardMode'] == 'true' && 
					attemptCount == 1){
				$("#feedbackBtn").text("OK");
			}else{
				$("#feedbackBtn").text("Next Set");
			}
			
			if(params['standardMode'] == 'true' && 
					attemptCount == 2){
				setPassed = false			
			}
			
			if(currentSet + 1 == numSets){
				$("#feedbackBtn").text("OK");
			}
			
			break;
		case "correct":
			$("#feedbackHeader").html("Correct");
			$("#feedbackText").html(text);
			$("#feedbackBtn").text("Next Set");
			
			if(currentSet + 1 == numSets){
				$("#feedbackBtn").text("OK");
			}
			
			break;
		case "completed":
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

function submit(value){
	logStudentAnswer(
			(currentSet + 1),	
			$("#sel1 > .selText").text(),
			$("#sel" + value + " > .selText").text()
	)

	logStudentAnswerAttempts((currentSet + 1), attemptCount)

	if(params['standardMode'] == 'true'){
		switch(value){
			case 1:
				showFeedback("correct",jSet.find("correct_response_feedback").text())
				break;
			case 2:
				showFeedback("incorrect", jSet.find("d_2_feedback").text())
				break;
			case 3:
				showFeedback("incorrect", jSet.find("d_1_feedback").text())
				break;
		}
	}else{
		switch(value){
			case 1:
				showFeedback("correct","")
				break;
			case 2:
			case 3:
				showFeedback("incorrect", "The correct answer is: " + 
									jSet.find("correct_response_en").text())
				break;
		}
	}
	
	selectItem(value)
}

function clearItems(){
	$("#selections > div").removeAttr("selected")
}

function selectItem(value){
	clearItems()
	
	$("#sel" + value).attr("selected", "true")

	var vidFilename = ""
	switch(value){
		case 1:
			vidFilename = jSet.find("correct_response_media").text()
			break;
		case 2:
			vidFilename = jSet.find("d_1_media").text()
			break;
		case 3:
			vidFilename = jSet.find("d_2_media").text()
			break;
	}


	$('#vids > iframe').get(1).contentWindow.location.replace("video.html?mediaPath=" + mediaPath + 
									"&video=" + vidFilename +
									"&play=true");
}

