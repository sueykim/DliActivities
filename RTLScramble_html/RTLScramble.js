$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "RTLScramble_sampleData.xml";
	jsonFilename = mediaPath + "RTLScramble_sampleData.js";
	cssFilename = "styles/RTLScramble.css";
	
	loadActivity(parseXml);
	
}); 

var dragToggle = false
var lockNextOut = false

function parseXml(t_xml){
	$("body").droppable({
		drop: function( event, ui ) {
			removeDropHighlights()
		}
	})
	
	if($(xml).find("content").attr("dir") == "rtl"){
		$('body').attr("dir","rtl")
	}
	
	/*$(".word").hover(function(){
		$(this).attr("")
	})*/
	
	numSets = $(xml).find("section").length
	
	loadSet(0)
}

function removeDropHighlights(){
	$("#main .overRight").removeClass("overRight")
	$("#main .overLeft").removeClass("overLeft")	
}

function highlightCorrectLetters(jNode){
	var jWordContainer = jNode.closest(".wordContainer")
	
	//var lookingFor = jWordContainer.attr("targetWord") 
	var lookingFor = cleanUpForIE9($($($(xml).find("content > section")[currentSet]
							).find("> item")[jWordContainer.index()]
						).find("letter").text())
					
	var found = cleanUpForIE9(jWordContainer.find(".letter").text())
	
	jWordContainer.find(".letter").each(function(i,v){
		var text = cleanUpForIE9($(v).text()) 

		if(lookingFor[i] == text){
			$(v).addClass("highlightLetter")	
		}else{
			$(v).removeClass("highlightLetter")
		}
	})
	
	if(lookingFor == found){
		//alert("word finished")
		jWordContainer.attr("completed","true")
		
		var index = jWordContainer.index()
		
		var jItem = $(
						$(
							$(xml).find("section")[currentSet]
						).find("item")[index]
					)
		
		jItem.attr("completed", "true")
		
		var feedback = $(jItem.find("feedback")).text()
					
		showFeedback("correct", feedback)
	}
}

function cleanUpForIE9(text){
	//Have to add the cleanup for IE9
	return text.replace(/\n/g,"")
		.replace(/\t/g," ")
		.replace(/\s+/g," ")
}

function isWordFinished(){
	//what is the word
	//What are the letters
}

var scaleFactor = 1.17

function loadSet(setNum){
	setCompletedShown = false;
	//Clear the stage
	$("#wordsContainer").empty()
	
	currentSet = setNum;
	updateSetText();
	
	//Load image
	var jGraphic = $($($(xml).find("section")[setNum]).find("> graphic"))
	$("#img").attr("src", 
		mediaPath + "png/" 
			+ jGraphic.text()
	)
	
	//Load image dimensions
	$("#img").attr("width", (jGraphic.attr("width") * scaleFactor) + "px")
	$("#img").attr("height", (jGraphic.attr("height") * scaleFactor) + "px") 
	
	//Load the words
	$($($(xml).find("section")[setNum]).find("> item")).each(function(i_item,v_item){
		//Load the letters
		var jWord = $($("#word_snippet").html())

		//Mark it if it is completed
		if($(v_item).attr("completed")){
			jWord.attr("completed","true")
		}
		
		//Load target word
		jWord.attr("targetWord",$($(v_item).find("lang_tl")).text())
		
		//Load word offsets
		jWord.css("left", ($($(v_item).find("left")).text() * scaleFactor) + "px")
		jWord.css("top", ($($(v_item).find("top")).text() * scaleFactor) + "px")
		
		$($(v_item).find("> letter")).each(function(i_letter, v_letter){
			var jLetter = $($("#letter_snippet").html())
			
			$(jLetter.find(".letter")).text($(v_letter).text())
			
			jLetter.insertBefore(jWord.find(".spacer")[1])
		})
		
		var wordText = cleanUpForIE9($(jWord.find(".letter"))
								.text())

		if(wordText.length < 2){
			alert("Content Error- A word can not be one letter")
			return;
		}
		
		//Make sure the shuffle doesn't end with the correct word
		var iterationCount = 0
		while(wordText == $($(v_item).find("lang_tl")).text() ||
			wordText.split("").reverse()
					.join().replace(/[,]/g, "")
							== $($(v_item).find("lang_tl")).text()){
			//Debug output
			iterationCount++
			
			if(iterationCount > 1){
				if(params['debug'] != undefined){
					alert("having to reshuffle word: " 
							+ wordText + ","
							+ $($(v_item).find("lang_tl")).text()
						)
				}
			}
			
			//Shuffle
			jWord.find(".letterContainer").shuffle()
			
			wordText = cleanUpForIE9($(jWord.find(".letter"))
								.text())
		}
		
		//Load the shuffled word		
		var dir = $("body").attr("dir")
		if(dir != undefined && dir == "rtl"){
			wordText = wordText.split("")
								.reverse()
								.join()
								.replace(/[,]/g, "")
		}
		
		$(jWord.find(".word")).text(wordText)
		
		$("#wordsContainer").append(jWord)
		
		highlightCorrectLetters(jWord)
	})
	
	$(".letterContainer").draggable({ helper: "clone", revert: true, zIndex: 100 , containment: "parent" })
	
	$(".leftDrop" ).droppable({
			drop: function(event, ui){dropFunction( event, ui, "left")},
			over: function( event, ui ) {overFunction(event, ui, "left")},
			out: function( event, ui ) {outFunction(event,ui, "left")}
		});

	$(".rightDrop" ).droppable({
			drop: function(event, ui){dropFunction( event, ui, "right")},
			over: function( event, ui ) {overFunction(event, ui, "right")},
			out: function( event, ui ) {outFunction(event,ui, "right")}
		});	
		
		//Highlight the spaces
			
		//$("#main .letter:contains(' ')").addClass("letterSpace")
		
		//IE9 doesn't like contains
		$("#main .letter").each(function(i,v){
			var text = cleanUpForIE9($(v).text())
			
			if(text == " "){
				$(v).addClass("letterSpace")
				console.log("letterSpace added")
			}
		})
}

function dropFunction( event, ui , dir) {
	if(dragToggle == false){
		console.log((dir == "right")? "r": "l" + " received drop before over")	
	}

	removeDropHighlights()

	var letterContainer = $(event.target).closest(".letterContainer") 
	$(ui.draggable).css("width","0px")

	if(dir == "right"){
		$(ui.draggable).insertAfter(letterContainer);
	}else{
		$(ui.draggable).insertBefore(letterContainer);
	}
	
	ui.helper.remove()

	$(ui.draggable).animate({"width":"20px"},
					highlightCorrectLetters($(event.target)))

	var jWord = $(event.target).closest(".wordContainer") 

	var wordText = cleanUpForIE9($(jWord.find(".letter")).text())

	var dir = $("body").attr("dir")
	if(dir != undefined && dir == "rtl"){
		wordText = wordText.split("")
							.reverse()
							.join()
							.replace(/[,]/g, "")
	}

	$(jWord.find(".word")).text(wordText)
}

function overFunction( event, ui, dir ){
	if(dragToggle == true){
		console.log((dir == "right")? "r": "l" + " received over before out")	
		lockNextOut = true
	}

	dragToggle = true
	removeDropHighlights()
	
	if(dir == "right"){
		$(event.target).addClass("overRight")
	}else{
		$(event.target).addClass("overLeft")
	}
}

function outFunction( event, ui, dir ){
	if(lockNextOut == true){
		lockNextOut = false;
		return;
	}

	if(dragToggle == false){
		console.log((dir == "right")? "r": "l" + "received out before over")	
	}

	dragToggle = false

	removeDropHighlights()
}

function playAudio(obj){
	var index = $(obj).closest(".wordContainer").index()
	var file_audio = $(
						$(
							$(
								$(xml).find("section")[currentSet]
							).find("item")[index]
						).find("file_audio")
					).text()
					
	audio_play_file(removeFileExt(file_audio), mediaPath);
}

var isJapanese = false

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
			$("#feedbackHeader").html('<img src="../common/img/feedback_incorrect.png" width="139px" height:38px">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img src="../common/img/feedback_correct.png" width="122px" height:38px">');
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
			////$("#feedbackBtn").html("Next Activity");
                        $("#feedbackBtn").hide();
			break;
	}

	$('#feedback').show();
	$("#clickGuard").css("display","block")
	
	$("#feedbackText").mCustomScrollbar("destroy");
	$("#feedbackText").mCustomScrollbar();
}

	
function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();

	$("#clickGuard").css("display","none");
	
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
		if($("#main .wordContainer:not([completed='true'])").length == 0){
			setCompletedShown = true;
			showFeedback("set_completed");
		}
	}
	
	// For homework
	/*if (homeworkStatus) {
		checkAnswers();
	}*/
}

function loadNextSet(){
	if(currentSet + 1 == numSets){
		activityCompletedShown = true;
	
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
			$("#activityGuard").css("display","block");
		}else{
			showFeedback("activity_completed");
			$("#activityGuard").css("display","block");
		}
	}else{
		loadSet(currentSet + 1);
	}
}

//This function is in case they are using a touch screen
var wordContainer
function touchStart(){
	$("#main .wordContainer").removeAttr("touched")
	//wordContainer = $(this).closest(".wordContainer")
	wordContainer = this
	$(wordContainer).attr("touched", "true")
	
	console.log("touched is " + $(wordContainer).attr("touched"))
}