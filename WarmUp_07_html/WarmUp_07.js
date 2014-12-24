$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "WarmUp_07_sampleData.xml";
	jsonFilename = mediaPath + "WarmUp_07_sampleData.js";
	cssFilename = "styles/WarmUp_07.css";
	
	params = getParams(window.location.href);

	if(params['mode'] != undefined){
		$("body").attr("mode", params['mode'])
		
		switch(params['mode']){
			case "warmup_08":
				titleAlreadySet = true
				$("title").text("WarmUp 8 HTML")
				break
			case "warmup_07a":
				titleAlreadySet = true
				$("title").text("WarmUp 7a HTML")
				//cssFilename = "styles/WarmUp_07a.css"
				break
			case "warmup_08a":
				titleAlreadySet = true
				$("title").text("WarmUp 8a HTML")
				//cssFilename = "styles/WarmUp_07a.css";
				break
		}
	}else{
		$("body").attr("mode", "warmup_07")
	}
	
	loadActivity(parseXml);
	
}); 

var titleAlreadySet = false

function introClicked(){
	$("body").attr("intro", "true")
}

function completeClicked(){
	completeActivity()
}

function playAudio(type, element){	
	switch(type){
		case 'main':
			audio_play_file(removeFileExt($("body").attr("audio")),mediaPath)
			break;
		case 'ex':
			var jExContainer = $($(element).parent())
			audio_play_file(removeFileExt(jExContainer.attr("audio")),mediaPath)
			break;
	}
}

var numItems 

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;
var disableHighlighting = false
var jItem

function loadLetter(index){ 
	if($("body").attr("mode") == "warmup_08" 
			|| $("body").attr("mode") == "warmup_08a"){
		$("body").attr("intro", "false")
	}
	
	jItem = $($(xml).find("letter")[index])
	
	if(jItem.find("initial_image").length == 1){
		$($(".charImage")[0]).css("background-image", 
					"url(" + mediaPath + "png/" 
					+ $(jItem.find("initial_image")).text() + ")" )
		
		$($(".charImage")[1]).css("background-image", 
					"url(" + mediaPath + "png/" 
					+ $(jItem.find("middle_image")).text() + ")" )
		
		$($(".charImage")[2]).css("background-image", 
					"url(" + mediaPath + "png/" 
					+ $(jItem.find("final_image")).text() + ")" )
	}
	
	//Load fields
	$("body").attr("audio", $(jItem.find("audio")).text())

	if($(jItem.find("example")[0]).attr("dir").toLowerCase() == "rtl"){
		$("body").attr("dir", "rtl")
	}else{
		$("body").attr("dir", "ltr")
	}

	$("#idName").text($(jItem.find("name")).text())
	$("#idChar").text($(jItem.find("char")).text())
	
	if($("body").attr("mode") == "warmup_07" 
			|| $("body").attr("mode") == "warmup_07a"){
		$("#idDesc").html($(jItem.find("desc")).text())
	}
	
	var itemChar = $(jItem.find("char")).text().toLowerCase()
	
	$("#idExampleContainers").empty()
	
	jItem.find("example").each(function(i_e,v_e){
		var jEx = $(jItem.find("example")[i_e])
		var exText = jEx.text()
		
		var jExampleContainerSnip = $($("#exampleContainerSnip").html())
		
		var enText = jEx.attr("en")
		if(enText == undefined){
			enText = jEx.attr("en_word")
		}
		
		jExampleContainerSnip.find(".exampleEn").text(enText)
			
		for(var i_t=exText.length-1; i_t >= 0; i_t--){
			//Are there multiple characters in itemChar
				//If so substring the current index + itemChar.length
					//If the result isn't itemChar.length then continue
			var currentCharStr = exText.substring(i_t, 
											i_t + itemChar.length)

			if(currentCharStr.toLowerCase() 
										== itemChar.toLowerCase()){
				var outputText = exText.substring(0, i_t) 
				var endOfCharStrIndex = i_t + currentCharStr.length

				//Is this the beginning of the item
				if(i_t != 0){
					//No
					outputText += "&zwj;"	
				}
				
				outputText += "<span class='highlight'>"
				
				//Is there a space before this word
				if(i_t != 0 
						&& exText[i_t-1] != " "){
					//No
					outputText += "&zwj;"	
				}
				
				outputText += currentCharStr
				
				
				//Is there a space after this word
				if(endOfCharStrIndex != exText.length
						&& exText[endOfCharStrIndex+1] != " "){
					//No
					outputText += "&zwj;"	
				}
				
				outputText += "</span>"
				
				//Is this the end of the item
				if(endOfCharStrIndex != exText.length){
					//No
					outputText += "&zwj;"	
				}
				
				outputText += exText.substring(endOfCharStrIndex, exText.length) 
			
				exText = outputText
			}
		}

		if(disableHighlighting){
			exText = jEx.text()	
		}
		
		jExampleContainerSnip.find(".example").html(exText)
	
		var audioText = jEx.attr("aud")
		if(audioText == undefined){
			audioText = jEx.attr("audio")
		}
	
		jExampleContainerSnip.attr("audio",audioText)
	
		$("#idExampleContainers").append(jExampleContainerSnip)
	})
	
	//Mark letter as being shown
	$($("#idCharGrid > .gridItem")[index]).attr("visited", "true")
	
	checkCompleted()
}


var activityCompletedShown = false

function checkCompleted(){
	if(!activityCompletedShown && 
			$("#idCharGrid > .gridItem:not([visited='true'])").length == 0){
		$("body").attr("completed","true")
		
		if($("body").attr("mode") == "warmup_07"
				|| $("body").attr("mode") == "warmup_07a"){
			completeActivity()
		}
	}
}

function completeActivity(){
	//Completed
	activityCompletedShown = true

	if(parent.activityCompleted){
		parent.activityCompleted(1,0);
	}else{
		alert("Activity Completed")
	}	
}

var isJapanese = false

function parseXml(t_xml){
	if(params['disableHighlighting'] != undefined 
			&& params['disableHighlighting'].toLowerCase() == "true"){
		disableHighlighting = true
	}

	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	
	//Is this a WarmUp_08 xml file
	if($(t_xml).find("set").length > 0){
		$("body").attr("warmup_08", "true")

		if(!titleAlreadySet){
			$("head > title").text("WarmUp 08")
		}
		
		var introHTML = "<div id='intro_title'>" 
							+ $(t_xml).find("introduction > title").text() 
							+ "</div>"
		
		introHTML += "<div id='intro_text'>" 
							+ $(t_xml).find("introduction > intro").text() 
							+ "</div>"
		
		$("#idDesc").html(introHTML)
	}
	
	//Loop through all letters
	$(t_xml).find("letter").each(function(l_i, l_v){
		//Create letter for grid and load it
		var jGridItemSnip = 	$($("#gridItemSnip").html())
		
		if (isJapanese) {
			jGridItemSnip.html(displayRubyTag($($(l_v).find("char")).text()))
		}else{
			jGridItemSnip.text($($(l_v).find("char")).text())
		}
		
		jGridItemSnip.attr("onclick", "loadLetter(" + l_i + ")")
		
		$("#idCharGrid").append(jGridItemSnip)
	})
	
	if($("body").attr("mode") == "warmup_07"
			|| $("body").attr("mode") == "warmup_07a"){
		loadLetter(0)
	}
	$("body").attr("intro", "true")
}

