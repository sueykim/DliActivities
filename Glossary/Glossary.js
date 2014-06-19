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
	
	//$( "#engSelectable" ).selectable({selected: listItemSelected});
	
	
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

	if(params['languageId'] != undefined){
		languageId = params['languageId']
	}	
	
	if(params['performanceChecks'] != undefined){
		alert("function ready finished")
	}
}); 

var languageId = ""
var highestModule = 10
var highestTask = 7

function filterBtnClicked(value){
	loadBlankItem()
	
	if($(value).hasClass("toggled")){
		$(value).removeClass("toggled")
	}else{
		$(value).addClass("toggled")
	}
	
	updateFilteredItems()
	
	listItemSelected($("#engSelectable > li:not('.hidden')")[0])
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
function listItemSelected(node, event){
	if(node == undefined){
		loadBlankItem()
		return
	}
	
	var tally = 0;
	
	$("#engSelectable > li").removeClass("ui-selected")
	
	$(node).addClass("ui-selected")

//	alert($(ui.selected).html())
	$(node.parentNode).find("li").each(function(i,v){
	    if($(v).hasClass("ui-selected")){
	        return false;
	    }
	    
	    tally++
	
	});
	gv_tally = tally;
	
	execute_select_item(tally);
	scrollToItem(tally);
	playTheVideo();
	
}

function loadBlankItem(){
	
	$(".itemInfo_Index").text("")
	
	$("#engSelectable li").removeClass("ui-selected");
	
	$('.itemInfo_English').text("");
	$('.itemInfo_Transliteration').text("");
	$('.itemInfo_Translation').text("");	
	
	$("#videoTag").remove()
}

function execute_select_item(tally){
	var elemIndex = $("#engSelectable li:not('.hidden')")
							.index($("#engSelectable li.ui-selected")[0])
	
	$(".itemInfo_Index").text((elemIndex+1) + "/" + numberOfItems())
	
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
		
		if(jItem.find("phraseID").attr(languageId.substr(0,1) + "ms") == "true"){
			suffix = languageId.substr(0,1) + "ms"
		}else if(jItem.find("phraseID").attr("ams") == "true"){
			suffix = "ams"
		}
			
		var file_video = $(xml).find("gloss").attr("language_code")
							+ jItem.find("phraseID").text()
							+ "_" + suffix;
		loadVideo(mediaPath, removeFileExt(file_video), "Glossary");
	}
}

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
		
		itemSnipClone.find("li").attr("modulenum", modNum)
		itemSnipClone.find("li").attr("tasknum", taskNum)
		itemSnipClone.find(".label").text($(v).find("english").text())
		
		engHtml = engHtml + itemSnipClone.html()
		
		if(params['debug'] != undefined){
			engHtml += " :" + modNum + "," + taskNum 
		}
		
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
	
	execute_select_item(0);
	playTheVideo();
	
	if(params['performanceChecks'] != undefined){
		alert("function parseXml finished")
	}
	
	setTimeout(function(){
		$("#engTab").mCustomScrollbar()}, 500)	
}

function numberOfItems(){
	return $("#engSelectable >li:not('.hidden')").length
}

function prevItemClick(){
	if (gv_tally > 0){
		gv_tally--;
	}
	execute_select_item(gv_tally);
	playTheVideo();
	
	scrollToItem(gv_tally);
}
function nextItemClick(){
	if (gv_tally < $(xml).find("phrase").length-1){
		gv_tally++;
	}
	execute_select_item(gv_tally);
	playTheVideo();
	
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