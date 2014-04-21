// ActivityItem holds the content for an item (row)
function ActivityItem(itemObj, index)
{
	this.correctTextColor	  = "#0DB906";
	this.selectedTile		  = '-';
	this.selectedPhraseLetter = '!';
	this.failCount			= 0;
	this.successCount		= 0;
	this.complete			= false;
	this.index 				= index;

	var phraseNode			= $(itemObj).find("phrase");
	this.phrase				= $(phraseNode).find("tl_phrase").text();
	this.audio 				= $(phraseNode).find("tl_phrase").attr("audio");
	this.textDirection		= $(phraseNode).find("tl_phrase").attr("dir");
	this.title				= $(phraseNode).find("en_phrase").text();

	this.phraseLetters 		= new Array();
	for (var i = 0; i < this.phrase.length; i++)
	{
		this.phraseLetters.push(this.phrase[i]);
	}

	this.tiles				= new Array();
	var thisObj = this;
	var lettersNode = $(itemObj).find("letters");
	$(lettersNode).find("letter").each(
		function(index, val) {
			var tile = new LetterTile(	$(this).attr("tl_letter") );
			thisObj.tiles.push(tile);
			for (p = 0; p < thisObj.phraseLetters.length; p++)
			{
				if (thisObj.phraseLetters[p] == tile.letter)
				{
					tile.addLetter(p);
				}
			}
		});	

	shuffleArray( this.tiles );
	this.isCorrectAnswer	= false;

	this.totalToMatch = function()
	{
		var cnt = 0;
		for (var i = 0; i < this.tiles.length; i++)
		{
			cnt += this.tiles[i].matchingLetters.length;
		}
		return cnt;
	}

	this.getPhraseHTML = function()
	{
		var result = '';
		for (var i = 0; i < this.phrase.length; i++)
		{
			// check to see if the letter has been successfully chosen already
			var tileClass = "phraseLetterText";
			for (var t = 0; t < this.tiles.length; t++)
			{
				if (this.phrase[i] == this.tiles[t].letter)
				{
					var selected = this.tiles[t].isLetterSelected(i);
					if (selected)
					{
						tileClass = "phraseLetterCorrect";
						break;					
					}	
				}
			}
			var letter = this.phrase[i];
			var phraseLetterParams = "\"{0}\", {1}".format(encodeURI(letter), i);
			result += "<span><a id='phraseLetterIndex_{0}' class='phraseLetter {1} letter_{2}' href='javascript:activityItems[currentSet].checkPhraseLetter({3})'>{4}</a></span>".format(i, tileClass, letter, phraseLetterParams, letter);
		}
		return result;
	}

	this.getTileHTML = function()
	{
		var result = "";
		for (var i = 0; i < this.tiles.length; i++)
		{
			var matched = this.tiles[i].matched ? "tileCorrect" : "";
			result += "<div id='tile_{0}' onClick=\"activityItems[currentSet].checkTileLetter('{1}')\" class='tileLetter {2}'>{3}</div>".format(this.tiles[i].letter, this.tiles[i].letter, matched, this.tiles[i].letter);
		}
		return result;
	}

	this.checkTileLetter = function(letter)
	{
		if ($("#tile_{0}".format(letter)).hasClass("tileCorrect")) return; // already correct
		$("#feedbackImage").hide();
		this.selectedTile = letter;

		// clear the phrase selection
		this.selectedPhraseLetter = '!';
		$(".phraseLetterSelected").addClass("phraseLetterText");
		$(".phraseLetterSelected").removeClass("phraseLetterSelected");

		if ($(".letter_{0}".format(letter)).css("color") == this.correctTextColor) return;

		// reset tile images
		var tilesHMTL = this.getTileHTML();
		$("#letterTiles").html(tilesHMTL);

		// highlight selected tile
		$("#tile_{0}".format(letter)).addClass('tileSelected');
	}

	this.checkPhraseLetter = function(letter, phraseIndex)
	{
		letter = decodeURI(letter);
		if ($("#phraseLetterIndex_{0}".format(phraseIndex)).hasClass("phraseLetterCorrect")) return; // already correct

		this.selectedPhraseLetter = letter;
		$(".phraseLetterSelected").addClass("phraseLetterText"); 
		$(".phraseLetterSelected").removeClass("phraseLetterSelected"); // prevents multiple adding of the same class
		$("#phraseLetterIndex_{0}".format(phraseIndex)).removeClass("phraseLetterText");
		$("#phraseLetterIndex_{0}".format(phraseIndex)).addClass("phraseLetterSelected");

		// compare with selected tile
		this.checkCorrect(phraseIndex);
	}

	this.checkCorrect = function(phraseIndex)
	{
		if (this.selectedTile == '-' || this.selectedPhraseLetter == '!') return;
	
		if (this.selectedTile.toLowerCase() == this.selectedPhraseLetter.toLowerCase())
		{
			var letter = this.selectedPhraseLetter.toLowerCase();

		    $("#phraseLetterIndex_{0}".format(phraseIndex)).removeClass("phraseLetterSelected"); 
			$("#phraseLetterIndex_{0}".format(phraseIndex)).removeClass("phraseLetterText");
			$("#phraseLetterIndex_{0}".format(phraseIndex)).addClass("phraseLetterCorrect");
			$("#phraseLetterIndex_{0}".format(phraseIndex)).css("text-decoration", "none");

			// update tile object
			for (var i = 0; i < this.tiles.length; i++)
			{
				if (this.tiles[i].letter == letter)
				{
					// this.tiles[i].matched = true;
					if (this.tiles[i].setMatch(phraseIndex))
					{
						// set tile color to tileCorrect
						$("#tile_{0}".format(letter)).removeClass("tileSelected");
						$("#tile_{0}".format(letter)).addClass("tileCorrect");
						$("#tile_{0}".format(letter)).attr("onclick", "");
					}
				}
			}

			this.successCount++;
			$("#foundText").html("{0}/{1}".format(this.successCount, this.totalToMatch()));
			showFeedback('correct');
			if (this.successCount == this.totalToMatch())
			{
				SetsCompleted++;
				showFeedback("set_completed");
				$(function () {
					$(".phraseLetter").css("text-decoration", "none");
				    $('.phraseLetter').on("click", function (e) {
				        e.preventDefault();
				    });
				});	

			}

		}
		else
		{
			this.failCount++;
			showFeedback('incorrect');
		}
	}
}


function LetterTile(letter)
{
	this.matched = false;
	this.letter = letter;
	this.matchingLetters = new Array();

	this.isLetterSelected = function(letterIndex)
	{
		for (var i = 0; i < this.matchingLetters.length; i++)
		{
			if (this.matchingLetters[i][0] == letterIndex) 
				return this.matchingLetters[i][1];
		}
		return false;
	}

	this.addLetter = function(phraseLetterIndex)
	{
		this.matchingLetters.push([phraseLetterIndex, false]);
	}

	this.setMatch = function(phraseIndex)
	{
		for (var i = 0; i < this.matchingLetters.length; i++)
		{
			if (this.matchingLetters[i][0] == phraseIndex)
			{
				this.matchingLetters[i][1] = true;
				break;		
			}
		}

		var cnt = 0;
		for (var i = 0; i < this.matchingLetters.length; i++)
		{
			if (this.matchingLetters[i][1]) cnt++
		}
		this.matched = cnt == this.matchingLetters.length;
		return this.matched;
	}
}

