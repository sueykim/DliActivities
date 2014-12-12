var g_html5_audio = false;
var g_android = false;
var g_iPod = false;
var g_ie = false;
var g_safari_iPad = false

function audioInit(index){
	if(index == undefined){
		index = ""
	}	
	
	var ua = navigator.userAgent.toLowerCase()
	if (!g_iPod)
	  g_iPod = ua.indexOf('iphone') >= 0
	if (!g_iPod)
	  g_iPod = ua.indexOf('ipod') >= 0
	if (!g_iPod)
	  g_android = ua.indexOf('android') >= 0
	if(!g_iPod)
	  g_ie = window.ActiveXObject ? true: false;
	if (!g_safari_iPad)
	    g_safari_iPad = (ua.indexOf('ipad') >= 0) && (ua.indexOf('safari') >= 0)

	loadAudioTagPlayer(undefined, index);
	loadFlashPlayer(index);
	loadEmbedPlayer(index);

	//Todo - expand this to intelligently include all the various types
	var audioTag = document.getElementById("audioPlayer" + index);
	if(audioTag && audioTag.canPlayType &&
		(audioTag.canPlayType('audio/mpeg') ||
		audioTag.canPlayType('audio/ogg') == "maybe" || 
		audioTag.canPlayType('audio/ogg') == "true") ){
		g_html5_audio = true;
		//document.title = "Audio found."
//alert("g_ie=" + g_ie);
	}
}

function loadFlashPlayer(index){
	if(index == undefined){
		index = ""
	}
	
	if(!document.getElementById("flashAudioPlayer" + index)){
		var flashAudioPlayerDiv = document.getElementById("flashAudioPlayerDiv" + index);
		if(navigator.appName.toLowerCase().indexOf("explorer") != -1){
			flashAudioPlayerDiv.innerHTML = '<object data="../common/audioPlayer.swf" type="application/x-shockwave-flash" ' +
		    	'style="width: 0px; height: 0px;" id="flashAudioPlayer' + index + '">' +
				    '<param value="../common/audioPlayer.swf" name="movie">' +
				    '<param value="transparent" name="wmode">' +
				    '<param name="allowScriptAccess" value="always">' +
				'</object>';
		}else{
			flashAudioPlayerDiv.innerHTML = '<embed align="middle" width="0" height="0" type="application/x-shockwave-flash" ' + 
				'pluginspage="http://www.adobe.com/go/getflashplayer" allowscriptaccess="sameDomain" ' + 
				'name="audioPlayer" bgcolor="#869ca7" quality="high" id="flashAudioPlayer' + index + '" ' + 
				'src="../common/audioPlayer.swf"></embed>';
		}
	}
}

function loadAudioTagPlayer(force, index){
	if(index == undefined){
		index = ""
	}
	
	if(!document.getElementById('audioPlayer' + index) || force){
		var htmlAudioPlayerDiv = document.getElementById("htmlAudioPlayerDiv" + index);
		
		htmlAudioPlayerDiv.innerHTML = '<audio id="audioPlayer' + index + '" width="0" height="0" ></audio>';
	}
}

function loadEmbedPlayer(index){
	if(index == undefined){
		index = ""
	}

	if(document.getElementById("id_embed_player" + index)){
		var embeddedAudioPlayerDiv = document.getElementById("embeddedAudioPlayerDiv" + index);
		
		embeddedAudioPlayerDiv.innerHTML = '<embed id="id_embed_player' + index + '" scale="1" target="myself" type="audio/mpeg" enablejavascript="true" ' + 
		    'postdomevents="true" showlogo="true" controller="true" bgcolor="gray" ' +
		    'style="width: 0px; height: 0px;"  autoplay="true"  ></embed> ' ;
	}
}

function playFlashAudio(URL, index){
	if(index == undefined){
		index = ""
	}
	
	//Android seems to work better with Flash than HTML5
  	//So use it when available.
  	
  	var flashAudioPlayer = document.getElementById("flashAudioPlayer" + index);
  	
  	if(flashAudioPlayer && flashAudioPlayer.setAudioFromJS){
  		flashAudioPlayer.setAudioFromJS(URL);
  		return true;
	}else{
		//something is wrong with the External interface call so fallback by
		//going to the next in the list
		return false;
	}
}

function playHTMLAudio(URL, index){
	if(index == undefined){
		index = ""
	}
	
	document.getElementById('audioPlayer' + index).src = URL;
	document.getElementById('audioPlayer' + index).play();
	return true; //todo - Right now there is not a way to verify that it will be played		
}

var g_dontStart = false;

function playHTMLAudioWithSources(filenameMinusExt, mediaDir, index, disableSubDirectories){
	if(index == undefined){
		index = ""
	}
	
	var mp3Dir = "mp3/"
	var oggDir = "ogg/"
	
	if(disableSubDirectories != undefined &&
			disableSubDirectories == true){
		mp3Dir = ""
		oggDir = ""
	}

    if (!g_safari_iPad) {
		loadAudioTagPlayer(true, index);
    }
	
	var htmlAudioPlayer = document.getElementById('audioPlayer' + index);
	
	htmlAudioPlayer.innerHTML = ""; 
	//alert(htmlAudioPlayer.canPlayType('audio/mpeg'))
	var sourceList = "";	
    var sourceURL = "";
	if(htmlAudioPlayer.canPlayType('audio/mpeg') == "true" || 
		htmlAudioPlayer.canPlayType('audio/mpeg') == "maybe" ){
		sourceList = sourceList + '<source src="' + mediaDir + mp3Dir
					+ filenameMinusExt + '.mp3' + '" type="audio/mpeg">';
	}
	
	if(htmlAudioPlayer.canPlayType('audio/ogg') == "true" || 
		htmlAudioPlayer.canPlayType('audio/ogg') == "maybe" ){
		sourceList = sourceList + '<source src="' + mediaDir + oggDir
					+ filenameMinusExt + '.ogg' + '" type="audio/ogg">';
	}

    //safari on IPad you have to change the src attr espcially if you have addeventlistner('ended', ) ex: enabling_08
    if (g_safari_iPad || g_ie)
    {
       sourceURL = mediaDir + mp3Dir + filenameMinusExt + '.mp3';
    }
     

	//alert(sourceList);
	if(g_ie){
       //var url = mediaDir + mp3Dir + filenameMinusExt + '.mp3';
       //playHTMLAudio(url);
       playHTMLAudio(sourceURL, index);
	}else{
       if (g_safari_iPad) {
           //alert('safari on ipad')
           //htmlAudioPlayer.innerHTML = "";
           htmlAudioPlayer.src = "";
           try {
               htmlAudioPlayer.src = sourceURL; //"http://hs3.lingnet.org/Staging_Html/hs2html/course/content/tagalog/media/ta_01_08_15/mp3/ta_burn.mp3";
               htmlAudioPlayer.load();
           }
           catch (e) {
               alert(e);
           }
       }
       else {
           //alert('html other')
           //alert(sourceList);
		htmlAudioPlayer.innerHTML = sourceList; 
       }
		 
		
		if(g_dontStart == false){
			htmlAudioPlayer.play();
		}
	}
	return true; //todo - Right now I know of no way to verify that it will be played		
}

var g_force_player = false;

function audio_play_file(filenameMinusExt, mediaDir, index, disableSubDirectories){
	if(index == undefined){
		index = ""
	}
	
	var mp3Dir = "mp3/"
	var oggDir = "ogg/"
	
	if(disableSubDirectories != undefined &&
			disableSubDirectories == true){
		mp3Dir = ""
		oggDir = ""
	}else{
		disableSubDirectories = false
	}
	
	if(g_force_player){
		switch(g_force_player){
			case "flash":
				playFlashAudio(mediaDir + mp3Dir + filenameMinusExt + ".mp3", index);
				return;
			case "html":
				playHTMLAudioWithSources(filenameMinusExt, mediaDir, index, disableSubDirectories);
				return;
		}
	}
	
	if(g_android){
		if(playFlashAudio(mediaDir + mp3Dir + filenameMinusExt + ".mp3", index)){
			return;
		}
	} 

	if (g_html5_audio){
		if(playHTMLAudioWithSources(filenameMinusExt, mediaDir, index, disableSubDirectories)){
			return;
		}
	} 

	//Attempt to play using Flash
	if(playFlashAudio(mediaDir + mp3Dir + filenameMinusExt + ".mp3", index)){
		return;
	}

	if (g_android){
		//just try mp3 and call it a day (at this point)
	    window.document.location.href = mediaDir + mp3Dir + filenameMinusExt + ".mp3";
	    return;
	} 
	
	//Next attempt to use the embedded player
	var embedPlayer = document.getElementById("id_embed_player" + index);
	
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

function audio_play( URL, index )
{
	if(index == undefined){
		index = ""
	}	
	
	if(g_force_player){
		switch(g_force_player){
			case "flash":
				playFlashAudio(URL, index);
				return;
			case "html":
				playHTMLAudio(URL, index);
				return;
		}
	}
	
	if(g_android){
		if(playFlashAudio(URL, index)){
			return;
		}
	} 

	if (g_html5_audio){
		if(playHTMLAudio(URL, index)){
			return;
		}
	} 

	//Attempt to play using Flash
	if(playFlashAudio(URL, index)){
		return;
	}

	if (g_android){
	    window.document.location.href = URL
	    return;
	} 
	
	//Next attempt to use the embedded player
	var embedPlayer = document.getElementById("id_embed_player" + index);
	
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

