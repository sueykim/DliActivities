$(document).ready(function() {
	if(audioInit("instrumental_container").play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}else{
		audioInit("vocals_container")
	}
	
	mediaPath = "sampleData/";
	xmlFilename = "sampleData/Karaoke_sampleData.xml";
	jsonFilename = "sampleData/Karaoke_sampleData.js";
    cssFilename = "styles/Karaoke.css";
    
    
	loadActivity(parseXml);
});

var progressBar_container_width
function parseXml(t_xml){
	numSets = $(xml).find("song").length;
	
	//Build set buttons
	$("#steps_container").empty()
	
	var jSnippetStep = $($("#setBtn_snippet").html());
	
	$($(xml).find("song")).each(function(i,v){
		var jSnippetStepClone = $(jSnippetStep.clone())
		
		jSnippetStepClone.text(i+1)
		
		//Append set button
		$("#steps_container").append(jSnippetStepClone)
	})
	
	
	loadSong(0);
}

var numLines = 0
var totalSongTime = 0
function loadSong(value){
	currentSet = value;

	$("#instrumental_container > audio")[0].pause()
	$("#vocals_container > audio")[0].pause()
	
	$("#muteBtn").attr("muted","false")
	
	jSection = $($(xml).find("song")[currentSet]);
	
	currentLineIndex = 0

	//Clear timer if one is present
	if(songTimer != undefined){
		deleteSongTimer()
	}

	totalSongPlayTime = 0
	
	updateProgressBar()
	
	//Load lyrics
	$("#lyrics").empty()
	jSection.find("> line > lang_tl ").each(function(i,v){
		$("#lyrics").append("<p class='noSelect'>" + $(v).text() + "</p>")
	})
	
	
	if(params["noSong"] == "true"){
		//Not accurate but good enough for testing
		var jTiming = jSection.find("> line > timing")
		totalSongTime = $(jTiming[jTiming.length - 1]).text() * 1000
	}else{
		//The clickguard prevents changing set until the songs are loaded
		$("#clickGuard").css("display", "block")

		//Load instrumental
		var instrumentalFile = jSection.find("file_audio_music").text().trim()
		loadHTMLAudio(removeFileExt(instrumentalFile) ,mediaPath, "instrumental_container")
					.addEventListener('ended', songEnded)
		
		//Load vocals
		//Note- we're assuming that the first audio file will finish
		//loading before this one
		var vocalsFile = jSection.find("file_audio_lyrics").text().trim()
		loadHTMLAudio(removeFileExt(vocalsFile) ,mediaPath, "vocals_container")
					.addEventListener('canplay', songLoaded)
	}
	
	numLines = jSection.find("> line").length
	
	$("#playBtn").attr("state", "paused")
	
	//First Line
	loadLine(0)
}


var currentLineIndex

function loadLine(value){
	currentLineIndex = value
	var jLine = $(jSection.find("> line")[value])
	
	//Load en line text
	$("#english_container").text(jLine.find("feedback").text())
	
	//Load tl line text
	$("#tl_container").text(jLine.find("lang_tl").text())
	
	//Load image
	$("#banner_img").css("background-image", "url('" + mediaPath + "png/" + 
					jLine.find(" > image").text() + "')")
	
}

function setBtnClicked(elem){
	loadSong($(elem).text() - 1)
}

function showLyrics(){
	$("body").attr("state_banner", "lyrics")
}

function showImage(){
	$("body").attr("state_banner", "image")
}

function startOver(){
	loadSong(currentSet);
}

function songEnded(){
	$("#playBtn").attr("state", "paused")
	
	//Clear the timer
	deleteSongTimer()
	
	$("#muteBtn").attr("muted","false")
	
	//Reset the total play time
	totalSongPlayTime = 0
	currentLineIndex = 0
	updateProgressBar()
	
	//Set the button
	$("#playBtn").attr("state", "paused")

	if(params["debug"] == "true"){
		alert("song ended")
	}
}

var songTimer
var totalSongPlayTime = 0

function deleteSongTimer(){
	window.clearInterval(songTimer)
	songTimer = undefined	
}

function updateProgressBar(){
	var songCompletionPercent = totalSongPlayTime / totalSongTime
	var progressBarWidth = progressBar_container_width * songCompletionPercent + "px"
	$("#progressBar").css("width", progressBarWidth)
}

function createSongTimer(){
	songTimer = setInterval(function(){
		totalSongPlayTime += 100
		
		updateProgressBar()
		
		if(params["debug"] == "true"){
			$(".activity_description").text(totalSongPlayTime)
		}
		
		jSection.find("timing").each(function(i,v){
			if(currentLineIndex >= i){
				return
			}
			
			if(totalSongPlayTime >= ($(v).text() - 1) * 1000){
				//We're at a line so load it
				loadLine(i)

				if(params["noSong"] == "true" && 
						i == numLines - 1){
					//In noSong mode we need to call this explicitly
					//Note- This is not accurate, but good enough for testing.
					songEnded()
				}
				
				return false
			}
		})
	},100);	
}

function songLoaded(){
	$("#clickGuard").css("display", "none")
	if($("#instrumental_container > audio")[0].duration == undefined){
		alert("song duration not found")
	}else{
		totalSongTime = $("#instrumental_container > audio")[0].duration * 1000
	}
}

function playSong(){
	//Load it here to reduce latency in the timing loop
	progressBar_container_width = 
		$("#progressBar_container").css("width").replace("px","")
	
	if($("#playBtn").attr("state") == "playing"){
		//We're playing the song so pause it
		
		$("#playBtn").attr("state", "paused")
		$("#instrumental_container > audio")[0].pause()
		$("#vocals_container > audio")[0].pause()
		
		//Clear the timer
		deleteSongTimer()
	}else{
		//We're paused so we want to play the song
		$("#playBtn").attr("state", "playing")
		
		
		//Song has been started and we're paused, so play it
		$("#instrumental_container > audio")[0].play()
		$("#vocals_container > audio")[0].play()
		
		//Start the timer
		createSongTimer()
	}
}

function toggleMute(){
	if(totalSongPlayTime == 0){
		//Song hasn't been started yet so just return
		return
	}
	
	if($("#muteBtn").attr("muted") == "true"){
		$("#muteBtn").attr("muted","false")
		$("#vocals_container > audio")[0].muted = false
	}else{
		$("#muteBtn").attr("muted","true")
		$("#vocals_container > audio")[0].muted = true
	}
}