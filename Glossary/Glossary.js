$(document).ready(function() {
	testVideoSupport();
	
	$('#feedback').hide();

	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "glossary.xml";
	jsonFilename = mediaPath + "glossary.js";
	cssFilename = "styles/Glossary.css";

	loadActivity(parseXml);

	if(params['performanceChecks'] != undefined){
		alert("function ready params loaded")
	}
	
	$( "#engSelectable" ).selectable({selected: listItemSelected});
	
	$( "#engPhraseSelectable" ).selectable();
	
	//Load filter letter bar
	for(var i = "A".charCodeAt(0); i < "Z".charCodeAt(0) + 1; i++){
		var filterBtn = $("#filterBtnSnip").clone()
		$(filterBtn).find(".filterBtn").text(String.fromCharCode(i))
		$("#filterLetterBar").append($(filterBtn.html()))
	}
	
	//Load filter module bar
	for(var i=0; i < highestModule; i++){
		var filterBtn = $("#filterBtnSnip").clone()
		$(filterBtn).find(".filterBtn").text(i + 1)
		$("#filterModuleBar").append($(filterBtn.html()))		
	}
	//Load filter task bar
	for(var i=0; i < highestTask; i++){
		var filterBtn = $("#filterBtnSnip").clone()
		$(filterBtn).find(".filterBtn").text(i + 1)
		$("#filterTaskBar").append($(filterBtn.html()))		
	}	
	
	if(params['languageName'] != undefined){
		$("#glossaryTitle").text(capitaliseFirstLetter(params['languageName']) + " HeadStart Glossary")
	}
	
	if(params['performanceChecks'] != undefined){
		alert("function ready finished")
	}
}); 

var highestModule = 10
var highestTask = 7

function filterBtnClicked(value){
	if($(value).hasClass("toggled")){
		$(value).removeClass("toggled")
	}else{
		$(value).addClass("toggled")
	}
	
	updateFilteredItems()
}

function updateFilteredItems(){
	$("#engSelectable > li").removeClass("hidden")
	
	if($("#filterBar .filterBtn.toggled").length > 0){
		$("#engSelectable > li").each(function(i,v){
			if($("#filterLetterBar > .filterBtn.toggled").length > 0){
				//Filter by letters
				var phraseStartsWith = $(v).find("div > .label").text()[0].toUpperCase()
				
				if($("#filterLetterBar > .filterBtn.toggled:contains('" + phraseStartsWith + "')").length == 0){
					$(v).addClass("hidden")
				}
			}
			
			if($("#filterModuleBar > .filterBtn.toggled").length > 0){
				//Filter items based on module number
				if($("#filterModuleBar > .filterBtn.toggled:contains('" 
									+ $(v).attr("modulenum") + "')").length == 0){
					$(v).addClass("hidden")
				}
			}
			
			//Filter items based on task number
			if($("#filterTaskBar > .filterBtn.toggled").length > 0){
				//Filter items based on module number
				if($("#filterTaskBar > .filterBtn.toggled:contains('" 
									+ $(v).attr("tasknum") + "')").length == 0){
					$(v).addClass("hidden")
				}
			}
		})
	}
	
	setTimeout(function(){
		$("#engTab").mCustomScrollbar("update")}, 500)
}

function scrollToItem(value, scrollInertia){
	var options = {};
	
	if(scrollInertia != undefined){
		options['scrollInertia'] = scrollInertia;
	}
}
 
var gv_tally = 0;
function listItemSelected(event, ui){
	var tally = 0;

//	alert($(ui.selected).html())
	$(ui.selected.parentNode).find("li").each(function(){
	    if($(this).hasClass("ui-selected")){
	        return false;
	    }
	    
	    tally++
	
	});
	gv_tally = tally;
	$('#setText').html((tally+1) + '/' + numItems);
	execute_select_item(tally);
	scrollToItem(tally);
	playTheVideo();
	
}
function execute_select_item(tally){
	$(".itemInfo_Index").text((tally+1) + "/" + (numItems))
	
	$("#engSelectable li").removeClass("ui-selected");
	$($("#engSelectable li")[tally]).addClass("ui-selected");
	
	jItem = $($(xml).find("phrase")[tally]);
	
	$('.itemInfo_English').text(jItem.find("english").text());
	$('.itemInfo_Transliteration').text(jItem.find("transliteration").text());
	$('.itemInfo_Translation').text(jItem.find("translation").text());	
}

var jItem;

function playTheVideo(){
	if(jItem != undefined){
		var suffix = ""
		
		if(jItem.find("phraseID").attr("frms") == "true"){
			suffix = "frms"
		}else if(jItem.find("phraseID").attr("ams") == "true"){
			suffix = "ams"
		}
			
		var file_video = $(xml).find("gloss").attr("language_code")
							+ jItem.find("phraseID").text()
							+ "_" + suffix;
		loadVideo(mediaPath, removeFileExt(file_video), "Glossary");
	}
}
var numItems 

function parseXml(t_xml){
	if(params['performanceChecks'] != undefined){
		alert("function parseXml started")
	}
	
	xml = t_xml
	var engHtml = "";
	
	//Sort xml
	var items = $(xml).find('phrase');

	if(params['performanceChecks'] != undefined){
		alert("function parseXml sort started")
	}
	
	if(params['sort'] != undefined){
		items.sort(function(a, b){
			var a_start = $(a).find("> english").text().charCodeAt(0)
			var b_start = $(b).find("> english").text().charCodeAt(0)
			
			return a_start - b_start
		});
	}


	if(params['performanceChecks'] != undefined){
		alert("function parseXml sort ended")
	}	
	
	var glossNode = $(xml).find("gloss")
	glossNode.empty()
	
	$.each(items, function(i,v){
		glossNode.append(v)
	})
	
	if(params['performanceChecks'] != undefined){
		alert("function parseXml phrase generation started")
	}
	
	$(xml).find("phrase").each(function(i,v){
		var parts = $(v).attr("loc").match(/^([0-9]+)_([0-9]+)_([0-9]+)$/)
		var modNum = parseInt(parts[2])
		var taskNum = parseInt(parts[3])
		
		var itemSnipClone = $("#itemSnip").clone()
		
		itemSnipClone.attr("modulenum", modNum)
		itemSnipClone.attr("tasknum", taskNum)
		itemSnipClone.find(".label").text($(v).find("english").text())
		
		engHtml = engHtml + itemSnipClone.html()
		
		if(params['debug'] != undefined){
			engHtml += " :" + modNum + "," + taskNum 
		}
		
		engHtml +=  '</li>';
	})

	if(params['performanceChecks'] != undefined){
		alert("function parseXml phrase generation ended")
	}	
	
	$('#engSelectable').html(engHtml);
	
	if(params['performanceChecks'] != undefined){
		alert("function parseXml phrase generation appended")
	}
	
	//alert($($('.enw_li')[0]).html()); 
	var firstSelect= $($('.enw_li')[0]);
	firstSelect.addClass("ui-selected");
	numItems = $(xml).find("phrase").length;
	$('#setText').html('1/' + numItems);
	execute_select_item(0);
	playTheVideo();
	
	if(params['performanceChecks'] != undefined){
		alert("function parseXml finished")
	}
	
	setTimeout(function(){
		$("#engTab").mCustomScrollbar()}, 500)	
}

function prevItemClick(){
	if (gv_tally > 0){
		gv_tally--;
	}
	execute_select_item(gv_tally);
	playTheVideo();
	$('#setText').html((gv_tally+1) + '/' + numItems);	
	scrollToItem(gv_tally);
}
function nextItemClick(){
	if (gv_tally < numItems-1){
		gv_tally++;
	}
	execute_select_item(gv_tally);
	playTheVideo();
	$('#setText').html((gv_tally+1) + '/' + numItems);	
	scrollToItem(gv_tally);
}
function getPassedParameters()
{
	mediaPath = getURL_Parameter("mediaPath");
	xmlPath   = getURL_Parameter("xmlPath");
	return mediaPath != 'undefined';
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