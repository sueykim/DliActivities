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
var initialIndex;


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
  document.getElementById("activityContainer").appendChild(audioPlayer);

    //Flash Audio holder
    var flashAudio = document.createElement("div");
    flashAudio.id = "flashAudio";
   document.getElementById("activityContainer").appendChild(flashAudio);

    // initial load audio player
    audioInitLoad();
		
	 var setButtons = document.createElement("div");
    setButtons.id = "setButtons";
		var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
          string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
    string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
    string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button></div>';
	
	setButtons.innerHTML=string;
    document.getElementById('container_setDiv').appendChild(setButtons);
	
	cssFilename = "css/enabling_32_default.css";

	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
			 mediaPath 	= "activityData/media/";
			 xmlPath 	= "activityData/";
			xmlFilename = xmlPath  + "xml/enabling_32.xml";
		    jsonFilename = xmlPath  + "json/enabling_32.js";
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


// To display ruby tag
var isJapanese = false;
//parse xml
function parseXml(t_xml){
	xml = t_xml;
	numSets = $(xml).find("set").length;
	totalSets = numSets;
	
		// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	  // To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	loadSet(0);
		
		 $("#prev").click(function () { //load the set when buttons is clicked
		  clearTimeout(holdTimeout);
		 $('#feedback').hide();
		
		 if((document.getElementById('videoPlayer')) && !(document.getElementById('videoPlayer').paused))
								document.getElementById('videoPlayer').pause(); 
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
							currentItem = $(setXml).find("keyword").length-1;
							munItemCompleted=0;
					loadSet();
						
					} 
				}
        });
		$("#next").click(function () { //load the set when buttons is clicked
		clearTimeout(holdTimeout);
				 if((document.getElementById('videoPlayer')) && !(document.getElementById('videoPlayer').paused))
								document.getElementById('videoPlayer').pause(); 
		
		$('#feedback').hide();
		
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
							 if (currentSet == (totalSets-1) ) 
								 $(this).attr("disabled", "disabled");
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
	var matchText = "";
	var targetWord = "";
	var stringArray = new Array();
	var mVideoPlayer = document.getElementById('videoPlayer');
	
	document.getElementById('flashPlayer').style.display="none";
	
		setXml = $(xml).find("set").eq(currentSet);
	
			   if (currentSet == 0) {
		     $("#prev").attr("disabled", "disabled");
	  }
	  else 
	     if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
			 
	itemTotal = $(setXml).find("keyword").length;
	itemXML = $(setXml).find("keyword").eq(currentItem);
	if( mVideoPlayer &&  mVideoPlayer != "null") {
			var url = $(itemXML).find("video").text();
				 if (checkVideoFormat()) {
           			 var videoUrl = mediaPath + checkVideoFormat() + "/" + url.split(".")[0] + "." + checkVideoFormat();
		       			 mVideoPlayer.src = videoUrl;
            			mVideoPlayer.load(); 
						mVideoPlayer.style.display="none";
					}
	}
	$("#setText").html((currentSet+1) + '/' + totalSets);
	//$("#itemText").html((currentItem+1) + '/' + itemTotal);
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
				  	if (isJapanese) 
					t  = displayRubyTag(t);
			stringObj.tl_word = t;
			targetWord = t;
	        $("#transcript").attr("dir", $(itemXML).find("tl_word").attr("dir"));
			if ($(itemXML).find("tl_word").attr("dir").toLowerCase() == "rtl")
				$("#transcript").css("font-size", "28px");
			else
			   $("#transcript").css("font-size", "24px");
		
		//find and add image to imageContainer
			var t =$(itemXML).find("picture").text();
			stringObj.picture = t;
			$('#imageContainer').css('background-image', 'url(' + mediaPath + "png/" + t + ')');			
		

		document.getElementById("dragBubbleContainer").innerHTML="";
		var textFieldTranscript ="";
		var num=0;
		//divide target lang into divs
		for (var i = 0; i < targetWord.length; i++) {
			
			    num=Math.ceil(i/16);
			var tc = document.createElement("div");
				if ($(itemXML).attr("itemPartialCompleted") == "true")  {
						targetWord  = $(itemXML).attr("userText");
						tc.innerHTML = targetWord.charAt(i);
						textFieldTranscript +=targetWord.charAt(i);
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
$("#transcript").html(textFieldTranscript);	
	
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
			var text = "";
				$(".drag").each(function(){
					   text += $(this).html();
				});
				$("#transcript").html(text);				
		} else {
			//shuffle letters
			if ($(itemXML).attr("itemPartialCompleted") != "true")  {
				$(".drag").shuffle();
				
				//For Homework to get the context of word after randomly letters of word.
				var context = "";
				$(".drag").each(function(){
					   context += $(this).html();
				});
				$("#transcript").html(context);
				var targetLang =$(itemXML).find("tl_word").text();
				  	if (isJapanese) 
					targetLang  = displayRubyTag(targetLang);
				context += " -- " + targetLang;
				$(itemXML).attr("context", context);
				
				}
				
				
	var userTextSort;
		//create sortable
        $( "#dragBubbleContainer" ).sortable({ 
			tolerance: "pointer",
			opacity: 0.5,
			cancel:".pinned",
			//start drag
			start: function( event, ui ){
				$('.pinned', this).each(function(){
					var $this = $(this);
					$this.data('pos', $this.index());
				});
				initialIndex=$(ui.item).index();
				
			},
			
			//changes during drag
			change:function( event, ui ){
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
				if($(ui.item).index() != initialIndex){
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
								munItemCompleted++;;
								$(setXml).attr("munItemCompleted", munItemCompleted);
								if (munItemCompleted == itemTotal){
		    						 munItemCompleted=0;
			 			 			 munSetCompleted++;
			  						$(setXml).attr("munSetCompleted", munSetCompleted);
								}
								if ($(itemXML).find("video").length >0)
									playVideo($(itemXML).find("video").text(), "true");
								else
									showFeedback("correct", $(itemXML).find("feedback").text());
								 
							} 
						}
						
				});
				$("#transcript").html(userTextSort);
				 var userAnswer;
				 var questionID= currentItem;
				if ($(itemXML).attr("itemPartialCompleted") == "true") 
				    $(itemXML).attr("userText", userTextSort);
					
				        userAnswer = userTextSort;
						
								//calculate the percent score for Homework 	
		 var  finalScoreForSet = (lettersTotal/wordTotal);
		$(setXml).attr("scoreForSet",finalScoreForSet);
		var totalScoreforAllSets=0;
		$(xml).find("set").each(function(){
				if (parseFloat($(this).attr("scoreForSet")) >0) {
		      			totalScoreforAllSets +=parseFloat($(this).attr("scoreForSet"));
			  
				}
		}); 
		var finalScore =  Math.ceil((totalScoreforAllSets/totalSets)*100);
					 
					 	//For Homework
					if (homeworkStatus) {
					   var context = $(itemXML).attr("context");
						//var answerAttempts = $(itemXML).attr("answerAttempts");
						var answerAttempts = "Score: " + finalScore + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+userAnswer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);
				
						// To pass logs
							logStudentAnswer(questionID, userAnswer, context);
							logStudentAnswerAttempts(questionID, parseInt(finalScore));
					}
				}
			}//stop drag
		 }); 
		 }
		 $( "#textField").height($( "#transcript").height() +30);
				
				if(num >1){
							$( "#dragBubbleContainer").height(55*num);
							$( "#dragBubbleBG").height((55*num) +($( "#transcript").height() +60));
							
				}
				else {
				   $( "#dragBubbleContainer").height(55);
				   $( "#dragBubbleBG").height(55 +($( "#transcript").height() +60));
				}
	$( "#dragBubbleContainer" ).disableSelection();
    });
	
}

//audio
function playAudio(){
	 if (currentItem > (itemTotal-1)) {
		currentItem= itemTotal-1;
	 }
	var setXml = $(xml).find("set").eq(currentSet);
	var itemXML = $(setXml).find("keyword").eq(currentItem);
	loadAud($(itemXML).find("audio").text());
}

//feedback
function showFeedback(value, text){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html("<img src='images/feedback_incorrect.png' class='feedbackImage'/>");
			$("#feedbackText").html(text);
			break;
		case "correct":
		      okButtonIsClicked ="true";
			$("#feedbackHeader").html("<img src='images/feedback_correct.png' class='feedbackImage'/>");
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
	if (munSetCompleted == totalSets){
		
		holdTimeout= setTimeout(function(){
		    if(parent.activityCompleted)
							parent.activityCompleted(1,0);
		    else {
					$('#feedback').show();
					$("#feedbackHeader").html("Activity Completed!");
					$("#feedbackText").html("");
					munSetCompleted++;
		    }
			
			
			},3000);
			
									
		}
	
}

function closeFeedback(){
	
	$('#feedback').hide();
	var setXml = $(xml).find("set").eq(currentSet);
	  var content= $(xml).find("content").eq(0);
		//check all sets complete
		
	
		if (munSetCompleted == totalSets){
			if(parent.activityCompleted)
							parent.activityCompleted(1,0);
		    else {
					$('#feedback').show();
					$("#feedbackHeader").html("Activity Completed!");
					$("#feedbackText").html("");
					munSetCompleted++;
		  }
									
		}
}
   //this method uses to check what kind video format that browser will use such as mp4, webm, or ogv
function checkVideoFormat() {
	var html5VideoMimeTypes = new Array("video/mp4", "video/ogg", "video/webm");
    var html5VideoTypes = new Array("mp4", "ogv",  "webm");
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
		if (currentItem > (itemTotal-1)) {
			currentItem= itemTotal-1;
		}
		var setXml = $(xml).find("set").eq(currentSet);
		var itemXML = $(setXml).find("keyword").eq(currentItem);
	var mVideoPlayer = document.getElementById('videoPlayer');
	if( mVideoPlayer &&  mVideoPlayer != "null") {
	  $( "#videoPlayer").unbind( "ended" );
	  $( "#videoPlayer").unbind("timeupdate");
	 if (checkVideoFormat()) {
				if(feedback == "false") {
						$( "#videoPlayer").bind('ended', function(e) {	$( "#videoPlayer").unbind("timeupdate"); $('#feedback').hide();});
						 $( "#videoPlayer").bind("timeupdate", function (e) {
						                                                  if (this.currentTime == this.duration) {  
																          		$( "#videoPlayer").unbind('ended'); 
																		  			$('#feedback').hide();
																					
																		}
					 });


					//mVideoPlayer.addEventListener('ended', function(e) {$('#feedback').hide();}, false);
				} else {
				      $( "#videoPlayer").bind('ended', function(e) { $( "#videoPlayer").unbind("timeupdate"); showFeedback("correct", $(itemXML).find("feedback").text());});
					 $( "#videoPlayer").bind("timeupdate", function (e) {
						                                                  if (this.currentTime == this.duration) {  
																          		$( "#videoPlayer").unbind('ended'); 
																		  			showFeedback("correct", $(itemXML).find("feedback").text());
																					
																		}
					 });
     

					//mVideoPlayer.addEventListener('ended', function(e) {showFeedback("correct", $(itemXML).find("feedback").text());}, false);
				}
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