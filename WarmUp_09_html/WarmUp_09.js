$(document).ready(function() {
	audioInit();
	
	hideClickGuard();
	hideStageClickGuard();
	
	$('#feedback').hide();
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/WarmUp_09_default.css";
	xmlFilename = mediaPath + "WarmUp_09_sample.xml";
	jsonFilename = mediaPath + "WarmUp_09_sample.js";
	
	keyboardFilename = "../common/keyboards/test_keyboard.js";
	
	loadActivity(parseXml);
	
	/*if(params["debug"] != null){
		showAnswers = true;
	}*/
}); 

function parseXml(t_xml){
	numSets = $(xml).find("set").length;
	currentSet = 0;
	loadSet(currentSet);
}


var numRows = 3;
var numCols = 3;
var jSet;

function loadSet(value){
	currentSet = value;
	
	jSet = $($(xml).find("set")[value]);
	
	$("#input").attr("value", "");
	
	$("#correctBubble").css("display","none");
	$("#incorrectBubble").css("display","none");	

	if(jSet.attr("completed") == "true"){
		setState("set_completed");
	}else{
		setState("set_uncompleted");
		loadBlocks();
	}

	$("#englishWord").text(jSet.find("en_word").text());
	$("#stageImg").attr("src", mediaPath + "png/" + jSet.find("image").text());
	
	//clear the letteer answered array
	for(var i=0; i< jSet.find("tl_word").text().length; i++){
		if(jSet.attr("completed") == "true"){
			letterAnsweredArray[i] = true;
		}else{
			letterAnsweredArray[i] = false;
		}
	}

	

	generateMissingLetters(letterAnsweredArray);

	updateNavButtons();
}

function loadBlocks(){
	var totalWidth = $("#imgBlocks_container").css("width");
	var totalHeight = $("#imgBlocks_container").css("height");
	
	totalHeight = totalHeight.replace(/px/g, "");
	totalWidth = totalWidth.replace(/px/g, "")
	
	var tl_word = jSet.find("tl_word").text();
	tl_word = find_unique_characters(tl_word);
	
	if(tl_word.length < 4){
		numCols = 2;
		numRows = 2;
	}else if(tl_word.length < 6){
		numCols = 2;
		numRows = 3;
	}else if(tl_word.length < 9){
		numCols = 3;
		numRows = 3;
	}else if(tl_word.length < 12){
		numCols = 3;
		numRows = 4;
	}else if(tl_word.length < 16){
		numCols = 4;
		numRows = 4;
	}
	
	//Remove border
	totalHeight -= 2 * numRows;
	totalWidth -= 2 * numCols; 
	
	var numBlocks = numCols * numRows;
	var blocksHtml = "";
	
	for(var j=0; j< numBlocks; j++){
		var blockSnip = $("#block_snip").html();
		blockSnip = blockSnip.replace(/_subId/g, j);
		
		if(tl_word[j] != undefined){
			blockSnip = blockSnip.replace("_subLetter", tl_word[j]);
		}else{
			blockSnip = blockSnip.replace("_subLetter", "");
		}
		
		blocksHtml +=  blockSnip;
	}
	
	$("#imgBlocks_container").html(blocksHtml);
	
	//Build the cells
	$('#imgBlocks_container .block').css('height', totalHeight/numRows + 'px');
	$('#imgBlocks_container .block').css('width', totalWidth/numCols + 'px');
	
	//Load the letters
	for(var i=0; i<tl_word.length; i++){
		$($("#imgBlocks_container .blockText")[i]).text(tl_word[i])
	}
	
	//Now scramble them
	$("#imgBlocks_container .blockText").shuffle();
}

function find_unique_characters( string ){
    var unique='';
    for(var i=0; i<string.length; i++){
        if(string.lastIndexOf(string[i]) == i){
            unique += string[i];
        }
    }
    return unique;
}

function setState(value){
	switch(value){
		case "set_completed":
			$("#input").css("display", "none");
			$("#submitBtn").css("display", "none");
			$("#keyboardContainer").css("display", "none");
			
			$("#englishWord").css("display", "block");
			$("#playBtnDiv").css("display", "block");
			
			$('#imgBlocks_container .block').css('opacity',0);
			break;
		case "set_uncompleted":
			$("#input").css("display", "block");
			$("#submitBtn").css("display", "block");
			$("#keyboardContainer").css("display", "block");
			
			$("#englishWord").css("display", "none");
			$("#playBtnDiv").css("display", "none");
			break;
	}
}

var letterAnsweredArray = [];

function generateMissingLetters(answerArray){
	var tl_word = jSet.find("tl_word").text();
	var missingLetters = "";
	
	for(var i=0; i< tl_word.length; i++){
		missingLetters = missingLetters + '<div class="missingLetter">';
		
		if(answerArray != undefined && 
				answerArray[i] == true){
			missingLetters = missingLetters + tl_word[i];
		}else{
			missingLetters = missingLetters + ' ';
		}
		
		missingLetters = missingLetters + '</div>';
	}
	
	$("#missingLetters_container").html(missingLetters);
}


function submitClicked(){
	
	$("#submitBtn").css("background-color","grey");
	
	if($("#input").attr("value") == jSet.find("tl_word").text()){
		//Correct answer entered
		$("#correctBubble").fadeIn();
		 setTimeout(function(){
				$("#correctBubble").fadeOut();
			},3000);
		
		jSet.attr("completed","true");
		
		setState("set_completed");

		for(var i=0; i< letterAnsweredArray.length; i++){
			letterAnsweredArray[i] = true;
		}
		
		generateMissingLetters(letterAnsweredArray);
		
		if(checkComplete()){
			showFeedback("activity_completed");	
			
			completed();
		}
	}else{
		//Incorrect
		$("#incorrectBubble").fadeIn();
		 setTimeout(function(){
				$("#incorrectBubble").fadeOut();
			},3000);
	}
}


function blockClicked(value){
	var letter = $("#block" + value + " .blockText").text();
	var tl_word = jSet.find("tl_word").text();
	
	for(var i = 0; i < tl_word.length; i++){
		if(letter == tl_word[i]){
			letterAnsweredArray[i] = true;
		}
	}
	
	$("#block" + value).css("opacity","0");
	
	generateMissingLetters(letterAnsweredArray);
}

function checkComplete(){
	var notCompleted = false;
	$(xml).find("set").each(function(){
		if($(this).attr("completed") != undefined &&
			$(this).attr("completed") == "true"){
			return;
		}else{
			//Activity is not completed so stop
			notCompleted = true;
			return false;
		}
	});
	
	return !notCompleted;
}

function completed(){
	if(parent.activityCompleted){
		parent.activityCompleted(1,0);
	}
}

function playAudio(){
	var file_audio = $(jSet.find("tl_word")).attr("audio");
	audio_play_file(removeFileExt(file_audio), mediaPath );
}

function submitUp(){
	$("#submitBtn").css("background-color","#F5F5F5");
}

function submitOut(){
	$("#submitBtn").css("background-color","grey");
}

function submitOver(){
	$("#submitBtn").css("background-color","#F5F5F5");
}

function letterClicked(node){
	$("#input").attr("value" , $("#input").attr("value") + $(node).html());
} 

function delClicked(){
	var input = $("#input").attr("value");
	
	if(input.length > 0){
		input = input.substring(0, input.length - 1);
		$("#input").attr("value",input);
	}	
}


function showClickGuard(){
	$("#clickGuard").css("display","block");
}

function hideClickGuard(){
	$("#clickGuard").css("display","none");
}

function showStageClickGuard(){
	$("#stageClickGuard").css("display","block");
}

function hideStageClickGuard(){
	$("#stageClickGuard").css("display","none");
}

function showFeedback(value, text){
	showClickGuard();
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	switch(value){
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

	hideClickGuard();


}