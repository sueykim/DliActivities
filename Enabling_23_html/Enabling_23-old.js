$(document).ready(function() {
	audioInit();
	testVideoSupport();
		
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	$("#clickGuard").css("display", "none");
    
    if(document.getElementById('audioPlayer').play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}
    
    forceVidType = "html";
    
    if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";	
		xmlFilename = "sampleData/Enabling_23_sample.xml";
		jsonFilename = "sampleData/Enabling_23_sample.js";
		//keyboardFilename = "sampleData/keyboard.js";
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
/*		var lang_name_short = getURL_Parameter('language');
		var langName = {ja:'japanese', sp:'spanish', ad:'msa'};
		var lang_name_long = langName.ja;
		keyboardFilename = '../common/keyboards/' + lang_name_long + '_keyboard.js';
*/
		$('.activity_hd').html('');
		$('.activity_description').html('');
	}
	
	
	cssFilename = "styles/enabling_23_dlilearn.css";
	loadActivity(parseXml);
});

var jSection;

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;

function keyboardLoadCallback(){
	$('#keyboard > div').draggable({ helper: 'clone', appendTo: 'body',revert: true , stack: "div"});
	
}

function activityVideoCompleted(){
	$("#videoContainer").removeClass("videoClueList");
	$("#videoContainer").removeClass("videoAudioList");	
	$("#videoContainer").addClass("hidden");	
}

function parseXml(t_xml){
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	numSets = $(xml).find("set").length;

        // true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");

	if(keyboardFilename.length == 0){
		keyboardLayout();
	}
	
	loadKeywordXml();
	
	loadSet(0);
}

function keyboardLayout() {
	//Generate the characters that should be in the keyboard
	var kbHtml = '<div id="keyboard">';

	//var maxKeys = 20;
	var keyObj = {};
	
	$($(xml).find("tl_text").text().replace(/[ ]/g,"").toLowerCase().split("").filter(function(itm,i,a){
	    return i==a.indexOf(itm);
	})).each(function(i,val){	
		keyObj[val] = val;
	});
	
	$.each(keyObj, function(i,val){
		kbHtml += '<div class="keyboardLetter noSelect">' +
						val + '</div>';
	});
		
	$("#keyboardContainer").append($(kbHtml));
	
	$('#keyboard > .keyboardLetter').shuffle(); 
	
	keyboardLoadCallback();
}

function loadSet(value){
	currentSet = value;
	
	jSection = $($(xml).find("set")[currentSet]);

	jSection.find("crossword_size columns")
	
	if(jSection.attr("completed") != undefined &&
		jSection.attr("completed") == "true"){
			setCompleted = true;
	}else{
		setCompleted = false;
	}
	
	constructGrid();
			
	loadCells();
	
	findAllCompletedKeywords();
	
	//Load english audio list
	$("#audioList").html("");
	jSection.find("en_word").each(function(i){
		var enWord = $(this).text(); 
		var jSnip = $("#playBtnSnip").clone();
		
		$(jSnip).find(".dragBubbleText").text(enWord);
		
		$("#audioList").append(jSnip.html().replace(/(['"])playBtn_s1/g, "$1playBtn_s" + (i+1)));
	});
	
	loadClues();
	
	$( "#grid td:not(.invisible)").droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction}); 
	
	updateNavButtons();
	
	if($("#clues").mCustomScrollbar == undefined){
		alert("Scrollbar undefined");
	}else{
		$("#clues").mCustomScrollbar({
			scrollButtons:{
				enable:true
			}
		});
	}
        if($("#audioList").mCustomScrollbar == undefined){
		alert("Scrollbar undefined");
	}else{
		$("#audioList").mCustomScrollbar({
			scrollButtons:{
				enable:true
			}
		});
	}
}


function loadClues(){
	//First convert to XML
	$("clues").empty();
	
	jSection.find("keyword").each(function(i){
		var clueXmlString = "<clue ";
		
		
		switch($(this).find("list_direction").text().toLowerCase()){
			case "up":
				clueXmlString +=" direction='up' ";
				break;
			case "down":
				clueXmlString +=" direction='down' ";
				break;
			case "left":
				clueXmlString +=" direction='left' ";
				break;
			case "right":
			case "across":
				clueXmlString +=" direction='right' ";
				break;
		}
		
		clueXmlString += "index='" + i + "' " 
						+ "number='" + $(this).find("list_direction_no").text() + "' " 
						+ ">" 
							+ $(this).find("en_clue").text() + "</clue>";
		
		$("clues").append(clueXmlString);
	});

	//Now construct the clueList
	$("#clues").html("");
	$.each(["up","down","left","right"], function(i, v){
		if($("clue[direction=" + v +"]").length > 0){
			//Write the direction label
/*			var vLevel = v;
			if (v == "right")
			   vLevel = "across" */
			$("#clues").append("<p class='clueDirectionLabel'>" 
						+ capitaliseFirstLetter(v)
						+ ":</p>");
			
			//Write the elements
			$("clue[direction=" + v +"]").each(function(){
				
				var jSnip = $("#playBtnSnip").clone();
				
				$(jSnip).find(".dragBubbleText").text(
					$(this).attr("number") + ". " + $(this).text());

				$("#clues").append(jSnip.html()
									.replace(/(['"])playBtn_s1/g, "$1cluePlayBtn_s"
										+ $(this).attr("index"))
									.replace(/playEn/g,"playClue")
								);
	
			});

			$("#clues").append("<br/>");
		}	
	});
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var keywordLetterXml;

function playEn(value){
	var keywordIndex = $(value).closest(".dragBubble").index();
	
	var mediaFile = $($(jSection.find("keyword")[keywordIndex])
						.find("> tl_media media_file")).text();
						
	switch($($(jSection.find("keyword")[keywordIndex])
						.find("> tl_media media_type")).text()){
		case "audio":
			audio_play_file(removeFileExt(mediaFile), mediaPath);	
			break;
		case "video":
			loadVideoNoPlayYet(mediaPath, removeFileExt(mediaFile));
			document.getElementById('videoTag').addEventListener('ended', activityVideoCompleted);
			document.getElementById('videoTag').play();
			$("#videoContainer").removeClass("hidden");
			$("#videoContainer").removeClass("videoClueList");
			$("#videoContainer").addClass("videoAudioList");
			break;						
	}
}

function playClue(value){
	var keywordIndex = extractLastNumber($(value).find(">img").attr("id"));;
	
	var mediaFile = $($(jSection.find("keyword")[keywordIndex])
						.find("clue tl_media media_file")).text();
						
	switch($($(jSection.find("keyword")[keywordIndex])
						.find("clue tl_media media_type")).text()){
		case "audio":
			audio_play_file(removeFileExt(mediaFile), mediaPath);	
			break;
		case "video":	
			loadVideoNoPlayYet(mediaPath, removeFileExt(mediaFile));
			document.getElementById('videoTag').addEventListener('ended', activityVideoCompleted);
			document.getElementById('videoTag').play();	
			$("#videoContainer").removeClass("hidden");
			$("#videoContainer").removeClass("videoAudioList");
			$("#videoContainer").addClass("videoClueList");
			break;						
	}
}

function dropFunction(event, ui ){	
	var dragLetter = ui.draggable.text().toLowerCase();
	
	//$(this).find(".letter").text(dragLetter);
	var rowIndex = $(this).parent().index();
	var colIndex = $(this).index();
	
	//Load letter
	$($($($("#grid")
		.find("tr")[rowIndex])
		.find("td")[colIndex])
		.find(".letter")).text(dragLetter)
		.removeClass("invisible")
		.removeClass("redLetter");
	
	
	//Loop through all keywords
	$($(keywordLetterXml).find("keywords")[currentSet]).find("keyword").each(function(index){
		//Does this keyword contain the current dropped cell 
		if($(this).find("letter[row=" + (rowIndex + 1) + "][col=" + (colIndex + 1) + "]").length > 0){
			//The keyword contains the cell
			var jKeyword = $(jSection.find("keyword")[index]);
			
			if(jKeyword.attr("completed") == "true"){
				autoFillKeyword(this);
				return;
			}
			
			var keywordFilled = true;
			var keywordPassed = true;
			
			//Find out if the keyword is filled
			$(this).find("letter").each(function(){
				var letterRowIndex = $(this).attr("row");
				var letterColIndex = $(this).attr("col");
				
				var jLetter = $($($("#grid")
						.find("tr")[letterRowIndex - 1])
						.find("td")[letterColIndex - 1])
						.find(".letter");
				if(jLetter.hasClass("invisible") || 
					jLetter.hasClass("redLetter") || 
					jLetter.text() == ""){
					keywordFilled = false;	
				}
			});
			
			if(keywordFilled){
				//Check that the letters match. If they don't flag them
				$(this).find("letter").each(function(){
					
					var letterRowIndex = $(this).attr("row");
					var letterColIndex = $(this).attr("col");
					
					var jLetter = $($($("#grid")
							.find("tr")[letterRowIndex - 1])
							.find("td")[letterColIndex - 1])
							.find(".letter");
					
					if( jLetter.text() != $(this).attr("letter")){
						//Letters don't match so flag it red
						jLetter.addClass("redLetter");
							
						keywordPassed = false;
					}else{
						//Clear the letter if flagged
						jLetter.removeClass("redLetter");
					}
				});
								
				if(keywordPassed){
					jKeyword.attr("completed", "true");
					feedbackCorrectShown = true;
					showFeedback("correct", jKeyword.find("feedback").text());
					
					// For homework
		                        if (homeworkStatus) {
                                          sendHWdata(1);
                                          answerAttemptsNum = 0;
                                        }
				}else{
					if(jKeyword.attr("hintCount") == undefined){
						jKeyword.attr("hintCount", "1");
						showFeedback("incorrect", jKeyword.find("hint_1").text());
					}else if(jKeyword.attr("hintCount") == "1"){
						jKeyword.attr("hintCount", "2");
						showFeedback("incorrect", jKeyword.find("hint_2").text());
					}else if(jKeyword.attr("hintCount") == "2"){
						jKeyword.attr("completed", "true");
						feedbackCorrectShown = true;
						showFeedback("incorrect", jKeyword.find("feedback").text());
						autoFillKeyword(this);
					}
                                        // For homework
		                        if (homeworkStatus) {
                                          sendHWdata(0);
                                        }
				}
			}
		}
	});
	
	//Find words that have this cell
	//var keywordsForCell = $(keywordLetterXml).find("[]")
}

//For homework
function sendHWdata(N){
        var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";

	answerAttemptsNum++;

	questionID = parseInt(currentSet.toString());
	answer = N == 0 ? 'incorrect' : 'correct';
	context = "--";
        answerAttempts = answerAttemptsNum.toString();

	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	$('#feedbackText').show();
}
function autoFillKeyword(keyword){
	$(keyword).find("letter").each(function(j){
		var jTr = $($("#grid").find("tr")[
						parseInt($(this).attr("row")) - 1
					]);
		var jTd = $(jTr.find("td")[
						parseInt($(this).attr("col")) - 1 
					]);
		
		jTd.removeClass("invisible");
		
		jTd.find(".letter")
			.text($(this).attr("letter"))
			.removeClass("redLetter");
	});
}
var keywordXML

function loadKeywordXml(){
	keywordLetterXml = "<sets>";
	
	$(xml).find("set").each( function(j){
		keywordLetterXml += "<keywords>";
		
		$($(this).find("keyword")).each( function(i){
				keywordLetterXml += "<keyword>";
				
				var tmpArr = $(this).find("tl_word_cordinates")
					.text()
					.replace(/[ ]|\n/g,"")
					.replace(/&#58;/g, ":")
					.split(",");
				
				for(var j=0; j< tmpArr.length; j++){
					tmpArr[j] = tmpArr[j].split(":");
					var tmpOrdinals = tmpArr[j][0];
					
					keywordLetterXml += "<letter " +  
											"col='" + letterToIndex(tmpOrdinals.substring(0,1)) + "' " + 
											"row='" + tmpOrdinals.substring(1) + "' " + 
											"letter='" + tmpArr[j][1] + "' ";
											
					if($(this).find("list_direction_no").length > 0){
						keywordLetterXml += "number='" 
												+ $(this).find("list_direction_no").text() + "' ";
					} 
					
					keywordLetterXml += "></letter>";
				}
				
				keywordLetterXml += "</keyword>";
				
		});
	
		keywordLetterXml += "</keywords>";
	});
	
	keywordLetterXml += "</sets>";
	keywordLetterXml = $.parseXML(keywordLetterXml);
	
	//Load random letter indexes
	$(keywordLetterXml).find("keyword").each(function(){
		var randLetterIndex = randomRange(0,$(this).find("letter").length - 1);
		$(this).attr("randLetterIndex", randLetterIndex);
	});
}

function findAllCompletedKeywords(){
	//Loop through all keywords
	$($(keywordLetterXml).find("keywords")[currentSet]).find("keyword").each(function(index){
		var jKeyword = $(jSection.find("keyword")[index]);
		
		var keywordFilled = true;
		
		//Find out if the keyword is filled
		$(this).find("letter").each(function(){
			var letterRowIndex = $(this).attr("row");
			var letterColIndex = $(this).attr("col");
			
			var jLetter = $($($("#grid")
					.find("tr")[letterRowIndex - 1])
					.find("td")[letterColIndex - 1])
					.find(".letter");
			if(jLetter.hasClass("invisible") || 
				jLetter.hasClass("redLetter") || 
				jLetter.text() == ""){
				keywordFilled = false;	
			}
		});
		
		if(keywordFilled){
			jKeyword.attr("completed", "true");
		}
	});
}

function loadCells(){
	$($(keywordLetterXml).find("keywords")[currentSet]).find("keyword").each(function(i){
		var randLetterIndex = $(this).attr("randLetterIndex");
		$(this).find("letter").each(function(j){
			var jTr = $($("#grid").find("tr")[
							parseInt($(this).attr("row")) - 1
						]);
			var jTd = $(jTr.find("td")[
							parseInt($(this).attr("col")) - 1 
						]);
			
			jTd.removeClass("invisible");
			
			if(j==0){
				jTd.find(".number").text($(this).attr("number"));
			}

			jTd.find(".letter")
				.removeClass("invisible");
				
			if( randLetterIndex != undefined && 
				j == parseInt(randLetterIndex)){
				jTd.find(".letter")
					.text($(this).attr("letter"));
			}
		});
		
		if($(jSection.find("keyword")[i]).attr("completed") == "true"){
			autoFillKeyword(this);
		}
	});
}

function randomRange(min, max, decimal, exclude) {
    // if no min and max is passed, return true or false
    if (arguments.length < 2) return(Math.random() >= 0.5);

    // calc decimal multiplier
    var factor = 1, result;
    if (typeof decimal === "number") {
        factor = Math.pow(10, decimal);
    }

    // loop until we get a value that isn't our exclude value
    do {
        // calc rand value in proper range
        result = Math.random() * (max - min) + min;

        // adjust to proper number of decimal digits
        result = Math.round(result * factor) / factor;
    } while (result === exclude);
    return result;
}

function letterToIndex(value){
  var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
  		i, 
  		j, 
  		result = 0;

  value = value.toString().toUpperCase();

  for (i = 0, j = value.length - 1; i < value.length; i += 1, j -= 1) {
    result += Math.pow(base.length, j) * (base.indexOf(value[i]) + 1);
  }

  return result;
};

function constructGrid(){
	var rows = parseInt($(jSection.find("crossword_size rows")).text());
	var cols = parseInt($(jSection.find("crossword_size columns")).text());
	
	var cellHtml = "";
	for(var i=0; i<rows; i++){
		cellHtml += "<tr>";
		
		for(var j=0; j<cols; j++){
			cellHtml += "<td class='invisible cell'>" 
							+ $("#cellSnip").html()
							+ "</td>";	
			
			/*cellHtml += "<td>" + i + "," + j;	
			cellHtml += "<td class='invisible cell'>" + 
							"<div class='containerDiv'>" + 
								"<span class='number'></span>" +
								"<span class='letter invisible'></span>" + 
								"<span class='droppedLetter'></span>" + 
							"</div>" + 	
						 "</td>";*/
		}
		
		cellHtml += "</tr>";
	}
	
	$("#grid").html(cellHtml);
	
	/*cellWidth = $("#grid").find("td").width();
	cellHeight = $("#grid").find("td").height();
	
	//Hardcode all cells so that no resizing occures after text is added
	$("#grid").find("td").css("height", cellHeight);
	$("#grid").find("td").css("width", cellWidth);*/
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
			$("#feedbackHeader").html("Incorrect");
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html("Correct");
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
			$("#feedbackBtn").html("OK");
			break;
	}
	
	$('#feedback').show();
}


var feedbackCorrectShown = false;
var setCompleted = false;
var activityCompletionShown = false;
function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#clickGuard").css("display","none");
	
	//checkCompleteSet();
    
    if(feedbackCorrectShown){
    	feedbackCorrectShown = false;
    	
    	setCompleted = true;
    	
    	jSection.find("keyword").each(function(){
    		if($(this).attr("completed") != "true"){
    			setCompleted = false;
    		}
    	});
    	
    	if(setCompleted){
    		showFeedback("set_completed");
    	}
    }else if(setCompleted){
    	jSection.attr("completed","true");
    	
    	if($(xml).find("set").length == 
    		$(xml).find("set[completed='true']").length &&
    		!activityCompletionShown){
    			activityCompletionShown = true;
    			
    			if(parent.activityCompleted){
					parent.activityCompleted(1,0);
				}else{
					showFeedback("activity_completed");
				}
    		}
    }
}

function nextClicked(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	
	nextClick();
}

function prevClicked(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	
	prevClick();
}
