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
	
	$(parent.document).find("body").attr("glossPageNav", "false")
	
	loadActivity(parseXml)
}); 

var jQREC;
var disableSubDirectories = false
var audioVideoMediaDir = ""
var filename

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
	
	$($(parent.document)
			.find("#main #taskAndStepPane_header > .title"))
					.text($($($(xml)
						.find("DB > QREC")[0])
						.find("FL_Title")[0]).text())
	
    jQREC = $($(xml).find("DB > QREC")[params['stepIndex']])
	
	jQREC.find(" > *").each(function(i,v){
		$(v).text($(v).text().replace("<![CDATA[", "").replace("]]>", ""))
	})
	
	var numQText = jQREC.find(" > NUM_Q").text()
	if(numQText != undefined){
		$("body").attr("secondaryAudio", "true")
	}
	
	$("body").attr("mode", jQREC.find("A_Type").text())
	
	switch(jQREC.find("A_Type").text()){
		case "SUM":
			break;
		case "LGP":
			var file_audio = $(jQREC.find("> AUD_STIMULUS")[0]).text()
			loadMainAudio(file_audio)
			
			if(jQREC.find("> QText").text().length == 0){
				$("#transcriptBtn").css("display", "none")
			}

			break;
		case "VGP":
			filename = $(jQREC.find("> VIDEO_CLIP")[0]).text()
			
			if(extractFileExt(filename) == "flv"){
				forceVidType = "flash"
			}
			
			//loadVideoNoPlayYet("../gloss_GetThePoint/" + mediaPath + audioVideoMediaDir
			//				, removeFileExt(filename))

			if(jQREC.find("> QText").text().length == 0){
				$("#transcriptBtn").css("display", "none")
			}
			
			break;
	}
	
	//first line (to the right of the video window)
	$("#introContent").html(jQREC.find("> NOTE").text())

	if(jQREC.find("> NOTE").attr("dir") == "rtl"){
		$("#introContent").attr("dir", "rtl")
	}
	
	//Question text (SUM) - Transcript text (LGP)
	$("#question").html(jQREC.find("> QText").text())

	if(jQREC.find("> QText").attr("dir") == "rtl"){
		$("#question").attr("dir", "rtl")
	}
	
	setTimeout(function(){showFeedback("instructions")}, 1000)

	if(jQREC.find("> POP_UP").text().length == 0){
		$("#teachersNoteBtn").css("display", "none")
	}

	setTimeout(setReady, 1000);
}

function setReady(){
	$("body").attr("ready", "true")
}

var isJapanese = false

function setState(value){
	switch(value){
		case 'compair':
			if($("#typeText").attr("state") != "intro" && 
					$("#typeText").text().length != 0){
				$("#container").attr("state", "compair")
				generateStimulus()
			}
	
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
	var firstTag = true
	jQREC.find("> *").each(function(i,v){
		switch($(v).prop("tagName")){
			case "STIMULUS":				
				if(firstTag){
					firstTag = false
				}else{
					output += "<hr/>"
				}
				
				var jAnswerLabel = $($("#answerLabel_snippet").html())
				jAnswerLabel.text(jAnswerLabel.text() + (reasonIndex + 1))

				output += $('<div>').append(jAnswerLabel).html()
				
				output += $('<div>').html($(v).text()).html()
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
	$("#feedbackBtn").text("X");
	$("#feedbackBtn").show();
	$('#feedback').attr("mode","")
	$("#feedbackText").attr("dir", "ltr")
	$("#tl_instructions").attr("dir", "ltr")


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

			if(jQREC.find("> POP_UP").attr("dir") == "rtl"){
				$("#feedbackText").attr("dir", "rtl")
			}

			break;
		case "instructions":
			$("#feedbackHeader").html("Instructions");
			$('#feedback').attr("mode","instructions")
			setFeedbackPage("tl")
			$("#feedbackText").html("<p class='centerInstructionSwitch'>(Click text to switch language)</p>")
			$("#tl_instructions").html(jQREC.find("> FL_INST").text())

			if(jQREC.find("> FL_INST").attr("dir") == "rtl"){
				$("#tl_instructions").attr("dir", "rtl")
			}

			$("#en_instructions").html(jQREC.find("> XL_INST").text())
			break;
		case "guidelines":
			$("#feedbackHeader").html("Guidelines");
			$('#feedback').attr("mode","guidelines")
			$("#feedbackText").html(jQREC.find("> AID").text())

			if(jQREC.find("> AID").attr("dir") == "rtl"){
				$("#feedbackText").attr("dir", "rtl")
			}

			break;
		case "reason":
			$("#feedbackHeader").html("Reason");
			$('#feedback').attr("mode","reason")
			$("#feedbackText").html($(jQREC.find("> FB")[textInput]).text())

			
			if($(jQREC.find("> FB")[textInput]).attr("dir") == "rtl"){
				$("#feedbackText").attr("dir", "rtl")
			}
			
			if(jQREC.find("> AUD_FB")[textInput] != undefined){
				var file_audio = $(jQREC.find("> AUD_FB")[textInput]).text()
				audio_play_file(removeFileExt(file_audio), mediaPath + audioVideoMediaDir,2, disableSubDirectories);
				$("#audioPlayer2")[0].pause()
				$("#audioPlayerControls2").css("display", "block")
			}else{
				$("#audioPlayerControls2").css("display", "none")
			}
			
			var controls2 = new DliAudioPlayerControls("audioPlayer2","audioPlayerControls2")
			//$("#audioPlayer2").attr("controls","controls")
			break;
		case "transcript":
			$("#feedbackHeader").html("Transcript");
			$('#feedback').attr("mode","transcript")
			$("#feedbackText").html(jQREC.find("> QText").text())

			if(jQREC.find("> QText").attr("dir") == "rtl"){
				$("#feedbackText").attr("dir", "rtl")
			}
			
			break;
	}

	$('#feedback').show();
	$("#clickGuard").css("display","block")
	
	//$("#feedbackTextContainer").mCustomScrollbar("destroy");
	//$("#feedbackTextContainer").mCustomScrollbar();
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

	$("#audioPlayer2")[0].pause()
}

function resetTextArea(){
	$("#typeText").text("")
}

function startTyping(){
	if($("#typeText").attr("state") == "intro"){
		$("#typeText").text("")
		$("#typeText").attr("state", "started")
	}
}

function collapseIntroBtn_clicked(){
	if($("body").attr("show_intro") != undefined &&
			$("body").attr("show_intro") == "true"){
		$("body").attr("show_intro","false")
	}else{
		$("body").attr("show_intro","true")
	}
	
	//alert('clicked')
}

function playVideo(){
	var activityDirName = "gloss_GetThePoint"

	if(params['mediaAbsolutePath'] != undefined){
		activityDirName = undefined
	}

	loadVideoNoPlayYet(mediaPath + audioVideoMediaDir
					, removeFileExt(filename)
					, activityDirName
					,disableSubDirectories)
					
	$("#playbtn").attr("class", "hidden")
}

function primaryAudioBtnClick(){
	var file_audio = $(jQREC.find("> AUD_STIMULUS")[0]).text()
	loadMainAudio(file_audio)
}

function secondaryAudioBtnClick(){
	var file_audio = $(jQREC.find("> AUD_STIMULUS")[1]).text()
	loadMainAudio(file_audio)
}

function loadMainAudio(file_audio){
	audio_play_file(removeFileExt(file_audio), mediaPath + audioVideoMediaDir, undefined, disableSubDirectories);
	
	$("#audioPlayer")[0].pause()

	var controls1 = new DliAudioPlayerControls("audioPlayer","audioPlayerControls")

	$("#audioPlayerControls").css("display", "block")
}