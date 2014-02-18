	var gXmlEnable57; // hold Dom elements of xml file
	var gCurrentSet = 0; // hold current set in Activity
	var numSetCompleted =0; // hold the number sets of activity that user finished it in this activity.
	var numCorrectByUser=0 // to hold number correct that user is answered.
	var gTotalSetNumber; // hold total sets in this activity.
	var holdTimeout;// hold setTimeout variable to use cancel it.
	var finalScore =0 // to hold final score of activity
	$(document).ready(function () {
		initEnable57();
	});
	
	// initial loading function
	function initEnable57(){
		var enable57Div =document.createElement("div");
			enable57Div.id ="enable57Div";
			document.getElementById('HTML5').appendChild(enable57Div);
			
			//main panel
			var mainContent =document.createElement("div");
			mainContent.id ="mainContent";
			document.getElementById('enable57Div').appendChild(mainContent);
			
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
			document.getElementById('enable57Div').appendChild(setButton);
			
			   //HTML5 Audio holder
			var audioPlayer = document.createElement("div");
				audioPlayer.id = "audioPlayer";
			document.getElementById('enable57Div').appendChild(audioPlayer);
	
			//Flash Audio holder
			var flashAudio = document.createElement("div");
				flashAudio.id = "flashAudio";
			document.getElementById('enable57Div').appendChild(flashAudio);
	
			// call to create the audio element
			audioInitLoad();
		   
			 // Contain the all the depature schedules
			var schedulePanel =document.createElement("div");
			schedulePanel.id ="schedulePanel";
			document.getElementById('mainContent').appendChild(schedulePanel);
			
			//Departure schedule title
			var titleSchedule =document.createElement("div");
			titleSchedule.id ="titleSchedule";
			document.getElementById('schedulePanel').appendChild(titleSchedule);
			
			//English schedule title
			var engTitleSchedule =document.createElement("div");
			engTitleSchedule.id ="engTitleSchedule";
			document.getElementById('titleSchedule').appendChild(engTitleSchedule);
			
			//Target schedule title
			var targetTitleSchedule =document.createElement("div");
			targetTitleSchedule.id ="targetTitleSchedule";
			document.getElementById('titleSchedule').appendChild(targetTitleSchedule);
			
			//Header for Departure schedule such as Airline, Destination, Time, Gate
			var headerSchedule =document.createElement("div");
			headerSchedule.id ="headerSchedule";
			document.getElementById('schedulePanel').appendChild(headerSchedule);
			
			//Header for Airline
			var airlineHeader =document.createElement("div");
			airlineHeader.id ="airlineHeader";
			airlineHeader.className="airlineItem";
			airlineHeader.innerHTML="Airline";
			document.getElementById('headerSchedule').appendChild(airlineHeader);
			
			//Header for Flight
			var flightHeader =document.createElement("div");
			flightHeader.id ="flightHeader";
			flightHeader.className="flightItem";
			flightHeader.innerHTML="Flight";
			document.getElementById('headerSchedule').appendChild(flightHeader);
			
			//Header for Destination
			var destinationHeader =document.createElement("div");
			destinationHeader.id ="destinationHeader";
			destinationHeader.className="destinationItem";
			destinationHeader.innerHTML="Destination";
			document.getElementById('headerSchedule').appendChild(destinationHeader);
			
			//Header for Time
			var timeHeader =document.createElement("div");
			timeHeader.id ="timeHeader";
			timeHeader.className="timeItem";
			timeHeader.innerHTML="Time";
			document.getElementById('headerSchedule').appendChild(timeHeader);
			
			//Header for Gate
			var gateHeader =document.createElement("div");
			gateHeader.id ="gateHeader";
			gateHeader.className="gateItem";
			gateHeader.innerHTML="Gate";
			document.getElementById('headerSchedule').appendChild(gateHeader);
			
			//The full list Departure schedules
			var departureSchedules =document.createElement("div");
			departureSchedules.id ="departureSchedules";
			document.getElementById('schedulePanel').appendChild(departureSchedules);
			
			//contain three Departure schedules only.
			var smallSchedules =document.createElement("div");
			smallSchedules.id ="smallSchedules";
			document.getElementById('schedulePanel').appendChild(smallSchedules);
			
			//questionFeedbackPanel
			var questionFeedbackPanel =document.createElement("div");
			questionFeedbackPanel.id ="questionFeedbackPanel";
			document.getElementById('mainContent').appendChild(questionFeedbackPanel);
			
				//question Panel
			var questionPanel =document.createElement("div");
			questionPanel.id ="questionPanel";
			document.getElementById('questionFeedbackPanel').appendChild(questionPanel);
			
			var questionDiv =document.createElement("div");
			questionDiv.id ="questionDiv";
			questionPanel.appendChild(questionDiv);
			
			var answers =document.createElement("div");
			answers.id ="answers";
			questionPanel.appendChild(answers);
			
				//Feedback Panel
			var feedbackPanel =document.createElement("div");
				feedbackPanel.id ="feedbackPanel";
				 document.getElementById('questionFeedbackPanel').appendChild(feedbackPanel);
					
			var feedback = document.createElement("div");
				feedback.id = "feedbackDiv";
			   feedbackPanel.appendChild(feedback);
			   
			//feedbackTop
			var feedbackTop = document.createElement("div");
				feedbackTop.id = "feedbackTop";
				feedbackTop.innerHTML ='<div id="titleFeedback"></div>';
				feedback.appendChild(feedbackTop);
		
			//feedbackBody 
			var feedbackBody = document.createElement("div");
			feedbackBody.id = "feedbackBody";
			feedback.appendChild(feedbackBody);
	
			//feedbackBottom
			var feedbackBottom = document.createElement("div");
				feedbackBottom.id = "feedbackBottom";
				feedbackBottom.innerHTML ='<button type="button" href="#" id="closeFeedbackBtn" class="btn">OK</button>';
				feedback.appendChild(feedbackBottom);
				 
				//questionFeedbackPanel
			var buttonPanel =document.createElement("div");
				buttonPanel.id ="buttonPanel";
				buttonPanel.innerHTML='<button id="questionAndReview" class="btn questionBtn">Go to questions</button>';
			document.getElementById('mainContent').appendChild(buttonPanel);
			
			cssFilename = "css/enabling_57.css";   //css url
			
			// Values from URL parameters or default values for testing
			var statusParameters = getPassedParameters();
			if (!statusParameters) {
				mediaPath 	= "activityData/media/";
				xmlPath 	= "activityData/";
				xmlFilename = xmlPath  + "xml/enabling_57.xml"; //xml url
				jsonFilename = xmlPath  + "json/enabling_57.js"; //json file url
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
		 gXmlEnable57 = t_xml;
		 
		// To display ruby tag
		isJapanese = $(gXmlEnable57).find("content").attr("target_language") == "Japanese";
		
		 //For Homework
		homeworkStatus = $(gXmlEnable57).find("content").attr("hw");
		gTotalSetNumber = $(gXmlEnable57).find("set").length;
		$("#engTitleSchedule").html($(gXmlEnable57).find("title").find("english").text());
		if($(gXmlEnable57).find("title").find("trans").text().toLowerCase().indexOf("departure") <0){
				var title =document.createElement("div");
				if ($(gXmlEnable57).find("title").find("trans").attr("dir"))
						title.setAttribute("dir", $(gXmlEnable57).find("title").find("trans").attr("dir"));
				title.innerHTML =$(gXmlEnable57).find("title").find("trans").text();
				title.style.cssFloat="right";
				document.getElementById('targetTitleSchedule').appendChild(title);
		}
		
		var heightDiv=0;
		for (var i = 0; i < gTotalSetNumber; i++) {
				$("#departureSchedules").append(getRow(i, "departureList" +i));
				var heightTimeColumn = $("#departureList" +i).find(".timeItem").outerHeight( true );
				var heightDestination = $("#departureList" +i).find(".destinationItem").outerHeight( true );
				if (heightTimeColumn >heightDestination) {
						if (heightTimeColumn < 51) {
							heightTimeColumn =51;
						}
						 heightDiv +=heightTimeColumn;
							$("#departureList" +i).children().height(heightTimeColumn);// set the height for row
				}else {
					   if (heightDestination < 51) {
							heightDestination =51;
						}
							heightDiv +=heightDestination;
							$("#departureList" +i).children().height(heightDestination); // set the height for row
				}
		}
		 $(".destinationImage, .timeImage").mousedown(function() {
			$(this).attr("src","images/play_btn_on.png");
			 }); 
			 $(".destinationImage, .timeImage").mouseout(function() {
			$(this).attr("src","images/play_btn.png");
			 }); 
		//check the height of full list schedule if it is greater than 500. Then, Insert scroll bar for it.
		if ( parseFloat(heightDiv) > 500 ) { 
				$("#departureSchedules").css({"height":"500px", "overflow":"auto"});	
				$("#departureSchedules").mCustomScrollbar({
													mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
								
				$("#schedulePanel").height(500 +88 +13);
				$( "#schedulePanel" ).data( "height", (500 +88 +13) +"px" );
		}  else {
				$("#schedulePanel").height(heightDiv +88 +13);
				$( "#schedulePanel" ).data( "height", (heightDiv +88 +13) +"px" );
		}
		
		$(gXmlEnable57).find("set").shuffle();
		
		// add onclick for button
		$("#questionAndReview").click(function() {getQuestion();});
		
		// add onclick previous button
		 $("#prev").click(function () { //load the set when buttons is clicked
					clearTimeout(holdTimeout);
					 if ($("#next").attr("disabled"))
							$("#next").removeAttr("disabled");
					if (gCurrentSet > 0) {
							gCurrentSet --;
							if (gCurrentSet == 0) 
								$(this).attr("disabled", "disabled");
							getQuestion();
					} else
							$(this).attr("disabled", "disabled");
			});
			
			// add onclick next button
			$("#next").click(function () { //load the set when buttons is clicked
			clearTimeout(holdTimeout);
					 if ($("#prev").attr("disabled"))
							$("#prev").removeAttr("disabled");
					 if (gCurrentSet < (gTotalSetNumber-1)) {
							gCurrentSet ++;
							if (gCurrentSet == (gTotalSetNumber-1)) 
									$(this).attr("disabled", "disabled");
									getQuestion();
				   }
			});
	}//parseXml(t_xml)
	
	//create the row for depature schedule
	function getRow(setNum, id){
		   var mSetElem = $(gXmlEnable57).find("set").eq(setNum);
		   var destination_tl 	= $(mSetElem).find("translation").text();
		   if ($(mSetElem).find("translation").attr("dir"))
					 var destination_dir= $(mSetElem).find("translation").attr("dir");
		   else
				   var  destination_dir="";	
		   var destination_audio = $(mSetElem).find("translation").attr("audio");
		   var time_tl = $(mSetElem).find("time_tl").text();
		   if ($(mSetElem).find("time_tl").attr("dir"))
				var time_dir = $(mSetElem).find("time_tl").attr("dir");
		   else
				var time_dir ="";
			var time_hour = $(mSetElem).find("time_tl").attr("hour");
			var time_min = $(mSetElem).find("time_tl").attr("min");
			var time_audio = $(mSetElem).find("time_tl").attr("audio");
			var airline = $(mSetElem).find("filler").attr("airline");
			var flight = $(mSetElem).find("filler").attr("flight");
			var gate = $(mSetElem).find("filler").attr("gate");
			var rowsOut = "<div class='tableRow' id='" +id+ "'>";
			rowsOut += "<div class='airlineItem' >" + airline+"</div>";
			rowsOut += "<div class='flightItem' >" + flight+"</div>";
				// check Japanese language or not. so it can add to display Ruby tab if it has.
				if (!isJapanese) {
					rowsOut += "<div class='destinationItem'><div class='destinationText' dir='"+ destination_dir + "'>";
					rowsOut +=  destination_tl +"</div><div class='audioPlayBtn'><img src='images/play_btn.png' onclick='loadAud (\""+ destination_audio +"\")' class='destinationImage'/></div></div>";
					rowsOut += "<div class='timeItem'><div class='timeText' dir='"+ time_dir + "'>";
					rowsOut += time_tl +"&nbsp;&nbsp;"+ time_hour +" : "+ time_min +"</div><div class='audioPlayBtn'><img src='images/play_btn.png' onclick='loadAud (\""+ time_audio +"\")' class='timeImage'/></div></div>";
				}else {
							
					rowsOut += "<div class='destinationItem'><div class='destinationText' dir='"+ destination_dir + "'>";
					rowsOut +=  displayRubyTag(destination_tl) +"</div><div class='audioPlayBtn'><img src='images/play_btn.png' onclick='loadAud (\""+ destination_audio +"\")' class='destinationImage'/></div></div>";
					rowsOut += "<div class='timeItem'><div class='timeText' dir='"+ time_dir + "'>";
					rowsOut +=  displayRubyTag(time_hour)  + displayRubyTag(time_min)  +"</div><div class='audioPlayBtn'><img src='images/play_btn.png' onclick='loadAud (\""+ time_audio +"\")'  class='timeImage'/></div></div>";
				}
			rowsOut += "<div class='gateItem' >" + gate +"</div>";
			rowsOut += "</div>";
	
			return rowsOut;
	}// end getRow(setNum, id)
	
	// setup for the question
	function getQuestion(){
		
		$("#feedbackBody, #titleFeedback").html("");
		$("#feedbackBottom").hide();
		$("#setText").html((gCurrentSet + 1) +"/"+gTotalSetNumber);
		var  answers = document.getElementById("answers");
			 answers.innerHTML="";
			 answers.innerHTML='<input id="radio1" type="radio" name="choice" value="radio1"><label for="radio1"  id="label_1"><div id="choiceText_1" class="choiceText">RadioOne</div></label>';
			 answers.innerHTML +='<input id="radio2" type="radio" name="choice" value="radio2"><label for="radio2" id="label_2"><div id="choiceText_2" class="choiceText">RadioTwo</div></label>';
			 answers.innerHTML +='<input id="radio3" type="radio" name="choice" value="radio3"><label for="radio3" id="label_3"><div id="choiceText_3" class="choiceText">RadioThree</div></label>';
			// disable previous button if it is the first section/set of activity
		  if (gCurrentSet == 0) {
				 $("#prev").attr("disabled", "disabled");
		  }
		  else 
			 if ($("#prev").attr("disabled"))
							$("#prev").removeAttr("disabled");
				 // disable next button 
		if (gCurrentSet == (gTotalSetNumber-1)) 
			$("#next").attr("disabled", "disabled");
			
			
		$("#questionAndReview").unbind('click');
		$("#questionAndReview").html("Review");
		$("#questionAndReview").click(function() {getReview();});
		$("#departureSchedules").hide();
		$("#smallSchedules").html("");
		$("#smallSchedules, #questionFeedbackPanel, #setButton").show();
		var heightDiv=0;
		var answers = new Array();
		var obj;
		for (var i = gCurrentSet; i < gCurrentSet +3; i++) {
			obj = new Object();
			if (i < gTotalSetNumber) {
				  var mSetElem = $(gXmlEnable57).find("set").eq(i);
				  var en_answer = $(mSetElem).find("time_english").text();
					 if ( i== gCurrentSet) {
							obj.ans= "true";
							$("#questionDiv").html($(mSetElem).find("q").text());
							
					 } else 
							obj.ans= "false";
							obj.text= en_answer;
							answers.push(obj);
					$("#smallSchedules").append(getRow(i, "smallList" +i));
					var heightTimeColumn = $("#smallList" +i).find(".timeItem").outerHeight( true );
					var heightDestination = $("#smallList" +i).find(".destinationItem").outerHeight( true );
					if (heightTimeColumn >heightDestination) {
							heightDiv +=heightTimeColumn;
							$("#smallList" +i).children().height(heightTimeColumn);
					} else {
							heightDiv +=heightDestination;
							$("#smallList" +i).children().height(heightDestination);
					}
			}
			else {
				var g = i - gTotalSetNumber;
				  var mSetElem = $(gXmlEnable57).find("set").eq(g);
				  var en_answer = $(mSetElem).find("time_english").text();
					  obj.ans= "false";
					  obj.text= en_answer;
					  answers.push(obj);
				$("#smallSchedules").append(getRow(g, "smallList" +g));
					var heightTimeColumn = $("#smallList" +g).find(".timeItem").outerHeight( true );
					var heightDestination = $("#smallList" +g).find(".destinationItem").outerHeight( true );
					if (heightTimeColumn >heightDestination) {
							if (heightTimeColumn < 51) 
									heightTimeColumn =51;
							 heightDiv +=heightTimeColumn;
							$("#smallList" +g).children().height(heightTimeColumn);
					} else {
							if (heightDestination < 51) 
									heightDestination =51;
							heightDiv +=heightDestination;
							$("#smallList" +g).children().height(heightDestination);
					}
			}
		}// end for loop
		 $(".destinationImage, .timeImage").mousedown(function() {
			$(this).attr("src","images/play_btn_on.png");
			 }); 
			 $(".destinationImage, .timeImage").mouseout(function() {
			$(this).attr("src","images/play_btn.png");
			 }); 
		answers=  shuffleArray(answers); //mix the answer around
		for (var i =0; i < answers.length; i++) {
					$("#radio"+(i+1)).val(answers[i].ans);
					$("#choiceText_"+(i+1)).html(answers[i].text);
					if (parseFloat($("#choiceText_"+(i+1)).outerHeight( true )) >= 20)
							$("#label_"+(i+1)).height( parseFloat($("#choiceText_"+(i+1)).outerHeight( true )) + 34 );
					
					else
							$("#label_"+(i+1)).height(54);
					$("#radio"+(i+1)).click(function() {
						var idNum= "#choiceText_" + $(this).attr("id").replace("radio", "");
						var mSetElem = $(gXmlEnable57).find("set").eq(gCurrentSet);
						$(mSetElem).attr('userAnswer', $(idNum).html());
						clearTimeout(holdTimeout);						
						 checkAnswers();
	
					});
			}
		$("#smallSchedules").find(".tableRow").shuffle();
		$("#schedulePanel").height(heightDiv +88 +13);
		var mSetElem = $(gXmlEnable57).find("set").eq(gCurrentSet);
		if ($(mSetElem).attr('userAnswer'))
						 postAnswers();
		
	} // end getQuestion()
	
	// call this function when review button is clicked, so It can display the full list schedule
	function getReview(){
		$("#questionAndReview").unbind('click');
		$("#questionAndReview").html("Return to question");
		$("#questionAndReview").click(function() {getQuestion();});
		$("#smallSchedules, #questionFeedbackPanel, #setButton").hide();
		$("#departureSchedules").show();
		$("#schedulePanel").height($( "#schedulePanel" ).data( "height"));
	}//end getReview()
	
	// display feedback
	function showFeedback(type) {
		$("#titleFeedback, #feedbackBody").html("");
		$("#feedbackBody").height("")
		$("#closeFeedbackBtn").unbind('click');
		 $("#feedbackDiv, #feedbackBottom, #feedbackBody").show();
		var mSetElem = $(gXmlEnable57).find("set").eq(gCurrentSet);
		if (($(mSetElem).attr("numberTry") == 2)) { 
				$('input:radio').each(function(){
									if ($(this).val()=="true"){
											$(this).attr('checked', true);
											var textID= "#choiceText_" + $(this).attr("id").replace("radio", "");
											$(textID).css({ "color":"#36F", "font-weight":"bold" });
									}
				});
				
				$("#smallList" +gCurrentSet).children().css({ "color":"#36F", "font-weight":"bold" });
				if ($(mSetElem).find("feedback").text() != "") {
							if ($(mSetElem).find("feedback").attr("dir") !=  "")
										$("#feedbackBody").attr("dir", $(mSetElem).find("feedback").attr("dir"));
							else
										$("#feedbackBody").attr("dir", "ltr");
										
							if (!isJapanese) 
									 $("#feedbackBody").html($(mSetElem).find("feedback").text());
							else 			// To display ruby tag
									$("#feedbackBody").html(displayRubyTag($(mSetElem).find("feedback").text()));
			  } else {
				  if (type == "true") {
				  $("#feedbackBody").attr("dir", "ltr");
				  $("#feedbackBody").append('<div style="color:#36F">The answer is correct.</div>');
				  }
			  }
		}else {
				 
			  if ($(mSetElem).find("hint").attr("dir") !=  "")
					$("#feedbackBody").attr("dir", $(mSetElem).find("hint").attr("dir"));
			  else
					$("#feedbackBody").attr("dir", "ltr");
			  if (!isJapanese) 
				   $("#feedbackBody").html($(mSetElem).find("hint").text());
				
			  else 
				   // To display ruby tag
				  $("#feedbackBody").html(displayRubyTag($(mSetElem).find("hint").text()));
		}
		if (type == "true") {
			 $("#titleFeedback").html("<img src='images/feedback_correct.png'/>");
			
		 } else  if (type == "false"){
			 $("#titleFeedback").html("<img src='images/feedback_incorrect.png'/>");
			  if (($(mSetElem).attr("numberTry") == 2)) {
					$("#feedbackBody").append('<div style="color:#7a0026">The correct time and schedule are showned.</div>');
			  }
		 } else  if (type == "activity_completed"){
			 $("#titleFeedback").html("This Activity is completed!");
			$("#titleFeedback").css({ "color":"#36F", "font-weight":"bold" });
			$("#feedbackBody").html("");
			$("#closeFeedbackBtn").hide();	 
		 }
		if ( parseFloat($("#feedbackBody").height()) > 155 ) { 
			$("#feedbackBody").css({"height":"155px", "overflow":"auto"});	
			$("#feedbackBody").mCustomScrollbar({
								 mouseWheel:true,
													scrollButtons: {
														enable: true
													},
													 theme: "dark-2"
								});
		}  
		 
	 $("#closeFeedbackBtn").click(function () {
			$("#feedbackDiv").hide();
			if (($(mSetElem).attr("numberTry") == 2))
				 if (numSetCompleted < gTotalSetNumber)
					  if (gCurrentSet < (gTotalSetNumber-1)) {
									 gCurrentSet ++;
									 getQuestion();
					 }
			
			 if (numSetCompleted == gTotalSetNumber) {
				if(parent.activityCompleted)
					parent.activityCompleted(1,0);
				else
					showFeedback("activity_completed");
				
				 numSetCompleted++;// stop complete message to click ok button
			 }
		 });
						 
	} //showFeedback(type)
	
	//check answer everytime the radio is clicked
	function checkAnswers(){
		var mSetElem = $(gXmlEnable57).find("set").eq(gCurrentSet);
			if (($(mSetElem).attr("numberTry") == 1)) {
									$(mSetElem).attr("numberTry", 2);
									$(mSetElem).attr("answerAttempts", 2); // For Homework, setting number attempt to try answer by user.
									
			}else {
								$(mSetElem).attr("numberTry", 1);
								$(mSetElem).attr("answerAttempts", 1); // For Homework, setting number attempt to try answer by user.					
			}								
			if($('input:radio[name=choice]:checked').val()=="true") {
					numSetCompleted++;
					numCorrectByUser++;
					$(mSetElem).attr("numberTry", 2);
					showFeedback("true");
					$('input:radio').attr('disabled', true);
					$('input:radio').css("cursor", "default");
					$('label').css("cursor", "default");
					if (numSetCompleted== gTotalSetNumber)
							holdTimeout= setTimeout(function(){ 
													if(parent.activityCompleted)
															parent.activityCompleted(1,0);
													else
															showFeedback("activity_completed");
										
										 },  5000);	  			
			} else {
						if (($(mSetElem).attr("numberTry") == 2)){
							$('input:radio').attr('disabled', true);
							$('input:radio').css("cursor", "default");
							$('label').css("cursor", "default");
							numSetCompleted++;
							showFeedback("false");
							 if (numSetCompleted== gTotalSetNumber)
										holdTimeout= setTimeout(function(){ 
													if(parent.activityCompleted)
															parent.activityCompleted(1,0);
													else
															showFeedback("activity_completed");
										
										 },  5000);				
						}else  {
								showFeedback("false");
								holdTimeout= setTimeout(function(){ $("#feedbackDiv").hide();},  5000);
						}
		
	
			}
			finalScore =  Math.ceil((numCorrectByUser/gTotalSetNumber)*100);
			//For Homework
			if (homeworkStatus) {
					var questionID = gCurrentSet;
					var answer = $(mSetElem).attr('userAnswer');
					var context = $(mSetElem).find("q").text() + " -- " + $(mSetElem).find("time_english").text();
				//var answerAttempts = $(mSetElem).attr("answerAttempts");
				var answerAttempts = "Score: " + finalScore + "%";
					//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);
				//alert(answerAttempts);
					
					// To pass logs
				logStudentAnswer(questionID, answer, context);
				logStudentAnswerAttempts(questionID, parseInt(finalScore));
			}			
	}// end checkAnswers()
	
	//this function use to display the answer that user is select for the set
	function postAnswers() {
			var mSetElem = $(gXmlEnable57).find("set").eq(gCurrentSet);
	  var radioID = getRadioIdSelectedByUser($(mSetElem).attr('userAnswer'));
	 
	   if (($(mSetElem).attr("numberTry") == 1)){
			   $("#"+radioID).attr('checked', true);
			   if ($("#"+radioID).val()=="true")
					 showFeedback("true");
				else 
					 showFeedback("false");
				
				
	   } else {
			   if ($("#"+radioID).val()=="true") 
					 showFeedback("true");
				else  
					 showFeedback("false");
			$('input:radio').attr('disabled', true);
			$('input:radio').css("cursor", "default");
			$('label').css("cursor", "default");
		   
	   }
	}//end postAnswers() 
	
	//use get id of radio when user is clicked
	function getRadioIdSelectedByUser(string) {
		
			 $('.choiceText').each(function(){
									if ($(this).html() == string) {
									
											string= "radio" + $(this).attr('id').replace("choiceText_", "");
									}
					});
					return string;
		
	}
