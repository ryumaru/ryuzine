//******************************************************//
//						  OVR							//
//					(OBJECT VR VIEWER)					//
//					   Version 1.5						//
//				Experimental Touch Support				//
//			Copyright 2011 K. M. Hansen			//
//			E-mail: software@kmhcreative.com			//
//			Released under the MIT License				//
//	http://www.opensource.org/licenses/mit-license.php	//
//			Website: www.kmhcreative.com/labs/ovr/		//
//======================================================//
// QUICK START INSTRUCTIONS:
// 	0. 	Load ClassName script if you want IE support (optional)
// 	1. 	Load this script in the HEAD of your web page
// 	2. 	Include "vr_00" in the filename of your first image in the sequence
// 		EXAMPLE: boxvr_00.jpg, Object_vr_00.png, etc.
// 	3. 	Continue naming subsequent images with the vr_xx convention
// 	4. 	Place the first images in the web page
//	5.	Wrap each image in a DIV with the class="vr"

var com = com || {};
	com.kmhcreative = com.kmhcreative || {};
	com.kmhcreative.Ovr = com.kmhcreative.Ovr || {};
com.kmhcreative.Ovr = function() {
	// Shared Project Variables //
	var vr = 0;var numFrames = [];var q = 0;var touched = 0;var w = 0;	var p = 0;
	var mapmaker = "";var map="";var vrBox = [];var vrb="";var track="";
	var bug="";var vrPic = [];var slidePos = [];var vrWidth = [];var vrHeight = [];
	var adjL = [];var adjR = [];var handle = [];var imgObj = [];new_path = [];
	var staticimg =""; var tzone = []; var prevX = {};
	
	// If there is an external configuration file
	// find it and create a shorthand pointer to it
	if (com.kmhcreative.Ovr.config != undefined) {
		var cfg = com.kmhcreative.Ovr.config;  			// Use PRIVATE CONFIG OBJECT
	} else {
		alert('OVR Config File not found!');
	}
	if (com.kmhcreative.Ovr.config.swap != undefined) {
		var ovrCount = com.kmhcreative.Ovr.config.swap.ovrCount;
		var ovrData = com.kmhcreative.Ovr.config.swap.ovrData;
	} else {
		var ovrCount = 0;
		var ovrData = [];
	}

	if (cfg != undefined) {
		// Import config variables if they exist
		var preload = cfg.preload;
		var divBox = cfg.divBox;
		var shiftvr = cfg.shiftvr;
		var showmessage = cfg.showmessage;
		var messagetext = cfg.messagetext;
		var IEsupport = cfg.IEsupport;
	} else {
		// Otherwise Use Default Values
		var preload = "yes";
		var divBox = "none";
		var shiftvr = 0;
		var showmessage = "yes";
		var messagetext = escape("Hold+Drag Left/Right to Rotate");
		var IEsupport = "yes";
	};

var init = function() {
	// Find all DIVs tagged for VR //
	if (document.getElementsByClassName) {
		vrBox = document.getElementsByClassName('ovr');
	}
	else { // IE < version 9
		vrBox = getElementsByClassName('ovr','div');
		// Note: Requires loading getElementsByClassName script //
		// by Robert Nyman available at www.robertnyman.com		//
	}

		// If swap is being used take care of it now //
			if (ovrCount > 0) {
				var ovrImg = [];
				for (var j=0; j<ovrCount; j++) {
					ovrImg[j] = vrBox[j].getElementsByTagName('img')[0];
				} 
		
			// Screen size stuff //
			var winSize = function() {
			  if(typeof ( window.innerWidth ) == 'number') {
					winSize = function() { // Replaces itself with the correct answer
						//Non-IE or IE9
						var W = window.innerWidth;
						var H = window.innerHeight;
						return {W:W,H:H};}
				} 
				else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { 
					winSize = function() {
						//IE 6+ in 'standards compliant mode'
						var W = document.documentElement.clientWidth;
						var H = document.documentElement.clientHeight;
						return {W:W,H:H}; // Return values as objects
					}} 
				else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
					winSize = function() {
						//IE 4 compatible
						var W = document.body.clientWidth;
						var H = document.body.clientHeight;
						return {W:W,H:H}; // Return values as objects
					}
				}
			}
			winSize();
			var size = winSize();
			var W = size.W;
			// 		Swap out OVR images based on screen size 		//
				for (var j=0; j<ovrCount; j++) {
					if (W>=1024) { // medium image
						if (window.devicePixelRatio >= 2 && ovrData[j][3] != "") {
						ovrImg[j].src=ovrData[j][3];}
						ovrImg[j].src=ovrData[j][1];
					}
					else { // small (mobile) image
						if (window.devicePixelRatio >= 2 && ovrData[j][2] != "") {
						ovrImg[j].src=ovrData[j][2];}
						ovrImg[j].src=ovrData[j][0];
					}
				}	
			}
	// Now build out the OVR Player //	
	for (var i=0; i<vrBox.length; i++) {
		slidePos[i] = new Array(2);
		// See if a custom number of frames is being used //
		if (vrBox[i].className.length > 2 ) { 	// look for f-x class
			var findcount = vrBox[i].className.split(" ");
			var framecount = findcount[1].split("-");
			numFrames[i] = framecount[1]; //set numFrames to number indicated
		}
		else {
			numFrames[i] = 8; // assume there are this many unique frames if not specified
		}
		// Get Info from Static Image //
			for (var b=0;b<vrBox[i].childNodes.length;b++) {
				if (vrBox[i].childNodes[b].tagName == "IMG") {
					staticimg = vrBox[i].childNodes[b];
				}
				else {}
			}
		vrWidth[i] = staticimg.offsetWidth;		 		// Get Static Image ACTUAL Width
		vrHeight[i] = staticimg.offsetHeight;		 	// Get Static Image ACTUAL Height
		vrPic[i]=staticimg.src;
		var imgvr = '<img id="vrPic'+i+'" src="'+vrPic[i]+'"  style="border:none;visibility:visible;" />';
		var vrb = '<div id="vr'+i+'" class="vr" >';
		var bug = '<div class="ovr-bug" onmouseover="this.style.opacity=\'1\';this.style.filter=\'alpha(opacity=100)\';" onmouseout="this.style.opacity=\'.50\';this.style.filter=\'alpha(opacity=50)\';"><a href="http://www.kmhcreative.com/labs/ovr/" target="_blank" style="border:none;"><div class="v"></div><div class="r"></div></a></div>';
		mapmaker = "";
		imgList(i,vrWidth[i],vrHeight[i]);
		if (showmessage == "yes") {
			var msgsw = "block" } else { var msgsw = "none" }
		var track = '<div id="msg'+i+'" class="ovrmsg" style="position:absolute;top:0;left:0;width:100%;display:'+msgsw+';z-index:60;text-align:center;" ontouchstart="this.style.display=\'none\';" onmousedown="this.style.display=\'none\';"><p>'+unescape(messagetext)+'</p></div><div id="track'+i+'" class="slidetrack" style="position:absolute;top:0;height:100%;width:100%;display:block;z-index:50;-webkit-touch-callout: none;-webkit-user-select:none;"><div id="slider'+i+'" class="thumbslider" style="position:absolute;top:0px;width:100%;height:100%;overflow:hidden;" onmousedown="com.kmhcreative.Ovr.slideStart(event,'+i+');" ontouchstart="com.kmhcreative.Ovr.touchMove(event,'+i+');" ontouchend="com.kmhcreative.Ovr.touchStop('+i+');"></div></div>';
		vrBox[i].innerHTML=vrb+imgvr+map+bug+track+"</div>";
		adjL[i] = vrActualPos(i).left;
		adjR[i] = vrWidth[i]+adjL[i];
	};
} // end of init

var vrActualPos = function(v) {
	var bodyrect = document.body.getBoundingClientRect();
	var picrect = document.getElementById('vrPic'+v).getBoundingClientRect();
	var	offset = {
		top		: parseInt(picrect.top - bodyrect.top),
		right 	: parseInt(picrect.right - bodyrect.right),
		bottom	: parseInt(picrect.bottom - bodyrect.bottom),
		left	: parseInt(picrect.left - bodyrect.left)
	}
	return offset;
}

var vrSliderFix = function() {
		if ( divBox != "none" ) {var divPos = document.getElementById(divBox).offsetLeft+shiftvr;}else{var divPos=0};
		// Re-Adjust Slider Range and Stops for Positioned VR Viewer on Window Resize 	//
		for (var v=0; v<vrBox.length; v++) {
		vrWidth[v] = document.getElementById('vrPic'+v).offsetWidth;
		vrHeight[v] = document.getElementById('vrPic'+v).offsetHeight;
		adjL[v] = vrActualPos(v).left;
		adjR[v] = vrWidth[v]+adjL[v];
		}
}

// Process Touch Slider Events //
var touchMove = function(e,v) {
	q = v;
	var n = event.currentTarget;
	prevX = event.touches[0].pageX;
	n.addEventListener('touchmove',com.kmhcreative.Ovr.spinIt, false);
}

var spinIt = function(event){
	var n = event.currentTarget;
	event.preventDefault();
    var curX = event.touches[0].pageX;
			if (curX < prevX) {
			p = p+1;
			} else {
			p = p-1;
			}
			prevX = curX;
			event.preventDefault();
		if (p < 0) { p = numFrames[q]-1 }
		if (p > numFrames[q]) { p = 0 }
		jswap(q,p);
	prevX = event.touches[0].pageX;
	touched = 1;
};

var touchStop = function(n) {
	document.getElementById('slider'+n).removeEventListener('touchmove',com.kmhcreative.Ovr.spinIt, false);
}


// Draw Image Map //	
var imgList = function(i,w,h) {
	var f  = 0;
	imgObj[i] = [];
	new_path[i] = [];
	for ( var m=0; m <= numFrames[i]; m++) {
			if ( m == numFrames[i] ) { var f = 0 } else { var f = m };
			// IMAGE PATH ARRAY //
				var temp = vrPic[i].split('vr_'); // look for this in file name
				if (f < 10) {prefix = "0";}
				if (f >= 10) {prefix = "";}
				var filename = temp[temp.length-1];
				var fix_file = filename.replace("00",prefix+""+f);
				new_path[i][m] = temp[0]+"vr_"+fix_file;
			// IMAGE PRELOADER
			if (preload == "yes") {
				imgObj[i][m] = new Image();
				imgObj[i][m].src = new_path[i][m];
			}
			
	}
}

// Swap Out Images //
var jswap = function(i,f) {
	document.getElementById('vrPic'+i).src=new_path[i][f];
}

// Track Slider Position and Display Correct Image //
var pictureShow = function(curX,n) {
	var pic = "0";
	if (touched == 1) {
		adjL[n] = 0;
	} else {};
	for (var i=0; i <= numFrames[n]; i++) {
		if (curX >=adjL[n] && curX < (slidePos[n][0]+adjL[n])) {pic = 0;}
		if (curX >= slidePos[n][0] ) {
			if (curX >= (slidePos[n][i]+adjL[n]) && curX < (slidePos[n][i+1]+adjL[n])) {pic=i;} 
		}
	}
	jswap(n,pic);
	}	

// Desktop Browser Slider Control //

var slideStart = function(event,vr) {
	var el;
	var x, y;
	slideObj = document.getElementById('slider'+vr);
	thisImg = document.getElementById('vrPic'+vr);
	q = vr;
	// GET CURSOR POSITION
	if (window.attachEvent) {
        x = window.event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
    	y = window.event.clientY+document.documentElement.scrollTop+document.body.scrollTop;
  	}
	else if (window.addEventListener) {
    	x = event.clientX + window.scrollX;
    	y = event.clientY + window.scrollY;
	}
    // SAVE STARTING POS OF CURSOR and ELEMENT
    slideObj.cursorStartX = x;
    prevX = slideObj.cursorStartX;
		slideObj.elStartLeft = parseInt(slideObj.style.left, 10);
		slideObj.elStartTop = parseInt(slideObj.style.top, 10);
    if (isNaN(slideObj.elStartLeft)) slideObj.elStartLeft = 0;
    if (isNaN(slideObj.elStartTop)) slideObj.elStartTop = 0;
    
    // CAPTURE MOUSE MOVE
    if (window.attachEvent) {
    	document.attachEvent("onmousemove", slideGo);
    	document.attachEvent("onmouseup",   slideStop);
    	window.event.cancelBubble = true;
    	window.event.returnValue = false;
  	}
  	else if (window.addEventListener) {
    	document.addEventListener("mousemove", slideGo, true);
    	document.addEventListener("mouseup", slideStop, true);
    	event.preventDefault();
  	}
	}

var slideGo = function(event) {
	var curX;
	// GET CURSOR POSITION
	if (window.attachEvent) {
    	curX = window.event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
  	}
  	else if (window.addEventListener) {
		curX = event.clientX + window.scrollX;			
  	}
	// MOVE DRAG ELEMENT
	if ( (curX >= adjL[q] && curX <= adjR[q]) ) {
		if (window.attachEvent) {
			slideObj.style.left = (slideObj.elStartLeft + curX - slideObj.cursorStartX) + "px";
			window.event.cancelBubble = true;
    		window.event.returnValue = false;
			}
		else if (window.addEventListener) {
			slideObj.style.left = (slideObj.elStartLeft + curX - slideObj.cursorStartX) + "px";
		}
			if (curX < prevX) {
			p = p+1;
			} else {
			p = p-1;
			}
			prevX = curX;
			event.preventDefault();
			slideObj.style.left = "0px";
		if (p < 0) { p = numFrames[q]-1 }
		if (p > numFrames[q]) { p = 0 }
		jswap(q,p);
	}
}

var slideStop = function(event) {
	// STOP CAPTURE EVENTS
	if (window.detachEvent) {
		document.detachEvent("onmousemove", slideGo);
		document.detachEvent("onmouseup", slideStop);
	}
	else if (window.removeEventListener) {
		document.removeEventListener("mousemove", slideGo, true);
		document.removeEventListener("mouseup", slideStop, true);
	}
}
		
	return { // Expose Functions to Public Call
		init : init,
		spinIt : spinIt,
		vrSliderFix : vrSliderFix,
		touchMove : touchMove,
		touchStop : touchStop,
		jswap : jswap,
		vrHeight : vrHeight,
		slideStart : slideStart
	}
}();
OVR = com.kmhcreative.Ovr;	// alias for backwards compatibility