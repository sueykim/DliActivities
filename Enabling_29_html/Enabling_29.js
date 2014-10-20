var debug = false;

// To display ruby tag
var isJapanese = false;

$(document).ready(function() {
	audioInit();

	/*$('body').bind('touchstart', function (ev) { 
		alert("body touchstart")
		//ev.preventDefault();
	});*/
	
	if(document.getElementById('audioPlayer').play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}
	
	forceVidType = "html";
	
	mediaPath = "sampleData/";
	xmlFilename = "sampleData/Enabling_29.xml";
	jsonFilename = "sampleData/Enabling_29.js";
	keyboardFilename = "sampleData/keyboard.js";
    cssFilename = "styles/Enabling_29.css";
    
	loadActivity(parseXml);
	
	if(params["debug"] != null){
		debug = true;
	}
	
	document.onselectstart = function(){ return false; }
});

function keyboardLoadCallback(){
	$('#keyboard > div').draggable({ helper: 'clone', appendTo: 'body',revert: false , stack: "div"});
}

function writeTimesTriedArray(jKeyword, letterIndex, timesTried){
	//Get times tried
	var timesTriedAttr = jKeyword.attr("times_tried")
	
	//Convert to array
	var timesTriedArr = []
	if(timesTriedAttr == undefined){
		//Initialize times tried array
		var textLength = jKeyword.find("tl_word > tl_text").text().length
		for(var i = 0; i < textLength; i++){
			timesTriedArr.push(0)
		}
	}else{
		timesTriedArr = timesTriedAttr.split(",")
	}
	
	//Update letter times tried
	timesTriedArr[letterIndex] = timesTried
	
	//Write to keyword xml
	jKeyword.attr("times_tried", timesTriedArr.join())
}

function getTimesTried(jKeyword, letterIndex){
	var timesTried = jKeyword.attr("times_tried")

	if(timesTried == undefined){
		return 0;
	}else{
		return timesTried.split(",")[letterIndex]
	}
}

function dropFunction(event, ui ) {
	var jDropTarget = $(event.target)
	jDropTarget.removeClass("dragOver")
	
	var dragLetter = $(ui.draggable).text()

	//Get the keyword index and the letter index
	var letterIndex = jDropTarget.index()
	var jWordContainer = $(event.target).parents(".wordContainer")
	var keywordIndex = jWordContainer.index()
	
	//What letter are we looking for?
	var jKeyword = $(jSection.find("keyword")[keywordIndex])
	var letterLookingFor = jKeyword.find("tl_word > tl_text").text()[letterIndex]
	
	if(letterLookingFor == dragLetter){
		//We have a match so remove missing class, 
		//  change out the letters, and check if word is completed
		jDropTarget.droppable('disable')
		
		jDropTarget.text(dragLetter)
		
		jDropTarget.removeClass("missing")
		
		if(jWordContainer.find(".missing").length == 0){
			//Word is completed
			jKeyword.attr("completed","true")
			jWordContainer.attr("completed","true")
			
			if(jSection.find("keyword[completed]").length == 
				jSection.find("keyword").length){
				$("body").attr("state_all_words_finished", "true")
			}
		}
	}else{
		if(debug){
			alert("incorrect")
		}
	}
	
    if(homeworkStatus){
    	logStudentAnswer(
    			currentSet + ":" + keywordIndex + ":" + letterIndex,	
    			dragLetter,
    			letterLookingFor)
	
	    var timesTried = getTimesTried(jKeyword, letterIndex)
	    timesTried++
			
	    logStudentAnswerAttempts(
	    			currentSet + ":" + keywordIndex + ":" + letterIndex,
	    			timesTried);
        
    	writeTimesTriedArray(jKeyword, letterIndex, timesTried)
    }
}

var priorFeedbackType = ""

function showFeedback(value, textInput){
	priorFeedbackType = value
	setBtnLock = true
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	var text = "";
	if (!isJapanese) {
		text = textInput;
	}
	else {
		// To display ruby tag
		text = displayRubyTag(textInput);
	}
	
	switch(value){
		case "clue":
			$("#feedbackHeader").html("<h3>Hint</h3>")
			$("#feedbackText").html(text);
			break;
		case "incorrect":
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
			$("#feedbackText").html(text);
			
			if($("#videoContainer[video_file]").length > 0){
				loadVideo(mediaPath, 
						$("#videoContainer[video_file]").attr("video_file"), 
						"Enabling_29");
				
			}
			break;
		case "set_completed":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png">');
			$("#feedbackText").html(text);
			
			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("OK");
			}
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("OK");
			break;
	}
	

	$("body").attr("state_feedback" , "true")
	$("body").attr("state_clickGuard" , "true")
	
	$("#feedbackTextContainer").mCustomScrollbar("destroy");
	$("#feedbackTextContainer").mCustomScrollbar();
	
	//This is a fix for the mCustomScrollbar freezing the video_file
	if(document.getElementById("videoTag") != undefined){
		document.getElementById("videoTag").play();
	}
	
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
	setBtnLock = false
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#correctAnswer").text("");
	
	$("body").attr("state_feedback" , "false")
	
	if(activityCompletedShown){
		return;
	}
	
	$("body").attr("state_clickGuard" , "false")
	
	if(priorFeedbackType == "correct"){
		//Are all the keywords matched
		if(jSection.find("keyword[word_found='true']").length == 
			jSection.find("keyword").length){
			//All words found so set completed
			jSection.attr("completed","true")
			
			setCompletedShown = true
			showFeedback("set_completed", "Set completed")
		}
	}else if(setCompletedShown){
		$("body").attr("state_clickGuard" , "true")
		
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

var rtl = false;

function parseXml(t_xml){
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	if($(xml).find("content").attr("rtl") == "true"){
		rtl = true
		$("body").attr("rtl", "true")
	}

	numSets = $(xml).find("set").length;
	if($(xml).find("content").attr("hw") != undefined){
		homeworkStatus = $(xml).find("content").attr("hw")
	}
	
	loadSet(0);
}

function loadSet(value){
	$("body").attr("state_all_words_finished" , "")
	$("body").attr("state_feedback" , "")
	$("body").attr("state_clickGuard" , "")
	$("body").attr("state_letter_grid_key" , "")
	
	
	currentSet = value;

	setCompletedShown = false;

	jSection = $($(xml).find("set")[currentSet]);

	if(jSection.find("keyword[completed]").length == 
		jSection.find("keyword").length){
		$("body").attr("state_all_words_finished", "true")
	}	
	
	if(jSection.find("keyword > tl_word > tl_text[missingLetters]").length == 0){
		//There are no missing
		$("body").attr("state_letter_grid_key" , "true")
	}
	
	//Load the letter grid
	$("#letterGrid").empty()
	var jLetterGrid = $(jSection.find("> letter_grid"))
	jLetterGrid.find("row").each(function(i,v){
		var jSnippetRow = $($("#letterGridRow_snippet").html());
		
		var letterArray = $(v).text()
								.replace("\t","")
								.replace("  ", " ")
								.split(" ") 
		
		if($("body").attr("rtl") == "true"){
			letterArray = letterArray.reverse()
		}
		
		var jSnippetLetter = $($("#letter_snippet").html());
		
		$.each(letterArray, function(i,v){
			if(v.length == 0){
				return
			}
			
			var jSnippetLetterClone = jSnippetLetter.clone()
			jSnippetLetterClone.text(v)
							
			jSnippetRow.append(jSnippetLetterClone)
		})
		
		$("#letterGrid").append(jSnippetRow)
	})

	
	//Get snippet
	var jSnippetWord = $($("#wordContainer_snippet").html());
	
	//load words
	$("#rightContainer").empty()
	
	jSection.find("keyword").each(function(i,v){
		var jSnippetWordClone = $(jSnippetWord.clone())
		var missingLetterArr = []
		var jKeyword = $(v)
		
		if(jKeyword.attr("completed") != undefined &&
				jKeyword.attr("completed") == "true"){
			jSnippetWordClone.attr("completed","true")
		}
		
		if(jKeyword.find("> tl_word > tl_text[missingLetters]").length != 0){
			//Keyword has missing letters
			jSnippetWordClone.attr("has_missing_letters","true")
			
			var missingLetterArr = 
				jKeyword.find("> tl_word > tl_text[missingLetters]")
										.attr("missingLetters")
										.split(",")			
		}
		
		var wordText = $(jKeyword.find("tl_text")).text()
		jSnippetWordClone.find(".wordText").text(wordText)
		
		
		var wordLettersHTML = ""
		for(var i=0; i<wordText.length; i++){
			if(missingLetterArr.indexOf(String(i+1)) >= 0){
				//This is a missing letter
				wordLettersHTML += "<div class='wordLetter missing'>_</div>"
			}else{
				//Not a missing letter
				wordLettersHTML += "<div class='wordLetter'>" + wordText[i] + "</div>"
			}
		}
		
		jSnippetWordClone.find(".wordLetters").html(wordLettersHTML)
		
		$("#rightContainer").append(jSnippetWordClone.outerHTML())
		
		$(".wordLetters .missing").droppable({
				drop: dropFunction,
				over: function(event, ui){ 
					$(event.target).addClass("dragOver")
			    },
			    out: function(event, ui){
			    	$(event.target).removeClass("dragOver")
			    }
			})
	})	
	
	if (!isJapanese) {
		////$('#dragBubbleText_' + i).html(iconText);
	}
	else {
		// To display ruby tag
		////$('#dragBubbleText_' + i).html(displayRubyTag(iconText));
	}
	
	if(jSection.attr("completed") == "true"){
		//We've completed this set
		$("body").attr("state_clickGuard" , "true")
		$("body").attr("state_letter_grid_key" , "true")
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
	
	//If all of the keywords have been completed (ie all of the drag dropped letters
	//placed, then set the state appropriately
	if(jSection.find("keyword[completed]").length == 
		jSection.find("keyword").length){
		$("body").attr("state_all_words_finished", "true")
	}
	
	//Load all of the found words into the grid
	jSection.find("keyword[word_found='true']").each(function(i,v){
		var wordCoords = $(v).find("tl_word_coordinates")
		
		var regex = /[ ]?([A-Z])([0-9]+)[:]([A-Z])[,]?/g
		
		var parsedRow 
		while(parsedRow = regex.exec($(wordCoords).text())){
			//Alpha index to number
			var colIndex = letterToNumber(parsedRow[1])
			
			$("#letterGrid > .letterGridRow:eq(" + 
					(parsedRow[2] - 1) + ") > div:eq(" + 
					(colIndex - 1) +")").addClass("selectedLetterGridLetter")
		}
	})
	
	updateNavButtons();
}


var dragTally = 0

function letterToNumber(string) {
    string = string.toUpperCase();
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sum = 0, i;
    for (i = 0; i < string.length; i++) {
        sum += Math.pow(letters.length, i) * (letters.indexOf(string.substr(((i + 1) * -1), 1)) + 1);
    }
    return sum;
}

function numberToLetter(n) {
    var s = "";
    while(n >= 0) {
        s = String.fromCharCode(n % 26 + 97) + s;
        n = Math.floor(n / 26) - 1;
    }
    return s.toUpperCase();
}

function wordHelpClicked(v){
	var itemNum = $(v).parent().index()
	var jKeyword = $(jSection.find("keyword")[itemNum])
	var jClueListPosition = $(jKeyword.find("clue > clue_list > list_position"))
	
	if(jClueListPosition.attr("clue_shown") == undefined){
		showFeedback("clue", jClueListPosition.find("hint1_text").text())
		jClueListPosition.attr("clue_shown", "")
	}else{
		//Clue shown so highlight letter
		var wordCoords = jKeyword.find("tl_word_coordinates")
		var regex = /[ ]?([A-Z])([0-9]+)[:]?([A-Z])?[,]?/g
				
		var parsedRow = regex.exec($(wordCoords).text())
		
		var rowNum = parsedRow[2] - 1
		var colNum = letterToNumber(parsedRow[1]) - 1
		
		$($($("#letterGrid > .letterGridRow")[rowNum])
					.find("> div")[colNum])
					.addClass("highlightFirstLetter")
		
		setTimeout(function(){
				$("#letterGrid .highlightFirstLetter").removeClass("highlightFirstLetter")
			},3000)
	}
}

function playBtnClicked(v){
	var itemNum = $(v).parent().index()
   	
	var jKeyword = $(jSection.find("keyword")[itemNum])
	var mediaFile = jKeyword.find("tl_media > media_file").text()
	
	$(v).parent().attr("word_played", "true")
	
	//todo Handle for video or text
	switch(jKeyword.find("tl_media > media_type").text()){
		case "audio":
			audio_play_file(removeFileExt(mediaFile) ,mediaPath );	
			break;
	}
	
	if(jKeyword.find("> tl_word > tl_text[missingLetters]").length == 0){
		jKeyword.attr("completed", "true")
	}else{
		//Keyword has missing letters so display
	}
	
	if(jSection.find("keyword[completed]").length == 
		jSection.find("keyword").length){
		$("body").attr("state_all_words_finished", "true")
	}
}

var jStartLetter = undefined;
function letterGridLetterDown(v){
	if(jStartLetter){
		//Something wrong so clear all current letterGrid letter and start over
		$("#letterGrid .currentLetterGridLetter").removeClass("currentLetterGridLetter")
	}
	
	jStartLetter = $(v)
	jStartLetter.addClass("currentLetterGridLetter")
}



//Need to draw only horizontal, verticle, and diagonal lines
function letterGridLetterMove(v){
	var jCurrentLetter = $(v)
	
	if(!jStartLetter){
		return
	}
	
	$("#letterGrid .currentLetterGridLetter").removeClass("currentLetterGridLetter")
	jStartLetter.addClass("currentLetterGridLetter")
	
	var startRowCol = getLetterRowCol(jStartLetter)
	var currentRowCol = getLetterRowCol(jCurrentLetter)
	
	if(startRowCol['row'] == currentRowCol['row'] &&
			 startRowCol['col'] == currentRowCol['col']){
		return;
	}
	
	//Clear all
	
	//Handle verticle
	if(startRowCol["col"] == currentRowCol["col"]){
		if(startRowCol["row"] < currentRowCol["row"]){
			//Down
			for(i=startRowCol["row"]; i <= currentRowCol["row"]; i++){
				$("#letterGrid > .letterGridRow:eq(" + 
						i + ") > div:eq(" + startRowCol["col"]  +")").addClass("currentLetterGridLetter")
			} 
		}else{
			//Up
			for(i=currentRowCol["row"]; i <= startRowCol["row"]; i++){
				$("#letterGrid > .letterGridRow:eq(" + 
						i + ") > div:eq(" + startRowCol["col"]  +")").addClass("currentLetterGridLetter")
			}
		}
	}
	
	//Handle horizontal
	if(startRowCol["row"] == currentRowCol["row"]){
		if(startRowCol["col"] < currentRowCol["col"]){
			//Right
			for(i=startRowCol["col"]; i <= currentRowCol["col"]; i++){
				$("#letterGrid > .letterGridRow:eq(" + 
						startRowCol["row"] + ") > div:eq(" + i +")").addClass("currentLetterGridLetter")
			} 
		}else{
			//Left
			for(i=currentRowCol["col"]; i <= startRowCol["col"]; i++){
				$("#letterGrid > .letterGridRow:eq(" + 
						startRowCol["row"] + ") > div:eq(" + i +")").addClass("currentLetterGridLetter")
			}
		}		
	}
	
	//Handle Diagonal
	if(startRowCol["row"] < currentRowCol["row"]){
		if(currentRowCol["col"] < startRowCol["col"]){
			//Possible 225 deg
			var rowDiff = currentRowCol["row"] - startRowCol["row"]
			var colDiff = startRowCol["col"] - currentRowCol["col"]
			
			if(rowDiff == colDiff){
				//We have a match so plot it out
				for(i=0; i <= colDiff; i++){
					$("#letterGrid > .letterGridRow:eq(" + 
							(currentRowCol["row"] - i) + ") > div:eq(" + 
							(currentRowCol["col"] + i) +")").addClass("currentLetterGridLetter")
				}
			}
		}else{
			//Possible 315 deg
			var rowDiff = currentRowCol["row"] - startRowCol["row"]
			var colDiff = currentRowCol["col"] - startRowCol["col"]
			
			if(rowDiff == colDiff){
				//We have a match so plot it out
				for(i=0; i <= colDiff; i++){
					$("#letterGrid > .letterGridRow:eq(" + 
							(currentRowCol["row"] - i) + ") > div:eq(" + 
							(currentRowCol["col"] - i) +")").addClass("currentLetterGridLetter")
				}
			}
		}
	}else{
		if(startRowCol["col"] < currentRowCol["col"]){
			//Possible 45 deg
			var rowDiff = startRowCol["row"] - currentRowCol["row"]
			var colDiff = currentRowCol["col"] - startRowCol["col"]
			
			if(rowDiff == colDiff){
				//We have a match so plot it out
				for(i=0; i <= colDiff; i++){
					$("#letterGrid > .letterGridRow:eq(" + 
							(currentRowCol["row"] + i) + ") > div:eq(" + 
							(currentRowCol["col"] - i) +")").addClass("currentLetterGridLetter")
				}
			}
		}else{
			//Possible 135 deg
			var rowDiff = startRowCol["row"] - currentRowCol["row"]
			var colDiff = startRowCol["col"] - currentRowCol["col"]
			
			if(rowDiff == colDiff){
				//We have a match so plot it out
				for(i=0; i <= colDiff; i++){
					$("#letterGrid > .letterGridRow:eq(" + 
							(currentRowCol["row"] + i) + ") > div:eq(" + 
							(currentRowCol["col"] + i) +")").addClass("currentLetterGridLetter")
				}
			}
		}
	}
	
	var rowDiff = startRowCol["row"] - currentRowCol["row"]
	
}

function bodyMouseUp(){
	jStartLetter = undefined;
	$("#letterGrid .currentLetterGridLetter").removeClass("currentLetterGridLetter")
}

function generateKeywordCoordsObj(jKeyword){
	var wordCoords = jKeyword.find("tl_word_coordinates")
	
	//Load keyword Obj (used to compare against the currently selected obj
	var regex = /[ ]?([A-Z])([0-9]+)[:]?([A-Z])?[,]?/g
	var keywordObj = {}
	
	var parsedRow 
	while(parsedRow = regex.exec($(wordCoords).text())){
		if(parsedRow[3] == undefined){
			parsedRow[3] = $("#letterGrid > .letterGridRow:eq(" + 
								(parsedRow[2] - 1) + ") > div:eq(" + 
								(letterToNumber(parsedRow[1]) - 1) +")").text()
		}
		
		keywordObj[parsedRow[1] + parsedRow[2]]= parsedRow[3]
	}
	
	return keywordObj
}

function findCurrentSelectionMatch(){
	var currentSelectedObj = {}
	
	//Generate current selected array
	$("#letterGrid .currentLetterGridLetter").each(function(i,v){
		var rowCol = getLetterRowCol($(v))
		var letter = $(v).text()
		
		var colAlphaIndex = numberToLetter(rowCol.col)
		currentSelectedObj[colAlphaIndex + (rowCol.row + 1)] = letter
	})
	
	//Loop through keywords
	var keyword
	jSection.find("keyword").each(function(i,v){
		//$("#letterGrid .currentLetterGridLetter")
	
		var keywordObj = generateKeywordCoordsObj($(v))
		
		//Now test to see if this matches the current selected obj
		var keys = Object.keys(keywordObj)
		if(keys.length != Object.keys(currentSelectedObj).length){
			//No match here so continue
			return
		}
		
		//Try forward
		var matchFound = true;
		for(var i=0; i < keys.length; i++){
			var keywordKey = keys[i]
			var value = keywordObj[keywordKey]
			
			if(currentSelectedObj[keywordKey] != undefined &&
					keywordObj[keywordKey] == currentSelectedObj[keywordKey]){
				//letter matches
			}else{
				//letter doesn't match to break
				matchFound = false
				break
			}
		}
		
		if(!matchFound){
			//Try backward
			var matchFound = true;
			keys = keys.reverse()
			
			for(var i=0; i < keys.length; i++){
				var keywordKey = keys[i]
				var value = keywordObj[keywordKey]
				
				if(currentSelectedObj[keywordKey] != undefined &&
						keywordObj[keywordKey] == currentSelectedObj[keywordKey]){
					//letter matches
				}else{
					//letter doesn't match to break
					matchFound = false
					break
				}
			}
		}
		
		if(matchFound){
			keyword = v
			return false
		}
		
	})
	
	return keyword
}

function constructFeedbackHTML(jKeyword){
	var jFeedbackContentSnip = $($("#feedbackContent_snippet").html());

	jFeedbackContentSnip.find("#feedbackContentText")
			.html(jKeyword.find("clue > feedback_text").text())
			
	//Load the text
	switch(jKeyword.find("clue > feedback > media_type").text()){
		case "video":
			jFeedbackContentSnip.find("#feedbackContentMedia")
				.html("<div id='videoContainer' video_file='" 
						+ removeFileExt(jKeyword.find("clue > feedback > media_file").text()) 
						+"' class='roundCorners'></div>")
			break;
		case "image":
			jFeedbackContentSnip
					.find("#feedbackContentMedia")
					.html("<img src='" + mediaPath + "jpg/" +  
							jKeyword.find("clue > feedback > media_file").text() + "'>")
			break;
		default:
			
	}
	
	return jFeedbackContentSnip.html()
}

function letterGridMouseUp(){
	//Check to see if a word is highlighted
	var selectedKeyword = findCurrentSelectionMatch()
	
	if(homeworkStatus){
		if(selectedKeyword == undefined){
		 	logStudentAnswer(
	    			currentSet,	
	    			$("#letterGrid .currentLetterGridLetter").text(),
	    			"Unknow what the user was looking for")
		}else{
		 	logStudentAnswer(
    			currentSet,	
    			$(selectedKeyword).find("tl_word > tl_text").text(),
    			$(selectedKeyword).find("tl_word > tl_text").text())
		}
	}
	
    
	if(selectedKeyword){
		//The word is highlighted so mark the xml and show the letters as selected
		$("#letterGrid .currentLetterGridLetter")
			.addClass("selectedLetterGridLetter")
			.removeClass("currentLetterGridLetter")	
		
		$(selectedKeyword).attr("word_found","true")
		
		showFeedback("correct", constructFeedbackHTML($(selectedKeyword)))
	}else{
		//No match so just disregard the current selection
		$("#letterGrid .currentLetterGridLetter")
			.removeClass("currentLetterGridLetter")
	}
	
	//Handle times tried logging
	if (homeworkStatus) {
		var timesTriedAttr = jSection.attr("timesTried")
		var timesTried = 0
		if(timesTriedAttr != undefined){
			timesTried = timesTriedAttr
		}
		
		timesTried++
		
		logStudentAnswerAttempts(
    			currentSet ,
    			timesTried);
		jSection.attr("timesTried",timesTried)
	}
}

function getLetterRowCol(jVal){
	return {"row":jVal.parent().index(), "col":jVal.index()}
}

function handleTouchStart(ev){
	ev.preventDefault()
	letterGridLetterDown($(ev.currentTarget))	
}

function handleTouchMove(ev){
	ev.preventDefault()
	
	var touch = ev.touches[0];
	//$(".activity_hd").text(touch.pageX + ":" + touch.pageY)
	
	var coords = documentCoordinateToViewportCoordinate(touch.pageX, touch.pageY)
	
	var element = document.elementFromPoint(coords.x, coords.y)
	
	if(element){
		if($(element).hasClass("letterGridLetter")){
			//alert("found element")
			letterGridLetterMove($(element))
		}else{
			
		}
	}else{
		//alert("element not found")
	}
}