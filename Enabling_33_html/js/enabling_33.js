
//global vars
var stringObj = new Object();
var totalSets = 0;
var currentItem = 0;
var currentVideo = "";
var itemTotal = 0;
var totalClicked = 0;
var itemXML;

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

//init and load files
$(document).ready(function() {
	audioInit();
	$('#feedback').hide();

        cssFilename = "css/enabling_33_default.css";
        // Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
    	   mediaPath = "library/";
    	   cssFilename = "css/enabling_33_default.css";
    	   xmlFilename = mediaPath + "enabling33_writingCharacters.xml";
    	   jsonFilename = mediaPath + "enabling33_writingCharacters.js";
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

	loadCanvas();

	testVideoSupport();
//	document.getElementById('playBtn').onclick = loadVideo;

}); 

//parse xml
function parseXml(t_xml){
	xml = t_xml;
	numSets = $(xml).find("set").length;
	totalSets = numSets;
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");

	loadSet(0);
}

//load the set
function loadSet(value){
	var matchText = "";
	var targetWord = "";
	var stringArray = new Array();
	
	currentSet = value;
	setCompletedShown = false;
	//updateSetText();
	
	setXml = $(xml).find("set").eq(currentSet);
	
	itemTotal = $(setXml).find("item").length;
//	 var mVideoPlayer = document.createElement("video");
//        mVideoPlayer.id = "videoPlayer";
//        document.getElementById("videoContainer").appendChild(mVideoPlayer);
      document.getElementById("playBtn").style.display="none";

		//find and add english word + div
		for (var i = 0; i < itemTotal; i++) {
				itemXML = $(setXml).find("item").eq(currentItem);
				$(itemXML).find("en_word").each(function(){
				var t =($(this).text());
				stringObj.en_word = t;

				//find and add video file to object
				$(itemXML).find("tl_word").each(function(){
					var t = ($(this).attr("video"));
					currentVideo = t;

				})
				
				var tc = document.createElement("div");
				tc.innerHTML = t;
				tc.data = currentVideo;
				tc.clicked = false;
				tc.className = "video_button";
				document.getElementById("contentEn").appendChild(tc);

				tc.onclick = function() {
					currentVideo = tc.data;
					playVideo(currentVideo);
					tc.style.backgroundColor = "#f0f0f0";
					
				}
				currentItem++;
				
			})
		}
			$("#contentEn").mCustomScrollbar();
}

//new play Video
function playVideo(VideoName){
	var file_video = VideoName.indexOf('.')<0 ? currentVideo: VideoName;

	//alert('currentVideo: ' + currentVideo) ;
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideo(mediaPath, file_video);
	document.getElementById("playBtn").style.display="block";
	document.getElementById("playBtn").onclick= function(){playVideo(currentVideo);}
	// For homework
	if (homeworkStatus) {
		sendHWdata(file_video);
	}
}


//video
/*
function playVideo(mVideoName){
	var mVideoPlayer= document.getElementById("videoPlayer")
	  if (checkVideoFormat()) {
            var videoUrl = mediaPath + checkVideoFormat() + "/" + mVideoName.split(".")[0] + "." + checkVideoFormat();
            mVideoPlayer.src = videoUrl;
			mVideoPlayer.style.width="320px";
			mVideoPlayer.style.height="240px";
            mVideoPlayer.load();
            mVideoPlayer.play();
			document.getElementById("playBtn").style.display="block";
				document.getElementById("playBtn").onclick= function () {
					var mVideoPlayer= document.getElementById("videoPlayer");
					var videoUrl = mediaPath + checkVideoFormat() + "/" + mVideoName.split(".")[0] + "." + checkVideoFormat();
				
            			mVideoPlayer.src = videoUrl;
            			mVideoPlayer.load();
           				mVideoPlayer.play();
				
				}

        } else {
            document.getElementById("videoContainer").removeChild(document.getElementById("videoPlayer"));
            var mVideoPlayer = document.createElement("div");
            mVideoPlayer.id = "videoPlayer";
            document.getElementById("videoContainer").appendChild(mVideoPlayer);
            loadFlashVideo("videoPlayer", mediaPath + "flv/", mVideoName);
			document.getElementById("playBtn").style.display="block";
			document.getElementById("playBtn").onclick= function () {
					 loadFlashVideo("videoPlayer", mediaPath + "flv/", mVideoName);
				}

        }
        // For homework
	if (homeworkStatus) {
		sendHWdata(mVideoName);
	}
	
} */

// For homework
function sendHWdata(mVideoName){
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";

	answerAttemptsNum++;

	questionID = mVideoName.toString();
	answer = "--";
	context = "--";
	answerAttempts = answerAttemptsNum.toString();
	
	// To see attempts - temp
	//$("#feedbackText").html("Homework//answerAttempts: " + answerAttempts);
	
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	//$('#feedbackText').show();
}

function loadCanvas(){
	
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var sketch = document.querySelector('#sketch');
	canvas.width = 539;
	canvas.height = 400;
	
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	// Pencil Points
	var ppts = [];
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 6;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'black';
	tmp_ctx.fillStyle = 'black';
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);

		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		onPaint();
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);

		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		// Emptying up Pencil Points
		ppts = [];
	}, false);
	
	var onPaint = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		if (ppts.length < 3) {
			var b = ppts[0];
			tmp_ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		tmp_ctx.beginPath();
		tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		tmp_ctx.stroke();

	};
	
	document.getElementById('brushXsm').onclick = function() {
		tmp_ctx.lineWidth = 6;
	};
	document.getElementById('brushSm').onclick = function() {
		tmp_ctx.lineWidth = 10;
	};
	document.getElementById('brushMd').onclick = function() {
		tmp_ctx.lineWidth = 16;
	};
	document.getElementById('brushLg').onclick = function() {
		tmp_ctx.lineWidth = 22;
	};
	document.getElementById("erase").onclick = function() {
		ctx.clearRect(0, 0, 539, 400);
	};
};



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

function closeFeedback(){
	$('#feedback').hide();
	$('.pinned').remove();
	loadSet(currentSet);
	updateSetText();
}

var setCompletedShown = false;
var activityCompletedShown = false;

function checkVideoFormat() {
	var html5VideoMimeTypes = new Array("video/mp4", "video/ogg",  "video/webm");
    var html5VideoTypes = new Array("mp4", "ogv", "webm");
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
        'mediaFilePath=' + mediaPath + '&amp;fileExt=flv&amp;minimal=true" ' +
        'id="VideoCaption" quality="high" bgcolor="#869ca7" name="VideoCaption" ' +
        'allowscriptaccess="sameDomain" pluginspage="http://www.adobe.com/go/getflashplayer" ' +
        'type="application/x-shockwave-flash"> ';

    $("#" + containerTagId).html(flashEmbed);
} //end loadFlashVideo