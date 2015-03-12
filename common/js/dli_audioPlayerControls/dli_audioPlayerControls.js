function DliAudioPlayerControls(t_audioTagID, t_playerControlsLocationID){
	this.load(t_audioTagID, t_playerControlsLocationID)
}

DliAudioPlayerControls.prototype = {
	playPauseToggle : function(ev){
		var self = ev.data.context;
		
		if(self.jPlayBtn.hasClass("jmp3_pause")){
			self.jPlayBtn.removeClass("jmp3_pause")
			self.jPlayBtn.addClass("jmp3_play")

			self.jAudioTag[0].pause()
		}else{
			self.jPlayBtn.removeClass("jmp3_play")
			self.jPlayBtn.addClass("jmp3_pause")

			self.jAudioTag[0].play()
		}
	},

	load : function(t_audioTagID, t_playerControlsLocationID){
		//alert("hi")
		this.audioTagID = t_audioTagID
		this.playerControlsLocationID = t_playerControlsLocationID

		this.jAudioTag = $("#" + this.audioTagID)

		this.jPlayer = $("#" + this.playerControlsLocationID)

		this.jPlayer.html(
			'<div class="jmp3_container">\
			  <div class="jmp3_play noSelect" title="Play/Pause">Play</div>\
			  <div class="jmp3_stop" title="Stop">Stop</div>\
			  <div class="jmp3_trackbar"><div class="jmp3_loaded"></div><div class="jmp3_playhead"></div></div>\
			  <div class="jmp3_prev" title="Previous">Previous</div>\
			  <div class="jmp3_next" title="Next">Next</div>\
			  <div class="jmp3_timer">0:00</div>\
			  <div class="jmp3_infos" title="Show track information">Infos</div>\
			  <div class="jmp3_currentTrackDetails"></div>\
			</div>')

		this.jPlayBtn = this.jPlayer.find("> .jmp3_container > .jmp3_play")
		this.jPlayBtn.bind("click", {context: this}, this.playPauseToggle)

		this.jAudioTag.bind("ended", {context: this}, this.audioEnded)
		this.jAudioTag.bind("timeupdate", {context: this}, this.timeUpdate)
		
		//Note - Doesn't work for some reason
		//$(this.jAudioTag[0]).bind("onerror", {context: this}, this.audioError)

		//Todo - Make this a little more robust
		this.jAudioTag[0].addEventListener('error', function(e) {
			alert("Unable to load audio file.")
		}, true);

		this.jPlayHead = this.jPlayer.find(".jmp3_playhead")
		this.jPlayHead.draggable({
		  containment: 'parent', // ...which is .jmp3_trackbar
		  axis: 'x', 
		  drag: function(e, ui) {
			//updateCounterStatus( $drag_counter, counts[ 1 ] );
			//trackBarComputedWidth
		  },
		  stop: function(e, ui){
			//methods._playheadStopDrag.apply(privates, [e, ui]);
		  }
		});	

		this.jPlayHead.bind("dragstart", {context: this}, this.dragStart)
		this.jPlayHead.bind("dragstop", {context: this}, this.dragStop)
	},
	
	dragStart : function(ev){
		var self = ev.data.context

		self.jPlayBtn.removeClass("jmp3_pause")
		self.jPlayBtn.addClass("jmp3_play")

		self.jAudioTag[0].pause()		
	},
	
	dragStop : function(ev){
		var self = ev.data.context
			
		var playHeadLeft = self.jPlayHead.css("left") 
		playHeadLeft = playHeadLeft.substring(0,playHeadLeft.length - 2)
		var computedWidth = self.trackBarComputedWidth()	
		var percentage = playHeadLeft / computedWidth

		self.jAudioTag[0].currentTime = percentage * self.jAudioTag[0].duration
	},

	audioEnded : function(ev){
		var self = ev.data.context;

		self.jPlayBtn.removeClass("jmp3_pause")
		self.jPlayBtn.addClass("jmp3_play")
	},

	timeUpdate : function(ev){
		var self = ev.data.context
 
		var computedWidth = self.trackBarComputedWidth()

		self.jPlayHead.css("left", (this.currentTime/this.duration) 
					* computedWidth)
		
		self.jPlayer.find(".jmp3_timer").text(
			minTommss(self.jAudioTag[0].currentTime/60)
		)
	},

	trackBarComputedWidth : function(){
		var trackBarWidth = this.jPlayer.find(".jmp3_trackbar").css("width")
		trackBarWidth = trackBarWidth.substring(0,trackBarWidth.length - 2)

		var playHeadWidth = this.jPlayer.find(".jmp3_playhead").css("width")
		playHeadWidth = playHeadWidth.substring(0,playHeadWidth.length - 2)

		return trackBarWidth - playHeadWidth
	},

	audioError : function(){
		alert("Unable to load audio")
	}
}

function minTommss(minutes){
 var sign = minutes < 0 ? "-" : "";
 var min = Math.floor(Math.abs(minutes))
 var sec = Math.floor((Math.abs(minutes) * 60) % 60);
 return sign + (min < 10 ? "" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}