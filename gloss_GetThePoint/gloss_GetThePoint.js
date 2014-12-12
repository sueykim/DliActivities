disableStripNamespace = true;

$(document).ready(function() {
	audioInit()
	audioInit(2)
	
	testVideoSupport()
	
	loadjscssfile("../common/css/activityDefault.css", "css")
	
	//Default values (for testing)
	mediaPath = "sampleData/"
	xmlFilename = mediaPath + "al_ecn004.xml"
	jsonFilename = mediaPath + "al_ecn004.js"
	cssFilename = "styles/gloss_GetThePoint.css"
	
	loadActivity(parseXml)
}); 

var jQREC;
var disableSubDirectories = false
var audioVideoMediaDir = ""

function parseXml(t_xml){
	//Change to text and back to xml
	var fileText = new XMLSerializer().serializeToString(t_xml);
	fileText = fileText.replace(/src=(["'])Images\//g, "src=$1" + mediaPath + "Images/" )
	xml = $.parseXML(fileText)

	if(params['disableSubDirectories'] != undefined
			&& params['disableSubDirectories'] == "true"){
		disableSubDirectories = true;
	}
	
	if(params['audioVideoMediaDir'] != undefined){
		audioVideoMediaDir = params['audioVideoMediaDir'];
	}
	
	$("#titleLabel").text($($($(xml)
						.find("DB > QREC")[0])
						.find("FL_Title")[0]).text())
	
    jQREC = $($(xml).find("DB > QREC")[params['stepIndex']])
	
	jQREC.find(" > *").each(function(i,v){
		$(v).text($(v).text().replace("<![CDATA[", "").replace("]]>", ""))
	})
	
	
	$("body").attr("mode", jQREC.find("A_Type").text())
	
	switch(jQREC.find("A_Type").text()){
		case "SUM":
			break;
		case "LGP":
			var file_audio = $(jQREC.find("> AUD_STIMULUS")[0]).text()
			audio_play_file(removeFileExt(file_audio), mediaPath + audioVideoMediaDir, undefined, disableSubDirectories);
			$("#audioPlayer").attr("controls","")
			$("#audioPlayer")[0].pause()

			if(jQREC.find("> QText").text().length == 0){
				$("#transcriptBtn").css("display", "none")
			}
			
			break;
		case "VGP":
			var filename = $(jQREC.find("> VIDEO_CLIP")[0]).text()
			
			if(extractFileExt(filename) == "flv"){
				forceVidType = "flash"
			}
			
			loadVideoNoPlayYet("../gloss_GetThePoint/" + mediaPath + audioVideoMediaDir
							, removeFileExt(filename))

			if(jQREC.find("> QText").text().length == 0){
				$("#transcriptBtn").css("display", "none")
			}
			
			break;
	}
	
	//first line (to the right of the video window)
	$("#intro").html(jQREC.find("> NOTE").text())
	
	//Question text (SUM) - Transcript text (LGP)
	$("#question").html(jQREC.find("> QText").text())
	
	setTimeout(function(){showFeedback("instructions")}, 1000)

	if(jQREC.find("> POP_UP").text().length == 0){
		$("#teachersNoteBtn").css("display", "none")
	}
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
	
	//$("#resultHTML").mCustomScrollbar("destroy");
	//$("#resultHTML").mCustomScrollbar();
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
			$("#feedbackText").html("(Click text to switch language)")
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
			
			if(jQREC.find("> AUD_FB")[textInput] != undefined){
				var file_audio = $(jQREC.find("> AUD_FB")[textInput]).text()
				audio_play_file(removeFileExt(file_audio), mediaPath + audioVideoMediaDir,2, disableSubDirectories);
				$("#audioPlayer2")[0].pause()
				$("#audioPlayerContainer2").css("display", "block")
			}else{
				$("#audioPlayerContainer2").css("display", "none")
			}
			
			$("#audioPlayer2").attr("controls","controls")
			break;
		case "transcript":
			$("#feedbackHeader").html("Transcript");
			$('#feedback').attr("mode","transcript")
			$("#feedbackText").html(jQREC.find("> QText").text())
			break;
	}

	$('#feedback').show();
	$("#clickGuard").css("display","block")
	
	$("#feedbackTextContainer").mCustomScrollbar("destroy");
	$("#feedbackTextContainer").mCustomScrollbar();
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



