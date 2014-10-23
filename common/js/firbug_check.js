var params = getParams(window.location.href);

if(params['firebug'] != undefined){
	// get some kind of XMLHttpRequest
	var xhrObj = new XMLHttpRequest();
	// open and send a synchronous request
	xhrObj.open('GET', "css/firebug-lite.css", false);
	xhrObj.send('');
	// add the returned content to a newly created script tag
	var se = document.createElement('style');
	//se.rel = "stylesheet"
	se.type = "text/css";
	
	
	se.type = 'text/css';
	if (se.styleSheet){
	  se.styleSheet.cssText = xhrObj.responseText;
	} else {
	  se.appendChild(document.createTextNode(xhrObj.responseText));
	}
	document.getElementsByTagName('head')[0].appendChild(se);


	var xhrObj2 = new XMLHttpRequest();
	// open and send a synchronous request
	xhrObj2.open('GET', "../common/js/firebug-lite-1_2.js", false);
	xhrObj2.send('');
	// add the returned content to a newly created script tag
	var se2 = document.createElement('script');
	se2.type = "text/javascript";
	se2.text = xhrObj2.responseText;
	document.getElementsByTagName('head')[0].appendChild(se2);
	
	loadjscssfile("../common/css/firebug-lite.css", "css")
	/*loadjscssfile("js/firebug-lite-1_2.js", "js")*/
}

function getParams(url, ignoreArray) {
	if(typeof ignoreArray === 'undefined' ){
		ignoreArray = [];
	}
	
    var regex = /([^=&?]+)=([^&#]*)/g, params = {}, parts, key, value;

    while((parts = regex.exec(url)) != null) {

        key = parts[1], value = parts[2];
		
		var ignoreElement = false;
		for(var i=0; i< ignoreArray.length; i++){
			if(key == ignoreArray[i]){
				ignoreElement = true;
			}
		}

		if(ignoreElement == true){
			continue;
		}

        var isArray = /\[\]$/.test(key);

        if(isArray) {
            params[key] = params[key] || [];
            params[key].push(value);
        }
        else {
            params[key] = value;
        }
    }

    return params;
}

function loadjscssfile(filename, filetype, callback){
	 if (filetype=="js"){ //if filename is a external JavaScript file
	  var fileref=document.createElement('script')
	  fileref.setAttribute("type","text/javascript")
	  fileref.setAttribute("src", filename)
	 }
	 else if (filetype=="css"){ //if filename is an external CSS file
	  var fileref=document.createElement("link")
	  fileref.setAttribute("rel", "stylesheet")
	  fileref.setAttribute("type", "text/css")
	  fileref.setAttribute("href", filename)
	 }
	 
	 if (typeof fileref!="undefined"){
	  if(callback){
	  	fileref.onload = callback;
	  }
	  
	  document.getElementsByTagName("head")[0].appendChild(fileref)
	 }
}
