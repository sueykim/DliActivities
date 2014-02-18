jQuery.fn.outerHTML = function() {
  return jQuery('<div />').append(this.eq(0).clone()).html();
};

var canvasLoadNum = 0;
var img;

var mouseX = 0;
var mouseY = 0;

$(document).ready(function() {
	audioInit();
	
	$('#feedback').hide();
	
	$( "#imageContainer").droppable({
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
	mediaPath = "sampleData/";
	cssFilename = "styles/WarmUp_05_default.css";
	xmlFilename = "sampleData/WarmUp_05_sample.xml";
	jsonFilename = "sampleData/WarmUp_05_sample.js";
	
	loadActivity(parseXml);
});

function dropFunction(event, ui ) {
	var dragId = extractLastLetter(
							$(ui.draggable.find(".dragBubbleText")[0]).attr("id"));
   
	for(var i = 0 ; i < jSection.find("item").length; i++){
	    var canvas = document.getElementById("can" + i);
	    var context = canvas.getContext('2d');
	    var p = context.getImageData(mouseX, mouseY, 1, 1).data;
		
		if(p[3] > 0){
			if(i == dragId){
				//alert("image:" + i + ":position:" + mouseX + "," + mouseY);
				
				$(canvas).css("opacity", "1");
				ui.draggable.draggable( 'disable' );
				$(ui.draggable).css("opacity", "0");
				
				//Play audio
				var file_audio = $(jSection.find("audio")[dragId]).text();
				audio_play_file(removeFileExt(file_audio) ,mediaPath );
				
				showFeedback("correct", $(jSection.find("feedback")[dragId]).text());
			}else{
				//Show incorrect
				showFeedback("incorrect", $(jSection.find("hint")[dragId]).text());

				//alert("Not a match dragId:" + dragId + 
				//		":image:" + i + ":position:" + mouseX + "," + mouseY);
			}
		}			    
    }
}

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html("Incorrect");
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html("Correct");
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
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
	$('#feedback').hide();

	if(setCompletedShown && !activityCompletedShown &&
			$(xml).find("section[completed='true']").length == 
			$(xml).find("section").length){
		activityCompletedShown = true;
		
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}
		
		showFeedback("activity_completed");
	}else if($(".ui-draggable-disabled").length == jSection.find("item").length &&
				setCompletedShown == false){
		setCompletedShown = true;
		showFeedback("set_completed");
		jSection.attr("completed", "true");
	}
	
	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

function parseXml(t_xml){
	numSets = $(xml).find("section").length;
	
	loadSet(0);
}

function loadSet(value){
	currentSet = value;
	
	audioTally = 0;
	setCompletedShown = false;

	jSection = $($(xml).find("section")[currentSet]);

		//Load whole image
	$("#wholeImage").attr("src", mediaPath + "png/" +
							jSection.find("whole_img").text());
	
	//Get snippet
	var snippetDragBubble = $("#dragBubble_id").outerHTML();
	snippetDragBubble = snippetDragBubble.replace("[dragBubble]", "dragBubble");
	snippetDragBubble = snippetDragBubble.replace("[dragBubbleText]", "dragBubbleText");
	
	
	//load drag bubbles
	$("#dragBubbles").html("");
	if(jSection.attr("completed") != "true"){
		$("#stageClickGuard").removeClass("hidden");
		$("#startButton").removeClass("invisible");
		
		var dragBubblesHTML ="";
		for(var i=0; i< jSection.find("item").length; i++){
			dragBubblesHTML += snippetDragBubble.replace("dragBubble_id", "dragBubble_" + i).
								replace("dragBubbleText_textId", "dragBubbleText_" + i);
		}
		$("#dragBubbles").html(dragBubblesHTML);

		//Now shuffle and enable	
		$(".dragBubbleText").shuffle();
		$('.dragBubble').draggable({ revert: true });
	
		//Load drag bubble text
		for(var i  = 0; i<jSection.find("item").length; i++){
			$('#dragBubbleText_' + i).text($(jSection.find("tl_word")[i]).text());
		}
	}else{
		//We've completed this set
		$("#stageClickGuard").addClass("hidden");
		$("#startButton").addClass("invisible");
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
	
	if(canvasLoadNum < jSection.find("item").length){
		loadImages();
	}else{
		//We're done loading canvases
		canvasLoadNum = 0;
		
		if(jSection.attr("completed") == "true"){
			$("canvas").css("opacity", "1");
		}
	}
}


function loadImages(){
    img = new Image();
    img.onload = imageloaded;
    img.src = mediaPath + "png/" + $(jSection.find("image")[canvasLoadNum]).text();
}

function rgbToHex(r, g, b){
	if (r > 255 || g > 255 || b > 255)
	    throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}

function startClicked(){
	$("#startButton").addClass("invisible");
	
	playIntroAudio();
}

function startUp(){
	$("#startButton").css("background-color","#F5F5F5");
}

function startOut(){
	$("#startButton").css("background-color","lightgray");
}

function startOver(){
	$("#startButton").css("background-color","#F5F5F5");
}

var audioTally = 0;
function playIntroAudio(){
	document.getElementById("nextBtnClickGuard").style.display = "block";
	document.getElementById("prevBtnClickGuard").style.display = "block";
	
	if(audioTally < jSection.find("item").length){
		audioItemIndex = extractLastNumber($($(".dragBubbleText")[audioTally]).attr("id"));
		
		var file_audio = $(jSection.find("audio")[audioItemIndex]).text();
		audio_play_file(removeFileExt(file_audio), mediaPath );
		
		//add event listener for audio finished
		document.getElementById('audioPlayer').addEventListener('ended', playIntroAudio);
		document.getElementById('audioPlayer').play();	
		
		audioTally++;
	}else{
		//lower clickguard
		$("#stageClickGuard").addClass("hidden");
		updateNavButtons();
	}
}

