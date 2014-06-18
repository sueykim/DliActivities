var gXmlEnable22; // hold Dom elements of xml file
var gCurrentSet = 0; // hold current set in Activity
var gTotalItemCompleted; // hold the number item that user is completed in Section.
var gTotalSetNumber; // hold total sections (Set) of Activity
var gtotalItemsCorrect = 0; // hold the total correct words in the sentences. 
var gTotalsectionCompleted =0; // hold the total sections (Set) of Activity is completed. 
var nameMedia; // hold the media name such as audio/video. 
var setTimeVariable; // hold the variable name for setimeout which use to clear it in case it has no longer need it. 
var mediaSource;  // hold true or false if the audio/video is exist or not. 
var hwContent; // hold the content of section for homework purpose. 

// To display ruby tag
var isJapanese = false;

//loading initial stuff for this activity.
$(document).ready(function () {
    initEnable22();
});

	// create divs which are used later in this activity
function initEnable22() {
    var enable22Div = document.createElement("div");
    enable22Div.id = "enable22Div";
    document.getElementById('HTML5').appendChild(enable22Div);
	
	//top panel
	var topPanel= document.createElement("div");
   topPanel.id = "topPanel";
   enable22Div.appendChild(topPanel);
	
	//bottom panel
	var bottomPanel = document.createElement("div");
    bottomPanel.id = "bottomPanel";
    enable22Div.appendChild(bottomPanel);
	
	
	
	
    //panel use to contain the set button for this activity
    var setButtons = document.createElement("div");
    setButtons.id = "setButtons";
	setButtons.class = "pull-right";
    enable22Div.appendChild(setButtons);
	
    //location of folder where place resources files 
    cssFilename = "css/enabling_22.css"; 
   
		// Values from URL parameters or default values for testing
	//var statusParameters = getPassedParameters();
	//if (!statusParameters) {
			 mediaPath 	= "activityData/media/";
			 xmlPath 	= "activityData/";
			xmlFilename =   xmlPath  + "xml/enabling_22.xml"; //xml url
			jsonFilename = xmlPath  + "json/enabling_22.js"; //json file url
	//}
	/*else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
	}*/
	
    // load xml 
    loadActivity(parseXml);


} // end initEnable15()

var homeworkStatus;
// To display ruby tag
var isJapanese = false;

	//parsing xml file
function parseXml(t_xml) {
    gXmlEnable22 = t_xml; //global variable to hold xml file after parsing it.
	
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";

	// true for homework and undefined for regular
	homeworkStatus = $(gXmlEnable22).find("content").attr("hw");
	
  //$(gXmlEnable22).find("section").shuffle(); // random sets inside activity
	gTotalSetNumber = $(gXmlEnable22).find("section").length; //local variable to hold number Section in activity
    
    var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
          string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
    string += '</div><div class="margin_5 pull-right">&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
    string += '<button class="btn btn_set_value off" id="setText" title="SET">1/' +gTotalSetNumber+'</button></div>';
    $("#setButtons").html(string); //add buttons inside bottom container
 
        $("#prev").click(function () { //load the set when buttons is clicked
		clearTimeout(setTimeVariable);
		$("#feedbackEn22").hide();
		 		 if ($("#next").attr("disabled"))
		 				$("#next").removeAttr("disabled");
				if (gCurrentSet > 0) {
					 var element =document.getElementById( nameMedia);
					 	 var element =document.getElementById(nameMedia);
					 if(element && (element.paused == false)) {
					 	 element.pause(); 
		                 element.currentTime = 0.0;
					 }
            			gCurrentSet --;
						if (gCurrentSet == 0) 
					 		$(this).attr("disabled", "disabled");
           				loadSet();
				} else
						$(this).attr("disabled", "disabled");
        });
		$("#next").click(function () { //load the set when buttons is clicked
		clearTimeout(setTimeVariable);
		$("#feedbackEn22").hide();
				 if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
		      	 if (gCurrentSet < (gTotalSetNumber-1)) {
					 var element =document.getElementById(nameMedia);
					 if(element && (element.paused == false) ) {
					 	 element.pause(); 
		                 element.currentTime = 0.0;
					 }
            			gCurrentSet ++;
						if (gCurrentSet == (gTotalSetNumber-1)) 
						 		$(this).attr("disabled", "disabled");
           						loadSet();
			   }
        });
	
	
	loadSet(); //call initial set in activity.
	
	
	
	
} //end parseXml(t_xml)

	// loading the set for this activity
function loadSet() {
	//Reset all Divs panel to start new Section
	$('#dropContentArea, #videoDiv, #dragPanel, #topPanel').html("");
	 //content panel.
    var contentPanel = document.createElement("div");
    contentPanel.id = "contentPanel";
    topPanel.appendChild(contentPanel);
	 //Drag panel.
    var dragPanel = document.createElement("div");
    dragPanel.id = "dragPanel";
    contentPanel.appendChild(dragPanel);
	 //Drop panel.
    var dropPanel = document.createElement("div");
    dropPanel.id = "dropPanel";
    contentPanel.appendChild(dropPanel);
	
	 var dropContentArea = document.createElement("div");
    dropContentArea.id = "dropContentArea";
    dropPanel.appendChild(dropContentArea);
	 
	
	 //Video and Feedback panel.
    var videoFeedBackPanel = document.createElement("div");
    videoFeedBackPanel.id = "videoFeedBackPanel";
    topPanel.appendChild(videoFeedBackPanel);
	
	
	 //Video panel.
    var videoPanel = document.createElement("div");
    videoPanel.id = "videoPanel";
    videoFeedBackPanel.appendChild(videoPanel);
	
	 var videoDiv = document.createElement("div");
    videoDiv.id = "videoDiv";
    videoPanel.appendChild(videoDiv);
	
	 //Video Control panel.
	 var videoControl = document.createElement("div");
    videoControl.id = "videoControl";
    videoPanel.appendChild(videoControl);
	
	 var playBtn = document.createElement("button");
    playBtn.id = "playBtn";
	playBtn.innerHTML ='<i class="icon-play"></i>';
    videoControl.appendChild(playBtn);
	
    var stopBtn = document.createElement("button");
    stopBtn.id = "stopBtn";
	stopBtn.innerHTML='<i class="icon-stop"></i>';
	videoControl.appendChild(stopBtn);
	
	var seekLine = document.createElement("div");
    seekLine.id = "seekLine";
	videoControl.appendChild(seekLine);
	
	var seekbar = document.createElement("div");
    seekbar.id = "seekbar";
	seekLine.appendChild(seekbar);
	
	 //Feedback panel.
     var feedbackPanel = document.createElement("div");
    feedbackPanel.id = "feedbackPanel";
    videoFeedBackPanel.appendChild(feedbackPanel);

 var feedback= document.createElement("div");
    feedback.id = "feedbackEn22";
    feedbackPanel.appendChild(feedback);
	
	    //feedbackTop
    var feedbackTop = document.createElement("div");
    feedbackTop.id = "feedbackTop";
	feedbackTop.innerHTML ='<div id="titleFeedBack">gfjkytkt</div>';
	feedback.appendChild(feedbackTop);
   //feedbackBody 
    var feedbackBody = document.createElement("div");
    	feedbackBody.id = "feedbackBody";
		feedback.appendChild(feedbackBody);

    //feedbackBottom
    var feedbackBottom = document.createElement("div");
    feedbackBottom.id = "feedbackBottom";
	feedbackBottom.innerHTML ='<button type="button" href="#" id="closeFeedbackBtn" class="btn">OK</button>';
   feedback.appendChild(feedbackBottom);

	$("#feedbackEn22").hide();
	 $("#setText").html((gCurrentSet+1) + '/' + gTotalSetNumber);
	 
	  	//reset the homework content for each Section in xml
	  hwContent = "";
	  mediaSource =true;
	   // disable previous button if it is the first section/set of activity
	  if (gCurrentSet == 0) {
		     $("#prev").attr("disabled", "disabled");
	  }
	  else 
	     if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
						
				//load current section		
	  var mSectionElem = $(gXmlEnable22).find("section").eq(gCurrentSet);
          gtotalItemsCorrect =0;
		  
		 //insert image
	  if ($(mSectionElem).find("image").text() != "") {
		  var imageVideoAudio = document.createElement("img");
              imageVideoAudio.id = "imageVideoAudio";
			  //alert(mediaPath +"png/"+$(mSectionElem).find("image").text());
			  imageVideoAudio.setAttribute("src", mediaPath +"png/"+$(mSectionElem).find("image").text());
			  document.getElementById("videoDiv").appendChild(imageVideoAudio);
	  }
	  
	  //insert video/audio
	  if ($(mSectionElem).find("media_sel").text().toLowerCase() == "video") {
		   var mVideoPlayer = document.createElement("video");
               mVideoPlayer.id = "videoPlayer";
               document.getElementById("videoDiv").appendChild(mVideoPlayer);
			   nameMedia="videoPlayer";
			   var mVideoName = $(mSectionElem).find("video").text();
            	if (checkVideoFormat()) {
            			var videoUrl = mediaPath + checkVideoFormat() + "/" + mVideoName.split(".")[0] + "." + checkVideoFormat();
            			mVideoPlayer.src = videoUrl;
           				mVideoPlayer.load();
            	 }
				 if($(mSectionElem).find("video").text() !="") {
				 if ($(mSectionElem).find("image").text() != "") {
				       mVideoPlayer.style.display="none";
					   audioAndVideoInit("videoPlayer", "imageVideoAudio")
				 } else {
					   mVideoPlayer.style.display="block";
					   audioAndVideoInit("videoPlayer", "")
				 }
				 }
				 
		  
	  } else {
		         	 var audioPlayer = document.createElement('audio');  
				   		audioPlayer.id ="audioPlayer";
				 		audioPlayer.setAttribute("controls", "false");
				  	 	document.getElementById("videoDiv").appendChild(audioPlayer);
						 nameMedia="audioPlayer";
						var audioFile = $(mSectionElem).find("audio").text();
		  				if (checkAudioFormatSupportByBrowsers())  {
					 		audioPlayer.src=  mediaPath + checkAudioFormatSupportByBrowsers() +"/"+ audioFile.split(".")[0] +"."+ checkAudioFormatSupportByBrowsers();
							audioPlayer.load();
	  					}
						if($(mSectionElem).find("audio").text() !="") {
								if ($(mSectionElem).find("image").text() != "") {
				     				 audioPlayer.style.display="none";
					   				audioAndVideoInit("audioPlayer", "imageVideoAudio")
				 				} else {
					  				    audioPlayer.style.display="block";
					  		 			audioAndVideoInit("audioPlayer", "")
				 				}
						}
	  }
	  
	  var index=1;
		var engIndex=0;
		$(mSectionElem).find("tl_sentence").each(function(){
			if ($(this).text() != "") {
				var targetSentence = document.createElement("div");
				   targetSentence.className ='targetSentence';
				$('#dropContentArea').append(targetSentence);
				var englishSentence = document.createElement("div");
				    englishSentence.className ='englishSentence';
					 hwContent += '<div dir="'+ $(this).attr("dir") +'">' + $(this).text() + "</div>";
					 hwContent +='<div dir="ltr">' +  $($(mSectionElem).find("en_sentence ")[engIndex]).text() + "</div>";
				   englishSentence.innerHTML= $($(mSectionElem).find("en_sentence ")[engIndex]).text();
				   $("#feedbackContent").css({"display": "none"});
				   if ($(mSectionElem).find("enColor").text()) 
				  		 englishSentence.style.color = $(mSectionElem).find("enColor").text();
				$('#dropContentArea').append(englishSentence);
				engIndex++;
				var sentence = $(this).text();
				//var words = sentence.split(" ");
				var words = sentence.split("||");
				if ($(this).attr("dir") == "ltr") {  // for left to right language
					for ( var i=0; i < words.length; i++) {
						if (words[i] != "") {
							var dropDiv = document.createElement("div");
							//dropDiv.innerHTML = words[i];
							if (!isJapanese) {
								dropDiv.innerHTML = $.trim(words[i]);
							}
							else {
								// To display ruby tag
								dropDiv.innerHTML = displayRubyTag($.trim(words[i]));
							}
							dropDiv.setAttribute("dir", $(this).attr("dir"));
							dropDiv.id = "word" +index;
							index++;
							dropDiv.className = 'dropBubble';
							if (isJapanese) {
								$(".dropBubble").css({"margin": "0px 0px 0px 0px"}); 
							}
							targetSentence.appendChild(dropDiv);
						}
					}
				} else { // for right to left language
					for ( var i= words.length-1; i > -1; i--) {
						if (words[i] != "") {
							var dropDiv = document.createElement("div");
							if (!isJapanese) 
								dropDiv.innerHTML = $.trim(words[i]);
							else 
											// To display ruby tag
								dropDiv.innerHTML = displayRubyTag($.trim(words[i]));
							dropDiv.setAttribute("dir", $(this).attr("dir"));
							dropDiv.id = "word" +index;
								index++;
							dropDiv.className = 'dropBubble';
							targetSentence.appendChild(dropDiv);
						}
					}
				}
				//targetSentence.style.height= (targetSentence.offsetHeight+ 10) +"px";
				
				var checkDoubleParenthesesInSentense = sentence.match(/(.\u0028{2})/g);
				
				if (isJapanese && (checkDoubleParenthesesInSentense != null)){
					//$(".dropBubble").addClass("dropBubbleJapanese");
					$(".dropBubble").css({"height": "48px"}); 
					$(".dropBubble").css({"line-height": "48px"}); 
					
				}
				else {
					$(".dropBubble").css({"height": "28px"}); 
					$(".dropBubble").css({"line-height": "28px"}); 
				}
			}
		});
	   
	  var i=0;
	  var maxWidth=0;
		$(mSectionElem).find("tl_word").each(function(){
			if ($(this).text() != "") {
				if (mSectionElem.attr("completed") != "true") {
					var posit = $(this).attr("posit");
					gtotalItemsCorrect++;
						if ($(this).attr("completed") != "true") {
								var dragDiv = document.createElement("div");
								$('#dragPanel').append(dragDiv);
								var drag = document.createElement("div");
								    dragDiv.appendChild(drag);
									drag.setAttribute("dir", $(this).attr("dir"));
									if ((parseInt($.trim($(this).attr("posit"))) > 0) && ( $.trim($(this).text()).toLowerCase() == $.trim($("#word" +posit).html().toLowerCase().replace(/[!?;:,.]/gi, '')))) {
											 $("#word" +$(this).attr("posit")).removeClass( "dropBubble" ).addClass( "dropWord" );
											  $("#word" +$(this).attr("posit")).html("");
									} else {
									    var wordTarget= $.trim($(this).text()).toLowerCase();
										$(".dropBubble").each(function(){
												var text= $.trim($(this).text().toLowerCase().replace(/[!?;:,.]/gi, ''));
												if (wordTarget == text) {
													posit= $(this).attr("id").replace("word","");
													$("#word" +posit).removeClass( "dropBubble" ).addClass( "dropWord" );
													$("#word" +posit).html("");
												}
										});
									}
									//dragDiv.innerHTML = $(this).text();
									if (!isJapanese) {
										drag.innerHTML = $.trim($(this).text());
									}
									else {
										// To display ruby tag
										drag.innerHTML = displayRubyTag($.trim($(this).text()));
									}
									
									drag.id = "correct" +posit;
									$(drag).data(drag.id, i);
										i++;
										$(drag).css("position","absolute");
										if ( maxWidth < $(drag).width())
										 	maxWidth = $(drag).width();
										$(drag).css("position","");
											
									drag.className = 'drag';
									dragDiv.className = 'dragBubble';
									
						} else {
							i++;
							
								var wordsPosition = $(this).attr("posit");
								var numWords = wordsPosition.split(",");
								for ( var z=0; z < numWords.length; z++) { 
										var id = "word" +(numWords[z]);
										if(numWords[z]==1)
										$("#"+id).html(capitaliseFirstLetter($("#"+id).html()));
										$("#"+id).css({"visibility":"visible", "color": "#000", "border-bottom":"1px solid #000"});
								}
					  }
				}
			}
		});
		
		i=0;
		$(mSectionElem).find("dist_word").each(function(){
			if ($(this).text() != "") {
				var duplicate = false;
				var word= $.trim($(this).text()).toLowerCase();
				$(mSectionElem).find("tl_word").each(function(){
					if (word==$.trim($(this).text()).toLowerCase())
					   duplicate=true;
				});
				
				if(!duplicate) {
				          	var dragDiv = document.createElement("div");
							$('#dragPanel').append(dragDiv);
								var drag = document.createElement("div");
								    dragDiv.appendChild(drag);
							drag.setAttribute("dir", $(this).attr("dir"));
							
							//dragDiv.innerHTML = $(this).text();
									if (!isJapanese) {
										drag.innerHTML = $.trim($(this).text());
									}
									else {
										// To display ruby tag
										drag.innerHTML = displayRubyTag($.trim($(this).text()));
									}
							
							drag.id = "distractor" +i;
							i++;
							$(drag).css("position","absolute");
							if ( maxWidth < $(drag).width())
								maxWidth = $(drag).width();
							$(drag).css("position","");
							drag.className = 'drag';
							dragDiv.className = 'dragBubble';
				}
				
			}
		});
		$('.dropWord').width(maxWidth+15);
		if($('#dragPanel').outerHeight( true ) >255){
			$('#contentPanel').height(258);
			$('#dropPanel, #dropContentArea').width(416);
			$('#dropContentArea').width(401);
			$('#dropContentArea, #dropPanel').height(($('#dragPanel').outerHeight( true ) -10));
			
		$('#contentPanel').mCustomScrollbar({
               			scrollButtons: {
                   				enable: true
               			},
                		theme: "dark-2"
           		});
		} else {
				$('#dropPanel').width(440);
				$('#dropContentArea').width(425);
				$('#dropContentArea, #dropPanel').height(245);
		}
		$(".dragBubble").shuffle();
		$('.drag').draggable({
						revert: true,
						containment:"#contentPanel", 
						zIndex: 50, 
						start: function( event, ui ) {
							$("#feedbackEn22").hide();
							
							
							//clearTimeout(setTimeVariable);
						}
		 });
		$( ".dropWord").droppable({drop: dropFunction}); 
		if (mSectionElem.attr("completed") == "true") {
				 $('.drag').draggable( 'disable' );
				$(".englishSentence").css({"visibility":"visible"});
				
					$(mSectionElem).find("tl_word").each(function(){
					var wordsPosition = $(this).attr("posit");
						var numWords = wordsPosition.split(",");
						for ( var z=0; z < numWords.length; z++) { 
							var id = "word" +(numWords[z]);
							if(numWords[z]==1)
							$("#"+id).html(capitaliseFirstLetter($("#"+id).html()));
							$("#"+id).css({"visibility":"visible", "color": "#000", "border-bottom":"1px solid #000"});
						}
				});
				
				
				$(".dropBubble").css({"visibility":"visible"});
				$("#dropContentArea").mCustomScrollbar({
               			scrollButtons: {
                   				enable: true
               			},
                		theme: "dark-2"
           		});
		   if (gTotalsectionCompleted == gTotalSetNumber) {
			     if(parent.activityCompleted)
						parent.activityCompleted(1,0);
				else
						showFeedback("activity_completed", "");
												 
			} else {
				 showFeedback("set_completed", ""); 
		   }
		}
					
}

	//do somthing after drop it
function dropFunction(event, ui ) {
	var mSectionElem = $(gXmlEnable22).find("section").eq(gCurrentSet);
	
	var userAnswer = "";
				var name= $(ui.draggable).attr("id");
				var dropTargetId = event.target.id;
				
					if (mSectionElem.attr("answerAttempts")) {
							var num = parseFloat(mSectionElem.attr("answerAttempts")) +1;
								mSectionElem.attr("answerAttempts", num);
				     } else
				     			mSectionElem.attr("answerAttempts", "1");
				
				if(name.indexOf("correct") > -1 ){
					var dropTargetNum = dropTargetId.replace("word", "") ;
					var dragTargetNum= name.replace("correct", "");
					if(dropTargetNum == dragTargetNum){
						if (mSectionElem.attr("totalItemsCompleted"))
					      		 mSectionElem.attr("totalItemsCompleted", parseFloat (mSectionElem.attr("totalItemsCompleted")) +1);
				   		else
						   mSectionElem.attr("totalItemsCompleted", 1);
						   userAnswer = $(ui.draggable).html() +" -- Correct!"
						$(ui.draggable).parent().css("visibility","hidden");
						$("#"+dropTargetId).removeClass( "dropWord" ).addClass("dropCompleted" );
						if(dropTargetNum==1)
						    $("#"+dropTargetId).html(capitaliseFirstLetter($(ui.draggable).html()));
						else
						   $("#"+dropTargetId).html($(ui.draggable).html());
						$("#"+dropTargetId).css("width","");
						 if (parseFloat (mSectionElem.attr("totalItemsCompleted")) == gtotalItemsCorrect) {
							 $(".englishSentence").css({"visibility":"visible"});
						       $('.drag').draggable( 'disable' );
							   mSectionElem.attr("completed", "true");
							   gTotalsectionCompleted++;
							   $("#dropContentArea").mCustomScrollbar({
              									 scrollButtons: { enable: true },
                								 theme: "dark-2"
           						});
						 }
						
						var i = $("#"+name).data(name);
						$($(mSectionElem).find("tl_word")[i]).attr("completed", "true");
						 showFeedback("correct", "<div id='engFeedback'>" + $($(mSectionElem).find("feedback")[i]).text() + "</div>"); 
						//$("#engFeedback").css("color", $(mSectionElem).find("enColor").text());
					} else {
					      userAnswer = $(ui.draggable).html() +" -- Incorrect!";
						  showFeedback("wrong", "That answer is incorrect.");
						
					}
						
				} else {
					 userAnswer = $(ui.draggable).html() +" -- Incorrect!";
						  showFeedback("wrong", "That answer is incorrect.");
						
				}
				
				//calculate the percent score for Homework 	
		 var  finalScoreForSet = (parseFloat($(mSectionElem).attr("totalItemsCompleted"))/gtotalItemsCorrect);
		
	    $(mSectionElem).attr("scoreForSet",finalScoreForSet);
		
		
		var totalScoreforAllSets=0;
		$(gXmlEnable22).find("section").each(function(){
		if (parseFloat($(this).attr("scoreForSet")) >0) {
		      totalScoreforAllSets +=parseFloat($(this).attr("scoreForSet"));
			  
			}
	}); 
					var finalScore =  Math.ceil((totalScoreforAllSets/gTotalSetNumber)*100);
						 	//For Homework
					if (homeworkStatus) {
					   questionID = gCurrentSet;
						//var answerAttempts = mSectionElem.attr("answerAttempts");
							var answerAttempts = "Score: " + finalScore + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+userAnswer + "\n\nContext:\n "+ hwContent+ "\n\nUser Attempts: "+answerAttempts);
				
						// To pass logs
							logStudentAnswer(questionID, userAnswer, hwContent);
							logStudentAnswerAttempts(questionID, answerAttempts);
					}

 }
 
 
function audioAndVideoInit(elementID, imageID) {
	    var element = document.getElementById(elementID);
		
		//add error event to check the either no support or no source.
		element.addEventListener('error', function(ev) {
								if (ev.target.error.code == 4)
								mediaSource = false;
  
							}, false);
     $("#playBtn, #stopBtn").unbind();
	 $( "#seekbar" ).draggable( "destroy" );
	 $( "#seekbar").css("left", "-10px");
	 $("#playBtn").html('<i class="icon-play"></i>');
			// Add event listener for play/pause button.
		$("#playBtn").click(function() { 
		   if (mediaSource == false) {
			   alert("Your media file is not exist inside media folder!!!\nPlease check it and make sure it available inside media folder.");
		   } else {
				if ((imageID != "") && (elementID.indexOf("video") > -1 )) {
					var image = document.getElementById(imageID);
						image.style.display="none";
						element.style.display="block";
				}
				if (element.paused) {
					  		element.play();
							  // change Play button to Pause.
					 		$("#playBtn").html('<i class="icon-pause icon-white"></i>');
				} else {
			           		element.pause();
								// change Pause button to Play.
					 		$("#playBtn").html('<i class="icon-play"></i>');
				}
		   }
	});
	
	 
			$( "#seekbar" ).draggable({
					axis: 'x', 
					containment:"parent",
					stop: function( event, ui ){
						 if (mediaSource == false) {
			   alert("Your media file is not exist inside media folder!!!\nPlease check it and make sure it available inside media folder.");
			   $( "#seekbar").css("left", "-10px");
		   } else {
							var pos = parseFloat(ui.position.left) 
							if (pos < 0 )
							     pos=0;
			    			var time = element.duration * (pos / 170);
                     		 // Update the video time
		         			element.currentTime = time;
							element.play();
							$("#playBtn").html('<i class="icon-pause icon-white"></i>');
		   }
				
					}
		});
	
    	 // Pause the audio/video when the seekbar is being mouse down.
		$("#seekbar").mousedown(function() {   if (mediaSource != false) {element.pause(); }});
	
	 

$("#stopBtn").click(function() { 
    if (mediaSource == false) {
			   alert("Your media file is not exist inside media folder!!!\nPlease check it and make sure it available inside media folder.");
		   } else { 
     					element.pause(); 
						element.currentTime = 0.0;
						$( "#seekbar").css("left", "-10px");
						$("#playBtn").html('<i class="icon-play"></i>');
		   }
});

		// Update the seek bar as the video plays
	element.addEventListener("timeupdate", function() {
		     // Calculate the seek bar value
		var value = ((170 / element.duration) * element.currentTime) +"px";
        // Update the seek bar value
		if (parseFloat(element.currentTime) >0)
		$( "#seekbar").css("left", value);
		else 
		 $( "#seekbar").css("left", "-10px");
	});
	  //add Ended event which moves the seekbar to begining.
	element.addEventListener("ended", function() {
	if (imageID != "") {
		var image = document.getElementById(imageID);
			image.style.display="block";
			image.style.zIndex=50;
			element.style.zIndex=0;
		}
		element.pause(); 
		element.currentTime = 0.0;
		$( "#seekbar").css("left", "-10px");
		$("#playBtn").html('<i class="icon-play"></i>');
	});
	$( "#playBtn" ).hover(  function() {    $(".icon-play").addClass( "icon-white" );  }, function() {    $( ".icon-play" ).removeClass( "icon-white" );});
    $( "#stopBtn" ).hover(  function() {    $(".icon-stop").addClass( "icon-white" );  }, function() {    $( ".icon-stop" ).removeClass( "icon-white" );});
} // end audioAndVideoInit(element)

		//check the audio format which support by browser
	function checkAudioFormatSupportByBrowsers() {

	    var html5AudioMimeTypes = new Array ("audio/mp3", "audio/mpeg", "audio/ogg");
	   var html5AudioTypes = new Array ("mp3","mp3","ogg"); 
       var audioPlayer =  document.getElementById('audioPlayer'); 
	   if(audioPlayer && (audioPlayer != null)) {
       		for (var i = 0; i < html5AudioMimeTypes.length; i++) { 
	       			 var canPlay = audioPlayer.canPlayType(html5AudioMimeTypes[i]); 
						if ((canPlay == "maybe") || (canPlay == "probably"))
				   				return html5AudioTypes[i];
	  		 } 
	   }
	   return false;
 }
 
    //this method uses to check what kind video format that browser will use such as mp4, webm, or ogv
function checkVideoFormat() {
	var html5VideoMimeTypes = new Array("video/mp4", "video/ogg", "video/webm");
    var html5VideoTypes = new Array("mp4", "ogv", "webm");
    var myVideo = document.getElementById('videoPlayer');
    for (var i = 0; i < html5VideoMimeTypes.length; i++) {
        var canPlay = myVideo.canPlayType(html5VideoMimeTypes[i]);
        if ((canPlay == "maybe") || (canPlay == "probably"))
            return html5VideoTypes[i];
    }
    return false;
} //end checkVideoFormat()


function showFeedback(type, string) {
 $("#feedbackEn22").toggle();
 $("#closeFeedbackBtn").unbind('click');

 var mSectionElem = $(gXmlEnable22).find("section").eq(gCurrentSet);

    if (type == "correct") 
          $("#titleFeedBack").html("<img src='images/feedback_correct.png' class='feedbackImage'/>");
	 if (type == "wrong") 
		   $("#titleFeedBack").html("<img src='images/feedback_incorrect.png' class='feedbackImage'/>");
	
    if (type == "hint") 
       $("#titleFeedBack").html("<div class='feedbackTitle'>HINT</div>");
		
    if (type == "feedback") 
       $("#titleFeedBack").html("<div class='feedbackTitle'>FEEDBACK</div>");
	
    if (type == "alert") 
        $("#titleFeedBack").html("<div class='feedbackTitle'>WARNING MESSAGE!</div>");
	
    if (type == "activity_completed") {
		 $("#titleFeedBack").html("<div class='feedbackTitle'>ACTIVITY COMPLETED!</div>");
    }
	
    if (type == "set_completed") {
	        $("#titleFeedBack").html("<div class='feedbackTitle'>SET COMPLETED!</div>");
		 
    }
	if ((gTotalsectionCompleted == gTotalSetNumber) || (type == "activity_completed")) {
		  if(parent.activityCompleted)
			   parent.activityCompleted(1,0);
	     	string += "<div class='activityCompleted'>The activity is completed.</div>";
			$("#closeFeedbackBtn").toggle();
	}
	else {
			if ((parseFloat (mSectionElem.attr("totalItemsCompleted")) == gtotalItemsCorrect) || (type == "set_completed") ) 
	     			string += "<div class='activityCompleted'>The set is completed.</div>";
	}
	
	 $("#feedbackBody").html(string);
	$("#closeFeedbackBtn").click(function () {
        $("#feedbackEn22").hide();
		okButtonIsClicked(type);
    });
	
}
  //this function will close the popup if ok button is clicked
function okButtonIsClicked(type) {
var mSectionElem = $(gXmlEnable22).find("section").eq(gCurrentSet);
if ((parseFloat (mSectionElem.attr("totalItemsCompleted")) == gtotalItemsCorrect) || (type == "set_completed"))
  if (gCurrentSet < (gTotalSetNumber-1)) {
	  gCurrentSet++;
	  loadSet();
  }
} //end okButtonIsClicked()
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
