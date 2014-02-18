// Enabling 20
// initial loading 
var currentQuestion=0;
var questionCompleted =0;
var totalQuestions=0;
var numCorrectByUser=0 // to hold number correct that user is answered.
var finalScore =0 // to hold final score of activity
var lessonLevel;
var holdTimeout;
$(document).ready(function () {
	initEnable20();
});

// initial loading function
function initEnable20(){
	var enable20Div =document.createElement("div");
	    enable20Div.id ="enable20Div";
		document.getElementById('HTML5').appendChild(enable20Div);
		
	  //Content Panel
	var contentPanel =document.createElement("div");
	    contentPanel.id ="contentPanel";
		enable20Div.appendChild(contentPanel);
		
		//set Panel
	var setPanel =document.createElement("div");
	    setPanel.id ="setPanel";
		var string = '<div class="btn-group pull-right">';  //create set buttons for activity at bottom of activity
	string += '<button class="btn btn_prev" id="prev" title="prev"><b>&#60;</b> Prev</button>';
          string += '<button class="btn btn_next" id="next" title="next">Next <b>&#62;</b></button>';
    string += '</div><div class="margin_5 pull-right">&nbsp;&nbsp;&nbsp;</div>';
	string += '<div class="btn-group pull-right off"><button class="btn btn_set off" id="setDiv" title="SET">SET:</button>';
    string += '<button class="btn btn_set_value off" id="setText" title="SET">1/5</button></div>';
	setPanel.innerHTML=string;
		enable20Div.appendChild(setPanel);
		
	
	var contentPanelInner =document.createElement("div");
	    contentPanelInner.id ="contentPanelInner";
		contentPanel.appendChild(contentPanelInner);
		

	//question Div
	var leftDiv =document.createElement("div");
	   leftDiv.id ="leftDiv";
		contentPanelInner.appendChild(leftDiv);
		
		//question Div
	var questionDiv =document.createElement("div");
	    questionDiv.id ="questionDiv";
		leftDiv.appendChild(questionDiv);
		//question Div
	var answersDiv =document.createElement("div");
	    answersDiv.id ="answersDiv";
		leftDiv.appendChild(answersDiv);
		//question Div
	var feedbackDiv =document.createElement("div");
	    feedbackDiv.id ="feedbackDiv";
		leftDiv.appendChild(feedbackDiv);
		
		var hint = document.createElement("div");
	        hint.id = "hint";
		   feedbackDiv.appendChild(hint);
		   
		   	    //feedbackTop
    var hintTop = document.createElement("div");
    hintTop.id = "hintTop";
	hintTop.innerHTML ='<div id="titleHint"></div>';
	hint.appendChild(hintTop);
	
   //feedbackBody 
    var hintBody = document.createElement("div");
    	hintBody.id = "hintBody";
		hint.appendChild(hintBody);

    //feedbackBottom
    var hintBottom = document.createElement("div");
    hintBottom.id = "hintBottom";
	hintBottom.innerHTML ='<button type="button" href="#" id="closeHintBtn" class="btn">OK</button>';
   hint.appendChild(hintBottom);
		   
		   
		   
		   
		   
		   
		 var transcript =document.createElement("div");
	     	 transcript.id ="transcript";
		     feedbackDiv.appendChild(transcript);
		
		//board Div
	var boardDiv =document.createElement("div");
	    boardDiv.id ="boardDiv";
		contentPanelInner.appendChild(boardDiv);
		
			//board Div
	var popUpNoteDiv =document.createElement("div");
	    popUpNoteDiv.id ="popUpNoteDiv";
		boardDiv.appendChild(popUpNoteDiv);

		
	    //location of folder where place resources files 
		cssFilename = "css/enabling_20.css";   //css url
		
		// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
			mediaPath 	= "activityData/media/";
			xmlPath 	= "activityData/";
		 xmlFilename = xmlPath  + "xml/enabling_20.xml"; //xml url
		 jsonFilename = xmlPath  + "json/enabling_20.js"; //json file url
	}
	else {
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


var notesCoordinates;
var enable20_xml;
var homeworkStatus;

// To display ruby tag
var isJapanese = false;
function parseXml(t_xml)
{
    enable20_xml = t_xml;
    // To display ruby tag
	isJapanese = $(enable20_xml).find("content").attr("target_language") == "Japanese";
	
	 //For Homework
	homeworkStatus = $(enable20_xml).find("content").attr("hw");
	
	notesCoordinates = new Array();
	var pinArray =["greenPin.png","bluePin.png", "redPin.png", "purplePin.png", "yellowPin.png"];
	var temp = new Object();
	temp={x:38, y:33, pinsX:45, pinsY:36};
	notesCoordinates.push(temp);
	temp={x:400, y:13, pinsX:435, pinsY:13}
	notesCoordinates.push(temp);
	temp={x:210, y:80, pinsX:250, pinsY:80};
	notesCoordinates.push(temp);
	temp={x:356, y:155, pinsX:388, pinsY:150};
	notesCoordinates.push(temp);
	temp={x:320, y:308, pinsX:360, pinsY:300};
	notesCoordinates.push(temp); 
	pinArray = shuffleArray(pinArray);
	lessonLevel = $($(t_xml).find("content")[0]).attr("lessonLevel");
	if (lessonLevel)
	     lessonLevel = lessonLevel.toLowerCase();
	else
	     lessonLevel="low";
	   if(lessonLevel == "high") {
	   			$(t_xml).find("note").shuffle();
				$(enable20_xml).find("questions").children().shuffle();
					temp={x:80, y:161, pinsX:119, pinsY:155};
					notesCoordinates.push(temp);
					temp={x:217, y:210, pinsX:253, pinsY:205}
					notesCoordinates.push(temp);
					temp={x:18, y:293, pinsX:51, pinsY:290};
					notesCoordinates.push(temp);
					temp={x:169, y:318, pinsX:202, pinsY:309};
					notesCoordinates.push(temp);
	   }
	   notesCoordinates = shuffleArray(notesCoordinates); 
	   
	var  i =0;
	$(enable20_xml).find("note").each(function(){
			var obj = new Object();
					var img= $(this).find("note_image").text();
					var transcript= $(this).find("comment").text();	
					var langDir = $(this).find("comment").attr("dir");
					var x= $(this).find("x_position").text();	
					var y= $(this).find("y_position").text();
					 if ((x == "") || (y == "")){
	      					x = notesCoordinates[i].x  +"px";
							y = notesCoordinates[i].y  +"px";
							obj.pinsX = notesCoordinates[i].pinsX  +"px";
	                        obj.pinsY = notesCoordinates [i].pinsY  +"px";
							obj.pinUrl = pinArray[i];
	                       
							
					 } else{
	      					x = x  +"px";
							y = y  +"px";
					}
					addImagesOnBoard(img, transcript, langDir, x, y, obj, i);
					 i++;
	
	  });
	  	if (lessonLevel == "high")
			      totalQuestions = $(enable20_xml).find("questions").children().length;
			else
			      totalQuestions = $(enable20_xml).find("note").length;
		
	  loadQuestion();
	  
        $("#prev").click(function () { //load the set when buttons is clicked
		 clearTimeout(holdTimeout);
		 		 if ($("#next").attr("disabled"))
		 				$("#next").removeAttr("disabled");
				if (currentQuestion > 0) {
            			currentQuestion --;
						if (currentQuestion == 0) 
					 		$(this).attr("disabled", "disabled");
           				loadQuestion();
				} else
						$(this).attr("disabled", "disabled");
        });
		$("#next").click(function () { //load the set when buttons is clicked
		 clearTimeout(holdTimeout);
				 if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
		      	 if (currentQuestion < (totalQuestions-1)) {
            			currentQuestion ++;
						if (currentQuestion == (totalQuestions-1)) 
						 		$(this).attr("disabled", "disabled");
           						loadQuestion();
			   }
        });
		$( "#popUpNoteDiv" ).draggable({ containment: "#boardDiv" });
}



function loadQuestion(){
	var  answersDiv = document.getElementById("answersDiv");
	   	 answersDiv.innerHTML="";
	 	 answersDiv.innerHTML='<input id="radio1" type="radio" name="choice" value="radio1"><label for="radio1"  id="label_1"><div id="choiceText_1" class="choiceText">RadioOne</div></label>';
		 answersDiv.innerHTML +='<hr><input id="radio2" type="radio" name="choice" value="radio2"><label for="radio2" id="label_2"><div id="choiceText_2" class="choiceText">RadioTwo</div></label>';
		 answersDiv.innerHTML +='<hr><input id="radio3" type="radio" name="choice" value="radio3"><label for="radio3" id="label_3"><div id="choiceText_3" class="choiceText">RadioThree</div></label>';
		 answersDiv.innerHTML +='<hr><input id="radio4" type="radio" name="choice" value="radio2"><label for="radio4" id="label_4"><div id="choiceText_4" class="choiceText">Radiofour</div></label>';
	var answers = new Array();
	var obj;
	$('input:radio').attr('checked', false);
	$('input:radio').attr('disabled', false);
	$('input:radio').unbind('click');
	$("#hintBody, #titleHint").html("");
	$("#hintBottom").hide();
	$('input:radio').css("cursor", "pointer");
	$('label').css("cursor", "pointer");
	$("#setText").html((currentQuestion + 1) +"/"+totalQuestions);
		var imgUrl= $($(enable20_xml).find("note")[currentQuestion]).find("note_image").text();
		var transcript= $($(enable20_xml).find("note")[currentQuestion]).find("comment").text();
		var langDir = $($(enable20_xml).find("note")[currentQuestion]).find("comment").attr("dir");	
	imgUrl = mediaPath + "png/" +imgUrl;

			        if(lessonLevel == "low")
		              loadBiggerNote(imgUrl, transcript, langDir);	
	var questionObj =$(enable20_xml).find("questions").children()[currentQuestion];
		 var en_answer = $(questionObj).find("en_answer").text();
		 obj = new Object();
		 obj.ans= "true";
		 obj.text= en_answer;
		 answers.push(obj);
		 $("#questionDiv").html($(questionObj).find("question").text());
		 $(questionObj).find("distractor").each(function(){
				obj = new Object();
		 		obj.ans= "false";
				obj.text= $(this).text();
				answers.push(obj);
			 
	    });
		answers=  shuffleArray(answers);
		var height=0;
		for (var i =0; i < answers.length; i++) {
				$("#radio"+(i+1)).val(answers[i].ans);
				$("#choiceText_"+(i+1)).html(answers[i].text);
				//alert(parseFloat($("#choiceText_"+(i+1)).outerHeight( true )))
				if (parseFloat($("#choiceText_"+(i+1)).outerHeight( true )) >= 20){
				$("#label_"+(i+1)).height( parseFloat($("#choiceText_"+(i+1)).outerHeight( true )) + 34 );
				height +=( parseFloat($("#choiceText_"+(i+1)).outerHeight( true )) + 34 );
				}
				else{
				$("#label_"+(i+1)).height(54);
					height +=54;
				}
				
				
				$("#radio"+(i+1)).click(function() {
					var idNum= "#choiceText_" + $(this).attr("id").replace("radio", "");
					$(questionObj).attr('userAnswer', $(idNum).html());				
					 clearTimeout(holdTimeout);	
					 checkAnswers();

				});
		}
		if ((height+30) < 330){ 
				$("#answersDiv").height(height+25);
				$("#contentPanelInner, #boardDiv").height(height+25+70+198+10);
				var top= ((height+25+70+178+10)-350) +"px";
				$("#popUpNoteDiv").css("top",top); 
		
		} else {
					$("#answersDiv").css({"height":"330px", "overflow":"auto"});	
						$("#contentPanelInner,#boardDiv").height(330+70+198+10);
						var top= ((330+70+178+10)-350) +"px";
				$("#popUpNoteDiv").css("top",top); 
						 $("#answersDiv").mCustomScrollbar({
							 mouseWheel:true,
               									scrollButtons: {
                  								 	enable: true
              							 		},
               									 theme: "dark-2"
           					});
		}
				
		 if ($(questionObj).attr('userAnswer'))
       				 postAnswers();
	    // disable previous button if it is the first section/set of activity
	  if (currentQuestion == 0) {
		     $("#prev").attr("disabled", "disabled");
	  }
	  else 
	     if ($("#prev").attr("disabled"))
		 				$("#prev").removeAttr("disabled");
	if (currentQuestion == (totalQuestions-1)) 
						 		$("#next").attr("disabled", "disabled");

}
function postAnswers() {
   var questionObj =$(enable20_xml).find("questions").children()[currentQuestion];;
  var radioID = getRadioIdSelectedByUser($(questionObj).attr('userAnswer'));
 
   if ($(questionObj).attr("numberTry") && ($(questionObj).attr("numberTry") == 1)){
	       $("#"+radioID).attr('checked', true);
		   if ($("#"+radioID).val()=="true")
		         showHint("true");
		    else 
			     showHint("false");
			
		    
   } else {
	       if ($("#"+radioID).val()=="true") {
			   $("#"+radioID).attr('checked', true);
		         showHint("true");
		   }
		    else  {
			     showHint("false");
	   			 $('input:radio').each(function(){
								if ($(this).val()=="true")
										$(this).attr('checked', true);
				});
			}
		$('input:radio').attr('disabled', true);
		$('input:radio').css("cursor", "default");
		$('label').css("cursor", "default");
	   
   }
}
function getRadioIdSelectedByUser(string) {
	
		 $('.choiceText').each(function(){
								if ($(this).html() == string) {
								
										string= "radio" + $(this).attr('id').replace("choiceText_", "");
								}
				});
				return string;
	
}


function checkAnswers(){
		var questionObj =$(enable20_xml).find("questions").children()[currentQuestion];;
	 	if ($(questionObj).attr("numberTry") && ($(questionObj).attr("numberTry") == 1)) {
		              			$(questionObj).attr("numberTry", 2);
								$(questionObj).attr("answerAttempts", 2); // For Homework, setting number attempt to try answer by user.
								
		}else {
			     			$(questionObj).attr("numberTry", 1);
							$(questionObj).attr("answerAttempts", 1); // For Homework, setting number attempt to try answer by user.
							
				
							
		}
	
										
		if($('input:radio[name=choice]:checked').val()=="true") {
				questionCompleted++;
				numCorrectByUser++;
				$(questionObj).attr("numberTry", 2);
				showHint("true");
				$('input:radio').attr('disabled', true);
					$('input:radio').css("cursor", "default");
						$('label').css("cursor", "default");
				 if (questionCompleted == totalQuestions)
				  holdTimeout= setTimeout(function(){
					                      		  $(enable20_xml).find("questions").attr("completed", "true");
																  if(parent.activityCompleted)
																			parent.activityCompleted(1,0);
																  else
																			showHint("activity_completed");
										  },  5000);
				  			
		} else {
				if ( ($(questionObj).attr("numberTry") == 2)){
						$('input:radio').attr('disabled', true);
						$('input:radio').css("cursor", "default");
						$('label').css("cursor", "default");
						
						questionCompleted++;
						showHint("false");
						$('input:radio').each(function(){
								if ($(this).val()=="true")
										$(this).attr('checked', true);
						});
						 if (questionCompleted == totalQuestions)
						 				  holdTimeout= setTimeout(function(){
					                      		                 $(enable20_xml).find("questions").attr("completed", "true");
																  if(parent.activityCompleted)
																			parent.activityCompleted(1,0);
																  else
																			showHint("activity_completed");
										              },  5000);
					
									
				}else  {
						showHint("false");
						 holdTimeout= setTimeout(function(){
					                      		                $("#hint").hide();
										              },  5000);
				}
	

		}
		finalScore =  Math.ceil((numCorrectByUser/totalQuestions)*100);
		//For Homework
		if (homeworkStatus) {
				var questionID = currentQuestion;
				var answer = $(questionObj).attr('userAnswer');
				var context = $(questionObj).find("question").text() + " -- " + $(questionObj).find("en_answer").text();
				//var answerAttempts = $(questionObj).attr("answerAttempts");
					var answerAttempts = "Score: " + finalScore + "%";
					//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);
				
				// To pass logs
			logStudentAnswer(questionID, answer, context);
			logStudentAnswerAttempts(questionID, parseInt(finalScore));
		}			
}



function showHint(type) {
	$("#titleHint, #hintBody").html("");
    $("#closeHintBtn").unbind('click');
	 $("#hint, #hintBottom").show();
	  $("#transcript").hide();
	  var questionObj =$(enable20_xml).find("questions").children()[currentQuestion];;
	
		
		 if ($(questionObj).attr("numberTry") && ($(questionObj).attr("numberTry") == 2)) { 
		 		  $("#feedbackBody").attr("dir", "ltr");
				  	if (!isJapanese) 
								 $("#hintBody").html($(questionObj).find("feedback").text());
					else 			// To display ruby tag
								$("#hintBody").html(displayRubyTag($(questionObj).find("feedback").text()));
					
				  
		 }
		 else {
		    $("#hintBody").attr("dir", $(questionObj).find("hint").attr("dir"));
		    if (!isJapanese) 
								  $("#hintBody").html( $(questionObj).find("hint").text());
			
			else 
								// To display ruby tag
								$("#hintBody").html(displayRubyTag($(questionObj).find("hint").text()));
			
		 }
	
		
	 if (type == "true") {
		 $("#titleHint").html("<img src='images/feedback_correct.png'/>");
		
	 } else  if (type == "false"){
		 $("#titleHint").html("<img src='images/feedback_incorrect.png'/>");
		  if ($(questionObj).attr("numberTry") && ($(questionObj).attr("numberTry") == 2)) {
				$("#hintBody").append('<div style="color:#7a0026">The correct answer is showned above.</div>');
		  } else{
		 		$("#titleHint").html("<img src='images/feedback_incorrect.png' class='feedbackImage'/>");
		  } 
		
	 
	 } else  if (type == "activity_completed"){
		 $("#titleHint").html("This Activity is completed!");
		$("#titleHint").css({"color": "#29725b", "margin" :"15px 0px 0px 0px"});
		$("#hintBody").html("");
		$("#closeHintBtn").hide();
		 
	 }
	 
	if ( parseFloat($("#hintBody").height()) > 100 ) { 
	 	$("#hintBody").css({"height":"100px", "overflow":"auto"});	
		$("#hintBody").mCustomScrollbar({
							 mouseWheel:true,
               									scrollButtons: {
                  								 	enable: true
              							 		},
               									 theme: "dark-2"
           					});
	}
	 
	 $("#closeHintBtn").click(function () {
        $("#hint").hide();
		if ( ($(questionObj).attr("numberTry") == 2) &&  ($(enable20_xml).find("questions").attr("completed") != "true"))
		     if (questionCompleted < totalQuestions)
			      if (currentQuestion < (totalQuestions-1)) {
								 currentQuestion ++;
   								 loadQuestion();
			 	 }
		 if (questionCompleted == totalQuestions) {
			  if(parent.activityCompleted)
					parent.activityCompleted(1,0);
			  else
					showHint("activity_completed");
			 questionCompleted++;// stop complete message to click ok button
		 }
	 });
				     
} 

var noteNameObj= "";
function addImagesOnBoard(img, transcriptInput, langDir, x, y, obj, index){
		var transcript = "";
		if (!isJapanese) {
			transcript = transcriptInput;
		}
		else {
			// To display ruby tag
			transcript = displayRubyTag(transcriptInput);
		}
		var imgEl = document.createElement("img");
		var url= mediaPath + "png/" +img;
		    imgEl.setAttribute("id","note" +index);
			imgEl.setAttribute("src",url);
	    	document.getElementById("boardDiv").appendChild(imgEl);
			$(imgEl).css({position:'absolute', left:x, top:y, width: '95px', height: '98px', cursor: 'pointer'}); 
			imgEl.onmouseover = function() {
				 if (isMobile() && (noteNameObj == "")) {
					noteNameObj =this.id; 
				 }
					  document.getElementById("transcript").style.display="block";
				 document.getElementById("hint").style.display="none";
				 //$("#feedbackDiv").css({"padding-top": "10px"});
				 $("#transcript").attr('dir', langDir);
				 if (langDir.toLowerCase()== "rtl")
						 $("#transcript").css({'font-size':'18px'});
				else
						 $("#transcript").css({'font-size':'14px'});
				$("#transcript").html(transcript);
			}
		 	 imgEl.onmouseout = function()  {
				  document.getElementById("transcript").style.display="none";
				 document.getElementById("hint").style.display="block";
												$("#transcript").html("");
											
											}
									
		  	imgEl.onclick = function() {

						 if (isMobile()) {
								 if (noteNameObj == this.id) {
                           				 noteNameObj = ""; 
										 loadBiggerNote(url, transcript, langDir);	
	
					  			 }  else 
										 noteNameObj=this.id;
					   
						} else
						      loadBiggerNote(url, transcript, langDir);
			}
				
			if (obj.pinUrl) {
			var imgPin =document.createElement("img");
			imgPin.setAttribute("src","images/" +obj.pinUrl);
	    	document.getElementById("boardDiv").appendChild(imgPin);
	      	imgPin.style.position="absolute";
		    imgPin.style.left=obj.pinsX;
		    imgPin.style.top=obj.pinsY ;
			}
	}
	
function loadBiggerNote(url, transcriptInput, langDir){
	var transcript = "";
	if (!isJapanese) {
		transcript = transcriptInput;
	}
	else {
		// To display ruby tag
		transcript = displayRubyTag(transcriptInput);
	}
		                        $("#popUpNoteDiv").html("");
								var closeBtn =document.createElement("img");
	    closeBtn.id ="closeBtn";
		closeBtn.setAttribute("src", "images/close.png");
		closeBtn.setAttribute("alt", "Click here to close");
		closeBtn.setAttribute("title", "Click here to close");
		closeBtn.onmouseover = function() {
						this.setAttribute("src","images/close_over.png");
				}
 		closeBtn.onmouseout = function() {
						this.setAttribute("src","images/close.png");
				}
		closeBtn.onclick = function() {
						$("#transparentPopUp").css("display", "none");
								$("#popUpNoteDiv").css("display", "none");
				}
				
		document.getElementById("popUpNoteDiv").appendChild(closeBtn);
		
								$("#transparentPopUp").css("display", "block");
								$("#popUpNoteDiv").css("display", "block");
								var imgEl = document.createElement("img");
								imgEl.setAttribute('src', url);
								document.getElementById("popUpNoteDiv").appendChild(imgEl);
								var width = parseFloat(document.getElementById("popUpNoteDiv").offsetWidth);
								var height = parseFloat(document.getElementById("popUpNoteDiv").offsetHeight);
								if (width > 303) 
									width =303;
								if ((height > 225) || (height ==0))  
									height =225;
								var left= Math.round((303-width)/2) +8 + "px";
								var top= Math.round((225-height)/2) +10 +"px";
								width += "px";
				 				height += "px";
								imgEl.style.position="absolute";
		   						imgEl.style.left = left;
		    					imgEl.style.top = top;
			 					imgEl.style.width = width;
		    					imgEl.style.height = height;
									imgEl.onmouseover = function() {
				 if (isMobile() && (noteNameObj == "")) {
					noteNameObj =this.id; 
				 }
					  document.getElementById("transcript").style.display="block";
				 document.getElementById("hint").style.display="none";
				 //$("#feedbackDiv").css({"padding-top": "10px"});
				 $("#transcript").attr('dir', langDir);
				 if (langDir.toLowerCase()== "rtl")
						 $("#transcript").css({'font-size':'18px'});
				else
						 $("#transcript").css({'font-size':'14px'});
				$("#transcript").html(transcript);
			}
		 	 imgEl.onmouseout = function()  {
				  document.getElementById("transcript").style.display="none";
				 document.getElementById("hint").style.display="block";
												$("#transcript").html("");
											
											}
	
}
	
	function isMobile(){
 		var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));   
    if (mobile)   
	  		return true;
	 else
	  		return false;
	  
}