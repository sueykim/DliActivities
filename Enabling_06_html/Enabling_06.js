// For homework
var homeworkStatus;

$(document).ready(function() {
	audioInit();
	testVideoSupport();
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();


	loadjscssfile("../common/css/activityDefault.css", "css");
	
	var statusParameters = getPassedParameters();
	////if (!statusParameters) {
		//Default values (for testing)
		mediaPath = "sampleData/";
		xmlFilename = "sampleData/ENB_06.xml";
		jsonFilename = "sampleData/ENB_06.js";
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
	}
*/
	cssFilename = "styles/Enabling_06.css";
	loadActivity(parseXml);
});

var numSets = 0;

var sets =[];
var items =[];
var itemL;


var TLArr=[];
var audArr=[];
var hintArr=[];
var audioDuration=[];
var playSoundButton=[];
var dragFreq=[]
//// to create HW answerAttemptsNum
var answerAttemptsNum=[];

// To display ruby tag
var isJapanese = false;

function parseXml(t_xml){
	 numSets = Math.ceil($(xml).find("section").length);
	 itemL   = Math.ceil($(xml).find("item").length)/numSets



         sets    = new Array (numSets);
         items   = new Array (numSets);
         audioDuration = new Array(numSets);
         playSoundButton = new Array(numSets);
         dragFreq = new Array(numSets);
         answerAttemptsNum = new Array(numSets);

         TLArr   = new Array(numSets);
         audArr  = new Array(numSets);
         hintArr = new Array(numSets);



         for(var i=0; i< numSets; i++)   {
             sets[i] = 0;
             items[i] = new Array(itemL);
             audioDuration[i] = new Array(itemL);
             playSoundButton[i] = new Array(itemL);
             dragFreq[i] = new Array(itemL);
             answerAttemptsNum[i] = new Array(itemL);

             TLArr[i] = new Array(itemL);
             audArr[i] = new Array(itemL);
             hintArr[i] = new Array(itemL);
                    for(var j=0; j < itemL; j++){
                         items[i][j]  = 0;
                         playSoundButton[i][j] = 0;
                         dragFreq[i][j] = 0;
                         answerAttemptsNum[i][j] = 0;

                         TLArr[i][j]   = $($($(xml).find("section")[i]).find("item")[j]).find("lang_tl").text();
                         audArr[i][j]  = $($($(xml).find("section")[i]).find("item")[j]).find("file_audio").text();
                         hintArr[i][j] = $($($(xml).find("section")[i]).find("item")[j]).find("hint").text();

                    }

           };

	 // true for homework and undefined for regular
	 homeworkStatus = $(xml).find("content").attr("hw");
	 // To display ruby tag
	 isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	 loadSet(0);
};

function loadSet(value){
        $("#clickGuard").css("display","none");
	$("#feedbackHeader").html("");
	
	$("#videoContainer").hide();
	$("#pic").css("display", "inline");

	currentSet = value;
	updateSetText();

        if(('.drag'))
           $('.drag').remove();

        for (var i=0; i<itemL; i++)
           $('#audio' + i).append('<img id="playBtn_s' + i + '" class="drag"  src="../common/Library/images/playBtn_s1.png" border="0" \>')

        var textA = $($(xml).find("main")[currentSet]).find("lang_tl_a").text();
        if (!isJapanese)
             $("#textA").html(textA);
        else
             $("#textA").html(displayRubyTag(textA));
        if ($($(xml).find("main")[currentSet]).find("lang_tl_a").attr("dir") == 'rtl')
               $("#textA").css({'font-size': '18px', 'font-weight':'bold', 'text-align':'right'});
        else
               $("#textA").css({'font-size': '12px', 'font-weight':'bold'});
      
      
        var textB = $($(xml).find("main")[currentSet]).find("lang_tl_b").text();
        if (!isJapanese)
            $("#textB").html(textB);
        else
            $("#textB").html(displayRubyTag(textB));
        if ($($(xml).find("main")[currentSet]).find("lang_tl_b").attr("dir") == 'rtl')
               $("#textB").css({'font-size': '18px', 'font-weight':'bold', 'text-align':'right'});
        else
               $("#textB").css({'font-size': '12px', 'font-weight':'bold'});
               
               
	$("#textA").mCustomScrollbar();
	$("#textB").mCustomScrollbar();
      
        var imgFile = $($(xml).find("main")[currentSet]).find("file_img").text();
        $("#pic").attr("src", mediaPath + "png/" + imgFile);
             

        $(function() {
               $('.drag').draggable();
               $('.drag').draggable({ revert: true});

               $(".drop").droppable({
		  drop: dropFunction});
              });

        mix();   //// make "drag" possible on the next/prev page of navigation
        playAudioPhrase();
        

        function dropFunction(event, ui ){
                var draggableId = ui.draggable.attr('id');
                var droppableId = $(this).attr('id');
                var draggableN = draggableId.substr(9);
                var droppableN = droppableId.substr(4);


                

                if(playSoundButton[currentSet][draggableN]==1) { //// A sound botton needs to be clicked in order for the drag function to be working
                        dragFreq[currentSet][draggableN]++
                        if( dragFreq[currentSet][draggableN] < 3 ) {  //// allows only two tries for the match
                                if(draggableN == droppableN){
                                    showFeedback("correct")
                                    ui.draggable.draggable( 'disable' );
                                    $("#" + draggableId).draggable({ revert: false});
                                    $(this).append(ui.draggable.css({'left':'0px', 'top':'-26px'}))
                            
                                    var lettNum = droppableId.substr(4, 1);          
                                    items[currentSet][lettNum] = 1;
                                    checkFinished();
                                    if(finished)  {
                                           sets[currentSet] = 1 ;
                                           ////******* audio play only (not video) *****////
                                           ////var lastAudLen = draggableN
                                           ////playAudioAll(lastAudLen)  
                                           ////******* End of audio play only *********////

                                           ////******* video play *********************////
                                           $("#audioPlayer").trigger("pause");                                        
                                           $("#pic").hide();
                                           $("#videoContainer").show();
                                           playVideo();
                                           ////setTimeout (function(){playVideo()},  parseInt(300))
                                           ////****** End of video play **************////
                                          }
                                    checkAcitivty()
                                    }
                                 else{
                                     showFeedback("incorrect", hintArr[currentSet][draggableN])
                                   }
                               }

                        else {
                          ////alert ('3rd times')
                          var begin =   $("#" + draggableId)
                          var end = $("#drop" + draggableN)

                          moveAnimate(begin, end);
                          ui.draggable.draggable( 'disable' );
                          items[currentSet][draggableN] = 1;
                          checkFinished();
                          if(finished)  {
                                 sets[currentSet] = 1 ;
                                 ////******* audio play only (not video) *****////
                                 ////var lastAudLen = draggableN
                                 ////playAudioAll(lastAudLen)
                                 ////******* End of audio play only *********////

                                 ////******* video play *********************////
                                 $("#audioPlayer").trigger("pause");
                                 ////$("#pic").hide();
                                 ////$("#videoContainer").show();
                                 ////playVideo();
                                 setTimeout (function(){$("#pic").hide()},  parseInt(1000))
                                 setTimeout (function(){$("#videoContainer").show()},  parseInt(1000))
                                 setTimeout (function(){playVideo()},  parseInt(1000))
                                 ////****** End of video play **************////
                                }
                          checkAcitivty()
                        }

          	    // For homework
                  if (homeworkStatus) {
                      var cSet = currentSet;
                      var cDrag = draggableN;
                      ////var id = "set" + (parseInt(currentSet) +1) + ": item" + (parseInt(draggableN)  + 1)
                      var tried =  dragFreq[currentSet][draggableN]
                      setTimeout(function(){checkAnswers(cSet, cDrag, tried)}, 1000);
          	          }
                 };
        };
        

};

function mix () {     //// make "drag" possible on the next/prev page of navigation
        $('.drag').draggable("destroy");
        $('.drag').shuffle();
        $('.drag').draggable();
        $('.drag').draggable({ revert: true})
};



function playVideo(){
	var file_video =  $($(xml).find("main")[currentSet]).find("file_anim").text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideo( mediaPath, file_video);
	////alert('length=' + document.getElementById("videoTag").duration)
        document.getElementById("videoTag").onended = function(e) {
       /////////////////////////////////////////////////////////////////////   for completion of feedback, and next button navigation
        if(sets[currentSet] == 1){
				showFeedback("set_completed")
				setTimeout (function(){nextClick()},  parseInt(1500))}
       if(checkAct)
           completeActivity()
       ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
}


var finished
function checkFinished(){
        finished = true;
        for (var i=0; i< itemL; i++) {
          if(items[currentSet][i] == 0) {
            finished = false;
            return
            }
          }
};

var checkAct
function checkAcitivty(){
         checkAct = true;
         for (var i=0; i< itemL; i++) {
          if(sets[i] == 0) {
            checkAct = false;
            return
            }
          }
};


function playAudioPhrase(){
        $("#playBtn_s0").click(function() {
            var itemIndex = $(this).attr('id').substr(9, 1)
            audio_play_file(removeFileExt(audArr[currentSet][0]),mediaPath, itemIndex);
            playSoundButton[currentSet][itemIndex] = 1
        })
        $("#playBtn_s1").click(function() {
            var itemIndex = $(this).attr('id').substr(9, 1)
            audio_play_file(removeFileExt(audArr[currentSet][1]),mediaPath, itemIndex);
            playSoundButton[currentSet][itemIndex] = 1
        })
        $("#playBtn_s2").click(function() {
            var itemIndex = $(this).attr('id').substr(9, 1)
            audio_play_file(removeFileExt(audArr[currentSet][2]),mediaPath, itemIndex);
            playSoundButton[currentSet][itemIndex] = 1
        })
        $("#playBtn_s3").click(function() {
            var itemIndex = $(this).attr('id').substr(9, 1)
            audio_play_file(removeFileExt(audArr[currentSet][3]),mediaPath, itemIndex);
            playSoundButton[currentSet][itemIndex] = 1
        })
        $("#playBtn_s4").click(function() {
            var itemIndex = $(this).attr('id').substr(9, 1)
            audio_play_file(removeFileExt(audArr[currentSet][4]),mediaPath, itemIndex);
            playSoundButton[currentSet][itemIndex] = 1
        })
        $("#playBtn_s5").click(function() {
            var itemIndex = $(this).attr('id').substr(9, 1)
            audio_play_file(removeFileExt(audArr[currentSet][5]),mediaPath, itemIndex);
            playSoundButton[currentSet][itemIndex] = 1
        })
  };


function playAudioAll(lastAudLen)
{
	$("#clickGuard").css("display","block");  ///////////////////////// blocking any interactions
        var num = 0;
        var interval = 1000; // initial condition
        var run = setInterval(request , interval); // start setInterval as "run"

        function request() {
            audio_play_file(removeFileExt(audArr[currentSet][num]),mediaPath);
            clearInterval(run); // stop the setInterval()
            // dynamically change the run interval
            var new_interval = parseInt((audioDuration[currentSet][num])*1000)
            num++;
             if(num >= 6) {
                 clearInterval(run);
                       /////////////////////////////////////////////////////////////////////   for completion of feedback, and next button navigation
                        if(sets[currentSet] == 1){
				setTimeout (function(){showFeedback("set_completed")}, parseInt(((audioDuration[currentSet][itemL-1])*1000) + 1000));
				setTimeout (function(){nextClick()},  parseInt(((audioDuration[currentSet][itemL-1])*1000) + 2500));
			}
                       if(checkAct)
                           setTimeout (function(){completeActivity()},  parseInt(((audioDuration[currentSet][itemL-1])*1000) + 4000));
                       ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }
             else
                run = setInterval(request, new_interval); // start the setInterval()
          }
};

function moveAnimate(begin, end){   //// begin: dragged button,  end: correct drop zone
    var targetOffset = end.offset();
    var oldOffset = begin.offset();
    begin.appendTo(end);    
    ////var newOffset = begin.offset();

    var temp = begin.clone().appendTo('body');
    temp    .css('position', 'absolute')
            .css('left', oldOffset.left)
            .css('top', oldOffset.top)
            .css('zIndex', 1000);
    begin.hide();
    temp.animate( {'top': targetOffset.top, 'left':targetOffset.left}, 'slow', function(){
       begin.css('top', '-26px')
       begin.show();
       temp.remove();
    });

}

/*  //////////////the original code from  http://stackoverflow.com/questions/12098120/jquery-ui-sortable-move-item-automatically //////////////
function moveAnimate (element, newParent){
    var oldOffset = element.offset();
    element.appendTo(newParent);
    var newOffset = element.offset();

    var temp = element.clone().appendTo('body');
    temp    .css('position', 'absolute')
            .css('left', oldOffset.left)
            .css('top', oldOffset.top)
            .css('zIndex', 1000);
    element.hide();
    temp.animate( {'top': newOffset.top, 'left':newOffset.left}, 'slow', function(){
       element.show();
       temp.remove();
    });
}
*/


/*  //////////////the original code from  http://stackoverflow.com/questions/907279/jquery-animate-moving-dom-element-to-new-parent //////////////
var $old = $('#cell1 img');
//First we copy the arrow to the new table cell and get the offset to the document
var $new = $old.clone().appendTo('#cell2');
var newOffset = $new.offset();
//Get the old position relative to document
var oldOffset = $old.offset();
//we also clone old to the document for the animation
var $temp = $old.clone().appendTo('body');
//hide new and old and move $temp to position
//also big z-index, make sure to edit this to something that works with the page
$temp
  .css('position', 'absolute')
  .css('left', oldOffset.left)
  .css('top', oldOffset.top)
  .css('zIndex', 1000);
$new.hide();
$old.hide();
//animate the $temp to the position of the new img
$temp.animate( {'top': newOffset.top, 'left':newOffset.left}, 'slow', function(){
   //callback function, we remove $old and $temp and show $new
   $new.show();
   $old.remove();
   $temp.remove();
});

*/



var feedbackState;
function showFeedback(value, textInput){
	feedbackState = value;
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	///////$("#navGuard").css("display","block");

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
			////$("#feedbackHeader").html('<img  id="incorrect_img"  alt="incorrect" src="../common/img/feedback_incorrect.png" style="width:139px;height:38px;" border="0">');

			$("#feedbackText").html('Hint:  ' + text);
			break;
		case "correct":
			//$("#feedbackHeader").html("Correct");
			////$("#feedbackHeader").html('<img id="correct_img"  alt="correct" src="../common/img/feedback_correct.png" style="width:122px;height:38px;" border="0">');
			////$("#feedbackHeader").html('<img id="correct_img"  alt="correct" src="../common/img/feedback_correct.png" style="width:122px;height:38px;" border="0">');
			////$("#correct_img").fadeOut(3000);
				$("#feedbackBtn").hide();
				$("#clickGuard").css("display","none");


			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
                        $("#feedbackBtn").hide();
                        $("#clickGuard").css("display","block");
                        ////$("#navGuard").css("display","none");
			/*if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			} */
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("Next Activity");
			break;
	}
	
	$('#feedback').show();
	$("#feedbackText").mCustomScrollbar();
};


function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#correctAnswer").text("");
        $("#clickGuard").css("display","none");
        ////$("#navGuard").css("display","none");

	switch(feedbackState){
		case "correct":
			feedbackState = "";
                        if(sets[currentSet] == 1){

				setTimeout (showFeedback("set_completed"), audioDuration[currentSet][itemL-1]);
			}
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
        $("#feedbackBtn").hide();
        $("#clickGuard").css("display","none");
        ////$("#navGuard").css("display","none");
	$("#activityGuard").css("display","block");

     if(parent.activityCompleted)
          parent.activityCompleted(1,0);
    else
        $("#feedbackHeader").html("Activity Completed");


  
}


function playHTMLAudioWithSources(filenameMinusExt, mediaDir, itemIndex){
  	loadAudioTagPlayer(true);

	var htmlAudioPlayer = document.getElementById('audioPlayer');
	htmlAudioPlayer.innerHTML = "";

        var aud_duration = 0;

	var sourceList = "";	
	if(htmlAudioPlayer.canPlayType('audio/mpeg') == "true" || 
		htmlAudioPlayer.canPlayType('audio/mpeg') == "maybe" ){
		sourceList = sourceList + '<source src="' + mediaDir + 'mp3/'
					+ filenameMinusExt + '.mp3' + '" type="audio/mpeg">';
	}
	
	if(htmlAudioPlayer.canPlayType('audio/ogg') == "true" || 
		htmlAudioPlayer.canPlayType('audio/ogg') == "maybe" ){
		sourceList = sourceList + '<source src="' + mediaDir + 'ogg/'
					+ filenameMinusExt + '.ogg' + '" type="audio/ogg">';
	}

	if(g_ie){
		var url = mediaDir + 'mp3/'+ filenameMinusExt + '.mp3';
		
                        htmlAudioPlayer.addEventListener("loadedmetadata", function(_event) {
                              aud_duration = Math.round(htmlAudioPlayer.duration)
                              audioDuration[currentSet][itemIndex] = aud_duration
                                });

		       playHTMLAudio(url);
	}else{
		htmlAudioPlayer.innerHTML = sourceList;
		
		if(g_dontStart == false){
                        htmlAudioPlayer.addEventListener("loadedmetadata", function(_event) {
                              aud_duration = Math.round(htmlAudioPlayer.duration)
                              audioDuration[currentSet][itemIndex] = aud_duration
                                });
                                
			htmlAudioPlayer.play();
		}
	}

	return true; //todo - Right now I know of no way to verify that it will be played
}



function audio_play_file(filenameMinusExt, mediaDir, itemIndex){
	if(g_force_player){
		switch(g_force_player){
			case "flash":
				playFlashAudio(mediaDir + "mp3/" + filenameMinusExt + ".mp3");
				return;
			case "html":
				playHTMLAudioWithSources(filenameMinusExt, mediaDir, itemIndex);
				return;
		}
	}
	
	if(g_android){
		if(playFlashAudio(mediaDir + "mp3/" + filenameMinusExt + ".mp3")){
			return;
		}
	} 

	if (g_html5_audio){
		if(playHTMLAudioWithSources(filenameMinusExt, mediaDir, itemIndex)){
			return;
		}
	} 

	//Attempt to play using Flash
	if(playFlashAudio(mediaDir + "mp3/" + filenameMinusExt + ".mp3")){
		return;
	}

	if (g_android){
		//just try mp3 and call it a day (at this point)
	    window.document.location.href = mediaDir + "mp3/" + filenameMinusExt + ".mp3";
	    return;
	} 
	
	//Next attempt to use the embedded player
	var embedPlayer = document.getElementById("id_embed_player");
	
	if (embedPlayer && embedPlayer.Play){
	    embedPlayer.SetURL(URL)
	    embedPlayer.Play()
	}else{
	    if (window.ActiveXObject){
	      window.document.location.href = URL
	      return;
	    }else{
	      window.open( URL, '_blank' )
	      return;
	    }
	}
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
function checkAnswers(cSet, cDrag, Tried){      ////var id = "set" + (parseInt(currentSet) +1) + ": item" + (parseInt(draggableN)  + 1)
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";

	////answerAttemptsNum++;  

	questionID = "set" + (parseInt(cSet) +1) + ": item" + (parseInt(cDrag)  + 1);////parseInt(currentSet.toString());
	answer = "--";
	context = TLArr[cSet][cDrag];////"--";
	answerAttempts = Tried;
	
	// To see attempts - temp
	//$("#feedbackText").html("Homework//answerAttempts: " + answerAttemptsNum.toString());
               ////alert('id=' + questionID)
               ////alert('context=' + context)
               ////alert('attempt=' + answerAttempts)

	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	//$('#feedbackText').show();
}