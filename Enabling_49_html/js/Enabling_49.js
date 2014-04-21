//global vars
var activityItems = new Array();
var totalSets = 0;
var SetsCompleted=0;
var currentSet=0;
//var itemTotal = 0;
var itemXML;
var xml;
var feedbackOkIsClicked;
var initialIndex;


//init and load files
$(document).ready(function() 
{
	if (window.location.protocol.indexOf("file") >= 0)
	{
		localPath = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
	}
	$('#feedback').hide();

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

	// Set navigation
	var setButtons = document.createElement("div");
	setButtons.id = "setButtons";
	var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
	string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
	string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setTitle" title="SET">SET:</button>';
	string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button></div>';
	setButtons.innerHTML=string;
	document.getElementById('container_setDiv').appendChild(setButtons);

	cssFilename = "styles/Enabling_49_default.css"; // used in dli_activity.js

	// Values from URL parameters or default values for testing
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_49_default.css";
	xmlFilename = mediaPath +  "Enabling_49_noNamespaces.xml";
	jsonFilename = mediaPath + "Enabling_49_noNamespaces.js";
/*	
	var statusParameters = getPassedParameters();
	if (!statusParameters) 
	{
		mediaPath = "sampleData/";
		cssFilename = "styles/Enabling_49_default.css";
		xmlFilename = mediaPath +  "Enabling_49_noNamespaces.xml";
		jsonFilename = mediaPath + "Enabling_49_noNamespaces.js";
	}
	else 
	{
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');

		if (activityID.length < 2 ) 
		{
			activityID =+ "0" + activityID;
		}
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
	}
*/
	
	$("#setButtons").append('<div style="float:left"><img id="feedbackImage" src="../common/img/feedback_correct.png" /></div>');
	$("#setButtons").append('<div class="btn-group pull-right off"><button class="btn btn_set off" id="foundDiv" title="FOUND" style="padding-right: 21px;">Found:</button><button class="btn btn_set_value off" id="foundText" title="FOUND">0/0</button></div>');

	loadActivity(parseXml);
	document.getElementById('playBtn').onclick = playAudio;
}); // end (document).ready()

// For homework
var homeworkStatus;


// To display ruby tag
var isJapanese = false;
//parse xml
function parseXml(t_xml)
{
	xml = t_xml;
	numSets = $(xml).find("set").length;
	totalSets = numSets;
	initializeSets($(xml).find("set").length, function() {
		loadSet(0);
	});

	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	// To display ruby tag
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
    
	$("#prev").click(function () 
	{ 
		currentSet --;

		//load the set when buttons is clicked
		if (typeof holdTimeout != 'undefined') clearTimeout(holdTimeout);
		$('#feedback').hide();

     	if((document.getElementById('videoPlayer')) && !(document.getElementById('videoPlayer').paused))
        	document.getElementById('videoPlayer').pause(); 
     	if ($("#next").attr("disabled")) $("#next").removeAttr("disabled");
		if (currentSet == 0) $(this).attr("disabled", "disabled");
		loadSet();
	}); // end ("#prev").click()

    $("#next").click(function () 
    { 
		currentSet++;
		//load the set when buttons is clicked
		if (typeof holdTimeout != 'undefined') clearTimeout(holdTimeout);
		if((document.getElementById('videoPlayer')) && !(document.getElementById('videoPlayer').paused))
			document.getElementById('videoPlayer').pause(); 

    	$('#feedback').hide();
    
     	if ($("#prev").attr("disabled")) $("#prev").removeAttr("disabled");
		if (currentSet == (totalSets-1)) $(this).attr("disabled", "disabled");
		loadSet();
    }); // END ("#next").click()
}

function initializeSets(setCount, callback)
{
	for (var i = 0; i < setCount; i++)
	{
		var thisSet = $(xml).find("set")[i];
		var activityItem = new ActivityItem(thisSet, i);
		activityItems.push(activityItem);
	}

	shuffleArray( activityItems );
	if (typeof callback == "function") callback();
}

//load the set
function loadSet()
{
	//var mVideoPlayer = document.getElementById('videoPlayer');
	//document.getElementById('flashPlayer').style.display="none";
	$("#feedbackImage").hide();
	$("#foundText").html("{0}/{1}".format(activityItems[currentSet].successCount, activityItems[currentSet].totalToMatch()));

	setXml = $(xml).find("set").eq(currentSet);
	var phraseHTML = activityItems[currentSet].getPhraseHTML();
	$("#phraseText").html(phraseHTML);
	$("#phraseText").removeClass("phraseText_ltr phraseText_rtl");
	$("#phraseText").addClass("phraseText_{0}".format(activityItems[currentSet].textDirection));

	if (activityItems[currentSet].successCount == activityItems[currentSet].tiles.length)
	{
		$(function () {
			$(".phraseLetter").css("text-decoration", "none");
		    $('.phraseLetter').on("click", function (e) {
		        e.preventDefault();
		    });
		});						
	}

	var tilesHMTL = activityItems[currentSet].getTileHTML();
	$("#letterTiles").html(tilesHMTL);
	$('.tileLetter').hover(
	    function(){
	      var $this = $(this);
	      $this.data('bgcolor', $this.css('background-color')).css('background-color', '#E0DEDE');
	    },
	    function(){
	      var $this = $(this);
	      $this.css('background-color', $this.data('bgcolor'));
	    }
	  );   


	if (currentSet == 0) 
	{
		$("#prev").attr("disabled", "disabled");
	}
	else
	{
		if ($("#prev").attr("disabled")) $("#prev").removeAttr("disabled");
	} 

	$("#englishPhrase").html(activityItems[currentSet].title);
	$("#setText").html((currentSet+1) + '/' + totalSets);  
	var tileCount = activityItems[currentSet].tiles.length;
   
}

// To pass logs
// logStudentAnswer(questionID, userAnswer, context);
// logStudentAnswerAttempts(questionID, parseInt(finalScore));

//audio
function playAudio()
{
	loadAud(activityItems[currentSet].audio);
}

//feedback
function showFeedback(value, text)
{
	switch(value)
	{
		case "incorrect":
			$("#feedbackImage").attr("src", "../common/img/feedback_incorrect.png");
		break;
		case "correct":
			$("#feedbackImage").attr("src", "../common/img/feedback_correct.png");
		break;
		case "set_completed":
			if (SetsCompleted < totalSets)
			{
				$('#feedback').show();
				$("#feedbackHeader").html("Set Completed!");
				$("#feedbackText").html("");
			}
		break;
	}
	$("#feedbackImage").show();

	if (SetsCompleted == totalSets)
	{
    	holdTimeout= setTimeout(function()
    	{
	        if(parent.activityCompleted)
	        	parent.activityCompleted(1,0);
	        else 
	        {
				$('#feedback').show();
				$("#feedbackHeader").html("Activity Completed!");
				$("#feedbackText").html("");
	        }
		}, 3000);
    }  
}

function closeFeedback()
{

	$('#feedback').hide();
	var setXml = $(xml).find("set").eq(currentSet);
	var content= $(xml).find("content").eq(0);
	//check all sets complete
	if (SetsCompleted == totalSets)
	{
		if(parent.activityCompleted)
			parent.activityCompleted(1,0);
		else 
		{
			$('#feedback').show();
			$("#feedbackHeader").html("Activity Completed!");
			$("#feedbackText").html("");
		}
	}
}
   
var holdTimeout;
