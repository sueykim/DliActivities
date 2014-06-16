$(document).ready(function() {	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	testVideoSupport()
	
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
	
	clearVideo("videoContainer1")
	clearVideo("videoContainer2")
	
	$("#selections > div").removeAttr("selected")
	
	jSet = $($(xml).find("set")[currentSet])

	if(jSet.find("> stml_media").text().length > 0){
		loadVideo(mediaPath, removeFileExt(jSet.find("> stml_media").text()), 
				"videoContainer1", "videoTag1");
	}

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
	
        //hide all audio play buttons if no video attached
        if (jSet.find("correct_response_media").text() == '' && jSet.find("d_1_media").text() == '' && jSet.find("d_2_media").text() == '')
        {
          if(params['standardMode'] == 'true')
          {  //(params['standardMode'] == 'true')
		$('#selections .playSelBtn').hide()
          }
          else
          {
		$("#sel1 > .playSelBtn").hide()
		$("#sel2 > .playSelBtn").hide()
		$("#sel3 > .playSelBtn").hide()
          }
        }
        else
        {
          if(params['standardMode'] == 'true')
          {  //(params['standardMode'] == 'true')
		$('#selections .playSelBtn').show()
          }
          else
          {
		$("#sel1 > .playSelBtn").show()
		$("#sel2 > .playSelBtn").show()
		$("#sel3 > .playSelBtn").show()
          }
        }

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
			//$("#feedbackHeader").html("Incorrect");
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png">');
			
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
			//$("#feedbackHeader").html("Correct");
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
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

function submit(event, value ){    //value
    //to stop propagation with the click event on the div parent which will play the video again
    if (event.stopPropagation) {
        event.stopPropagation();   // W3C model
    } else {
        event.cancelBubble = true; // IE model
    }
    //now stop the second video, no need to stop the first one since it get stopped automatically when seond starts playing
    var indx = 1
    if(params['standardMode'] == 'true')
    {
      indx = 0
    }
	
	if($("#videoTag1").length > 0){
    	$("#videoTag1")[0].pause()
	}
    
    if($("#videoTag2").length > 0){
    	$("#videoTag2")[0].pause()
    }
	
	logStudentAnswer(
			(currentSet + 1),	
			$("#sel1 > .selText").text(),
			$("#sel" + value + " > .selText").text()
	)

	logStudentAnswerAttempts((currentSet + 1), attemptCount)

	if(params['standardMode'] == 'true'){
		var theStr = '';
		switch(value){
			case 1:
				showFeedback("correct",jSet.find("correct_response_feedback").text())
				break;
			case 2:
				theStr = jSet.find("d_1_feedback").text();
				theStr = attemptCount == 1 ? theStr : theStr + '<\/br>' + jSet.find("additional_feedback").text();	 			    
				showFeedback("incorrect", theStr);	
				break;
			case 3:
				theStr = jSet.find("d_2_feedback").text();
				theStr = attemptCount == 1 ? theStr : theStr + '<\/br>' + jSet.find("additional_feedback").text();
				showFeedback("incorrect", theStr);
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
	
	//selectItem(value)
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


        //play item
        // if no video put blank page
        if (vidFilename == '')
        {
        	clearVideo("videoContainer2")
        }
        else
        {
	          //otherwise play the video
	  		  loadVideo(mediaPath, removeFileExt(vidFilename), 
	  				  "videoContainer2", "videoTag2");
        }


        //stop the main vid
	jSet = $($(xml).find("set")[currentSet])
	if(jSet.find("> stml_media").text().length > 0){
		$("#videoTag1")[0].pause()
	}
}

function activityVideoPlay(index){
	if($("#videoTag" + index).length > 0 && $("#videoTag" + index)[0].play != undefined){
		$("#videoTag" + index)[0].play()
	}
}
