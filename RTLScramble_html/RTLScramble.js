$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "RTLScramble_sampleData.xml";
	jsonFilename = mediaPath + "RTLScramble_sampleData.js";
	cssFilename = "styles/RTLScramble.css";
	
	loadActivity(parseXml);
	
}); 

var dragToggle = false
var lockNextOut = false

function parseXml(t_xml){
	$("body").droppable({
		drop: function( event, ui ) {
			removeDropHighlights()
		}
	})
	
	/*$(".word").hover(function(){
		$(this).attr("")
	})*/
	
	numSets = $(xml).find("section").length
	
	loadSet(0)
}

function removeDropHighlights(){
	$("#main .overRight").removeClass("overRight")
	$("#main .overLeft").removeClass("overLeft")	
}

function highlightCorrectLetters(event){
	var lookingFor = $(event.target).closest(".wordContainer").attr("targetWord") 
	var found = $(event.target).closest(".wordContainer").find(".letter").text()
	
	$(event.target).closest(".wordContainer").find(".letter").each(function(i,v){
		if(lookingFor[i] == $(v).text()){
			$(v).addClass("highlightLetter")	
		}else{
			$(v).removeClass("highlightLetter")
		}
	})
	
	if(lookingFor == found){
		alert("word finished")
	}
}

function isWordFinished(){
	//what is the word
	//What are the letters
}

function loadSet(setNum){
	//Clear the stage
	$("#wordsContainer").empty()
	
	currentSet = setNum;
	updateSetText();
	
	//Load image
	var jGraphic = $($($(xml).find("section")[setNum]).find("> graphic"))
	$("#img").attr("src", 
		mediaPath + "png/" 
			+ jGraphic.text()
	)
	
	//Load image dimensions
	$("#img").attr("width", jGraphic.attr("width") + "px")
	$("#img").attr("height", jGraphic.attr("height") + "px") 
	
	//Load the words
	$($($(xml).find("section")[setNum]).find("> item")).each(function(i_item,v_item){
		//Load the letters
		var jWord = $($("#word_snippet").html())

		//Load target word
		jWord.attr("targetWord",$($(v_item).find("lang_tl")).text())
		
		//Load word offsets
		jWord.css("left", $($(v_item).find("left")).text() + "px")
		jWord.css("top", $($(v_item).find("top")).text() + "px")
		
		$($(v_item).find("> letter")).each(function(i_letter, v_letter){
			var jLetter = $($("#letter_snippet").html())
			
			$(jLetter.find(".letter")).text($(v_letter).text())
			
			jLetter.insertBefore(jWord.find(".spacer")[1])
		})
		
		//Shuffle
		jWord.find(".letterContainer").shuffle()
		
		//Load the shuffled word
		$(jWord.find(".word")).text($(jWord.find(".letter")).text())
		
		$("#wordsContainer").append(jWord)
	})
	
	$(".letterContainer").draggable({ helper: "clone", revert: true, zIndex: 100 , containment: "parent" })
	
	$(".leftDrop" ).droppable({
			drop: function( event, ui ) {
				if(dragToggle == false){
					console.log("l received drop before over")	
				}
				
				
				removeDropHighlights()
				
				var letterContainer = $(event.target).closest(".letterContainer") 
				$(ui.draggable).css("width","0px")
				
				$(ui.draggable).insertBefore(letterContainer);
				ui.helper.remove()
				
				$(ui.draggable).animate({"width":"20px"},
								highlightCorrectLetters(event))
								
				var jWord = $(event.target).closest(".wordContainer") 
				$(jWord.find(".word")).text($(jWord.find(".letter")).text())
			},

			over: function( event, ui ) { 
				if(dragToggle == true){
					console.log("l received over before out")	
					lockNextOut = true
				}
				
				dragToggle = true
				removeDropHighlights()
				$(event.target).addClass("overLeft")
			},
			
			out: function( event, ui ) { 
				if(lockNextOut == true){
					lockNextOut = false;
					return;
				}
				
				if(dragToggle == false){
					console.log("l received out before over")	
				}
			
				dragToggle = false
				
				removeDropHighlights()
			}
		});

	$(".rightDrop" ).droppable({
			drop: function( event, ui ) {
				if(dragToggle == false){
					console.log("r received drop before over")	
				}
				
				removeDropHighlights()
				
				var letterContainer = $(event.target).closest(".letterContainer") 
				$(ui.draggable).css("width","0px")
				
				$(ui.draggable).insertAfter(letterContainer);
				ui.helper.remove()
				
				$(ui.draggable).animate({"width":"20px"},
								highlightCorrectLetters(event))
								
				var jWord = $(event.target).closest(".wordContainer") 
				$(jWord.find(".word")).text($(jWord.find(".letter")).text())
			},

			over: function( event, ui ) { 
				if(dragToggle == true){
					console.log("r received over before out")	
					lockNextOut = true
				}
				
				dragToggle = true
				removeDropHighlights()
				$(event.target).addClass("overRight")
			},
			
			out: function( event, ui ) {
				if(lockNextOut == true){
					lockNextOut = false;
					return;
				}
				
				if(dragToggle == false){
					console.log("r received out before over")	
				}
			
				dragToggle = false

				removeDropHighlights()
			}
		});	
		
		//Highlight the spaces
		$("#main .letter:contains(' ')").addClass("letterSpace")
}
