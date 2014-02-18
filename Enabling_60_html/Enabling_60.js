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
	cssFilename = "styles/Enabling_60_dliLearn.css";
	xmlFilename = "sampleData/Enabling_60_LTR.xml";
	jsonFilename = "sampleData/Enabling_60_LTR.js";
	keyboardFilename = "sampleData/keyboard.js";
	
	loadActivity(parseXml);
});


var jSection;

function parseXml(t_xml){
	xml = t_xml;
	
	numSets = $(xml).find("set").length;
	
	jCardSnip = $("#snippets .card");
	
	loadSet(0);
}
 
function keyboardLoadCallback(){
	$("#keyboard > .letter").click(letterClicked);
	
	$(".div_del").click(deleteClicked);
}

function deleteClicked(){
	//Keyboard delete press
	if(jSelectedCard){
        var inputText = jSelectedCard.find(".card_input").text()
        
        if(inputText.length > 0){
            jSelectedCard.find(".input_letter:last").remove()
        }
	}
}


function letterClicked(){
	//Keyboard letter press
	if(jSelectedCard){
        var cardText = jSelectedCard.find(".card_text").text()
        var inputText = jSelectedCard.find(".card_input").text()
        
        if(inputText.length < cardText.length){	            
            jSelectedCard.find(".card_input").append(
                 '<div class="input_letter">' + 
                         $(this).text() + '</div>');
        
            //Color word
            var errorState = false;
            jSelectedCard.find(".card_input div").each(function(i,v){
               $(this).removeClass("input_letter_error");
               
               if(cardText[i] != $(this).text() || errorState){
                   errorState = true;
                   $(this).addClass("input_letter_error");
               }
            });
            
            if(!errorState && cardText == 
                    jSelectedCard.find(".card_input").text()){
                //Word completed
	            jSelectedCard. find(".card_text")
                    .removeClass("selected_card_text")
                jSelectedCard. find(".card_input")
                    .removeClass("selected_card_input")

                jSelectedCard. find(".card_playBtn")
                    .addClass("visible")
                	                
                //Check for phase 1 completed
                var completed = true;     
                $(".card").each(function(i,v){
                    if($(this).find(".card_text").text() !=
                        $(this).find(".card_input").text()){
                        completed = false;        
                    }
                });
                
                if(completed){
                    phase1CompletedTrigger = true;
                }
                
                
                playAudio(
                    jSelectedCard.find(".card_playBtn_wrapper a"))  
            }
        }
	}
}

var jCardSnip;
var jSelectedCard

function loadSet(value){
	currentSet = value;
	
	jSection = $($(xml).find("set")[currentSet]);

	$("#card_wrapper").empty();

	//Load cards
	jSection.find("item").each(function(i,v){
		var jCardSnipClone = jCardSnip.clone();
		
		jCardSnipClone.find(".card_img").attr("item_id",i);
		jCardSnipClone.find(".card_word").attr("item_id",i);
		
		//Set caption 
		jCardSnipClone.find(".card_text").text(
						$(this).find("caption").text());
		
		//Set image
		jCardSnipClone.find(".card_img img").attr("src",
						mediaPath + "png/" + 
						$(this).find("image").attr("name"));
		
		//Substitutions for audio play button
        var playBtnDiv = jCardSnipClone.find(".card_playBtn");
        var playBtnDiv_string = new XMLSerializer()
                .serializeToString(playBtnDiv.find(".card_playBtn_wrapper")[0])
                
        playBtnDiv_string = playBtnDiv_string.replace(/\[index\]/g, i);
		
		playBtnDiv.empty();
		playBtnDiv.append(playBtnDiv_string);
		
		//Load card
		$("#card_wrapper").append(jCardSnipClone);
	});

	//shuffle
	$("#card_wrapper .card_word").shuffle()

    //Set the state
    if(jSection.attr("phase") == "1" ||
        jSection.attr("phase") == undefined){
        setState("phase1")
        setCompleted = false
    }else if(jSection.attr("phase") == "2"){
        setState("phase2")
        setCompleted = false
    }else if(jSection.attr("phase") ==  "completed"){
        setState("completed")
        setCompleted = true
    }
    
	updateNavButtons();
}


function cardClicked(){
    jSelectedCard = $(this);
    
    //Unselect all cards
	$("#card_wrapper .card_word").each(function(i,v){
	    if($(this).find(".card_text").text() !=
	                   $(this).find(".card_input").text()){
	                    
	        $(this).removeClass("selected_card_word")    
	    }
	});
        
	$("#card_wrapper .card_text")
                    .removeClass("selected_card_text")
    $("#card_wrapper .card_input")
                    .removeClass("selected_card_input")
    
    $(this).addClass("selected_card_word");
	
    if(jSelectedCard.find(".card_text").text() !=
            jSelectedCard.find(".card_input").text()){
        //Card is not completed
    	$(this).find(".card_text").addClass("selected_card_text")
		$(this).find(".card_input").addClass("selected_card_input")
    }
}

function playAudio(node){
    $("#clickGuard").css("display","block");
    
    var itemId = $(node).closest(".card_word").attr("item_id")	
	var file_audio = $(jSection.find("audio")[itemId]).attr("name");
	
	audio_play_file(removeFileExt(file_audio), mediaPath );
	
	document.getElementById('audioPlayer').addEventListener('ended', phase1AudioEnded);
	document.getElementById('audioPlayer').play();	
}	

var phase1CompletedTrigger = false;
function phase1AudioEnded(){
    $("#clickGuard").css("display","none");
    
    if(phase1CompletedTrigger){   
        phase1CompletedTrigger = false;
        setState("phase2")
	    showFeedback("match_keyword");
    }
}

function setState(value){
	switch(value){
		case "phase1":
		    jSection.attr("phase", "1")
		    
    		$("#main").attr("phase", "1");
		    
		    //Add card click handler
    		$("#card_wrapper .card_word").click(cardClicked);
			break;
		case "phase2":
		    jSection.attr("phase", "2")
		    
    		phase2CardSelected = undefined;
            phase2ImgSelected = undefined;
    		
    		$("#main").attr("phase", "2");
    		
    		//Set times tried
            $("#card_wrapper .card_word").attr("timesTried", 0)
    		
    		//Bind events
            $("#card_wrapper .card_img img").click(imgClicked)
            $("#card_wrapper .card_word").click(phase2CardClicked);
			
			//Show play button
			$("#card_wrapper .card_playBtn").addClass("visible")
			
			break;
		case "completed":
		    $("#main").attr("phase", "completed");
		    
		    jSection.attr("completed", "true")
		    jSection.attr("phase", "completed")
		    
			break;
	}
}



var lockNav = false;
var finishedCardContainerShown = false;
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
	    case "match_keyword":
	        $("#feedbackText").html("Match keyword to the correct image");
	        break;
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
		case "incorrect_solved":
			if(value == "incorrect_solved"){
    			$("#feedbackHeader").html(
    					'<img src="../common/img/feedback_incorrect.png">');
    			$("#feedbackButtonImgContainer").html(
    					'<img src="../common/img/feedback_incorrect_arrow.png">');
    		}
			
			$("#feedbackText").html(text);

            var jCorrectImg = $("#card_wrapper .card_img[item_id=" + 
                                    $(phase2CardSelected).attr("item_id") + "]")
			
			//Show finished card container
			finishedCardContainerShown = true;
			$("#finished_card_container").append(
			            $(phase2CardSelected).clone())
			$("#finished_card_container").append(
			            jCorrectImg.clone())
			
			//Mark card completed
			$(phase2CardSelected).parent().attr("completed","true")
			
			
			//Find the image that is correct and swap it
            $(phase2CardSelected).attr("item_id")
            $(phase2ImgSelected).parent().attr("item_id")
            
            var clonedCorrect = jCorrectImg.clone()
            
            var clonedIncorrect = $(phase2CardSelected).parent()
                                            .find(".card_img").clone()
                                            
                                            
            $(phase2CardSelected).parent().find(".card_img").replaceWith(clonedCorrect)
            jCorrectImg.replaceWith(clonedIncorrect)
            
            
			//Remap events
			clonedIncorrect.find("img").click(imgClicked)
			$(phase2CardSelected).find(".card_word").unbind()
        				
			//Move card
			var clonedCard = $(phase2CardSelected).parent().clone()
            $(phase2CardSelected).parent().remove()
            $("#card_wrapper").append(clonedCard)
			
			//Deselect all cards and images			
            $("#card_wrapper .card_img img").attr("active", null);
            $("#card_wrapper .card_word").attr("active", null);
			
			//Unset
			phase2CardSelected = undefined;
			phase2ImgSelected = undefined;
			
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
    
    if(finishedCardContainerShown){
        finishedCardContainerShown = false
        $("#finished_card_container").empty()
        
        //Check for set completed
        if($("#card_wrapper .card[completed!='true']")
                                          .length == 0){
            //Completed
            setCompleted = true;
            setState("completed");
    		showFeedback("set_completed");
        }
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



function imgClicked(){    
    phase2ImgSelected = this;
    $("#card_wrapper .card_img img").attr("active", null);
    $(this).attr("active", "true")
    phase2TestMatch()
}

function phase2CardClicked(){
    phase2CardSelected = this;
    $("#card_wrapper .card_word").attr("active", null);
    $(this).attr("active", "true")
    phase2TestMatch()
}

var phase2CardSelected = undefined;
var phase2ImgSelected = undefined;

function phase2TestMatch(){
    if(phase2CardSelected != undefined && 
            phase2ImgSelected != undefined){
        if($(phase2CardSelected).attr("item_id") ==
                $(phase2ImgSelected).parent().attr("item_id")){
            //We have a match
            showFeedback("correct", 
                $(jSection.find("feedback_text")[
                    $(phase2CardSelected).attr("item_id")])
                        .text()
                 )
                    
        }else{
            //Not a match
            //incrimant times tried
            $(phase2CardSelected).attr("timesTried",
                    parseInt($(phase2CardSelected)
                        .attr("timesTried")) + 1)
                        
            if($(phase2CardSelected).attr("timesTried") == 1){
                showFeedback("incorrect", 
                    $(jSection.find("hint1")[
                        $(phase2CardSelected).attr("item_id")])
                            .text()
                     )             
            }else if($(phase2CardSelected).attr("timesTried") == 2){
                showFeedback("incorrect", 
                    $(jSection.find("hint2")[
                        $(phase2CardSelected).attr("item_id")])
                            .text()
                     )              
            }else{
                showFeedback("incorrect_solved", 
                    $(jSection.find("feedback_text")[
                        $(phase2CardSelected).attr("item_id")])
                            .text()
                     )
            }
        }
    }
}
