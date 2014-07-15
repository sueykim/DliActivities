$(document).ready(function() {

	audioInit();	
	$('#feedback').hide();
        loadjscssfile("../common/css/activityDefault.css", "css");
	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/evaluation_01_dlilearn.css";
	xmlFilename = mediaPath + "evaluation01_noNamespaces.xml";
	jsonFilename = mediaPath + "evaluation01_json.js";
	
	//testVideoSupport();	
	loadActivity(parseXml);
	
});


var numItems;
var numItemsPerSet = 1;
var setItemCompleted = 0;
var itemNotSet = true;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/1);
	
	//Randomize sets
	$(xml).find("item").shuffle()
	
	loadSet(0);
}

var numberItemsInSet;
var audFileAry = [];
var answerAry = [];
var stAnsAry= [];
function loadSet(value){
	currentSet = value;
	setCompletedShown = false;
	$("#clickGuard").css("display", "none");
	updateSetText();

	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	}
	
	if (itemNotSet){
		var ansAry = [];
		var iLen = numItems;
		for (var i=0;i<iLen;i++){			
			var theItem = $($(xml).find("item")[i]);
			var theAns = $($(xml).find("lang_tl")[i]).text();
			answerAry.push(theAns);
			var tlSentenceAry = $($(xml).find("phrase_tl")[i]).text().split('||');
			var tlDir = $($(xml).find("phrase_tl")[i]).attr("dir")
			var missingWordID = $($(xml).find("missing_word_ids")[i]).text();
			var audFile =  $($(xml).find("file_audio")[i]).text();
			audFileAry.push(audFile);
			missingWordID = missingWordID - 1;
			var qStr = ''
			var qLen = tlSentenceAry.length
			for (var j=0; j<qLen; j++){
				if (j== missingWordID)
					qStr += '<div id="dropTgt' + i + '" class="dropTargetArea"></div>'
				else
					qStr += '<div class="qWord">' +tlSentenceAry[j] + '</div>';
					
			}
			//alert(qStr)
			$($(".questionText")[i]).html(qStr);
			var audBtn = '<img  class="playBtn" id="playBtn' + i + '" src="../common/Library/images/playBtn_s1.png" border="0">';
			if(tlDir.toLowerCase() == 'rtl'){
				$($(".playBtnRightDiv")[i]).html(audBtn);
				$($(".questionText")[i]).css({'float':'left', 'textAlign':'right', 'marginRight':'10px', 'top':'35px'});
				
				$($(".dropTargetArea")[i]).css({'float':'right'});
				$(".qWord").css({'float':'right'});	
				$($(".playBtnLeftDiv")[i]).css('display', 'none');
			}
			else{
				$($(".playBtnLeftDiv")[i]).html(audBtn);
				$($(".questionText")[i]).css({'float':'left', 'marginLeft':'65px'});
				$($(".dropTargetArea")[i]).css({'float':'left'});	
				$(".qWord").css({'float':'left'});
				$($(".playBtnRightDiv")[i]).css('display', 'none');
			}
			$("#dropTgt" + i).droppable({
			hoverClass: "dropTargetHover",
			drop: dropFunction}); 	
			$('#playBtn' + i).mouseover(function(){$(this).css('opacity','.7')}).mouseout(function(){$(this).css('opacity','1')});
			$('#playBtn' + i).click(function(){playAudio(this);});
			var theChoiceAry = [];
			var dLen = theItem.find('distractor').length;
			for(k=0; k<dLen; k++){
				var theDistractor = $(theItem.find('distractor')[k]).text();
				theChoiceAry.push(theDistractor);
			}
			theChoiceAry.push(theAns);
			//alert(theChoiceAry)
			var hatA = new randomNumbers( theChoiceAry.length );	//to randomize the choices
			for(var m=0; m<theChoiceAry.length; m++){
				var a = hatA.get()
				var theChoiceStr = '<div class="dragBubbleText">' + theChoiceAry[a] + '</div>'
				$($("#id_set_" + i).find(".dragBubble")[m]).html(theChoiceStr);
				$($("#id_set_" + i).find(".dragBubble")[m]).draggable( 'enable');
				$($("#id_set_" + i).find(".dragBubble")[m]).draggable({ revert: true, helper: "clone", containment:"#main"});
			}
		itemNotSet = false;
		}	
	}
	var sLen = $(".css_set_div").length;
	//alert(sLen);
	for (var i=0; i<sLen; i++){
		$($(".css_set_div")[i]).css('display','none');
		stAnsAry.push($($(".dropTargetArea")[i]).html());
	}
	$("#dropTgt" + currentSet).html(stAnsAry[currentSet]);
	$($(".css_set_div")[currentSet]).css('display', 'block');
//	alert($("#dropTgt" + currentSet).html());
}

function playAudio(value){	
	//alert($(value).attr('id'));
	var idNo = extractLastNumber($(value).attr('id'));
	var audFile = audFileAry[idNo];
	audio_play_file(removeFileExt(audFile), mediaPath);
}	

function dropFunction(event, ui) {
	var dropTargetNo = extractLastNumber($(this).attr("id"));
    //alert( dropTargetNo );	
	var dragBubbleTxt = $($(ui.draggable).find(".dragBubbleText")[0]).text();
	stAnsAry[dropTargetNo] = dragBubbleTxt;
	//alert(dragBubbleTxt)
	$(this).html(dragBubbleTxt);
	var allDone = checkComplete();
	if ( allDone){
		$("#id_submitBtn").css('display', 'inline');
		$("#id_submitBtn").click(function(){judgingAnswers();});
		}
}

function IE()
  {
  var a = navigator.userAgent.toLowerCase()
  return a.indexOf("msie") != -1
  }
showSubmitBtn = false
function checkComplete(){
	showSubmitBtn = true;
	var dtLen = $('.dropTargetArea').length
	for (var i=0; i<dtLen; i++){
		if($($('.dropTargetArea')[i]).html() == '')
			showSubmitBtn = false;
	}
  //alert( 'showSubmitBtn = ' + showSubmitBtn);
	return showSubmitBtn;
}  
function judgingAnswers(){
	var passingScore = $(xml).find("content").attr("passing_score");	
	if(passingScore == undefined || passingScore == NaN)
			passingScore = .8;
		else
			passingScore = passingScore;
	var correctNos = 0;
	var dtLen = $('.dropTargetArea').length
	for (var i=0; i<dtLen; i++){
		if($($('.dropTargetArea')[i]).html() == answerAry[i])
			correctNos++;
	}
	var stScore = correctNos / dtLen;
	if ( stScore >= passingScore){ 
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed", "Passed!")
		}
	}
	else{
		if(parent.activityCompleted){
			parent.activityCompleted(false,0);
		}else{
			showFeedback("activity_completed", "Failed!")
		}
	}

	$("#id_submitBtn").css('display', 'none');
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
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackText").html(text);
			break;
	}
	
	$('#feedback').show();
	$("#clickGuard").css("display", "block");	
}

function closeFeedback(){
	$('#feedback').hide();
	
	//checkCompleted();
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
		$(xml).find("item").shuffle();
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
