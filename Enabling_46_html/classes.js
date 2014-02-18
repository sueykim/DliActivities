function Step(stepObj)
{
	// load values from xml
	this.introAudio 		= $(stepObj).attr("audio");
	this.introTitle 		= $(stepObj).attr("title_en");
	this.stepHint 			= $($(stepObj).find('hint')[0]).text();
	this.stepFeedback 		= $($(stepObj).find("feedback")[0]).text();
	this.messages 			= new Array();

	// find all messages and load the messages array
	var messagesObj = $(stepObj).find("message");
	for (var i = 0; i < $(messagesObj).length; i++)
	{
		this.messages.push(new Message(messagesObj[i]));
	}

}

function Message(messageObj)
{
	this.tabTitle 		= $(messageObj).attr("tabTitle");
	this.title_en 		= $(messageObj).attr("title_en");
	this.audioFile 		= $(messageObj).attr("audio");
	this.callItems 		= new Array();
	this.checkCount		= 0;

	// find all messages and load the messages array
	var callItemsObj = $(messageObj).find("callItem");
	for (var i = 0; i < $(callItemsObj).length; i++)
	{
		this.callItems.push(new CallItem(callItemsObj[i]));
	}

	this.getStudentAnswer = function(type)
	{
		for (var i = 0; i < this.callItems.length; i++)
		{
			if (this.callItems[i].type == type)
				return this.callItems[i].studentAnswer;
		}
		return "";
	}

	this.getItemHint = function(type)
	{
		for (var i = 0; i < this.callItems.length; i++)
		{
			if (this.callItems[i].type == type)
				return this.callItems[i].audioHint;
		}
		return "";
	}

	this.getCorrectAnswers = function()
	{
		var correctAnswers = new Array();
		for (var i = 0; i < this.callItems.length; i++)
		{
			if (this.callItems[i].answeredCorrect == true)
			{
				correctAnswers.push(this.callItems[i].type);
			}
		}
		return correctAnswers;
	}

	this.getWrongAnswers = function()
	{
		var wrongAnswers = new Array();
		for (var i = 0; i < this.callItems.length; i++)
		{
			if (this.callItems[i].answeredCorrect == false)
			{
				wrongAnswers.push(this.callItems[i].type);
			}
		}
		return wrongAnswers;
	}

	this.getDropdownStrings = function(type)
	{
		var dropdownVals = false;
		for (var i = 0; i < this.callItems.length; i++)
		{
			if (this.callItems[i].type == type)
			{
				dropdownVals = this.callItems[i].getDropdownVals();
			}
		}
		return dropdownVals;
	}

	this.storeAnswers = function(answers)
	{
		for (var i = 0; i < this.callItems.length; i++)
		{
			if (this.callItems[i].type == 'who')
				this.callItems[i].setAnswer(answers[0]);
			else if (this.callItems[i].type == 'time')
				this.callItems[i].setAnswer(answers[1]);
			else if (this.callItems[i].type == 'day')
				this.callItems[i].setAnswer(answers[2]);
			else if (this.callItems[i].type == 'message')
				this.callItems[i].setAnswer(answers[3]);
		}
		this.checkCount++;
	}

}

function CallItem(itemObj)
{
	this.type 		 = $(itemObj).attr("type");
	this.audioHint 	 = $(itemObj).attr("audioHint");
	this.caption 	 = $(itemObj).attr("caption");
	this.feedback 	 = $($(itemObj).find("feedback")[0]).text();
	this.answers 	 = new Array();
	this.distractors = new Array();
	this.studentAnswer = "";
	this.answeredCorrect = false;

	var answersObj = $(itemObj).find("correctAnswer");
	for (var i = 0; i < $(answersObj).length; i++)
	{
		var answerVal = $(answersObj[i]).text();
		this.answers.push(answerVal);
	}

	var distractorsObj = $(itemObj).find("distractor");
	for (var i = 0; i < $(distractorsObj).length; i++)
	{
		var distractorVal = $(distractorsObj[i]).text();
		this.distractors.push( distractorVal );
	}

	this.setAnswer = function(value)
	{
		if (this.type == "message" && value.length > 0)
		{
			this.answeredCorrect = true;
			return;
		}

		if (typeof value == "undefined") return;

		this.studentAnswer = value;
		this.answeredCorrect = false;
		for (var i = 0; i < this.answers.length; i++)
		{
			if (this.studentAnswer.toLowerCase() == this.answers[i].toLowerCase())
			{
				this.answeredCorrect = true;
				break;
			}
		}
	}


	this.getDropdownVals = function()
	{
		var dropDownVals = new Array();
		if (this.answers.length == 0) return false;

		dropDownVals.push(this.answers[0]);
		for (var i = 0; i < this.distractors.length; i++)
		{
			dropDownVals.push(this.distractors[i]);
		}

		dropDownVals = shuffleArray(dropDownVals);
		return dropDownVals;
	}

}