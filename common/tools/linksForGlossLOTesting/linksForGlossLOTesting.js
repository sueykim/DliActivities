var glossLOs_URL = "/glossLOs/"
$(document).ready(function() {


})

function start(){
    $.ajax({
            type: "GET",
            url: glossLOs_URL,
            dataType: "text",
            success:  glossLOIndex_result,
            error:ajax_error
        });
}

function ajax_error(jqXHR, textStatus, errorThrown){
	console.log("Error- Can't load url:" + LO_filename);
}

var LO_filename_Arr = []
var LO_filename 


function glossLOIndex_result(t_text){
	var myArray;
	var regExFileNames = /href[=]["](.*?[.]xml)["]/g
	
	while ((myArray = regExFileNames.exec(t_text)) !== null) {
	  LO_filename_Arr.push(myArray[1])
	}
    
    alert("Done parsing index page")

	for(i=0; i< LO_filename_Arr.length ; i++){
		LO_filename = LO_filename_Arr[i]
		
		$.ajax({
				type: "GET",
				async: false,
				url: glossLOs_URL + LO_filename,
				dataType: "xml",
				success:  glossLO_result,
				error:ajax_error
			});
	}


    alert("Done")
}

var outputPrefix = "gloss_GetThePoint.html?mediaAbsolutePath=true&audioVideoMediaDir=media/&disableSubDirectories=true"

function glossLO_result(t_xml){
	var stepIndex=0

	$(t_xml).find("QREC > A_Type").each(function(i,v){
		var A_Type = $(v).text()

		switch(A_Type){
			case "SUM":
			case "LGP":
			case "VGP":
				
				$("body").append("<a href='" 
									+ outputPrefix
									+ "&mediaPath=" + glossLOs_URL
									+ "&xmlFilename=" + glossLOs_URL + LO_filename 
									+ "&stepIndex=" + stepIndex
									+ "'>" 
									
									+ A_Type + " - "
									+ LO_filename
									+ "</a><br />\n")
				break;
		}

		stepIndex++
	})

}