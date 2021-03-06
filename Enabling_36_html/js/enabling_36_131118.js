
var gXmlEnable36; // hold Dom elements of xml file
var gCurrentSet = 0; // hold current set in Activity
var gTotalStepCompleted = 0; // hold the number sets of activity that user finished it in ths activity.
var gTotalSetNumber;

// To display ruby tag
var isJapanese = false;

//loading initial stuff for this activity.
$(document).ready(function () {
    initEnable36();
});

	// create divs which are used later in this activity
function initEnable36() {
    var enable36Div = document.createElement("div");
    enable36Div.id = "enable36Div";
    document.getElementById('HTML5').appendChild(enable36Div);
	  //title panel.
    var titlePanel = document.createElement("span");
    titlePanel.id = "titlePanel";
    enable36Div.appendChild(titlePanel);
	$("#titlePanel").addClass("activity_hd");
	$("#titlePanel").css("float", "left");
	  // instruction panel.
    var instructionPanel = document.createElement("div");
    instructionPanel.id = "instructionPanel";
    enable36Div.appendChild(instructionPanel);
    // top panel using for notes.
    var notePanel = document.createElement("div");
    notePanel.id = "notePanel";
    enable36Div.appendChild(notePanel);
    // middle panel contain the text, image, audio, and video.
    var passagePanel = document.createElement("div");
    passagePanel.id = "passagePanel";
    enable36Div.appendChild(passagePanel);

    // bottom panel contain multiple answers.
    var answersPanel = document.createElement("div");
    answersPanel.id = "answersPanel";
    enable36Div.appendChild(answersPanel);

    //PopUp Div
    var popUpDiv = document.createElement("div");
    popUpDiv.id = "popUpDiv";
    enable36Div.appendChild(popUpDiv);

    var outSidePopUpDiv = document.createElement("div");
    outSidePopUpDiv.id = "outSidePopUpDiv";

    //top PopUp
    var topPopUpDiv = document.createElement("div");
    topPopUpDiv.id = "topPopUpDiv";
	topPopUpDiv.innerHTML ='<div id="titlePopUp"></div>';
   //Bottom Popup
    var bodyPopUpDiv = document.createElement("div");
    bodyPopUpDiv.id = "bodyPopUpDiv";


    //Bottom Popup
    var bottomPopUpDiv = document.createElement("div");
    bottomPopUpDiv.id = "bottomPopUpDiv";
	bottomPopUpDiv.innerHTML ='<button type="button" href="#" id="closePopupBottom" class="btn">OK</button>';
    outSidePopUpDiv.appendChild(topPopUpDiv);
	 outSidePopUpDiv.appendChild(bodyPopUpDiv);
    outSidePopUpDiv.appendChild(bottomPopUpDiv);
    popUpDiv.appendChild(outSidePopUpDiv);

    //submit panel use to contain the button submit
    var submitPanel = document.createElement("div");
    submitPanel.id = "submitPanel";
	submitPanel.class = "pull-left";
    enable36Div.appendChild(submitPanel);
    var submitBtn = document.createElement("img");
    submitBtn.id = "submitBtn";
    submitBtn.setAttribute("src", "images/btn_submit.png");
    submitBtn.onclick = function () {
        checkAnswers();
    }; //check answers after submit button is clicked
    submitPanel.appendChild(submitBtn);

    //panel use to contain the set button for this activity
    var setButtons = document.createElement("div");
    setButtons.id = "setButtons";
	setButtons.class = "pull-right";
    enable36Div.appendChild(setButtons);

    //HTML5 Audio holder
    var audioPlayer = document.createElement("div");
    audioPlayer.id = "audioPlayer";
    enable36Div.appendChild(audioPlayer);

    //Flash Audio holder
    var flashAudio = document.createElement("div");
    flashAudio.id = "flashAudio";
    enable36Div.appendChild(flashAudio);

    // initial load audio player
    audioInitLoad();
    //location of folder where place resources files 
    cssFilename = "css/enabling_36.css"; //css url
   
		// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
			 mediaPath 	= "activityData/media/";
			 xmlPath 	= "activityData/";
			
			//xmlFilename =   xmlPath  + "xml/enabling_36.xml"; //xml url
			xmlFilename =   xmlPath  + "xml/ja_l04_03.xml"; //xml url
			
			jsonFilename = xmlPath  + "json/enabling_36.js"; //json file url
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

var homeworkStatus;

	//parsing xml file
function parseXml(t_xml) {
    gXmlEnable36 = t_xml; //global variable to hold xml file after parsing it.
	
	// To display ruby tag
	isJapanese = $(gXmlEnable36).find("content").attr("target_language") == "Japanese";
	
	// true for homework and undefined for regular
	homeworkStatus = $(gXmlEnable36).find("content").attr("hw");
   $(gXmlEnable36).find("set").shuffle(); // random sets inside activity
	gTotalSetNumber = $(gXmlEnable36).find("set").length; //local variable to hold number set in activity
	var intruction= $(gXmlEnable36).find("instruction").text();
	if (intruction.indexOf("...") > 0 ) {
		var subIntruction = intruction.substring(0, intruction.indexOf("..."));
			subIntruction ='<div id="missingIntruction"><span>' + subIntruction + '...</span><span id="moreClicked">More >></span></div>';
			intruction ='<div id="textInstruction">'+ intruction.replace("...", " ") + '</div>' +subIntruction;
			$("#instructionPanel").html(intruction);
			$("#moreClicked").click(function () {
					$("#missingIntruction").css("display", "none");
					$("#textInstruction").css("display", "block");
					$("#textInstruction").mouseout(function() {
								$("#textInstruction").css("display", "none");
								$("#missingIntruction").css("display", "block");
					});

		
			});
	} else 
			$("#instructionPanel").html(intruction);
	$("#titlePanel").html( $(gXmlEnable36).find("title").text());
    loadSet(); //call initial set in activity.
    var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
          string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
    string += '</div><div class="margin_5 pull-right">&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
    string += '<button class="btn btn_set_value off" id="setText" title="SET">1/' +gTotalSetNumber+'</button></div>';
    $("#setButtons").html(string); //add buttons inside bottom container
 
        $("#prev").click(function () { //load the set when buttons is clicked
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
	
	
	
	
	
	
	
} //end parseXml(t_xml)

	// loading the set for this activity
function loadSet() {
	
	$("#setText").html((gCurrentSet+1) + '/' + gTotalSetNumber);
    $("#submitBtn").css("display", "block"); // display submit button
    $("#notePanel, #passagePanel, #answersPanel").html(""); //reset all panels of activity for each set
	 document.getElementById("answersPanel").style.position = "";
    document.getElementById("answersPanel").style.height = "";
    var mLangDir = $(gXmlEnable36).find("content").attr("rtl");
    if (!(mLangDir)) { //check the rtl attribute exist inside xml or not
		var string = "please add atribute <span style=\"color:#00F\">rtl</span>= <strong>\"false\"</strong> or <strong>\"true\"</strong>";
		    string += " inside content element of xml which uses to identify left to right language or right to left language. Otherwise, this activity maybe not working properly."
        popUpMessage("alert", string);
	}
    var mOptions = $(gXmlEnable36).find("content").attr("options");
    if (!(mOptions)) { // check the options attribute was set inside xml or not
		var string = "please add atribute <span style=\"color:#00F\">options</span> = <strong>\"audio only\"</strong>, <strong>\"text only\"</strong>, <strong>\"audio and text\"</strong>, or <strong>\"video only\"</strong>";
		    string += " inside content element of xml which uses to choose the optional for activity  as like as above options. Otherwise, this activity will have errors and it cannot work."
			popUpMessage("alert", string);
	}
       
    var mSetElem = $(gXmlEnable36).find("set").eq(gCurrentSet);
    $(mSetElem).find("statment").shuffle();
    var mNote = $(mSetElem).find("note").text();
    var mNoteDir = $(mSetElem).find("note").attr("dir");
    $("#notePanel").attr("dir", mNoteDir);
 if (mNote == '')
        $("#notePanel").css('display', 'none');
	//$("#notePanel").html(mNote);
    if (!isJapanese) {
		$("#notePanel").html(mNote);
	}
	else {
		// To display ruby tag
		$("#notePanel").html(displayRubyTag(mNote));
	}
    if (mLangDir == "true")
        $("#notePanel").css({
            "font-size": "16px",
			"padding": "15px"
        });
		
		
      //do "audio and text" option if we chose it 
    if (mOptions.toLowerCase() == "audio and text") {
        var mAudioName = $(mSetElem).find("audio").text();
		 if (!(mAudioName)) { // check the audio element was set inside xml or not
				var string = "please add <span style=\"color:#00F\">\"audio\"</span> element with including audio file name inside the <span style=\"color:#00F\">\"set\"</span> element of xml file because you set ";
		   		 	string += "<span style=\"color:#00F\">options = \"audio and text\"</span>, it is required to have audio file. Otherwise, audio doesn't work. For more info, please the demo xml file for this activity."
					popUpMessage("alert", string);
		}
        var mAudioPlayBtn = document.createElement("img");
        mAudioPlayBtn.setAttribute("alt", "Plays audio");
        mAudioPlayBtn.setAttribute("title", "Plays audio");
        mAudioPlayBtn.className = "playAudioBtn";
        mAudioPlayBtn.setAttribute("src", "images/btn_audio.png");
        if (mLangDir == "true") {
            mAudioPlayBtn.style.left = "799px";

        } else {
            mAudioPlayBtn.style.left = "0px";

        }
        mAudioPlayBtn.onclick = function () {
            loadAud(mAudioName);
        };
        document.getElementById("passagePanel").appendChild(mAudioPlayBtn);
        var mText = document.createElement("div");
        mText.className = "passageText";
		mText.id= "passageText";
        if (mLangDir == "true") {
            mText.style.left = "0px";
            mText.style.fontSize = "18px";

        } else {
            mText.style.left = "93px";
            mText.style.fontSize = "14px";

        }
        mText.setAttribute("dir", $(mSetElem).find("tl_txt").attr("dir"));
        
		//mText.innerHTML = $(mSetElem).find("tl_txt").text();
		if (!isJapanese) {
			mText.innerHTML = $(mSetElem).find("tl_txt").text();
		}
		else {
			// To display ruby tag
			mText.innerHTML = displayRubyTag($(mSetElem).find("tl_txt").text());
		}
		
        document.getElementById("passagePanel").appendChild(mText);
        var mTextHeight = mText.offsetHeight;
        $("#answersPanel").css("top", "40px");
        if (mTextHeight < 240) {
            $(mText).css("height", "240px");
        } else {
           $("#passageText").css({"height":"240px", "padding":"10px 0px 10px 15px", "overflow":"auto"});
            if (mLangDir == "true")
                mAudioPlayBtn.style.left = "800px";
            else
                mAudioPlayBtn.style.left = "0px";

             if (mLangDir == "true")
                mText.style.left = "0px";
            else
                mText.style.left = "94px";
            mText.style.width = "780px";

            $("#passageText").mCustomScrollbar({
               scrollButtons: {
                   enable: true
               },
                theme: "dark-2"
           });
        }

       //do "audio only" option if we chose it 
    } else if (mOptions.toLowerCase() == "audio only") {
		$("#passagePanel").css({
            height: "240px",
            left: "399px",
            top: "83px"
        });
        $("#submitBtnPanel").css("top", "40px");
        var mAudioName = $(mSetElem).find("audio").text();
		 if (!(mAudioName)) { // check the audio element was set inside xml or not
				var string = "please add <span style=\"color:#00F\">\"audio\"</span> element with including audio file name inside the <span style=\"color:#00F\">\"set\"</span> element of xml file because you set ";
		   		 	string += "<span style=\"color:#00F\">options = \"audio only\"</span>, it is required to have audio file. Otherwise, audio doesn't work. For more info, please the demo xml file for this activity."
					popUpMessage("alert", string);
		}
        var mAudioPlayBtn = document.createElement("img");
        mAudioPlayBtn.className = "playAudioBtn";
        mAudioPlayBtn.setAttribute("src", "images/btn_audio.png");
        mAudioPlayBtn.setAttribute("alt", "Plays audio");
        mAudioPlayBtn.setAttribute("title", "Plays audio");
        mAudioPlayBtn.onclick = function () {
            loadAud(mAudioName);
        };
        document.getElementById("passagePanel").appendChild(mAudioPlayBtn);

     //do "video only" option if we chose it 
    } else if (mOptions.toLowerCase() == "video only") {
        $("#passagePanel").css("height", "240px");
        $("#answersPanel").css("top", "40px");
        var mVideoName = $(mSetElem).find("video").text();
		if (!(mVideoName)) { // check the audio element was set inside xml or not
				var string = "please add <span style=\"color:#00F\">\"video\"</span> element with including video file name inside the <span style=\"color:#00F\">\"set\"</span> element of xml file because you set ";
		   		 	string += "<span style=\"color:#00F\">options = \"video only\"</span>. Otherwise, video doesn't work. For more info, please the demo xml file for this activity.";
					popUpMessage("alert", string);
		}
        var mVideoPlayer = document.createElement("video");
        mVideoPlayer.id = "videoPlayer";
        mVideoPlayer.setAttribute("controls", "controls");
        document.getElementById("passagePanel").appendChild(mVideoPlayer);
        if (checkVideoFormat()) {
            var videoUrl = mediaPath + checkVideoFormat() + "/" + mVideoName.split(".")[0] + "." + checkVideoFormat();
            mVideoPlayer.src = videoUrl;
            mVideoPlayer.load();
            mVideoPlayer.play();

        } else {
            document.getElementById("passagePanel").removeChild(document.getElementById("videoPlayer"));
            var mVideoPlayer = document.createElement("div");
            mVideoPlayer.id = "videoPlayer";
            document.getElementById("passagePanel").appendChild(mVideoPlayer);
            loadFlashVideo("mVideoPlayer", mediaPath + "flv/", mVideoName);

        }

    } else { //text only
        var mImageName = $(mSetElem).find("image").text();
		if (!(mImageName)) { // check the audio element was set inside xml or not
				var string = "please add <span style=\"color:#00F\">\"image\"</span> element with including image file name inside the <span style=\"color:#00F\">\"set\"</span> element of xml file because you set ";
		   		 	string += "<span style=\"color:#00F\">options = \"text only\"</span>, it is required to have image to go together with text. Otherwise, image doesn't show up and it will have errors. ";
					string += "For more info, please the demo xml file for this activity.";
					popUpMessage("alert", string);
		}
        var mImage = document.createElement("img");
        mImage.className = "image";
        mImage.setAttribute("src", mediaPath+ "png/" + mImageName);
        if (mLangDir == "true") {
            mImage.style.left = "513px";

        } else {
            mImage.style.left = "0px";

        }
        passagePanel.appendChild(mImage);
        var mText = document.createElement("div");
        mText.className = "passageTextWithImage";
		mText.id = "passageTextWithImage";
		
		
        if (mLangDir == "true") {
            mText.style.left = "0px";
            mText.style.fontSize = "24px";

        } else {
            mText.style.left = "379px";
            mText.style.fontSize = "18px";

        }
         mText.setAttribute("dir", $(mSetElem).find("tl_txt").attr("dir"));

     	// mText.innerHTML = $(mSetElem).find("tl_txt").text();
		if (!isJapanese) {
			mText.innerHTML = $(mSetElem).find("tl_txt").text();
		}
		else {
			// To display ruby tag
			mText.innerHTML = displayRubyTag($(mSetElem).find("tl_txt").text());
		}
        document.getElementById("passagePanel").appendChild(mText);
        var mTextHeight = mText.offsetHeight;
        $("#answersPanel").css("top", "40px");
        if (mTextHeight < 240) {
            $(mText).css("height", "240px");
        } else {
			 $("#passageTextWithImage").css({"height":"240px", "padding":"10px 0px 10px 15px", "overflow":"auto"});			 
            if (mLangDir == "true")
                mImage.style.left = "514px";
            else
                mImage.style.left = "0px";

            if (mLangDir == "true")
                mText.style.left = "0px";
            else
                mText.style.left = "380px";
            mText.style.width = "494px";

            $("#passageTextWithImage").mCustomScrollbar({
                scrollButtons: {
                    enable: true
                },
                theme: "dark-2"
            });
        }
	}
	
	
       //add click event for bold leters
    $("#passagePanel").find("a").each(function () {
            if ($(this).attr("href")) {
				var string = $(this).attr("href").replace("event:", "");
                $(this).click(function () {
                    popUpMessage("hint", string);
                    return false;
                });
            }

        });

     //insert the check box inside div panel
	var mStatementNum = 0;
    var mString = "";
    $(mSetElem).find("statment").each(function () {
        mString += '<div class=\"checkBox\"><div id=\"arrow' + mStatementNum + '\"  class=\"textArrow\"></div><input type=\"checkbox\" id=\"checkBox' + mStatementNum + '\" value=\"';
        mString += $(this).find("txt").attr("crrt") + '\"/><label for=\"checkBox' + mStatementNum + '\" class=\"styleLabel\"><div class="question" id=\"mulpAns' + mStatementNum + '\" >' + $(this).find("txt").text();
		mString += '</div></label><img id=\"why' + mStatementNum + '\"  src="images/bg_btn_why.png" class=\"whyImage\"></div>';
		mStatementNum++;
 });
var answersPanelHeight = Math.round(mStatementNum/2) *65;
    $("#answersPanel").html(mString);
  //  var answersPanelHeight = document.getElementById("answersPanel").offsetHeight;
    document.getElementById("answersPanel").style.position = "relative";
   // document.getElementById("answersPanel").style.height = "130px";
     document.getElementById("answersPanel").style.height = answersPanelHeight+15+"px";
	 //set scrollbar for answers div if it has height greater than 130
    //if (answersPanelHeight > 130) {
       // $("#answersPanel").css("overflow", "auto");
        //$("#answersPanel").mCustomScrollbar({
         //   scrollButtons: {
         //       enable: true
         //   },
         //   theme: "dark-2"
       // });
   // }
      //load the previous answer from user if user chose answers. 
    if (mSetElem.attr("numberTry"))
        postAnswers();
}// end loadSet()

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
function loadFlashVideo(containerTagId, mediaPath, videoName) {
    var flashEmbed = '<embed align="middle" wmode="transparent" src="swf/VideoCaption.swf" ' +
        'flashvars="videoSource=' + videoName + '.flv&amp;' +
        'mediaFilePath='+ mediaPath + 'flv/&amp;fileExt=flv&amp;minimal=true" ' +
        'id="VideoCaption" quality="high" bgcolor="#869ca7" name="VideoCaption" ' +
        'allowscriptaccess="sameDomain" pluginspage="http://www.adobe.com/go/getflashplayer" ' +
        'type="application/x-shockwave-flash"> ';

    $("#" + containerTagId).html(flashEmbed);
} //end loadFlashVideo

  //this method uses to display the popup information
function popUpMessage(type, stringInput) {
	var string = "";
	if (!isJapanese) {
		string = stringInput;
	}
	else {
		// To display ruby tag
		string = displayRubyTag(stringInput);
	}

	$('#closePopup, #closePopupBottom').unbind('click');
 $("#popUpDiv").toggle();
  document.getElementById("bodyPopUpDiv").innerHTML="";
 	 //body Text Popup
    var bodyTextPopUpDiv = document.createElement("div");
	bodyTextPopUpDiv.style.paddingRight="10px";
    bodyTextPopUpDiv.innerHTML= string;
	document.getElementById("bodyPopUpDiv").appendChild(bodyTextPopUpDiv);
	$("#bodyPopUpDiv").mCustomScrollbar({
               scrollButtons: {
                   enable: true
               },
                theme: "dark-2"
           });
		 
	  $("#closePopup").click(function () {
        $("#popUpDiv").hide();
		 okButtonIsClicked(type);
    });
	$("#closePopupBottom").click(function () {
        $("#popUpDiv").hide();
		okButtonIsClicked(type);
    });
	 $("#outSidePopUpDiv").draggable({ handle: "#topPopUpDiv" });
	  $("#titlePopUp").html("");
    if (type == "correct") 
          $("#titlePopUp").html("<img src='images/feedback_correct.png' class='feedbackImage'/>");
	 if (type == "wrong") 
		   $("#titlePopUp").html("<img src='images/feedback_incorrect.png' class='feedbackImage'/>");
	
    if (type == "hint")
       $("#titlePopUp").html("<div class='hintMessage'>HINT</div>");
    
    if (type == "reason")
       $("#titlePopUp").html("<div class='hintMessage'>REASON</div>");

    if (type == "feedback") 
       $("#titlePopUp").html("<div class='hintMessage'>FEEDBACK</div>");
	
    if (type == "alert") 
        $("#titlePopUp").html("<div class='hintMessage'>WARNING MESSAGE!</div>");
	
    if (type == "completed") {
        gTotalStepCompleted = 0;
		 $("#titlePopUp").html("<div class='hintMessage'>ACTIVITY COMPLETED!</div>");
    }
}

  //this function will close the popup if ok button is clicked
function okButtonIsClicked(type) {
    $('.btn').removeAttr('disabled').removeClass('disabled');
	if (gCurrentSet == (gTotalSetNumber-1)) 
		$("#next").attr("disabled", "disabled");
   /* var mSetElem = $(gXmlEnable36).find("set").eq(gCurrentSet);
    if (gTotalStepCompleted < gTotalSetNumber){
		 var mSetElem = $(gXmlEnable36).find("set").eq(gCurrentSet);
		  if ((mSetElem.attr("numberTry") == 3) && (type != "hint")) {
			   if (gCurrentSet < (gTotalSetNumber-1)) {
            			gCurrentSet ++;
						if (gCurrentSet == (gTotalSetNumber-1)) 
						 		$("#next").attr("disabled", "disabled");
           						loadSet();
			   }
		  }
		
	} */
} //end okButtonIsClicked()

  //this function will checks the answers from user when user hit submit button.
function checkAnswers() {
    var numCorrectAnswers = 0;
    var numWrongAnswers = 0;
    var numCorrectAnswersByUser = 0;
	var numWrongAnswersByUser = 0;
    var totalAnswers = 0;
	var answer = ""; // For Homework, collection all the answers from user.
	var context  = ""; // For Homework, collection all the context which base on user answer.
	if ($('input:checkbox:checked').length < 1)
        popUpMessage("alert", "Please select your answers before you try to submit it.");
    else {
		 var mSetElem = $(gXmlEnable36).find("set").eq(gCurrentSet);
        if (mSetElem.attr("numberTry")) {
            var numberTry = parseFloat(mSetElem.attr("numberTry")) + 1;
            mSetElem.attr("numberTry", numberTry);
			mSetElem.attr("answerAttempts", numberTry); // For Homework, set number attempt answer from user.
        } else {
            mSetElem.attr("numberTry", "1");
			mSetElem.attr("answerAttempts", "1"); // For Homework, set number attempt answer from user.
			}
        $('input:checkbox').each(function () {
            totalAnswers++;
            var index = parseFloat($(this).attr('id').replace("checkBox", ""));
			if ($(this).attr('checked')) 
			  answer +=  $("#mulpAns" + index).html() + "\n"; // For Homework, collection all the answers from user.
			if ($(this).val().toLowerCase() == "true") {
                $("#arrow" + index).html("&rarr;");
                numCorrectAnswers++;
				context +=  $("#mulpAns" + index).html() + " -- " + $(this).val()+ "\n"; // For Homework, collection all the context which base on user answer.
                if ($(this).attr('checked')) 
                   	 numCorrectAnswersByUser++;
                
            } else{
                	numWrongAnswers++;
					 if ($(this).attr('checked')) 
                    		numWrongAnswersByUser++;
				
			}

            var mStatmentElem = $(mSetElem).find("statment").eq(index);
            $("#why" + index).click(function () {
                var string = $(mStatmentElem).find("terminal_fdbk").text();
                popUpMessage("hint", string);
            });
            if ($(this).attr('checked')) {
                $(mStatmentElem).attr('userAnswer', "true")
            } else
                $(mStatmentElem).attr('userAnswer', "false")
        }); //end each
		
			//user are chose correct answers or missing all three times.
		if (((numCorrectAnswers == numCorrectAnswersByUser)  && (numWrongAnswersByUser==0))|| (mSetElem.attr("numberTry") == 3)) {
            gTotalStepCompleted++;
            if ((numCorrectAnswers == numCorrectAnswersByUser)  && (numWrongAnswersByUser==0)) {
                mSetElem.attr("numberTry", "3");
				if (checkNumberSetNotCompleted() != "")
		    			popUpMessage("correct", checkNumberSetNotCompleted());
				else
                popUpMessage("correct", "This set is completed. Now, it is the time to move the next set. Review the answer click on <strong>Prev</strong> button and then click on <strong>Why?</strong> buttons next to answer to read justifications of each answer. Also, the correct answer are showed with green arrow ( <span style=\"color:#090; font-size:18px; font-weight:bold;\">&rarr;</span> ) next to the answer.");
            } else
			if (checkNumberSetNotCompleted() != "")
		    			popUpMessage("wrong", checkNumberSetNotCompleted());
				else
                popUpMessage("wrong", "This set is completed. Now, it is the time to move the next set.  Review the answer click on <strong>Prev</strong> button and then click on <strong>Why?</strong> buttons next to answer to read justifications of each answer. Also, the correct answer are showed with green arrow ( <span style=\"color:#090; font-size:18px; font-weight:bold;\">&rarr;</span> ) next to the answer.");
            $(".textArrow").css("visibility", "visible");
            $(".whyImage").css("display", "block");
            $("#submitBtn").css("display", "none");
            $('input:checkbox').attr('disabled', true);
        } else {
            if (mSetElem.attr("numberTry") == 1) {
                var string = "Please select your answers carefully.<br/> These answers have as following:<strong><br/>";
                string += numWrongAnswers + '</strong> <span style=\"color:#F00\">incorrect answers</span><br/><strong>';
                string += numCorrectAnswers + '</strong> <span style=\"color:#00F\">correct answers</span>.<br/>';
                string += $(mSetElem).find("first_hint").text();
                popUpMessage("wrong", string);
            }
            if (mSetElem.attr("numberTry") == 2) {
                var string = $(mSetElem).find("second_hint").text() + "<br/>";
                $(mSetElem).find("statment").each(function () {
                    string += $(this).find("intermediate_fdbk").text() + "<br/>";
                });
                popUpMessage("wrong", string);
            }

        }
			//For Homework
		if (homeworkStatus) {
				var questionID = gCurrentSet;
				var answerAttempts = mSetElem.attr("answerAttempts");
					alert("questionID: "+ questionID + "\nUser Answer:\n"+answer + "\nContext:\n"+ context+ "\nUser Attempts: "+answerAttempts);
				// To pass logs
			context = context.replace(/\n/gi, "<br/>"); 
			answer = answer.replace(/\n/gi, "<br/>"); 
			logStudentAnswer(questionID, answer, context);
			logStudentAnswerAttempts(questionID, answerAttempts);
		}
	 } //end top else
} //end checkAnswers()

	//this function is used to post the user choosing answers.
function postAnswers() {
    var mSetElem = $(gXmlEnable36).find("set").eq(gCurrentSet);
    var mStatementNum = 0;
    $(mSetElem).find("statment").each(function () {
        if ($(this).attr('userAnswer') == "true")
            $("#checkBox" + mStatementNum).attr('checked', true);
        mStatementNum++;

    });
    $('input:checkbox').each(function () {
        var index = parseFloat($(this).attr('id').replace("checkBox", ""));
        if ($(this).val().toLowerCase() == "true")
            $("#arrow" + index).html("&rarr;");
        var mStatmentElem = $(mSetElem).find("statment").eq(index);
        $("#why" + index).click(function () {
            var string = $(mStatmentElem).find("terminal_fdbk").text();
            popUpMessage("hint", string);
        });

    }); //end each
    if (mSetElem.attr("numberTry") == 3) {
        $(".textArrow").css("visibility", "visible");
        $(".whyImage").css("display", "block");
        $("#submitBtn").css("display", "none");
        $('input:checkbox').attr('disabled', true);
    }
} //end postAnswers() 
function checkNumberSetNotCompleted() {
	 if (gTotalStepCompleted >= gTotalSetNumber)
        return "The activity is completed.";
	  else {
			if ( gCurrentSet == (gTotalSetNumber-1)) {
					var i=1;
					var numCompleted =0;
					var string="This set is completed. Review your answer click on <strong>Why?</strong> buttons next to answer to read justifications of each answer. Also, the correct answer are showed with green arrow ( <span style=\"color:#090; font-size:18px; font-weight:bold;\">&rarr;</span> ) next to answer. However, some of the sets still need to finish before this activity is completed. Remember that you have three times to submit your answer. Here is the set which needs to finish: ";
					$(gXmlEnable36).find("set").each(function(){
							if ($(this).attr("numberTry") != 3) 
									string += i + "/"+ gTotalSetNumber + ", ";
							i++;
		
					});
				  return string.substring(0,string.lastIndexOf(",")) + ".";
			} else
	   			  return "";
	  }
}

