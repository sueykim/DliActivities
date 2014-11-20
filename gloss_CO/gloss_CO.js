disableStripNamespace = true

$(document).ready(function() {
	audioInit();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Default values (for testing)
	mediaPath = "sampleData/";
	xmlFilename = mediaPath + "gloss_CO_sampleData.xml";
	jsonFilename = mediaPath + "gloss_CO_sampleData.js";
	cssFilename = "styles/gloss_CO.css";
	
	loadActivity(parseXml);
	
}); 

function parseXml(t_xml){
	$($("#main > h1")[0]).text("CO - step number: " + params["stepIndex"] )
}