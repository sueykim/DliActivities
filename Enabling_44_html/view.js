function displayCategoryWords(setIndex)
{
	$("#initialItemListings").html();
	$("#categoryArea").html();
	var stepObj = steps[setIndex];

	var categoryCount = stepObj.categories.length;
	for (var c = 0; c < categoryCount; c++)
	{
		// add lower column and title
		$("#categoryArea").append("<div class='categoryColumn' id='categoryColumn_{0}'></div>".format(c));
		$("#categoryColumn_{0}".format(c)).append("<div class='categoryTitle'>{0}</div>".format(stepObj.categories[c].title));

		var wordCount = stepObj.categories[c].words.length;
		var top = 220;
		for (var w = 0; w < wordCount; w++)
		{
			var wordObj = stepObj.categories[c].words[w];
			var leftPos = "{0}px".format((c * 109)+7);
			var topPos = "{0}px".format(w * 27);
			var style = "display: none; position: absolute; left: {0}; top: {1}; width:{2}px".format(leftPos, topPos, wordObj.location.width);

			top = top + 25;
			$("#categoryColumn_{0}".format(c)).append("<div style='top:{0}px' id='dropWord_{1}_{2}' class='dropTarget ui-droppable'>&nbsp;</div>".format(top, c, w));			

			if (wordObj.isCorrect)
			{
				// set it as dropped
				$("#mainBox").append("<div style='display:none' id='dragWord_{0}_{1}' class='categoryItem'>{2}</div>".format(c, w, wordObj.word_tl));
				$("#dropWord_{0}_{1}".format(c, w)).html(wordObj.word_tl);
				$("#dropWord_{0}_{1}".format(c, w)).addClass('ui-state-disabled');
			}
			else
			{
				$("#mainBox").append("<div style='{0}' id='dragWord_{1}_{2}' class='categoryItem'>{3}</div>".format(style, c, w, wordObj.word_tl));
				$("#dropWord_{0}_{1}".format(c, w)).droppable({ hoverClass: "dropTargetHover", drop: dropFunction});
			}

		}

		$("#categoryColumn_{0}".format(c)).append("<div style='clear:both'></div>");
	}
}

function replaceWrongWordsToPile()
{
	$("#replaceWordsLink").hide();
	var stepObj = steps[currentSet];

	$(".targetAreaIncorrect").each(function() {
		var idval = $(this).attr("id");
		$(this).droppable('enable');				
		$(this).removeClass("targetAreaIncorrect");
		$(this).html("&nbsp;");
	});

	for (var catIndex = 0; catIndex < stepObj.categories.length; catIndex++)
	{
		var words = stepObj.categories[catIndex].words;
		for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
		{
			var isCorrect = stepObj.categories[catIndex].words[wordIndex].isCorrect;
			if (!isCorrect)
			{
				var dragObj = $("#dragWord_{0}_{1}".format(catIndex, wordIndex));
				$(dragObj).show();
				$(dragObj).draggable({ revert: true });
			}
		}
	}
	reScatterWords();

}

function setDropCompletedDropStyles()
{
	var stepObj = steps[currentSet];
	var correctCount = 0;
	for (var catIndex = 0; catIndex < stepObj.categories.length; catIndex++)
	{
		var words = stepObj.categories[catIndex].words;
		for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
		{
			var isCorrect = stepObj.categories[catIndex].words[wordIndex].isCorrect;
			if (!isCorrect)
			{
				// set to red 
				//var wordObj = $("#dropWord_{0}_{1}".format(catIndex, wordIndex));

				var dropWordID = $("#dragWord_{0}_{1}".format(catIndex, wordIndex)).data("dropWordID");
				var wordObj = $("#dropWord_{0}".format(dropWordID));


				$(wordObj).addClass("targetAreaIncorrect");
				$(wordObj).removeClass("ui-state-disabled");
				$(wordObj).isPlaced = false;
			}
			else
			{
				correctCount++;
				//ui.draggable.draggable( 'option', 'revert', false ); 
			}

		}
	}
	return correctCount;
}

function displayTimedWords(mediaLength)
{
	var stepObj = steps[currentSet];
	for (var catIndex = 0; catIndex < stepObj.categories.length; catIndex++)
	{
		var words = stepObj.categories[catIndex].words;
		for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
		{
			if (stepObj.categories[catIndex].words[wordIndex].isCorrect) continue;

			if (mediaLength < 0)
			{
				$("#dragWord_{0}_{1}".format(catIndex, wordIndex)).show();	
			}
			else if (words[wordIndex].time_pointer * 1000 < currentTimePosition) 
			{
				$("#dragWord_{0}_{1}".format(catIndex, wordIndex)).show();	
			}
		}
	}

	if (mediaLength < 0)
	{
		$("#activityNavButtons").show();
		clearInterval(wordDisplayInterval);
	}
	else if (currentTimePosition > mediaLength * 1000)  
	{
		$("#activityNavButtons").show();
		clearInterval(wordDisplayInterval);
	}
}

// function playActivityVideo(scatter)
// {
// 	// forceVidType = "m4v";
// 	$("#videoContainer").show();
// 	var videoFile = steps[currentSet].sourceValue;
// 	loadVideo(mediaPath, videoFile.split('.')[0]);
// 	videoLength = 5000;

// 	setTimeout(function() {
// 		$("#videoContainer").hide();
// 		scatterWords();
// 	}, videoLength);
// }

function playVideo(reScatter)
{
	if (reScatter)
	{
		reScatterWords(243); // value passed forces placement to that width
	}
	var videoLength = steps[currentSet].mediaLength;
	$("#videoContainer").show();
	var videoFile = steps[currentSet].sourceValue;
	loadVideo(mediaPath, videoFile.split('.')[0]);

	setTimeout(function() {
		$("#videoContainer").hide();
		reScatterWords();
	}, videoLength * 1000);

	steps[currentSet].videoPlayedYet = true;
}

function clearView()
{
	$("#mainBox").html("<div id='videoContainer' class='videoElement'></div>");
	$("#categoryArea").html("");

}

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html("Incorrect");
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html("Correct");
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			break;
		case "hint":
			$("#feedbackHeader").html("Hint");
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackText").html(text);
			$("#feedbackHeader").html("Activity Completed");
			break;

	}
	
	$('#feedback').show();
}

function closeFeedback(){
	$('#feedback').hide();
	// checkActivityCompleted();	
}
