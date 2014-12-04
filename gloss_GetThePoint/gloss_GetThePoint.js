disableStripNamespace = true;

$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "al_ecn004.xml";
	jsonFilename = mediaPath + "al_ecn004.js";
	cssFilename = "styles/gloss_GetThePoint.css";
	
	loadActivity(parseXml);
	
}); 

var jQREC;

function parseXml(t_xml){
    jQREC = $($(xml).find("DB > QREC")[params['stepIndex']-1])
	
	jQREC.find(" > *").each(function(i,v){
		$(v).text($(v).text().replace("<![CDATA[", "").replace("]]>", ""))
	})
	
	$("body").attr("mode", jQREC.find("A_Type").text())
	
	switch(jQREC.find("A_Type").text()){
		case "SUM":
			break;
		case "LGP":
			break;
		case "VGP":
			break;
	}
	
	//first line (to the right of the video window)
	$("#intro").html(jQREC.find("> NOTE").text())
	
	//Question text (SUM) - Transcript text (LGP)
	$("#question").html(jQREC.find("> QText").text())
	
	setTimeout(function(){showFeedback("instructions")}, 1000)

}


function playAudio(obj){
	var index = $(obj).closest(".wordContainer").index()
	var file_audio = $(
						$(
							$(
								$(xml).find("section")[currentSet]
							).find("item")[index]
						).find("file_audio")
					).text()
					
	audio_play_file(removeFileExt(file_audio), mediaPath);
}

var isJapanese = false

function setState(value){
	switch(value){
		case 'compair':
			generateStimulus()
			break;
	}
}

function reasonBtnClicked(index){
	showFeedback('reason', index)
}

function generateStimulus(){	
	$("#resultHTML").html("")
	
	var output = ""	
	var reasonIndex = 0
	jQREC.find("> *").each(function(i,v){
		switch($(v).prop("tagName")){
			case "STIMULUS":
				output += $('<div>').html($(v).html()).text()
				break;
			case "FB":
				var jReasonBtn = $($("#reasonBtn_snippet").html())
				jReasonBtn.attr("onclick", 
						"reasonBtnClicked(" + reasonIndex + ")")
				
				output += $('<div>').append(jReasonBtn).html()
				
				reasonIndex++
				break;
		}
	})
	
	//Quick way to decode html entities
	$("#resultHTML").html(output)
	
	$("#resultHTML").mCustomScrollbar("destroy");
	$("#resultHTML").mCustomScrollbar();
}

function showFeedback(value, textInput){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$('#feedback').attr("mode","")
	
	var text = "";
	if (!isJapanese) {
		text = textInput;
	}
	else {
		// To display ruby tag
		text = displayRubyTag(textInput);
	}
	
	switch(value){
		case "teachersNote":
			$("#feedbackHeader").html("Teacher's Note");
			$('#feedback').attr("mode","teachersNote")
			$("#feedbackText").html(jQREC.find("> POP_UP").text())
			break;
		case "instructions":
			$("#feedbackHeader").html("Instructions");
			$('#feedback').attr("mode","instructions")
			setFeedbackPage("tl")
			$("#tl_instructions").html(jQREC.find("> FL_INST").text())
			$("#en_instructions").html(jQREC.find("> XL_INST").text())
			break;
		case "guidelines":
			$("#feedbackHeader").html("Guidelines");
			$('#feedback').attr("mode","guidelines")
			$("#feedbackText").html(jQREC.find("> AID").text())
			break;
		case "reason":
			$("#feedbackHeader").html("Reason");
			$('#feedback').attr("mode","reason")
			$("#feedbackText").html($(jQREC.find("> FB")[textInput]).text())
			break;
		case "transcript":
			$("#feedbackHeader").html("Transcript");
			$('#feedback').attr("mode","transcript")
			$("#feedbackText").html(jQREC.find("> QText").text())
			break;
	}

	$('#feedback').show();
	$("#clickGuard").css("display","block")
	
	$("#feedbackText").mCustomScrollbar("destroy");
	$("#feedbackText").mCustomScrollbar();
}

function setFeedbackPage(value){
	switch(value){
		case "tl":
			$('#feedback').attr("page","tl")
			break;
		case "en":
			$('#feedback').attr("page","en")
			break;
	}
}
	
function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#feedback").hide();
	
	$("#en_instructions").html("");
	$("#tl_instructions").html("");

	$("#clickGuard").css("display","none");
}



