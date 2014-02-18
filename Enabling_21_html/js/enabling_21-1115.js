var gXmlEnable21; // hold Dom elements of xml file
var gCurrentSet = 0; // hold current set in Activity
var gTotalSetNumber;  // hold total set in Activity
var gDiagramCoordinate; // hold all coordinate x and y for all image
var gFamilyMember; // hold family memebr
var gTotalFamilyMember; // hold the total family member for each set
var gDistractorIndex; // hold Distractor index
var gTotalSetCompleted = 0; // hold the number sets of activity that user finished it in ths activity.
var holdTimeout;
//loading initial stuff for this activity.
$(document).ready(function () {
    initEnable21();
});

	// create divs which are used later in this activity
function initEnable21() {
    var enable21Div = document.createElement("div");
    enable21Div.id = "enable21Div";
	document.getElementById('HTML5').appendChild(enable21Div);
	
	//top panel
	var topPanel= document.createElement("div");
   topPanel.id = "topPanel";
   enable21Div.appendChild(topPanel);
	
	//bottom panel
	var bottomPanel = document.createElement("div");
    bottomPanel.id = "bottomPanel";
    enable21Div.appendChild(bottomPanel);

    // Map panel for images.
    var mapPanel = document.createElement("div");
    mapPanel.id = "mapPanel";
    topPanel.appendChild(mapPanel);

	 // audio panel.
    var audioFeedBackPanel = document.createElement("div");
   audioFeedBackPanel.id = "audioFeedBackPanel";
    topPanel.appendChild(audioFeedBackPanel);

    // audioPanel .
    var audioPanel = document.createElement("div");
    audioPanel.id = "audioPanel";
    audioFeedBackPanel.appendChild(audioPanel);
	
	//play button
	 var playBtn = document.createElement("img");
    playBtn.id = "playBtn";
	playBtn.setAttribute("src", "images/play_btn.png");
	playBtn.onmouseout = function() { this.setAttribute("src", "images/play_btn.png"); };
    audioPanel.appendChild(playBtn);
	
		//hold text for play button
	 var audioTextPhase = document.createElement("div");
    audioTextPhase.id = "audioTextPhase";
    audioPanel.appendChild(audioTextPhase);
	 var okBtn = document.createElement("img");
    	okBtn.id = "okBtn";
		okBtn.setAttribute("src", "images/ok_btn.png");
		okBtn.onclick = function() { 
						$("#audioTextPhase, #transparentPopUp, #okBtn").css({display:"none"});
						 $("#feedBackDiv").hide();
						if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause(); 
						 gFamilyMember++;
						  playAudioForCurrentFamilyMember();
						};
		
    audioPanel.appendChild(okBtn);
	
	   // hold feedback.
    var feedBackPanel  = document.createElement("div");
    feedBackPanel.id = "feedBackPanel";
    audioFeedBackPanel.appendChild(feedBackPanel);
	
	 var feedBackDiv  = document.createElement("div");
    feedBackDiv.id = "feedBackDiv";
    feedBackPanel.appendChild(feedBackDiv);
	
		    //feedbackTop
    var feedbackTop = document.createElement("div");
    feedbackTop.id = "feedbackTop";
	feedbackTop.innerHTML ='<div id="titleFeedBack">gfjkytkt</div>';
	feedBackDiv.appendChild(feedbackTop);
   //feedbackBody 
    var feedbackBody = document.createElement("div");
    	feedbackBody.id = "feedbackBody";
		feedBackDiv.appendChild(feedbackBody);

    //feedbackBottom
    var feedbackBottom = document.createElement("div");
    feedbackBottom.id = "feedbackBottom";
	feedbackBottom.innerHTML ='<button type="button" href="#" id="closeFeedbackBtn" class="btn">OK</button>';
   feedBackDiv.appendChild(feedbackBottom);

	
    //panel use to contain the set button for this activity
	 var setButtons = document.createElement("div");
    setButtons.id = "setButtons";
		var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
          string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
    string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
    string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button></div>';
	setButtons.innerHTML=string;
    bottomPanel.appendChild(setButtons);

    //HTML5 Audio holder
    var audioPlayer = document.createElement("div");
    audioPlayer.id = "audioPlayer";
    enable21Div.appendChild(audioPlayer);

    //Flash Audio holder
    var flashAudio = document.createElement("div");
    flashAudio.id = "flashAudio";
    enable21Div.appendChild(flashAudio);

    // initial load audio player
    audioInitLoad();
    //location of folder where place resources files 
  
    cssFilename = "css/enabling_21.css"; //css url
    
	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		 mediaPath 	= "activityData/media/";
		xmlPath 	= "activityData/";
			xmlFilename = xmlPath + "xml/enabling_21.xml"; //xml url
			jsonFilename = xmlPath + "json/enabling_21.js"; //json file url
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

    // load xml 
    loadActivity(parseXml);


} // end initEnable15()

// For homework
var homeworkStatus;

	//parsing xml file
function parseXml(t_xml) {
    gXmlEnable21 = t_xml; //global variable to hold xml file after parsing it.
	
	// For homework and undefined for regular
	homeworkStatus = $(gXmlEnable21).find("content").attr("hw");
	
    $(gXmlEnable21).find("family-tree").shuffle(); // random sets inside activity
	gTotalSetNumber = $(gXmlEnable21).find("family-tree").length; //local variable to hold number set in activity
	
	 $("#prev").click(function () { //load the set when buttons is clicked
		 clearTimeout(holdTimeout);
		    $("#feedbackDiv").hide();
		 		 if ($("#next").attr("disabled"))
		 				$("#next").removeAttr("disabled");
				if (gCurrentSet > 0) {
            			$("#popUpDiv").css("display", "none");
            			gCurrentSet --;
						if (gCurrentSet == 0) 
					 		$(this).attr("disabled", "disabled");
           				loadSet();
				} else
						$(this).attr("disabled", "disabled");
        });
		$("#next").click(function () { //load the set when buttons is clicked
			clearTimeout(holdTimeout);
			   $("#feedbackDiv").hide();
				 if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
		      	 if (gCurrentSet < (gTotalSetNumber-1)) {
            			$("#popUpDiv").css("display", "none");
            			gCurrentSet ++;
						if (gCurrentSet == (gTotalSetNumber-1)) 
						 		$(this).attr("disabled", "disabled");
           						loadSet();
			   }
        });
	gDiagramCoordinate=new Array();
	//family01
	gDiagramCoordinate.push([{x: '373', y: '2'}, {x: '727', y: '2'}, {x: '20', y: '173'},{x: '374', y: '173'},{x: '551', y: '173'},{x: '728', y: '173'},{x: '4', y: '342'},{x: '181',y: '342'},{x: '359',y: '342'}]);
	//family02
	gDiagramCoordinate.push([{x: '222', y: '3'}, {x: '516', y: '3'}, {x: '11', y: '174'},{x: '279', y: '174'},{x: '453', y: '174'},{x: '721', y: '174'},{x: '34', y: '342'},{x: '256',y: '342'},{x: '474',y: '342'},{x: '697',y: '342'}]);
	//family03
	gDiagramCoordinate.push([{x: '17', y: '5'}, {x: '371', y: '5'}, {x: '16', y: '176'},{x: '362', y: '176'},{x: '710', y: '176'},{x: '361', y: '343'},{x: '538', y: '343'},{x: '715',y: '343'}]);
	loadSet();
}
function loadSet() {
	var familySet;
	gFamilyMember=0;
	$("#audioTextPhase, #transparentPopUp, #okBtn").css({display:"none"});
	   $("#feedBackDiv").hide();
	document.getElementById("mapPanel").innerHTML="";
	$("#setText").html((gCurrentSet+1) + '/' + gTotalSetNumber);
	 var mSetElem = $(gXmlEnable21).find("family-tree").eq(gCurrentSet);
	    // disable previous button if it is the first section/set of activity
	  if (gCurrentSet == 0) {
		     $("#prev").attr("disabled", "disabled");
	  }
	  else 
	     if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
	 
	  var transparentPopUp =document.createElement("div");
	 transparentPopUp.id ="transparentPopUp";
	document.getElementById("mapPanel").appendChild(transparentPopUp);

  $(mSetElem).find("family-member").shuffle();
  var hoverTextPanel = document.createElement("div");
 	 hoverTextPanel.id = "hoverTextPanel";
     document.getElementById("mapPanel").appendChild(hoverTextPanel);
	 
	var familyTree = document.createElement("img");
		familyTree.id = "familyTree";
		familyTree.setAttribute("src", mediaPath+ "png/"+ $(mSetElem).attr("frame-image"));
		document.getElementById("mapPanel").appendChild(familyTree);
		familySet= $(mSetElem).attr("frame-image").split(".")[0];
	  	familySet = parseFloat(familySet.replace("family", ""))-1;
		
		gTotalFamilyMember = $(mSetElem).find("family-member").length;
        $(mSetElem).find("family-member").each(function(){
			var imageMember = document.createElement("img");
			if (($(this).find("member_type").text().toLowerCase().replace(/^\s+|\s+$/g,'')) != "distractor"){
				imageMember.id ="image_" + $(this).attr("position");
			}
			else
			    imageMember.id ="imageDistractor";
		 		imageMember.style.top =gDiagramCoordinate[familySet][parseFloat($(this).attr("position")) -1].y +"px";
		 		imageMember.style.left = gDiagramCoordinate[familySet][parseFloat($(this).attr("position")) -1].x + "px";
			
				if ($(this).find("audio_key").length > 0  && ($(this).attr("completed") != "true")) {
						imageMember.setAttribute("src", mediaPath+ "png/"+ $(this).find("image_gray").text());
						imageMember.onclick= function () { 
								checkAnserfromUserSeelected(this.id)
						};
				        imageMember.className="noneActiveMember";
						
				}
				else {
						imageMember.setAttribute("src", mediaPath+ "png/"+ $(this).find("image_color").text());
						imageMember.className="activeMember";
				}
					var en_name = $(this).find("en_name").text();
				
				var tl_name  = $(this).find("tl_name").text();
				
				
						imageMember.onmouseover= function () {
				document.getElementById("hoverTextPanel").innerHTML="";
			var top = parseFloat(this.style.top)+120;
			var left= parseFloat(this.style.left);	
			document.getElementById("hoverTextPanel").style.display="block";
			var targeLan = document.createElement("div");
 	 			 targeLan.className="targeLanguage";
				 targeLan.innerHTML=tl_name;
     			 document.getElementById("hoverTextPanel").appendChild(targeLan);
					 var englighLanguage = document.createElement("div");
 	 				 englighLanguage.className="englighLanguage";
					 englighLanguage.innerHTML=en_name;
     				 document.getElementById("hoverTextPanel").appendChild(englighLanguage);
					 document.getElementById("hoverTextPanel").style.top = top+"px";
					 if (parseFloat(document.getElementById("hoverTextPanel").offsetWidth) < 160)
					 	left = left + ((160 - parseFloat(document.getElementById("hoverTextPanel").offsetWidth))/2);
					 else
					  	left = left - ((parseFloat(document.getElementById("hoverTextPanel").offsetWidth) -160)/2);
						
			document.getElementById("hoverTextPanel").style.left = left+"px";
				
				};
			
				imageMember.onmouseout = function () {
				
				
			
			document.getElementById("hoverTextPanel").style.display="none";
				};
				
			document.getElementById("mapPanel").appendChild(imageMember);

        }); 
		playAudioForCurrentFamilyMember();
   
}

function playAudioForCurrentFamilyMember() {
	$('#playBtn').css("cursor", "pointer");
	 var mSetElem = $(gXmlEnable21).find("family-tree").eq(gCurrentSet);
	if (gFamilyMember < (gTotalFamilyMember)) {
		    var familyMember =  $(mSetElem).find("family-member").eq(gFamilyMember);
			if ((($(familyMember).find("audio_phrase").length > 0)  && ($(familyMember).find("member_type").text().toLowerCase().replace(/^\s+|\s+$/g,'') !="distractor") ) && ($(familyMember).attr("completed") != "true")) {
				var url =$(familyMember).find("audio_phrase").text();
				$('#playBtn').unbind('click');
				$('#playBtn').bind('click', function() { 
				 $(this).attr("src", "images/play_btn_on.png");
				loadAud(url); });
				
			} else {
					if($(familyMember).find("member_type").text().toLowerCase().replace(/^\s+|\s+$/g,'') == "distractor") 
								gDistractorIndex = gFamilyMember;
				gFamilyMember ++;
				playAudioForCurrentFamilyMember();
			}
			     
			  
   } else {
	   $("#playBtn").css("cursor", "default");
	   $('#playBtn').unbind('click');
	   
	  var familyMember =  $(mSetElem).find("family-member").eq(gDistractorIndex);
	  
	   if ($(mSetElem).attr("setCompleted") != "true")
	          gTotalSetCompleted++;
			  if (document.getElementById("imageDistractor")) {
				   	$('#imageDistractor').css("cursor", "default");
		 			$("#imageDistractor").attr("src", mediaPath+ "png/"+ $(familyMember).find("image_color").text());	  
					document.getElementById("imageDistractor").onclick= function() {
																	return false;
																}
			  }
	   if (gTotalSetCompleted >= gTotalSetNumber)
	       showHint("activityCompleted");
	   else {
		   
	        showHint("setCompleted");
	   }
	   
	   }
}

function checkAnserfromUserSeelected(target) {
	 $("#feedBackDiv").css({display:"block"});
	var targetIndex = parseFloat(target.replace ("image_", ""));
	 var mSetElem = $(gXmlEnable21).find("family-tree").eq(gCurrentSet);
     var familyMember =  $(mSetElem).find("family-member").eq(gFamilyMember);
	 var currentTarget = $(familyMember).attr("position");
	 
	 //for Homework to get user answer.
	 var userAnswer;
	  $(mSetElem).find("family-member").each(function(){
			if (parseFloat($(this).attr("position")) == targetIndex)
				userAnswer  = $(this).find("tl_name").text() +" ("+ $(this).find("en_name").text() +")";
			else if (target == "imageDistractor")
				if ($(this).find("member_type").text().toLowerCase().replace(/^\s+|\s+$/g,'') == "distractor")
						userAnswer  = $(this).find("tl_name").text() +" ("+ $(this).find("en_name").text() +")";
	  
	  });
	  
	  //for Homework to get context for homework.
	  var context = $(familyMember).find("tl_name").text() +" ("+ $(familyMember).find("en_name").text() +")";
	    //for Homework to set current.
	  var questionID = gCurrentSet; 
	     if ($(familyMember).attr("answerAttempts")) {
			var num= parseFloat($(familyMember).attr("answerAttempts")) +1;
		    $(familyMember).attr("answerAttempts", num);
		} else
		    $(familyMember).attr("answerAttempts", "1");
			
	if (currentTarget == targetIndex) {
		    $(familyMember).attr("completed", "true");
			document.getElementById(target).setAttribute("src", mediaPath+ "png/"+ $(familyMember).find("image_color").text());
			document.getElementById(target).onclick= function() {
																	return false;
																}
			document.getElementById(target).style.cursor="default";
			showHint("true");
			
	} else {
		if ($(familyMember).attr("answerAttempts") && (parseFloat($(familyMember).attr("answerAttempts")) > 2)) { 
			 document.getElementById("audioTextPhase").style.display="block";
			 document.getElementById("transparentPopUp").style.display="block";
			 document.getElementById("okBtn").style.display="none";  //changed by sk "block" yo "none"
			  $(familyMember).attr("completed", "true");
			   if ($(familyMember).find("tl_phrase").text() !="") {
				
						  		document.getElementById("audioTextPhase").setAttribute("dir", $(familyMember).find("tl_phrase").attr("dir"));
				  		 		 document.getElementById("audioTextPhase").innerHTML= $(familyMember).find("tl_phrase").text();
				}else {
						  		document.getElementById("audioTextPhase").setAttribute("dir", $(familyMember).find("tl_name").attr("dir"));
				  		 		 document.getElementById("audioTextPhase").innerHTML= $(familyMember).find("tl_name").text();
				}
			document.getElementById("image_"+currentTarget).setAttribute("src", mediaPath+ "png/"+ $(familyMember).find("image_color").text());
			document.getElementById("image_"+currentTarget).onclick= function() {
																	return false;
																}
		    document.getElementById("image_"+currentTarget).style.cursor="default";
		}
		showHint("false")
	}
		//For Homework
		if (homeworkStatus) {
				var answerAttempts = $(familyMember).attr("answerAttempts");
					alert("questionID: "+ questionID + "\n\nUser Answer:\n "+userAnswer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);
				
				// To pass logs
			logStudentAnswer(questionID, userAnswer, context);
			logStudentAnswerAttempts(questionID, answerAttempts);
		}
}

function showHint(type) {
	clearTimeout(holdTimeout); 
     var mSetElem = $(gXmlEnable21).find("family-tree").eq(gCurrentSet);
     var familyMember =  $(mSetElem).find("family-member").eq(gFamilyMember);
		 $("#feedBackDiv").css({display:"block"});
		 $("#titleFeedBack, #feedbackBody").html("");
         $("#closeFeedbackBtn").unbind('click');
	 if (type == "true") {
						  document.getElementById("audioTextPhase").style.display="block";
						  document.getElementById("transparentPopUp").style.display="block";
						  document.getElementById("okBtn").style.display="none";  //changed by sk
						  if ($(familyMember).find("tl_phrase").text() !="") {
						  		document.getElementById("audioTextPhase").setAttribute("dir", $(familyMember).find("tl_phrase").attr("dir"));
				  		 		 document.getElementById("audioTextPhase").innerHTML= $(familyMember).find("tl_phrase").text();
						  }else {
						  		document.getElementById("audioTextPhase").setAttribute("dir", $(familyMember).find("tl_name").attr("dir"));
				  		 		 document.getElementById("audioTextPhase").innerHTML= $(familyMember).find("tl_name").text();
						  }
						  $("#titleFeedBack").html("<img src='images/feedback_correct.png' class='feedbackImage'/>");
						 // $("#feedbackBody").html("The answer is correct.");          //revised by sk
						 
		
	 } else  if (type == "false"){
		 var url =$(familyMember).find("audio_phrase").text();
		 loadAud(url);
		  $("#titleFeedBack").html("<img src='images/feedback_incorrect.png' class='feedbackImage'/>");
		 	  var messageFeedBack =document.createElement("div");
	    		  messageFeedBack.id ="messageFeedBack";
				  messageFeedBack.setAttribute("dir", $(familyMember).find("hint").attr("dir"));
				  messageFeedBack.innerHTML= $(familyMember).find("hint").text();
	    		  document.getElementById("feedbackBody").appendChild(messageFeedBack);
				  	if ($(familyMember).attr("answerAttempts") && (parseFloat($(familyMember).attr("answerAttempts")) < 3)) 
				          holdTimeout= setTimeout(function(){$("#feedBackDiv").css({display:"none"}); },3000);
		
	 } else  if (type == "setCompleted"){
				  $("#titleFeedBack").html("<div class='feedbackTitle'>This set is completed.</div>");
				  $("#feedbackBody").html("");
				    if ((gCurrentSet < (gTotalSetNumber-1)) &&  ($(mSetElem).attr("setCompleted") !="true"))  {
						$(mSetElem).attr("setCompleted", "true");
				 		 holdTimeout= setTimeout(function(){
					                        $("#feedBackDiv").css({display:"none"});
										    gCurrentSet ++;
											loadSet();
										  },  5000);
				   }
										  
				   else
				       	 holdTimeout= setTimeout(function(){
					                        $("#feedBackDiv").css({display:"none"});
										  },  5000);
		
		 
	 }else  if (type == "activityCompleted"){
				    $("#titleFeedBack").html("<div class='feedbackTitle'>This Activity is completed!</div>");
				  $("#feedbackBody").html("");
		
		 
	 }
	 $("#closeFeedbackBtn").click(function () {
        $("#feedBackDiv").hide();
		
		if ((type == "true") || ($(familyMember).attr("answerAttempts") && (parseFloat($(familyMember).attr("answerAttempts")) > 2)) ) {
			$("#audioTextPhase, #transparentPopUp, #okBtn").css({display:"none"});
						 $("#feedBackDiv").hide();
						if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause(); 
						 gFamilyMember++;
						  playAudioForCurrentFamilyMember();
		}
						
    });
				
				     
}
