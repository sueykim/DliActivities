var flash;
var quickTime;
function  loadAud (audioFile) {
	var media = mediaPath + "mp3/"+audioFile;
	 var  audioPlayer = document.getElementById('html5Audio');
	 audioPlayer.pause(); 
	if (checkAudioFormatSupportByBrowsers())  {
			try { 
					 audioPlayer.src=  mediaPath +checkAudioFormatSupportByBrowsers() +"/"+ audioFile.split(".")[0] +"."+ checkAudioFormatSupportByBrowsers();
					 audioPlayer.load();
				     audioPlayer.play(); 
						  
				} catch(err) {
  						if (flash) {
							  initFlash();
								playAudioInFlash(media); 
						} else  { 
								if (iPodBrowser()) {
											QT_Init(media);
										var player = document.getElementById('sound');
										if(player) {
													player.SetURL(media);
      												player.Play();
						 				}
								} else { 
										if (quickTime) 
        			    						QT_Init(media);
						 				else	
				              					Win_Init(media); 
					          }
   				       }		  
						  
				} //end catch
				
								
	} else if (flash) {
          playAudioInFlash(media); 
	}else  { 
			if (quickTime) 
        	       QT_Init(media);
			else	
				Win_Init(media); 
	      }
		  
}


function iPodBrowser() {
	var browser =  navigator.userAgent.toLowerCase();
	if (browser.indexOf("ipod") != -1)
    	 return true;
	else 
     	return false;

} // iPodBrowser




function xid( a ){
  			return window.document.getElementById( a )
			}


	
  function QT_Init(media)
    {
		var player = document.getElementById('audioPlayer'); 
			player.innerHTML = '<object '
								+ 'classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '
								+ 'width="16" height="200" id="sound" '
								+ 'style="position:absolute;left:-1000px;top:-1000px" '
								+ 'codebase="http://www.apple.com/qtactivex/qtplugin.cab">'
								+ '<param name="SRC" value="'+media+'">'
								+ '<param name="AUTOPLAY" value="true">'
								+ '<param name="CONTROLLER" value="false">'
								+ '<param name="VOLUME" value="100">'
								+ '<param name="ENABLEJAVASCRIPT" value="true">'
								+ '<param name="TYPE" value="audio/mpeg">'
								+ '<embed classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '  
								+ 'name="sound" '
								+ 'id="sound" ' 
								+ 'src="'+media+'" ' 
								+ 'pluginspage="http://www.apple.com/quicktime/download/" '
								+ 'volume="100" ' 
								+ 'enablejavascript="true" '
								+ 'type="audio/mpeg" '
								+ 'height="16" '
								+ 'width="200" '
								+ 'autostart="true"'
								+ '> </embed>'
								+ '</object>';
					
    		
    }
	
	function Win_Init(media){
			var player = document.getElementById('audioPlayer'); 
				player.innerHTML = '<object id="sound" ' 
									+ 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" '
									+ 'codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" '
									+ 'standby="Loading Microsoft® Windows® Media Player components..." '  
									+ 'type="application/x-oleobject" width="1" height="1">'                
									+ '<param name="url" value="'+media+'">'      
									+ '<param name="volume" value="100">'            
									+ '<embed id="sound" type="application/x-mplayer2" src="'+media+'" ' 
									+ 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" '
									+ 'pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" '
									+ 'type="application/x-mplayer2" '
									+ 'url="'+media+'" ' 
									+ 'volume="100" ' 
									+ 'width="1" height="1">'               
									+ '<\/embed>'
									+ '<\/object>';
           }
	
	

	
	
  	function QT_Installed(){
   			 var installed = false;
    		if (navigator.plugins && navigator.plugins.length){
     			 for (var i=0; i<navigator.plugins.length; i++)
        				if (navigator.plugins[i].name.indexOf('QuickTime') > -1)
         						 installed = true;
			} else {
     					 var obj = false
     						 if (browserDetection() == "msie")
        								execScript('on error resume next: obj=IsObject(CreateObject("QuickTimeCheckObject.QuickTimeCheck.1"))','VBScript');
      								installed = obj ? true : false;
      		}
   			 return installed;
    }

	function flashInstalled(version) {
			    var installVersion = getFlashVersion().split(',').shift();
				if ( installVersion > version)
				  		return true;
				else 
				 		return false;
    	} 
			
		function getFlashVersion(){
  				// If it is IE Browser
  			try {
   					 try {
      						// avoid flash for IE6  minor version lookup issues
    						var obj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
      						try { obj.AllowScriptAccess = 'always'; }
     						catch(e) { return '6,0,0'; }
    					} catch(e) {}
    		         return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
  				  // else other browsers
 			} catch(e) {
   					    try {
      						 if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
       						 			return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      							}
    						} catch(e) {}
 			}
  			return '0,0,0';
		}

	
	function initFlash() {
		    var flashvars = {};
			var flashvars = {};
			var params = {};
			params.allowscriptaccess = "always";
			params.allownetworking = "all";
			var attributes = {};
			attributes.id = "flashAudioPlayer";
			swfobject.embedSWF("swf/audioPlayer.swf", "flashAudio", "350", "500", "9.0.0", false, flashvars, params, attributes);

  	}
 function flashMovie(movieName)
			{
				if(window.document[movieName])
				{
					return window.document[movieName];
				}
				else
				{
					return document.getElementById(movieName);	
				}
				
         	}
         	    //this was called when audio finish in Flash     	
			function flashAudioPlayFinished(value)
			{
				return true;
			
			}
			
			function playAudioInFlash(url)
			{ 
				
				flashMovie("flashAudioPlayer").playAudioInFlash(url);	
			}
	
	function audioInitLoad(){

		flash = flashInstalled(9);
		quickTime  = QT_Installed();
		var player = xid("audioPlayer");
		//create the audio element in HTML using HTML5
   if (!!(document.createElement('audio').canPlayType)) {
		 var audioPlayer = document.createElement('audio');  
				   audioPlayer.id ="html5Audio";
				   player.appendChild(audioPlayer);
                  if (!checkAudioFormatSupportByBrowsers())
				         initFlash();
				       
		} else if (flash) { //fall back audio in flash
		 
        		initFlash();
		}
			
		
	} //initLoad()
	
	
	function checkAudioFormatSupportByBrowsers() {

	    var html5AudioMimeTypes = new Array ("audio/mp3", "audio/mpeg", "audio/ogg");
	   var html5AudioTypes = new Array ("mp3","mp3","ogg"); 
       var audioPlayer =  document.getElementById('html5Audio'); 
	   if(audioPlayer && (audioPlayer != null)) {
       		for (var i = 0; i < html5AudioMimeTypes.length; i++) { 
	       			 var canPlay = audioPlayer.canPlayType(html5AudioMimeTypes[i]); 
						if ((canPlay == "maybe") || (canPlay == "probably"))
				   				return html5AudioTypes[i];
	  		 } 
	   }
	   return false;
 }
 
 function browserDetection() {
var browser =  navigator.userAgent.toLowerCase();
if (browser.indexOf("iphone") != -1)
	browser =  "iphone";
if (browser.indexOf("ipod") != -1)
	browser = "ipod";
if (browser.indexOf("ipad") != -1)
	browser = "ipad";
if (browser.indexOf("android") != -1)
	browser =  "android";
else if (browser.indexOf("opera") != -1)
	browser = "opera";
else if (browser.indexOf("firefox") != -1)
	browser = "firefox";
else if (browser.indexOf("msie") != -1)
	browser = "msie";
else if (browser.indexOf("netscape") != -1)
	browser = "netscape";
else if (browser.indexOf("safari") != -1)
	browser= "safari";
else if (browser.indexOf("blackberry") != -1)
	browser= "blackberry";
else if (browser.indexOf("palm") != -1)
	browser= "palm";
return browser;

} // end function 

	
