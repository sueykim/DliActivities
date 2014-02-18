function Step(stepObj)
{
	this.categories 	= new Array();
	this.excludedAreas	= new Array();
	this.sourceType 	= $($(stepObj).find("source")[0]).attr("type");
	this.sourceValue 	= $($(stepObj).find("source")[0]).find( this.sourceType ).text(); 
	this.hint			= $($(stepObj).find("hint")[0]).text();
	this.feedback		= $($(stepObj).find("feedback")[0]).text();
	this.videoPlayedYet = false;
	this.complete		= false;

	if (this.sourceType == "text")
	{
		this.source_text_dir = $($(stepObj).find("source")[0]).find( this.sourceType ).attr("dir");
	}
	else if (this.sourceType == "video" || this.sourceType == "audio")
	{
		this.mediaLength = parseInt($($(stepObj).find("source")[0]).find( this.sourceType ).attr("length"));
	}

	// find all categories and load the categories array
	var categoriesObj = $(stepObj).find("category");
	for (var i = 0; i < $(categoriesObj).length; i++)
	{
		this.categories.push(new Category(categoriesObj[i]));
	}

	this.clearWrongAnswers = function()
	{
		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			this.categories[catIndex].wrongAnswers = "";
		}
	}

	this.wordCount = function()
	{
		var count = 0;
		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			var words = this.categories[catIndex].words;
			for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
			{
				count++;
			}
		}
		return count;
	}

	this.getAllWords = function()
	{
		var res = new Array();
		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			var words = this.categories[catIndex].words;
			var catWords = '';
			for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
			{
				catWords += words[wordIndex].word_tl + ', ';
			}
			catWords = catWords.substring(0, catWords.length-2); // strip trailing comma
			res.push("[{0}] {1}".format(this.categories[catIndex].title, catWords));
		}
		return res;
	}

	this.getStudentAnswers = function()
	{
		var res = new Array();
		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			var words = this.categories[catIndex].words;
			var catWords = '';
			for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
			{
				if (words[wordIndex].isCorrect)
				{
					catWords += words[wordIndex].word_tl + ', ';
				}
			}
			catWords += this.categories[catIndex].wrongAnswers;
			if (catWords.length > 0)
			{
				catWords = catWords.substring(0, catWords.length-2); // strip trailing comma
			}
			
			res.push("[{0}] {1}".format(this.categories[catIndex].title, catWords));
		}
		return res;
	}


	this.placedWordCount = function()
	{
		var count = 0;
		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			var words = this.categories[catIndex].words;
			for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
			{
				if (words[wordIndex].isPlaced) count++;
			}
		}
		return count;
	}

	this.allWordsPlaced = function()
	{
		var wordsPlaced = this.placedWordCount();
		return (wordsPlaced >= this.excludedAreas.length);
	}

	this.scatterWords = function()
	{
		var atTargetCount = 0;
		var totalWords = this.excludedAreas.length;

		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			var words = this.categories[catIndex].words;
			for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
			{
				var atTarget = words[wordIndex].moveTowardsLocation("#dragWord_{0}_{1}".format(catIndex, wordIndex));
				if (atTarget) atTargetCount++;
				if (atTargetCount >= totalWords) clearInterval(moveInterval);
			}
		}
	} 

	this.setScatteredLocations = function(containerWidth, containerHeight)
	{
		for (var catIndex = 0; catIndex < this.categories.length; catIndex++)
		{
			var words = this.categories[catIndex].words;
			for (var wordIndex = 0; wordIndex < words.length; wordIndex++)
			{
				// get random location within container
				this.setScatterLocation(words[wordIndex], containerWidth, containerHeight, 0);
			}
		}
	}

	this.setScatterLocation = function(wordObj, containerWidth, containerHeight)
	{
		var leftPos = getRandomInt(0, containerWidth - wordObj.location.width - 4);
		var topPos = getRandomInt(0, containerHeight - wordObj.location.height - 4);
		var counter = 0;

		while (!this.isAvailableLocation(leftPos, topPos, wordObj.location.width, containerWidth, containerHeight))
		{
			counter++;
			if (counter > 1000) 
			{
				debug("counter over 1000", true);
				return;
			}
			var leftPos = getRandomInt(0, containerWidth - wordObj.location.width - 4);
			var topPos = getRandomInt(0, containerHeight - wordObj.location.height - 4);
			this.isAvailableLocation(leftPos, topPos, wordObj.location.width, containerWidth, containerHeight);
		}

		wordObj.location.left = leftPos;
		wordObj.location.top  = topPos;
		var locationPoint = new LocationPoint(wordObj.word_tl);
		locationPoint.left = leftPos;
		locationPoint.top  = topPos;
		this.excludedAreas.push(locationPoint);
	}

	this.isAvailableLocation = function(proposedLeft, proposedTop, wordWidth, containerWidth, containerHeight)
	{
		if (this.excludedAreas.length == 0) return true;

		var yesCount = 0;
		for (var i = 0; i < this.excludedAreas.length; i++)
		{
			if (proposedLeft > (this.excludedAreas[i].left + this.excludedAreas[i].width + 5))
			{
				yesCount++;
				continue;
			} 

			if (proposedLeft < (this.excludedAreas[i].left - wordWidth - 5))
			{
				yesCount++;
				continue;
			} 

			if (proposedTop > (this.excludedAreas[i].top + 32))
			{
				yesCount++;
				continue;
			} 

			if (proposedTop < (this.excludedAreas[i].top - 32))
			{
				yesCount++;
				continue;
			} 
		}
		return yesCount >= this.excludedAreas.length;
	}
}

function Category(categoryObj)
{
	this.title = $(categoryObj).attr('title');
	this.audio = $(categoryObj).attr('audio');
	this.words = new Array();
	this.wrongAnswers = "";

	// find all words and load the words array
	var wordsObj = $(categoryObj).find("word");
	for (var i = 0; i < $(wordsObj).length; i++)
	{
		this.words.push(new Word(wordsObj[i]));
	}

	this.addIncorrectAnswer = function(answerText)
	{
		this.wrongAnswers += answerText + ", ";
	}

}

function Word(wordObj)
{
	var tlword = $(wordObj).find("tl_word");
	this.word_tl 		= $(tlword).text();
	this.word_tl_dir 	= $(tlword).attr("dir");
	this.time_pointer	= parseInt( $(tlword).attr("time_pointer") );
	this.word_en		= $(wordObj).find("en_word").text();
	this.location		= new LocationPoint(this.word_tl);
	this.isCorrect		= false;
	this.isPlaced		= false;

	this.setCorrect = function(selectedWord)
	{
		this.isCorrect = true;
	}

	this.moveTowardsLocation = function(elementID)
	{
		if (this.isCorrect) return true;
		var currentLeft = parseInt($(elementID).css("left"));
		var currentTop  = parseInt($(elementID).css("top"));
		var atTarget = true;

		if (currentLeft != this.location.left) 
		{
			if (currentLeft > this.location.left) 
				currentLeft--;
			else
				currentLeft++;

			$(elementID).css("left", currentLeft); 
			atTarget = false;
		}

		if (currentTop != this.location.top) 
		{
			if (currentTop > this.location.top) 
				currentTop--;
			else
				currentTop++;

			$(elementID).css("top", currentTop); 
			atTarget = false;
		}

		if (atTarget)
		{
			$(elementID).draggable({ revert: true });
			return true;
		}
		else
		{
			return false;
		}
	}
}


function LocationPoint(word)
{
	this.left 	= 0;
	this.top 	= 0;
	$("#string_span").html(word);
	this.width 	= $("#string_span").width();
	this.height = $("#string_span").height();;
	debug("Width of {0}: {1}".format(word, this.width), true);
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

