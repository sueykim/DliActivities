// initial loading 
var timerHolder, timer;
var xmlEnable16, totalNumberCorrect =0;
var currentItem =0, bomExplosion = false;
var homeworkStatus;


$(document).ready(function () {
	initEnable16();
});

// initial loading function
function initEnable16()
{
	var enable16Div =document.createElement("div");
	    enable16Div.id ="enable16Div";
		document.getElementById('HTML5').appendChild(enable16Div);
		
		var enable16Content =document.createElement("div");
	    enable16Content.id ="enable16Content";
		enable16Div.appendChild(enable16Content);
		var feedbackPanel =document.createElement("div");
			feedbackPanel.id ="feedbackPanel";
			feedbackPanel.innerHTML="<div class='feedbackTitle'></div><div class='feedbackContent'></div><button id='okBtn'>OK</button>";
			enable16Div.appendChild(feedbackPanel);
		
	    //left panel div
	var leftDiv =document.createElement("div");
	    leftDiv.id ="leftDiv";
		enable16Content.appendChild(leftDiv);
		
		var imageHolder =document.createElement("div");
	    imageHolder.id ="imageHolder";
		leftDiv.appendChild(imageHolder);
		
		
		
		
		
		//right panel Div
	var rightDiv =document.createElement("div");
	    rightDiv.id ="rightDiv";
		enable16Content.appendChild(rightDiv);
		
		//PopUp Div
	var popUpDiv =document.createElement("div");
		popUpDiv.id ="popUpDiv";
		enable16Content.appendChild(popUpDiv);
		
		
		//start button
		var startButton =document.createElement("img");
	    startButton.id ="startButton";
		startButton.setAttribute("src", "images/start_btn.png");
		startButton.onclick = function() {
											startBtnClicked();
										}
		rightDiv.appendChild(startButton);
		
		//display timer
		var timerDiv =document.createElement("div");
	    timerDiv.id ="timerDiv";
		rightDiv.appendChild(timerDiv);
		
		var timerPanel =document.createElement("span");
	    timerPanel.id ="timerPanel";
		timerDiv.appendChild(timerPanel);
		
		var playVideoButton =document.createElement("img");
	    playVideoButton.id ="playVideoButton";
		playVideoButton.setAttribute("src", "images/play_btn.jpg");
		playVideoButton.onclick = function() {
			this.style.display="none";
			playBtnClicked = true;
											playAudio();
										}
		
		rightDiv.appendChild(playVideoButton);
			var inactivePlayBtn =document.createElement("img");
	   inactivePlayBtn.id ="inactivePlayBtn";
		inactivePlayBtn.setAttribute("src", "images/play_btn_off.jpg");
		rightDiv.appendChild(inactivePlayBtn);
		
		var totalRightNumber =document.createElement("div");
	    totalRightNumber.id ="totalRightNumber";
		totalRightNumber.innerHTML="0";
		rightDiv.appendChild(totalRightNumber);
		
		var toolBox =document.createElement("div");
	    toolBox.id ="toolBox";
		toolBox.className="dropTarget";
		rightDiv.appendChild(toolBox);
		
		var setNumbers =document.createElement("div");
	    setNumbers.id ="setNumbers";
		rightDiv.appendChild(setNumbers);
		
		//HTML5 Audio holder
		var audioPlayer =document.createElement("div");
	    audioPlayer.id ="audioPlayer";
		enable16Div.appendChild(audioPlayer);
		
		//Flash Audio holder
		var flashAudio = document.createElement("div");
	    flashAudio.id ="flashAudio";
		enable16Div.appendChild(flashAudio);
		
		//load initial audio
		audioInitLoad();
		
		 //location of folder where place resources files 
		mediaPath = "activityData/";
		cssFilename = "css/enabling_16.css";   //css url
		xmlFilename = mediaPath + "xml/enabling_16.xml"; //xml url
		jsonFilename = mediaPath + "json/enabling_16.js"; //json file url
	
	   // load xml 
	loadActivity(parseXml);
	

}// end initEnable15()


function parseXml(t_xml){
		xmlEnable16 = t_xml;
		$(xmlEnable16).find("item").shuffle();
		loadSet();
	
	
}

//load load item in xml one to another after once is finished
function loadSet(){
	 $("#toolBox").css({"background-color":"#eeeeee", "opacity":"0.2"});
	  $("#popUpDiv").css("display", "block");
	  $("#okBtn").html("Ok");
	 $("#okBtn").css({"width":"40px", "left":"756px"});
	   $(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	  $("#startButton").css("display", "block");
	  timer =15;
	  var totalItems= $(xmlEnable16).find("item").length;
	  homeworkStatus = $(xmlEnable16).find("content").attr("hw"); // true for homework and undefined for regular
	 var currentElem = $(xmlEnable16).find("item").eq(currentItem);
	  $("#setNumbers").html("<div class=\"setQuestion\">Set:</div><div class=\"setNumbers\">"+(currentItem+1) +"/"+ totalItems +"</div>")
	 var bomPackageUrl ="activityData/media/png/"+$(currentElem).find("bombImage").text();
	 var imageUrl ="activityData/media/png/"+$(currentElem).find("background").text();
	 document.getElementById("imageHolder").innerHTML="";
	 var imageLoader =document.createElement("img");
	    imageLoader.id ="imageLoader";
		document.getElementById("imageHolder").appendChild(imageLoader);
	 	$("#imageLoader").attr("src", imageUrl);
		
		var explosionImage =document.createElement("img");
	    explosionImage.id ="explosionImage";
		explosionImage.setAttribute("src", "images/explosion.gif");
		explosionImage.style.display="none";
		document.getElementById("imageHolder").appendChild(explosionImage);
	
	 var bomIndex =1;
	 	$(currentElem).find("bomb").each(function(){
			 
				var bomImage =document.createElement("img");
				var name;
				bomImage.setAttribute("src", bomPackageUrl);
				if ($(this).find("correct").text().toLowerCase() == "true") {
					   name ="bomTarget";
					   var left= ($(this).find("x").text() - ((193-41)/2))+"px";
					   var top= (($(this).find("y").text() - 223) +50)+"px";
					   $("#explosionImage").css({position:"absolute", top: top, left:left, width:"193px", height:"263px"});
				}
				else
				       name="bomDistractor" +bomIndex;
					   
				bomImage.id=name;
				bomImage.className="dragTarget";
				var left= $(this).find("x").text() +"px";
				var top= $(this).find("y").text()+"px";
				document.getElementById("imageHolder").appendChild(bomImage);
				$("#"+name).css({position:"absolute", top: top, left:left, width:"41px", height:"35px"});
		 		bomIndex++;
		 
	 	});//end each loop
		
		  // call fall back revert for draggable
		$(".dragTarget").draggable({ revert: function(dropObj){
   					 //if false then no drop object occurred.
    				 if(dropObj === false){
						    startTimer();
       						 //revert the drag object by returning true
        					return true;
     				}
    				 else {
       						 //drop object was returned,
        					return true;
     					}
		}
       });
	   $(".dragTarget").draggable( "option", "containment", "#enable16Content" );
	   
		$('.dragTarget').draggable({start: function(event, ui) { 
		
				$(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
		
				stopTimer(); 
			}
		});
		
		$('.dropTarget').droppable({drop: dropFunction}); 
		$('.dropTarget').droppable({  over: function( event, ui ) { $("#toolBox").css({"background-color":"", "opacity":"1"});}, out: function( event, ui ) { $("#toolBox").css({"background-color":"#eeeeee", "opacity":"0.2"});}});
}//loadSet()

function dropFunction(event, ui ) {
	$( ".dragTarget" ).draggable({  stop: function( event, ui ) { }});
	startTimer(); 
	var answer;
			if ($(ui.draggable).attr( "id" ) == "bomTarget") {
				$("#toolBox").css({"background-color":"", "opacity":"1"});
				 	 stopTimer();
					 totalNumberCorrect++;
					 answer="true";
					 $(xmlEnable16).find("item").eq(currentItem).attr("result", "correct");
					 $('#totalRightNumber').html(totalNumberCorrect); 
					 ui.draggable.draggable( 'option', 'revert', false ); 
					 popUpMessage();
					 
			} else {
				    $("#toolBox").css({"background-color":"#eeeeee", "opacity":"0.2"});   
					    answer="false";
						if ($(xmlEnable16).find("item").eq(currentItem).attr("result")) {
					  				$(xmlEnable16).find("item").eq(currentItem).attr("result", "feedback");
									loadExplosionBom();
						} else {
									$(xmlEnable16).find("item").eq(currentItem).attr("result", "wrong");
									 popUpMessage();
								
						}
					
			}
			
			                                     
	  //For Homework
					if (homeworkStatus) {
						var score =  Math.ceil((totalNumberCorrect/$(xmlEnable16).find("item").length)*100);
							var questionID = "Item# " + (currentItem+1);
							var context = $(xmlEnable16).find("item").eq(currentItem).find("foreignAudio").text();
							 var answerAttempts = "Score: " + score + "%";
							//alert("questionID: "+ questionID + "\n\nUser Answer:\n "+answer + "\n\nContext:\n "+ context+ "\n\nUser Attempts: "+answerAttempts);

							// To pass logs
							logStudentAnswer(questionID, answer, context);
							logStudentAnswerAttempts(questionID, score);
				
					}
}
	
 function startBtnClicked(){
	  	$("#popUpDiv").css("display", "none");
	  	$("#startButton").css("display", "none");
	  	startTimer();
		playAudio();
	
	}
  function playAudio(){
	     stopTimer();
		 $( ".dragTarget" ).draggable( "disable" );
	  	$("#inactivePlayBtn").css("display", "block");
	  var currentElem = $(xmlEnable16).find("item").eq(currentItem);
	  var url= $(currentElem).find("foreignAudio").text();
	  	  loadAud(url);
 }
	
	
    //display timer
    function displayTimer() {
        // display timer
		var timerDigital;
		if (timer <10)
		   timerDigital = "00:0"+timer;
		else
		   timerDigital = "00:"+timer;
		document.getElementById('timerPanel').innerHTML = timerDigital;  
    }
	
    //start Timer
    function startTimer() {
		if (timer >= 0) {
				displayTimer();
				$( ".dragTarget" ).draggable( "enable" );
		  		$("#playVideoButton").css("display", "block");
		  		$("#inactivePlayBtn").css("display", "none");
				if (timer == 0) {
			 				//time is out and time to load explosion bom.
						timer--
						$(xmlEnable16).find("item").eq(currentItem).attr("result", "feedback");
						loadExplosionBom();
				} else {
           			 timer--;
           			 timerHolder = setTimeout("startTimer()", 1000);
        		}
				
		} else
		   	  stopTimer(); 
    }
    
   //stop timer
    function stopTimer() {
        clearTimeout(timerHolder);
    }
	
 function loadExplosionBom(){
	bomExplosion=true;
     $( ".dragTarget" ).draggable({  stop: function( event, ui ) { 	
	  
	 															 		$(".dragTarget").draggable( "destroy" ); 
																}
								});
	 $("#inactivePlayBtn").css("display", "block");
	 $("#explosionImage").show();
        setTimeout(function() {
            $("#explosionImage").attr('src', "images/explosion.gif");
        }, 0);
	 $("#bomTarget").css("display", "none");
      loadAud("explosion.mp3");
	  stopTimer();
 }
 
 function popUpMessage() {
	 var currentItemObj =$(xmlEnable16).find("item")[currentItem];
	 var type= $(currentItemObj).attr("result");
	 var  maxTotalItem = $(xmlEnable16).find("item").length-1;
		 
	  $(".feedbackTitle, .feedbackContent, #okBtn").css("display","block");
	 if (type == "correct") {
		 $("#popUpDiv").css("display", "block");
		  $(".feedbackTitle").html("<img src='images/feedback_correct.png'/>");
		 $(".feedbackContent").html("<div class='feedbackTitleText'>Feedback:</div><div class='feedbackText'>"+ $(currentItemObj).find("feedback").text() +"</div>"); 
		 if (currentItem <  maxTotalItem) {
		     $("#okBtn").html("Next");
		     $("#okBtn").css({"width":"55px", "left":"741px"});
		 }
	}   
	 if (type == "wrong") {
		 $(".feedbackTitle").html("<img src='images/feedback_incorrect.png'/>");
	      $("#bottomPopUpText").html($(currentItemObj).find("hint").text());
		  $(".feedbackContent").html("<div class='feedbackTitleText'>Hint:</div><div class='feedbackText'>"+ $(currentItemObj).find("hint").text() +"</div>"); 
	} 
	if (type == "feedback") {
		$("#popUpDiv").css("display", "block");
		  $(".feedbackTitle").html("<img src='images/feedback_incorrect.png'/>");
		  $(".feedbackContent").html("<div class='feedbackTitleText'>Feedback:</div><div class='feedbackText'>"+ "The correct answer is: " + $(currentItemObj).find("feedback").text() + "</div>");
		   if (currentItem <  maxTotalItem) {
		     $("#okBtn").html("Next");
		     $("#okBtn").css({"width":"55px", "left":"741px"});
		 }
	}
	   if (type == "completted") {
			  $(".feedbackTitle").html("");
			   $("#okBtn").css("display","none");
		  $(".feedbackContent").html("<div class='setCompleted'>Activity is Completed!</div>");  
		 
	 }
	  $( "#okBtn" ).unbind( "click" );
 $( "#okBtn" ).click(function() {
	 $(".feedbackTitle, .feedbackContent, #okBtn").css("display","none");
	     var  maxTotalItem = $(xmlEnable16).find("item").length-1;
		 if (currentItem >=  maxTotalItem){
			  if (($(xmlEnable16).find("item").eq(currentItem).attr("result") == "feedback") ||($(xmlEnable16).find("item").eq(currentItem).attr("result") == "correct")) {
			 			$(xmlEnable16).find("item").eq(currentItem).attr("result", "completted");
				         popUpMessage();
			  }else
			     	startTimer(); 
		 }
		 else {
				 if (timer > 0 ) {
					  if (($(xmlEnable16).find("item").eq(currentItem).attr("result") == "feedback") ||($(xmlEnable16).find("item").eq(currentItem).attr("result") == "correct")) {
						  		currentItem++;
								loadSet();
					  } //else
			     		       //startTimer(); 
				 }
			 	 else {
					 currentItem++;
						loadSet();
			 		}
			 
}
	 
	 
	 
	 });
 }
 

 
 
 
 