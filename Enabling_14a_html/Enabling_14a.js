var currentPhoneNumber;
var currentCallAudio;
//var g_FlashInstalled = false;

$(document).ready(function () {
	audioInit();
		  
	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/enabling_14a_dlilearn.css";
	xmlFilename = mediaPath + "MobilePhone.xml";
	jsonFilename = mediaPath + "MobilePhone.js";
	
	$(".activity_hd").html('');
	$(".activity_description").html('');
	loadActivity(parseXml);
	
	
	
		  
		  
		  
		  		$("#scratchText").focus(function() {if (this.value == "Scratch Text Area") {this.value = ''; }});
$("#scratchText").blur(function() { if ($.trim(this.value) == '') { this.value = "Scratch Text Area";} });
        });


var xml;
function parseXml(t_xml)
{
	xml = t_xml;
	
	numSets = $(xml).find("item").length;
	
	//Load digits
	var tally = 0;
	$(xml).find("digit").each(function(){
		$("#num_" + tally + " div").text($(this).attr("english"));
		tally++;
	});
	
	
	//Load phoneNumbers
	$(xml).find("item").each(function(index, v){
		//Load the answer
		$(this).append($("<phonenumber id='answer' value='" + 
							$(this).attr("english")+ "'/>"));
						
		//Find at most 9 distractors for the current xml
		var itemsXml = $(xml).find("item");
		
		for(var i=0; i<itemsXml.length; i++){
			if(i == index)
				continue;
			
			if(i > 9) //A max of nine distractors allowed
				break;
			
			$(this).append($("<phonenumber value='" + 
						$(itemsXml[i]).attr("english")+ "'/>"));
		}
		
		$(this).find("phonenumber").shuffle();
	});
	
	
/*	
	$( "#selectable" ).selectable({
			selecting: function(event, ui){
			    if( $(".ui-selected, .ui-selecting").length > 1){
			    	$(ui.selecting).removeClass("ui-selecting");
			    }
		    },
			selected: function (event, ui) {
		  		//Find index
		  		
			}
		}
	);
*/	
    loadSet(currentSet);
}

function digitPressed(value){
	var str = document.getElementById('displayText').innerHTML;
	
	loadAudioTagPlayer();
	
	if(str.length < 9){
		var digitXml = $(xml).find("digit").eq(value);
		
		audio_play_file(removeFileExt(digitXml.attr("audio")) ,mediaPath);
			
		document.getElementById('displayText').innerHTML = str + 
												digitXml.attr("english");
	}
}

function delClicked(){
	var str = document.getElementById('displayText').innerHTML;
	
	if(str.length > 0){
		document.getElementById('displayText').innerHTML = str.substr(0, str.length - 1);
	}
}

function playCall(){
	audio_play_file(removeFileExt(currentCallAudio) ,mediaPath);
}

var timeoutID;
var copyOfText;
var btnLock;

function callPressed(){
	var str = document.getElementById('displayText').innerHTML;
	if( parseInt(str) >= 0) {// revised by thomaa to add this if to check user enter number before send. otherwise, no work.
	//btnLock = true;
	btnLock = false;
	
	//revised for the 14a by Thomas 20140613
		if ($(itemXml).attr("numberTry"))
			$(itemXml).attr("numberTry", parseInt($(itemXml).attr("numberTry")) +1);
		else
		    $(itemXml).attr("numberTry", "1");
			
	
			
	//revised for the 14a by SK 20140304
	if(str == currentPhoneNumber){
		copyOfText = str;
		
		document.getElementById('displayText').innerHTML = "Correct!";
			$('#displayText').css( {"font-size": "40px", "padding":"0px 3px 0px 3px"});
		timeoutID = window.setTimeout(correctTimerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
		
		
		$(itemXml).attr('completed', "true");
		$("#" + currentSet).addClass("itemCompleted");
		
		
		
	}else{
		//revised for the 14a by Thomas 20140613
		if ($(itemXml).attr("numberTry") >2) {
			$(itemXml).attr('completed', "true");
			copyOfText = currentPhoneNumber;
			document.getElementById('displayText').innerHTML = "The correct answer is:";
		$('#displayText').css( {"font-size": "20px", "padding":"15px 0px 0px 0px"});
		timeoutID = window.setTimeout(correctTimerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
		} else {//end revised by Thomas
		
		copyOfText = str;
		
		document.getElementById('displayText').innerHTML = "Try Again!";
		$('#displayText').css( {"font-size": "40px", "padding":"0px 3px 0px 3px"});
		timeoutID = window.setTimeout(timerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
		}
	}
	}
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
		}
}


function correctTimerEnd(){
	document.getElementById('displayText').innerHTML = copyOfText;
	$('#displayText').css( {"font-size": "40px", "padding":"5px 3px 0px 3px"});
	//$(itemXml).attr('audio');

	document.getElementById('clickGuard').style.display = "block";
	//document.getElementById('clickGuard').style.display = "none";
	btnLock = false;
}

function timerEnd(){
	document.getElementById('displayText').innerHTML = copyOfText;
	$('#displayText').css( {"font-size": "40px", "padding":"5px 3px 0px 3px"});
	document.getElementById('clickGuard').style.display = "none";
	
	btnLock = false;
}

function nextClick(){
	if(btnLock)
		return;
		
	if(currentSet != numSets - 1){
		//Save the scratch text
		var text= document.getElementById("displayText").innerHTML;
		if ((text == "Try Again!") || (text == "The correct answer is:")||(text == "Correct!"))
		         text = copyOfText;
		itemXml.attr("scratchText", document.getElementById("scratchText").value);
		itemXml.attr("tempDisplayValue", text);
		clearTimeout(timeoutID);
	
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(btnLock)
		return;
	
	if(currentSet != 0){
		//Save the scratch text
			var text= document.getElementById("displayText").innerHTML;
		if ((text == "Try Again!") || (text == "The correct answer is:")||(text == "Correct!"))
		         text = copyOfText;
		itemXml.attr("scratchText", document.getElementById("scratchText").value);
		itemXml.attr("tempDisplayValue", text);
		clearTimeout(timeoutID);
		
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;
var numSets = 0;
var itemXml;

function loadSet(value){
	currentSet = value;
	
	//setSelected(currentSet);
	
	document.getElementById('setText').innerHTML = (currentSet + 1) + "/" + numSets;
	
	itemXml = $(xml).find("item").eq(currentSet);

	//Load selection
	$("#selectable").empty();
	
	
	//Load selections
	$(itemXml).find("phonenumber").each(function(i, v){
		var id = false;
		
		if($(this).attr("id") == "answer"){
			id = "answer"	
		}else{
			id = "distractor_" + i;
		}
		
		var widthOverride = "";
		if($(xml).find("content").attr("tl_textfield_width") != undefined){
			widthOverride = " style='width:" + 
					$(xml).find("content").attr("tl_textfield_width") +
					"' ";
		}
		var transValue = translatePhoneNum($(v).attr("value"));
		
		$("#selectable").append($("<div class='phoneNum noSelect' " + 
										"id='" + id + "' " + 
											widthOverride + ">" + 
										"<div class='phoneNumTxt'>" +
										 transValue + "</div></div>"));
	});
	
	//Load the scratch text
	if(itemXml.attr("scratchText")){
		document.getElementById("scratchText").value = itemXml.attr("scratchText");
	}else{
		document.getElementById("scratchText").value = "Scratch Text Area";
	}
	
	currentPhoneNumber = $(itemXml).attr('english');
	currentCallAudio = $(itemXml).attr('audio');
	
	loadTlPhoneNum();
	
	if($(itemXml).attr('completed') == "true"){
		$("#answer").addClass('ui-selected');
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


function translatePhoneNum(phoneNum){
    var out = "";

    for(var i=0; i<phoneNum.length; i++){
        var ch = phoneNum.substr(i,1);
        var tl_ch = $(xml).find("digit[english='" + ch  + "']");
        out = out + $(tl_ch).text();
    }

    return out;	
}

function loadTlPhoneNum(){
    $("#tl_phoneNum").text(translatePhoneNum(currentPhoneNumber));
}


function loadAudioTagPlayer(){
	var htmlAudioPlayerDiv = document.getElementById("htmlAudioPlayerDiv");
	htmlAudioPlayerDiv.innerHTML = '<audio id="audioPlayer" width="0" height="0" autoplay></audio>';
}
