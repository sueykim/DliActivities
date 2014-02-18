
function clearView()
{
	$("#introMessageText").html("");
	$("#phoneImage").attr("src", "images/phone.gif");
	$("#introMessageText").hide();
}

function loadView()
{
	$("#tabs").hide();
	$("#pickUpPhone").show();

	var stepObj = steps[currentSet];
	$("#phoneImage").attr("src", "images/phone.gif");
	$("#introMessageText").html(stepObj.introTitle);
	$("#introMessageText").hide();
	//buildTabs();
}

function buildTabs()
{
	var stepObj = steps[currentSet];
	$("#lowerArea").html('<div id="tabs"></div>');
	$("#lowerArea").append('<div id="pickUpPhone" style="display:none; font-size: 20px;margin-left: 111px;margin-top: 70px;">Click play button above to check messages</div>');
	var tabHTML = "<ul>";
	for (var i = 0; i < stepObj.messages.length; i++)
	{
		tabHTML += "<li><a href='#tabs-{0}'>{1}</a></li>".format(i, stepObj.messages[i].tabTitle);
	}
	tabHTML += "</ul>";


	for (var i = 0; i < stepObj.messages.length; i++)
	{
		tabHTML += getNotepadContent(i, stepObj.messages[i]);
	}



	$("#tabs").html(tabHTML);

	$(function() {
    	$( "#tabs" ).tabs();
    	$("#tabs").tabs('select', 0);
		$(".notepadFormItem").css("font-size", "12px");
  	});

}

function getNotepadContent(messageIndex, messageObj)
{
	var idVal = "{0}_{1}".format(currentSet, messageIndex);
	var content = "<div id=\"tabs-{0}\">".format(messageIndex);
	var dropdown;

	var actionsTemplate = "<div class='notepadActions'><a href='javascript:playHint({0}".format(messageIndex) + ", \"{0}\")'><image style=\"width: 16px;padding-left: {1}px;\" src=\"images/play.png\" alt='play hint' /></a></div><div style='float:left; font-size: 12px; padding-top: 2px;'>hint</div>";
	var who 	= steps[currentSet].messages[messageIndex].getStudentAnswer('who');
	var time 	= steps[currentSet].messages[messageIndex].getStudentAnswer('time');
	var day 	= steps[currentSet].messages[messageIndex].getStudentAnswer('day');
	var message = steps[currentSet].messages[messageIndex].getStudentAnswer('message');

	content += "<div style='margin-bottom: 16px; border: 1px solid rgb(138, 138, 155);'>{0} <a href='javascript:playMessage({1})'><image style=\"width:15px\" id=\"playImage{2}\" src=\"images/play.png\" alt='play message' /></a></div>".format(messageObj.title_en, messageIndex, messageIndex);

	actions = actionsTemplate.format("who", 6);
	dropdownVals = steps[currentSet].messages[messageIndex].getDropdownStrings('who');
	dropdown = "";
	if (dropdownVals)
	{
		for (var i = 0; i < dropdownVals.length; i++)
		{
			dropdown += "<option value='{0}'>{1}</value>".format(dropdownVals[i], dropdownVals[i]);
		}
		dropdown = "<select style='font-size: 13px; width: 170px;' class=dropdownList' id='drop_who_{0}'>{1}</select>".format(idVal, dropdown);
	}
	content += "<div class='notepadTitle'>Who Called</div>";
	content += "<div id=EditBox_who_{0} class='notepadFormItem'><input id='edit_who_{1}' class='notepadEditBox' type='text' placeholder='Who Called' value=\"{2}\" /></div>".format(idVal, idVal, who);
	content += "<div id=Dropdown_who_{0} class='notepadDropdown'>{1}</div>".format(idVal, dropdown);
	content += actions;
	content += "<div style='clear: both'></div>";

	actions = actionsTemplate.format("time", 6);
	dropdownVals = steps[currentSet].messages[messageIndex].getDropdownStrings('time');
	dropdown = "";
	if (dropdownVals)
	{
		for (var i = 0; i < dropdownVals.length; i++)
		{
			dropdown += "<option value='{0}'>{1}</value>".format(dropdownVals[i], dropdownVals[i]);
		}
		dropdown = "<select style='font-size: 13px; width: 170px;' id='drop_time_{0}'>{1}</select>".format(idVal, dropdown);
	}
	content += "<div class='notepadTitle'>What Time</div>";
	content += "<div id=EditBox_time_{0}  class='notepadFormItem'><input  placeholder='HH:MM (millitary format)' id='edit_time_{1}' class='notepadEditBox' type='text' value=\"{2}\" /></div>".format(idVal, idVal, time);
	content += "<div id=Dropdown_time_{0} class='notepadDropdown'>{1}</div>".format(idVal, dropdown);
	content += actions;
	content += "<div style='clear: both'></div>";

	actions = actionsTemplate.format("day", 6);
	dropdownVals = steps[currentSet].messages[messageIndex].getDropdownStrings('day');
	dropdown = "";
	if (dropdownVals)
	{
		for (var i = 0; i < dropdownVals.length; i++)
		{
			dropdown += "<option value='{0}'>{1}</value>".format(dropdownVals[i], dropdownVals[i]);
		}
		dropdown = "<select style='font-size: 13px; width: 170px;' id='drop_day_{0}'>{1}</select>".format(idVal, dropdown);
	}
	content += "<div class='notepadTitle'>What Day</div>";
	content += "<div id=EditBox_day_{0}  class='notepadFormItem'><input placeholder='Enter day of week' id='edit_day_{1}' class='notepadEditBox' type='text' value=\"{2}\" /></div>".format(idVal, idVal, day);
	content += "<div id=Dropdown_day_{0} class='notepadDropdown'>{1}</div>".format(idVal, dropdown);
	content += actions;
	content += "<div style='clear: both'></div>";

	actions = actionsTemplate.format("message", 12);
	content += "<div class='notepadTitle'>Message</div>";
	content += "<div id='EditBox_message_{0}'  class='notepadMessageBox'><textarea placeholder='Type the translated message' id='edit_message_{1}' class='notepadMessageBox'>{2}</textarea></div>".format(idVal, idVal, message);
	content += actions;
	content += "<div style='clear: both'></div>";
	content += "<div style='margin-top: -18px;font-size: 12px;float: right;'><a href='javascript:checkMessageAnswers({0})'>check answers</a></div>".format(messageIndex);
	content += "</div>";

	return content;
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
