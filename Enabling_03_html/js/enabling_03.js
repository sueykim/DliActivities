var gXmlEnable03; // hold Dom elements of xml file
var gCurrentSet = 0; // hold current set in Activity
var gTotalItems; // hold all number item element in the activity.
var gTotalItemsCompleted=0; // hold the number items are completed.
var gTotalItemsCorrected=0;
var gTotalSetNumber;
var holdTimeout;
var isJapanese = false; // To display ruby tag
var theTLinputField_id;
var capitalOn= false;
var finalScore=0;

	//loading initial stuff for this activity.
$(document).ready(function () {
    initEnable03();
});

	// create divs which are used later in this activity
function initEnable03() {
    var enable03Div = document.createElement("div");
    enable03Div.id = "enable03Div";
    document.getElementById('HTML5').appendChild(enable03Div);
				//main panel
			var mainContent =document.createElement("div");
			mainContent.id ="mainContent";
			enable03Div.appendChild(mainContent);
			
			var content =document.createElement("div");
			content.id ="content";
			mainContent.appendChild(content);
			
			var bottomContainer =document.createElement("div");
			bottomContainer.id ="bottomContainer";
			
			mainContent.appendChild(bottomContainer);
			
			var keyboardContainer =document.createElement("div");
			keyboardContainer.id ="keyboardContainer";
			keyboardContainer.className="roundCorners unselected";
			bottomContainer.appendChild(keyboardContainer);
			
			var feedbackPanel =document.createElement("div");
			feedbackPanel.id ="feedbackPanel";
			feedbackPanel.innerHTML="<div class='feedbackTitle'></div><div class='feedbackContent'></div><button id='okBtn'>OK</button>";
			bottomContainer.appendChild(feedbackPanel);
			
			//retain the next/previous button
			var setButton =document.createElement("div");
			setButton.id ="setBtn";
				var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
			string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
			string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
			string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
			string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
			string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button></div>';
			setButton.innerHTML=string;
			enable03Div.appendChild(setButton);

			
	
  			//HTML5 Audio holder
    		var audioPlayer = document.createElement("div");
    		audioPlayer.id = "htmlAudioPlayerDiv";
    		enable03Div.appendChild(audioPlayer);

    		//Flash Audio holder
    		var flashAudio = document.createElement("div");
    		flashAudio.id = "flashAudioPlayerDiv";
    		enable03Div.appendChild(flashAudio);
	
			//Flash Audio holder
    		var embeddedAudio = document.createElement("div");
    		embeddedAudio.id = "embeddedAudioPlayerDiv";
    		enable03Div.appendChild(embeddedAudio);
		
    		//location of folder where place resources files 
    		cssFilename = "css/enabling_03.css"; //css url
  
		// Values from URL parameters or default values for testing
	//var statusParameters = getPassedParameters();
	//if (!statusParameters) {
			 mediaPath 	= "activityData/media/";
			 xmlPath 	= "activityData/";
			xmlFilename =   xmlPath  + "xml/enabling_03.xml"; //xml url
			jsonFilename = xmlPath  + "json/enabling_03.js"; //json file url
		//keyboardFilename = xmlPath  + "json/keyboard.js";
	/*   }
	 else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
	} */
	
    // load xml 
    loadActivity(parseXml);

} // end initEnable03()

	//parsing xml file
function parseXml(t_xml) {
    gXmlEnable03 = t_xml; //global variable to hold xml file after parsing it.
	
	homeworkStatus = $(gXmlEnable03).find("content").attr("hw"); // true for homework and undefined for regular
	
	isJapanese = $(gXmlEnable03).find("content").attr("target_language") == "Japanese"; // true is Japanese
	
	gTotalSetNumber = $(gXmlEnable03).find("session").length; // total set
	gTotalItems= $(gXmlEnable03).find("item").length
	//$(gXmlEnable03).find("session").shuffle(); // random sets inside activity
	
	 $("#prev").click(function () { //load the set when buttons is clicked
		 	if (document.getElementById('audioPlayer'))
					document.getElementById('audioPlayer').pause();
		 		 if ($("#next").attr("disabled"))
		 				$("#next").removeAttr("disabled");
				if (gCurrentSet > 0) {
            			gCurrentSet --;
						if (gCurrentSet == 0) 
					 		$(this).attr("disabled", "disabled");
           				 loadSet();
				} else
						$(this).attr("disabled", "disabled");
        });
		
	$("#next").click(function () { //load the set when buttons is clicked
	 		if (document.getElementById('audioPlayer'))
					document.getElementById('audioPlayer').pause();
					if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
		      	if (gCurrentSet < (gTotalSetNumber-1)) {
            			gCurrentSet ++;
						if (gCurrentSet == (gTotalSetNumber-1)) 
						 		$(this).attr("disabled", "disabled");
           						loadSet();
			   }
    });
	
	loadSet();
	audioInit();
} //end parseXml(t_xml)

	// loading the set for this activity
function loadSet() {
	  if (gCurrentSet == 0){ 
				 $("#prev").attr("disabled", "disabled");
				  if ($("#next").attr("disabled"))
		 				$("#next").removeAttr("disabled");
	  }
		if (gCurrentSet == (gTotalSetNumber-1)) 
						 		$("#next").attr("disabled", "disabled");
	
	$("#setText").html((gCurrentSet+1) + '/' + gTotalSetNumber);
	$("#content").html("");
	
	
	if ($(gXmlEnable03).find("content").attr("phase_1") =="completed")
	 loadPart2ForEnabling03();
	else if ($(gXmlEnable03).find("content").attr("phase_2") =="completed") 
	    loadPart3ForEnabling03();
else
loadPart1ForEnabling03();	
	
}


function loadPart1ForEnabling03() {
		$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	var index=0;
	$(mSetElem).find("item").each(function(){
	var itemContainer =document.createElement("div");
			itemContainer.className ="itemContainer";
			document.getElementById("content").appendChild(itemContainer);
			if (index == ($(mSetElem).find("item").length-1)) {
			$(itemContainer).css({"margin":"0px" });
			
			}
			var audioBtn =document.createElement("img");
			audioBtn.className ="audioBtn";
			audioBtn.setAttribute("src","images/play_btn.png");
			itemContainer.appendChild(audioBtn);
			var file = $(this).find("lang_tl_phrase_audio").text().split(".");
		//	$( audioBtn ).unbind();
	$(audioBtn).click(function() {
		$(this).attr("src","images/play_btn_on.png");
		 audio_play_file(file[0], mediaPath);
	     	
	});
	$(audioBtn).mouseout(function() { 
		 	$(this).attr("src","images/play_btn.png");
	 	});
			var contentContainer =document.createElement("div");
			contentContainer.className ="contentContainer";
			itemContainer.appendChild(contentContainer);
			
			var tlContainer =document.createElement("div");
			    tlContainer.className ="targetContainer";
			     contentContainer.appendChild(tlContainer);
				 $(tlContainer).css({"top":"10px" });
			var option = [];
				  	if (!isJapanese){ 
						option.push($(this).find("lang_tl_word_text").text());
						option.push($(this).find("distractor_1").text());
			   			option.push($(this).find("distractor_2").text());
					}
					else { 			// To display ruby tag
					   option.push(displayRubyTag($(this).find("lang_tl_word_text").text()));
					   option.push(displayRubyTag($(this).find("distractor_1").text()));
			   		   option.push(displayRubyTag($(this).find("distractor_2").text()));
					}
				
			   
			var selectHtml='<select id="selectInput'+ index +'"><option value="0"></option>';
			var hatA = new randomNumbers(option.length); //to randomize the choices
			
		var max=0;
		for(var i=0; i<option.length; i++){
				var a = hatA.get();
				var test =document.createElement("div");
					test.id ="test";
					test.style.position="absolute";
			        test.innerHTML=option[a];
			        tlContainer.appendChild(test);
				if (max < $("#test").outerWidth(true)) 
					max =$("#test").outerWidth(true);
					
					tlContainer.innerHTML="";
					
			selectHtml += '<option value="' + option[a] + '">' + option[a] + '</option>';
		} 
		selectHtml += '</select>';
		max = (max+60);
		var targetPhrase = $(this).find("lang_tl_phrase_text").text().split("||");
		var targetDir= $(this).find("lang_tl_phrase_text").attr("dir");
		
				 if (targetDir.toLowerCase() =="ltr") {
					$(".audioBtn, .contentContainer").css({"float":"left", "margin":"0px" });
					$(".audioBtn").css({ "margin":"0px 10px 0px 0px" });
				 }
				else {
					$(".audioBtn, .contentContainer").css({"float":"right", "margin":"0px" });
					$(".audioBtn").css({ "margin":"0px 0px 0px 10px" });
				}
		
		for(var i=0; i<targetPhrase.length; i++){
			var targetLang =document.createElement("div");
				targetLang.className="targetLang";
				targetLang.setAttribute("dir",targetDir);
			    tlContainer.appendChild(targetLang);
				targetLang.style.position="absolute";
				 	if (!isJapanese) 
					targetLang.innerHTML= targetPhrase[i];
					else 			// To display ruby tag
					targetLang.innerHTML= displayRubyTag(targetPhrase[i]);
					
				
				var width= $(targetLang).outerWidth(true);
				if (targetPhrase[i].toLowerCase().replace(".","") == $(this).find("lang_tl_word_text").text().toLowerCase())  { 
						targetLang.innerHTML= selectHtml;
				   		var width = max+ "px";
				}
				else {
						if (!isJapanese) 
							targetLang.innerHTML= targetPhrase[i];
						else 			// To display ruby tag
							targetLang.innerHTML= displayRubyTag(targetPhrase[i]);
			      	 	var width= ($(targetLang).outerWidth(true)+5)+ "px";
				}
						
				 if (targetDir.toLowerCase() =="ltr")
					$(targetLang).css({"position":"relative","margin":"0px 5px 0px 0px", "float":"left" });
				else
					$(targetLang).css({"position":"relative", "margin":"0px 5px 0px 5px", "float":"right"});
		}
		

if (targetDir.toLowerCase() =="ltr")
$("#selectInput"+ index).select2({minimumResultsForSearch: -1, width: max, dropdownCssClass: "floatLeft"});
else 
$("#selectInput"+ index).select2({minimumResultsForSearch: -1, width: max,  dropdownCssClass: "floatRight"});
$("#selectInput"+ index).on("select2-open", function() {$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");});

	$("#selectInput"+ index).on("change", function() {
		$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
		var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
		var index =parseInt($(this).attr("id").replace("selectInput", ""));


var answer = $(this).val();

		if ($($(mSetElem).find("item")[index]).attr("numberTry"))
			$($(mSetElem).find("item")[index]).attr("numberTry", parseInt($($(mSetElem).find("item")[index]).attr("numberTry")) +1);
		else
		    $($(mSetElem).find("item")[index]).attr("numberTry", "1");
		//correct select
	if ($(this).val().toLowerCase() == ($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text().toLowerCase())) {
		
		if (!isJapanese) 
					$(this).select2("val", $($(mSetElem).find("item")[index]).find("lang_tl_word_text").text());
					else 			// To display ruby tag
					$(this).select2("val", displayRubyTag($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text()));
					
		$($(mSetElem).find("item")[index]).attr("partOne", "completed");
		$(this).select2("enable", false);
		gTotalItemsCompleted++;
                gTotalItemsCorrected++;
		showFeedback("correct", index);
		
	} else {// incorrect select
			if (parseInt($($(mSetElem).find("item")[index]).attr("numberTry")) >1) {
				
				if (!isJapanese) 
					$(this).select2("val", $($(mSetElem).find("item")[index]).find("lang_tl_word_text").text());
				else 			// To display ruby tag
					$(this).select2("val", displayRubyTag($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text()));
					
				$($(mSetElem).find("item")[index]).attr("partOne", "completed");
				$(this).select2("enable", false);
				gTotalItemsCompleted++;
			}
			else
				$(this).select2("val", "");
				
			showFeedback("incorrect", index);
	}



                                     var score =  Math.ceil(((gTotalItemsCorrected/$(gXmlEnable03).find("item").length)/3)*100);

if (gTotalItemsCompleted == gTotalItems) {
finalScore+= score;


}




        //For Homework
					if (homeworkStatus) {
							var questionID = "Part# 1 Set# " + (gCurrentSet+1)  + " Item# " + (index+1);
							
							
								if (!isJapanese) 
										var context = $($(mSetElem).find("item")[index]).find("lang_tl_word_text").text();
								else 			// To display ruby tag
										var context = displayRubyTag($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text());
					  
							var answerAttempts = "Score: " + score + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);

							// To pass logs
							logStudentAnswer(questionID, answer, context);
							logStudentAnswerAttempts(questionID, score);
				
					}





	
	}); 
		
			var word = $.trim($(this).find("lang_en_word_text").text()); 
			var engPhrase;
			var wordPos = $(this).find("lang_en_word_order").text().split(","); 
			if (wordPos.length >1) {
				var textArray = $.trim($(this).find("lang_en_phrase_text").text()).split(" ");
				for(var i=0; i<wordPos.length; i++){
						var pos = parseInt($.trim(wordPos[i]))-1;
						if (textArray[pos])
			    			textArray[pos] = "<i>"+textArray[pos] +"</i>";
				}
				engPhrase = textArray.join(" ");
			}else {
				   var textArray = $.trim($(this).find("lang_en_phrase_text").text());
				   engPhrase= textArray.replace(word,"<i>"+word +"</i>"); 
			}
			  
			var engContainer =document.createElement("div");
			engContainer.className ="englishContainer";
			engContainer.innerHTML =engPhrase;
			engContainer.style.position="absolute";
			contentContainer.appendChild(engContainer);
			var width= ($(engContainer).outerWidth(true)+5)+ "px";
		  if (targetDir.toLowerCase() =="ltr")
					$(engContainer).css({"position":"relative","margin":"0px 5px 0px 0px", "float":"left" });
				else
					$(engContainer).css({"position":"relative", "margin":"0px 5px 0px 5px", "float":"right"});
			
			if ($(this).attr("partOne") && ($(this).attr("partOne")== "completed")) {
					if (!isJapanese) 
							$("#selectInput"+ index).select2("val", $(this).find("lang_tl_word_text").text());
					else  // To display ruby tag
							$("#selectInput"+ index).select2("val", displayRubyTag($(this).find("lang_tl_word_text").text()));
									
					
					$("#selectInput"+ index).select2("enable", false);
			}
				
    		//<div id="keyboardContainer" class="roundCorners unselected"></div>
	index++;
	
	}); // end $(mSetElem).find("phrase").each
	
	
	if(index >4) {
			$("#content").height(420);
			$("#content").css({"overflow":"auto"});
			$("#content").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
		$("#mainContent").height(585);
	
	} else {
		var h= (110 * (index));
		$("#content").height(h-30);
		$("#mainContent").height(h+155);
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



function showFeedback(type, index) {
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	 $(".feedbackTitle, .feedbackContent, #okBtn").css("display","block");
	
if(type =="incorrect") {
 	 $(".feedbackTitle").html("<img src='images/feedback_incorrect.png'/>");
	  if(parseInt($($(mSetElem).find("item")[index]).attr("numberTry")) == 1)
	 		$(".feedbackContent").html("<div class='hintTitle'>Hint:</div><div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("hint_layer_1").text() +"</div>");
	 else
	  		if (gTotalItemsCompleted == gTotalItems) {
	 				$(".feedbackContent").html("<div class='hintTitle'>The correct answer is:</div><div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_1").text() +"</div><div class='setCompleted'>You finished one part of this activity. Please click \'OK\' button to continue other parts.</div>");
					$("#prev").attr("disabled", "disabled");
			}
	  		else
				 	$(".feedbackContent").html("<div class='hintTitle'>The correct answer is:</div><div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_1").text() +"</div>");
}
if(type =="correct") {
 	 $(".feedbackTitle").html("<img src='images/feedback_correct.png'/>");
	 if (gTotalItemsCompleted == gTotalItems) {
	 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_1").text() +"</div><div class='setCompleted'>You finished one part of this activity. Please click \'OK\' button to continue other parts.</div>");
	 $("#prev").attr("disabled", "disabled");
	 }
	 else
	 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_1").text() +"</div>");
}
if (gTotalItemsCompleted == gTotalItems) {
	$(gXmlEnable03).find("content").attr("phase_1", "completed");
	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","block");
}

 $( "#okBtn" ).unbind( "click" );
 $( "#okBtn" ).click(function() { 
  
		 	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
			if ($(gXmlEnable03).find("content").attr("phase_1") =="completed") {
				gCurrentSet =0;
				gTotalItemsCorrected=0;
				gTotalItemsCompleted=0;
				loadSet();
			}



 });

}
 
function loadPart2ForEnabling03() {
	$("#setText").html((gCurrentSet+1) + '/' + gTotalSetNumber);
	$("#content").html("");
	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	var index=0;
	var max=0;
	$(mSetElem).find("item").each(function(){
	var itemContainer =document.createElement("div");
			itemContainer.className ="itemContainer";
			document.getElementById("content").appendChild(itemContainer);
			if (index == ($(mSetElem).find("item").length-1)) {
			$(itemContainer).css({"margin":"0px" });
			
			}
			//parse Target language
			var targetDir= $(this).find("lang_tl_phrase_text").attr("dir");
			var targetContainerPhase2 =document.createElement("div");
			    targetContainerPhase2.className ="targetContainerPhase2";
			    itemContainer.appendChild(targetContainerPhase2);
				 if (targetDir.toLowerCase() =="ltr") 
					$(targetContainerPhase2).css({"font-size":"16px"});
				 else 
					$(targetContainerPhase2).css({"font-size":"19px"});
				 var phrase = $.trim($(this).find("lang_tl_phrase_text").text()); 
		     	var textArray = phrase.split("||"); 
			 	for(var i=0; i<textArray.length; i++){
						if (textArray[i].toLowerCase().replace(".","") == $(this).find("lang_tl_word_text").text().toLowerCase()) {
							if (targetDir.toLowerCase() =="ltr")
								if (!isJapanese) 
									textArray[i] = "<div  class='targetItalicLTR' dir='"+ targetDir +"' style='float:left; margin:0px 6px 0px 0px;'>" +textArray[i] +"</div>";
								else  // To display ruby tag
									textArray[i] = "<div  class='targetItalicLTR' dir='"+ targetDir +"' style='float:left; margin:0px 6px 0px 0px;'>" +displayRubyTag(textArray[i]) +"</div>";
			    			
							else
							textArray[i] = "<div class='targetItalicRTL' dir='"+ targetDir +"' style='float:right; margin:0px 6px 0px 0px;'>" +textArray[i] +"</div>";
							//textArray[i] =textArray[i] ;
						} else {
							if (targetDir.toLowerCase() =="ltr")
								if (!isJapanese) 
										textArray[i] = "<div dir='"+ targetDir +"' style='float:left; margin:0px 6px 0px 0px;'>" +textArray[i] +"</div>";
								else  // To display ruby tag
								   		textArray[i] = "<div dir='"+ targetDir +"' style='float:left; margin:0px 6px 0px 0px;'>" +displayRubyTag(textArray[i]) +"</div>";
								
							else
							textArray[i] = "<div dir='"+ targetDir +"' style='float:right; margin:0px 6px 0px 0px;'>" +textArray[i] +"</div>";
						}
				}
			   var targetPhrase = textArray.join(" ");
			
			targetContainerPhase2.innerHTML =targetPhrase;
			
			//parse English  language
		 		var englishContainerPhase2 =document.createElement("div");
			    englishContainerPhase2.className ="englishContainerPhase2";
			     itemContainer.appendChild(englishContainerPhase2);
				 $(englishContainerPhase2).css({"top":"10px" });
				 
				 var english =document.createElement("div");
			         englishContainerPhase2.appendChild(english);
				var engWords = $(this).find("lang_en_phrase_text").text().split(" ");
				 		for(var i=0; i<engWords.length; i++){
							var engLang =document.createElement("div");
							engLang.style.cssFloat="left";
							if (i < engWords.length -1)
							engLang.style.margin="0px 5px 0px 0px";
							else
							engLang.style.margin="0px";
			    			english.appendChild(engLang);
							engLang.innerHTML= $.trim(engWords[i]);
							var width= $(engLang).width();
							if ($.trim(engWords[i]).toLowerCase().replace(".","") == $(this).find("lang_en_word_text").text().toLowerCase()) {
								if ( max <width) 
								max = width;
								if ($(this).attr("textbox")) {
								engLang.innerHTML="";  
				                engLang.innerHTML= '<input type="text" id="textbox' + index + '" value="' +$(this).attr("textbox")+'"/>';
								} else
								 {
								engLang.innerHTML="";  
				                engLang.innerHTML= '<input type="text" id="textbox' + index + '"/>';
								}
				
				            } 
							
						width= width +"px";
				$(engLang).width(width);
				
							
	}//end for loop
	if ($(this).attr("part2")) {
					$("#textbox"+index).attr("disabled", "disabled");
					
						 $("#textbox"+index).val($(this).find("lang_en_word_text").text());
					
	}
						
				
	 var checkBtn =document.createElement("button");
					 checkBtn.id="checkBtn" + index ;
					 checkBtn.className="checkBtn";
					 checkBtn.innerHTML="Check";
					
					 english.appendChild(checkBtn);
					  if ($(this).attr("textbox"))
					      $(checkBtn).css({ "margin": "0px 0px 0px 25px", "display":"block"});
					  else
					  		$(checkBtn).css({ "margin": "0px 0px 0px 25px", "display":"none"});
					if ($(this).attr("part2")) 
						$(checkBtn).css({ "margin": "0px 0px 0px 25px", "display":"none"});
						$(checkBtn).click(function() {  
						gTotalItemsCompleted++;

										var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
										var index = parseInt($(this).attr("id").replace("checkBtn", ""));
    								 	var textbox = "#textbox" + index;
										var textboxValue = $.trim($(textbox).val()).toLowerCase();
						 var engWord =  $($(mSetElem).find("item").eq(parseInt(index))).find("lang_en_word_text").text();
						 $(textbox).val(engWord);
						engWord= engWord.toLowerCase();
						 $(textbox).attr("disabled", "disabled");
						 $(this).css({ "margin": "0px 0px 0px 25px", "display":"none"});
						 $(mSetElem).find("item").eq(parseInt(index)).attr("part2", "completed");
						if (textboxValue == engWord)  {
							showFeedbackForPhase2("correct", index);
							gTotalItemsCorrected++;
						}

						else 
							showFeedbackForPhase2("incorrect", index);



                                    var score =  Math.ceil(((gTotalItemsCorrected/$(gXmlEnable03).find("item").length)/3)*100);
                   score +=finalScore;
score = Math.ceil(score);

if (gTotalItemsCompleted == gTotalItems)
finalScore = score;

        				//For Homework
					if (homeworkStatus) {
							var questionID =  "Part# 2 Set# " + (gCurrentSet+1)  + " Item# " + (index+1);
							var answer = textboxValue;
							var context = engWord;
							
							var answerAttempts = "Score: " + score  + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);

							// To pass logs
							logStudentAnswer(questionID, answer, context);
							logStudentAnswerAttempts(questionID, score );
				
					}
						});	
							
							
							
			        english.style.position="relative";
				 if (targetDir.toLowerCase() =="ltr") {
					$(english).css({"margin":"0px", "float":"left"});
				 }
				else {
					
					$(english).css({ "margin":"0px", "float":"right"});
				}
				 
index++;
});
max=max +25;
$("input[type='text']").width(max);
$("input[type='text']").parent().width(max);
$("input[type='text']").addClass('inputTextbox');
$("input[type='text']").keyup(function() {
	 var index= $(this).attr("id").replace("textbox", "");
     var checkBtn ="#checkBtn" + index;  
 if ($.trim($(this).val()) != ""){
	
	 $(checkBtn).css({ "margin": "0px 0px 0px 25px", "display":"block"});
	 $(mSetElem).find("item").eq(parseInt(index)).attr("textbox", $.trim($(this).val()));
 
 } else {
     
	 $(checkBtn).css({ "margin": "0px 0px 0px 25px", "display":"none"});
	 if ( $(mSetElem).find("item").eq(parseInt(index)).attr("textbox"))
	 $(mSetElem).find("item").eq(parseInt(index)).removeAttr("textbox");
 
 }

 
 });
 $("input[type='text']").keydown(function() {
	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	 });
if(index >4) {
			$("#content").height(420);
			$("#content").css({"overflow":"auto"});
			$("#content").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
		$("#mainContent").height(585);
	
	} else {
		var h= (110 * (index));
		$("#content").height(h-30);
		$("#mainContent").height(h+155);
	}
}// end function loadPart2ForEnabling03() 
function showFeedbackForPhase2(type, index) {
	 var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	 $(".feedbackTitle, .feedbackContent, #okBtn").css("display","block");
	
if(type =="incorrect") {
 	 $(".feedbackTitle").html("<img src='images/feedback_incorrect.png'/>");
	 if (gTotalItemsCompleted == gTotalItems) {
			 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_2").text() +"</div><div class='setCompleted'>You finished two parts of this activity. Please click \'OK\' button to continue the last part.</div>");
			 $("#prev").attr("disabled", "disabled");
	 }
	 else
	 		 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_2").text() +"</div>");
}
if(type =="correct") {
 	 $(".feedbackTitle").html("<img src='images/feedback_correct.png'/>");
	 if (gTotalItemsCompleted == gTotalItems) {
	 		$(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_2").text() +"</div><div class='setCompleted'>You finished two parts of this activity. Please click \'OK\' button to continue the last part.</div>");
			$("#prev").attr("disabled", "disabled");
	 }
	 else
			 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_2").text() +"</div>");
}

if (gTotalItemsCompleted == gTotalItems) {
	$(gXmlEnable03).find("content").removeAttr("phase_1");
	$(gXmlEnable03).find("content").attr("phase_2", "completed");
	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","block");
}
 $( "#okBtn" ).unbind( "click" );
 $( "#okBtn" ).click(function() {  
		 	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
			if ($(gXmlEnable03).find("content").attr("phase_2") =="completed") { 
			gCurrentSet =0;
			gTotalItemsCompleted=0;
			gTotalItemsCorrected=0;
				loadSet();
			}

 });

}//end function loadPart2ForEnabling03() 
function loadPart3ForEnabling03() {
	theTLinputField_id="";
		$("#setText").html((gCurrentSet+1) + '/' + gTotalSetNumber);
	$("#content").html("");
	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	var index=0;
	var max=0;
	$(mSetElem).find("item").each(function(){
		var targetDir= $(this).find("lang_tl_phrase_text").attr("dir");
		var itemContainer =document.createElement("div");
			itemContainer.className ="itemContainer";
			document.getElementById("content").appendChild(itemContainer);
			if (index == ($(mSetElem).find("item").length-1)) {
			$(itemContainer).css({"margin":"0px" });
			
			} else
			$(itemContainer).css({"margin":"15px 0px 20px 0px" });
			
			
		
			var audioBtn =document.createElement("img");
			audioBtn.className ="audioBtn";
			audioBtn.setAttribute("src","images/play_btn.png");
			itemContainer.appendChild(audioBtn);
			$('#audioBtn').unbind('click');
			var file = $(this).find("lang_tl_phrase_audio").text().split(".");
	 $(audioBtn).click(function() {
		$(this).attr("src","images/play_btn_on.png");
		 audio_play_file(file[0], mediaPath);
	     	
	});
	$(audioBtn).mouseout(function() { 
		 	$(this).attr("src","images/play_btn.png");
	 	});
			var tlContainer =document.createElement("div");
			tlContainer.className ="targetContainerPart3";
			itemContainer.appendChild(tlContainer);
				 if (targetDir.toLowerCase() =="ltr") {
					$(".audioBtn, .targetContainerPart3").css({"float":"left", "margin":"0px" });
					$(".audioBtn").css({ "margin":"0px 10px 0px 0px" });
				 }
				else {
					$(".audioBtn, .targetContainerPart3").css({"float":"right", "margin":"0px" });
					$(".audioBtn").css({ "margin":"0px 0px 0px 10px" });
				}
		var targetPhrase = $(this).find("lang_tl_phrase_text").text().split("||");
		for(var i=0; i<targetPhrase.length; i++){
			var targetLang =document.createElement("div");
				targetLang.className="targetLang";
				targetLang.setAttribute("dir",targetDir);
			    tlContainer.appendChild(targetLang);
				targetLang.style.position="absolute";
					if (!isJapanese) 
						targetLang.innerHTML= targetPhrase[i];
					else  // To display ruby tag
						targetLang.innerHTML= displayRubyTag(targetPhrase[i]);
								   		
				
				var width= $(targetLang).width();
				if (targetPhrase[i].toLowerCase().replace(".","") == $(this).find("lang_tl_word_text").text().toLowerCase())  { 
				              if ( max <width) 
								max = width;
					$( targetLang ).remove();
					var audioBtnSmall =document.createElement("img");
					audioBtnSmall.className ="audioBtnSmall";
					audioBtnSmall.setAttribute("src","images/btn_play_sm_off.png");
					tlContainer.appendChild(audioBtnSmall);
					var file1 = $(this).find("lang_tl_word_audio").text().split(".");
					$( audioBtnSmall ).unbind();
					$(audioBtnSmall).click(function() {
							$(this).attr("src","images/btn_play_sm_on.png");
		 					audio_play_file(file1[0], mediaPath);
	     	
					});
					$(audioBtnSmall).mouseout(function() { 
		 					$(this).attr("src","images/btn_play_sm_off.png");
	 				});
							
					var targetLang =document.createElement("div");
						targetLang.className="targetLang";
						tlContainer.appendChild(targetLang);
								 			
				if ($(this).attr("textboxPart3")) 
						targetLang.innerHTML = '<input type="text" id="textbox' + index + '" value="' +$(this).attr("textboxPart3")+'"/>';
				else
					    targetLang.innerHTML= '<input type="text" id="textbox' + index + '"/>';
								
				
				   		 width = max+ "px";
				}
				else {
						
			      	 	width= ($(targetLang).outerWidth(true)+5)+ "px";
				}
					 
					
					 
				 if (targetDir.toLowerCase() =="ltr"){
					 $(targetLang).css({"position":"relative","margin":"0px 5px 0px 0px", "float":"left", "width":width+"px", "font-size":"16px", "top":"10px" });
					$(audioBtnSmall).css({ "margin":"0px", "float":"left" });
				$("#textbox"+index).css({"dir":"ltr", "font-size":"16px"});
					
				 }
				else{
					$(targetLang).css({"position":"relative", "margin":"0px 5px 0px 5px", "float":"right", "width":width+"px", "font-size":"19px", "top":"10px"});
					$(audioBtnSmall).css({"margin":"0px", "float":"right"});
					$("#textbox"+index).css({"dir":"rtl",  "font-size":"19px"});
					
				}
		}
		
			if ($(this).attr("part3")) {
					$("#textbox"+index).attr("disabled", "disabled");
					if (!isJapanese) 
						 $("#textbox"+index).val($(this).find("lang_tl_word_text").text());
					else  // To display ruby tag
					     $("#textbox"+index).val(displayRubyTag($(this).find("lang_tl_word_text").text()));
				
						
					
	}
		 var checkBtn =document.createElement("button");
					 checkBtn.id="checkBtn" + index ;
					 checkBtn.className="checkBtn";
					 checkBtn.innerHTML="Check";
					 $(checkBtn).click(function() {  
									 var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
										var index = parseInt($(this).attr("id").replace("checkBtn", ""));
    								 	var textbox = "#textbox" + index;
										if ($($(mSetElem).find("item")[index]).attr("numberTryPart3"))
											$($(mSetElem).find("item")[index]).attr("numberTryPart3", parseInt($($(mSetElem).find("item")[index]).attr("numberTryPart3")) +1);
										else
		    								$($(mSetElem).find("item")[index]).attr("numberTryPart3", "1");
											
											var textboxValue = $.trim($(textbox).val()).toLowerCase();
											if (textboxValue == ($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text().toLowerCase())) {
		
													$($(mSetElem).find("item")[index]).attr("part3", "completed");
													 $(textbox).attr("disabled", "disabled");
													 $('#'+theTLinputField_id).unbind( "click" );
													 theTLinputField_id = null;
													 $(this).css({ "display":"none"});
													 	if (!isJapanese) 
						   										$(textbox).val($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text());
														else  // To display ruby tag
														  		$(textbox).val(displayRubyTag($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text()));
					    								gTotalItemsCompleted++;
														gTotalItemsCorrected++;
														showFeedbackPart3("correct", index);
		
	                                            } else {// incorrect select
															if (parseInt($($(mSetElem).find("item")[index]).attr("numberTryPart3")) >1) {
																$($(mSetElem).find("item")[index]).attr("part3", "completed");
																 $(textbox).attr("disabled", "disabled");
																  $('#'+theTLinputField_id).unbind( "click" );
																 theTLinputField_id = null;
																 $(this).css({ "display":"none"});
																 	if (!isJapanese) 
						   										 		$(textbox).val($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text());
																	else  // To display ruby tag
														 				$(textbox).val(displayRubyTag($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text()));
														  		gTotalItemsCompleted++;
															} 
				                                             var value= $.trim($(textbox).val());
																$(textbox).focus().val("").val(value);
			                                                showFeedbackPart3("incorrect", index);
	                                           }




                                    var score = Math.ceil(((gTotalItemsCorrected/$(gXmlEnable03).find("item").length)/3)*100);
score +=finalScore;
score = Math.ceil(score);
if (gTotalItemsCompleted == gTotalItems) {
	if (score >100)
			score=100;
	finalScore = score;
}


        //For Homework
					if (homeworkStatus) {
							var questionID = "Part# 3 Set# " + (gCurrentSet+1)  + " Item# " + (index+1);
							var answer = textboxValue;
							if (!isJapanese) 
						   		var context = $($(mSetElem).find("item")[index]).find("lang_tl_word_text").text();
							else  // To display ruby tag
							    var context = displayRubyTag($($(mSetElem).find("item")[index]).find("lang_tl_word_text").text());
								
							
							
							var answerAttempts = "Score: " + score + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);

							// To pass logs
							logStudentAnswer(questionID, answer, context);
							logStudentAnswerAttempts(questionID, score);
				
					}
										
										
						});	
					
					 tlContainer.appendChild(checkBtn);
					 if ($(this).attr("textboxPart3")) 
					 $(checkBtn).css({ "display":"block"});
					 	if ($(this).attr("part3")) 
					 $(checkBtn).css({ "display":"none"});	
				 if (targetDir.toLowerCase() =="ltr"){
					
					$(checkBtn).css({ "margin":"0px 0px 0px 25px", "float":"left", "top":"7px" });
				 }
				else{
					
					$(checkBtn).css({ "margin":"0px 25px 0px 0px", "float":"right", "top":"7px" });
				}
				$(tlContainer).css({"position":"absolute"});
				 $(tlContainer).width($(tlContainer).width()+20);
				 $(tlContainer).css({"position":"relative"});
	index++;
});

max=max +25;
$("input[type='text']").width(max);
$("input[type='text']").parent().width(max);
$("input[type='text']").css({"position":"relative"});
	if((keyboardFilename.length == 0) && ($("#keyboardContainer").children().length < 1)){
		keyboardLayout();
	}
	
	$("#keyboardContainer").css({ "display":"block"});
	//$("#bottomContainer").css({ "visibility":"hidden"});
	
	holdTimeout = setTimeout(function(){
		var h =$("#keyboardContainer").outerHeight( true );
		if ($($(gXmlEnable03).find("lang_tl_word_text")[0]).attr("dir") == "ltr"){
				$("#feedbackPanel").css({"top": ((-1)*(h+10)) +"px", "height":h +"px", "left":"438px", "width": "400px" });
				$("#keyboardContainer").css({"left":"0px", "width": "428px"});
		}else {
				$("#feedbackPanel").css({"top": ((-1)*(h+10)) +"px", "height":h +"px", "left":"0px", "width": "400px" });
				$("#keyboardContainer").css({"left":"430px", "width": "428px"});
		}
			
			$( "#okBtn" ).css({"left":"350px", "top": (h-43)+"px"});	
				$("#mainContent").height(($("#content").outerHeight( true )+h) +35);
			///	$("#bottomContainer").css({ "visibility":"visible"});
				
		
		},20);
	 $("input[type='text']").click(function() {
		 theTLinputField_id = $(this).attr("id");
		 $(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	 });
	 $("input[type='text']").keyup(function() {
				 var index= $(this).attr("id").replace("textbox", "");
     			 var checkBtn ="#checkBtn" + index;  
 				if ($.trim($(this).val()) != ""){
					$(checkBtn).css({"display":"block"});
				   $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3", $.trim($(this).val()));
 				} else {
     
					 $(checkBtn).css({"display":"none"});
	 				 if ( $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3"))
					 $(mSetElem).find("item").eq(parseInt(index)).removeAttr("textboxPart3");
 }

 
 });
}
function delClicked(){
	
	if (theTLinputField_id) {
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	 var index= theTLinputField_id.replace("textbox", "");
     var checkBtn ="#checkBtn" + index;  
	var presentStr = $('#'+theTLinputField_id).val();
	if (presentStr.length > 0)
		presentStr = presentStr.substr(0, presentStr.length-1);
	$('#'+theTLinputField_id).val("");
	if (!isJapanese) 
			$('#'+theTLinputField_id).val(presentStr);
	else  // To display ruby tag
	        $('#'+theTLinputField_id).val(displayRubyTag(presentStr));
	
	$('#'+theTLinputField_id).focus();
	 if ($.trim($('#'+theTLinputField_id).val()) != ""){
			 $(checkBtn).css({"display":"block"});
	 		$(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3", $.trim($('#'+theTLinputField_id).val()));
 
 	} else {
     	 	$(checkBtn).css({"display":"none"});
	 		if ( $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3"))
			 $(mSetElem).find("item").eq(parseInt(index)).removeAttr("textboxPart3");
 
 	}
	} else
	 showFeedbackPart3("warning", 0);
	
}
function spaceClicked(){
	if (theTLinputField_id) {
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	 var index= theTLinputField_id.replace("textbox", "");
     var checkBtn ="#checkBtn" + index;  
	var presentStr = $('#'+theTLinputField_id).val();
	presentStr += ' ';
		if (!isJapanese) 
			$('#'+theTLinputField_id).val(presentStr);
		else  // To display ruby tag
			$('#'+theTLinputField_id).val(displayRubyTag(presentStr));
	     
	
	$('#'+theTLinputField_id).focus();
		 if ($.trim($('#'+theTLinputField_id).val()) != ""){
	
	 $(checkBtn).css({"display":"block"});
	 $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3", $.trim($('#'+theTLinputField_id).val()));
 
 } else {
     
	 $(checkBtn).css({"display":"none"});
	 if ( $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3"))
	 $(mSetElem).find("item").eq(parseInt(index)).removeAttr("textboxPart3");
 
 }
 
 } else
	 showFeedbackPart3("warning", 0);
}
function letterClicked(node){
	if (theTLinputField_id) {
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	 var index= theTLinputField_id.replace("textbox", "");
     var checkBtn ="#checkBtn" + index;  
	var presentStr = $('#'+theTLinputField_id).val();
	if(capitalOn)
	presentStr += $(node).html().toUpperCase();
	else
	presentStr += $(node).html();
	$('#'+theTLinputField_id).val("");
	if (!isJapanese) 
			$('#'+theTLinputField_id).val(presentStr);
	else  // To display ruby tag
			$('#'+theTLinputField_id).val(displayRubyTag(presentStr));
	$('#'+theTLinputField_id).focus();
		 if ($.trim($('#'+theTLinputField_id).val()) != ""){
	
	 $(checkBtn).css({"display":"block"});
	 $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3", $.trim($('#'+theTLinputField_id).val()));
 
 } else {
     
	 $(checkBtn).css({"display":"none"});
	 if ( $(mSetElem).find("item").eq(parseInt(index)).attr("textboxPart3"))
	 $(mSetElem).find("item").eq(parseInt(index)).removeAttr("textboxPart3");
 
 }
 } else
	 showFeedbackPart3("warning", 0);
}
function capsClicked(node){
	if(capitalOn){
	   capitalOn = false;
	   $(node).css("background-color", "");
	}
	else {
		capitalOn = true;
		$(node).css("background-color", "#abdcf7");
	}
	
}
function keyboardLayout() {
	var outputCharacterArray = [];
	var kbHtml = '<div id="keyboard">';
	$(gXmlEnable03).find("lang_tl_word_text").each(function(){
		var str = $.trim($(this).text());
		
		 for (var i=0; i<str.length; i++){
			 var char =str.charAt(i).toLowerCase();
		     outputCharacterArray[char] =char;
		}
	    			    
	});//end each()
	for (var x in outputCharacterArray)
   {
	  
	   kbHtml += '<button onclick="letterClicked(this)">' +
						outputCharacterArray[x] + '</button>'
   }
	
	kbHtml += '</div>';
	$("#keyboardContainer").append($(kbHtml));
	$('#keyboard > button').shuffle();
	var spaceDelKeys = '<button onclick="spaceClicked()">space</button><button onclick="delClicked()">Del</button><button onclick="capsClicked(this)" title="Capital Letter">Caps</button>'
	$("#keyboard").append($(spaceDelKeys));
	
	}
	function showFeedbackPart3(type, index) {
	$(".feedbackContent").css({"width": "390px" });
	
	var mSetElem = $(gXmlEnable03).find("session").eq(gCurrentSet);
	 $(".feedbackTitle, .feedbackContent, #okBtn").css("display","block");
	
if(type =="incorrect") {
 	 $(".feedbackTitle").html("<img src='images/feedback_incorrect.png'/>");
	  if(parseInt($($(mSetElem).find("item")[index]).attr("numberTryPart3")) == 1)
	 		$(".feedbackContent").html("<div class='hintTitle'>Hint:</div><div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("hint_layer_3").text() +"</div>");
	 else
	  		if (gTotalItemsCompleted == gTotalItems) {
	 				$(".feedbackContent").html("<div class='hintTitle'>The correct answer is:</div><div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_3").text() +"</div><div class='setCompleted'>You finished all three parts of this activity.<br/>The activity is completed.</div>");
					$("#prev").attr("disabled", "disabled");
			}
	  		else
				 	$(".feedbackContent").html("<div class='hintTitle'>The correct answer is:</div><div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_3").text() +"</div>");
}
if(type =="correct") {
 	 $(".feedbackTitle").html("<img src='images/feedback_correct.png'/>");
	 if (gTotalItemsCompleted == gTotalItems) {
	 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_3").text() +"</div><div class='setCompleted'>You finished all three parts of this activity.<br/>The activity is completed.</div>");
	 $("#prev").attr("disabled", "disabled");
	 }
	 else
	 $(".feedbackContent").html("<div class='hintContent'>"+ $($(mSetElem).find("item")[index]).find("feedback_layer_3").text() +"</div>");
}
if(type =="warning") {
 	 $(".feedbackTitle").html("Virtual Keyboard Notice:");
	
	 $(".feedbackContent").html("<div class='virtualKeyboardNoticed'>Please select text box that you want to type before you click on virtual key.</div>");
	
}
if (gTotalItemsCompleted == gTotalItems) {
	$(gXmlEnable03).find("content").attr("activity", "completed");
	$("#okBtn").css("display","none");
}

 $( "#okBtn" ).unbind( "click" );
 $( "#okBtn" ).click(function() { 
  
		 	$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
			



 });

}