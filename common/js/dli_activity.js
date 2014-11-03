var mediaPath; 
var xmlPath;
var cssFilename;
var xmlFilename;
var jsonFilename;
var keyboardFilename = "";
var activityDataLoadCallback;
var xml;
var currentSet = 0;
var setXml;
var numSets;

var keyboardHtml;
var params;
var localPath = "";

if(!window.console){
	window.console = {}
	window.console.log = function () { };
}

if (window.location.protocol.indexOf("file") >= 0)
{
	localPath = window.location.href.substr(0, window.location.href.indexOf("templates")-1);
}


String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

function pad(number, length)
{
	var str = '' + number;
	while (str.length < length)
	{
   		str = '0' + str;
	}
	return str;
}


function getActivityXMLFilename(language, lesson, activity, activityType)
{
	var lessonPadded = pad(lesson, 2);
	var activityPadded = pad(activity, 2);
	return "{0}_{1}{2}_{3}.xml".format(language, activityType == "cl" ? 'l' : 'h', lessonPadded, activityPadded); 
}

function getPassedParameters()
{
	mediaPath = getURL_Parameter("mediaPath");
	xmlPath   = getURL_Parameter("xmlPath");
	return mediaPath != 'undefined';
}

function generateHtmlForFurigana(phrase){
    var output = "";
    var phraseParts = phrase.match(/(\[\[.*?\]\]|[^\[]*)/g)
    
    var jFuriganaElement = $("<root><div class='furigana_container'>" + 
                                    "<div class='furigana_div'></div>" + 
                                    "<div class='kanji_div'></div>" + 
                              "</div></root>");
    var jClonedFuriganaElement;
    
    $(phraseParts).each(function(i,v){
        if(v.length == 0){
            return;
        }
        
        jClonedFuriganaElement = jFuriganaElement.clone();
        
        if(v.match(/^\[\[/)){
        //We have a furigana block
            //Trim brackets
            v = v.substring(2, v.length -2)
            
            var sectionParts = v.match(/(\(\(.*?\)\)|[^(]*)/g);
            //var sectionParts = /([(][(])(.*)([)][)])/g.exec(v)    
        
            jClonedFuriganaElement.find(".furigana_div").text
                (sectionParts[1].substring(2, sectionParts[1].length -2));
            jClonedFuriganaElement.find(".kanji_div").text(sectionParts[0]);
        }else{
            //No furigana found
            jClonedFuriganaElement.find(".kanji_div").text(v);
        }
        
        output += jClonedFuriganaElement.html();
    });
    
    return output;
}

function getURL_Parameter(param) {
    var urlQuery = location.href.split("?")
    if (typeof urlQuery == 'undefined')
        return 'undefined';

    if (urlQuery.length < 2)
        return 'undefined';

    var urlItems = urlQuery[1].split("&")
    var paramCount = urlItems.length;
    for (i = 0; i < paramCount; i++) {
        paramItem = urlItems[i].split("=");
        paramName = paramItem[0];
        paramValue = paramItem[1];

        if (param == paramName) {
            return paramValue;
        }
    }
    return 'undefined';
}

//For homework
var homeworkStatus = false;

function loadActivity(t_activityLoadCallback){
	//Load default css file
	//loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Grab params
	params = getParams(window.location.href);

	if(params["debug"] != null){
		$("body").attr("debug", "true")
		//loadjscssfile("../common/js/firebug-lite-1_2.js", "js");
		loadjscssfile("../common/css/debug.css", "css");
	}
	
	if(params["scale"] != null){
		loadjscssfile("../common/css/scale.css", "css");
	}

	//Load default css file
	if(params["activityCSS"] != null){
		loadjscssfile(params["activityCSS"], "css");
	}else{
		loadjscssfile("../common/css/activityDefault.css", "css");
	}
	
	if(params["homeworkStatus"] != null){
		homeworkStatus = params["homeworkStatus"]
	}
	
	//Load mediaPath
	if(params["mediaPath"] != null){
		mediaPath = params["mediaPath"];
	}
	
	//Load mediaPath
	if(params["mediaPath2"] != null){
		mediaPath = params["mediaPath2"];
	}
	
	//Load css
	if(params["cssFilename"] != null){
		cssFilename = params["cssFilename"];
	}
	loadjscssfile(cssFilename, "css");
	
	//Xml filename params
	if(params["xmlFilename"] != null){
		xmlFilename = params["xmlFilename"];
	}
	
	//Json filename params
	if(params["jsonFilename"] != null){
		jsonFilename = params["jsonFilename"];		
	}
	
	//Json filename params
	if(params["keyboardFilename"] != null){
		keyboardFilename = params["keyboardFilename"];		
	}
	
	//Handle for homework
	/* */
	if(params["xmlPath"] != null){
		xmlPath = params["xmlPath"]
		var xmlPath2 = xmlPath.split("/");
		var activityID = params['activity'];

		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		//to get the keyboard
		/* */
		var lang_name_short = params['language'];
		var langName = {ja:'japanese', sp:'spanish', ad:'msa'};
		var lang_name_long = langName.ja;
		keyboardFilename = '../common/keyboards/' + lang_name_long + '_keyboard.js';

	}
	
	$('.activity_hd').html('');
	$('.activity_description').html('');
	loadActivityData(null, null, t_activityLoadCallback);
}

function loadActivityData(t_xmlFilename, t_jsonFilename, t_activityDataLoadCallback){
	//Note- using this logic you can call the function with null values for the filenames
	// and it will take the values currently in the xmlFilename and jsonFilename instead.
	if(t_xmlFilename != null){
		xmlFilename = t_xmlFilename;
	}
	
	if(t_jsonFilename != null){
		jsonFilename = t_jsonFilename;
	}
	
	if(t_activityDataLoadCallback != null){
		activityDataLoadCallback = t_activityDataLoadCallback;
	}
	
	if(xmlFilename == null){
		if(jsonFilename == null){
			alert("Error- Neither xml nor json data source given.");
		}else{
			//Load Json if only Json given
			loadjscssfile(jsonFilename, 'js',jsonLoaded);
		}
	}else{
		//Load xml
		//xmlFilename = localPath + xmlFilename;
		//mediaPath = localPath + mediaPath;
		
		$.ajax({
		    type: "GET",
		    url: xmlFilename,
		    dataType: "xml",
			async: false,
		    success: handleXml,
		    error: ajaxErrorFunc
		});
	}
}


function displayRubyTag(textInput){
	return textInput
}


function handleXml(t_xml)
{
	var fileText
	
	if(t_xml.xml != undefined){
		//alert("using t_xml.xml")
		fileText = t_xml.xml
	}else{
		fileText = new XMLSerializer().serializeToString(t_xml);
	}
	
	//todo fix 
	fileText = stripNamespace(fileText)
	
	xml = $.parseXML(fileText);
	
	if(keyboardFilename.length > 0){
		loadjscssfile(keyboardFilename, 'js',jsonKeyboardLoaded);
	}
	
	if(activityDataLoadCallback){
		activityDataLoadCallback(xml);
	}
}

function jsonKeyboardLoaded(){
	var X2JSinst = new X2JS();
	
	//jsonKeyboard should be defined in the json file we just loaded
	keyboardXml = X2JSinst.json2xml(jsonKeyboard);
	loadKeyboard();
}

var keyboardXml;
function loadKeyboard(){
	$("#keyboardContainer").html(new XMLSerializer().serializeToString(keyboardXml));

	//Clean up the commas from the conversion
	var children = $("#keyboard").clone().children();
	var node = $("#keyboard").clone().children().remove().end().text("");
	node.append(children);
	$("#keyboard").replaceWith(node);
	
	if(typeof keyboardLoadCallback != "undefined")
	{
		keyboardLoadCallback();
	}
}

function ajaxErrorFunc(jqXHR, textStatus, errorThrown){
	if(jsonFilename != null && jsonFilename.length > 0){
		loadjscssfile(jsonFilename, 'js',jsonLoaded);
	}else{
		alert("Error- Can't load activity xml and alternative json not listed.");
	}
}


function jsonLoaded(){
	var X2JSinst = new X2JS();
	
	//jsonData should be defined in the json file we just loaded
	var fileText = new XMLSerializer().serializeToString(
										X2JSinst.json2xml(jsonData))
	fileText = fileText.replace(/<(\/?)([^:>\s]*:)?([^>]+)>/g, "<$1$3>")
	xmlFromJson = $.parseXML(fileText)
	
	handleXml(xmlFromJson);	
}


var debugPanelShown = false;

function loadDebugPanel(){
	if($("#debugPanelToggle").length == 0){
		$("body").append("<div id='debugPanelToggle'>Toggle Debug</div>");
		
		$('#debugPanelToggle').click(function(){
			if(debugPanelShown){
				debugPanelShown = false;
				$('#debugPanel').hide();
			}else{
				debugPanelShown = true;
				$('#debugPanel').show();
			}
		});
	
	}
		
	if($("#debugPanel").length == 0){
			$("#debugPanel").html();

		$("body").append("<div id='debugPanel'>" + 
							"<p>" + navigator.platform + 
							"</p><p>" + navigator.userAgent + 
							"</p><p>" + BrowserDetect.browser + ' ' + 
							BrowserDetect.version + ' on ' + 
							BrowserDetect.OS + "</p>" + 
						"</div>");
		$('#debugPanel').hide();
	}
}

var setBtnLock = false;

function nextClick(){
	if(setBtnLock)
		return;
		
	if(currentSet == numSets - 1){
		
	}else{	
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(setBtnLock)
		return;
	
	if(currentSet == 0){
		
	}else{
		loadSet(currentSet - 1);
	}
}

function updateSetText(){
	//document.getElementById('setText').innerHTML = (currentSet + 1) + "/" + numSets;
	$("#setText").html((currentSet + 1) + "/" + numSets);
}

function updateNavButtons(){
	updateSetText();
	
	$("#prevBtnClickGuard").hide();
	$("#nextBtnClickGuard").hide();
	$("#nextBtnLink").hide();
	$("#prevBtnLink").hide();
	
	if (currentSet == 0)
	{
		$("#prevBtnClickGuard").show();
		$("#nextBtnLink").show();
	}
	else if (currentSet == numSets - 1)
	{
		$("#nextBtnClickGuard").show();
		$("#prevBtnLink").show();
	}
	else
	{
		$("#prevBtnLink").show();
		$("#nextBtnLink").show();
	}
	}
	
function logStudentAnswer(questionID, answer, context) 
{
	//if (typeof parent.framework == 'undefined') return; // not running under framework
	
	var student = getURL_Parameter('student');
	var language = getURL_Parameter('language');
	var lessonID = getURL_Parameter('lesson');
	var activityID = getURL_Parameter('activity');
	var activityType = getURL_Parameter('activityType');

	if (language == 'undefined' || lessonID == 'undefined' || activityID == 'undefined' || activityType == 'undefined' ) return;

	var template = '[';
	template += '{';
	template += '"language": "{0}",';
	template += '"studentID": "{1}",';
	template += '"lessonID": "{2}",';
	template += '"activityID": "{3}",';
	template += '"questionID": "{4}",';
	template += '"Answer": "{5}",';
	template += '"questionContext": "{6}",';
	template += '"ActivityType": "{7}"';
	template += '}]';	
	
	var answerString = template.format(language, student, lessonID, activityID, questionID, answer, context, activityType);
	
	if(parent.framework && parent.framework.logStudentAnswer != undefined){
		parent.framework.logStudentAnswer(answerString);
	}
	
	// To see logs - temp
	//$("#feedbackText").text("<br><br>" + "Start sending log." + "<br><br>");
	//$("#feedbackText").append("logStudentAnswer: " + "<br>"+ answerString.toString());

	if(getURL_Parameter('logMode') == "test"){
		alert(answerString.toString());
	}
}

function logStudentAnswerAttempts(questionID, attemptCount)
{
	//if (typeof parent.framework == 'undefined') return; // not running under framework
	
	var template = '[';
	template += '{';
	template += '"language": "{0}",';
	template += '"studentID": "{1}",';
	template += '"lessonID": "{2}",';
	template += '"activityID": "{3}",';
	template += '"questionID": "{4}",';
	template += '"Attempts": "{5}",';
	template += '"activityType": "{6}",';
	template += '}]';

	var student = getURL_Parameter('student');
	var language = getURL_Parameter('language');
	var lessonID = getURL_Parameter('lesson');
	var activityID = getURL_Parameter('activity');
	var activityType = getURL_Parameter('activityType');

	var answerString = template.format(language, student, lessonID, activityID, questionID, attemptCount, activityType);
	
	if(parent.framework && parent.framework.logStudentAnswerAttempts != undefined){
		parent.framework.logStudentAnswerAttempts(answerString);	
	}
	
	// To see logs - temp
	//$("#feedbackText").text("<br><br>logStudentAnswerAttempts: " + "<br>"+ answerString.toString());
	//$("#feedbackText").append("<br><br>Done sending log.");
	
	if(getURL_Parameter('logMode') == "test"){
		alert(answerString.toString());	
	}
}

