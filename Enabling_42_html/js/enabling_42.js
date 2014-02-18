	// initial loading 
	var gXmlEnable42; // hold Dom elements of xml file
	var gCurrentSet = 0; // hold current set in Activity
	var numSetCompleted =0; // hold the number sets of activity that user finished it in this activity.
	var gTotalSetNumber; // hold total sets in this activity.
	var studentResponses = []; //will be an array of arrays holding all responses.
	var userDataNotSave = []; //will be an array of arrays holding all responses.
	var temp, toggle;
	$(document).ready(function () {
		initEnable42();
	});
	
	// initial loading function
	function initEnable42(){
		var enable42Div =document.createElement("div");
			enable42Div.id ="enable42Div";
			document.getElementById('HTML5').appendChild(enable42Div);
			
			//main panel
			var mainContent =document.createElement("div");
			mainContent.id ="mainContent";
			document.getElementById('enable42Div').appendChild(mainContent);
			
			//retain the next/previous button
			var setButton =document.createElement("div");
			setButton.id ="setButton";
			var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
			string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
			string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
			string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
			string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
			string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button></div>';
			setButton.innerHTML=string;
			document.getElementById('enable42Div').appendChild(setButton);
			
			   //HTML5 Audio holder
			var audioPlayer = document.createElement("div");
				audioPlayer.id = "audioPlayer";
			document.getElementById('enable42Div').appendChild(audioPlayer);
	
			//Flash Audio holder
			var flashAudio = document.createElement("div");
				flashAudio.id = "flashAudio";
			document.getElementById('enable42Div').appendChild(flashAudio);
	
			// call to create the audio element
			audioInitLoad();
		   
			 // Contain the all content
			var contentPanel =document.createElement("div");
			contentPanel.id ="contentPanel";
			document.getElementById('mainContent').appendChild(contentPanel);
			
					//Summary Button
			var buttonPanel =document.createElement("div");
				buttonPanel.id ="buttonPanel";
				buttonPanel.innerHTML='<button id="wholePassageBtn" class="btn summaryBtn">Start Summary</button>';
			document.getElementById('mainContent').appendChild(buttonPanel);
			
			// Contain the whole passage panel
			var wholePassagePanel =document.createElement("div");
			wholePassagePanel.id ="wholePassagePanel";
			document.getElementById('contentPanel').appendChild(wholePassagePanel);
			
			
			// Contain the whole passage
			var wholePassage =document.createElement("div");
			wholePassage.id ="wholePassage";
			document.getElementById('wholePassagePanel').appendChild(wholePassage);
			
			// Contain one passage each time
			var summaryPassage =document.createElement("div");
			summaryPassage.id ="summaryPassage";
			document.getElementById('contentPanel').appendChild(summaryPassage);
		
			
			var audioAndTitle =document.createElement("div");
			audioAndTitle.id ="audioAndTitle";
			document.getElementById('wholePassage').appendChild(audioAndTitle);
			
			var audioImage =document.createElement("img");
			audioImage.id ="audioImage";
			audioImage.setAttribute("src","images/play_btn.png");
			document.getElementById('audioAndTitle').appendChild(audioImage);
			
			var wholepassageTitle =document.createElement("div");
			wholepassageTitle.id ="wholepassageTitle";
			document.getElementById('audioAndTitle').appendChild(wholepassageTitle);
			
			var wholePassageContent =document.createElement("div");
			wholePassageContent.id ="wholePassageContent";
			document.getElementById('wholePassage').appendChild(wholePassageContent);
			
				 	var leftPassage =document.createElement("div");
			leftPassage.id ="leftPassage";
			document.getElementById('summaryPassage').appendChild(leftPassage);
			
			var passageNumber =document.createElement("div");
			passageNumber.id ="passageNumber";
			passageNumber.innerHTML="1.";
			document.getElementById('leftPassage').appendChild(passageNumber);
			
			var passageAudio =document.createElement("img");
			passageAudio.id ="passageAudio";
			passageAudio.setAttribute("src","images/play_btn.png");
			document.getElementById('leftPassage').appendChild(passageAudio);
			
			var passageParagraph =document.createElement("div");
			passageParagraph.id ="passageParagraph";
			document.getElementById('leftPassage').appendChild(passageParagraph);
			
				var rightPassage =document.createElement("div");
			rightPassage.id ="rightPassage";
			document.getElementById('summaryPassage').appendChild(rightPassage);
			
			var inputPanel =document.createElement("div");
			inputPanel.id ="inputPanel";
			document.getElementById('rightPassage').appendChild(inputPanel);
		
			var inputTextarea =document.createElement("textarea");
			inputTextarea.id ="inputTextarea";
			document.getElementById('inputPanel').appendChild(inputTextarea);
			
			var summaryButtonPanel =document.createElement("div");
			summaryButtonPanel.id ="summaryButtonPanel";
			summaryButtonPanel.innerHTML='<button id="compareBtn" class="btn">Compare</button><button id="saveBtn" class="btn">Save</button><button id="reasonBtn" class="btn">Reason</button>';
			document.getElementById('rightPassage').appendChild(summaryButtonPanel);
		
			
			var feedbackPanel =document.createElement("div");
			feedbackPanel.id ="feedbackPanel";
			document.getElementById('rightPassage').appendChild(feedbackPanel);
			
				var answerPanel =document.createElement("div");
			answerPanel.id ="answerPanel";
			document.getElementById('feedbackPanel').appendChild(answerPanel);
			
				var reasonPanel =document.createElement("div");
			reasonPanel.id ="reasonPanel";
			document.getElementById('feedbackPanel').appendChild(reasonPanel);
			
			var feedbackTitle =document.createElement("div");
			feedbackTitle.id ="feedbackTitle";
			feedbackTitle.innerHTML="Recommended summary sentence:";
			document.getElementById('answerPanel').appendChild(feedbackTitle);
			
			var feedbackContent =document.createElement("div");
			feedbackContent.id ="feedbackContent";
			document.getElementById('answerPanel').appendChild(feedbackContent);
		
			
			cssFilename = "css/enabling_42.css";   //css url
			
			// Values from URL parameters or default values for testing
			var statusParameters = getPassedParameters();
			if (!statusParameters) {
				mediaPath 	= "activityData/media/";
				xmlPath 	= "activityData/";
				xmlFilename = xmlPath  + "xml/enabling_42.xml"; //xml url
				jsonFilename = xmlPath  + "json/enabling_42.js"; //json file url
			}else {
				// For performance - homework
				var xmlPath2 = xmlPath.split("/");
				var activityID = getURL_Parameter('activity');
				if (activityID.length < 2 ) {
						activityID =+ "0" + activityID;
				}
				xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
			}
			 // load xml 
			loadActivity(parseXml);
	}//initEnable20()
	
	//check for Homework
	var homeworkStatus;
	
	// To display ruby tag
	var isJapanese = false;
	
	//parse xml file
	function parseXml(t_xml){
		 gXmlEnable42 = t_xml;
		 
		// To display ruby tag
		isJapanese = $(gXmlEnable42).find("content").attr("target_language") == "Japanese";
		
		 //For Homework
		homeworkStatus = $(gXmlEnable42).find("content").attr("hw");
		gTotalSetNumber = $(gXmlEnable42).find("seg").length;
		var targetTitle="";
		var englishTitle= "";
		
		if($(gXmlEnable42).find("titleTL").text() !="")
			targetTitle= $(gXmlEnable42).find("titleTL").text();
		if($(gXmlEnable42).find("titleEN").text() !="")
		  		 if (targetTitle == "")
					englishTitle=  $(gXmlEnable42).find("titleEN").text();
				 else
					englishTitle= "(" + $(gXmlEnable42).find("titleEN").text() +")";
		if (!isJapanese) 
		    $("#wholepassageTitle").html("<div style='float:left; margin-right:10px'><div dir=\'" + $(gXmlEnable42).find("titleTL").attr("dir") +"\'>" + targetTitle +"</div></div><div style='float:left'>" +englishTitle +"</div>");
		else
		   $("#wholepassageTitle").html("<div style='float:left; margin-right:10px'><div dir=\'" + $(gXmlEnable42).find("titleTL").attr("dir") +"\'>" + displayRubyTag(targetTitle) +"</div></div><div style='float:left'>" +englishTitle +"</div>");
		var string = $(gXmlEnable42).find("psg").text();
		if (string.split("<br/>").length >1) {
			string= string.split("<br/>");
			for (var i = 0; i < string.length; i++) 
				if (string[i] != "") {
					if (!isJapanese) 
						$("#wholePassageContent").append("<div class='paragragh'>"+ string[i] +"</div>");
					else
					   $("#wholePassageContent").append("<div class='paragragh'>"+ displayRubyTag(string[i]) +"</div>");
				}
		
		} else {
			string = string.split(/[\n\r]/g);
			var index =1;
			for (var i = 0; i < string.length; i++) 
				if (string[i] != "") {
					if (!isJapanese) 
							$("#wholePassageContent").append("<div class='paragragh'>" + index +". "+ string[i] +"</div>");
					else
							$("#wholePassageContent").append("<div class='paragragh'>" + index +". "+ displayRubyTag(string[i]) +"</div>");
					index++;
				}
		}
if ($("#wholePassagePanel").height() >520){
	$("#wholePassagePanel").height(500);
	$("#contentPanel").height(535);
    $("#contentPanel").data( "height", "535px" );
	$("#wholePassagePanel").css({"overflow":"auto"});
	$("#wholePassagePanel").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});	
} else{

      $("#contentPanel").height($("#wholePassageContent").outerHeight() +85);
	  $( "#contentPanel").data( "height", ($("#wholePassageContent").outerHeight() +85) +"px" );
}

	   $( "#audioImage" ).click(function() { 
	   			$(this).attr("src","images/play_btn_on.png");
	  			var audioFile= $(gXmlEnable42).find("psg").attr("audio");
				if(audioFile != "")
	  				loadAud (audioFile);
	   }); 
	   $("#audioImage").mouseout(function() {$(this).attr("src","images/play_btn.png");}); 
	   $("#wholePassageBtn").click(function() {getSummary();});
	  
		
	}//parseXml(t_xml)
	
	// setup for the question
	function getSummary(){
			if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause();
		var mSetElem = $(gXmlEnable42).find("seg").eq(gCurrentSet);
		temp="";
		$("#saveBtn, #prev, #next, #inputTextarea").unbind();
		$("#passageParagraph").html("");
		$("#compareBtn, #inputTextarea").show();
		$("#compareBtn").attr("disabled", "disabled");
		if ((userDataNotSave[gCurrentSet] && userDataNotSave[gCurrentSet] != "Please type your paragraph summary here.") && (!(studentResponses[gCurrentSet]))) {
						     $("#inputTextarea").val(userDataNotSave[gCurrentSet]);
							  $("#inputTextarea").focus();
							 if ($("#compareBtn").attr("disabled"))
							$("#compareBtn").removeAttr("disabled");
		} else
		$( "#inputTextarea" ).val("Please type your paragraph summary here.");
		$("#saveBtn, #reasonBtn, #feedbackTitle, #feedbackContent, #reasonPanel").hide();
		$("#contentPanel").height(415);
		$("#setText").html((gCurrentSet + 1) +"/"+gTotalSetNumber);
		$("#passageNumber").html((gCurrentSet + 1)+".") 
		  if (gCurrentSet == 0) {
				 $("#prev").attr("disabled", "disabled");
		  }
		  else 
			 if ($("#prev").attr("disabled"))
							$("#prev").removeAttr("disabled");
				 // disable next button 
		if (gCurrentSet == (gTotalSetNumber-1)) 
			$("#next").attr("disabled", "disabled");
			
			
		$("#wholePassageBtn, #passageAudio, #compareBtn,#reasonBtn").unbind('click');
		$("#wholePassageBtn").html("Whole Passage");
		$("#wholePassageBtn").click(function() {getWholePassage();});
		$("#wholePassage, #wholePassagePanel").hide();
		$("#summaryPassage, #setButton").show();
		if ($(mSetElem).find("tl_seg").attr("audio") != "") {
		$("#passageAudio").show();
		$("#passageAudio").click(function () { 
								$(this).attr("src","images/play_btn_on.png");
	  							var audioFile= $(mSetElem).find("tl_seg").attr("audio");
								if(audioFile != "")
	  									loadAud (audioFile);
		});
		 $("#passageAudio").mouseout(function() {$(this).attr("src","images/play_btn.png"); });
		} else
		    $("#passageAudio").hide();
		
		var text =document.createElement("div");
		     text.setAttribute("dir",$(mSetElem).find("tl_seg").attr("dir"));
			 if (!isJapanese)
				 text.innerHTML= $(mSetElem).find("tl_seg").text();
			 else
			  	text.innerHTML= displayRubyTag($(mSetElem).find("tl_seg").text());
			document.getElementById("passageParagraph").appendChild(text);
			
			$("#compareBtn").click(function () {
				 
			toggle =true;
			getCompare();
			     				
		});
		$("#saveBtn").click(function () { 
		toggle = false;
			savePassage(true);
		});
		
		$("#reasonBtn").click(function () {
			$("#reasonPanel").html('');
			if (!isJapanese)
		    $("#reasonPanel").html('<div class="reasonTitle">Reason:</div><div id="reasonContent" dir=\"'+ $(mSetElem).find("reason").attr("dir") +'\">'+$(mSetElem).find("reason").text()+ '</div><button type="button" href="#" id="closeReason" class="btn">OK</button>'); 			
			else
			 $("#reasonPanel").html('<div class="reasonTitle">Reason:</div><div id="reasonContent" dir=\"'+ $(mSetElem).find("reason").attr("dir") +'\">'+displayRubyTag($(mSetElem).find("reason").text())+ '</div><button type="button" href="#" id="closeReason" class="btn">OK</button>');
			$("#answerPanel").hide();
	 		$("#reasonPanel").show();
			if ($("#reasonContent").height() > 140) {
				$("#reasonContent").height(120);
			$("#reasonContent").css({"overflow":"auto"});
			$("#reasonContent").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
			}
			$("#closeReason").click(function () {
							$("#answerPanel").show();
	 				 	$("#reasonPanel").hide();
							
			});
		});
				
				showSavedPassages();
				 // add onclick previous button
		 $("#prev").click(function () { //load the set when buttons is clicked
		 if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause();
					saveConfirm("previous");
			});
			
			// add onclick next button
			$("#next").click(function () { //load the set when buttons is clicked
			if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause();
						saveConfirm("next")
			});
			$("#inputTextarea").focus(function() {if (this.value == "Please type your paragraph summary here.") {this.value = ''; }});
  			$("#inputTextarea").blur(function() { if ($.trim(this.value) == '') { this.value = "Please type your paragraph summary here."; $("#compareBtn").attr("disabled", "disabled");} });
			$( "#inputTextarea" ).keydown(function() {
				if (($.trim($( this ).val()) != "") && !($.isNumeric($( this ).val())) )  {
							if ($("#compareBtn").attr("disabled"))
							$("#compareBtn").removeAttr("disabled");
						}
											
			});
			//$( "#inputTextarea").mouseup(function() {  
			   
			
			//alert( "Handler for .mouseup() called." );});
			$( "#inputTextarea").change(function() {
				if (($.trim($( this ).val()) != "") && !($.isNumeric($( this ).val())) ) {   
						if ($("#compareBtn").attr("disabled"))
											$("#compareBtn").removeAttr("disabled");
				} else
				    $( this ).val('');
				
			});
		
				$("#inputTextarea").mouseover(function() {	
					if (studentResponses[gCurrentSet]) {
							if ((temp != "") && (temp != studentResponses[gCurrentSet].text)){
						  		 $(this).val(temp);	
							}
							else {
					 			 $(this).val(studentResponses[gCurrentSet].text);
							}
					}
		 		}); 
				$("#compareBtn,#saveBtn, #prev, #next").mouseover(function() {	
					if (studentResponses[gCurrentSet])  {
					if ((temp != "") && (temp != studentResponses[gCurrentSet].text)) {
						//alert(1);
						toggle=true;
						$("#inputTextarea").val(temp);	
					}else {
							if (!isJapanese)	
									$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + studentResponses[gCurrentSet].text);
							else
									$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + displayRubyTag(studentResponses[gCurrentSet].text));
					}
					}
		 		}); 
				$("#saveBtn, #prev, #next").mouseout(function() {
					//toggle=false;	
					if (studentResponses[gCurrentSet]) {
					if (!isJapanese)	
						$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + studentResponses[gCurrentSet].text);
					else
					     $( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + displayRubyTag(studentResponses[gCurrentSet].text));
					}
		 		});
				 $("#inputTextarea").mouseout(function() {
					 temp = $.trim($(this).val());	
					
					if (studentResponses[gCurrentSet])
					    if (!isJapanese)
						$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + studentResponses[gCurrentSet].text);
						else
						$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + displayRubyTag(studentResponses[gCurrentSet].text));
		 		});
				$("#inputTextarea").keyup(function() {
					if (temp != $.trim($(this).val())) {
						if (studentResponses[gCurrentSet]) {
							if ($.trim($(this).val()) != studentResponses[gCurrentSet].text){
						  		 temp=$.trim($(this).val());	
							}
							
						} else
						   temp=$.trim($(this).val());
							
						
					}
				
				 });
				
	}
		// call this function when review button is clicked, so It can display the full list schedule
	function getWholePassage(){
			if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause();
			if (toggle) 
					saveConfirm("Whole Passage");
			else {
		if (!(studentResponses[gCurrentSet])){
						if (($.trim($("#inputTextarea").val()) != "") && !($.isNumeric($("#inputTextarea").val())))
											userDataNotSave[gCurrentSet] = $.trim($("#inputTextarea").val());
			}
		$("#wholePassageBtn").unbind('click');
		$("#wholePassageBtn").html("Continue");
		$("#wholePassageBtn").click(function() {
			getSummary();
		});
		$("#summaryPassage, #setButton").hide();
		$("#wholePassage, #wholePassagePanel").show();
		 $( "#contentPanel").height( $( "#contentPanel").data( "height"));
			}
	}//end getReview()
	function savePassage(temp){
		$("#answerPanel").show();
		$("#reasonPanel").hide();
		if ($.trim($( "#inputTextarea" ).val()) != "") {
		   if (studentResponses[gCurrentSet]) { 
				if ($( "#inputTextarea" ).val() != "Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + studentResponses[gCurrentSet].text) {
					var obj = new Object();
			   			 obj.orderNum =(gCurrentSet+1) +". ";
						obj.text=$.trim($("#inputTextarea").val());
						studentResponses[gCurrentSet]=obj;
				
				}
		   } else {
			  
			  	var obj = new Object();
			   	obj.orderNum =(gCurrentSet+1) +". ";
				obj.text=$.trim($("#inputTextarea").val());
				studentResponses[gCurrentSet]=obj;
				numSetCompleted++;
			  
		   }
		}
		 
		   		if (!isJapanese)
							$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + studentResponses[gCurrentSet].text);	
				else
		  				 	$( "#inputTextarea" ).val("Your saved summary sentence:\n" +studentResponses[gCurrentSet].orderNum + displayRubyTag(studentResponses[gCurrentSet].text));
		   
		   	    var finalScore =  Math.ceil((numSetCompleted/gTotalSetNumber)*100);
				var mSetElem = $(gXmlEnable42).find("seg").eq(gCurrentSet);
		
					//For Homework
					if (homeworkStatus && temp) {
							var questionID = gCurrentSet;
							var answer = studentResponses[gCurrentSet].text;
							var context = $(mSetElem).find("tl_seg").text();
							//var answerAttempts = $(mSetElem).attr("answerAttempts");
							var answerAttempts = "Score: " + finalScore + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);

							// To pass logs
							logStudentAnswer(questionID, answer, context);
							logStudentAnswerAttempts(questionID, finalScore);
				
					}
			
			//if Number completed by user is the same number total set. Then, show the summary and Activity is completed.
		if(numSetCompleted == gTotalSetNumber){
				showCompletedSummary();
			    if(parent.activityCompleted)
				parent.activityCompleted(1,0);
		}

	}//end getReview()
	
	
function showSavedPassages(){
			if (studentResponses[gCurrentSet] ) {
				$("#inputTextarea").val(studentResponses[gCurrentSet].text);
							savePassage(false);
							getCompare();
			}
			

	}//end getReview()
	
function getCompare(){
	$("#feedbackContent").html("");
	   var mSetElem = $(gXmlEnable42).find("seg").eq(gCurrentSet);
	  $("#compareBtn, #reasonPanel").hide();
	  $("#saveBtn, #reasonBtn, #answerPanel, #feedbackContent, #feedbackTitle").show();
			if ($(mSetElem).find("tl_seg_ans").attr("audio") != "") {
				var answerAudio =document.createElement("img");
					answerAudio.id ="answerAudio";
					answerAudio.setAttribute("src","images/play_btn.png");
					document.getElementById('feedbackContent').appendChild(answerAudio);
					$("#answerAudio").click(function () { 
								$(this).attr("src","images/play_btn_on.png");
	  							var audioFile= $(mSetElem).find("tl_seg_ans").attr("audio");
								if(audioFile != "")
	  									loadAud (audioFile);
					});
		 			$("#answerAudio").mouseout(function() {$(this).attr("src","images/play_btn.png"); });
			}
			
			var answerParagraph =document.createElement("div");
			answerParagraph.id ="answerParagraph";
			if (!isJapanese) 
			answerParagraph.innerHTML=$(mSetElem).find("tl_seg_ans").text();
			else
			answerParagraph.innerHTML=displayRubyTag($(mSetElem).find("tl_seg_ans").text());
			document.getElementById('feedbackContent').appendChild(answerParagraph);
				if ($("#answerParagraph").height() > 140) {
				$("#answerParagraph").height(140);
			$("#answerParagraph").css({"overflow":"auto"});
			$("#answerParagraph").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
			}
	
}

function saveConfirm(string){
	if (toggle) {
	
	        $("#reasonPanel").html('');
			if (string == "Whole Passage")
		    $("#reasonPanel").html('<div class="confirmTitle">Do you want to save your summary on above before you go back to whole passage?</div><div><button type="button" id="yesBtn" class="btn">Yes</button><button type="button" id="noBtn" class="btn">No</button></div>'); 	
			else
			$("#reasonPanel").html('<div class="confirmTitle">Do you want to save your summary on above before you moves to ' + string+ ' set?</div><div><button type="button" id="yesBtn" class="btn">Yes</button><button type="button" id="noBtn" class="btn">No</button></div>'); 		
			$("#answerPanel").hide();
	 		$("#reasonPanel").show();
			$("#next, #prev, #saveBtn, #reasonBtn, #wholePassageBtn").attr("disabled", "disabled");
			$("#yesBtn").click(function () {
				   $("#next, #prev, #saveBtn, #reasonBtn, #wholePassageBtn").removeAttr("disabled");
					toggle = false;
							$("#answerPanel").show();
	 				 	$("#reasonPanel").hide();
						savePassage(true);
						if (string == "next"){
							if(numSetCompleted != gTotalSetNumber)
							nextSet();
						} else 
						      if (string == "previous"){
							       if(numSetCompleted != gTotalSetNumber)
							         previousSet();
						      } else if (string == "Whole Passage"){
							        getWholePassage();
						      } 
							 
						
					
							
			});
			$("#noBtn").click(function () {
				   $("#next, #prev, #saveBtn, #reasonBtn, #wholePassageBtn").removeAttr("disabled");
					toggle = false;
							$("#answerPanel").show();
	 				 	$("#reasonPanel").hide();
						$( "#inputTextarea" ).val("");
						userDataNotSave[gCurrentSet] = "";
						if (string == "next"){
							if(numSetCompleted != gTotalSetNumber)
							nextSet();
						} else 
						      if (string == "previous"){
							       if(numSetCompleted != gTotalSetNumber)
							         previousSet();
						      } else if (string == "Whole Passage"){
							        getWholePassage();
						      } 
						
							
			});
	} else {
		if (string == "next")
							nextSet();
						else
							previousSet();
	}
}
function nextSet(){
 if ($("#prev").attr("disabled"))
							$("#prev").removeAttr("disabled");
					 if (gCurrentSet < (gTotalSetNumber-1)) {
						if (!(studentResponses[gCurrentSet]))
						    		if (($.trim($("#inputTextarea").val()) != "") && !($.isNumeric($("#inputTextarea").val())) )
											userDataNotSave[gCurrentSet] = $.trim($("#inputTextarea").val());
							gCurrentSet ++;
							if (gCurrentSet == (gTotalSetNumber-1)) 
									$(this).attr("disabled", "disabled");
									getSummary();
				   }
}

function previousSet(){
 if ($("#next").attr("disabled"))
							$("#next").removeAttr("disabled");
					if (gCurrentSet > 0) {
							if (!(studentResponses[gCurrentSet]))
						    		if (($.trim($("#inputTextarea").val()) != "") && !($.isNumeric($("#inputTextarea").val())) )
						        		 userDataNotSave[gCurrentSet] = $.trim($("#inputTextarea").val());
						     gCurrentSet --;
							if (gCurrentSet == 0) 
								$(this).attr("disabled", "disabled");
							getSummary();
					} else
							$(this).attr("disabled", "disabled");
}
function showCompletedSummary(){
	 if((document.getElementById('html5Audio')) && !(document.getElementById('html5Audio').paused))
								document.getElementById('html5Audio').pause();
	$("#next, #prev").attr("disabled", "disabled");
	$("#buttonPanel, #summaryButtonPanel, #wholePassage, #setButton").hide();
	$("#inputPanel, #leftPassage, #feedbackPanel").html('');
	$("#mainContent").height(670);
	$("#leftPassage, #rightPassage").height(650);
	$("#inputPanel, #feedbackPanel").height(320);
	$("#inputPanel").css("margin-bottom","10px");
	var targetTitle="";
	var englishTitle= "";
	var string="";
		if($(gXmlEnable42).find("titleTL").text() !="")
			targetTitle= $(gXmlEnable42).find("titleTL").text();
		if($(gXmlEnable42).find("titleEN").text() !="")
		  		 if (targetTitle == "")
					englishTitle=  $(gXmlEnable42).find("titleEN").text();
				 else
					englishTitle= "(" + $(gXmlEnable42).find("titleEN").text() +")";
					
		if (!isJapanese) {
		   string+= "<div id='finalWholeTitle'> <img src='images/play_btn.png' id='finalWholeImage'/><div style='float:left; margin:10px 10px 0px 0px'>";
		   string+= "<div dir=\'" + $(gXmlEnable42).find("titleTL").attr("dir") +"\'>" + targetTitle +"</div></div><div style='float:left; margin:10px 0px 0px 0px'>" +englishTitle +"</div></div>";
		}
		else {
		   string+= "<div id='finalWholeTitle'> <img src='images/play_btn.png' id='finalWholeImage'/><div style='float:left; margin:10px 10px 0px 0px'>";
		   string+= "<div dir=\'" + $(gXmlEnable42).find("titleTL").attr("dir") +"\'>" + displayRubyTag(targetTitle) +"</div></div><div style='float:left; margin:10px 0px 0px 0px'>" +englishTitle +"</div></div>";  
		}
		string+= "<div id='finalWholeContent'>";
		var st = $(gXmlEnable42).find("psg").text();
		if (st.split("<br/>").length >1) {
			st= st.split("<br/>");
			for (var i = 0; i < st.length; i++) 
				if (st[i] != "") {
					if (!isJapanese) 
						string+="<div class='paragragh'>"+ st[i] +"</div>";
					else
					   string+="<div class='paragragh'>"+ displayRubyTag(st[i]) +"</div>";
				}
		
		} else {
			st = st.split(/[\n\r]/g);
			var index =1;
			for (var i = 0; i < st.length; i++) 
				if (st[i] != "") {
					if (!isJapanese) 
							string+="<div class='paragragh'>" + index +". "+ st[i] +"</div>";
					else
							string+="<div class='paragragh'>" + index +". "+ displayRubyTag(st[i]) +"</div>";
					index++;
				}
		}
	
    $("#leftPassage").append(string);
	$("#leftPassage").append("<div class='activtyCompleted'> Activity is Completed!</div>");
	$("#finalWholeTitle").width(410);
	var string= "<div class='userSummaryTitle'>Your Summary:</div><div class='userParagraphs'>"; 
	for (var i = 0; i < gTotalSetNumber; i++) {	
	if (!isJapanese) 
		string +="<div class='userParagraph'><div class='userNumParagragh'>" + studentResponses[i].orderNum +"</div><div class='userContentParagragh'>"+ studentResponses[i].text +"</div></div>";
	else
		string +="<div class='userParagraph'><div class='userNumParagragh'>" + studentResponses[i].orderNum +"</div><div class='userContentParagragh'>"+ displayRubyTag(studentResponses[i].text) +"</div></div>";
	}
	string +="</div>";
	$("#inputPanel").append(string);
	
	
	
	$("#leftPassage").css("padding", "10px 5px 0px 5px");
			$("#leftPassage, #inputPanel, #feedbackPanel").css({"overflow":"auto"});
			$("#inputPanel").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});	
			$("#leftPassage").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								}); 
			var index =1;
		string="<div class='recommendedSummaryTitle'>Recommended Summary:</div><div class='recommendedParagraphs'>";
		$(gXmlEnable42).find("tl_seg_ans").each(function(){
			var dir;
			if ($(this).attr("dir"))
				dir=$(this).attr("dir");
			else
				dir="ltr";
					if (!isJapanese) 
				string +="<div class='recommendedParagragh'><div class='recommendedNumParagragh'>" + index +". </div><div class='recommendedContentParagragh' dir='" +$(this).attr("dir") +"'>"+ $(this).text() +"</div></div>";
					else
					string +="<div class='recommendedParagragh'><div class='recommendedNumParagragh'>" + index +". </div><div class='recommendedContentParagragh' dir='" +$(this).attr("dir") +"'>"+ displayRubyTag($(this).text()) +"</div></div>";
						index++;			
				});
				string +="</div>";
				$("#feedbackPanel").append(string);
				$("#feedbackPanel").css("padding", "0px 0px 0px 0px");
				$("#feedbackPanel").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
		
		$( "#finalWholeImage" ).click(function() { 
	   			$(this).attr("src","images/play_btn_on.png");
	  			var audioFile= $(gXmlEnable42).find("psg").attr("audio");
				if(audioFile != "")
	  				loadAud (audioFile);
	   }); 
	   $("#finalWholeImage").mouseout(function() {$(this).attr("src","images/play_btn.png");});

}