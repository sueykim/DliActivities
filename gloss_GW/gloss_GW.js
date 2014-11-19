disableStripNamespace = true

$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "gloss_GW_sampleData.xml";
	jsonFilename = mediaPath + "gloss_GW_sampleData.js";
	cssFilename = "styles/gloss_GW.css";
	
	loadActivity(parseXml);
	
}); 

function parseXml(t_xml){
	$($("#main > h1")[0]).text("step number: " + params["stepIndex"] )
}