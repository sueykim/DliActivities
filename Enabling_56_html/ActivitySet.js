function ActivitySet(setObj)
{
	this.wrongAnswerCount = 0;
	this.answeredCorrectly = false;
	this.scenarioTitle = $(setObj).attr("scenarioTitle");
	this.subtitleType = $(setObj).attr("subtitleType"); 
	this.pertinentInfoTitle = $(setObj).attr("pertinentInfoTitle"); 
	this.subTitleText = $(setObj).find("subTitleText").text();
	this.pertinentInfo_en = $(setObj).find("pertinentInfo_en").text();
	this.pertinentInfo_tl = $(setObj).find("pertinentInfo_tl").text();
	this.hint = $(setObj).find("hint").text();
	this.correctFeedback = $(setObj).find("correctFeedback").text();
	this.incorrectFeedback = $(setObj).find("incorrectFeedback").text();

	var tableNode = $(setObj).find("table");
	this.activityTable = new ActivityTable(tableNode);

	this.columnCount = function()
	{
		return this.activityTable.columnHeadings.length;
	}

}

function ActivityTable(tableNode)
{
	this.title = $(tableNode).attr("title");
	this.columnHeadings = new Array();
	this.rows = new Array();

	var headingNodes = $(tableNode).find("columnHeading");
	for (var i = 0; i < headingNodes.length; i++)
	{
		this.columnHeadings.push($(headingNodes[i]).text());
	}

	var rowNodes = $(tableNode).find("row");
	for (var i = 0; i < rowNodes.length; i++)
	{
		var rowObj = new ActivityRow(rowNodes[i]);
		this.rows.push(rowObj);
	}

	this.setSelectedRow = function(rowIndex)
	{
		// remove any other selected values for all other rows in this activity
		for (var i = 0; i < this.rows.length; i++)
		{
			this.rows[i].isSelected = false;
		}

		this.rows[rowIndex].isSelected = true;
	}

	this.setCorrectRow = function()
	{
		var correctRow = -1;

		// remove any other selected values for all other rows in this activity
		for (var i = 0; i < this.rows.length; i++)
		{
			if (this.rows[i].correctAnswer == "yes")
			{
				this.rows[i].isSelected = true;
				correctRow = i;
			}
		}

		return correctRow;
	}

}

function ActivityRow(rowNode)
{
	this.correctAnswer = $(rowNode).attr("correctAnswer");
	this.columns = new Array();
	this.isSelected = false;

	var columnNodes = $(rowNode).find("column");
	for (var i = 0; i < columnNodes.length; i++)
	{
		var columnObj = new RowColumn(columnNodes[i]);
		this.columns.push(columnObj);
	}

	this.isCorrect = function()
	{
		return this.correctAnswer == "yes";
	}
}

function RowColumn(columnNode)
{
	this.isBlank = $(columnNode).attr("isBlank");
	this.keyword = $(columnNode).find("keyword").text();
	this.audioFile = $(columnNode).find("audio").text();
	this.studentKeywordValue = "";

	this.getKeyword = function() 
	{
		return this.keyword;
	}

	this.getAudioFile = function()
	{
		return this.audioFile;
	}

}