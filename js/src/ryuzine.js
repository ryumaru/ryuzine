/*
RYUZINE
Version: 1.0
Author: K.M. Hansen
Author URI: http://www.kmhcreative.com
License: MPL 2.0
License URI: https://www.mozilla.org/MPL/2.0/
Copyright: 2011-2015 K.M. Hansen & Ryu Maru (software@ryumaru.com)
Program URI: http://www.ryumaru.com/ryuzine

DESCRIPTION: Ryuzine(tm) aka "Ryuzine Reader," turns a properly formatted HTML document
into a page-flipping digital magazine-stye webapp. The "Ryuzine" and "Ryu Maru" logos are 
trademarks of Ryu Maru.  App icon designs copyright 2015 K.M. Hansen.

NOTES: Load ryuzine.config.js before this file.
*/

DEBUG = true;	// set to true for console.log output

var RYU = RYU || {};

RYU = function() {
	// Default Values //
	var _lc = function(string) {string.toString();return string;};	// RYU._lc() like php echo
	var pagecount = 2; 		var current = 0;			var version = "1.0";
	var folio = [];			var page = [];				
	var header = [];		var back = [];				var next = [];
	var live = [];			var livescroll = [];
	var tocscroll = null;	var bmarkscroll = null;		var optscroll = null;
	var aboutscroll = null;	var sheetscroll = null;		var scrollHolder;
	var column = [];		var footer = [];			var marginL = [];
	var marginR = [];		var bmarkData = [];			var pagetimer = [];
	var config = undefined; var autoflip = 0;			var nav = 0;		
	altview = 0;			var view = "ryuzine";		var clickthumb = [];
	var p_toggle = 0;		var W = null;				var H = null;
	var inputMethod = "mousedown";						var pagecurves = 0;	
	var zoomed = 0;				
	var bookmarks = 0;			var bookmarkList = [];
	var mark = null;		var mystyles = "";			var defaultTheme = "";	
	var adjW, stpW;			var slidePg = 0;
	var pageStop = [];		var viewani = 0;			var p=0;
	var x=1;				var z=0;					var events=0;
	var prevW=0;			var prevH=0;				var aCheck=null;
	var ctog = 1;			var adbox = 0;				var showad = '';
	var hidecontrols = null;var slidecontrols = null;	var upboxtimer = null;
	var paneltimer = null;	var splashoff = null; 		var splashout = null;
	var shadow = [];		var splashload = null;		var handle = null;
	var adtrigger = null;
	// App Objects //
	var bod = {};			var sh = {};				var up_box = {};
	var font_opt = {};		var color_opt = {}; 		var toc_slide = {};
	var toc_list = {};		var opt_slide={};			var opt_list = {};
	var toc_button = {};	var bmark_slide = {};		var bmark_text = {};
	var help_button = {};	var view_opt = {};			var controls = {};
	var slide_box = {};		var light_box = {};			var lightshade = {};
	var sH = {};			var hH = {};				var hM = {};
	var fH = {};			var fM = {};				var tM = {};
	var nH = {};			var cH = {};				var bm = {};
	var hide_dialogs = [];
// If no debug console write to dummy function
if (!window.console) window.console = {};
if (!window.console.log || DEBUG == false) window.console.log = function () { };
// IE Complains if these are not defined outside of a function
	var cssTransitionsSupported = false;
	var cssTransform=getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
	var cssTransitionDelay=getsupportedprop(['transitionDelay', 'MozTransitionDelay', 'WebkitTransitionDelay', 
	'msTransitionDelay','OTransitionDelay']);
	var cssTransitionDuration=getsupportedprop(['transitionDuration','MozTransitionDuration','WebkitTransitionDuration','msTransitionDuration','OTransitionDuration']);
	var css3borderRadius=getsupportedprop(['borderRadius','MozBorderRadius','WebkitBorderRadius']);
	var css3dCapable = getsupportedprop(['perspective','MozPerspective','WebkitPerspective','msPerspective','OPerspective']);
	var nativeScroll = getsupportedprop(['overflowScrolling','WebkitOverflowScrolling']);
	var cssBackgroundSize = getsupportedprop(['backgroundSize','WebkitBackgroundSize','MozBackgroundSize','msBackgroundSize','OBackgroundSize']);	
	// Note: "device" was moved to sniffer.js//
	// check if browser is accepting cookies //
	storeMasterCookie();
	storeIntelligentCookie('test','cookie value');
//	SERVER VARIABLES //	
	if (typeof RYU.php != "undefined") {
		var php = RYU.php;
	}
	if (php != undefined) {
		var baseurl = php.baseurl;
	} else {
		var baseurl = "";
	}
// GET CONFIG FILE VARIABLES //
	if (typeof RYU.config != "undefined") {
		// Import config variables if they exist or use default values
		var binding = RYU.config.binding || "left";
		var pgsize  = RYU.config.pgsize  || 0;
		RYU.config.zoompan = RYU.config.zoompan || 0;
		var maxzoom = RYU.config.maxzoom || 5.0;
		RYU.config.pgslider = RYU.config.pgslider || 0;
		var viewani = RYU.config.viewani || 1;
		var splashad = RYU.config.splashad || 0;
		var box_ad = RYU.config.boxad || 0;
		RYU.config.iscroll_iscroll = 0;
		var AddOns = RYU.config.AddOns || [];
	// Set-Up Guided Help
	var helpcards = 14;
	var card = []
	for (var c=0; c < helpcards+1; c++) {
		card[c] = [];
	}
		card[0][0] = "RYUZINE HELP<br />Step through cards with bottom buttons or click Play All.";
		card[0][1] = "RYU.helpPlay(0);"
		card[0][2] = "RYU.guidedHelp(1);RYU.flipTo(1);";
		
		card[1][0] = "Swipe left/right to flip pages on touch-enabled devices.";
		card[1][1] = "RYU.guidedHelp(0);RYU.flipTo(0);";
		card[1][2] = "RYU.guidedHelp(2);";
		
		card[2][0] = "Tap outer margins to flip pages back and forth.  Desktops can also use arrow keys.";
		card[2][1] = "RYU.guidedHelp(1);";
		card[2][2] = "RYU.guidedHelp(3);";
		
		card[3][0] = "Phones in portrait mode can use navigation bar buttons.";
		card[3][1] = "RYU.guidedHelp(2);";
		card[3][2] = "RYU.guidedHelp(4);RYU.controlsToggle(0);RYU.togglePanel('toc_panel');";
		
		card[4][0] = "Quickly flip to any page from any page.";
		card[4][1] = "RYU.guidedHelp(3);RYU.togglePanel('toc_panel');";
		card[4][2] = "RYU.guidedHelp(5);RYU.togglePanel('font_panel');";
		
		card[5][0] = "Font size can be adjusted up/down to your preference";
		card[5][1] = "RYU.guidedHelp(3);";
		card[5][2] = "RYU.guidedHelp(6);RYU.colorText();setTimeout('RYU.colorText(1)',1000);setTimeout('RYU.colorText(2)',3000);setTimeout('RYU.colorText(0)',5000);";
		
		card[6][0] = "Page color scheme can be changed for easier reading.";
		card[6][1] = "RYU.guidedHelp(5);RYU.colorText();";
		card[6][2] = "RYU.guidedHelp(7);RYU.togglePanel('views_panel');RYU.colorText(0);";
		
		card[7][0] = "Alternative Views change how pages are displayed.";
		card[7][1] = "RYU.guidedHelp(6);RYU.togglePanel('font_panel');RYU.colorText();";
		card[7][2] = "RYU.guidedHelp(8);RYU.togglePanel('opt_panel');";
		
		card[8][0] = "Options Panel offers additional user preferences (stored in cookie file).";
		card[8][1] = "RYU.guidedHelp(7);RYU.togglePanel('views_panel');";
		card[8][2] = "RYU.guidedHelp(9);RYU.togglePanel('share_panel');";
		
		card[9][0] = "Share panel allows sharing via e-mail or social networks (depending on widget).";
		card[9][1] = "RYU.guidedHelp(8);RYU.togglePanel('opt_panel');";
		card[9][2] = "RYU.guidedHelp(10);RYU.togglePanel('share_panel');";

		card[10][0] = "Hide the User Interface for an unobstructed view.";
		card[10][1] = "RYU.guidedHelp(9);RYU.togglePanel('share_panel');";
		card[10][2] = "RYU.guidedHelp(11);RYU.controlsToggle(1);";
		
		card[11][0] = "Press upper corner or CTRL+Insert to open the In-App Bookmarks Panel";
		card[11][1] = "RYU.guidedHelp(10);RYU.controlsToggle(1);RYU.togglePanel(3);";
		card[11][2] = "RYU.guidedHelp(12);RYU.togglePanel('bmark_panel');";
		
		card[12][0] = "Add or Delete bookmarks for this issue (stored in browser cookie).";
		card[12][1] = "RYU.guidedHelp(11);RYU.togglePanel('bmark_panel');";
		card[12][2] = "RYU.guidedHelp(13);RYU.togglePanel('bmark_panel');";
		
		card[13][0] = "Zoom &#38; Pan button toggles zooming and dragging while zoomed (only on touch devices).";
		card[13][1] = "RYU.guidedHelp(12);RYU.togglePanel('bmark_panel');";
		card[13][2] = "RYU.guidedHelp(14);RYU.controlSlide(1,1,0);";
		
		card[14][0] = "Some Ryuzine features are not available on all platforms or in all browsers.";
		card[14][1] = "RYU.guidedHelp(13);";
		card[14][2] = "RYU.helpPlay(0);RYU.flipTo(0);";
		RYU.config.card = card;
		var swapThemes = RYU.config.swapThemes || 0;
		RYU.config.pageshadows;
			var deskTheme = RYU.config.deskTheme || "";
			var winTheme  = RYU.config.winTheme  || "";
			var macTheme  = RYU.config.macTheme  || "";
			var nixTheme  = RYU.config.nixTheme  || "";
			var iOSTheme  = RYU.config.iOSTheme  || "";
			var andTheme  = RYU.config.andTheme  || "";
			var bbtTheme  = RYU.config.bbtTheme  || "";
			var wp7Theme  = RYU.config.wp7Theme  || "";
			var wp8Theme  = RYU.config.wp8Theme  || "";
			var bmarkData = RYU.config.bmarkData || [['Ryuzine User Forums','http://www.ryumaru.com/forum/'],['Ryu Maru Website','http://www.ryumaru.com']];;
					
	} else {
		alert(RYU._lc('App Error: Loading configuration variables failed.'));
	}

// See if document is being loaded into editor //
if (top === self) { 
	// not in a frame 
	var simulated = false;
} else {
	if (window.name=="preview" && RYU.device.Platform=="Firefox") {
		var simulated = true;
	} else {
		var simulated = false;
	}
}
	// Get Cookie Values //

	if (!Get_Cookie("pgslider")) {
		// use config file setting
	} else {
		RYU.config.pgslider=Get_Cookie("pgslider");
	}
		// over-ride for Windows Phone
		if (RYU.device.OS == "Windows Phone 7") { RYU.config.pgslider = 0; }

	if (!Get_Cookie("autohide")) {
		RYU.config.autohide = 0;
	} else {
		RYU.config.autohide=Get_Cookie("autohide");
	}
	
	if (!Get_Cookie("pageshadows")) {
		RYU.config.pageshadows = 1;
	} else {
		RYU.config.pageshadows=Get_Cookie("pageshadows");
	}
		// Browser Bug: over-ride for Android devices because shadows trigger rendering problems!
		if (RYU.device.OS=="Android") {
				RYU.config.pageshadows = 0;
		}
		
	if (!Get_Cookie("animate")) {
		RYU.config.animate = 1;
	} else {
		RYU.config.animate = Get_Cookie("animate");
	}
		// Old Safari and Opera cannot handle animations but thinks it can //
		if ( ((RYU.device.Platform == "Safari" || RYU.device.OS == "iOS") && RYU.device.v < 4) || (RYU.device.Platform == "Opera" && RYU.device.bv < 15) ) {
			RYU.config.animate=0;
		}	
		
	if (!Get_Cookie("nscroll")) {
		if ( (RYU.device.OS=="iOS" && nativeScroll != undefined) || (RYU.device.OS=="Android" && RYU.device.v >= 3) ) {
			RYU.config.nscroll = 1;	// favor native scrolling
		} else {
			RYU.config.nscroll = 0;
		}	
	} else {
		RYU.config.nscroll=Get_Cookie("nscroll");
	}

	if (!Get_Cookie("zoompan")) {
		// Use config file settings
	} else {
		RYU.config.zoompan=Get_Cookie("zoompan");
		if (RYU.config.zoompan == 0) {
			RYU.config.nscroll = 0;
		}
	}
		// over-ride for Android or some touch targets won't fire
		if (RYU.device.OS=="Android") {
			RYU.config.zoompan = 1;
		}

	if (!Get_Cookie("css3d")) {
		RYU.config.css3d = 0;
	} else {
		RYU.config.css3d=Get_Cookie("css3d");
	}
		// Over-ride for older Android Devices
		if (RYU.device.OS=="Android" && RYU.device.v < 3) {
				RYU.config.css3d = 0;
				css3dCapable = null;
				cssTransform = undefined;
		}
		if (!Get_Cookie("nags")) {
			RYU.config.nags = 0;
		} else { 
			RYU.config.nags = Get_Cookie("nags")*1; 
		}
		if (!Get_Cookie("hide_dialogs")) {
			// Empty Array 
		} else { 
			hide_dialogs = [Get_Cookie("hide_dialogs")]; 
		}

	var viewstyle = "ryuzine_"+binding+"bound";
	
	if (pgsize == 2) {
		var fillstyle = "_fill";
	} else if ( pgsize == 1 ) {
		var fillstyle = "_tall";
	} else{
		var fillstyle = "";
	}	
	viewstyle = viewstyle + fillstyle;
//********** ADDONS FUNCTIONS **************//
var addon = {};
addon.register = function(obj) {
	// Error catch a missing name
	if (!obj.name) {
		console.log('ADDON.REGISTER: .name object is missing!  No idea what addon this is, bailing and loading next one...');
		loadAddOns(addon_loaded+1);
		return;
	}
	if (obj.name=='register') {
		console.log('ADDON.REGISTER ERROR: "register" is a reserved addon object.  No Add-On can use that name.');
		return;
	}
	// addon[key] should exist, assume it doesn't and check anyway
	var exists = 0;
	for (var a=0; a < Object.keys(addon).length; a++) {
		if (Object.keys(addon)[a]==obj.name) { 
			console.log('ADDON.REGISTER: addon key exists!');
			exists = 1;}
	}
	if (exists==0) {
		console.log('ADDON.REGISTER: addon key does NOT exist, making it now...');
		addon[''+obj.name+''] = {};	// add empty object
	}
	// now get the index of the addon from main config
	var index = 0;
	for (var a=0; a < AddOns.length; a++) {
		if (obj.name == AddOns[a]) { obj.index = a; index = a; }
	}
	console.log('ADDON.REGISTER: addon.index = '+obj.index);
	// copy all passed object keys to addon object
	for (var k=0; k < Object.keys(obj).length; k++) {	// get all keys to that object and key values
		addon[''+obj.name+''][''+Object.keys(obj)[k]+'']=obj[''+Object.keys(obj)[k]+''];
		console.log('ADDON.REGISTER: object '+k+': '+addon[''+obj.name+''][''+Object.keys(obj)[k]+'']);
	}
	// switch from passed object to addon object
	obj = addon[''+obj.name+''];
	console.log('ADDON.REGISTER: obj = '+obj);
	// passed object is gone, now working with actual addon object
	if (!obj.info) {
		 obj.info = {
			name 	: ""+obj.name+"",
			version	: "0",
			author	: "Unknown",
			url		: "",
			license	: "Unknown",
			about	: "There is no description for this add-on."
		}
	};
		if (obj.requires) {
			for (var r=0; r < obj.requires.length; r++) {
				var check = obj.requires[r].split('?');
				var found = 0;
				// check if requires current webapp
				if ( (check[0]=='ryuzinereader' && document.getElementById('ryuzinereader')) || 
					 (check[0]=='ryuzinerack'	&& document.getElementById('ryuzinerack'))	 ||
				     (check[0]=='ryuzinerack' 	&& document.getElementById('ryuzinerack')) 	 || 
				     (check[0]=='ryuzinewriter' && document.getElementById('ryuzinewriter')) ) {
					found = 1;
					if (check[1]!=null && parseFloat(version) < parseFloat(check[1])) {
						found = 0;
					}
				// check if excludes current webapp
				} else if ( (check[0]=='!ryuzinereader' && document.getElementById('ryuzinereader')) ||
							(check[0]=='!ryuzinepress'	&& document.getElementById('ryuzinepress'))	 ||
							(check[0]=='!ryuzinerack'	&& document.getElementById('ryuzinerack')  ) ||
							(check[0]=='!ryuzinewriter' && document.getElementById('ryuzinewriter')) ) {
					found = 2;
				// check if conflicts with another add-on
				} else if ( check[0].match(/!/gi) ) {
					found = 1;	// assume this add-on can load
					check[0] = check[0].split('!')[1];
					for (var k=0; k < Object.keys(addon).length; k++) {
						if (check[0]==Object.keys(addon)[k].toString()) {
							found = 3;		// conflicting add-on found!
							if (check[1]!=null && parseFloat(addon[''+Object.keys(addon)[k]+''].info.version) < parseFloat(check[1])) {
								found = 1;	// specific version NOT found, good to load
							}
						}
					}
				} else {
					for (var k=0; k < Object.keys(addon).length; k++) {
						if (check[0]==Object.keys(addon)[k].toString()) {
							found = 1;
							if (check[1]!=null && parseFloat(addon[''+Object.keys(addon)[k]+''].info.version) < parseFloat(check[1])) {
								found = 0;
							}
						}
					}
				}
				if (found!=1) {
					if (found == 0) {
						console.log('*** ADDON.REQUIRES ERROR: Add-on "'+obj.name+'" depends on Add-On "'+obj.requires[r]+'", which could not be found.  Check main config file, adjust load order if necessary, verify compatible version is loading.');
					}
					if (found == 2) {
						console.log('*** ADDON.REQUIRES: Add-on "'+obj.name+'" does not support this Ryuzine web-app');
					}
					if (found == 3) {
						console.log('*** ADDON.REQUIRES ERROR: Add-on "'+check[0]+'", which has already loaded, conflicts with Add-On "'+obj.name+'"');
					}
					for (var k=Object.keys(obj).length-1; k > -1; k--) {
						if (Object.keys(obj)[k] == 'name' || Object.keys(obj)[k] == 'index' || Object.keys(obj)[k] == 'info' || Object.keys(obj)[k] == 'requires') {
						} else {
							delete obj[''+Object.keys(obj)[k]+''];
						}
					}
					obj.disabled = 1;
				}
			}
		};
		if (obj.inject) {	// we have injection
			if (obj.inject.js && Array.isArray(obj.inject.js)) {	// we have script(s) to inject
				for (var j=obj.inject.js.length-1; j >= 0; j--) {
					if (Array.isArray(obj.inject.js[j]) && obj.inject.js[j].length > 0) {
						if (obj.inject.js[j][1]==null) {
							obj.inject.js[j][1] = 0;
						} else if (obj.inject.js[j][1]==3 || obj.inject.js[j][1]==4) {
							if (obj.inject.js[j][3] != null && obj.inject.js[j][3] != '') {
								var check = obj.inject.js[j][3].split('?');
								var found = 0;	// assume dependency is not met
								for (var r=0; r < document.getElementsByTagName('script').length; r++) {	
									var src = document.getElementsByTagName('script')[r].src.split('/');
										src = src[src.length-1].split('?');
									if (check[0]==src[0]) { 
										found = 1;
										if (check[1]!=null && parseFloat(src[1]) < parseFloat(check[1])) {
											found = 0;
										}
									}
								}
								if (found==0) {
									console.log('ADDON.REGISTER ERROR: Add-On "'+obj.name+'" has a script with an unmet dependency for "'+obj.inject.js[j][3]+'", check load order in main config file and/or add-on script version.');
								}
							} else {
								console.log('ADDON.REGISTER ERROR: Add-On "'+obj.name+'" has a script with an undefined dependency');
							}
						}
					} else { 
						// not correct format, remove it from inject.js
						obj.inject.js.splice(j,1);
					}
				}
			}
			if (obj.inject.css && Array.isArray(obj.inject.css)) {
				for (var c=obj.inject.css-1; c >=0; c--) {
					if (Array.isArray(obj.inject.css[c]) && obj.inject.css[c].length > 0) {
						if (obj.inject.css[c][3] == null) {
							obj.inject.css[c][3] = 0;
						} else if (obj.inject.css[c][3] != null && obj.inject.css[c][3] != '') {
							var check = obj.inject.css[c][3].split('?');
							var found = 0;	// assume dependency is not met
							for (var r=0; r < document.getElementsByTagName('link').length; r++) {
								var src = document.getElementsByTagName('link')[r].href.split('/');
									src = src[src.length-1].split('?');
								if (check[0]==src[0]) { 
									found = 1;
									if (check[1]!=null && parseFloat(src[1]) < parseFloat(check[1])) {
										found = 0;
									}
								}
							}
							if (found==0) {
								console.log('ADDON.REGISTER ERROR: Add-On "'+obj.name+'" has a stylesheet with an unmet dependency for "'+obj.inject.css[c][3]+'", check load order in main config file and/or add-on stylesheet version.');
							}
						} else {
							console.log('ADDON.REGISTER ERROR: Add-On "'+obj.name+'" has a script with an undefined dependency');
						}
					} else {
						// not correct format, remove from inject.css
						obj.inject.css.splice(c,1);
					}
				}				
			}
			addonInjector(obj);
		}
		if (obj.ui) {
			if (obj.ui.panels) {
				for (var p=0; p < obj.ui.panels.length; p++) {
					addPanel(
						obj.ui.panels[p][0],
						obj.name+'_'+obj.ui.panels[p][1],
						obj.ui.panels[p][2],
						obj.ui.panels[p][3],
						obj.ui.panels[p][4]
					);
				}
			}
			if (obj.ui.dialogs) {
				for (var d=0; d < obj.ui.dialogs.length; d++) {
					addDialogBox(
						obj.name+'_'+obj.ui.dialogs[d][0],
						obj.ui.dialogs[d][1],
						obj.ui.dialogs[d][2],
						obj.ui.dialogs[d][3],
						obj.ui.dialogs[d][4],
						obj.ui.dialogs[d][5],
						obj.ui.dialogs[d][6]
					);	
				}
			}
			if (obj.ui.controls) {
				for (var t=0; t < obj.ui.controls.length; t++) {
					console.log('ADDON.REGISTER control #'+t);
					addControl(
						obj.ui.controls[t][0],
						obj.name+'_'+obj.ui.controls[t][1],
						obj.ui.controls[t][2],
						obj.ui.controls[t][3],
						obj.ui.controls[t][4],
						obj.ui.controls[t][5],
						obj.ui.controls[t][6],
						obj.ui.controls[t][7]
					);
				}
								
			}
		}
		if (obj.actions && typeof obj.actions == 'function') {
				obj.actions();
		}		
	loadAddOns(index+1);
}
var addon_optData = [];	
var iscrollers = [];
var optEvent = {};
var regback = addon.register;	// back-up register function
var addon_loaded = null;
var addon_timer;
function loadAddOns(a) {
	console.log('LOAD ADDONS: clearing timer from previous addon...');
	clearTimeout(addon_timer);
	if (addon.register != regback) { addon.register = regback;};	// if someone overwrote register, restore it
	if (a==null) { a = 0; };
	if (a < AddOns.length) {
		if (!document.getElementById('AddOn_'+AddOns[a])) {	// script is not loaded yet
			addon_loaded = a;					// used for check in register
			if (AddOns[a]=='register'){ console.log('LOAD ADDONS: "register" is a reserved addon object.');
			}else{
			addon[''+AddOns[a]+''] = {};		// empty addon object to be filled
			addon[''+AddOns[a]+''].index = a;	// pass config index into it
			console.log('LOAD ADDONS: loading AddOn '+AddOns[a]);
			var inject = document.createElement('script');
				inject.setAttribute('id','AddOn_'+AddOns[a]);
				inject.src = RYU.baseurl+'ryuzine/addons/'+AddOns[a]+'/'+AddOns[a]+'.config.js';
			document.getElementsByTagName('head')[0].appendChild(inject);
			};
			addon_timer=setTimeout(function(){
				console.log('LOAD ADDONS: checking if script loaded...');
				if(addon[''+AddOns[a]+''].name != AddOns[a]){
					console.log('LOAD ADDONS: '+AddOns[a]+' did not load, loading next addon');
					loadAddOns(a+1);
				}
			},1000);	// if addon[key].name does not exist after 1 sec, assume script did not load	
		}
	}
}
// injector stand-in (needs replacing for indexing)
function addonInjector(obj) {
	var head  = document.getElementsByTagName('head')[0];
	var links = head.getElementsByTagName('link');
	var headcss = [];
	for (var c=0; c < links.length; c++) {
		if (links[c].getAttribute('rel')=='stylesheet') {
			headcss.push(links[c]);
		}
	}
	if (obj.inject.js && obj.inject.js.length > 0) {
		for (var j=0; j < obj.inject.js.length; j++) {
			var js = document.createElement('script');
				js.src = RYU.baseurl+'ryuzine/addons/'+obj.name+'/'+obj.inject.js[j][0];
			if (obj.inject.js[j][2]!=null) {
				js.id = obj.inject.js[j][2];
			}
			if (obj.inject.js[j][1]==1) {
				head.insertBefore(js,headcss[0]);
			} else {
				head.appendChild(js);
			}
		}
	}
	if (obj.inject.css && obj.inject.css.length > 0) {
		for (var c=0; c < obj.inject.css.length; c++) {
			var css = document.createElement('link');
				css.setAttribute('rel','stylesheet');
				css.setAttribute('type','text/css');
				css.href = RYU.baseurl+'ryuzine/addons/'+obj.name+'/'+obj.inject.css[c][0];
			if (obj.inject.css[c][2]!=null) {
				css.id = obj.inject.css[c][2];
			}
			if (obj.inject.css[c][1]==1) {
				head.insertBefore(css,headcss[0]);
			} else {
				head.appendChild(css);
			}
		}
	}
}
var addPanel = function(type,id,label,location) {
	if (location==''||location==undefined) {
		location = 'left';
	}
	var panel = document.createElement('div');
		panel.id = id+'_panel';
		if (type==''||type==undefined) { type = 'a';}
		panel.className = 'panel '+type+' '+location+' out';
	var panelbar = document.createElement('div');
		panelbar.className="titlebar";
		paneltitle = document.createElement('h1');
		paneltitle.className="title l10n";
		paneltitle.innerHTML = label || 'Custom Panel';
		panelclose = document.createElement('div');
		panelclose.id=id+'_done';
		panelclose.className='button type2 right done';
		panelclose.innerHTML='<p><span class="symbol"></span><span class="label l10n">'+RYU._lc('Done')+'</span></p>';
		panelclose.addEventListener(iDown,function(){RYU.togglePanel(''+id+'_panel');},false);
	panelbar.appendChild(paneltitle);
	panelbar.appendChild(panelclose);
	panel.appendChild(panelbar);
	var panelarea = document.createElement('div');
		panelarea.className = 'area';
		panelarea.innerHTML = '<div class="scrollbox"></div>';
	panel.appendChild(panelarea);
	document.getElementById('upbox').appendChild(panel);
	console.log('ADD PANEL: '+id+'_panel has been created');
}
var firstclass = 0;
// UI Control Factory
var addControl = function(type,id,label,action,state,cookie,location,name,classes,section) {
	// Rectify empty location to default (Options Panel)
	if (location=='' || location==undefined) { 
		location = 'opt_panel'; 
		insert = 1;
	} else { insert = 0; }
	// filter out invalid start screen controls
	if (location=='start' && (type != 'button3' || type != 'button4')) {
		type = 'button3';
	}
	console.log('ADD CONTROL: location = '+location);
	if (document.getElementById(''+location+'').getElementsByClassName('area')[0].getElementsByClassName('scrollbox').length > 0) { // iScroll container		
		panel = document.getElementById(''+location+'').getElementsByClassName('area')[0].getElementsByClassName('scrollbox')[0];
	} else {
		panel = document.getElementById(''+location+'').getElementsByClassName('area')[0];
	}
	if (section != null) {
		panel = document.getElementById(''+section+'');
		insert = 0;
	}
	var n = addon_optData.length;
	var droplist = [];
	addon_optData[n] = [];
	addon_optData[n][0] = type;
	addon_optData[n][1] = id;
	addon_optData[n][2] = label;
	if (action==null) {
			addon_optData[n][3] = function(){};	// dummy function
	}else{	addon_optData[n][3] = action;}
	if (Array.isArray(state)) {
		console.log('ADD CONTROL: State is array, moving to droplist.  state = 0');
		droplist = state;
		state = 0;
	}
	if (cookie == 1) {	// look for a cookie then
		if (!Get_Cookie(''+id+'')) {
			if (RYU.config[''+id+'']) {
				console.log('ADD CONTROL: RYU.config['+id+'] exists, state = '+RYU.config[''+id+'']);
				state = RYU.config[''+id+''];
			} else {
				if (state == null) { state = 1; } // assume we want it ON if we loaded the add-on
			}
			console.log('ADD CONTROL: No Cookie Found, setting state = '+state);
		} else {
			state = Get_Cookie(''+id+'');
			console.log('ADD CONTROL: Cookie found, setting state = '+state);
		}
	} else { 
		cookie = 0;
	}
	if (state == null) { state = 1; } 	// assume we want it enabled;
	addon_optData[n][4] = state;
	addon_optData[n][5] = cookie;
	addon_optData[n][6] = location;
	
	function getListElement() {
			if (insert==1 && firstclass==0) {
				if (!document.getElementById('party3opts')) {
					var list_element = document.createElement('ul');
						list_element.id ='party3opts';
						list_element.className='opts';
				} else {
					var list_element = document.getElementById('party3opts');
				}
			} else if (insert==1 && firstclass==1) {
				var list_element = document.getElementById('opts');
			} else {
				if (!document.getElementById(location+'_optlist')) {
					var list_element = document.createElement('ul');
						list_element.id = location+'_optlist';
						list_element.className = 'opts';	
				} else {
					var list_element = document.getElementById(location+'_optlist');
				}
			}
		return list_element;
	}
	// BUTTONS
	switch(type) {
		case 'button1':
		case 'button2':
		case 'button3':
		case 'button4':
			switch(type) {
				case 'button4' :
					var t='type4';
				break;
				case 'button3' :
					var t='type3';
				break;
				case 'button2' :
					var t='type2';
				break;
				default:	// button1
					var t='type1';
			}
			var btn = document.createElement('div');
				btn.id = id;
				btn.className = 'button '+t+'';
				btn.innerHTML = '<p><span class="symbol"></span><span class="label l10n">'+RYU._lc(label)+'</span></p>';
				btn.addEventListener(eDown,optEvent[''+id+'']=action,false);	
			if (type=='button1'||type=='button2') {	// use button bar
				var aoid = id.split('_')[0];
				if (!document.getElementById(''+aoid+'_buttonbox')) {
					var bar = document.createElement('div');
					bar.id = aoid+'_buttonbox';
					bar.className = 'buttonbox';
				} else {
					var bar = document.getElementById(''+aoid+'_buttonbox');
				}
				btn.className = btn.className+' left';
				bar.appendChild(btn);
				el = bar;
			} else {
				el = btn;
			}
		break;
		case 'text':
			var txt = document.createElement('p');
				txt.id = id;
				if (classes!=null) {
				txt.className = 'smallprint '+classes;
				}else{
				txt.className = 'smallprint';
				}
				if (action!=null) {
				txt.addEventListener(eDown,optEvent[''+id+'']=action,false);
				}
				txt.innerHTML = label;
				el = txt;
		break;
		case 'select':
		case 'drop':
		case 'list':
		case 'multi':
			var ul = getListElement();
			var li = document.createElement('li');
				li.id = id+'_li';
				li.className = 'opt-li';
			var item = document.createElement('span');
				item.className="optitem l10n";
				item.innerHTML = RYU._lc(label);
				li.appendChild(item);
			var val = document.createElement('p');	// used by drop
			var drop = document.createElement('select');
				drop.id = id;
				drop.addEventListener('change',action,false);
			if (type=='list'||type=='multi') {
				drop.addEventListener('mousedown',function(){event.stopPropagation();},false);
				drop.addEventListener('touchstart',function(){event.stopPropagation();},false);
				drop.className='listbox';
				drop.size = '2';};
			if (type=='multi') {drop.setAttribute('multiple',true);}
			var val_text  = droplist[0][1];
			var sel_state = droplist[0][0];
			for (var i=0; i < droplist.length; i++) {
				var opt = document.createElement('option');
					opt.value = droplist[i][0];
					opt.innerHTML = droplist[i][1];
					if (droplist[i][2]!=null && state==0) {
						opt.setAttribute('selected','true');
						val_text  = droplist[i][1];
						sel_state = droplist[i][0];
					}
					drop.appendChild(opt);
			}
			console.log('sel_state = '+sel_state);
			if (state == 0) { state = sel_state;}
			console.log('state = '+state);
			if (type=='drop') {
			var sw = document.createElement('div');
				sw.className="opt-switch opt-drop opt-off";
				drop.addEventListener('change',function(x){return function(){RYU.setOptGhostList(''+x+'');};}(id),false);
				drop.addEventListener('mousedown',function(){event.stopPropagation()},false);
				drop.addEventListener('touchstart',function(){event.stopPropagation()},false);		
				sw.appendChild(drop);
				val.innerHTML = val_text;
				sw.appendChild(val);
				li.appendChild(sw);
			} else {
				li.appendChild(drop);
			}
			
				ul.appendChild(li);
				el = ul;	
		break;	
		case 'checkbox':
			var ul = getListElement();
			var li = document.createElement('li');
				li.id = id+'_li';
				li.className = 'opt-li';
			var item = document.createElement('span');
				item.className = 'optitem l10n';
				item.innerHTML = RYU._lc(label);
				li.appendChild(item);
			var checkbox = document.createElement('input');
				checkbox.className = 'opt-switch opt-check opt-off';
				checkbox.type = 'checkbox';
				if (name!=null) {checkbox.name = name;}
				if (!Array.isArray(state)) {
					if (state=='1') { state = [1,1];
					}else{ state = [0,0];}
				}
				checkbox.value = state[0];
				if (state[1]==1) { checkbox.checked = true; }				
				li.appendChild(checkbox);
				ul.appendChild(li);
				el = ul;
		break;
		case 'radio':
			var ul = getListElement();
			var li = document.createElement('li');
				li.id = id+'_li';
				li.className = 'opt-li';
			var item = document.createElement('span');
				item.className = 'optitem l10n';
				item.innerHTML = RYU._lc(label);
				li.appendChild(item);
			var radio = document.createElement('input');
				radio.className = 'opt-switch opt-radio opt-off';
				radio.type = 'radio';
				if (name!=null) { radio.name = name; }
				if (state=='1') { radio.checked = true; }
				li.appendChild(radio);
				ul.appendChild(li);
				el = ul;
		break;
		case 'toggle':
			// add data to array //
			var ul = getListElement();
			var li = document.createElement('li');
				li.id = 'opt_'+id+'_li';
				li.className = 'opt-li';
			var span = document.createElement('span');
				span.id = 'opt_'+id+'_label';
				span.className = 'optitem l10n';
				span.innerHTML = RYU._lc(label);
			if (state==1) { var opt_state='opt-on';}else{var opt_state='opt-off';}
			var div = document.createElement('div');
				div.id='opt_'+id;
				div.className = 'opt-switch '+opt_state;
				div.innerHTML = '<span class="symbol"></span><span class="label"></span>';
				div.addEventListener(eDown,optEvent[''+id+''] = function(x){return function(){RYU.toggleOptSwitch(''+x+'');}}(id));
				li.appendChild(span);li.appendChild(div);
				ul.appendChild(li);
			el = ul;
		break;
		default:
			// do nothing
	}
	if (cookie == 1) {	// set cookie in front of cookie monster
		console.log('Set_Cookie('+id+','+state+')');
		Set_Cookie(''+addon_optData[n][1]+'',''+state+'');
	}
		RYU.config[''+id+''] = state;			// create config setting
	if (insert==1 && firstclass==0) {	// check if default location has header
		if (!document.getElementById('addonheader')) {
		var head = document.createElement('h2');
			head.id='addonheader';
			head.className = 'smallprint l10n';
			head.innerHTML = RYU._lc('Add-On Settings');	
			panel.appendChild(head);
		};
	}
	// Now insert the element at location:
	panel.appendChild(el);
	for (var i=0; i < iscrollers.length; i++) {
		onRebind(iscrollers[i][1]);
	}
}	

function setOptGhostList(i,_set) {
	if (isNaN(i)) {  // if i is not the index number find by id
		for (var a=0; a < addon_optData.length; a++) {
			if (addon_optData[a][1] == i) {
				i = a;
			}
		}
	}
	var drop = document.getElementById(''+addon_optData[i][1]+'');
	if (_set==1) {	// set the list to a predetermined value
		// look for a cookie
		if (!Get_Cookie(''+addon_optData[i][1]+'')) {	// if no stored value
			if (RYU.config[''+addon_optData[i][1]+'']) {	// see if config object exists
				drop.value = RYU.config[''+addon_optData[i][1]+''];	// if it does, use its value
			}
		} else {
			drop.value = Get_Cookie(''+addon_optData[i][1]+'');	// set list to stored value
			RYU.config[''+addon_optData[i][1]+''] = Get_Cookie(''+addon_optData[i][1]+'');	// pass to config
		}
	} else {	// find selected value and store in config
		RYU.config[''+addon_optData[i][1]+''] = ''+drop.value+'';
	}
	for (var d=0; i < drop.options.length; d++) {
		if (drop.options[d].value === drop.value) {
			drop.selectedIndex = d;
			break;
		}
	}
	drop.parentNode.getElementsByTagName('p')[0].innerHTML=drop.options[drop.selectedIndex].text;
	// if cookies are enabled for this list, store value
	if (addon_optData[i][5]==1) { 
		Set_Cookie(''+addon_optData[i][1]+'',''+drop.value+''); 
	}	
}

function toggleOptSwitch(i,dir) {
	var poop = i;
	if (isNaN(i)) {  // if i is not the index number find by id
		for (var a=0; a < addon_optData.length; a++) {
			if (addon_optData[a][1] == i) {
				i = a;
			}
		}
	}
	if (dir==null) {
		if (hasClass(document.getElementById('opt_'+addon_optData[i][1]+''),'opt-on') ) {
			dir = '0';
		} else {
			dir = '1';
		}
	}
	if (dir=='0') {
		document.getElementById('opt_'+addon_optData[i][1]+'').className="opt-switch opt-off";
		if (addon_optData[i][5]==1) { Set_Cookie(addon_optData[i][1],'0'); }
		RYU.config[''+addon_optData[i][1]+''] = 0;
		addon_optData[i][4]=0;
	} else {
		document.getElementById('opt_'+addon_optData[i][1]+'').className="opt-switch opt-on";
		if (addon_optData[i][5]==1) { Set_Cookie(addon_optData[i][1],'1'); }
		RYU.config[''+addon_optData[i][1]+''] = 1;
		addon_optData[i][4]=1;
	}
	// Do function if any //
	if (typeof addon_optData[i][3] == 'string') { // it is a string, use evil eval()!
		console.log('TOGGLE: consider wrapping "'+addon_optData[i][3]+'" in an anonymous function rather than sending a string');
		var fn = function() { return eval(addon_optData[i][3]) }();
	} else {
		addon_optData[i][3]();
	}
}

var dialogs = [];
function addDialogBox(id,title,contents,action,persist,hide,classes) {
	var n = dialogs.length;
	dialogs[n] = [];
	dialogs[n][0] = id;
	dialogs[n][1] = title;
	dialogs[n][2] = contents;
	dialogs[n][3] = action;
	dialogs[n][4] = persist;
	dialogs[n][5] = hide;
	dialogs[n][6] = classes;
}

function toggleDialog(id) {
	console.log('toggleDialog('+id+')');
	if (id=='all') {
		var openones = document.getElementsByClassName('ryudialog');
		for (var r=0; r < openones.length; r++) {
			if (hasClass(openones[r],'in')) {
				toggleDialog(''+openones[r].id+'');
			}
		}
		return;
	}
	// find dialog by ID
	var n = null;
	for (var d=0; d < dialogs.length; d++) {
		if (dialogs[d][0] == id) { var n = d; }
	}
	console.log('index of '+id+' = '+n+'');
	if (n==null) { 
		if (id == 'about') { aboutDialog();}	// build about dialog first then trigger this
		return; }	// dialog could not be found, bail	
	var hidden = false;
	for (var h=0; h < hide_dialogs.length; h++) {
		if ( id == hide_dialogs[h]) {
			hidden = true;
		}
	}
	// See if this dialog already exists or not		
	if (!document.getElementById(''+id+'')) {	// we need to make it and open it
		if (RYU.config.rzw_noobnags == '0') {	// if noobnags is OFF see if user hid this dialog 
			if (hidden==true) { return; }	// user hid this
		}
	// Build Shade Box
	if (!document.getElementById('shade_box')) {
		var shade_box = document.createElement('div');
			shade_box.id = "shade_box";
			shade_box.addEventListener(iDown,function(){RYU.toggleDialog(''+id+'');},false);
			document.getElementsByTagName('body')[0].appendChild(shade_box);
	}
	if (dialogs[n][6]!=null) {
		var custom_classes = ' '+dialogs[n][6];
	} else {
		var custom_classes = "";
	}	
	var dialog_box = document.createElement('div');
		dialog_box.id = id;
		dialog_box.className = 'ryudialog'+custom_classes+' in';
	var dialog_title = document.createElement('div');
		dialog_title.className="titlebar";
		var title_h1 = document.createElement('h1');
			title_h1.className="title";
			title_h1.innerHTML = RYU._lc(dialogs[n][1]);
		var xout = document.createElement('div');
			xout.className = 'xdialog button type2 right';
			xout.innerHTML = '<p><span class="symbol"></span><span class="label l10n">'+RYU._lc('Close')+'</span></p>';
			xout.addEventListener(iDown,function(){RYU.toggleDialog(''+id+'');},false);
		dialog_title.appendChild(title_h1);
		dialog_title.appendChild(xout);
	var dialog_textbox = document.createElement('div');
		dialog_textbox.className = 'area';
	var dialog_scrollbox = document.createElement('div');
		dialog_scrollbox.className="scrollbox";
		if (typeof dialogs[n][2] == 'string') {
			dialog_scrollbox.innerHTML=''+unescape(dialogs[n][2])+'';
		}
		dialog_textbox.appendChild(dialog_scrollbox);
		dialog_box.appendChild(dialog_title);
		dialog_box.appendChild(dialog_textbox);
		if (dialogs[n][5]!=null && dialogs[n][5]!='0' && dialogs[n][5]!='') {	// if option to hide, add control
			dialogs[n][3].unshift(['checkbox',id+'_hide','Do not show this again',function(){RYU.hideDialog(this,''+id+'');}]);
		}		
		if (dialogs[n][3]!=null && dialogs[n][3]!='') {
			dialog_textbox.className = 'area action';
			var action = document.createElement('div');
			action.className = 'actionbar';			
			if (Array.isArray(dialogs[n][3])) {
				if ( (dialogs[n][5]!=null && dialogs[n][5]!='0' && dialogs[n][5]!='') && dialogs[n][3].length > 3) {
					dialogs[n][3].length = 3;
					console.log('WARNING: Dialogs with option to hide may only have up to TWO Action Buttons!  Discarding extras...');
				}
				if ( (dialogs[n][5]==null || dialogs[n][5]=='0' || dialogs[n][5]=='') && dialogs[n][3].length > 6) { 
					dialogs[n][3].length = 6;
					console.log('WARNING: Dialogs may only have SIX Action Buttons!  Discarding extras...');
				}
				for (var t=0; t < dialogs[n][3].length; t++) {
					// type,id,label,action,classes
					if (dialogs[n][3][t][0]=='button1' || dialogs[n][3][t][0]=='button2' || dialogs[n][3][t][0]=='checkbox') {	// only type 1 & 2 are valid
						if (dialogs[n][3][t][4]==null) { var align = 'left'} else { 
							if (!dialogs[n][3][t][4].match(/left/gi) && !dialogs[n][3][t][4].match(/right/gi)) {
								dialogs[n][3][t][4] = 'left '+dialogs[n][3][t][4];
							}
							var align = dialogs[n][3][t][4];
						}
						if (dialogs[n][3][t][0]=='button1' || dialogs[n][3][t][0]=='button2') {
							var btn = document.createElement('div');
								btn.id = dialogs[n][3][t][1];
								btn.className = 'button '+align+'';
								btn.innerHTML = '<p><span class="symbol"></span><span class="label l10n">'+RYU._lc(dialogs[n][3][t][2])+'</span></p>';
								btn.addEventListener(eDown,dialogs[n][3][t][3],false);	
							action.appendChild(btn);
						} else {
							var checkblock = document.createElement('div');
								checkblock.className = 'hidebox left';
							var checkbox = document.createElement('input');
								checkbox.id = dialogs[n][3][t][1];;
								checkbox.type = 'checkbox';
								if (hidden==true) { checkbox.setAttribute('checked','true');}
								checkbox.addEventListener(eDown,dialogs[n][3][t][3],false);
							var spanbox = document.createElement('span');
								spanbox.className = 'label l10n';
								spanbox.innerHTML = RYU._lc(dialogs[n][3][t][2]);
							checkblock.appendChild(checkbox);
							checkblock.appendChild(spanbox);
							action.appendChild(checkblock);
						}
					}
				}
			}
			dialog_box.appendChild(action);
		}
		document.getElementsByTagName('body')[0].appendChild(dialog_box);
		if (Array.isArray(dialogs[n][2])) {	// ui builder
			for (var t=0; t < dialogs[n][2].length; t++) {
				addControl(dialogs[n][2][t][0],dialogs[n][2][t][1],dialogs[n][2][t][2],dialogs[n][2][t][3],dialogs[n][2][t][4],dialogs[n][2][t][5],id,dialogs[n][2][t][7],dialogs[n][2][t][8]);
			}
		}
		iScrollApply(''+id+''); 
	} else { // dialog exists
		console.log('dialog '+id+' exists');
		if (hasClass(document.getElementById(''+id+''),'out')) {
			if (RYU.config.rzw_noobnags == '0') {	// if noobnags is OFF see if user hid this dialog 
				if (hidden==true) { return; }	// user hid this dialog
			}
			// Build Shade Box
			if (!document.getElementById('shade_box')) {
				var shade_box = document.createElement('div');
					shade_box.id = "shade_box";
					shade_box.addEventListener(iDown,function(){RYU.toggleDialog(''+id+'');},false);
					document.getElementsByTagName('body')[0].appendChild(shade_box);
			}	
			addClass(document.getElementById(''+id+''),'in');
			removeClass(document.getElementById(''+id+''),'out');
		} else {
			if (dialogs[n][4]=='1') { // persistent dialog, just close it
				addClass(document.getElementById(''+id+''),'out');
				removeClass(document.getElementById(''+id+''),'in');
			} else {	// non-persistent dialog, remove it from DOM
				for (var i=0; i < iscrollers.length; i++) {
					if (iscrollers[i][0] == id && iscrollers[i][1] != null) {
						iscrollers[i][1].destroy();
						iscrollers[i][1] = null;
					}
				}
				document.getElementsByTagName('body')[0].removeChild(document.getElementById(''+id+''));
			}
			// remove shade box
			document.getElementsByTagName('body')[0].removeChild(document.getElementById('shade_box'));
		}	
	}
}
/* Simple toggle for hide/show setting */
function hideDialog(box,n) {
	if (RYU.config.nags == '1') {
		alert(''+RYU._lc('Hiding dialogs is being overidden, go to OPTIONS > SHOW ALL DIALOGS and turn it OFF to allow hiding')+'');
	}
	if (box.checked) {	// is being unchecked
		for (var h=hide_dialogs.length-1; h>-1;h--) {
			if (n==hide_dialogs[h]) {
				hide_dialogs.splice(h,1);	// remove this dialog from hide_dialogs array
			}
		}
	} else {
		var hidden = false;	// assume dialog is not already hidden
		for (var h=0; h < hide_dialogs.length; h++) {
			if (n==hide_dialogs[h]) {
				hidden = true;	// dialog index found in hidden_dialogs array
			}
		}
		if (hidden == false) {	// was not hidden, so now hide it
			hide_dialogs.push(''+n+'');
		}
	}
	Set_Cookie('hide_dialogs',hide_dialogs);
}

//********** Utility Functions *************//
function isEven(value) {
return (value%2 == 0);
}

function getsupportedprop(proparray){
    var root=document.documentElement //reference root element of document
    for (var i=0; i<proparray.length; i++){ //loop through possible properties
        if (typeof root.style[proparray[i]]=="string"){ //if the property value is a string (versus undefined)
            return proparray[i]; //return that string
        }
    }
}

// ClassName Manipulators
function hasClass(el,name) {
   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}
function addClass(el,name) {
   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}
function removeClass(el,name){
   if (hasClass(el,name)) {
      el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
   }
}
// 	******** EVENT PROCESSING ***********//
//	These are exposed as function for add-ons to use //
function iEvent() {
	if ('ontouchstart' in document.documentElement && RYU.device.OS != "webOS" ) {
		var iClick = "touchstart";
		var iDown = "touchstart";
		var iUp = "touchend";
		var iMove = "touchmove";
		var iOver = "touchstart";
		var iOut = "touchend";
	} else {
		var iClick = "click";
		var iDown = "mousedown";
		var iUp = "mouseup";
		var iMove = "mousemove";
		var iOver = "mouseover";
		var iOut = "mouseout";
	}
	if (typeof IScroll != "undefined") {
		var eDown = "tap";
	} else {
		var eDown = iDown;
	}
	return {
		iClick	: iClick,
		iDown 	: iDown,
		iUp		: iUp,
		iMove	: iMove,
		iOver	: iOver,
		iOut	: iOut,
		eDown	: eDown
	
	}
}
// Set Events for Ryuzine
var iClick	= iEvent().iClick;
var iDown 	= iEvent().iDown;
var iUp 	= iEvent().iUp;
var iMove 	= iEvent().iMove;
var iOver 	= iEvent().iOver;
var iOut 	= iEvent().iOut;
var eDown	= iEvent().eDown;

	
// Default Prevention/Restoration //
function defaultPrevention() {
	if (RYU.device.OS == "Android") {
		window.scrollTo(0,0);
	}
	preventDefault();
}

function preventDefault(element) {
	if (element==null) { var element = document };
		element.ontouchstart = function (event) {
    if (!event.elementIsEnabled) {event.preventDefault();}
	}
	element.ontouchmove = function (event) {
    if (!event.elementIsEnabled) {event.preventDefault();}
	}
	element.ontouchend = function (event) {
    if (!event.elementIsEnabled) {event.preventDefault();}
	}
}

function restoreDefault(element) {

	if (element==null) { var element = document };
	element.ontouchstart = function (event) {
    if (!event.elementIsEnabled) {event.elementIsEnabled = true;}
	}
	element.ontouchmove = function (event) {
    if (!event.elementIsEnabled) {event.elementIsEnabled = true;}
	}
	element.ontouchend = function (event) {
    if (!event.elementIsEnabled) {event.elementIsEnabled = true;}
	}
}

function onRebind (scroller) {
	// Here modify the DOM in any way, eg: by adding LIs to the scroller UL
	if (typeof iScroll != "undefined") {
		if (scroller != null) {
			setTimeout(function () {scroller.refresh();}, 0);
			scroller.scrollTo(0,0);
		}
	}
};

function toc_addEventListeners(a) {
	console.log('TOC Self-Nuke Listeners');
	var content = document.getElementById('nav').innerHTML;
	document.getElementById('nav').innerHTML = '';
	document.getElementById('nav').innerHTML = content;
	console.log('TOC Add New Event Listeners');
	var list_item = document.getElementById('nav').getElementsByTagName('li');
		for (var a=0; a < list_item.length; a++) {
		if ('ontouchend' in document.documentElement) { // Prevent misfires on touch devices
				if (typeof IScroll != "undefined") {
				list_item[a].addEventListener('tap',function(x){return function(){preventDefault();RYU.tapCheck(this,2,x);}}(a),false);
				} else {
				list_item[a].addEventListener('touchend',function(x){return function(){RYU.tapCheck(this,2,x);}}(a),false);
				}
		} else {
				if (typeof iScroll == "undefined") {
					list_item[a].addEventListener('mouseup',function(x){return function(){RYU.tapCheck(this,2,x);}}(a),false);
				} else {
					if (RYU.device.Platform == "Firefox" || RYU.device.Platform == "IE") { // Prevent iScroll Hover misfires in Firefox
						list_item[a].addEventListener('click',function(x){this.getElementsByTagName('a')[0].href="#";return false;},false);
					}
					if (typeof IScroll != "undefined") {	// if it is iScroll v5 use tap detect
					list_item[a].addEventListener('tap',function(x){return function(){RYU.swapList(this,2,x);}}(a),false);
					} else {
					list_item[a].addEventListener('mouseup',function(x){return function(){RYU.tapCheck(this,2,x);}}(a),false);
					}
				}
		}
	}
}

// ******** INITIALIZE RYUZINE ***************//
var init_zine = function(pg) {

	// set shorthand references for standard parts
	// (need to do this before options are created)
		body = document.getElementsByTagName('body')[0];
		up_box = document.getElementById('upbox');
		font_opt = document.getElementById('font_panel');
		color_opt = document.getElementById('colorbox');
		opt_slide = document.getElementById('opt_panel');
		opt_list = document.getElementById('optlist');
		toc_slide = document.getElementById('toc_panel');
		toc_list = document.getElementById('toclist');
		bmark_slide = document.getElementById('bmark_panel');
		bmark_list = document.getElementById('bmarklist');
		view_opt = document.getElementById('views_panel');
		controls = document.getElementById('tabbar0');
		slide_box = document.getElementById('slidebox1');
		light_box = document.getElementById('lightbox');
		lightshade = document.getElementById('shade');
		sh = document.getElementById('sheet');
		bm = document.getElementById('bmark');
		am = document.getElementById('addmark');
		back = document.getElementById('back');
		next = document.getElementById('next');

	// Get UI Theme (if any) //
	if (!document.getElementById('ui_theme')) {
		if (swapThemes == 1) {
			themeline = document.getElementsByTagName('head')[0].innerHTML;
			themeline = themeline + '\n<link rel="stylesheet" type="text/css" href="" id="ui_theme" />\n';
			document.getElementsByTagName('head')[0].innerHTML = themeline;
		} else {}
		defaultTheme = ""+RYU.baseurl+"ryuzine/theme/dark/theme.css";
	} else { 
		// knock off any anchor link from URL
		var locale = window.location.href; locale = locale.split('#'); locale = locale[0];
		if (document.getElementById('ui_theme').href == locale) {
			defaultTheme = ""+baseurl+"ryuzine/theme/dark/theme.css";
		} else {
			if (!document.getElementById('ui_theme').href.match(/theme/gi)) {
				defaultTheme = ""+RYU.baseurl+"ryuzine/theme/dark/theme.css";
			} else {
				defaultTheme = document.getElementById('ui_theme').href;
			}
		}
	}
	// Set Theme initial ON/OFF State //
	if (defaultTheme.length == 0 && swapThemes == 0 ) {
		RYU.config.themeset = 0;
	} else {
		if (!Get_Cookie("themeset")) {
		RYU.config.themeset = 1;
		} else {
		RYU.config.themeset=Get_Cookie("themeset");
		}
	}

// build default options
var option = [ [],[],[],[],[],[],[],[],[],[],[],[] ];
option[0][0] = "toggle";
option[0][1] = "pgslider";
option[0][2] = "Pages Slider";
option[0][3] = function(){RYU.sliderToggle();};
option[0][4] = RYU.config.pgslider;

option[1][0] = "toggle";
option[1][1] = "pageshadows";
option[1][2] = "Page Shadows"
option[1][3] = function(){RYU.shadowToggle();};
option[1][4] = RYU.config.pageshadows;

option[2][0] = "toggle";
option[2][1] = "css3d";
option[2][2] = "3D Page Turns";
option[2][3] = function(){RYU.css3dToggle();};
option[2][4] = RYU.config.css3d;

option[3][0] = "toggle";
option[3][1] = "animate";
option[3][2] = "Page Animations";
option[3][3] = function(){RYU.aniToggle();};
option[3][4] = RYU.config.animate;

option[4][0] = "toggle";
option[4][1] = "nscroll";
option[4][2] = "Native Scrolling";
option[4][3] = function(){RYU.scrollToggle();};
option[4][4] = RYU.config.nscroll;

option[5][0] = "toggle";
option[5][1] = "zoompan";
option[5][2] = "Zoom &#38; Pan";
option[5][3] = function(){RYU.zoomToggle();};
option[5][4] = RYU.config.zoompan;

option[6][0] = "toggle";
option[6][1] = "themeset";
option[6][2] = "Theme UI";
option[6][3] = function(){RYU.themeToggle();};
option[6][4] = RYU.config.themeset;

option[7][0] = "toggle";
option[7][1] = "autohide";
option[7][2] = "Auto-hide UI";
option[7][3] = function(){RYU.autohideToggle();};
option[7][4] = RYU.config.autohide;

option[8][0] = "toggle";
option[8][1] = "nags";
option[8][2] = "Show All Dialogs";
option[8][3] = function(){};
option[8][4] = RYU.config.nags;

option[9][0] = "text";
option[9][1] = "optnotice";
option[9][2] = "Disabling features can improve performance.  Older browsers cannot display some options";
option[9][3] = null;
option[9][4] = null;

option[10][0] = "button3";
option[10][1] = "aboutbutton";
option[10][2] = "About Ryuzine";
option[10][3] = function(){RYU.toggleDialog('about');};
option[10][4] = null;

option[11][0] = "button4";
option[11][1] = 'altoptdone';
option[11][2] = 'Close';
option[11][3] = function(){RYU.togglePanel(5);};
option[11][4] = null;

firstclass = 1;
for (var n=0; n < option.length; n++) {
	if (option[n][0]=='toggle') { var cookie = 1;}else{var cookie = 0;}
	addControl(
		option[n][0],
		option[n][1],
		option[n][2],
		option[n][3],
		option[n][4],
		cookie
	);
};
firstclass = 0;


// Load any AddOns //
	loadAddOns();
	// iScroll 5 Compatibility Fix //
	if (typeof IScroll != "undefined") {
		iScroll = IScroll;
	}
	// Set iScroll Option
	if (!Get_Cookie("iscroll_iscroll")) {
		if (typeof iScroll != "undefined") {
			RYU.config.iscroll_iscroll = 1;
		} else {
			RYU.config.iscroll_iscroll = 0;
		}
	} else {
		RYU.config.iscroll_iscroll=Get_Cookie("iscroll_iscroll");
	}

	// Hack for iOS 7 problems
	
	// Get this_issue stylesheet filename //
		if (typeof document.getElementById('this_issue') != "undefined") {
			mystyles = document.getElementById('this_issue').href.split(".css")[0];
			mystyles = mystyles.split("/");
			mystyles = mystyles[mystyles.length-1];
		} else {
			mystyles = "blank";
		}


// Apply Initial View Style //
	document.getElementById('screen_format').href = ""+baseurl+"ryuzine/css/"+viewstyle+".css";
// Write the Help Documentation //
	writeHelp();
// NOW we can start setting up the webapp //
	if (pg==null) {
		pagecount=2;
	} else {
		pagecount=pg;
	}
var b = 0;

	// This apparently  ONLY way to cross-browser attach the onkeyup listener
	document.onkeyup = function(evt) {
		evt = evt || window.event;
		keyNav(evt);
	}
	window.addEventListener('orientationchange',function(){if(window.orientation){RYU.bookBinder();}},false);
	window.addEventListener('resize',function(){RYU.bookBinder()},false);

	document.getElementById('under_glass').addEventListener(iDown,function(){RYU.togglePanel('all');},false);
	document.getElementById('fontbutton').addEventListener(iDown,function(){RYU.togglePanel(1);},false);
			document.getElementById('fontdone').addEventListener(iDown,function(){RYU.togglePanel(1);},false);
			document.getElementById('fontup').addEventListener(iDown,function(){RYU.resizeText(1);},false);
			document.getElementById('fontdn').addEventListener(iDown,function(){RYU.resizeText(-1);},false);
			document.getElementById('colors').addEventListener(iDown,function(){RYU.colorText();},false);
			document.getElementById('color_basic').addEventListener(iDown,function(){RYU.colorText(0);},false);
			document.getElementById('color_sepia').addEventListener(iDown,function(e){e=window.event? event : e;if(e.shiftKey){RYU.colorText(3);}else{RYU.colorText(1);}},false);			
			document.getElementById('color_black').addEventListener(iDown,function(e){e=window.event? event : e;if(e.shiftKey){RYU.colorText(4);}else{RYU.colorText(2);}},false);
	document.getElementById('slidetoggle').addEventListener(iDown,function(){RYU.pgslideToggle();},false);
	document.getElementById('tocbutton').addEventListener(iDown,function(){RYU.togglePanel(2);},false);
			document.getElementById('tocdone').addEventListener(iDown,function(){RYU.togglePanel(2);},false);
	document.getElementById('viewsbutton').addEventListener(iDown,function(){RYU.togglePanel(3);},false);
		document.getElementById('viewsdone').addEventListener(iDown,function(){RYU.togglePanel(3);},false);
		document.getElementById('viewbutton0').addEventListener(iDown,function(){RYU.gridBox('continuous');RYU.togglePanel(3);},false);
		if (cssTransform != undefined) {
		document.getElementById('viewbutton1').addEventListener(iDown,function(){RYU.gridBox('grid');RYU.togglePanel(3);},false);
		} else {
		document.getElementById('viewbutton1').style.display = "none";
		document.getElementById('viewbutton3').className = "button type3";
		document.getElementById('viewbutton4').style.display = "block";
		}
		document.getElementById('viewbutton2').addEventListener(iDown,function(){RYU.gridBox('plain');RYU.togglePanel(3);},false);
		document.getElementById('viewbutton3').addEventListener(iDown,function(){RYU.gridBox('ryuzine');RYU.togglePanel(3);},false);
		document.getElementById('viewbutton4').addEventListener(iDown,function(){RYU.togglePanel(3);RYU.controlsDelay(0);},false);
	document.getElementById('helpbutton').addEventListener(iDown,function(){RYU.helpPlay(1);},false);
		document.getElementById('bmarkdone').addEventListener(iDown,function(){RYU.togglePanel(0);},false);	
	document.getElementById('sharebutton').addEventListener(iDown,function(){RYU.togglePanel(4);},false);
	document.getElementById('optbutton').addEventListener(iDown,function(){RYU.togglePanel(5);},false);
		document.getElementById('optdone').addEventListener(iDown,function(){RYU.togglePanel(5);},false);
		if (RYU.device.OS == "Windows Phone 7") {
		document.getElementById('opt_pgslider_li').style.display="none";
		} else {

		}

	if (cssTransform != undefined && nav==0) {
		if (cssTransitionDelay != undefined) {
			if (RYU.device.OS=="Android") {
				// Page shadows fail on Android devices - disable option switch //
				document.getElementById('opt_pageshadows_li').style.display="none";
			}
			if (RYU.device.OS=="Android" && RYU.device.v < 3) {
				// 3D rendering not available on older Android devices - disable option switch //
				document.getelementById('opt_css3d_li').style.display="none";
			}
		if ( (nativeScroll != undefined && nativeScroll != null) || (RYU.device.OS=="Android" && RYU.device.v >= 3) ) {

		} else {
			document.getElementById('opt_nscroll_li').style.display="none";
			RYU.config.nscroll = 0;
		}
		if (css3dCapable != undefined && css3dCapable != null) {

		} else {
			document.getElementById('opt_css3d_li').style.display="none";
		}

		} else { // IE9 and FF 3.x can use most of the styles but cannot animate
		document.getElementById('opt_pageshadows_li').style.display="none";
		document.getElementById('opt_css3d_li').style.display="none";
		document.getElementById('opt_animate_li').style.display="none";
		document.getElementById('opt_nscroll_li').style.display="none";
		}
	} else {
		document.getElementById('opt_pageshadows_li').style.display="none";
		document.getElementById('opt_css3d_li').style.display="none";
		document.getElementById('opt_animate_li').style.display="none";
		document.getElementById('opt_nscroll_li').style.display="none";
		RYU.config.pageshadow = 0;
		RYU.config.animate = 0;
	}
	if ('ontouchstart' in document.documentElement || RYU.device.OS == "Windows Phone 7" ) {
		if (RYU.device.OS == "webOS" ) {
			RYU.config.zoompan = 0;
		}
	} else {
		document.getElementById('opt_zoompan_li').style.display="none";
	}
		if ( swapThemes == 0 || (swapThemes==1 && dynTheme() == "") ) {
		RYU.config.themeset = 0;
		document.getElementById('opt_themeset_label').parentNode.className="opt-disabled";
		} else {
		document.getElementById('opt_themeset_label').parentNode.className="";
		}
		themeToggle(RYU.config.themeset);
		shadowToggle(RYU.config.pageshadows);
		aniToggle(RYU.config.animate);
		css3dToggle(RYU.config.css3d);
		zoomToggle(RYU.config.zoompan);
		scrollToggle(RYU.config.nscroll);
		iScrollToggle(RYU.config.iscroll_iscroll);
		sliderToggle(RYU.config.pgslider);
		autohideToggle(RYU.config.autohide);

	document.getElementById('controltoggle').addEventListener(iDown,function(){RYU.controlsToggle(1);},false);
	document.getElementById('zoom').addEventListener(iDown,function(){RYU.zoomMode();},false);
	bm.addEventListener(iDown,function(){RYU.togglePanel(0);},false);
	am.addEventListener(iDown,function(){RYU.bookMark();},false);
	
	if (binding=="right") {
		back.addEventListener(iDown,function(){RYU.flip(1);},false);
		back.getElementsByClassName('label')[0].innerHTML = 'Next';
		next.addEventListener(iDown,function(){RYU.flip(0);},false);
		next.getElementsByClassName('label')[0].innerHTML = 'Back';
		next.className="button type1 right firstnav";
	} else {
		back.className="button type1 left firstnav";
		back.addEventListener(iDown,function(){RYU.flip(0);},false);
		next.addEventListener(iDown,function(){RYU.flip(1);},false);
	}

		
	for (var a=0; a<pagecount; a++) {
		folio[a] = document.getElementById('folio'+a);
			shadow[a] = document.getElementById('shadow'+a);
				if (RYU.config.pageshadow == 0) {shadow[a].style.display = "none";}
			page[a] = document.getElementById('page'+a);
				live[a]	= document.getElementById('live'+a);
				column[a] = document.getElementById('column'+a);
				footer[a] = document.getElementById('footer'+a);
				marginL[a] = document.getElementById('marginleft-'+a);
				marginR[a] = document.getElementById('marginright-'+a);
				if (binding=="right") {
					marginL[a].addEventListener(iDown,function(){RYU.flip(1);},false);
					marginR[a].addEventListener(iDown,function(){RYU.flip(0);},false);
				} else {
					marginL[a].addEventListener(iDown,function(){RYU.flip(0);},false);
					marginR[a].addEventListener(iDown,function(){RYU.flip(1);},false);
				}
	}
	if (binding=="right") { // Swaps Greeting and Goodbye placements if rightbound
		var plank_L = document.getElementById('plankL').innerHTML;
		var plank_R = document.getElementById('plankR').innerHTML;
		document.getElementById('plankL').innerHTML = plank_R;
		document.getElementById('plankR').innerHTML = plank_L;
	}

	
	p=0;x=1;z=0;events=0;prevW=0;prevH=0;aCheck=null; // Default TOC Method
	
	// Integrated Ad Triggers //
	if (splashad != 0 && !document.getElementById('skipad')) {
		splashad = 0;	// no splash ad was found during rewrite so zero out timer
	}
	if (isNaN(RYU.config.appbanner)){
		document.getElementById('appbanner').className="appbanner_dn";
	}
	document.getElementById('appbanner').addEventListener(iDown,function(){RYU.restoreDefault(this);},false);
	// Set up events for UI //
		if (document.getElementById('appbanner').getElementsByClassName('xbox').length > 0) {
			document.getElementById('appbanner').getElementsByClassName('xbox')[0].addEventListener(iDown,function(){RYU.bannerClear();},false);
		}
	if (!Get_Cookie("view")) {
	} else {
		setTimeout(function(){changeView(''+Get_Cookie("view")+'');},1000);
	}
	
// Fix UI problem if Android 2.x //
if (RYU.device.OS=="Android" && RYU.device.v < 3 ) {
		document.getElementById('binder').style.position="absolute";
}
	bookBinder();
	// If User has Added an In-App Bookmark Find Last One //
	getBookmarksList();
	if (bookmarks!=null && bookmarks!=0) {
		if (simulated==true) {
		 var str = bookmarkList[bookmarks-1];
		 str = str.split('#');
		 str = str[1];
		 flipTo(str);
		} else {window.location.href = bookmarkList[bookmarks-1];}
	}	
	// If URL points to anchor open to that page //
	if (window.location.hash) {
		var str = window.location.hash;
		if (str.match(/page/g)) {
			str = str.replace('#page','');
		} else {
			str = str.replace('#','');
		}
		if (str >= 0 && str < pagecount) {
			// prevent invalid hash //
			flipTo(str);
		}
	}
	
	// Opera gets sheet height too early causing live content to spill out  //
	// so run bookBinder again on a delay so it gets the correct values		//
	if (RYU.device.Platform == "Opera" || RYU.device.Platform == "IE") {
		setTimeout(function(){bookBinder();},1100);
	}
	
	RYU.config.lblinks = [];
	RYU.config.lblinks_listeners = [];
	RYU.config.preplinks = function() {	// removes event listeners
		for (var a=0; a < RYU.config.lblinks.length; a++) {
			RYU.config.lblinks[a].removeEventListener(iDown,RYU.config.lblinks_listeners[a],false);
		}
	}

	var atags = document.getElementsByTagName('a');
	for (var a=0; a < atags.length; a++) {
		if (atags[a].rel == 'lightbox' && atags[a].hostname == window.location.host && atags[a].href.match(/#/gi)) {
			RYU.config.lblinks.push(atags[a]);	// add to embedded links array
			// ok, we can be pretty certain it is a link to an embedded lightbox
			var lb_id = atags[a].href.split('#')[1];	// get ID of target
			if (atags[a].hasAttribute('title')) {
				var lb_title = atags[a].title;
			} else {
				var lb_title = 'Figure '+(RYU.config.lblinks.length-1);
			}
			if (document.getElementById(''+lb_id+'')) { // look for embed
				var lb_content = document.getElementById(''+lb_id+'').innerHTML;
				addDialogBox('nolb-'+lb_id,lb_title,lb_content,'',0,0,'nolightbox' );
				atags[a].addEventListener(iDown,RYU.config.lblinks_listeners[RYU.config.lblinks_listeners.length]=function(e){e.preventDefault();RYU.toggleDialog('nolb-'+lb_id+'');},false);
			} else {
				atags[a].addEventListener(iDown,RYU.config.lblinks_listeners[RYU.config.lblinks_listeners.length]=function(e){e.preventDefault();},false);
			}
		} else if (atags[a].rel=='lightbox') {	// any other lightbox links need to be fixed to work on touch devices in non-zoom mode
			RYU.config.lblinks.push(atags[a]);
			atags[a].setAttribute('target','_blank');	// make sure it opens in a new tab/window			
			atags[a].addEventListener(iDown,RYU.config.lblinks_listeners[RYU.config.lblinks_listeners.length]=function(){if('ontouchstart' in document.documentElement){alert('opening in new window');window.open(this.href,'_blank');}},false);
		} else {
			// leave the link alone
		}
	} 

}

var aboutDialog = function() {
		var about_textbox = ''+
				'	<div style="height:72px;overflow:hidden;text-align:center;margin-bottom:5px;">'+
				'		<a href="http://www.ryumaru.com" style="border: none;text-decoration:none;color: #000;">'+
				'			<div id="aboutlogo"></div>'+
				'		</a>'+
				'	</div>'+
				'	<p style="text-align:center;"><small><strong>Ryuzine Reader</strong><br/>'+
				'	'+RYU._lc("Version")+' '+version+'<br/></p>'+
				'	<p>'+RYU._lc("Ryuzine™ is a javascript application designed for publishing content to the web and mobile devices in a familiar magazine-style format.")+' '+RYU._lc("Publishing Kit available at")+' <a href="http://www.ryumaru.com/products/ryuzine" target="_blank">www.ryumaru.com</a>.</p>'+
				'	<p>'+RYU._lc("Ryuzine was created by K.M. Hansen, original code ©2011-2015 All Rights Reserved.")+'</p>'+
				'	<p>'+RYU._lc("Read the license and a list of project contributors:")+' <a href="'+baseurl+'ryuzine/LICENSE.txt" target="_blank">'+RYU._lc("LICENSE FILE")+'</a>, <a href="'+baseurl+'ryuzine/AUTHORS.txt" target="blank">'+RYU._lc("CONTRIBUTORS")+'</a></p>'+
				'	<p>'+RYU._lc("Ryuzine and the Ryuzine logos are trademarks of K.M. Hansen and Ryu Maru. All rights reserved. The names of other companies, products, services and content distributed via the Ryuzine publishing platform are the property of their respective owners.")+'</p><hr/>'+
				'	<h2>Add-ons</h2>';
				for (var key in addon) {
					if (!addon.hasOwnProperty(key)) { continue; }	// do not include keys added by prototype
					console.log('key in = '+key);
					// 'register' is a reserved object, undefined = addon that didn't load
					if (key!='register' && typeof addon[''+key+''].name!=undefined) {
					console.log('ABOUT DIALOG: '+addon[''+key+''].name);
					about_textbox+='<p>'+RYU._lc("Name")+': '+addon[''+key+''].info.name+'<br/>'+
					''+RYU._lc("Version")+' :'+addon[''+key+''].info.version+'<br/>'+
					''+RYU._lc("Author")+': '+addon[''+key+''].info.author+'<br/>'+
					''+RYU._lc("Website")+': <a href="'+addon[''+key+''].info.url+'" target="_blank">'+addon[''+key+''].info.url+'</a><br/>'+
					''+RYU._lc("License")+': '+addon[''+key+''].info.license+'<br/>'+
					''+RYU._lc("Description")+': '+addon[''+key+''].info.about+'<hr/>';
					}
				};
		addDialogBox('about',RYU._lc('About Ryuzine'),about_textbox);
		toggleDialog('about');	// now open it
		// replace this function with toggle
		aboutDialog = function() { toggleDialog('about');}
}


function elementSizes() {
	// Page Elements
	sH = sh.offsetHeight; 	// Sheet Height
	hH = document.getElementById('header1').offsetHeight; // Header Height
	hM = document.getElementById('header1').offsetTop;
	fH = document.getElementById('footer1').offsetHeight; // Footer Height
	nH = document.getElementById('controlbox0').offsetHeight;
	cH = document.getElementById('controlbox1').offsetHeight;
	fM = hM; // assume footer bottom margin = header top margin
	sW = sh.offsetWidth; 	// Spread Width
	tM = 50;
}

function iScrollApply(element,area,scroll) {
	// error catch and bail if non-existent target(s)
	if (typeof element == 'string') {
		if (!document.getElementById(''+element+'')) {
			return;
		} else {
		element = document.getElementById(''+element+'');
		}
	}
	if (area == null) { area = 'area';}
	if (typeof area == 'string') {
		if (!document.getElementById(''+area+'')) {
			if (element.getElementsByClassName(''+area+'').length > 0) {
				area = element.getElementsByClassName(''+area+'')[0];
			} else {
				return;
			}
		} else {
			area = document.getElementById(''+area+'');
		}
	}
	if (scroll==null) { scroll = area;} else { 
		if (!document.getElementById(''+scroll+'')) {
			if (element.getElementsByClassName(''+scroll+'').length > 0) {
				scroll = element.getElmentsByClassName(''+scroll+'')[0];
			} else {
				scroll = area;
			}
		} else {scroll = document.getElementById(''+scroll+''); }
	}
	scroll.scrollTop=0;
	// Now apply iScroll if we can
	if (typeof iScroll != "undefined" && RYU.config.iscroll_iscroll == 1) {
		// scroller overflow = hidden;
		scroll.style.overflow = "hidden";
		scroll.style.height = "auto";
		var s = iscrollers.length;
		var scroller_exists = 0;	// assume it does not exist
		for (var x=0; x < s; x++) {
			if (iscrollers[x][0]==element.id && iscrollers[x][1] != null) {
				scroller_exists = 1;
				onRebind(iscrollers[x][1]);	// refresh it
			}
		}
		// ok, scroller doesn't exist so we will make it
		if (scroller_exists==0) {
			iscrollers[s] = [];
			iscrollers[s][0] = element.id;
			if (nativeScroll==undefined && (RYU.device.Platform != "Firefox" && RYU.device.Platform != "IE")) {
					iscrollers[s][1] = new iScroll(area, { scrollbarClass: 'iscrollbar', scrollbars: 'custom', mouseWheel: true, interactiveScrollbars: true,
					onBeforeScrollStart: function() {return false;},
					onScrollMove: function () {touchmoveCheck=1;},
					onBeforeScrollEnd: function() {touchmoveCheck = 0;},
					tap: true	
				});
			} else {
				//onBeforeScrollStart makes list "sticky" if Pan+Zoom is turned on //
				iscrollers[s][1] = new iScroll(area, { scrollbarClass: 'iscrollbar', scrollbars: 'custom', mouseWheel: true, interactiveScrollbars: true,
					onScrollMove: function () {touchmoveCheck=1;},
					onBeforeScrollEnd: function() {touchmoveCheck = 0;},
					tap: true
				});			
			}
		}
	} else {	// iScroll is either undefined OR nativeScroll is defined
		scroll.style.height = '';
		if ( (RYU.config.nscroll==1 && RYU.device.OS == "iOS" && nativeScroll != undefined && RYU.config.zoompan == 1 && zoomed == 0 ) || 
			 (RYU.config.nscroll==1 && RYU.device.OS == "Android" && RYU.device.v >= 3  && RYU.config.zoompan == 1 ) || 
			 RYU.device.OS == "Windows Phone 7") {
			scroll.style.overflow  = "auto";
			scroll.style.overflowX = "hidden";
			if (nativeScroll != undefined) {
				scroll.style[nativeScroll] = "touch";
			}
		} else {
			if ('ontouchstart' in document.documentElement) {
				scroll.style.overflow = "hidden";
				scroll.addEventListener('touchstart',RYU.scrollIt,false);
			} else {
				scroll.style.overflow  = "auto";
				scroll.style.overflowX = "hidden";
			};
		}
		// Nuke iScroll Objects
		for (var i=0; i < iscrollers.length; i++) {
			if (iscrollers[i][1]!=null) {
				iscrollers[i][1].destroy();
				iscrollers[i][1]=null;
			}
		}
		area.children[0].setAttribute('style','');	// iScroll doesn't clean up after itself
	}
};	// end of iScrollApply

function bookBinder() {
	// iScroll 5 Compatibility Fix //
	if (typeof IScroll != "undefined") {
		iScroll = IScroll;
	}
	// over-ride for unsupported platforms
if ( (RYU.device.OS == "Android" && RYU.device.v < 3) || (RYU.device.Platform == "Safari"  && RYU.device.v < 4) || (RYU.device.OS == "Windows Phone 7") ) { iScroll = undefined; }

	var panels = document.getElementsByClassName('style1');
	for (var a=0; a < panels.length; a++) {
		iScrollApply(panels[a]);
	}

	W = window.innerWidth;
	H = window.innerHeight;
	document.getElementById('spineshadow').style.zIndex=pagecount+1;
	bm.style.zIndex=pagecount-1;
		if ( RYU.config.animate==1 && ((cssTransform != undefined && cssTransitionDelay != undefined) || (cssTransform != undefined && cssTransitionDelay == undefined)) && nav==0  )  {
			if (W>H && W>1023) { // Landscape Mode
				for (var a=0; a<pagecount; a++) {
					folio[a].style.display="block";
					page[a].style.display="block";
					// Stack Pages //
					if (isEven(a)) {
						folio[a].style.zIndex=pagecount-a;
						folio[a].style[cssTransform]="scaleX(1)";
						page[a].style[cssTransform]=in3d(a);
					}else{
						folio[a].style.zIndex=a;
						folio[a].style[cssTransform]="scaleX(0)";
						page[a].style[cssTransform]=out3d(a);
					}
					// Bind Pages
					if ( (a>current && !isEven(a)) || (a<current && isEven(a)) ) {
							page[a].style[cssTransform]=out3d(a);
							folio[a].style[cssTransform]="scaleX(0)";
						}
						else {
							page[a].style[cssTransform]=in3d(a);
							folio[a].style[cssTransform]="scaleX(1)";
						}
					if (a===current-1 || a===current || a===current+1) {
						column[a].style.display="block";
					}
					iScrollApply(page[a],live[a]);
				}
			}
			else { // Portrait Mode
				for (var a=0; a<pagecount; a++) {
					// Stack Pages
					folio[a].style.zIndex=pagecount-a;
					// Bind Pages
					if (a<current) {
						page[a].style[cssTransform]=out3d(a);
						folio[a].style[cssTransform]="scaleX(0)";
					}
					else {
						page[a].style[cssTransform]=in3d(a);
						folio[a].style[cssTransform]="scaleX(1)";
					}
					iScrollApply(page[a],live[a]);
				}
			}
		}
		else if (nav==0) { // Limited Support or Animation Off //
				// Make sure elementSizes are part of the DOM before getting sizes //
				document.getElementById('folio1').style.visibility="hidden";
			 	document.getElementById('folio1').style.display="block";
			 	document.getElementById('folio1').style.display="none";
			 	document.getElementById('folio1').style.visibility="visible";
			if (W>H && W>1023) { // Landscape Mode
				for (var a=0; a<pagecount; a++) {
					page[a].style[cssTransform]="scaleX(1)";
					folio[a].style[cssTransform]="scaleX(1)";
					// Stack Pages //
					if (isEven(a)) {
						folio[a].style.zIndex=pagecount-a;
					}else{
						folio[a].style.zIndex=a;
					}
					document.getElementById('spineshadow').style.zIndex=pagecount+1;
					// Bind Pages
					if ( a > current) {
						if (isEven(a)) {
							folio[a].style.display="block";
						} else {
							folio[a].style.display="none";
						}
					} else if ( a < current) {
						if (isEven(a)) {
							folio[a].style.display="none";
						} else {
							folio[a].style.display="block";
						}
					} else {
						folio[a].style.display="block";
					}
					if (a===current-1 || a===current || a===current+1) {
						column[a].style.display="block";
					}
					iScrollApply(page[a],live[a]);
				}
			}
				else { // Portrait Mode
					if (nav==0) {
						for (var a=0; a<pagecount; a++) {
							page[a].style[cssTransform]="scaleX(1)";
							folio[a].style[cssTransform]="scaleX(1)";
							folio[a].style.display="block";
						// Stack Pages
						folio[a].style.zIndex=pagecount-a;
						// Bind Pages
						if (a<current) {
							folio[a].style.display="none";
						}
						else {
							folio[a].style.display="block";
						}
						iScrollApply(page[a],live[a]);
							marginL[a].style.visibility="visible";
							marginR[a].style.visibility="visible";
						}
				}
			}
		}
		else {}
	prevW=W;
	prevH=H;
	splashAction();	
	resizeBoxAd();

	if (RYU.device.OS=="iOS" && nativeScroll != undefined) {
		// iOS needs a temporary reflow to initialize native scrolling //
		up_box.style.display="block";
		setTimeout(function(){document.getElementById('upbox').style.display="none"},1000);
	}

	
	adjW = document.getElementById('tocslider').offsetWidth-document.getElementById('tocslider_button').offsetWidth;
	stpW = parseInt(adjW/pagecount);
	for (var x=0; x < pagecount+1; x++) {
		pageStop[x] = x*stpW;
	}
	toc_addEventListeners();
	getBookmarksList()

}
var splashAction = function() {
		if (RYU.config.themeset!=0) {
			var checkval = 2;	// look for tcheck width 2px
		} else { 
			var checkval = 1;	// look for tcheck width 1px
		}
		if (handle==null) {
			handle = window.setInterval(function(){
				if (document.getElementById('tcheck').clientWidth==checkval && document.getElementById('vcheck').clientWidth==1) {
					console.log('binder trigger of clearSplash('+splashad+')');
					clearSplash(splashad);
					window.clearInterval(handle);
					handle = null;
				}
			},30);
		}
		// if theme has not loaded in 2 seconds proceed anyway
		splashcatch = setTimeout(function(){clearSplash(splashad);window.clearInterval(handle);handle=null;clearTimeout(splashcatch);splashcatch=null;},2000);
		splashAction = function(){};	// we only want this to run once
}
function resizeBoxAd() {
	if (document.getElementById('boxad')) {
		var boxad = document.getElementById('boxad');
		var boxsc = boxad.getElementsByClassName('scrollbox')[0];
		boxad.style.top = '50%';
		boxad.style.left = '50%';
		if (boxsc.offsetHeight+boxsc.parentNode.offsetTop+10 <= parseInt(H*.8)) {
			boxad.style.height = (boxsc.offsetHeight+boxsc.parentNode.offsetTop+10)+'px';
			boxad.style.marginTop = '-'+((boxsc.offsetHeight+boxsc.parentNode.offsetTop+10)/2)+'px';
		} else {
			boxad.style.height = parseInt(H*.8)+'px';
			boxad.style.marginTop = '-'+parseInt((H*.8/2))+'px';
		}
		boxad.style.width  = parseInt(W*.8)+'px';
		boxad.style.marginLeft ='-'+parseInt( (W*.8)/2 )+'px';
	}
}

var adclock = null;
var boxad_timer = null;
var time = splashad;
var triggerAds = function () {
	time = box_ad;clearInterval(adtrigger);adtrigger=null;
	if ( (box_ad>0 || isNaN(box_ad)) && document.getElementById('myboxad')) {
		addDialogBox('boxad',_lc("Advertisement"),document.getElementById('myboxad').innerHTML);
		document.getElementsByTagName('body')[0].removeChild(document.getElementById('myboxad'));
		toggleDialog('boxad');			
		resizeBoxAd();
		if (!isNaN(box_ad)) {
			var timer = document.createElement('p');
				timer.id="boxad_timer";
				if (time < 10) { var pre = '0';} else { var pre = '';}
				timer.innerHTML = '0:'+pre+time;
			document.getElementById('boxad').getElementsByTagName('div')[0].appendChild(timer);
			adclock = setInterval(function(){
				if (document.getElementById('boxad_timer')){
					if (time < 10) { var pre = '0';}else{ var pre = '';}
					document.getElementById('boxad_timer').innerHTML='0:'+pre+time;
					if (time > 0) {time--}else{time=0};
				} else {
					clearInterval(adclock);
					clearTimeout(boxad_timer);
					adclock = null; boxad_timer = null;
				}
			},1000);
			boxad_timer = setTimeout(function(){RYU.toggleDialog("boxad");clearInterval(adclock);adclock=null;},box_ad*1000);
		}
	}
	
	if (!isNaN(RYU.config.appbanner) && RYU.config.appbanner != 0) {
		showad=setInterval(function(){bannerAd();},RYU.config.appbanner*1000);	
	}
	// we only want to do this once so empty function
	triggerAds = function(){};
}


function clearSplash(adtime) {
	if (adtime==null) { adtime = 0;} else { splashad = adtime; }
	// Clear Splash Screen //
	clearTimeout(splashoff);clearTimeout(splashout);clearTimeout(splashload);clearTimeout(adtrigger); // clear any existing timers
	splashoff = null; splashout = null; splashload = null; adtrigger = null;
	var loadicon_clear = function(){document.getElementById('loadicon').className='';};
	var splash_ani_out = function(){document.getElementById('splash').className='splash_out';};
	var splash_no_show = function(){document.getElementById('splash').style.display = 'none';};
	if (adtime>0 || isNaN(adtime)) {
		if (!isNaN(adtime)) { }else { adtime=15;};
		if (!document.getElementById('splashad_timer')) {
			var timer = document.createElement('p');
				timer.id = "splashad_timer";
				if (time < 10) { var pre = '0';}else{ var pre = '';}
				timer.innerHTML = '0:'+pre+time;
				document.getElementById('splashcell').appendChild(timer);
				adclock = setInterval(function(){
					if (document.getElementById('splashad_timer')){
						if (time < 10) { var pre='0';} else { var pre = '';}
						document.getElementById('splashad_timer').innerHTML='0:'+pre+time;
						if(time>0){time--}else{time=0;};
					} else {
						clearInterval(adclock);
						adclock = null;
					}
				},1000);
		};
		if (cssTransitionDelay != undefined && cssTransitionDuration != undefined) {
			var delay = getStyle('splash',cssTransitionDelay);
			var duration = getStyle('splash',cssTransitionDuration);
			if (delay==null) { delay = 0 };
			if (duration==null) {duration = 0};
			splashtime = parseInt( (parseFloat(duration)+parseFloat(delay)+adtime)*1000 ); 
			splashload= setTimeout(loadicon_clear,splashtime);
			splashout = setTimeout(splash_ani_out,adtime*1000);
			splashoff = setTimeout(splash_no_show,splashtime);
			adtrigger = setTimeout(function(){triggerAds();},splashtime);
		} else {
			splashload= setTimeout(loadicon_clear,adtime*1000);
			splashoff = setTimeout(splash_no_show,adtime*1000);
			adtrigger = setTimeout(function(){triggerAds();},adtime*1000);
		}
	} else {
		if (cssTransitionDelay != undefined && cssTransitionDuration != undefined) {
			var delay = getStyle('splash',cssTransitionDelay);
			var duration = getStyle('splash',cssTransitionDuration);
			if (delay==null) { delay = 0 };
			if (duration==null) {duration = 0};
			splashtime = parseInt( (parseFloat(duration)+parseFloat(delay))*1000 );
			splashload= setTimeout(loadicon_clear,splashtime); 
			document.getElementById('splash').className="splash_out";
			splashoff = setTimeout(splash_no_show,splashtime);
			adtrigger = setTimeout(function(){triggerAds();},splashtime);
		} else {
			document.getElementById("loadicon").className="";
			document.getElementById('splash').style.display="none";
			triggerAds();
		}
	}
};


function getStyle(el,styleProp) {
	var y = "";
	var x = document.getElementById(el);
	if (window.getComputedStyle) {
		styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase(); // Convert JS prop to CSS prop
		y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	} else if (x.currentStyle) {
		styleProp = styleProp.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase(); // convert CSS prop to JS prop
		});
		y = x.currentStyle[styleProp];
	}
	return y;
}



// PAGE TURN ANIMATION //

function onDemand(p,display) {
	document.getElementById('column'+p).style.display=""+display+"";
	if (display=="block" && RYU.config.nscroll==0) {
		for (var i=0; i < iscrollers.length; i++) {
			if (iscrollers[i][0]=='page'+p) {
				onRebind(iscrollers[i][1]);
			}
		}
	}
}

function out3d(p) {
	if (RYU.config.css3d == 1) {
		if (binding=="right") {
			if (W>H && W>1023 && !isEven(p)) {
				return "rotate3d(0,1,0,-90deg)";
			} else {
				return "rotate3d(0,1,0,90deg)";
			}
		} else {
			if (W>H && W>1023 && !isEven(p)) {
				return "rotate3d(0,1,0,90deg)";
			} else {
				return "rotate3d(0,1,0,-90deg)";
			}		
		}
	} else {
		return "scaleX(0)";
	}
}

function in3d(p) {
	if (RYU.config.css3d == 1) {
		return "rotate3d(0,1,0,0deg)";
	} else {
		return "scaleX(1)";
	}
}


function turnPage(p,d,b) {
	if (typeof b != 'undefined' ) {hidecontrols = setTimeout('RYU.controlsToggle(0)',2000);}
	if (p == pagecount-1) { bm.style.display="none"; } else { bm.style.display="block"; }
	if ( ((cssTransitionDelay != undefined && cssTransform != undefined) || (cssTransitionDelay == undefined && cssTransform != undefined)) && RYU.config.animate==1 ) {	
	// For Modern Browsers
		// Partial Support Browsers also use this because they cannot process the page flip animation fast enough from Table of Contents
		if (W>H && W>1023 ) { // Landscape Orientation
				if (d==0) { 
					current=p;
					clearTimeout(pagetimer[p]);
					column[p].style.display="block";
					if ( (p-1)>=0) {
						clearTimeout(pagetimer[p-1]);
						column[p-1].style.display="block";
					}
				// Do Reveals
					onDemand(p,'block');
					if ( (p-1)>=0 ) {
						onDemand(p-1,'block');
					}

					page[p+1].style[cssTransitionDelay]="0s";
					page[p+1].style[cssTransform]=out3d(p+1);
					
					folio[p+1].style[cssTransitionDelay]="0s";
					folio[p+1].style[cssTransform]="scaleX(0)";


					page[p].style[cssTransitionDelay]=".8s";
					page[p].style[cssTransform]=in3d(p);
					
					folio[p].style[cssTransitionDelay]=".8s";
					folio[p].style[cssTransform]="scaleX(1)";
								
				// Do Hides	
					pagetimer[p+1] = setTimeout("RYU.onDemand("+(p+1)+",'none')",2000);
					if ( (p+2)<=(pagecount-1) ) {
						pagetimer[p+2] = setTimeout("RYU.onDemand("+(p+2)+",'none')",2500);
					}
				} 
				else { 
						current = p+1;
							if (current==pagecount) {current = current-1; }
						clearTimeout(pagetimer[p]);
						column[p].style.display="block";
						if ( (p+1) <= (pagecount-1) ) {
							clearTimeout(pagetimer[p+1]);
							column[p+1].style.display="block";
						}
					// Do Reveals	
						onDemand(p,'block');
						if ( (p+1)<=(pagecount-1) ) {
							onDemand(p+1,'block');
						}
							
						page[p-1].style[cssTransitionDelay]="0s";
						page[p-1].style[cssTransform]=out3d(p-1);
						
						folio[p-1].style[cssTransitionDelay]="0s";
						folio[p-1].style[cssTransform]="scaleX(0)";


						page[p].style[cssTransitionDelay]=".8s";
						page[p].style[cssTransform]=in3d(p);
						
						folio[p].style[cssTransitionDelay]=".8s";
						folio[p].style[cssTransform]="scaleX(1)";
						
					// Do Hides
						pagetimer[p-1] = setTimeout("RYU.onDemand("+(p-1)+",'none')",2000);
						if ( (p-2)>=0 ) {
							pagetimer[p-2] = setTimeout("RYU.onDemand("+(p-2)+",'none')",2500);
						}
				}
				autoflip = 0;
		} else { // Portrait Orientation
			if (d==0) { 				
				current=p;
					clearTimeout(pagetimer[p]);
					column[p].style.display="block";
				// Do Reveals
					onDemand(p,'block');
					if ( (p-1)>=0 ) {
						onDemand(p-1,'block');
					}
				page[p].style[cssTransitionDelay]="0s";
				page[p].style[cssTransform]=in3d(p);
				folio[p].style[cssTransitionDelay]="0s";
				folio[p].style[cssTransform]="scaleX(1)";
				
				// Do Hides	
					pagetimer[p+1] = setTimeout("RYU.onDemand("+(p+1)+",'none')",2000);
			} 		
			else { 
				current=p;
					clearTimeout(pagetimer[p]);
					column[p].style.display="block";
					// Do Reveals	
						onDemand(p,'block');

				page[p-1].style[cssTransitionDelay]="0s";
				page[p-1].style[cssTransform]=out3d(p-1);
				folio[p-1].style[cssTransitionDelay]="0s";
				folio[p-1].style[cssTransform]="scaleX(0)";
					// Do Hides
					pagetimer[p-1] = setTimeout("RYU.onDemand("+(p-1)+",'none')",2000);


			}

		}
	} else {	// For supported browsers without CSS3 Transforms //
			if (W>H && W>1023 ) { // Landscape Orientation
				if (d==0) { 
					current=p;
 				// Do Reveals
					onDemand(p,'block');
					if ( (p-1)>=0 ) {
						onDemand(p-1,'block');
					}
					folio[p+1].style.display="none";
					folio[p].style.display="block";
				// Do Hides	
					onDemand(p+1,'none');
					if ( (p+2)<=(pagecount-1) ) {
						onDemand(p+2,'none');
					}
				} 
				else { 
						current = p+1;
					// Do Reveals	
						onDemand(p,'block');
						if ( (p+1)<=(pagecount-1) ) {
							onDemand(p+1,'block');
						}
							if (current==pagecount) {current = current-1; }						
						folio[p-1].style.display="none";
				
						folio[p].style.display="block";
					// Do Hides
						onDemand(p-1,'none');
						if (p>=3) {
							onDemand(p-2,'none');
						}
				}
				autoflip = 0;
		}
		else { // Portrait Orientation
			if (d==0) {
					current=p;
				// Do Reveals
					onDemand(p,'block');
					folio[p].style.display="block";	
				// Do Hides	
					onDemand(p+1,'none');
				} 
				else {
					current=p;
					// Do Reveals	
						onDemand(p,'block');
					p=p-1;
					folio[p].style.display="none";	
					// Do Hides
					if ( (p-1)>=0) {
						onDemand(p-1,'none');
					}
				}
		}
	}
		slideSync(p);
}


function flipTo(q) {
	W = window.innerWidth;
	H = window.innerHeight;
	flipThru = function(c,d,q) {
		if (d==1) {
			if ((W>H && W>1023) && (cssTransform != undefined || cssTransitionDelay != undefined)) {
				if (!isEven(c)) {
					turnPage(c,d);
				}
			} else { 
				turnPage(c,d);
			}
			c++;
			if (c<(q+1)) {
				setTimeout('flipThru('+c+','+d+','+q+')',50);
			}
		} else {
			if ((W>H && W>1023) && (cssTransform != undefined || cssTransitionDelay != undefined)) { 
				if (isEven(c)) { 
					turnPage(c,d);
				}
			}
			else { 
				turnPage(c,d);
			}
			c--;
			if (c>(q-1)) {
				setTimeout('flipThru('+c+','+d+','+q+')',50);
			}	
		}
	}
	
	if (nav == 1) { // if in altview use altnav //
		if (simulated==true) {
			document.getElementById(q).scrollIntoView();
		} else {
		window.location.href="#"+q;
		}
		current = q;
	}
	else { 
		autoflip = 1;
		// Flip to Any Page from Any Page
		if (q-current > 32 || q-current < -32) {
			var skipflip = 1; } else { var skipflip = 0; }
		if (q>current) {
			d=1;
			if (current==0) {c=1;} else {c=current;}
			if (RYU.config.animate==0 || skipflip==1) { 
				for (flip=c; flip<=q; flip++) {
					if (W>H && W>1023) { 
						if (!isEven(flip)) { 
							turnPage(flip,d);
						}
					} else {
							turnPage(flip,d);
					}
				}
			} else {
				flipThru(c,d,q);
			}
		}
		else {
			d=0;
			c = current;
			if (RYU.config.animate==0 || skipflip==1) { 
				for (flip=current; flip>q-1; flip--) {
					if (W>H && W>1023) { 
						if (isEven(flip)) { 
							turnPage(flip,d);
						}
					}
					else { 
						turnPage(flip,d);
					}
				}
			} else {
				flipThru(c,d,q);
			}
		}
	}
	clearTimeout( hidecontrols );
	hidecontrols = setTimeout('RYU.controlsToggle(0)',2000);
}

function flip(dir) {
	// flip back
	if (dir==0 || dir=='back') {
		if (W>H && W>1023) {
			if ( (current-2) > -1) {
				if (current==(pagecount-1)) {
					flipTo((current-1)); // Must use flipTo() or alt views do not work right
				}
				else {
					flipTo((current-2));
				}
			}
		} else {
			if ( (current-1) > -1) {
				flipTo((current-1));
			}
		}
	} else {	// flip next
		if ( (current+1) < pagecount ) {
			flipTo((current+1));
		}
	}
}


// USER INPUT FUNCTIONS //

	// TOUCH SCREEN HANDLER //
	// This app uses simplified touch event detection 	//
	// to support devices that do not use multi-touch	//
	// and a pseudo-swipe method to include device that //
	// cannot use the gesture touch methods				//
	
	var touchmoveCheck = 0;
	
	var scrollIt = function(e) {
		n = event.currentTarget;
	    updown 	= event.touches[0].pageY;
	    sideside = event.touches[0].pageX;
		n.addEventListener('touchmove',RYU.touchScroll,false);
		touchmoveCheck = 0;
	}
	
	var touchScroll = function(e) {
		var n = event.currentTarget;
	    var touch = event.touches[0];
	    var fingerMoved = updown - touch.pageY;
	    var fingerSwipe = touch.pageX;
		touchmoveCheck=1;
		if (nativeScroll == undefined || (nativeScroll !=undefined && RYU.config.zoompan == 0) || RYU.config.nscroll == 0 ) {
			if (typeof iScroll == "undefined") {
				// If no native scrolling support use JS scrolling //
				if (RYU.device.OS == "Android" && RYU.device.v >= 3) {
					// Cannot preventDefault for And3+ //
				} else {
					event.preventDefault();
				}
				n.scrollTop = n.scrollTop + fingerMoved;
				updown = touch.pageY;
			}
	   	}
	   	if (nav==0) { // Ignore swipes in alt view modes //
		swipeGesture(fingerSwipe,sideside);
		}
	   	   	sideside = touch.pageX;
	   	   	touch=0;
	}

var swipeGesture = function (fingerSwipe,sideside) {
	if (binding=="right") {
		swipeGesture = function(fingerSwipe,sideside) {
			// Rightbound Book
			if (fingerSwipe > sideside && (fingerSwipe-sideside) > 90 ) {
			if (current >= 0 && current <= (pagecount-2) ) {
				q = current+1;
				setTimeout(function(){turnPage(q,1);},500);
				}
			 }
			if (fingerSwipe < sideside && (sideside-fingerSwipe) > 90 ) {
				if (current > 0  && current <= pagecount) {
					if (W>H && current != (pagecount-1)) {q=current-2;} else {q=current-1;}
					setTimeout(function(){turnPage(q,0);},500);
			}
			}
		}
	
	} else {
		swipeGesture = function(fingerSwipe,sideside) {
			// Leftbound Book
			if (fingerSwipe < sideside && (sideside-fingerSwipe) > 90 ) {
				if (current >= 0 && current <= (pagecount-2) ) {
					q=current+1;
					setTimeout(function(){turnPage(q,1);},500);
					}
				 }
			if (fingerSwipe > sideside && (fingerSwipe-sideside) > 90 ) {
				if (current > 0  && current < pagecount) {
					if (W>H && current != (pagecount-1)) {q=current-2;} else {q=current-1;}
					setTimeout(function(){turnPage(q,0);},500);
				}
			}
		}
	}
}
	
	var mScrollItOn = function(e,a) {
		if (typeof iScroll == "undefined") {
			var n =(e.currentTarget) ? e.currentTarget : document.getElementById('live'+a);
			n.style.overflow='auto';
			n.style.overflowX='hidden';
		}
	}
	
	var mScrollItOff = function(e,a) {
		if (typeof iScroll == "undefined") {
			var n =(e.currentTarget) ? e.currentTarget : document.getElementById('live'+a);
			n.style.overflow='hidden';
		}
	}
// Prevent triggering link on scroll //	
	function tapCheck(n,pan,b,check) {
	 	if (touchmoveCheck==1) {
	 	} else {
	 		if (check==null) {
				swapList(n,pan,b);
			} else {
				gridBox('ryuzine',check);
			}
		}	
	}
	
	
	function gridBox(v,c) {
		if (c==null || c=="undefined") { c = 0; }
		if (v==view) {} else {
			if (v=="ryuzine") { var timer = 2500; } else { var timer = 1250;}
			if (RYU.config.animate==1 && viewani==1) {
					document.getElementById('gridbox').className = "grid_out";
					setTimeout(function(){document.getElementById('loadicon').className="spinning";},500);
						if (view=="grid") {
							setTimeout(function(){document.getElementById('gridbox').style[cssTransitionDuration]="0s";document.getElementById('gridbox').className = "grid_deck";changeView(v);flipTo(c);},1000);
						} else {
							setTimeout(function(){document.getElementById('gridbox').style[cssTransitionDuration]="0s";document.getElementById('gridbox').className = "grid_deck";changeView(v);},1000);
						}
					setTimeout(function(){document.getElementById('gridbox').style[cssTransitionDuration]="1s";document.getElementById('gridbox').className = "grid_in";document.getElementById('loadicon').className="";},timer);
			} else {
				if (view=="grid") {
					changeView('ryuzine');
					flipTo(c);
				} else {
					changeView(v)
				}
			}
		}
	}
	
	function enableDefault(n,t) {
		// 1 touchstart | 2 touchmove | 3 touchend | 4 all three // 
		if (t==null) {t=4} // assume all three if not specififed //
		if (t==1) {
		n.ontouchstart = function (event) {
			event.elementIsEnabled = true;
			swapList(n,1,1);
			}
		}
		if (t==2) {
		n.ontouchmove = function (event) {event.elementIsEnabled = true;}
		}
		if (t==3) {
		n.ontouchend = function (event) {event.elementIsEnabled = true;}
		}
		if (t==4) {
		n.ontouchstart = function (event) {event.elementIsEnabled = true;}
		n.ontouchmove = function (event) {event.elementIsEnabled = true;}
		n.ontouchend = function (event) {event.elementIsEnabled = true;}
		}
		
	
	}
// over-ride navigation arrow check
var blocking_elements = [];
RYU.config.block_keynav = function(el){
	if (el!=null) {
		if (blocking_elements.indexOf(el)===-1) {
			blocking_elements.push(el);
		}
	}
	var block = false;	// assume no blocking
	for (var k=0; k < blocking_elements.length; k++) {
		if (document.getElementById(''+blocking_elements[k]+'')) {	// only do this if element exists!
			if(	document.getElementById(''+blocking_elements[k]+'').style.display!='none' &&
				document.getElementById(''+blocking_elements[k]+'').style.display!= '') {
				block = true;	
			}
		}
	}
	return block;	
}
// KEYBOARD CONTROLS //
function keyNav(e) {
		if (binding=="right") {
			var keyL = 39; var keyR = 37; 
		} else { 
			var keyL = 37; var keyR = 39;
		}
		if ( (e.keyCode == keyL || e.keyCode == 38) && !RYU.config.block_keynav() ) {
			flip(0);
		}
		if ( (e.keyCode == keyR || e.keyCode == 40) && !RYU.config.block_keynav() ) {
			flip(1);
		}
		if (e.keyCode == 36) { // Home Goes to Front Cover
			flipTo(0);
		}
		if (e.keyCode == 35) { // End goes to back cover
			flipTo(pagecount-1);
		}
		if (e.keyCode == 112 && !e.shiftKey) { // F1 = Open Help
			helpPlay(1);
		}
		if (e.keyCode == 112 && e.shiftKey) { // F1 - Play Help
			helpPlay(1);
			setTimeout('RYU.playHelp(0)',2000);
		}
		if (e.keyCode == 113) { // F2 = TOC
			ctog = 0;
			controlsToggle(0);
			togglePanel(1);
		}
		if (e.keyCode == 114) { // F3 = Views
			ctog = 0;
			controlsToggle(0);
			togglePanel(2);
		}
		if (e.keyCode == 115 && !e.shiftKey) { // F4 = Share
			ctog = 0;
			controlsToggle(0);
			togglePanel(3);
		}
		if (e.keyCode == 115 && e.shiftKey) {
			ctog = 0;
			controlsToggle(0);
			togglePanel(5);
		}
		if ( e.keyCode == 71 && e.ctrlKey) { // CTRL+G = Grid View
			gridBox('grid');
		}
		if ( e.keyCode == 77 && e.ctrlKey) { // CTRL+M = Magazine View
			gridBox('ryuzine');
		}
		if ( e.keyCode == 72 && e.ctrlKey) { // CTRL+H = HTML View
			gridBox('plain');
		}
		if ( e.keyCode == 76 && e.ctrlKey) { // CTRL+L = Linear (Continuous) View
			gridBox('continuous');
		}
		if ( (e.keyCode == 187 || e.keyCode == 107) && e.ctrlKey) { // CTRL+[+] (Font +)
			resizeText(1);
		}
		if ( (e.keyCode == 189 || e.keyCode == 109) && e.ctrlKey) { // CTRL+[-] (Font -)
			resizeText(-1);
		}
		if (e.keyCode == 45 && !e.ctrlKey) { // Insert (add bookmark)
			bookMark();
		}
		if (e.keyCode == 45 && e.ctrlKey) { // CTRL + Insert (open bookmark manager)
			ctog = 0;
			controlsToggle(0);
			togglePanel(4);			
		}
		if (e.keyCode == 46) { // Delete (remove last bookmark)
			unMark();
		}
		if (e.keyCode == 27) { // ESC from Dialogs
			RYU.toggleDialog('all');
		}
}

// CONTROL PANELS ANIMATION //

var panelopen = [];
	panelopen[0] = 0;
	panelopen[1] = 0;
	panelopen[2] = 0;
	panelopen[3] = 0;
	panelopen[4] = 0;
	panelopen[5] = 0;
function togglePanel(n) {
	onRebind(tocscroll);onRebind(optscroll);onRebind(bmarkscroll);
	clearTimeout(upboxtimer);
	clearTimeout(paneltimer);
	clearTimeout(hidecontrols);
	var panels = document.getElementsByClassName('panel');
	if (isNaN(n)) { // if ID is passed find index of ID
		for (var p=0; p < panels.length; p++) {
			console.log('TOGGLE PANEL: panels['+p+'].id='+panels[p].id);
			if (panels[p].id==n) { n = p;}
		}
	}
	if (up_box.style.display!='block' && n!='all') {
		up_box.style.display="block";
		up_box.style.visibility="visible";
		var paneltimer = setTimeout(function(){
			addClass(panels[n],'in');
			removeClass(panels[n],'out');
		},5);
	} else {
		console.log('TOGGLE PANEL: n = '+n);
		if (n=='all' || hasClass(panels[n],'in') ) {
			for (var p=0; p < panels.length; p++) {
				console.log('TOGGLE PANEL: panels['+p+']');
				addClass(panels[p],'out');
				removeClass(panels[p],'in');
			}
			var upboxtimer = setTimeout(function(){up_box.style.display="none";up_box.style.visibility="hidden";},1001);
			hidecontrols = setTimeout('RYU.controlsToggle(0)',2500);
		} else {
			for (var p=0; p < panels.length; p++) {
				addClass(panels[p],'out');
				removeClass(panels[p],'in');
			}
			addClass(panels[n],'in');
			removeClass(panels[n],'out');
		}
	}
};	

function zoomMode() {
	if (document.getElementById('pan').className=="pan_off") {
	document.getElementById('pan').className="pan_on";
	zoomed = 1;
		if (RYU.device.OS=="iOS" && nativeScroll != undefined) {
			for (var a=0; a < pagecount; a++) {
				live[a].style.overflow="hidden";
			}
		}
	} else {
	document.getElementById('pan').className="pan_off";
	zoomed = 0;
		if (RYU.device.OS=="iOS" && nativeScroll != undefined) {
			for (var a=0; a < pagecount; a++) {
				live[a].style.overflow="auto";
			}
		}
	}

}


function swapList(n,panel,pp) {
		n.className="list_down";
		setTimeout(function(){togglePanel(panel);},300);
		setTimeout(function(){n.className="list_up";if(pp==null){} else if (isNaN(pp)) {window.open(''+pp+'','_blank');} else {flipTo(pp);};},1000);
}

function resizeText(multiplier) {
	for (a=0; a<pagecount; a++) { // total number of pages +1
		var adjText = document.getElementById('live'+a);
  		if (adjText.style.fontSize == "") {adjText.style.fontSize = "1.0em";}
		adjText.style.fontSize = parseFloat(adjText.style.fontSize) + (multiplier * 0.2) + "em";
	}
}

function colorText(opt) {
	if (opt==null) {
		if (color_opt.className == "colorbox_OUT") {
			color_opt.className = "colorbox_IN";
		} else {
			color_opt.className = "colorbox_OUT";
		}
	} else {
	document.getElementById('colortext').href = ""+baseurl+"ryuzine/css/colortext"+opt+".css";
	}
}

function changeView(url) {
	Set_Cookie('view',''+url+'');
	view = url; // Just in case cookies are disabled
	if (url == "ryuzine") {url = viewstyle;}
	// strip flip transforms //
	if (url != viewstyle) {
		// IE9 mistakes style change for onresize event
		// nav=1 corrects internally
		nav = 1;
		altview = 1;
		// prevent momentary scrollbar visibility before iScroll is applied
		if (typeof iScroll != "undefined" && RYU.config.nscroll == 0) {
			sh.style.height = 'auto';
		} else {
			sh.style.height = '';
		}
		for (var i=0; i < iscrollers.length; i++) {
				if (iscrollers[i][0] == 'binder' && iscrollers[i][1] != null) {
					onRebind(iscrollers[i][1]);
				}
		}
		for (a=0; a<pagecount; a++) {
			for (var i=0; i < iscrollers.length; i++) {
				if (iscrollers[i][0] == 'page'+a && iscrollers[i][1] != null) {
					iscrollers[i][1].destroy();
					iscrollers[i][1] = null;
				}
			}
			column[a].setAttribute('style',''); // Nuke any element styles
			column[a].style.display="block";
			// Remove Event Listeners not used in other views //
			if ('ontouchstart' in document.documentElement) {
			} else {
			}
			// If Grid View we need to attach flipTo listeners to thumbnails //
			if (url == "grid") {
				shadow[a].style.display="block";	// has to be in pageflow to get event listeners!
				if (typeof IScroll != "undefined") {
					shadow[a].addEventListener('tap',RYU.clickthumb[a]=function(x){return function(){RYU.tapCheck(this,0,0,x)}}(a), false);
				} else {
					shadow[a].addEventListener(iUp,RYU.clickthumb[a]=function(x){return function(){RYU.tapCheck(this,0,0,x)}}(a), false);
				}
			}

			page[a].setAttribute('style',''); // Nuke element level styles
			page[a].style[cssTransform]="scaleX(1)"; // IE9 req explicit value
			page[a].style.visibility="visible";		 // FF3.x req explicit value
			folio[a].setAttribute('style',''); // Nuke
			folio[a].style[cssTransform]="scaleX(1)";
			folio[a].style.visibility="visible";
			live[a].style.height="auto";
		}
		if (url=="grid" && pgsize == 1) { url = "grid_tall" };
		document.getElementById('screen_format').href = ""+baseurl+"ryuzine/css/"+url+".css";
		if (url == "plain") {
			document.getElementById('this_issue').href = ""+baseurl+"ryuzine/css/blank.css";
		}
		else {
			document.getElementById('this_issue').href = ""+baseurl+"css/"+mystyles+".css";
		}
		if (RYU.config.depthfx_depth==1) {
			pagecurves = 1;
			toggleOptSwitch('depthfx_depth',0);
		}
		setTimeout(function(){iScrollApply(document.getElementById('binder'),document.getElementById('binder'),'sheet');},50);
		console.log('SHEET HEIGHT: '+sh.offsetHeight);
	}
	else {
		nav = 0; altview = 0;
		sh.style.height = '';
		sh.style.overflow = 'hidden';
		// Add Event Handlers Back
		for (a=0; a<pagecount; a++) {
				if (a===current || a===current-1 || a===current+1) {
					column[a].style.display="block";
				} else {
					column[a].style.display="none";
				}
			iScrollApply(page[a],live[a]);
			// If previous view was Grid we need to remove flipTo event listeners from thumbnails //
				if (RYU.clickthumb[a] != null && RYU.clickthumb[a] != "undefined") {
					shadow[a].removeEventListener(eDown,RYU.clickthumb[a],false);
					// if page shadows was turned off we need to hide them again too
					if (RYU.config.pageshadows==0) {shadow[a].style.display="none";}
				}
		}
		document.getElementById('screen_format').href = ""+baseurl+"ryuzine/css/"+url+".css";
		document.getElementById('this_issue').href = ""+baseurl+"css/"+mystyles+".css";
		if (pagecurves==1) {
			if (RYU.config.depthfx_depth==0) {
				toggleOptSwitch('depthfx_depth',1);
			}
		}
		// nuke sheet iScroller
		for (var i=0; i < iscrollers.length; i++) {
			if (iscrollers[i][0]=='binder' && iscrollers[i][1]!=null) {
				iscrollers[i][1].destroy();
				iscrollers[i][1] = null;
			}
		}
		sh.setAttribute('style','');
		setTimeout(function(){bookBinder();},2000); //FF4 needs delay or it chokes
	}
}
// New Guided Help Stuff //

function writeHelp() {
	if ('ontouchstart' in document.documentElement && RYU.device.OS != "webOS" ) {
	var action = 'ontouchstart';
		if (RYU.config.zoompan==0) {
		RYU.config.card[12][2] = "RYU.guidedHelp(14);RYU.togglePanel('bmark_panel');";
		RYU.config.card[13][2] = "";
		RYU.config.card[14][1] = "RYU.guidedHelp(12);";		
		}
	} else {
	var action = 'onmousedown';
		RYU.config.card[12][2] = "RYU.guidedHelp(14);RYU.togglePanel('bmark_panel');";
		RYU.config.card[13][2] = "";
		RYU.config.card[14][1] = "RYU.guidedHelp(12);";
	}
	var myCard = document.getElementById('help_box');
	var cardEl = "";
	if (RYU.config.pgslider==1) {
		RYU.config.card[3][2] = "RYU.guidedHelp(4);";
		RYU.config.card[4][1] = "RYU.guidedHelp(3);";
		RYU.config.card[4][2] = "RYU.guidedHelp(5);";
		RYU.config.card[5][1] = "RYU.guidedHelp(4);";		
	}
	W = window.innerWidth;
	if (W>=480) {
		if (RYU.config.pgslider==0) {
		RYU.config.card[2][2] = "RYU.guidedHelp(4);RYU.controlsToggle(0);RYU.togglePanel('toc_panel');";
		RYU.config.card[4][1] = "RYU.guidedHelp(2);RYU.togglePanel('toc_panel');";
		} else {
		RYU.config.card[2][2] = "RYU.guidedHelp(4);RYU.controlsToggle(0);";
		RYU.config.card[4][1] = "RYU.guidedHelp(2);";
		}	
		RYU.config.card[3][2] = "";		
	} else {
		RYU.config.card[1][2] = "RYU.guidedHelp(3);";
		RYU.config.card[2][2] = "";
		RYU.config.card[3][1] = "RYU.guidedHelp(1);";
	}
	for (var q=0; q<card.length; q++) {
		cardEl = cardEl + '<div id="card'+q+'" class="help_card">\n'+
			'<p class="l10n">'+card[q][0]+'</p>\n'+
			'<div class="help_buttons">\n';
			if (q==0) {
			cardEl = cardEl+'<div class="left" '+action+'="'+card[q][1]+'">X</div>\n'+
			'<div class="right l10n" '+action+'="'+card[q][2]+'">Next</div>\n'+
			'<div class="playall l10n"'+action+'="RYU.playHelp(0);">Play All</div>\n';
			} else if (q==(card.length-1)) {
			cardEl = cardEl+'<div class="left" '+action+'="'+card[q][1]+'">&lt;</div>\n'+
			'<div class="right" '+action+'="'+card[q][2]+'">X</div>\n';
			} else {
			cardEl = cardEl+'<div class="left" '+action+'="'+card[q][1]+'">&lt;</div>\n'+
			'<div class="right" '+action+'="'+card[q][2]+'">&gt;</div>\n';
			}
		cardEl = cardEl+'</div>\n</div>';
	}
	myCard.innerHTML = cardEl;
}

	function helpPlay(a) {
		RYU.togglePanel('opt_panel');	// we now have to close this when help play starts
		if (a==1) {
			if (document.getElementById('controlbox0').className=='navbars_hide') {RYU.controlsToggle(1);};
			document.getElementById('helper').style.display="block";
			setTimeout(function(){document.getElementById('helper').className="helper_on card0";},100);
		} else {
			if (document.getElementById('controlbox0').className=='navbars_hide') {RYU.controlsToggle(1);};
			if (document.getElementById('controlset0').className!='controlset control_in') {
				document.getElementById('controlset0').className ='controlset control_in';
				document.getElementById('controlset1').className ='controlset control_deck';
				document.getElementById('controlset2').className ='controlset control_deck';
			}
			document.getElementById('helper').className="helper_off";
			setTimeout(function(){document.getElementById('helper').style.display="none"},1200);
		}
	}
	function guidedHelp(s,rw) {
		if (rw==1) {
			writeHelp();
		} else {
			document.getElementById('helper').className="helper_on card"+s+"";
		}
	}
	// Automatic Play All Method //
	function playHelp(c) {
		if (c==0) { var delay = 0;} else { var delay = 5000;};
		var adj_delay = delay;
		if (c < card.length) {
			if(card[c][2] != "") {
				guidedHelp(c);
				setTimeout(""+card[c][2]+"",delay);
				adj_delay = delay;
			} else {
				adj_delay = 0;
			}
			c = c + 1;
			setTimeout(function(){playHelp(c);},adj_delay);
		} else { c = null; }
	}
		
	
// End New Guided Help Stuff //

function controlSlide(s,n,d) { // Used for Sliding/Scrolling Controls //
		if (s==0) { s = "nav"; } else { s = "control" };
		if (d>0) {
			document.getElementById(s+'set'+(n+1)).className = s+"set "+s+"_deck";
			document.getElementById(s+'set'+n+'').className= s+"set "+s+"_in";
		} else {
			document.getElementById(s+'set'+n+'').className = s+"set "+s+"_in";
			if (n>0) {
			document.getElementById(s+'set'+(n-1)).className = s+"set "+s+"_out";
			}
		}
}


function controlsDelay(c) {
	clearTimeout( hidecontrols );
	hidecontrols = setTimeout('RYU.controlsToggle('+c+')',500);
}

function controlsToggle(c) {
// This is by Control Pairs Numbered by NAVBARS //
	if (RYU.config.autohide == 1 || c == 1) {
		if (ctog==1) {
			document.getElementById('controlbox0').className="navbars_hide";
			document.getElementById('controlbox1').className="tabbars_hide";
			document.getElementById('controltoggle').className="button down";
			document.getElementById('binder').className="binder_unshift";
			ctog = 0;
		} else {
			document.getElementById('controlbox0').className="navbars_show";
			document.getElementById('controlbox1').className="tabbars_show";
			document.getElementById('controltoggle').className="button up";
			document.getElementById('binder').className="binder_shift";
			ctog = 1;
		}
	}
}

function bannerAd() {
	if (adbox==1) {
		document.getElementById('appbanner').className="appbanner_up";
		adbox = 0;
	} else {
		document.getElementById('appbanner').className="appbanner_dn";
		adbox = 1;
	}
	if (RYU.config.appbanner==0) {
		clearInterval( showad );
	}
}

function bannerClear() {
	adbox = 1;bannerAd(); // Hide banner immediately
	clearInterval( showad ); // Clear previous timer
	if (!isNaN(RYU.config.appbanner) && RYU.config.appbanner != 0) {
		showad=setInterval(function(){bannerAd();},RYU.config.appbanner*1000); // Reset Timer	
	} else {
		clearInterval( showad );
	}
}

function shadowToggle(s) {
	if (s!=null) { RYU.config.pageshadows = s;}
	if (RYU.config.pageshadows == 0) {
		var sw = "none";
		document.getElementById('opt_pageshadows').className="opt-switch opt-off";
		}else{ 
		var sw = "block";
		document.getElementById('opt_pageshadows').className="opt-switch opt-on";
		}
		for (var x=0; x<pagecount; x++) {
			document.getElementById('shadow'+x+'').style.display=sw;
		}
}
function dynTheme() {
	if (RYU.device.OS=="Android") {
		var theme = andTheme;
	} else if ( RYU.device.OS == "iOS" ) {
		var theme = iOSTheme;
	} else if ( RYU.device.OS == "BlackBerryOS" ) {
		var theme = bbtTheme;
	} else if ( RYU.device.OS == "Windows Phone 7" ) {
		var theme = wp7Theme;
	} else if ( RYU.device.Platform == "IE" && RYU.device.metro == 1 ) {
		if (w8mTheme != "") {
			var theme = w8mTheme;
		} else {
			if (winTheme[0] != "") {
				var theme = winTheme;
			} else {
				var theme = deskTheme;
			}
		}
	} else {
		if (RYU.device.OS == "Windows" && winTheme != "") {
			var theme = winTheme;
		} else if (RYU.device.OS == "Mac" && macTheme != "") {
			var theme = macTheme;
		} else if (RYU.device.OS == "Linux" && nixTheme != "") {
			var theme = nixTheme;
		} else {
			var theme = deskTheme;
		}
	}
	return theme;
}


function themeToggle(t) {
	if (t!=null) { RYU.config.themeset = t; }
	if (RYU.config.themeset==1) {
		// If auto swapping themes need to sniff browser (ugh!) //
		if (swapThemes != 0 ) {
			var theme = dynTheme();
			if (theme=="" || theme == null) {
				// there should always be a defaultTheme
				var themepath = defaultTheme;
			} else {
				var themepath = ""+baseurl+"ryuzine/theme/"+theme+"/theme.css";
			}
			document.getElementById('ui_theme').href=themepath;
		} else {
				document.getElementById('ui_theme').href=defaultTheme;
		}
		document.getElementById('opt_themeset').className="opt-switch opt-on";
	} else {
		if (document.getElementById('ui_theme') != null) {
			document.getElementById('ui_theme').href=defaultTheme;
		}
		document.getElementById('opt_themeset').className="opt-switch opt-off";
	}
	// make sure theme is applied/removed before checking appbanner and tocslider parentage
	if (RYU.config.themeset!=0) { var checkval = 2; } else { var checkval = 1; }
	var reflow = window.setInterval(function() {
		if (document.getElementById('tcheck').clientWidth==checkval) {
    		pgslideParent();
    		window.clearInterval(reflow);
    	}
    },30);
    // if theme file did not load do not spin forever
    setTimeout(function(){pgslideParent();window.clearInterval(reflow)},2000);
}

function aniToggle(a) {
	if (a!=null) { RYU.config.animate=a;}
	if (RYU.config.animate==0) {
	document.getElementById('opt_animate').className="opt-switch opt-off";
	document.getElementById('opt_css3d_label').parentNode.className="opt-disabled";
	document.getElementById('opt_pageshadows_label').parentNode.className="opt-disabled";
	} else {
	document.getElementById('opt_animate').className="opt-switch opt-on";
	document.getElementById('opt_pageshadows_label').parentNode.className = "";
	document.getElementById('opt_css3d_label').parentNode.className = "";
	}
}

function pgslideParent() {
	// if a theme swaps the positions of the tabbar and navbar this will move the tocslider too //
	if (document.getElementById('controlbox1').offsetTop<=0) {
		if (document.getElementById('tocslider').parentNode.id=='controlbox1') {
			document.getElementById('controlbox0').appendChild(document.getElementById('tocslider'));
		}
		if (document.getElementById('appbanner').parentNode.id=='controlbox0') {
			document.getElementById('controlbox1').insertBefore(document.getElementById('appbanner'),document.getElementById('controlbox1').firstChild);
		}
	} else {
		if (document.getElementById('tocslider').parentNode.id=='controlbox0') {
			document.getElementById('controlbox1').insertBefore(document.getElementById('tocslider'),document.getElementById('controlbox1').firstChild);	
		}
		if (document.getElementById('appbanner').parentNode.id=='controlbox1') {
			document.getElementById('controlbox0').insertBefore(document.getElementById('appbanner'),document.getElementById('controlbox0').firstChild);
		}
	}	
}

function pgslideToggle() {
	if (document.getElementById('tocslider').className=='tocsliderOUT') {
		document.getElementById('tocslider').className ='tocsliderIN';
	} else {
		document.getElementById('tocslider').className ='tocsliderOUT';
	}
}

function sliderToggle(a) {
	if (a!=null) { RYU.config.pgslider = a;}
	if (RYU.config.pgslider==0) {
		document.getElementById('opt_pgslider').className="opt-switch opt-off";
		document.getElementById('tocslider').className = "tocsliderOUT";
		document.getElementById('slidetoggle').style.display = "none";
		document.getElementById('tocbutton').style.display = "block";
		controlsToggle(0);
	} else {
		document.getElementById('opt_pgslider').className="opt-switch opt-on";
		document.getElementById('slidetoggle').style.display = "block";
		document.getElementById('tocbutton').style.display = "none";
		controlsToggle(1);
		pgslideToggle();
	}
}

function css3dToggle(a) {
	if (a!=null) { RYU.config.css3d = a;}
	if (RYU.config.css3d==0) {
		document.getElementById('opt_css3d').className="opt-switch opt-off";
	} else {
		document.getElementById('opt_css3d').className="opt-switch opt-on";
	}
}

function autohideToggle(a) {
	if (a!=null) { RYU.config.autohide = a; }
	if (RYU.config.autohide==0) {
		document.getElementById('opt_autohide').className="opt-switch opt-off";
	} else {
		document.getElementById('opt_autohide').className="opt-switch opt-on";
	}
}

function scrollToggle(a) {
	if (a!=null) { RYU.config.nscroll = a; }
	if (RYU.config.nscroll==0) {
		document.getElementById('opt_nscroll').className="opt-switch opt-off";
	} else {
		document.getElementById('opt_nscroll').className="opt-switch opt-on";
	}
	if (altview==1) {if (!Get_Cookie("view")) {changeView(view);} else {changeView(''+Get_Cookie("view")+'');}}
	setTimeout(function(){bookBinder();},1000);
}

function iScrollToggle(a) {
	var listener = eDown;
	if (a!=null) { RYU.config.iscroll_iscroll = a; }
	if (RYU.config.iscroll_iscroll==0) {
		console.log('Destroy all iScrollers!');
		// Destroy all iScroll scrollers!
			if (typeof iScroll != "undefined") {
				scrollHolder = iScroll; // store iScroll somewhere else
				iScroll = undefined; 
				if (typeof IScroll != "undefined") {
					IScroll = undefined;
					eDown = iDown;
				};
			}
	} else {
		console.log('Turn on iScrollers if you can');
		if (typeof iScroll == "undefined" && scrollHolder != undefined) {
			if ("IScroll" in window) {
				iScroll = IScroll = scrollHolder;
				eDown = "tap";
				scrollHolder = undefined;
			} else {
				iScroll = scrollHolder; // restore iScroll from backup if possible
				scrollHolder = undefined;
			}
		}
	}
	if (altview==1) {if (!Get_Cookie("view")) {changeView(view);} else {changeView(''+Get_Cookie("view")+'');}}
	console.log('ISCROLL SWITCH: run bookBinder() in 1s');
	setTimeout(function(){bookBinder();},1000);
}

function zoomToggle(z) {
	if (z!=null) { RYU.config.zoompan = z; }
	if ('ontouchstart' in document.documentElement || RYU.device.appName == "Firefox Mobile" || RYU.device.OS == "Windows Phone 7" ) {
		// First FireFox Fennec releases and IEMobile have no support for touchstart //
		if (RYU.config.zoompan == 1) {
			if (RYU.device.OS=="Windows Phone 7") {
				var scr = "width=device-width,height=device-height,";
			} else {
				var scr = "";
				body.removeEventListener('touchstart',RYU.defaultPrevention(),false);
				body.addEventListener('touchstart',RYU.restoreDefault(),false);
			}
		document.getElementById('zoom').style.display="block";
		if (!document.getElementById('zooming')) {  // Old IE should never do this anyway so setAttribute should be ok */
			var metazoom = document.createElement('meta');
			metazoom.setAttribute('name','viewport');
			metazoom.setAttribute("content",""+scr+"initial-scale=1.0,minimum-scale=1.0,maximum-scale="+maxzoom+",user-scalable=yes");
			metazoom.setAttribute('id','zooming');
			document.getElementsByTagName('head')[0].appendChild(metazoom);
		} else {
			document.getElementsByTagName('head')[0].removeChild(document.getElementById('zooming'));
			var metazoom = document.createElement('meta');
			metazoom.setAttribute('name','viewport');
			metazoom.setAttribute("content",""+scr+"initial-scale=1.0,minimum-scale=1.0,maximum-scale="+maxzoom+",user-scalable=yes");
			metazoom.setAttribute('id','zooming');
			document.getElementsByTagName('head')[0].appendChild(metazoom);
		}			
		document.getElementById('opt_zoompan').className="opt-switch opt-on";
		document.getElementById('opt_nscroll_label').parentNode.className="";
		}else{
			if (RYU.device.Platform=="WP7") {
				var scr = "width=device-width,height=device-height,";
			} else {
				var scr = "";			
				body.addEventListener('touchstart',RYU.defaultPrevention());
			}
		document.getElementById('zoom').style.display="none";
		if (!document.getElementById('zooming')) {
			var metazoom = document.createElement('meta');
			metazoom.setAttribute('name','viewport');
			metazoom.setAttribute("content",""+scr+"initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no");
			metazoom.setAttribute('id','zooming');
			document.getElementsByTagName('head')[0].appendChild(metazoom);
		} else {
			document.getElementsByTagName('head')[0].removeChild(document.getElementById('zooming'));
			var metazoom = document.createElement('meta');
			metazoom.setAttribute('name','viewport');
			metazoom.setAttribute("content",""+scr+"initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no");
			metazoom.setAttribute('id','zooming');
			document.getElementsByTagName('head')[0].appendChild(metazoom);

		}	
		document.getElementById('opt_zoompan').className="opt-switch opt-off";
		document.getElementById('opt_nscroll_label').parentNode.className="opt-disabled";
		if (RYU.config.nscroll==1) { RYU.config.nscroll=0;scrollToggle(0);};
		}

	}			
}

function getBookmarksList() {
	readBookMarks();
	mylist = "";
	if (bookmarks != null) {
		for (var q=0; q < bookmarks; q++) {
			thismark = bookmarkList[q];
			thismark = thismark.split("#",2);
			thismark = thismark[1];
			if (simulated==true) {var ahref="javascript:";}else{ var ahref="#"+thismark;}
			mylist = mylist + '<li class="list_up"><a href="'+ahref+'">'+_lc("Page")+' '+thismark+'</a>  </li><div class="button type2 right"><p><span class="symbol"></span><span class="label l10n">Delete</span></p></div>';
		}
	}
	for (var q=0; q < bmarkData.length; q++) {
		mylist = mylist+'<li class="list_up"><a href="javascript:">'+unescape(bmarkData[q][0])+'</a></li><div></div>';

	}
	document.getElementById('mybookmarks').innerHTML=mylist;
	var mark_count = document.getElementById('mybookmarks').getElementsByTagName('li').length; 
	// Now attach event listeners //
	for (var q=0; q < mark_count; q++) {
		if (q < (mark_count-bmarkData.length) ) {
			var link = bookmarkList[q];
				link = link.split("#",2);
				link = link[1];
		} else {
			var b = (-1*(mark_count-bmarkData.length-q));
			var link = bmarkData[b][1];
		}
		if ('ontouchend' in document.documentElement && RYU.device.OS != "webOS" ) {
			if (typeof IScroll != "undefined") { // iScroll v5 tap check method
				document.getElementById('mybookmarks').getElementsByTagName('li')[q].addEventListener('tap',function(x){return function(){RYU.swapList(this,0,x);}}(link),false);
				document.getElementById('mybookmarks').getElementsByTagName('div')[q].addEventListener('tap',function(x){return function(){RYU.unMark(x)};}(q),false);
			} else {
				document.getElementById('mybookmarks').getElementsByTagName('li')[q].addEventListener('touchend',function(x){return function(){RYU.tapCheck(this,0,x);}}(link),false);
				document.getElementById('mybookmarks').getElementsByTagName('div')[q].addEventListener('touchend',function(x){return function(){RYU.unMark(x)};}(q),false);			
			}
		} else {
			if (typeof iScroll == "undefined") {
				document.getElementById('mybookmarks').getElementsByTagName('li')[q].addEventListener('mouseup',function(x){return function(){RYU.tapCheck(this,0,x);}}(link),false);
				document.getElementById('mybookmarks').getElementsByTagName('div')[q].addEventListener('mouseup',function(x){return function(){RYU.unMark(x)};}(q),false);			
			} else {
				if (RYU.device.Platform == "Firefox" || RYU.device.Platform == "IE") { // Prevent iScroll Hover misfires in Firefox
					document.getElementById('mybookmarks').getElementsByTagName('li')[q].addEventListener('click',function(x){return function(){RYU.tapCheck(this,0,x);}}(link),false);
					document.getElementById('mybookmarks').getElementsByTagName('div')[q].addEventListener('click',function(x){return function(){RYU.unMark(x)};}(q),false);			
				}
				if (typeof IScroll != "undefined") {	// if it is iScroll v5 use tap detect
					document.getElementById('mybookmarks').getElementsByTagName('li')[q].addEventListener('tap',function(x){return function(){RYU.swapList(this,0,x);}}(link),false);
					document.getElementById('mybookmarks').getElementsByTagName('div')[q].addEventListener('tap',function(x){return function(){RYU.unMark(x)};}(q),false);			
				} else {
					document.getElementById('mybookmarks').getElementsByTagName('li')[q].addEventListener('mouseup',function(x){return function(){RYU.tapCheck(this,0,x);}}(link),false);
					document.getElementById('mybookmarks').getElementsByTagName('div')[q].addEventListener('mouseup',function(x){return function(){RYU.unMark(x)};}(q),false);			
				}
			}		
		}
	}
}


function readBookMarks() {
	// This should copy any stored bookmarks into a local variable //
	if (!Get_Cookie("bookmarks")) { 
		bookmarks = null;
	} else {
		bookmarks = Get_Cookie("bookmarks");
		for (var q=0; q < bookmarks; q++) {
			bookmarkList[q] = Get_Cookie("bookmarkList["+q+"]");
		}
	}
}

function writeBookMarks() {
	// Get rid of any existing cookie //
	Delete_Cookie("bookmarks");
	for (var q=0; q < bookmarks; q++) {
		Delete_Cookie("bookmarkList["+q+"]");
	}
	// update and write new array //
	bookmarks = bookmarkList.length;
	Set_Cookie("bookmarks",bookmarks);
	for (var q=0; q < bookmarks; q++) {
		// Build list of new values //
		Set_Cookie("bookmarkList["+q+"]",""+bookmarkList[q]+"");
	}
	getBookmarksList();
}


function bookMark() {
	var ask = confirm(RYU._lc("Add Bookmark for Page")+' '+current+'?');
	if (ask == true) {
		bookmarks = bookmarkList.length;
		bookmarkList[bookmarks] = ""+window.location.href.split("#",1)+""+"#"+current;
		writeBookMarks();
		onRebind(bmarkscroll);
	}
}

function removeMarkfromIndex(arr,m) {
	arr.splice(m,1);
}

function unMark(m) {
	if (m == null) {
		if (bookmarkList.length > 0) {
			m = bookmarkList.length-1;
		} else {
			alert(RYU._lc("Bookmark list is empty"));
		}
	} 
	if (m != null) {
		var	thismark = bookmarkList[m];
			thismark = thismark.split("#",2);
			thismark = thismark[1];
		var ask = confirm(RYU._lc("Confirm Bookmark Deletion for Page")+' '+thismark+'?');
		if (ask == true) {
			removeMarkfromIndex(bookmarkList,m);
			writeBookMarks();
			onRebind(bmarkscroll);
		}
	}
}

// Cookie Functions //
var today = new Date();
var zero_date = new Date(0,0,0);
today.setTime(today.getTime() - zero_date.getTime());

var todays_date = new Date(today.getYear()+1,today.getMonth(),today.getDate(),0,0,0);
var expires_date = new Date(todays_date.getTime() + (8 * 7 * 86400000));

function Get_Cookie(name) {
    var start = document.cookie.indexOf(name+"=");
    var len = start+name.length+1;
    if ((!start) && (name != document.cookie.substring(0,name.length))) return null;
    if (start == -1) return null;
    var end = document.cookie.indexOf(";",len);
    if (end == -1) end = document.cookie.length;
    return unescape(document.cookie.substring(len,end));
}

function Set_Cookie(name,value,expires,path,domain,secure) {
    expires="Sun, 01-Jan-2040 00:00:01 GMT";
    document.cookie = name + "=" +escape(value) +
        ( (expires) ? ";expires=" + expires : "") +
        ( (path) ? ";path=" + path : "") + 
        ( (domain) ? ";domain=" + domain : "") +
        ( (secure) ? ";secure" : "");
}

function Delete_Cookie(name,path,domain) {
    if (Get_Cookie(name)) document.cookie = name + "=" +
       ( (path) ? ";path=" + path : "") +
       ( (domain) ? ";domain=" + domain : "") +
       ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}



function storeMasterCookie() {
    if (!Get_Cookie('MasterCookie'))
        Set_Cookie('MasterCookie','MasterCookie');
}

function storeIntelligentCookie(name,value) {
    if (Get_Cookie('MasterCookie')) {
        var IntelligentCookie = Get_Cookie(name);
        if ((!IntelligentCookie) || (IntelligentCookie != value)) {
            Set_Cookie(name,value,expires_date);
            var IntelligentCookie = Get_Cookie(name);
            if ((!IntelligentCookie) || (IntelligentCookie != value))
                Delete_Cookie('MasterCookie');
        }
    }
}

if (RYU.device.OS == "Windows Phone 7" && RYU.device.bv >= 9 ) { // WP7 needs this to exist before flowing page //
// Note: Conditional Comments did not work for this! //
	document.write('<meta name="viewport" id="zooming" content="width=device-width,height=device-height,initial-scale=1.0,minimum-scale=1.0,maximum-scale=10.0,user-scalable=yes" />');
}


function slideFlip() {
	flipTo(slidePg);
}

function slideSync(p) {
	document.getElementById('tocslider_button').style.left=pageStop[p]+"px";
	document.getElementById('tocslider_button').getElementsByTagName('p')[0].innerHTML=p;
	document.getElementById('tocslider_track').style[cssBackgroundSize] = ''+pageStop[p]+'px 100%';
	// sync navbar buttons too
	if (binding=="right") {
		if (p==0) {
			next.className="button type1 right firstnav";
		} else {
			if (next.className=="button type1 right firstnav") {
				next.className="button type1 right";
			}
		}
		if (p==pagecount-1) {
			back.className="button type1 left lastnav";
		} else {
			if (back.className=="button type1 left lastnav") {
				back.className="button type1 left";
			}
		}
	} else {
		if (p==0) {
			back.className="button type1 left firstnav";
		} else {
			if (back.className=="button type1 left firstnav") {
				back.className="button type1 left";
			}
		}
		if (p==pagecount-1) {
			next.className="button type1 right lastnav";
		} else {
			if (next.className=="button type1 right lastnav") {
				next.className="button type1 right";
			}
		}
	}
}


// Track Slider Position and Display Correct Image //
function trackPos(slideObj) {
	var posX = slideObj.offsetLeft;
	for (var x=0; x < pagecount+1; x++) {
		if (posX >= pageStop[x] && posX < pageStop[x+1]) {
			slideObj.getElementsByTagName('p')[0].innerHTML = x;
			slidePg = x;
		}
	}
}

// Desktop Browser Slider Control //
function slideStart(event) {
	var el;
	var x, y;
	slideObj = document.getElementById('tocslider_button');
	slideTrx = document.getElementById('tocslider');
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

	function slideGo(event) {
	var curX;
	// GET CURSOR POSITION
	if (window.attachEvent) {
    	curX = window.event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
  	}
  	else if (window.addEventListener) { 
		curX = event.clientX + window.scrollX;			
  	}
	
	var adjL = slideTrx.offsetLeft;
	var adjR = slideTrx.offsetLeft+slideTrx.offsetWidth;

	
	// MOVE DRAG ELEMENT
	if (  curX >= adjL && curX <= adjR ) {
		if (window.attachEvent) {
			slideObj.style.left = (slideObj.elStartLeft + curX - slideObj.cursorStartX) + "px";
			window.event.cancelBubble = true;
    		window.event.returnValue = false;
			}
		else if (window.addEventListener) { 
		slideObj.style.left = (slideObj.elStartLeft + curX - slideObj.cursorStartX) + "px";
			if (slideObj.offsetLeft < 0) { slideObj.style.left = "0px";}
			if (slideObj.offsetLeft > (slideTrx.offsetWidth-slideObj.offsetWidth)) {
				slideObj.style.left = (slideTrx.offsetWidth-slideObj.offsetWidth)+"px";
			}
		event.preventDefault();
		}
		
		trackPos(slideObj);
	}
	}

	function slideStop(event) {
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

// Process Touch Slider Events //
var touchSlideStart = function(e) {
	var n = document.getElementById('tocslider_button');
	var prevX = event.touches[0].pageX;
	n.addEventListener('touchmove',RYU.touchSlideGo, false);
}

var touchSlideGo = function(event){
	var n = document.getElementById('tocslider_button');
	prevX = event.touches[0].pageX;
	event.preventDefault();
    var curX = event.touches[0].pageX;
	if ( (curX < prevX-adjW) ) {
			prevX = curX;
			} 
	else if ( (curX > prevX+adjW) ) {
			prevX = curX;
			} else {};
	event.preventDefault();
	var nPos = curX-document.getElementById('tocslider').offsetLeft-(n.offsetWidth/2);
	n.style.left = nPos + "px";
		trackPos(n);
	touched = 1;
	};

function touchSlideStop() {
document.getElementById('tocslider_button').removeEventListener('touchmove',RYU.touchSlideGo, false);
slideFlip();
}
// Check browser supports core functionality.  This can be redefined/overridden in a polyfill script
var is_supported = function() {
	var support = 1;
	if ( (RYU.device.Platform == "Opera" && RYU.device.bv <= 12 && RYU.device.bv < 15) && document.getElementsByClassName ) {
		var ask = confirm('Your browser has known problems running the Ryuzine webapp.\nWould you prefer to see a plain HTML page instead?');
		if (ask == true) {
			support = 0;
		}
	}
	if ( !Object.prototype || !Object.keys || !Array.isArray || !Array.prototype.indexOf || !document.getElementsByClassName ) {
		alert('Your browser is not compatible with this version of Ryuzine.\nYou will see the plain HTML page without any Ryuzine features.');
			support = 0; 
	}
	if (support == 0) { return false; } else { return true; }
}

	return { // Publicly Expose Variables and Functions
			_lc : _lc,
			baseurl : baseurl,
			device : RYU.device,
			config : RYU.config,
			init_zine : init_zine,
			bookBinder : bookBinder,
			flipTo : flipTo,
			flip : flip,
			bannerAd : bannerAd,
			bannerClear : bannerClear,
			clearSplash : clearSplash,
			resizeText : resizeText,
			colorText : colorText,
			tapCheck : tapCheck,
			scrollIt : scrollIt,
			touchScroll : touchScroll,
			mScrollItOn : mScrollItOn,
			mScrollItOff : mScrollItOff,
			keyNav: keyNav,
			swapList : swapList,
			changeView : changeView,
			clickthumb : clickthumb,
			gridBox : gridBox,
			toggleDialog : toggleDialog,
			hideDialog : hideDialog,
			togglePanel : togglePanel,
			toggleOptSwitch : toggleOptSwitch,
			zoomMode : zoomMode,
			zoomToggle : zoomToggle,
			bookMark : bookMark,
			unMark : unMark,
			getBookmarksList : getBookmarksList,
			defaultPrevention : defaultPrevention,
			preventDefault : preventDefault,
			restoreDefault : restoreDefault,
			enableDefault : enableDefault,
			touchmoveSet : function(v){touchmoveCheck=v;},
			touchmoveCheck : touchmoveCheck,
			
			pgslideToggle : pgslideToggle,
			slideStart : slideStart,
			slideFlip : slideFlip,
			touchSlideStart : touchSlideStart,
			touchSlideStop : touchSlideStop,
			touchSlideGo : touchSlideGo,
			setOptGhostList : setOptGhostList,
			
			hasClass : hasClass,
			addClass : addClass,
			removeClass : removeClass,
			
			is_supported : is_supported,
			
			helpPlay : helpPlay,
			playHelp : playHelp,
			guidedHelp : guidedHelp,
			controlsToggle : controlsToggle,
			controlsDelay : controlsDelay,
			controlSlide : controlSlide,
			shadowToggle : shadowToggle,
			sliderToggle : sliderToggle,
			autohideToggle : autohideToggle,
			themeToggle : themeToggle,
			aniToggle : aniToggle,
			css3dToggle : css3dToggle,
			scrollToggle : scrollToggle,
			iScrollToggle : iScrollToggle,
			iScrollApply : iScrollApply,
			onDemand : onDemand,
			php : php,
			addon : addon,
			iEvent: iEvent,
			init : RYU.reWrite
	}
}();
// Build UI //
window.onload = RYU.reWrite = function() {
// trim polyfill //
if (!String.prototype.trim) {
  (function(){
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function () {
      return this.replace(rtrim, "");
    }
  })();
}
var cssdisabled = false;
function cssCheck() {
	// Even though it is unlikely anyone would have JS but not CSS check anyway //
		cssdisabled = false; // must be proven otherwise
		var testcss = document.createElement('div');
		testcss.style.position = 'absolute';
		document.getElementsByTagName('body')[0].appendChild(testcss);
		if (testcss.currentStyle) var currstyle = testcss.currentStyle['position'];
		else if (window.getComputedStyle) var currstyle = document.defaultView.getComputedStyle(testcss, null).getPropertyValue('position');
		cssdisabled = (currstyle == 'static') ? true : false;
		document.getElementsByTagName('body')[0].removeChild(testcss);
}


	function isEven(value) {
	return (value%2 == 0);
	}
	
	// Change straight quotes to curly and double hyphens to em-dashes.
	function smartQuotes(s) {
	  s = s.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
	  s = s.replace(/'/g, "\u2019");                            // closing singles & apostrophes
	  s = s.replace(/(^|[-\u2014\([\u2018\s])"/g, "$1\u201c"); // opening doubles
	  s = s.replace(/"/g, "\u201d");                            // closing doubles
	  s = s.replace(/--/g, "\u2014");                           // em-dashes
	  return s
	};

	var sourceFile = document;

	var disableUI = 0;
// See if document is being loaded into editor //
if (top === self) { 
	// not in a frame 
	var editor = false;
} else {
	if (window.name=="sourceframe") {
		var editor = true;
	} else {
		var editor = false;
	}
	if (window.name=="preview") {
		var simulated = true;
	} else {
		var simulated = false;
	}
}
// check core functions are supported
if (!RYU.is_supported()) {
	disableUI = 1;
}
if (editor == true || disableUI == 1) {
	// If we are in the editor disable all this stuff //
	document.getElementById('screen_format').href = "css/blank.css";
	if (document.getElementById('lightbox_format')){
		document.getElementById('lightbox_format').href = "css/blank.css";
	}
	document.getElementById('ui_format').href = "css/blank.css";
	if (document.getElementById('ui_theme')) {
		document.getElementById('ui_theme').href = "css/blank.css";
	}
	if (document.getElementById('curves')) {
		document.getElementById('curves').href = "css/blank.css";
	}
	disableUI = 1;
}	

cssCheck();
if (cssdisabled==true) {
	var app_error = sourceFile.createElement('div');
	var app_msg = '<p><strong>App Error:</strong> Stylesheets</span> are disabled!</p><p>You are viewing this as a plain web page.  Enable stylesheet support and reload to view it as a web application.</p>';
	app_error.innerHTML = app_msg;
	sourceFile.getElementById('splashblock').appendChild(app_error);
} else {

if (disableUI == 0) { // and it should!
	// Replace anchor links that point to other pages //
	var anchor = document.getElementsByTagName('a');
	var urhere = window.location.href;urhere=urhere.split("#"); // Split at any anchors
	for (var a=0; a < anchor.length; a++) {
		if (anchor[a].href.match(/#/gi) && (anchor[a].parentNode.className != "new_link" || anchor[a].rel != 'lightbox') ) {
			var ahref = anchor[a].href.split('#');
			if (ahref[0] === urhere[0] && ahref[1].match(/page/gi) ) {
				var pgnum = ahref[1].split('page');
				if (!isNaN(pgnum[1])) {
					anchor[a].href = "javascript:RYU.flipTo("+pgnum[1]+");";
				}
			}
		}
	}

if ( sourceFile.getElementById('summary') ) {
	var desc = sourceFile.getElementById('summary');
	var desc_imgs = desc.getElementsByTagName('img');
	var media = '';	// assume we got nothing
	for (var d=desc_imgs.length-1; d > -1; d--) {
		if (d==0) { media = desc_imgs.src; }	// use first image as media
			desc.removeChild(desc_imgs[d]);	    // remove all images from summary
	}
	// now strip out any soft returns (for now we'll allow other html)
	for (var r=desc.getElementsByTagName('br').length-1; r > -1; r--) {
		desc.removeChild(desc.getElementsByTagName('br')[r]);
	}
	desc = escape(desc.innerHTML.replace(/\"/gi,"'").replace(/&nbsp;/gi,'').trim());
} else {
	var media = '';
	var desc = 'A Ryuzine webapp publication';
}

if ( sourceFile.getElementById('offline') ) {	// Favor ID if available
	var offLine = sourceFile.getElementById('offline').innerHTML;
} else { var offLine = "no"; }	// Assume no offline is set
// Error catch empties //
if (offLine == "" || offLine == null || offLine == undefined) {
	offLine = "no";
}

if (sourceFile.getElementById('splash_screen')) { // Look for ID version
	var splashScreen = sourceFile.getElementById('splash_screen').innerHTML;
} else {
	var splashScreen = "";
}
splashScreen=splashScreen.replace(/^\s+|\s+$/gm,'');

var imgCheck = '';
if (sourceFile.getElementById('splash_title')) {
	var sourceTitle = sourceFile.getElementById('splash_title');
	if (sourceTitle.getElementsByTagName('img').length > 0) {
		imgCheck = sourceTitle.getElementsByTagName('img')[0].src;
	}
	var splashTitle = escape(sourceTitle.innerHTML);
	sourceFile.getElementById('splash_title').parentNode.removeChild(sourceFile.getElementById('splash_title'));
} else if (sourceFile.getElementsByTagName('title').length > 0 ) { // Use whatever is in the title tag (if anything)
	var splashTitle = escape(sourceFile.getElementsByTagName('title')[0].innerHTML);
} else {
	var splashTitle = "";
} 
// Now replace quotes and dashes with smart quotes and emdashes to prevent JS errors //
splashTitle = smartQuotes(splashTitle);
if (splashTitle == "" || imgCheck != '') { // splashTitle is either empty or has an image in it
	if (sourceFile.getElementsByTagName('title').length > 0) {
		var footerTitle = escape(sourceFile.getElementsByTagName('title')[0].innerHTML);
		footerTitle = smartQuotes(footerTitle);
	} else {
		var footerTitle = "Ryuzine";
	}
} else {
	var footerTitle = splashTitle;
}

if (sourceFile.getElementById('app_logo')) {	// there is an app logo element
	if (sourceFile.getElementById('app_logo').getElementsByTagName('img').length > 0) {
		// there is an app logo image, take only the first one you find though
		var applogo = '<img src="'+sourceFile.getElementById('app_logo').getElementsByTagName('img')[0].src+'" id="app_logo" alt="'+footerTitle+'"/>'; 
	} else {
		var applogo = '';	// nothing useable, no app logo
	}
} else if (imgCheck != '') { 	// there is no app_logo element, but the splash title is an image so let's use that!
	var applogo = '<img src="'+imgCheck+'" id="app_logo" alt="'+footerTitle+'"/>';
} else {
	var applogo = '';	// all I got was a rock. :/
}
var customWidget = 0;
var socialWidget = null;

 if (sourceFile.getElementById('social_widget')) {
		socialWidget = sourceFile.getElementById('social_widget').innerHTML;
		if (socialWidget.length > 0) {
			customWidget = 1;
		} else {
			customWidget = 0;
		}		
	} else {
		customWidget = 0;
	}
if (offLine != "no") { var shareLink = offLine; } else { var shareLink = window.location; }
	
if (sourceFile.getElementById('copy_right')) {
	var copyRight = sourceFile.getElementById('copy_right').innerHTML;
} else { copyRight = ""; }

if (sourceFile.getElementById('appbanner')) {
	var appbanner_html = sourceFile.getElementById('appbanner').innerHTML;
} else { 
	var appbanner_html = "";
}; // Ensures if none is set you don't see "undefined" //
if (appbanner_html.trim() == "") {
	RYU.config.appbanner = 0;	// prevents empty bannerad from showing if appbanner is set
} else {
	appbanner_html = appbanner_html+'\n<p class="xbox"><span class="l10n">Advertisement</span> <span><span class="l10n">Close</span> [X]</span></p></div>';
}

if (sourceFile.getElementById('boxad')) {
	var boxad_html = sourceFile.getElementById('boxad').innerHTML;
} else {
	var boxad_html = "";
}

// We need to preserve any lightboxes for addons
var lightBoxes = sourceFile.getElementsByClassName('light_boxed');


if (sourceFile.getElementById('welcome_sign')) {
	var welcomeSign = sourceFile.getElementById('welcome_sign').innerHTML;
} else { var welcomeSign = ""; }

var sectionHeads = sourceFile.getElementsByClassName('section_head');
var sectionHead = [];
	for (var x=0; x<sectionHeads.length; x++) {
		sectionHead[x] = sectionHeads[x].innerHTML;
		if (sectionHead[x] == '' || sectionHead[x] == null) {
			if (x==0) { var secTitle = 'Front Cover';} 
			else if (x==sectionHeads.length-1) { var secTitle = 'Back Cover';}
			else {var secTitle = 'Page '+x;}
			sectionHead[x] = secTitle;
		}
	}

var pageBoxes = sourceFile.getElementsByClassName('page_box');
if (!isEven(pageBoxes.length)) {
	// Number of Pages HAS to be even //
	var pagecount = pageBoxes.length+1;
	sectionHeads = sectionHeads.length+1;
	} else {
	var pagecount = pageBoxes.length;
	sectionHeads = sectionHeads.length;
	}
var pageBox = [];
var pageBoxColumns = [];
	for (var x=0; x<pagecount; x++) {
		if (pageBoxes[x]==undefined) {
		// If a page needed insertion put a message that it is blank intentionally //
		sectionHead[x] = 'Page '+x;
		pageBox[x] = '<p>This Page Was Intentionally Left Blank</p>';
		pageBoxColumns[x] = "col1";
		} else {
			pageBox[x] = pageBoxes[x].innerHTML;
			// Find the columns for this page //
			if (pageBoxes[x].className.length > 8 ) { 	// look for colsx class
				var findcount = pageBoxes[x].className.split(" ");
				pageBoxColumns[x] = findcount[1]; //set Target to number indicated
			}
			else {
				pageBoxColumns[x] = "col1";
			}
		}
	}

if (sourceFile.getElementById('exit_sign')) {
	var exitSign = sourceFile.getElementById('exit_sign').innerHTML;
} else { var exitSign = ""; }

var splashbox_dom = document.createElement('div');
	splashbox_dom.setAttribute('id','splash');
	splashbox_dom.className = 'splash_in';
if (splashScreen != "") {
	var splash_html = '<p id="skipad" class="l10n" onclick="RYU.clearSplash(0);">Skip Ad</p>'+splashScreen;
} else {
	var splash_html = '<div id="splashblock">\n'+
'<p class="splash-title">'+unescape(splashTitle)+'</p>\n'+
'<p class="splash-port">ryuzine<span>&trade;</span></p>\n'+
'</div>\n'+
'<p class="splash-fineprint">'+copyRight+'</p>\n';
}
splashbox_dom.innerHTML = '<div id="splashcell">'+splash_html+'</div>';

// Now manipulate the actual document
var binder_dom = document.createElement('div');
binder_dom.setAttribute('id','binder');
binder_dom.className = "binder_shift";
// Build Welcome Sign //
var binder_html = '<div id="sheet"><div id="gridbox" class="grid_in">\n<div id="plankL" class="plank left">'+welcomeSign+'</div>\n';

// Build All the Pages //
for (var x=0; x<pagecount; x++) {
	var zDex = ''; // Cover needs z-index applied inline to hide page shuffling
	var bmark = '<div class="bmark"></div>';
	var pageXtra='';
	var folioXtra='';
	if (isEven(x)) {var impose="recto"; var shift="shift";} else {var impose="verso";var shift="";}
	if (x==0) {
		folioXtra='covercorners-front';
		zDex='style="z-index:'+pagecount+';"';
		bmark='';
	} else if (x==pagecount-1) {
		folioXtra='covercorners-back';
		bmark='';
	} else if (x==1) {
		pageXtra='covershadow-front';
	} else if (x==pagecount-2) {
		pageXtra='covershadow-back';
	} else {
	}
binder_html=binder_html+'<div id="folio'+x+'" class="folio '+impose+' '+shift+' '+folioXtra+'" '+zDex+'>\n'+
'<div id="shadow'+x+'" class="shadow"></div>\n'+
'<div id="page'+x+'" class="page '+impose+' '+pageXtra+'">\n'+
'<a id="'+x+'"></a>\n'+
'<div id="header'+x+'" class="header">\n'+
'<h1>'+sectionHead[x]+'</h1>\n'+
'</div>\n'+
'<div id="live'+x+'" class="live entry-content">\n'+
'<div id="column'+x+'" class="columns '+pageBoxColumns[x]+'">'+pageBox[x]+
'</div>\n'+
'</div>\n'+
'<div id="footer'+x+'" class="footer">\n'+
'<p>'+unescape(footerTitle)+' <span class="pgnum"><span class="rdash"> -</span> '+x+' <span class="ldash">-</span> </span></p>\n'+
'</div>\n'+
'<div id="marginleft-'+x+'" class="flipleft flipper"></div>\n'+
'<div id="marginright-'+x+'" class="flipright flipper"></div>'+
'\n'+bmark+'\n'+
'</div></div>\n';
}
// End of Pages Area //
if (!document.getElementById('curves')) { var spinetype = "spine_fill";} else {
	if (document.getElementById('curves').href.location != "") {
		var spinetype = "spine_curve";
	} else { var spinetype = "spine_fill"; }
}
binder_html=binder_html+'<div id="bmark"></div><div id="spineshadow" class="'+spinetype+'"><div class="spine_top spine"></div><div class="spine_bot spine"></div></div>\n';

// Build Exit Message //
binder_html = binder_html+'<div id="plankR" class="plank right">'+exitSign+'</div>\n</div>\n</div>\n';
binder_dom.innerHTML = binder_html

// Build Navbars for Phone UI //
var controlsTop_dom = document.createElement('div');
controlsTop_dom.setAttribute('id','controlbox0');
controlsTop_dom.className = "navbars_show";
var controlsTop_html ='<div id="zoom" class="button"><p><span class="symbol"></span><span class="label"></span></p></div>\n'+
'<div id="appbanner" class="appbanner_up">\n'+
'<div class="appbannerbox">\n'+appbanner_html+'</div>\n'+
'</div>\n'+
'<div id="navbar0" class="navbars">\n';

if (applogo != '') {
	appTitle = applogo;
} else {
	if (unescape(footerTitle).length>22) {
		appTitle = unescape(footerTitle);
		appTitle = appTitle.trim().substring(0, 25);	// trim to 25 characters
		// if we're in the middle of word trim to leading space
		appTitle = appTitle.substr(0, Math.min(appTitle.length, appTitle.lastIndexOf(" ")))
		appTitle+='...';
		appTitle = escape(appTitle);
	} else {
		appTitle = footerTitle;
	}
}

controlsTop_html=controlsTop_html+'<div id="navset0" class="navset nav_in">\n'+
'	<div class="titlebar"><h1 class="title">'+unescape(appTitle)+'</h1></div>\n'+
'	<div id="back" class="button type1 left"><p><span class="symbol"></span><span class="label l10n">Back</span></p></div>\n'+
'	<div id="next" class="button type1 right"><p><span class="symbol"></span><span class="label l10n">Next</span></p></div>\n'+
'</div>\n';
controlsTop_dom.innerHTML = controlsTop_html;


// Build Tabbar at bottom of UI //
var controlsBot_dom = document.createElement('div');
controlsBot_dom.setAttribute('id','controlbox1');
controlsBot_dom.className = "tabbars_show";
var controlsBot_html='<div id="controltoggle" class="button up"><p><span class="symbol"></span><span class="label"></span></p></div>\n'+
'<div id="tocslider" class="tocsliderOUT">\n'+
'	<div>\n'+
'		<div id="tocslider_track"></div>\n'+
'		<div id="tocslider_button" ontouchstart="RYU.touchSlideStart(event);" ontouchend="RYU.touchSlideStop();" onmousedown="RYU.slideStart(event);" onmouseup="RYU.slideFlip();"><p>0</p></div>\n'+
'	</div>\n'+
'</div>\n<div id="tabbar0" class="tabbars">\n'+
'<div id="controlset0" class="controlset control_in">\n'+
'<div class="button type1 quarter left" id="slidetoggle"><p><span class="symbol"></span><span class="label l10n">Slider</span></p></div>\n'+
'<div class="button type1 quarter left" id="tocbutton"><p><span class="symbol"></span><span class="label l10n">Contents</span></p></div>\n'+
'<div class="button type1 quarter left" id="fontbutton"><p><span class="symbol"></span><span class="label l10n">Font</span></p></div>\n'+
'<div class="button type1 quarter center" id="sharebutton"><p><span class="symbol"></span><span class="label l10n">Share</span></p></div>\n'+
'<div class="button type1 quarter right" id="optbutton"><p><span class="symbol"></span><span class="label l10n">Options</span></p></div>\n'+
'<div class="button type1 quarter right" id="viewsbutton"><p><span class="symbol"></span><span class="label l10n">Views</span></p></div>\n'+
'</div>\n'+
'<!--// End of controls //-->\n'+
'</div>\n';
controlsBot_dom.innerHTML=controlsBot_html;

// Create container for UI Elements //
var upbox_dom = document.createElement('div');
upbox_dom.setAttribute('id','upbox');

var glass_dom = document.createElement('div');
glass_dom.id = "under_glass";

// Build Bookmarks Panel
var bookmarks_dom = document.createElement('div');
bookmarks_dom.setAttribute('id','bmark_panel');
bookmarks_dom.className = "panel style1 right out";
var bookmarks_html = '<div class="titlebar" id="bmark_titlebar">\n'+
'<h1 id="bmarktitle" class="title l10n">Bookmarks</h1>\n'+
'<div id="addmark" class="button type2 left"><p><span class="symbol"></span><span class="label l10n">Add</span></p>\n'+
'</div>\n'+
'<div id="bmarkdone" class="button type2 done right"><p><span class="symbol"></span><span class="label l10n">Done</span></p>\n'+
'</div>\n'+
'</div>\n'+
'<div id="bmarklist" class="area">\n'+
'<div id="bmarkfile" class="scrollbox">\n'+
'<ul id="mybookmarks">\n'+
'</ul>\n'+
'</div>\n'+
'</div>\n'+
'<div class="pointer"></div>\n';
bookmarks_dom.innerHTML = bookmarks_html;

// Build Fonts Panel //
var fonts_dom = document.createElement('div');
fonts_dom.setAttribute('id','font_panel');
fonts_dom.className = "panel style2 out";
var fonts_html ='<div class="titlebar" id="font_titlebar">\n'+
'<h1 id="fonttitle" class="title l10n">Fonts</h1>\n'+
'<div id="fontdone" class="button type2 right">\n'+
'<p><span class="symbol"></span><span class="label l10n">Done</span></p>\n'+
'</div>\n'+
'</div>\n'+
'<div class="area">\n'+
'<div id="colorbox" class="colorbox_OUT">\n'+
'	<div id="color_basic" class="button sub-button"><p><span class="symbol"></span><span class="label l10n">Normal</span></p></div>\n'+
'	<div id="color_sepia" class="button sub-button"><p><span class="symbol"></span><span class="label l10n">Sepia</span></p></div>\n'+
'	<div id="color_black" class="button sub-button"><p><span class="symbol"></span><span class="label l10n">Black</span></p></div>\n'+
'</div>\n'+
'<div id="fontbox">\n'+
'	<div id="fontdn" class="button sub-button"><p><span class="symbol"></span><span class="label l10n">Decrease</span></p></div>\n'+
'	<div id="colors" class="button sub-button"><p><span class="symbol"></span><span class="label l10n">Colors</span></p></div>\n'+
'	<div id="fontup" class="button sub-button"><p><span class="symbol"></span><span class="label l10n">Increase</span></p></div>\n'+
'</div>\n'+
'</div>\n'+
'<div class="pointer"></div>\n';
fonts_dom.innerHTML = fonts_html;

// Build TOC Panel //
var toc_dom = document.createElement('div');
toc_dom.setAttribute('id','toc_panel');
toc_dom.className = "panel style1 left out";
var toc_html = '<div class="titlebar" id="toc_titlebar">\n'+
'<h1 id="toctitle" class="title l10n">Contents</h1>\n'+
'<div id="tocdone" class="button type2 done left"><p><span class="symbol"></span><span class="label l10n">Done</span></p></div>\n'+
'</div>\n'+
'<div id="toclist" class="area">\n<div class="scrollbox">\n'+
'<ul id="nav">\n';
// Build Table of Contents //
		for (x=0; x<sectionHeads; x++) {
			if (simulated==true) { 
			var ahref = '<span class="label">'+sectionHead[x]+'</span>';
			} else { 
			var ahref = '<a href="#'+x+'">'+sectionHead[x]+'</a>';
			};
			if (sectionHead[x] != '' || sectionHead[x] != null) {
				toc_html=toc_html+'<li class="list_up">'+ahref+'</li>\n';
			}
		}
toc_html=toc_html+'</ul>\n</div>\n'+
'</div>\n'+
'<div class="pointer"></div>\n';
toc_dom.innerHTML = toc_html;

// Build Views Panel //
var views_dom = document.createElement('div');
views_dom.setAttribute('id','views_panel');
views_dom.className = "panel style3 out";
var views_html = '<div class="titlebar" id="views_titlebar">\n'+
'<h1 id="viewstitle" class="title l10n">Other Views</h1>\n'+
'<div id="viewsdone" class="button type2 done right"><p><span class="symbol"></span><span class="label l10n">Done</span></p></div>\n'+
'</div>\n'+
'<div class="area">\n'+
'<div id="viewbutton0" class="button type3" title="CTRL+L"><p><span class="symbol"></span><span class="label l10n">Continuous</span></p></div>\n'+
'<div id="viewbutton1" class="button type3" title="CTRL+G"><p><span class="symbol"></span><span class="label l10n">Grid View</span></p></div>\n'+
'<div id="viewbutton2" class="button type3" title="CTRL+H"><p><span class="symbol"></span><span class="label l10n">HTML Only</span></p></div>\n'+
'<div id="viewbutton3" class="button type4" title="CTRL+M"><p><span class="symbol"></span><span class="label l10n">Magazine</span></p></div>\n'+
'<div id="viewbutton4" class="button type4" title="Cancel"><p><span class="symbol"></span><span class="label l10n">Cancel</span></p></div>\n'+
'</div>\n'+
'<div class="pointer"></div>\n';
views_dom.innerHTML = views_html;

// Build Share Panel //
var share_dom = document.createElement('div');
share_dom.setAttribute('id','share_panel');
share_dom.className = "panel style3 out";
var share_html = '<div class="area"></div>\n<div class="pointer"></div>';
share_dom.innerHTML = share_html;


// Build Options Panel //
var options_dom = document.createElement('div');
options_dom.setAttribute('id','opt_panel');
options_dom.className = "panel style1 right out";
var options_html = '<div class="titlebar" id="opt_titlebar">\n'+
'<h1 id="opttitle" class="title l10n">Options</h1>\n'+
'<div class="button type1 quarter left" id="helpbutton"><p><span class="symbol"></span><span class="label l10n">Help</p></div>\n'+
'<div id="optdone" class="button type2 done right">'+
'<p><span class="symbol"></span><span class="label l10n">Done</span></p>'+
'</div>\n'+
'</div>\n'+
'<div id="optlist" class="area">\n'+
'	<div class="scrollbox">\n'+
'		<ul id="opts" class="opts"></ul>\n'+
'	</div>\n'+
'</div>\n\n'+
'<div class="pointer"></div>\n'+
'</div>\n';
options_dom.innerHTML = options_html;

// Put all the UI Elements in the upbox //
upbox_dom.appendChild(glass_dom);
upbox_dom.appendChild(bookmarks_dom);
upbox_dom.appendChild(fonts_dom);
upbox_dom.appendChild(toc_dom);
upbox_dom.appendChild(views_dom);
upbox_dom.appendChild(share_dom);
upbox_dom.appendChild(options_dom);

// Build Lightbox Gallery //
var lightbox_dom = document.createElement('div');
	lightbox_dom.id = 'lightbox';
var lightbox_shade = document.createElement('div');
	lightbox_shade.id = 'shade';
	lightbox_dom.appendChild(lightbox_shade);

// IE11 complains WrongDocument, need to shift reference
if (document.cloneNode(true)!=null) {
	
		var sourceFile = document.cloneNode(true);
}

	
for (x=lightBoxes.length-1; x >= 0; x--) {
	if (lightBoxes[x].id != 'boxad') {	// moved to dialog
	lightbox_dom.appendChild(lightBoxes[x]);
	}
}

// Pan-Zoom control
var pan_dom = document.createElement('div');
pan_dom.setAttribute('id','pan');
pan_dom.className = "pan_off";

// Bubble Help container
var help_dom = document.createElement('div');
help_dom.setAttribute('id','helper');
help_dom.className = "helper_off";
help_html = '	<div id="help_guide">\n'+
'		<div id="help_arrow"></div>\n'+
'	</div>\n'+
'	<div id="help_box">\n'+
'	</div>\n';
help_dom.innerHTML = help_html;

// Load Icon //
var load_icon = document.createElement('div');
load_icon.setAttribute('id','loadicon');
	if (splashScreen == "") {
		load_icon.className="spinning start";
	}

var body = document.getElementsByTagName('body')[0];
body.id = "ryuzinereader";
body.innerHTML="";


body.appendChild(splashbox_dom);
body.appendChild(load_icon);
body.appendChild(binder_dom);
body.appendChild(upbox_dom);
body.appendChild(lightbox_dom);
body.appendChild(pan_dom);
body.appendChild(controlsTop_dom);
body.appendChild(controlsBot_dom);
body.appendChild(help_dom);

if (customWidget==1) {
	share_dom.getElementsByClassName('area')[0].innerHTML = socialWidget;
} else {	// no custom widget so use default addon
	if (!document.getElementById('socialwidget')) {
		RYU.config.socialwidget = {
			url 	: shareLink,
			title 	: footerTitle,
			media	: media,
			desc	: desc
		}
		if (RYU.config.AddOns.indexOf('socialwidget')===-1) {
			RYU.config.AddOns.push('socialwidget');
		}
	}
}
// The following are used to check that theme and view css has loaded
var tcheck_dom = document.createElement('div');
	tcheck_dom.id = "tcheck";
var vcheck_dom = document.createElement('div');
	vcheck_dom.id = "vcheck";
body.appendChild(tcheck_dom);
body.appendChild(vcheck_dom);

// BoxAd //
if (boxad_html!='') {
	var boxad_dom = document.createElement('div');
		boxad_dom.id = 'myboxad';
		boxad_dom.innerHTML = boxad_html;
	body.appendChild(boxad_dom);
}

// pass cloned doc for AddOns, they should test and bail if null
RYU.sourceFile = sourceFile;

RYU.init_zine(pagecount);

}		
}
}

