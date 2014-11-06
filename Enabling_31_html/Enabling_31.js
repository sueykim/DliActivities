// For homework
var homeworkStatus;

$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();


	loadjscssfile("../common/css/activityDefault.css", "css");
	
	var statusParameters = getPassedParameters();
	////if (!statusParameters) {
		//Default values (for testing)
		mediaPath = "sampleData/";
		xmlFilename = "sampleData/Enabling_31.xml";
		jsonFilename = "sampleData/Enabling_31.js";
	////}
/*	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');

		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}

		xmlFilename  = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		jsonFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  ".js" ;
		
		$('.activity_hd').html('');
		$('.activity_description').html('');
	}   */

	cssFilename = "styles/Enabling_31.css";
	loadActivity(parseXml);
});

var numSets = 0;
var NUM_DRAG_BUBBLES = 3;
var questionWord

//// adding sessions
var sessionLen =0;
var sessions =[];
var culNote=[]
var itemDir;
//////////////////////

var sets =[];
var items =[];
var letterArray=[];
var audArr=[];

//// to create HW answerAttemptsNum
var answerAttemptsNum=[];
var maxLen

// To display ruby tag
var isJapanese = false;

function parseXml(t_xml){

       itemDir = $(xml).find("content").attr("rtl");  //// determine RTL or LTR
       if(itemDir != 'true') {
            $(".item_word").css("float", "right");
            $(".item_audio").css("float", "left");
            $(".item_audio").css("margin-left", "15px");
         }


        ////* adding sessions /////////////////////////////////////
        sessionLen =  $(xml).find("set").length;
       ////////////////////////////////////////////////////////////

	numSets = Math.ceil($(xml).find("item").length / NUM_DRAG_BUBBLES);
        maxLen = numSets * NUM_DRAG_BUBBLES;
        for (var i=0; i<maxLen; i++)
          answerAttemptsNum[i] = 0;


        sets = new Array (numSets);
        items = new Array (numSets);
	letterArray= new Array(numSets);
        audArr = new Array(numSets);

	////$(xml).find("item").shuffle();
	

        ////* shuffle items within sessions ///////////////
	for (var i=0; i<sessionLen; i++)
	    $($(xml).find("set")[i]).find("item").shuffle();
	//////////////////////////////////////////////////

        //////////// assigning culture note to each set (same culture note if sets are in the same session) /////
        culNote = new Array (numSets);
        var cnt = 0;
        for (var i=0; i<sessionLen; i++) {
          sessions[i] =  $($(xml).find("set")[i]).find("item").length / NUM_DRAG_BUBBLES
          for (var j=0; j<sessions[i]; j++) {
             culNote[cnt] =  $($(xml).find("body")[i]).text();
             cnt++
             ////alert( $($(xml).find("body")[i]).text())
             }
          }
         ////////////////////////////////////////////////////////////////////////////////////////////////////////


	for(var i=0; i< numSets; i++)   {
                sets[i] = 0;
                items[i] = new Array(NUM_DRAG_BUBBLES);
                letterArray[i] = new Array(NUM_DRAG_BUBBLES);
                audArr[i] = new Array(NUM_DRAG_BUBBLES);
                for(var j=0; j < NUM_DRAG_BUBBLES; j++){
                   items[i][j] = 0;
                   audArr[i][j] = $($(xml).find("audio")[(i * NUM_DRAG_BUBBLES) + j]).text();
                   }
                }

	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	loadSet(0);
}

function loadSet(value){
	currentSet = value;
	updateSetText();


        if (sets[currentSet] == 1){
	  $("#feedbackHeader").html("Set Completed");
          $("#clickGuard").css("display","block");

          }
	else {
	  $("#feedbackHeader").html("");
          $("#clickGuard").css("display","none");
	  }


        ////$("#cultureNote").html('<div style="text-align:center" > Culture Note </div><br />'  + $($(xml).find("body")[0]).text());
        //// implementing culture note for each set (same culture note if sets are in the same session) ////
        $("#cultureNote").html('<div style="text-align:center" > Culture Note </div><br />'  + culNote[currentSet]);
        $("#cultureNote").mCustomScrollbar();  
        playAudioPhrase()


	for(var i=0; i < NUM_DRAG_BUBBLES; i++){

 	//Construct and load the phrase
	var words = $($(xml).find("itemTL")[i + (currentSet * NUM_DRAG_BUBBLES)]).text().split("||");
	var hints = $($(xml).find("missingLetter")[i + (currentSet * NUM_DRAG_BUBBLES)]).text();
	var wordOrder = $($(xml).find("missingLetter")[i + (currentSet * NUM_DRAG_BUBBLES)]).text();
	var output = "";
	//Loop words
	for(var x = 0; x< words.length; x++){
		var word = words[x];
		if(x == 0){
			//At the substitution word
			var letters = word.split("");
			output = output + " ";
			//Loop through all letters
			for(var j = 0; j < letters.length; j++){
				var letter = letters[j];
				var substitutionFound = false;

				for(var k = 0; k <1; k++){
					////if(parseInt($(hints[k]).attr("letter_order")) == j + 1){
					if(parseInt(hints) == j + 1){
						////delete hints[i];
						substitutionFound = true;
						break;
					}
				}

				//If letter is a substituion
				if(substitutionFound){

                                           var dropId = 'drop' + i + '4'
					   output = output + "<span class='hideText roundCorners drop' id=" + dropId + ">" + letter + "</span>";   //// the class, drop does not have any role here in the click button 
					   ////output = output + "<span class='hideText drop'>" + letter + "</span>";

				}else{
					//else, just append the letter to the word string
					output = output + letter ;
				}
			}
		}else{
			//Not substitution word so just append to output
			if(output.length != 0){
				output = output + " " ;
			}
			
			output = output + word ;
		}
           }
	
        if (!isJapanese) {
                 $("#word" + i).html(output);
                 if ( $($(xml).find("itemTL")[i + (currentSet * NUM_DRAG_BUBBLES)]).attr("dir") == 'rtl')
                     $("#word" + i).css({'margin-left': '10px', 'font-size': '30px', 'text-align':'right'})
                 else
                     $("#word" + i).css({'margin-left': '17px', 'font-size': '22px'})
              }
        else {
                 $("#word" + i).html(displayRubyTag(output));
                 if ( $($(xml).find("itemTL")[i + (currentSet * NUM_DRAG_BUBBLES)]).attr("dir") == 'rtl')
                     $("#word" + i).css({'margin-left': '10px', 'font-size': '30px', 'text-align':'right'})
                 else
                     $("#word" + i).css({'margin-left': '17px', 'font-size': '22px'})


             }

         var letId = "letter" + i
         var dropId = "drop" + i + "4"
         if(items[currentSet][i]== 0) {
               $("#" + letId).show();
               ////$("#" + dropId).toggleClass('hideText');
                    }
         else {
              $("#" + letId).hide();
              $("#" + dropId).removeClass("hideText");
              $("#" + dropId).addClass("unhideText");

                    }

         //// images
         var fileName = $($(xml).find("image")[i + (currentSet * NUM_DRAG_BUBBLES)]).text();
         $("#stageImg" + i).attr("src", mediaPath + "png/" + fileName);



         //// letters
         for (var j=0; j<4; j++) {
                    letterArray[i][j] = $($($(xml).find("item")[i + (currentSet * NUM_DRAG_BUBBLES)]).find("distraction")[j]).text();
                 }
         var missNum =   $($(xml).find("missingLetter")[i + (currentSet * NUM_DRAG_BUBBLES)]).text()
         var missLTR =   $($(xml).find("itemTL")[i + (currentSet * NUM_DRAG_BUBBLES)]).text()[missNum-1]
         letterArray[i][4] = missLTR
         for(var k=0; k<5; k++){
                  $("#drag" + i + k).html(letterArray[i][k]);
                  }
	}
	
	
	
        $(".mix0").shuffle();
        $(".mix1").shuffle();
        $(".mix2").shuffle();	
  };

$(function() {
  
     $(".drag").click(function() {
             var itemId = parseInt($(this).attr('id').substr(4, 1));
             var answerId = parseInt($(this).attr('id').substr(5, 1));
             
             var findItems = parseInt((currentSet * NUM_DRAG_BUBBLES) + itemId) ;
             answerAttemptsNum[findItems]++

             if(answerId == '4') {
                 var letterId = "letter" + itemId;
                 var wordId = "drop" + itemId + answerId
                 $("#" + letterId).hide();

                 $("#" + wordId).removeClass("hideText");
                 $("#" + wordId).addClass("unhideText");


                 items[currentSet][itemId] = 1;
                 checkFinished();
                 if(finished)
                     sets[currentSet] = 1 ;
                 checkAcitivty();
                 showFeedback("correct");
                 }
             else {
                showFeedback("incorrect");
                }


             if (homeworkStatus) {
		checkAnswers(findItems);
       	        }
           });
   });


/*
$(function() {
        $(".mix0").shuffle();
        $(".mix1").shuffle();
        $(".mix2").shuffle();
   });
*/

var finished
function checkFinished(){
    finished = true;
    for (var i=0; i< numSets; i++) {
      if(items[currentSet][i] == 0) {
        finished = false;
        return
        }
      }

}

var checkAct
function checkAcitivty(){
     checkAct = true;
    for (var i=0; i< numSets; i++) {
      if(sets[i] == 0) {
        checkAct = false;
        return
        }
      }

}

function playAudioPhrase(){
        $("#playBtn_s0").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][0]),mediaPath);
        })
        $("#playBtn_s1").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][1]),mediaPath);
        })
        $("#playBtn_s2").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][2]),mediaPath);
        })
        $("#playBtn_s3").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][3]),mediaPath);
        })
  }

var feedbackState;
function showFeedback(value, textInput){
	feedbackState = value;

	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	////$("#feedbackBtn").text("OK");
	////$("#feedbackBtn").show();
	////$("#clickGuard").css("display","block");
	////$("#navGuard").css("display","block");

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
			//$("#feedbackHeader").html("Incorrect");
			$("#feedbackHeader").html('<img  id="incorrect_img"  alt="incorrect" src="../common/img/feedback_incorrect.png" style="width:139px;height:38px;" border="0">');
			$("#incorrect_img").fadeOut(1500);
			////$("#feedbackText").html(text);
			break;
		case "correct":
			//$("#feedbackHeader").html("Correct");
			$("#feedbackHeader").html('<img id="correct_img"  alt="correct" src="../common/img/feedback_correct.png" style="width:122px;height:38px;" border="0">');
			$("#correct_img").fadeOut(1500);
			setTimeout(function(){closeFeedback()}, 2000);
                        ////closeFeedback()
			////$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
                        ////$("#feedbackBtn").hide();
                        $("#clickGuard").css("display","block");
                        ////$("#navGuard").css("display","none");
			/*if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			} */
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			////$("#feedbackBtn").html("Next Activity");
			break;
	}
	
	$('#feedback').show();
	$("#feedbackText").mCustomScrollbar();

}

var activityCompletedShown = false;

function closeFeedback(){
        ////$("#feedbackHeader").html("");
        ////$("#feedbackText").html("");
	////$("#feedbackBtn").hide();
	////$("#correctAnswer").text("");

        ////$("#clickGuard").css("display","none");
        ////$("#navGuard").css("display","none");

	switch(feedbackState){
		case "correct":
			feedbackState = "";
                        if(sets[currentSet] == 1){

				showFeedback("set_completed");
			};

                       if(checkAct)
                           completeActivity()
			
			break;


  	/*
		case "set_completed":
			if(!activityCompletedShown){
				loadNextSet();
			}

			break;   */
	}

}

var setCompletedShown = false;
var activityCompletedShown = false;


function completeActivity(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
        ////$("#feedbackBtn").hide();
        ////$("#clickGuard").css("display","none");
        ////$("#navGuard").css("display","none");
	$("#activityGuard").css("display","block");

     if(parent.activityCompleted)
          parent.activityCompleted(1,0);
    else
        $("#feedbackHeader").html("Activity Completed");


  
}



function getPassedParameters()
{
	mediaPath = getURL_Parameter("mediaPath");
	xmlPath   = getURL_Parameter("xmlPath");
	return mediaPath != 'undefined';
}
function getURL_Parameter(param) {
    var urlQuery = location.href.split("?")
    if (typeof urlQuery == 'undefined')
        return 'undefined';

    if (urlQuery.length < 2)
        return 'undefined';

    var urlItems = urlQuery[1].split("&")
    var paramCount = urlItems.length;
    for (i = 0; i < paramCount; i++) {
        paramItem = urlItems[i].split("=");
        paramName = paramItem[0];
        paramValue = paramItem[1];

        if (param == paramName) {
            return paramValue;
        }
    }
    return 'undefined';
}

// For homework
function checkAnswers(findItems){
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";

	////answerAttemptsNum++;  

	questionID = findItems;////parseInt(currentSet.toString());
	answer = "--";
	context = $($(xml).find("itemTL")[findItems]).text()////"--";
	answerAttempts = answerAttemptsNum[findItems].toString();

	// To see attempts - temp
	//$("#feedbackText").html("Homework//answerAttempts: " + answerAttemptsNum.toString());  
               ////alert('id=' + questionID)
               ///alert('attempt=' + answerAttempts)
               ////alert('context=' + context)
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	//$('#feedbackText').show();
}
