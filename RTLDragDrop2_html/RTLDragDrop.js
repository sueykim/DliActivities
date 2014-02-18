$(document).ready(function() {
	audioInit();
	
	$('#feedback').hide();
	
	//Create Drag Bubble
	for(var i  = 1; i<maxNumberItensInSet + 1; i++){
		$('#dragBubble_' + i).draggable({ revert: true });
	}
	
	//Create drop targets	
	for(var i  = 1; i<maxNumberItensInSet + 1; i++){
		$( "#dropTarget_" + i ).droppable({
			hoverClass: "dropTargetHover",
			drop: dropFunction}); 
	}
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/RTLDragDrop_default.css";
	xmlFilename = mediaPath + "RTL_DragDrop_German_noNamespace.xml";
	jsonFilename = mediaPath + "RTL_DragDrop_German_noNamespace.js";
	
	loadActivity(parseXml);
}); 

function parseXml(t_xml){
	numSets = $(xml).find("section").length;
	
	//Randomize sets
	$(xml).find("section").each(function(){
		randomizeSet(this);		
	});
	
	loadSet(0);
}

function randomizeSet(xml){
	$(xml).find("item").shuffle()
}

var jSection;
var numItemsInSet = -1;
var maxNumberItensInSet = 9;
var answeredItems = 0;

function loadSet(value){
	currentSet = value;
	
	$(".dragBubbleTextContainer").shuffle();
	$('.dragBubble').draggable( 'enable' );

	setCompletedShown = false;

	updateSetText();

	jSection = $($(xml).find("section")[currentSet]);

	//Load drag bubbles
	for(var i  = 1; i<maxNumberItensInSet + 1; i++){
		var lang_tl = $(jSection.find("lang_tl")[i-1]).text();
		
		$('#dragBubble_' + i).css("left", "0px");
		$('#dragBubble_' + i).css("top", "0px");
		$('#dragBubble_' + i).css("width", "140px");
		$('#dragBubble_' + i).css("z-index", "100");
		$('#dragBubble_' + i).css("position", "relative");
		$('#dragBubble_' + i).draggable({ revert: true });
		
		if(lang_tl.length > 0){
			$('#dragBubbleText_' + i).text(lang_tl);
			$("#dragBubbleTextContainer_" + i ).parent().css("display", "block");
		}else{
			$('#dragBubbleText_' + i).text("");
			$("#dragBubbleTextContainer_" + i ).parent().css("display", "none");
		}
	}
	
	//Reset bubbles
	for(var i  = 1; i<maxNumberItensInSet + 1; i++){
		$("#dropTarget_" + i).css("width", $(jSection.find("width")[i-1]).text() + "px");
	}
	
	//Load drop bubbles
	numItemsInSet = jSection.find("item").length;
	answeredItems = 0;
	$("#answeredText").text(answeredItems + "/" + numItemsInSet);
	
	for(var i  = 1; i<maxNumberItensInSet + 1; i++){
		var top = $(jSection.find("top")[i-1]).text();
		var left = $(jSection.find("left")[i-1]).text();
		var width = $(jSection.find("width")[i-1]).text();
		var lang_en = $(jSection.find("lang_en")[i-1]).text();
		
		$("#dropTarget_" + i).droppable( 'enable' );
		
		if(top > 0){
			$("#dropTarget_" + i).css("top", top + "px");
		}else{
			$("#dropTarget_" + i).css("top", "");
		}
		
		if(left > 0){
			$("#dropTarget_" + i).css("left", left + "px");
		}else{
			$("#dropTarget_" + i).css("left", "");
		}
		
		if(width > 0){
			$("#dropTarget_" + i).css("width", width + "px");
		}else{
			$("#dropTarget_" + i).css("width", "140px");
		}
		
		if(lang_en.length > 0){
			$('#dropTargetText_' + i).text(lang_en);
			$("#dropTarget_" + i).css("display", "block");
		}else{
			$('#dropTargetText_' + i).text("");
			$("#dropTarget_" + i).css("display", "none");
		}
	}
	
	//Load images
	$("#backgroundImg").attr("src", mediaPath + 'jpg/' +  jSection.find("graphic").text());
}

function extractLastLetter(value){
	var out = "";
	
	out = value.substr(value.length - 1, value.length);
	
	return out;
}

function dropFunction(event, ui ) {
	var dropTargetNumGot = extractLastLetter($(this).attr("id"));
	
	var dropTargetNumLookingFor = extractLastLetter(
							$(ui.draggable.find(".dragBubbleText")[0]).attr("id"));
		
	//Play audio
	var file_audio = $(jSection.find("file_audio")[dropTargetNumGot - 1]).text();
	audio_play(mediaPath + "mp3/" + file_audio);
	
	if(dropTargetNumLookingFor == dropTargetNumGot){
		//Show image
		ui.draggable.css("top", $(this).css("top"));
		ui.draggable.css("left", $(this).css("left").replace("px", "") - 400 + "px");
		ui.draggable.css("width", $(this).css("width"));
		ui.draggable.css("position", "absolute");
		ui.draggable.css("z-index", "1");
		
		ui.draggable.draggable( 'disable' );
		ui.draggable.draggable({ revert: false });
		
		$(this).droppable( 'disable' );
		$(this).css("display", "none");
		
		$("#img_" + dropTargetNumGot).removeClass('disabledImage');
		
		answeredItems++;
		$("#answeredText").text(answeredItems + "/" + numItemsInSet);
		
		showFeedback("correct", $(jSection.find("feedback")[dropTargetNumLookingFor - 1]).text());
	}else{
		showFeedback("incorrect", $(jSection.find("hint")[dropTargetNumLookingFor - 1]).text());
	}	
}

function playAudio(index){
	var file_audio = $(jSection.find("file_audio")[index - 1]).text();
	audio_play(mediaPath + "mp3/" + file_audio);
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

function closeFeedback(){
	$('#feedback').hide();
	
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
		////todo
		if($(".ui-droppable-disabled").length == numItemsInSet){
			setCompletedShown = true;
			showFeedback("set_completed");
		}
	}	
}

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