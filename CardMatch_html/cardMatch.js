$(document).ready(function() {
	
	audioInit();
	$('#feedback').hide();

	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/cardmatch_dlilearn.css";
	xmlFilename = mediaPath + "cardmatch_noNamespaces.xml";
	jsonFilename = mediaPath + "cardmatch_json.js";
        loadjscssfile("../common/css/activityDefault.css", "css");

	//testVideoSupport();	
	loadActivity(parseXml);
});

var flipCardPossible = false;
var toggle=false;
function enableCardFlip(){
	if (BrowserDetect.browser != "Explorer" 
		&& $('html').hasClass('csstransforms3d') 
		&& isNotMobile()) {	
			flipCardPossible = true;
			$('.card').removeClass('scroll').addClass('flip');		
			$('.card.flip').click(
				function () {
				toggle=true;
					$(this).find('.card-wrapper').addClass('flipIt');					
					showFront(extractLastNumber($(this).attr("id")));
				}
			);
			
		} else {
			//alert('ie'); 
			$('.card').click(
				function () {
					toggle=true;
					$(this).find('img').attr('src','../common/Library/images/card_front.png');
					$(this).find('.card-detail').css('display','block');
					$(this).find('.card-detail').css('bottom',0);
					showFront(extractLastNumber($(this).attr("id")));
				} 
			);

		}

}

var numItems;
var numItemsPerSet = 5;
var setItemCompleted = 0;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/5);
	
	//Randomize sets
	$(xml).find("item").shuffle()
	
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
	}
	answeredAry = []; 
	//place the text on the cards		
	var startIndex = currentSet*numItemsPerSet
	var hatA = new randomNumbers( numberItemsInSet*2 );
	for(var i = 0; i< numItemsPerSet; i++)
	{
	var a = hatA.get();
	answeredAry.push(0);
	var TL = $($(xml).find("lang_tl")[startIndex + i]).text();
	var EN = $($(xml).find("lang_en")[startIndex + i]).text();
	var aud = $($(xml).find("audio")[startIndex + i]).text();
	var itemID = $($(xml).find("item")[startIndex + i]).attr("id");
if (parseInt(itemID) >10)
 	var width= "25px";
 else
  	var width= "18px";
 
	var tl_str = '<div class="hiddenId" style="width:'+width+'">' + itemID + '</div>'
				+ '<p>' + TL + '</p>'
				+ '<input type="hidden" value="' + aud + '" class="hiddenAud" />';
	$("#cardInside" + a).html(tl_str);
	a = hatA.get();
	answeredAry.push(0);
	var en_str = '<div class="hiddenId" style="width:'+width+'">' + itemID + '</div>'
				+ '<p>' + EN + '</p>';
	$("#cardInside" + a).html(en_str);
	}
    
	if(currentSet == 0)
	  enableCardFlip();
	else{
		for(var i=0; i<10; i++)
			showback(i);
    } 
	$("#clickGuard").css("display", "none");
}
var choiceData = [];
var answeredAry = []
function showFront(No){	
    $("#clickGuard").css("display", "block");
	var theAudio = $("#cardContainer" + No).find('.hiddenAud').attr('value');		
	if (theAudio != undefined){
		playAudio(theAudio);
	}

	//to push the data into choiceData
	if (answeredAry[No] == 0 && (No != choiceData[1]) && toggle){
		var item_id = $.trim($("#cardContainer" + No).find('.hiddenId').html());
		choiceData.push(item_id);
		choiceData.push(No);
	}
	//if it has 2 items to compare:
	if (choiceData.length > 3){	  
		judgingChoices();
	} 
	else
	{$("#clickGuard").css("display", "none");}
	toggle=false;    
}	

function judgingChoices(){
	
   $("#clickGuard").css("display", "block");
	if (choiceData.length > 3){	
		var item1 = choiceData[1];
		var item2 = choiceData[3];
		if (choiceData[0] == choiceData[2]){
		$("#cardContainer" + item1).find('.hiddenId').css('visibility', 'visible');
			$("#cardContainer" + item2).find('.hiddenId').css('visibility', 'visible');
			choiceData = [];
			answeredAry[item1] = answeredAry[item2] = 1;
			setItemCompleted++;
			checkCompleteSet();
			setTimeout(function(){$("#clickGuard").css("display", "none")}, 2000);
		}
		else{
			choiceData = [];
			setTimeout(function(){
			showback(item1);
			showback(item2);
			$("#clickGuard").css("display", "none");
			
			}, 2000);
		}		
   }	
	
}

function showback(No){
	//alert(No + " from showback")
	var containr = "#cardContainer" + No
	if (flipCardPossible){
		$(containr).find('.card-wrapper').removeClass('flipIt');
	}else{
		$(containr).find('img').attr('src','../common/Library/images/card_back.png');
		$(containr).find('.card-detail').css('display','none');
		$(containr).find('.card-detail').css('bottom','-280px');
	}
  	
}

function playAudio(value){	
	//alert(value);
	//audio_play_file(removeFileExt(value),mediaPath);
	audio_play( mediaPath + 'mp3/'+ value)
}	


var setCompletedShown = false;
var activityCompletedShown = false;
function checkCompleteSet(){
	if(setCompletedShown && !activityCompletedShown){
		//Check for activity completed
		loadNextSet();
	}else if(!setCompletedShown){
		//Check for set completed
		if(setItemCompleted == numberItemsInSet){
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
	if(currentSet + 1 == numSets){
		$("#feedbackHeader").html("Activity Completed");
		if(parent.activityCompleted)
			parent.activityCompleted(1,0);
		$('#feedbackBtn').hide();
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

	function isNotMobile(){
			var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));    
    if (mobile)   
	  		return false;
	 else
	  		return true;
	  
}
