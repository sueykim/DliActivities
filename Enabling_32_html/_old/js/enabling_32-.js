/*=============================
DLiLearn - Enabling 32 Activity
Created by: Patrick Wilkes
http://www.dliflc.edu
=============================*/

//global vars
var stringObj = new Object();
var totalSets = 0;
var currentItem = 0;
var currentSet=0;
var munItemCompleted=0;
var munSetCompleted=0;
var itemTotal = 0;
var itemXML;
var xml;
var feedbackOkIsClicked;
var toggle;


//init and load files
$(document).ready(function() {
	$('#feedback').hide();
	//panel use to contain the set button for this activity
	   var mVideoPlayer = document.createElement("video");
        mVideoPlayer.id = "videoPlayer";
        document.getElementById("imageContainer").appendChild(mVideoPlayer);
		   var flashPlayer = document.createElement("div");
            flashPlayer.id = "flashPlayer";
			  document.getElementById("imageContainer").appendChild(flashPlayer);
			      //HTML5 Audio holder
    var audioPlayer = document.createElement("div");
    audioPlayer.id = "audioPlayer";
  document.getElementById("activity_wrapper").appendChild(audioPlayer);

    //Flash Audio holder
    var flashAudio = document.createElement("div");
    flashAudio.id = "flashAudio";
   document.getElementById("activity_wrapper").appendChild(flashAudio);

    // initial load audio player
    audioInitLoad();
		
	 var setButtons = document.createElement("div");
    setButtons.id = "setButtons";
		var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
          string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
    string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
    string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button>';
	string += '<button class="btn btn_item" id="itemDiv" title="Item">ITEM:&nbsp;</button>';
    string += '<button class="btn btn_set_value off" id="itemText" title="Item">1/5</button></div>';
	
	setButtons.innerHTML=string;
    document.getElementById('container_setDiv').appendChild(setButtons);
	
	cssFilename = "css/enabling_32_default.css";

	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
			 mediaPath 	= "activityData/media/";
			 xmlPath 	= "activityData/";
			xmlFilename = xmlPath  + "enabling32_letterSwap.xml";
		    jsonFilename = xmlPath  + "enabling32_letterSwap.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
	}
	
	loadActivity(parseXml);
	
	document.getElementById('playBtn').onclick = playAudio;
}); 
// For homework
var homeworkStatus;
//parse xml
function parseXml(t_xml){
	xml = t_xml;
	numSets = $(xml).find("set").length;
	totalSets = numSets;
	
		// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	loadSet(0);
		
		 $("#prev").click(function () { //load the set when buttons is clicked
		 $('#feedback').hide();
		 clearTimeout(holdTimeout);
		 if((document.getElementById('videoPlayer')) && !(document.getElementById('videoPlayer').paused))
								document.getElementById('videoPlayer').pause(); 
		 if (toggle=="true")
			currentItem --;
		 if ($("#next").attr("disabled"))
		 				$("#next").removeAttr("disabled");
				if (currentItem > 0) {
					 if (currentItem >(itemTotal-1))
					 		currentItem= itemTotal-1;
            		currentItem --;
					 if ((currentSet == 0) && (currentItem == 0) ) 
								 $(this).attr("disabled", "disabled");
					loadSet();
				}  else {
					if (currentSet > 0 ){
						currentSet --;
						 var setXml = $(xml).find("set").eq(currentSet);
							currentItem = $(setXml).find("item").length-1;
							munItemCompleted=0;
					loadSet();
						
					} 
				}
        });
		$("#next").click(function () { //load the set when buttons is clicked
			if (toggle=="true")
				currentItem --;
				 if((document.getElementById('videoPlayer')) && !(document.getElementById('videoPlayer').paused))
								document.getElementById('videoPlayer').pause(); 
		
		$('#feedback').hide();
		clearTimeout(holdTimeout);
		 if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
		      		 if (currentItem < (itemTotal-1)) {
						  currentItem ++;
						 if ((currentSet == (totalSets-1)) && (currentItem == (itemTotal-1)) ) 
								 $(this).attr("disabled", "disabled");
							 loadSet();
			   		} else {
						if (currentSet < (totalSets-1) ){
						    currentSet ++;
							munItemCompleted=0;
						    currentItem =0;
						    loadSet();
						} 
					}
			 
        }); 
}

function locations(substring,string){
  var a=[],i=-1;
  while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
  return a;
}

//load the set
function loadSet(){
	toggle ="false";
	var matchText = "";
	var targetWord = "";
	var stringArray = new Array();
	var mVideoPlayer = document.getElementById('videoPlayer');
	if( mVideoPlayer &&  mVideoPlayer != "null") 
			mVideoPlayer.style.display="none";
	document.getElementById('flashPlayer').style.display="none";
	
		setXml = $(xml).find("set").eq(currentSet);
	if (currentItem >0)
		 if ($("#prev").attr("disabled"))
		 	 $("#prev").removeAttr("disabled");
	 if ((currentSet == (totalSets-1)) && (currentItem == (itemTotal-1)) ) 
		     $("#next").attr("disabled", "disabled"); 
			 
	itemTotal = $(setXml).find("item").length;
	itemXML = $(setXml).find("item").eq(currentItem);
	$("#setText").html((currentSet+1) + '/' + totalSets);
	$("#itemText").html((currentItem+1) + '/' + itemTotal);
       if (parseFloat($(setXml).attr("munItemCompleted")) >0)
		         munItemCompleted = parseFloat($(setXml).attr("munItemCompleted"));
		  if (parseFloat($(setXml).attr("munSetCompleted")) >0)
		         munSetCompleted = parseFloat($(setXml).attr("munSetCompleted"));
				 
		//find and add english word matchText div
		var t =$(itemXML).find("en_word").text();
			stringObj.en_word = t;
			$(".matchText").html(t);
		
		//find and add target language word to object
			var t =$(itemXML).find("tl_word").text();
			stringObj.tl_word = t;
			targetWord = t;
	
		
		//find and add image to imageContainer
			var t =$(itemXML).find("picture").text();
			stringObj.picture = t;
			$('#imageContainer').css('background-image', 'url(' + mediaPath + "png/" + t + ')');			
		

		document.getElementById("dragBubbleContainer").innerHTML="";
		
		//divide target lang into divs
		for (var i = 0; i < targetWord.length; i++) {
			var tc = document.createElement("div");
				if ($(itemXML).attr("itemPartialCompleted") == "true")  {
						targetWord  = $(itemXML).attr("userText");
						tc.innerHTML = targetWord.charAt(i);
						   var string = stringObj.tl_word;
					   if (string.charAt(i) == targetWord.charAt(i)){
					        tc.style.border ="#ffb11f solid 2px";
							tc.className = "drag pinned";
					   } else {
						     tc.style.border= "solid thin #b8b8b8";
							 tc.className = "drag";
					   }
						
				} else {
						tc.innerHTML = targetWord.charAt(i);
						tc.className = "drag";
				}
			document.getElementById("dragBubbleContainer").appendChild(tc);
		}

	
	$(function() {
	
		var wordTotal = targetWord.length;
		
		if ($(itemXML).attr("itemCompleted") == "true"){
			$(".drag").css("border","#ffb11f solid 2px");
			$(".drag").addClass('pinned');
			if ($(itemXML).find("video").length >0) {
				//$('#imageContainer').css('background-image', 'none');	
				$('#imageContainer').css('background-image', 'url(' + mediaPath + "png/" + $(itemXML).find("picture").text() + ')');		
				playVideo($(itemXML).find("video").text(), "false");
			}
								
		} else {
			//shuffle letters
			if ($(itemXML).attr("itemPartialCompleted") != "true")  {
				$(".drag").shuffle();
				
				//For Homework to get the context of word after randomly letters of word.
				var context = "";
				$(".drag").each(function(){
					   context += $(this).html();
				});
				context += " -- " +targetWord;
				$(itemXML).attr("context", context);
				
				}
				
	var userTextSort;
		//create sortable
        $( "#dragBubbleContainer" ).sortable({ 
			tolerance: "pointer",
			axis: "x",
			opacity: 0.5,
			cancel:".pinned",
			//start drag
			start: function(){
				$('.pinned', this).each(function(){
					var $this = $(this);
					$this.data('pos', $this.index());
				});
			},
			
			//changes during drag
			change: function(){
				$sortable = $(this);
				$pins = $('.pinned', this).detach();
				$helper = $('<div></div>').prependTo(this);
				$pins.each(function(){
					var $this = $(this);
					var target = $this.data('pos');
					$this.insertAfter($('div', $sortable).eq(target));
				});
				$helper.remove();
			},
			
			//stop drag
			stop: function(event, ui) {
				var lettersTotal = 0;
				userTextSort = "";
				$(itemXML).attr("itemPartialCompleted", "true");
				if ($(itemXML).attr("answerAttempts")) {
					var num = parseFloat($(itemXML).attr("answerAttempts")) +1;
					$(itemXML).attr("answerAttempts", num);
				 } else
				      $(itemXML).attr("answerAttempts", "1");
				$(".drag").each(function(){
					   var string = stringObj.tl_word;
					   userTextSort += $(this).html();
					   var character = string.charAt(parseFloat($(this).index()));
					 $(this).css("border","solid thin #b8b8b8");
					   if (character == $(this).html()){
							$(this).css("border","#ffb11f solid 2px");
							$(this).addClass('pinned');
							lettersTotal++;
							//check all items correct
							if (lettersTotal == wordTotal){
								$(itemXML).removeAttr("itemPartialCompleted");
								$(".drag").addClass('pinned');
								$(itemXML).attr("itemCompleted", "true");
								toggle="true";
								munItemCompleted++;;
								$(setXml).attr("munItemCompleted", munItemCompleted);
								if ($(itemXML).find("video").length >0)
									playVideo($(itemXML).find("video").text(), "true");
								else
									showFeedback("correct", $(itemXML).find("feedback").text());
									currentItem++;
								 
							} 
						}
				});
				 var userAnswer;
				 var questionID= currentItem;
				if ($(itemXML).attr("itemPartialCompleted") == "true") 
				    $(itemXML).attr("userText", userTextSort);
					
				        userAnswer = userTextSort;
					 
					 	//For Homework
					if (homeworkStatus) {
					   var context = $(itemXML).attr("context");
						var answerAttempts = $(itemXML).attr("answerAttempts");
							alert("questionID: "+ questionID + "\n\nUser Answer:\n "+userAnswer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);
				
						// To pass logs
							logStudentAnswer(questionID, userAnswer, context);
							logStudentAnswerAttempts(questionID, answerAttempts);
					}
			}//stop drag
		 }); 
		 }
	$( "#dragBubbleContainer" ).disableSelection();
    });
	
	
	
	//determine if item is in correct position after shuffle
	
		//if it is, highlight it and lock it
}

//audio
function playAudio(){
	 if (currentItem > (itemTotal-1))
		currentItem= itemTotal-1;
	var setXml = $(xml).find("set").eq(currentSet);
	var itemXML = $(setXml).find("item").eq(currentItem);
	loadAud($(itemXML).find("audio").text());
}

//feedback
function showFeedback(value, text){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html("Incorrect");
			$("#feedbackText").html(text);
			break;
		case "correct":
		      okButtonIsClicked ="true";
			$("#feedbackHeader").html("Correct");
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed!");
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed!");
			$("#feedbackText").html(text);
			break;
	}
	
	$('#feedback').show();
}
var setToggle;
function closeFeedback(){
	
	$('#feedback').hide();
	var setXml = $(xml).find("set").eq(currentSet);
	  var content= $(xml).find("content").eq(0);
		//check all sets complete
	if ($(content).attr("userAction") !=  "completed") {
		if (munSetCompleted == totalSets){
			  	showFeedback("activity_completed", "");
				$(content).attr("userAction", "completed");
									
		} else {
				if (currentItem < itemTotal)
					loadSet();
				if (munItemCompleted == itemTotal){
		    		 munItemCompleted=0;
			 		 munSetCompleted++;
			  		$(setXml).attr("munSetCompleted", munSetCompleted);
					if (currentSet < (totalSets-1) ){
			 				currentSet++;
							currentItem = 0;
					}
					showFeedback("set_completed", "");
				}
		}
	}
}


   //this method uses to check what kind video format that browser will use such as mp4, webm, or ogv
function checkVideoFormat() {
	var html5VideoMimeTypes = new Array("video/mp4", "video/webm", "video/ogg");
    var html5VideoTypes = new Array("mp4", "webm", "ogv");
    var myVideo = document.getElementById('videoPlayer');
    for (var i = 0; i < html5VideoMimeTypes.length; i++) {
        var canPlay = myVideo.canPlayType(html5VideoMimeTypes[i]);
        if ((canPlay == "maybe") || (canPlay == "probably"))
            return html5VideoTypes[i];
    }
    return false;
} //end checkVideoFormat()
	//load the flash video for call back if HTML5 video is not supported
function loadFlashVideo(videoName) {
	videoName=videoName.split(".")[0];
	$("#flashPlayer").html("");
    var flashEmbed = '<embed align="middle" wmode="transparent" src="swf/VideoCaption.swf" ' +
        'flashvars="videoSource=' + videoName + '.flv&amp;' +
        'mediaFilePath='+ mediaPath + 'flv/&amp;fileExt=flv&amp;minimal=true" ' +
        'id="VideoCaption" quality="high" bgcolor="#869ca7" name="VideoCaption" ' +
        'allowscriptaccess="sameDomain" pluginspage="http://www.adobe.com/go/getflashplayer" ' +
        'type="application/x-shockwave-flash"> ';

    $("#flashPlayer").html(flashEmbed);
	document.getElementById('flashPlayer').style.display="block";
} //end loadFlashVideo

var holdTimeout;
function playVideo(url, feedback){
	var ie = (navigator.appName.indexOf ("Microsoft") != -1) ? 1 : 0;
		if (currentItem > (itemTotal-1))
			currentItem= itemTotal-1;
		var setXml = $(xml).find("set").eq(currentSet);
		var itemXML = $(setXml).find("item").eq(currentItem);
	var mVideoPlayer = document.getElementById('videoPlayer');
	if( mVideoPlayer &&  mVideoPlayer != "null") {
	 if (checkVideoFormat()) {
            var videoUrl = mediaPath + checkVideoFormat() + "/" + url.split(".")[0] + "." + checkVideoFormat();
		        mVideoPlayer.src = videoUrl;
            	mVideoPlayer.load();
				mVideoPlayer.play();
				mVideoPlayer.pause(); 
				
				
				if(feedback == "false") {
					mVideoPlayer.addEventListener('ended', function(e) {$('#feedback').hide();}, false);
				} else
					mVideoPlayer.addEventListener('ended', function(e) {showFeedback("correct", $(itemXML).find("feedback").text());}, false);
					if (ie) 
                    		 mVideoPlayer.style.display="block";
				    else{
						$("#videoPlayer").css({ width: "32px", height: "24px", left: "144px", top: "109px", display:"block"});
						$("#videoPlayer").animate({ width: "320px", height: "240px", left:"0px", top:"0px" }, 2000 );
					}
           	 	mVideoPlayer.play();

        } else {
           
            loadFlashVideo(url);
			if(feedback == "true") 
			  holdTimeout= setTimeout(function(){showFeedback("correct", $(itemXML).find("feedback").text()); clearTimeout(holdTimeout); },3000);

        }
	} else {
            loadFlashVideo(url);
			if(feedback == "true") 
			  holdTimeout= setTimeout(function(){showFeedback("correct", $(itemXML).find("feedback").text()); clearTimeout(holdTimeout); },3000);

        }
		    
		
}
