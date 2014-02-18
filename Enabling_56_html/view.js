
function setScenarioTitles(setObj)
{
	$("#rightPane #scenarioTitle1").html(setObj.scenarioTitle);

	if (setObj.subtitleType == "text")
	{
		$("#rightPane #scenarioSubtitle").html(setObj.subTitleText);
	}
	$("#rightPane #pertinentInfo1").html(setObj.pertinentInfoTitle);
	$("#rightPane #pertinentInfoSubtitle").html(setObj.pertinentInfo_tl);
}

function showScenarioTable(setObj)
{
	$("#feedBackStatus").hide();
	var columnCount = setObj.columnCount();

	// write table headers
	var headerRow = "<div>{0}</div>".format(setObj.activityTable.title);
	headerRow += "<div class='headerRow'>";

	for (var i = 0; i < columnCount; i++)
	{		
		headerRow += "<div class='headerItem'>{0}</div>".format(setObj.activityTable.columnHeadings[i]);
	}
	headerRow += "<div style='clear:both'></div>";
	headerRow += "</div>"
	$("#leftPane").html(headerRow);

	// write body rows
	for (var rowIndex = 0; rowIndex < setObj.activityTable.rows.length; rowIndex++)
	{

		var rowClass = "";
		if (setObj.activityTable.rows[rowIndex].isSelected)
		{
			var isCorrect = setObj.activityTable.rows[rowIndex].isCorrect();
			var rowClass = isCorrect ? "rowBorderCorrect" : "rowBorderWrong";
			setFeedBackStatus(isCorrect);
		} 

		var rowOut = "";
		rowOut += "<div class='tableRow {0}' id='row_{1}'>".format(rowClass, rowIndex);

		for (var colIndex = 0; colIndex < columnCount; colIndex++)
		{		
			var columnObj = setObj.activityTable.rows[rowIndex].columns[colIndex];
			var itemID = "{0}_{1}_{2}".format(currentSet, rowIndex, colIndex);
			var audioFile = columnObj.getAudioFile();
			if (audioFile != "")
			{
				audioFile = getPlayButton(audioFile, itemID);
			}

			if (columnObj.isBlank == "yes")
			{
				// show and edit box
				var enteredValue = 	activitySets[currentSet].activityTable.rows[rowIndex].columns[colIndex].studentKeywordValue;
				keyWordVal = "<input onBlur='storeStudentKeyword(\"{0}\", this.value)' id='edit_{1}' class='keywordEditBox' type='text' value=\"{2}\" />".format(itemID, itemID, enteredValue);
				keyWordVal += "<span onClick='checkAnswer(\"{0}\")' class='keywordToggle'>".format(rowIndex) + columnObj.getKeyword() + "</span>";
			}
			else
			{
				keyWordVal = "<span onClick='checkAnswer(\"{0}\")'>".format(rowIndex) + columnObj.getKeyword() + "</span>";
			}			

			rowOut += "<div class='rowItem textDirection' id='{0}'>{1}<div style='float:left'>{2}</div></div>".format(itemID, audioFile, keyWordVal);
		}
		rowOut += "<div style='clear:both'></div>";
		rowOut += "</div>"
		$("#leftPane").append(rowOut);
	}
}

function showHint()
{
	var setObj = activitySets[currentSet];
	showFeedback("hint", setObj.hint);
}

function storeStudentKeyword(itemID, value)
{
	var parts = itemID.split("_");
	var currentSet = parts[0];
	var currentRow = parts[1];
	var currentColumn = parts[2];

	activitySets[currentSet].activityTable.rows[currentRow].columns[currentColumn].studentKeywordValue = value;
}



function setCorrectRow()
{
	var setObj = activitySets[currentSet];
	var correctRowID = setObj.activityTable.setCorrectRow();

	// remove all borders
	$(".tableRow").removeClass("rowBorderCorrect");
	$(".tableRow").removeClass("rowBorderWrong");

	$("#row_{0}".format(correctRowID)).addClass("rowBorderCorrect");
	setObj.activityTable.setSelectedRow(correctRowID);	

}

function setFeedBackStatus(isCorrect)
{
	var setObj = activitySets[currentSet];
	if (isCorrect)
	{
		var statusText = "Correct";
		var statusColor = "Blue";
	}
	else
	{
		var statusText = "Incorrect";
		var statusColor = "rgb(162, 9, 9)";
	}

	$("#feedBackStatus").html(statusText);
	$("#feedBackStatus").css("color", statusColor);
	$("#feedBackStatus").show();
}

function getPlayButton(audioFile, itemID)
{
	var buttonOut = "<div style='float:left' id=playBtn{0}> ".format(itemID);
	 buttonOut += "<a href=\"javascript:;\""; 
	 buttonOut += "	onmouseout=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s1.png',1)\" ";
	 buttonOut += "	onmousedown=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s3.png',1); audio_play('{0}');\" ".format(mediaPath + "mp3/" + audioFile);
	 buttonOut += "	onmouseup=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s2.png',1)\" ";
	 buttonOut += "	onmouseover=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s2.png',1)\"> ";
	 buttonOut += "	<img class=\"playBtn\" src=\"../common/Library/images/playBtn_s1.png\" border=\"0\"></a> ";
	 buttonOut += "</div>";
	 return buttonOut;
}

function translate()
{
	var setObj = activitySets[currentSet];
	if ( $("#translateLink").html() == "Translate" )
	{
		$("#translateLink").html('Hide Translation');
		$("#rightPane #pertinentInfoSubtitle").html(setObj.pertinentInfo_en);
		showTranslatedKeywords();
	}
	else
	{
		$("#translateLink").html('Translate');
		$("#rightPane #pertinentInfoSubtitle").html(setObj.pertinentInfo_tl);
		hideTranslatedKeywords();
	}
}

function showTranslatedKeywords()
{
	$(".keywordToggle").show();
	$(".keywordEditBox").hide();
}

function hideTranslatedKeywords()
{
	$(".keywordToggle").hide();
	$(".keywordEditBox").show();
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
