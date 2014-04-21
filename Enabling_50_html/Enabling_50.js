$(document).ready(function() {
	
	audioInit();
	$('#feedback').hide();

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/enabling_50_dlilearn.css";
	xmlFilename = mediaPath + "enabling50_noNamespaces.xml";
	jsonFilename = mediaPath + "enabling50_json.js";

	//testVideoSupport();	
        loadjscssfile("../common/css/activityDefault.css", "css");
	loadActivity(parseXml);
	
});

var numItems;
var numItemsPerSet = 1;
var setItemCompleted = 0;
function parseXml(t_xml){
	numItems = $(xml).find("set").length;
	numSets = Math.ceil(numItems/1);
	
	//Randomize sets
	//$(xml).find("item").shuffle()
	
	loadSet(0);
}

var numberItemsInSet;

function loadSet(value){
	currentSet = value;
	setCompletedShown = false;	
	updateSetText();
	
	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	};
	var letterAry = $($(xml).find("set")[currentSet]).find("letter");
	var aLen = letterAry.length;
	//alert('aLen ' + aLen);
	var ltrBtnStr = '';
	var charactAry = [];
	for(var i=0; i<aLen; i++){
		var theCharacter = $(letterAry[i]).attr('tl_letter');
		charactAry.push(theCharacter);
		ltrBtnStr += '<div class="ltrBtn" id="ltrBtn' + i + '">' + theCharacter + '</div>'		
	}
	//alert(charactAry);
	$("#letters").html(ltrBtnStr);
	$($("#letters").find("div")).mouseover(function(){$(this).css('color','#999999')}).mouseout(function(){$(this).css('color','#000000')});
	($("#letters").find("div")).click(function(){selectLetter($(this).attr('id'))});
	var en_sentence = $($(xml).find("set")[currentSet]).find("en_phrase").text();
	$("#enSentenceDiv").html(en_sentence);	
	var TLdir = $($(xml).find("tl_phrase")[currentSet]).attr("dir");
	var audBtn = '<img  class="playBtnImg" id="playBtn' + currentSet + '" src="../common/Library/images/playBtn_s1.png" border="0">';
	var tl_sentence = $($(xml).find("set")[currentSet]).find("tl_phrase").text();
	tl_sentence = fix_str(tl_sentence, charactAry );
	$('#tlSentence').html(tl_sentence);
	if(TLdir == "rtl"){
		$("#rightAudioBtn").html(audBtn);
		$('#rightAudioBtn').css({'float':'right','marginRight':'10px','marginTop':'-65px'});
		$('.enSentence').css({'text-align':'right','marginTop':'-10px'} );		
		$('#tlSentence').css({'direction':'rtl','text-align':'right'});
	}
	else{
		$("#leftAudioBtn").html(audBtn);
		$('#leftAudioBtn').css({'float':'left','marginTop':'0px'});
		$('.enSentence').css({'float':'left','marginLeft':'30px','marginTop':'10px'});
	}
	var audFile =  $($(xml).find("set")[currentSet]).find("tl_phrase").attr('audio');
	//$('#playBtn' + currentSet).click(function(){alert(audFile);});
	$('#playBtn' + currentSet).mouseover(function(){$(this).css('opacity','.7')}).mouseout(function(){$(this).css('opacity','1')});
	$('#playBtn' + currentSet).click(function(){playAudio(audFile);});
	$($('#tlSentence').find('span')).click(function(){getLetter($(this).attr('id'))});
}

var ChosenLetter = '';
function selectLetter(ID){
	$($("#letters").find("div")).css('backgroundColor','#eeeeee');
	$('#' +ID).css('backgroundColor','#C8DFEE'); 
	ChosenLetter = $('#' +ID).html();
//alert(ChosenLetter); 
} 

function getLetter(ID){
	var ltrCompared = $('#' +ID).html();
	//alert(ltrCompared);
	if(ltrCompared == ChosenLetter){
	  $('#' +ID).removeClass('hiddenLetter');
		var rightFB = '<img  class="fbcorrect" id="id_correct' + currentSet + '" src="../common/img/feedback_correct.png" border="0" width="122px" height="38px">';
		$('#showwrong').html(rightFB);
		$("#showwrong").css("display", "block");
		setTimeout(function(){$("#showwrong").css("display", "none")},500);	
	  setItemCompleted++;
	  checkCompleteSet();
	}
	else{
		var wrongFB = '<img  class="fbIncorrect" id="id_incorrect' + currentSet + '" src="../common/img/feedback_incorrect.png" border="0" width="139px" height="38px">';
	 $('#showwrong').html(wrongFB);
	 $("#showwrong").css("display", "block");
	 setTimeout(function(){$("#showwrong").css("display", "none")},500);	
	}
}
function playAudio(value){	
	//alert(audioFile);
	audio_play_file(removeFileExt(value),mediaPath);
}	

function w_source()
  {
  var wr = ''
  function ws()
    {
    wr += ''.concat.apply('', arguments)
    }
  function wl()
    {
    wr += ''.concat.apply('', arguments) + '\n'
    }
  wl( "var wr = ''" )
  wl( ws )
  wl( wl )
  return wr
  }
  
var hiddenLtrNo = 0;  
function fix_str(S, N)
  {
  hiddenLtrNo = 0;
  var D         = '&zwj;'
  eval(w_source())
  var L = S.length
  //alert(N)
 // var F = new Array( 12, 4, 10, 9, 4 )
 // var K = Math.floor(Math.random()*(L))
 // alert(K)
  
	for (var i=0; i<S.length; i++)
		{
		var theCharact = false;  
		for (var j=0; j<N.length; j++) {
			if (S.substr(i,1) == N[j])
			   theCharact = true;
			}	
		if (theCharact==true){
			var prevLtr = S.substr(i-1,1);
			var specialLtr = ArabicLetterIdentified(prevLtr);
			//alert( 'specialLtr: ' + specialLtr);
			if (S.substr(i+1,1) == " " || i==(S.length-1)){ 			    
				if (prevLtr == " " || i==0 || specialLtr == true)
					ws( '<span class="hiddenLetter" id="ltr', i, '">', S.substr(i, 1), '</span>' )
				else
					ws( D, '<span class="hiddenLetter" id="ltr', i, '">', S.substr(i, 1), '</span>' )
			}	
			else if (prevLtr == " " || i==0 ||specialLtr == true){
				if (S.substr(i+1,1) == " " || i==(S.length-1))
					ws( '<span class="hiddenLetter" id="ltr', i, '">', S.substr(i, 1), '</span>' )
				else
					ws( '<span class="hiddenLetter" id="ltr', i, '">', S.substr(i, 1), '</span>', D )
			}			
			else
		  ws( D, '<span class="hiddenLetter" id="ltr', i, '">', S.substr(i, 1), '</span>', D )
		  hiddenLtrNo++
		  }
		else
		  ws( S.substr(i, 1) )
		}	
  return wr
  }
function ArabicLetterIdentified(Ltr)
  {
  var LCC = '&#' +(Ltr.toString()).charCodeAt(0) + ';';
  //These Arabic letters behave as if there is a space after the letter. So we have to treat them as if there is a space in between.
  var arabicLtrs = [ '&#1570;', '&#1573;', '&#1575;', '&#1583;', '&#1584;', '&#1585;', '&#1588;', '&#1608;', '&#1650;' ];
  var aLen = arabicLtrs.length;
  var theResult = false;
  for (var i=0; i<aLen; i++)
    {
	if (LCC == arabicLtrs[i])
	  theResult = true;
	}
  return theResult;	
  }
  
var setCompletedShown = false;
var activityCompletedShown = false;
function checkCompleteSet(){
	if(setCompletedShown && !activityCompletedShown){
		//Check for activity completed
		loadNextSet();
	}else if(!setCompletedShown){
		//Check for set completed
		if(setItemCompleted == hiddenLtrNo){
			setCompletedShown = true;
			showFeedback("set_completed");
			setItemCompleted = 0;
		}
	}	
}

function showFeedback(value, text){
	//Clear the dialog box
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
			$("#feedbackHeader").html("Set Completed");
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			break;
	}
	
	$('#feedback').show();
}
function closeFeedback(){
	$('#feedback').hide();
	
	checkCompleteSet();
    $("#clickGuard").css("display", "none");	

}

function loadNextSet(){
	if(currentSet + 1 == numSets){
		activityCompletedShown = true;	
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed");
		}
	}else{
		loadSet(currentSet + 1);
	}
}

function randomNumbers()
{
	this.inhat  = function(n){return(this.ff[n])}
	this.remove = function(n){if(this.ff[n]){this.ff[n]=false;this.count--}}
	this.fill = function (n)
	{
		this.ff = []
		for (var i=0; i < n; i++)
		this.ff[i] = true
		this.count = n
    }

	this.get = function()
	{
		var n, k, r
		r = this.count
		if (r > 0)
		{
			n = Math.ceil(Math.random()*r)
			r = k = 0
			do
			if (this.ff[r++])
				k++
			while (k < n)
				this.ff[r-1] = false
			this.count--
		}
		return r-1
	}
	if (arguments.length > 0)
		this.fill( arguments[0] )
}// randomNumbers

// --------------------------------------------------------------
// spf(): 	Macro one or more strings into a template
//
// Use:
//		spf("Thank you ~ for learning the ~ language", ['david', 'Iraqi']);
//
// --------------------------------------------------------------
function spf( s, t )
{
  var n=0
  function F()
  {
    return t[n++]
  }
  return s.replace(/~/g, F)
}

// --------------------------------------------------------------
// xid(): 	shorthand for getElementbyId
//
// --------------------------------------------------------------
function xid( a )
{
	return window.document.getElementById( a )
}

// --------------------------------------------------------------
// globalize_id(): 	create a global variable reference to a DOM object
//
// --------------------------------------------------------------
function globalize_id( the_id )
{
	window [ the_id ] = xid(the_id)
}

// --------------------------------------------------------------
// BrowserDection
//
// ---------------------------------------------------------------

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
//alert(BrowserDetect.browser);