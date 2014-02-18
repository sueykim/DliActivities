var currentPhoneNumber;
var currentCallAudio;
//var g_FlashInstalled = false;

$(document).ready(function () {
	var ua = navigator.userAgent.toLowerCase()
	if (!g_iPod)
	  g_iPod = ua.indexOf('iphone') >= 0
	if (!g_iPod)
	  g_iPod = ua.indexOf('ipod') >= 0
	if (!g_iPod)
	  g_android = ua.indexOf('android') >= 0
	  
	var audioTag = document.getElementById("audioPlayer");
	if(audioTag && audioTag.canPlayType &&
		audioTag.canPlayType('audio/mpeg')){
		g_html5_audio = true;
		//document.title = "Audio found."
	}

	
	//g_FlashInstalled = DetectFlashVer(6, 0, 65);

	loadFlashPlayer();

	
	if(g_html5_audio){
		loadAudioTagPlayer();
	}

	loadEmbedPlayer();

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_14a_default.css";
	xmlFilename = mediaPath + "MobilePhone.xml";
	jsonFilename = mediaPath + "MobilePhone.js";
	
	loadActivity(parseXml);
});

var xml;
function parseXml(t_xml)
{
	xml = t_xml;
	
	numSets = $(xml).find("item").length;
	
	//Load digits
	var tally = 0;
	$(xml).find("digit").each(function(){
		document.getElementById("digit" + tally).innerHTML = $(this).attr("english");
		tally++;
	});
	
    loadSet(currentSet);
}


function digitPressed(value){
	var str = document.getElementById('displayText').innerHTML;
	
	if(str.length < 15){
		var digitXml = $(xml).find("digit").eq(value);
		
		audio_play( mediaPath + 'mp3/' + digitXml.attr("audio") );
	
		document.getElementById('displayText').innerHTML = str + value;
	}
}

function delClicked(){
	var str = document.getElementById('displayText').innerHTML;
	
	if(str.length > 0){
		document.getElementById('displayText').innerHTML = str.substr(0, str.length - 1);
	}
}

function playCall(){
	audio_play(mediaPath + 'mp3/' + currentCallAudio);
}

var timeoutID;
var copyOfText;
var btnLock;

function callPressed(){
	var str = document.getElementById('displayText').innerHTML;
	btnLock = true;
	
	if(str == currentPhoneNumber){
		copyOfText = str;
		
		document.getElementById('displayText').innerHTML = "Correct!";
		
		timeoutID = window.setTimeout(correctTimerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
		
		$(itemXml).attr('completed', "true");
		
		//check for all completed
		var completed = true;
		$(xml).find("item").each(function(){
			if($(this).attr("completed") != "true"){
				completed = false;
			}
		});
		
		if(completed){			
			//Check to see if we're in Gateway
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}else{
				alert("Activity Completed");
			}
		}else{
			//alert("incomplete");
		}
	}else{
		copyOfText = str;
		
		document.getElementById('displayText').innerHTML = "Incorrect";
		
		timeoutID = window.setTimeout(timerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
	}
}


function correctTimerEnd(){
	document.getElementById('displayText').innerHTML = copyOfText;
	
	$(itemXml).attr('audio');
	
	document.getElementById('clickGuard').style.display = "block";
	btnLock = false;
}

function timerEnd(){
	document.getElementById('displayText').innerHTML = copyOfText;
	
	document.getElementById('clickGuard').style.display = "none";
	
	btnLock = false;
}

function nextClick(){
	if(btnLock)
		return;
		
	if(currentSet != numSets - 1){
		//Save the scratch text
		itemXml.attr("scratchText", document.getElementById("scratchText").value);
		itemXml.attr("tempDisplayValue", document.getElementById("displayText").innerHTML);
	
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(btnLock)
		return;
	
	if(currentSet != 0){
		//Save the scratch text
		itemXml.attr("scratchText", document.getElementById("scratchText").value);
		itemXml.attr("tempDisplayValue", document.getElementById("displayText").innerHTML);
		
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;
var numSets = 0;
var itemXml;

function loadSet(value){
	currentSet = value;
	
	
	document.getElementById('setText').innerHTML = (currentSet + 1) + "/" + numSets;
	
	itemXml = $(xml).find("item").eq(currentSet);
	
	//Load the scratch text
	if(itemXml.attr("scratchText")){
		document.getElementById("scratchText").value = itemXml.attr("scratchText");
	}else{
		document.getElementById("scratchText").value = "Scratch Text Area";
	}
	
	
	//Grey out the next or prev buttons if necessary

	if(currentSet == 0){
		document.getElementById("prevBtnClickGuard").style.display = "block";
	}else{
		document.getElementById("prevBtnClickGuard").style.display = "none";
	}
	
	if(currentSet == numSets - 1){
		document.getElementById("nextBtnClickGuard").style.display = "block";
	}else{
		document.getElementById("nextBtnClickGuard").style.display = "none";
	}
	
	currentPhoneNumber = $(itemXml).attr('english');
	currentCallAudio = $(itemXml).attr('audio');
	
	loadTlPhoneNum();
	
	if($(itemXml).attr('completed') == "true"){
		document.getElementById('clickGuard').style.display = "block";
		document.getElementById('displayText').innerHTML = currentPhoneNumber;
	}else{
		document.getElementById('clickGuard').style.display = "none";
		
		//Load display numbers
		if(itemXml.attr("tempDisplayValue")){
			document.getElementById("displayText").innerHTML  = itemXml.attr("tempDisplayValue");
		}else{
			document.getElementById("displayText").innerHTML  = "";
		}
	}
}



var g_html5_audio = false;

var g_android = false;
var g_iPod = false;

function loadFlashPlayer(){
	if(!document.getElementById("flashAudioPlayer")){
		var flashAudioPlayerDiv = document.getElementById("flashAudioPlayerDiv");
			
		if(navigator.appName.toLowerCase().indexOf("explorer") != -1){
			flashAudioPlayerDiv.innerHTML = '<object data="audioPlayer.swf" type="application/x-shockwave-flash" ' +
		    	'style="width: 0px; height: 0px;" id="flashAudioPlayer">' +
				    '<param value="audioPlayer.swf" name="movie">' +
				    '<param value="transparent" name="wmode">' +
				    '<param name="allowScriptAccess" value="always">' +
				'</object>';
		}else{
			flashAudioPlayerDiv.innerHTML = '<embed align="middle" width="0" height="0" type="application/x-shockwave-flash" ' + 
				'pluginspage="http://www.adobe.com/go/getflashplayer" allowscriptaccess="sameDomain" ' + 
				'name="audioPlayer" bgcolor="#869ca7" quality="high" id="flashAudioPlayer" ' + 
				'src="audioPlayer.swf"></embed>';
		}
	}
}

function loadTlPhoneNum(){
    var out = "";

    for(var i=0; i<currentPhoneNumber.length; i++){
        var ch = currentPhoneNumber.substr(i,1);
        var tl_ch = $(xml).find("digit[english='" + ch  + "']");
        out = out + $(tl_ch).text();
    }

    $("#tl_phoneNum").text(out);
}


function loadAudioTagPlayer(){
	if(!document.getElementById('audioPlayer')){
		var htmlAudioPlayerDiv = document.getElementById("htmlAudioPlayerDiv");
		
		htmlAudioPlayerDiv.innerHTML = '<audio id="audioPlayer" width="0" height="0" autoplay></audio>';
	}
}

function loadEmbedPlayer(){
	if(document.getElementById("id_embed_player")){
		var embeddedAudioPlayerDiv = document.getElementById("embeddedAudioPlayerDiv");
		
		embeddedAudioPlayerDiv.innerHTML = '<embed id="id_embed_player" scale="1" target="myself" type="audio/mpeg" enablejavascript="true" ' + 
		    'postdomevents="true" showlogo="true" controller="true" bgcolor="gray" ' +
		    'style="width: 0px; height: 0px;"  autoplay="true"  ></embed> ' ;
	}
}

function playFlashAudio(URL){
	//Android seems to work better with Flash than HTML5
  	//So use it when available.
  	
  	var flashAudioPlayer = document.getElementById("flashAudioPlayer");
  	
  	if(flashAudioPlayer && flashAudioPlayer.setAudioFromJS){
  		flashAudioPlayer.setAudioFromJS(URL);
  		return true;
	}else{
		//something is wrong with the External interface call so fallback by
		//going to the next in the list
		return false;
	}
}

function playHTMLAudio(URL){
	document.getElementById('audioPlayer').src = URL;
	return true; //todo - Right now there is not way to verify that it will be played		
}

var g_force_player = false;

function audio_play( URL )
{
	if(g_force_player){
		switch(g_force_player){
			case "flash":
				playFlashAudio(URL);
				return;
			case "html":
				playHTMLAudio(URL);
				return;
		}
	}
	
	if(g_android){
		if(playFlashAudio(URL)){
			return;
		}
	} 

	if (g_html5_audio){
		if(playHTMLAudio(URL)){
			return;
		}
	} 

	//Attempt to play using Flash
	if(playFlashAudio(URL)){
		return;
	}

	if (g_android){
	    window.document.location.href = URL
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
