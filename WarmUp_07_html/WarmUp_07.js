$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "WarmUp_07_sampleData.xml";
	jsonFilename = mediaPath + "WarmUp_07_sampleData.js";
	cssFilename = "styles/WarmUp_07.css";
	
	loadActivity(parseXml);
	
}); 

function playAudio(value){	
	switch(value){
		case 'main':
			audio_play_file(removeFileExt($("body").attr("audio")),mediaPath)
			break;
		case 'ex1':
			audio_play_file(removeFileExt($("body").attr("ex1_audio")),mediaPath)
			break;
		case 'ex2':
			audio_play_file(removeFileExt($("body").attr("ex2_audio")),mediaPath)
			break;
	}
}

var numItems 

// For homework
var homeworkStatus;
var answerAttemptsNum = 0;

// To display ruby tag
var isJapanese = false;

function loadLetter(index){
	var l_v = $(xml).find("letter")[index]
	
	//Load fields
	$("body").attr("audio", $($(l_v).find("audio")).text())

	if($($(l_v).find("example")[0]).attr("dir").toLowerCase() == "rtl"){
		$("body").attr("dir", "rtl")
	}else{
		$("body").attr("dir", "ltr")
	}

	$("#idName").text($($(l_v).find("name")).text())
	$("#idChar").text($($(l_v).find("char")).text())
	$("#idDesc").html($($(l_v).find("desc")).text())

	var jEx1 = $($(l_v).find("example")[0])
	$("#idExample1En").text(jEx1.attr("en"))
	var regEx = new RegExp($($(l_v).find("char")).text(), "ig");
	var ex1Text = jEx1.text().replace(regEx, "<div class='highlight'>" 
										+ $($(l_v).find("char")).text().toLowerCase()
										+ "</div>")
	$("#idExample1").html(ex1Text)
	
	$("body").attr("ex1_audio", jEx1.attr("aud"))

	var jEx2 = $($(l_v).find("example")[1])
	$("#idExample2En").text(jEx2.attr("en"))
	var regEx2 = new RegExp($($(l_v).find("char")).text(), "ig");
	var ex2Text = jEx2.text().replace(regEx2, "<div class='highlight'>" 
										+ $($(l_v).find("char")).text().toLowerCase()
										+ "</div>")
	$("#idExample2").html(ex2Text)
	$("body").attr("ex2_audio", jEx2.attr("aud"))
	
	//Mark letter as being shown
	$($("#idCharGrid > .gridItem")[index]).attr("visited", "true")
	
	checkCompleted()
}

var activityCompletedShown = false

function checkCompleted(){
	if(!activityCompletedShown && 
			$("#idCharGrid > .gridItem:not([visited='true'])").length == 0){
		//Completed
		activityCompletedShown = true
		
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			alert("Activity Completed")
		}
	}
}

var isJapanese = false

function parseXml(t_xml){
	isJapanese = $(xml).find("content").attr("target_language") == "Japanese";
	
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
	
	loadLetter(0)
}

