jQuery.fn.outerHTML = function() {
  return jQuery('<div />').append(this.eq(0).clone()).html();
};

var canvasLoadNum = 0;
var img;

var mouseX = 0;
var mouseY = 0;

var debug = true;

// To display ruby tag
var isJapanese = false;

// For homework
var homeworkStatus;

$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	$( "#dropContainer").droppable({
			drop: dropFunction}); 
	
	if(document.getElementById('audioPlayer').play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}
	
	forceVidType = "html";
	
	$(document).mousemove(function(e){
      mouseX = e.pageX - $( "#imageContainer").offset()['left'];
      mouseY = e.pageY - $( "#imageContainer").offset()['top'];
      //$(output).html(mouseX + "/" + mouseY);
    });
	
	//Default values (for testing)
	if ( getPassedParameters() == false){
		//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = "sampleData/Enabling_27_sample.xml";
	jsonFilename = "sampleData/Enabling_27_sample.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}

		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		//to get the keyboard
		var lang_name_short = getURL_Parameter('language');
		var langName = {ja:'japanese', sp:'spanish', ad:'msa'};
		var lang_name_long = langName.ja;
		keyboardFilename = '../common/keyboards/' + lang_name_long + '_keyboard.js';

		$('.activity_hd').html('');
		$('.activity_description').html('');
	}
	
        cssFilename = "styles/enabling_27_dlilearn.css";
	loadActivity(parseXml);
	
	if(params["debug"] != null){
		debug = true;
	}
});

function dropFunction(event, ui ) {
	var dragId = extractLastLetter(
							$(ui.draggable.find(".dragBubbleText")[0]).attr("id"));

   	//Play audio
   	var iconName = $(jSection.find("icon")[dragId]).text();
   	var iconAudio = $($(xml).find("color[icon='" + iconName + "']")).
							attr("audio");
   	audio_play_file(removeFileExt(iconAudio) ,mediaPath );
   
   	var lastMatchId = "";
   	
    //check to see if the drop spot is a match
	for(var i = 0 ; i < jSection.find("image").length; i++){
	    var canvas = document.getElementById("can" + i);
	    
	    if(canvas == undefined){
	    	//not quite sure why this happens. Maybe the canvas images haven't loaded yet?
	    	
	    	if(debug){
	    		alert("canvas undefined");	
	    	}
	    	
	    	return;
	    }
	    
	    var context = canvas.getContext('2d');
	    var p = context.getImageData(mouseX, mouseY, 1, 1).data;
		
		if(p[3] > 0){
			lastMatchId = i;
			
			//Drop spot is a match. Test if correct
			if(i == dragId){
				//Is correct so show image
				
				$(canvas).css("opacity", "1");
				ui.draggable.draggable( 'disable' );
				$(ui.draggable).css("opacity", "0");
				
				//Check for complete
				if($(".ui-draggable-disabled").length == jSection.find("image").length &&
							setCompletedShown == false){
					setCompletedShown = true;
					
					//showFeedback("set_completed",jSection.find("feedback"));
					showFeedback("set_completed",jSection.find("feedback").text());
					
					jSection.attr("completed", "true");
					$("#stageClickGuard").removeClass("hidden");
				}
			}else{
				//Incorrect
			}
		}			    
    }
        if(homeworkStatus){
	logStudentAnswer(
		currentSet,	
		$(jSection.find("icon")[lastMatchId]).text(),
		iconName
	);
    	   }
	
	var jIcon = $(jSection.find("icon")[lastMatchId]);
	
	if(jIcon.attr("timesTried") == undefined){
		jIcon.attr("timesTried", 1);
	}else{
		jIcon.attr("timesTried",
			parseInt(jIcon.attr("timesTried")) + 1
		);	
	}
	if (homeworkStatus) {
	logStudentAnswerAttempts(
		currentSet,
		jIcon.attr("timesTried"));
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
		case "set_completed":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
			$("#feedbackText").html(text);
			
			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			}
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("OK");
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
var setCompletedShown = false;

function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#correctAnswer").text("");
	
	if(!activityCompletedShown){
		$("#clickGuard").css("display","none");
	}

	

	if(setCompletedShown){
		if(!activityCompletedShown &&
				$(xml).find("set[completed='true']").length == 
				$(xml).find("set").length){
			activityCompletedShown = true;
			
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}
			
			showFeedback("activity_completed");
		}else{
			nextClick();
		}
	}
	
	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

function parseXml(t_xml){
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	numSets = $(xml).find("set").length;
	homeworkStatus = $(xml).find("content").attr("hw");
	loadSet(0);
}

function loadSet(value){
	currentSet = value;
	
	setCompletedShown = false;

	jSection = $($(xml).find("set")[currentSet]);

	//Load whole image
	$("#wholeImage").attr("src", mediaPath + "png/" +
							jSection.find("background").attr("source"));
	$("#outline").attr("src", mediaPath + "png/" +
							jSection.find("outline").attr("source"));
								
	//Get snippet
	var snippetDragBubble = $("#dragBubble_id").outerHTML();
	snippetDragBubble = snippetDragBubble.replace("[dragBubble]", "dragBubble");
	snippetDragBubble = snippetDragBubble.replace("[dragBubbleText]", "dragBubbleText");
	
	
	//load drag bubbles
	$("#dragBubbles").html("");
	if(jSection.attr("completed") != "true"){
		$("#stageClickGuard").addClass("hidden");
		
		var dragBubblesHTML ="";
		for(var i=0; i< jSection.find("icon").length; i++){
			dragBubblesHTML += snippetDragBubble.replace("dragBubble_id", "dragBubble_" + i).
								replace("dragBubbleText_textId", "dragBubbleText_" + i);
		}
		$("#dragBubbles").html(dragBubblesHTML);

		//Now shuffle and enable	
		$(".dragBubbleText").shuffle();
		
		var origTop=0;
		var origLeft=0;
		$('.dragBubble').draggable({revert: true, 
									zIndex: 250,
									//helper: "clone",
			 						start: function() {
			 							origTop = $(this).data('draggable').offset.click.top;
			 							origLeft = $(this).data('draggable').offset.click.left;
			 							
										$(this).data('draggable').offset.click.top = 5;
										$(this).data('draggable').offset.click.left = 
														$(this).width() / 2 - 20;
						 			}
						 			});
	
		//Load drag bubble text
		for(var i  = 0; i<jSection.find("icon").length; i++){
			//cross reference icon with color list
			var iconName = $(jSection.find("icon")[i]).text();
			var iconText = $($(xml).find("color[icon='" + iconName + "']")).text();
			var iconBackground = $($(xml).find("color[icon='" + iconName + "']")).
									attr("source");
			var labelColor = $($(xml).find("color[icon='" + iconName + "']")).
									attr("labelColor");
			
			//$('#dragBubbleText_' + i).text(iconText);
			if (!isJapanese) {
				$('#dragBubbleText_' + i).html(iconText);
			}
			else {
				// To display ruby tag
				$('#dragBubbleText_' + i).html(displayRubyTag(iconText));
			}
			
			if(labelColor != undefined){
				$('#dragBubbleText_' + i).css("color", labelColor);
			}
			
			$($('#dragBubbleText_' + i).parent()).css("background-image",
						'url("' + mediaPath + 'png/' + iconBackground +  '")');
		}
	}else{
		//We've completed this set
		$("#stageClickGuard").removeClass("hidden");
	}
	
	
	//Load text
	//$("#labelText").text($(jSection.find("label")).text());
	if (!isJapanese) {
		$("#labelText").html($(jSection.find("label")).text());
	}
	else {
		// To display ruby tag
		$('#dragBubbleText_' + i).text(displayRubyTag(iconText));
		$("#labelText").html(displayRubyTag($(jSection.find("label")).text()));
	}
	
	$("#canvasFragments").html("");
	loadImages();
	
	updateNavButtons();
}

function imageloaded(){
	//alert("loaded");
	var canvas =  document.createElement('canvas');
	$("#canvasFragments").append(canvas);
	$(canvas).attr("id", 'can' + canvasLoadNum);
	$(canvas).addClass("invisible");
	
    var context = canvas.getContext('2d');
    		
    canvas.width = img.width;
    canvas.height = img.height;
    $("#imageContainer").css("width",img.width);
    $("#imageContainer").css("height",img.height);
    
    context.drawImage(img, 0, 0, img.width, img.height);
	
	canvasLoadNum++;
	
	if(canvasLoadNum < jSection.find("image").length){
		loadImages();
	}else{
		//We're done loading canvases
		canvasLoadNum = 0;
		
		if(jSection.attr("completed") == "true"){
			$("canvas").css("opacity", "1");
		}
	}
}

function playBtnClick(){
   	var audioFile = jSection.attr("audio");
   	audio_play_file(removeFileExt(audioFile) ,mediaPath );	
}

function loadImages(){
    img = new Image();
    img.onload = imageloaded;
    img.src = mediaPath + "png/" + $(jSection.find("image")[canvasLoadNum]).attr("source");
}

function rgbToHex(r, g, b){
	if (r > 255 || g > 255 || b > 255)
	    throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}