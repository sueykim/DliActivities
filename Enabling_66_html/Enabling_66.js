$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	$("#clickGuard").css("display", "none");
    
	/*if(document.getElementById('audioPlayer').play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}*/
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_66_default.css";
	xmlFilename = "sampleData/Enabling_66_LTR.xml";
	jsonFilename = "sampleData/Enabling_66_LTR.js";
	
	$("#words_container").tabs();
	$("#completed_container").tabs();
	
	loadActivity(parseXml);
});


function dropFunction(event, ui ){
	//Handle for darn bug where elements outside of the 
	// viewport area can trigger drop events
	
	var topElement = document.elementFromPoint(event.clientX,
											event.clientY);
	
	if($(topElement).hasClass("ui-draggable-dragging")){
		$(topElement).css("display", "none");		
		
		//Now get the top element
		topElement = document.elementFromPoint(event.clientX,
											event.clientY);
	}
	
	if(this != topElement){
		return;
	}
	
	
	if(ui.draggable.hasClass("tl_word")){
		//Drag panel drop
		
		if($(this).text().length > 1){
			//overwriting from drag panel
				//Show original drag
				$(tl_words.children[parseInt($(this).attr("dragIndex"))]).
									css("display","inline-block");
				
				//Hide new drag
				ui.draggable.css("display","none");
				
				//Add new word to drop
				$(this).text(ui.draggable.text()); 
				
				//Mark new index
				$(this).attr("dragIndex", ui.draggable.index());
		}else{
			//dropping from drag panel
				//Hide drag
				ui.draggable.css("display","none");
				
				//Add word to phrase drop
				$(this).text(ui.draggable.text());
				
				//Mark index
				$(this).attr("dragIndex", ui.draggable.index());
				
				//unset min-width
				$(this).css("min-width","0px");
		}
	}else{
		//Phrase panel drop
		
		if($(this).text().length > 1 ){
			//overwriting from phrase panel
				//swap words
				var word1 = $(this).text();
				$(this).text(ui.draggable.text());
				ui.draggable.text(word1);
				
				//swap dragIndexes
				var dragIndex = $(this).attr("dragIndex");
				$(this).attr("dragIndex", $(ui.draggable).attr("dragIndex"));
				$(ui.draggable).attr("dragIndex", dragIndex);
		}else{
			//dropping from phrase panel
				//Set new dragIndex
				var dragIndex = $(ui.draggable).attr("dragIndex");
				$(ui.draggable).attr("dragIndex", "");
				$(this).attr("dragIndex", dragIndex);
				
				//Remove dragged word from phrase
				var word = $(ui.draggable).text();
				$(ui.draggable).html("&nbsp;");
		
				//Add word to dropped
				$(this).text(word);
				
				//set min-width
				$(ui.draggable).css("min-width","75px");
				$(this).css("min-width","0px");
				
				//Initialize drag for drop
				////$(this).draggable({ helper: 'clone', 
				////	appendTo: 'body', stack: "div"});

				//Disable drag in for dragging
				////$(ui.draggable).draggable('destroy');
		}
	}
	
	//Are all elements filled?
	checkFilled();
}

function checkFilled(){
	var filled = true;

	$(".phrase1_word,.phrase2_word").each(function(i,v){
	    if($(this).text().length < 2){
	        filled = false;
	    }
	})
	
	if(filled){
		$("#submitBtn").show();
	}else{
		$("#submitBtn").hide();
	}
}

var jSection;

function parseXml(t_xml){
	xml = t_xml;
	
	numSets = $(xml).find("set").length;
	
	if($(xml).find("content").attr("target_language") != undefined){
		$("#tlTab").text(
			$(xml).find("content").attr("target_language"));
	}
	
	loadSet(0);
}

function loadSet(value){
	currentSet = value;
	
	jSection = $($(xml).find("set")[currentSet]);

	timesIncorrect = 0;

	$('#words_container').tabs('select', 0);

	//Check to see if we need to disable the english tab
	var use_en_tab = jSection.find("use_en_tab");
	if(use_en_tab != undefined && 
		$(use_en_tab).text().toLowerCase() == "false"){
			$("#enTab").hide();
	}else{
		$("#enTab").show();
	}

	//Load images
	$("#img0").attr("src", mediaPath + "png/" + 
				jSection.find("image_A").text());

	$("#img1").attr("src", mediaPath + "png/" + 
				jSection.find("image_B").text());


	if(jSection.attr("completed") != undefined &&
		jSection.attr("completed") == "true"){
			setCompleted = true;
			setState("completed");
			//$("#completeBtn").show();
	}else{
		setCompleted = false;
		setState("default");
		//$("#completeBtn").hide();
	}

	//Load images
	for(var i=0; i < jSection.find("item").length; i++){
		if(setCompleted){
			$('#img' + i).attr("src",mediaPath + "png/" + $(jSection.find("image_color")[i]).text());
		}else{
			$('#img' + i).attr("src",mediaPath + "png/grey/" + $(jSection.find("image_color")[i]).text());
		}
	}
	
	//Load drop targets
	loadPhrases();
	
	//Load drag words
	//Phrase 1
	$("#tl_words").empty();
	var matches = jSection.find("tl_speakerA").text().match(/[\w]+/g);
	$.each(matches,function(i, v){
				$('#tl_words').append(
						'<div class="tl_word">' + 
						v + 
						'</div>'
					);
				});
				
	//Phrase 2			
	var matches = jSection.find("tl_speakerB").text().match(/[\w]+/g);
	$.each(matches,function(i, v){
				$('#tl_words').append(
						'<div class="tl_word">' + 
						v + 
						'</div>'
					);
				});	
	
	//Shuffle words
	$('.tl_word').shuffle();

	$('.tl_word').draggable({containment: "#main", zIndex: 1000, helper: 'clone', 
		appendTo: 'body', stack: "div"});
	
	
	//Load English words
	$("#en_words").empty();
	var enString = jSection.find("en_speakerA").text();
	enString += " " + jSection.find("en_speakerB").text();
	
	var matches = enString.match(/[\w]+/g);
	
	$.each(matches,function(i, v){
				$('#en_words').append(
						'<div class="en_word">' + 
						v + 
						'</div>'
					);
				});
	$('#en_words .en_word').shuffle();
	
	//Initialize drag/drop for phrases
	$(".phrase1_word").draggable({ containment: "#main", zIndex: 1000, helper: 'clone',
		start:function(event, ui) {
			 	if($(this).text().length <2){return false}; 
			 }, 
		appendTo: 'body', stack: "div"});
	$(".phrase1_word").droppable({
			drop: dropFunction}); 
			
	$(".phrase2_word").draggable({ containment: "#main", zIndex: 1000, helper: 'clone',
		start:function(event, ui) {
			 	if($(this).text().length <2){return false}; 
			 }, 
		appendTo: 'body', stack: "div"});			
	$(".phrase2_word").droppable({
			drop: dropFunction}); 
	
	updateNavButtons();
	
	checkFilled();
	
	//Load completed state
	$("#ctlAInput").text(jSection.find("tl_speakerA").text());
	$("#ctlBInput").text(jSection.find("tl_speakerB").text());
	$("#ctlAInput_en").text(jSection.find("en_speakerA").text());
	$("#ctlBInput_en").text(jSection.find("en_speakerB").text());
}


function playAudio(){	
	var file_audio = jSection.find("desc_audio").text();
	
	audio_play_file(removeFileExt(file_audio), mediaPath );
	
	document.getElementById('audioPlayer').play();	
}	

function setState(value){
	switch(value){
		case "default":
			$("#completed_container").css("display", "none");
			$("#words_container").css("display", "block");
			$("#phrases_container").css("display", "block");
			$("#submitBtn").css("display", "block");
			break;
		case "completed":
			$("#completed_container").css("display", "block");
			$("#words_container").css("display", "none");
			$("#phrases_container").css("display", "none");
			$("#submitBtn").css("display", "none");
			break;
	}
}

var lockNav = false;

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	$("#feedbackButtonImgContainer").html("");
			
	lockNav = true;

	switch(value){
		case "incorrect":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackButtonImgContainer").html(
					'<img src="../common/img/feedback_incorrect_arrow.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_correct.png">');
			$("#feedbackButtonImgContainer").html(
					'<img src="../common/img/feedback_correct_arrow.png">');
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
			$("#feedbackBtn").css("height", "55px");
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
	$("#feedbackButtonImgContainer").html("");
	
	lockNav = false;
	
	//checkCompleteSet();
    
    if(feedbackCorrectShown){
    	feedbackCorrectShown = false;
       	
    	if(jSection.attr("completed") != undefined &&
    			jSection.attr("completed") == "true"){
    		setCompleted = true;
    		showFeedback("set_completed");
    	}
    	
    	setState("completed");
    }else if(setCompleted){    	
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
    }else{
    	setState("default");
    }
}

function loadPhrases(){
    //Phrase 1
    $("#phrase_1").empty();
    
    var words = jSection.find("tl_speakerA").text().match(/[\w]*/g);
    
    var nonwords = jSection.find("tl_speakerA").text().match(/[^\w]/g);

    var nonwordTally = 0;
    $.each(words,function(i,v){
        if(v.length == 0){
            if(nonwords[nonwordTally] != undefined){
                $('#phrase_1').append(
    				'<div class="phrase1_nonword">' + 
    				nonwords[nonwordTally] + 
    				'</div>'
    			);
    
    			nonwordTally++;
            }
        }else{
            $('#phrase_1').append(
				'<div class="phrase1_word" correctText="' +  
				v +'">&nbsp</div>'
			);
        }
    }) 
    
    
    //Phrase 2
    $("#phrase_2").empty();
    
    var words = jSection.find("tl_speakerB").text().match(/[\w]*/g);
    
    var nonwords = jSection.find("tl_speakerB").text().match(/[^\w]/g);

    var nonwordTally = 0;
    $.each(words,function(i,v){
        if(v.length == 0){
            if(nonwords[nonwordTally] != undefined){
                $('#phrase_2').append(
    				'<div class="phrase2_nonword">' + 
    				nonwords[nonwordTally] + 
    				'</div>'
    			);
    
    			nonwordTally++;
            }
        }else{
            $('#phrase_2').append(
				'<div class="phrase2_word" correctText="' +  
				v +'">&nbsp</div>'
			);
        }
    })  
}

function completeClicked(){
	
}

var timesIncorrect = 0;

function submitClicked(){
	if(!lockNav && jSection.attr("completed") == undefined){
		var Correct1 = true;
		var Correct2 = true;
		
		$(".phrase1_word").each(function(i,v){
		    if($(this).text() != $(this).attr("correcttext")){
		        Correct1 = false;
		    }
		});
		
		$(".phrase2_word").each(function(i,v){
		    if($(this).text() != $(this).attr("correcttext")){
		        Correct2 = false;
		    }
		});
		
		var incorrect = false;
		if(!Correct1 && !Correct2){
			timesIncorrect++;
			incorrect = true;
			showFeedback("incorrect", jSection.find("hint_AB").text());
		}else if(!Correct1){
			timesIncorrect++;
			incorrect = true;
			showFeedback("incorrect", jSection.find("hint_A").text());
		}else if(!Correct2){
			timesIncorrect++;
			incorrect = true;
			showFeedback("incorrect", jSection.find("hint_B").text());
		}else{
			//Must be correct
			feedbackCorrectShown = true;
			showFeedback("correct", "");
			jSection.attr("completed","true");
		}
		
		if(timesIncorrect == 2 && incorrect){
			feedbackCorrectShown = true;
			jSection.attr("completed","true");
		}
	}
}

function _prevClick(){
	if(!lockNav){
		prevClick();
	}
}

function _nextClick(){
	if(!lockNav){
		nextClick();
	}	
}
