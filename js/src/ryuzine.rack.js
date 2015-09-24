/*
RYUZINE RACK
Version: 1.0
Author: K.M. Hansen
Author URI: http://www.kmhcreative.com
License: MPL 2.0
License URI: https://www.mozilla.org/MPL/2.0/
Copyright: 2011-2015 K.M. Hansen & Ryu Maru (software@ryumaru.com)
Program URI: http://www.ryumaru.com/ryuzine

DESCRIPTION: Ryuzine(tm) Rack creates a newsstand-style promotional webapp from a sortable HTML table file. 
The "Ryuzine" and "Ryu Maru" logos are trademarks of Ryu Maru. App icon design copyright 2015 K.M. Hansen.

NOTES: Load ryuzine.config.js before this file.
Sorting functions adapted from TinyTable released under a CC0 license by Michael Leigeber.
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
	var tocscroll = null;	var optscroll = null;		var aboutscroll = null;
	var sheetscroll = null;	var galleryscroll = null;	var scrollHolder;
	var column = [];		var footer = [];			var marginL = [];
	var marginR = [];		var pagetimer = [];				
	var css3d = 0;			
	var config = undefined;		var ovrImg = [];
	var autoflip = 0;			
	var altview = 0;
	var view = "rackgrid";	var p_toggle = 0;			var W = null;
	var H = null;			var inputMethod = "mousedown";
	var zoomed = 0;						
	var bookmarks = 0;
	var bookmarkList = [];	var mark = null;			var mystyles = "";
	var defaultTheme = "";		
	var p=0;
	var x=1;				var z=0;					var events=0;
	var prevW=0;			var prevH=0;				var aCheck=null;
	var ctog = 1;			var adbox = 0;				var showad = '';
	var hidecontrols = null;var slidecontrols = null;	var upboxtimer = null;
	var paneltimer = null;	var promotimer = null;		var shadow = [];
	var splashoff = null; 	var splashout = null;		var splashload = null;
	var handle = null;		var adtrigger = null;		var splashcatch = null;
	// Catalog Defaults //
	var TINY={};			var dataSrc = {};			var dataTbl = {};
	var rackdoc = {};		var sort_list = [];			var newSrc = 0;
	var showpromos = 1;		var filterall = 1;			var catalog = 0;
	var hires = 0;			var mylist = [];
	// App Objects //
	var bod = {};			var sh = {};				var up_box = {};
	var font_opt = {};		var color_opt = {}; 		var toc_slide = {};
	var toc_list = {};		var opt_slide={};			var opt_list = {};
	var toc_button = {};	var help_button = {};		var view_opt = {};
	var controls = {};		var slide_box = {};			var light_box = {};
	var lightshade = {};	var sH = {};				var hH = {};
	var hM = {};			var fH = {};				var fM = {};
	var tM = {};			var nH = {};				var cH = {};
	var bm = {};			var g1 = {};				var find_slide = {};
	var hide_dialogs = [];
	// Set-Up Guided Help
	var helpcards = 0;
	var card = []
	for (var c=0; c < helpcards+1; c++) {
		card[c] = [];
	}
// No Help implemented in Rack yet //
// ....
// If no debug console write to dummy function
if (!window.console) window.console = {};
if (!window.console.log || DEBUG == false) window.console.log = function () { };
// IE Complains if these are not defined outside of a function
	var cssdisabled = false;var cssTransitionsSupported = false;
	var cssTransform=getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
	var cssTransitionDelay=getsupportedprop(['transitionDelay', 'MozTransitionDelay', 'WebkitTransitionDelay', 
	'msTransitionDelay','OTransitionDelay']);
	var cssTransitionDuration=getsupportedprop(['transitionDuration','MozTransitionDuration','WebkitTransitionDuration','msTransitionDuration','OTransitionDuration']);
	var css3borderRadius=getsupportedprop(['borderRadius','MozBorderRadius','WebkitBorderRadius']);
	var css3dCapable = getsupportedprop(['perspective','MozPerspective','WebkitPerspective','msPerspective','OPerspective']);
	var nativeScroll = getsupportedprop(['overflowScrolling','WebkitOverflowScrolling']);	
	// Note: "device" was moved to sniffer.js//
// Table Sort Set-Up //
function T$(i){return dataSrc.getElementById(i);}
function T$$(e,p){return p.getElementsByTagName(e)}

TINY.table=function(){ 
	function sorter(n){this.n=n; this.pagesize=RYU.config.rackItems; this.paginate=0}
	sorter.prototype.init=function(e,f){
		var t=ge(e), i=0; this.e=e; this.l=t.r.length; t.a=[];
		t.h=T$$('thead',T$(e))[0].rows[0]; t.w=t.h.cells.length;
		for(i;i<t.w;i++){
			var c=t.h.cells[i];
			if(c.className!='nosort'){
				c.className=this.head; c.onclick=new Function(this.n+'.wk(this.cellIndex)')
			}
		}
		for(i=0;i<this.l;i++){t.a[i]={}}
		if(f!=null){var a=new Function(this.n+'.wk('+f+')'); a()}
		if(this.paginate){this.g=1; this.pages()}
	};
	sorter.prototype.wk=function(y){
		var t=ge(this.e), x=t.h.cells[y], i=0;
		for(i;i<this.l;i++){
      t.a[i].o=i; var v=t.r[i].cells[y]; t.r[i].style.display='';
      while(v.hasChildNodes()){v=v.firstChild}
      t.a[i].v=v.nodeValue?v.nodeValue:''
    }
		for(i=0;i<t.w;i++){var c=t.h.cells[i]; if(c.className!='nosort'){c.className=this.head}}
		if(t.p==y){t.a.reverse(); x.className=t.d?this.asc:this.desc; t.d=t.d?0:1}
		else{t.p=y; t.a.sort(cp); t.d=0; x.className=this.asc}
		var n=document.createElement('tbody');
		for(i=0;i<this.l;i++){
			var r=t.r[t.a[i].o].cloneNode(true); n.appendChild(r);
			r.className=i%2==0?this.even:this.odd; var cells=T$$('td',r);
			for(var z=0;z<t.w;z++){cells[z].className=y==z?i%2==0?this.evensel:this.oddsel:''}
		}
		t.replaceChild(n,t.b); if(this.paginate){this.size(this.pagesize)}
	};
	sorter.prototype.page=function(s){
		var t=ge(this.e), i=0, l=s+parseInt(this.pagesize);
		if(document.getElementById(this.currentid)&&document.getElementById(this.limitid)){document.getElementById(this.currentid).innerHTML=this.g}
		for(i;i<this.l;i++){t.r[i].style.display=i>=s&&i<l?'':'none'}
	};
	sorter.prototype.move=function(d,m){
		var s=d==1?(m?this.d:this.g+1):(m?1:this.g-1);
		if(s<=this.d&&s>0){this.g=s; this.page((s-1)*this.pagesize)}
	};
	sorter.prototype.size=function(s){
		this.pagesize=s; this.g=1; this.pages(); this.page(0);
		if(document.getElementById(this.currentid)&&document.getElementById(this.limitid)){document.getElementById(this.limitid).innerHTML=this.d}
	};
	sorter.prototype.pages=function(){this.d=Math.ceil(this.l/this.pagesize)};
	function ge(e){var t=T$(e); t.b=T$$('tbody',t)[0]; t.r=t.b.rows; return t};
	function cp(f,c){
		var g,h; f=g=f.v.toLowerCase(), c=h=c.v.toLowerCase();
		// Fix Month+Year Dates //
		var fcheck = "";
		if (f.match(" ")) {
			fcheck = f.split(" ");
			if (fcheck.length < 3) {
				fcheck = fcheck[0]+' 1, '+fcheck[1];
				f = fcheck;
			} else {
				fcheck = f;
			}
		}
		if (f.match("/")) {
			fcheck = f.split("/");
			if (fcheck.length < 3) {
				fcheck = fcheck[0]+'/01/'+fcheck[1];
				f = fcheck;
			} else {
				fcheck = f;
			}
		}
		var ccheck = "";
		if (c.match(" ")) {
			ccheck = c.split(" ");
			if (ccheck.length < 3) {
				ccheck = ccheck[0]+' 1, '+ccheck[1];
				c = ccheck;
			} else {
				ccheck = c;
			}
		}
		if (c.match("/")) {
			ccheck = c.split("/");
			if (ccheck.length < 3) {
				ccheck = ccheck[0]+'/01/'+ccheck[1];
				c = ccheck;
			} else {
				ccheck = c;
			}
		}
		
		var i=parseFloat(f.replace(/(\$|\,)/g,'')), n=parseFloat(c.replace(/(\$|\,)/g,''));
		if(!isNaN(i)&&!isNaN(n)){g=i,h=n}
		i=Date.parse(f); n=Date.parse(c);

		if(!isNaN(i)&&!isNaN(n)){g=i; h=n}
		return g>h?1:(g<h?-1:0)
	};
	return{sorter:sorter}
}();
	// check if browser is accepting cookies //
	storeMasterCookie();
	storeIntelligentCookie('test','cookie value');
// GET CONFIG FILE VARIABLES 	//
	if (typeof RYU.config != "undefined") {
		// Import config variables if they exist or use default values
		var binding = "left";	// n/a to Rack
		var pgsize  = 0;		// n/a to Rack
		RYU.config.zoompan = RYU.config.zoompan || 0;
		var maxzoom  = RYU.config.maxzoom  || 5.0;
		var splashad = RYU.config.splashad || 0;
		var box_ad   = RYU.config.boxad    || 0;
		var AddOns   = RYU.config.AddOns   || [];
		var rackData = RYU.config.rackData || [];
		var autopromo = RYU.config.autopromo || 5;
		var linkOpens = RYU.config.linkOpens || 0;
		var maxpromos = RYU.config.maxpromos || 5;
		var mediaType = RYU.config.mediaType || [["Ryuzine","Read Now"],["Download","Download ⬇"],["PDF","Download ⬇"],["Print","$ Buy Now"],["Website","View Site"]];
		// var linkOS is set after cookies //
		var swapThemes = RYU.config.swapThemes || 0;
		RYU.config.pageshadows = 0;	// n/a to Rack
			var deskTheme = RYU.config.deskTheme || "";
			var winTheme  = RYU.config.winTheme	 || "";
			var macTheme  = RYU.config.macTheme	 || "";
			var nixTheme  = RYU.config.nixTheme	 || "";
			var iOSTheme  = RYU.config.iOSTheme  || "";
			var andTheme  = RYU.config.andTheme  || "";
			var wOSTheme  = RYU.config.wOSTheme  || "";
			var bbtTheme  = RYU.config.bbtTheme  || "";
			var wp7Theme  = RYU.config.wp7Theme  || "";
			var	w8mTheme  = RYU.config.w8mTheme  || "";
	} else {
		alert(RYU._lc('App Error: Loading configuration variables failed.'));
	}

	if (typeof RYU.php != "undefined") {
		var php = RYU.php;
	}
	var baseurl = "";
	var rackImg = function() {
		if (php != undefined) {
			baseurl = php.baseurl;
			var imgpath = '';
		} else {
			baseurl = "";
			if (rackData[0].length>2) {
				// this is a simulator preview
				var subfolder = rackData[0][2];
			} else { 
				var subfolder = rackData[catalog][1].replace('.htm','');
			}
			var imgpath = 'images/rack/'+subfolder+'/';
		}
		return imgpath;
	}
	rackImg();
	
	if (!Get_Cookie("readinglist")) { 
		mylist = [];
	} else {
		var str = Get_Cookie("readinglist").split(',');
		for (var x=0; x < str.length; x++) {
			var temp = [str[x],str[x+1]];
			mylist.push(temp);
			x = x + 1;
		}	
	}
	
	if (!Get_Cookie("showpromos")) {
		RYU.config.showpromos = 1;
	} else {
		RYU.config.showpromos=Get_Cookie("showpromos");
	}
		
	if (!Get_Cookie("filterall")) {
		RYU.config.filterall = 1;
	} else {
		RYU.config.filterall = Get_Cookie("filterall");
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
	
	viewstyle = "rackgrid";
//********** ADDONS FUNCTIONS **************//
var addon = {};
// Object.keys Polyfill
if (!Object.keys) Object.keys = function(o) {
  if (o !== Object(o))
    throw new TypeError('Object.keys called on a non-object');
  var k=[],p;
  for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
  return k;
}
// Array.isArray Polyfill
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
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

if (window.devicePixelRatio >= 2) {
	hires = function() {
		if (window.innerWidth <= 720) { hires = 0; } else { hires = 1;}
		return hires;
	}();
}

function limitItems(i) {
	sorter.size(i);
	RYU.config.rackItems = i;
	RYU.pullNames();
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
// ******** EVENT PROCESSING ***********//
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

function toc_addEventListeners() {
	console.log('TOC Self-Nuke Listeners');
	var content = document.getElementById('nav').innerHTML;
	document.getElementById('nav').innerHTML = '';
	document.getElementById('nav').innerHTML = content;
	console.log('TOC Add New Event Listeners');
	var list_item = document.getElementById('nav').getElementsByTagName('li');
	for (var a=0; a < list_item.length; a++) {
		if (list_item[a].id == "go2list") {
			if ('ontouchend' in document.documentElement) { // Prevent misfires on touch devices
					list_item[a].addEventListener('touchend',function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:'rl'});},false);
			} else {
					if (typeof iScroll == "undefined") {
						list_item[a].addEventListener('mouseup',function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:'rl'});},false);
					} else {
						if (RYU.device.Platform == "Firefox" || RYU.device.Platform == "IE") { // Prevent iScroll Hover misfires in Firefox
							list_item[a].addEventListener('click',function(){this.getElementsByTagName('a')[0].href="javascript:void(0);";return false;},false);
						}
						if (typeof IScroll != "undefined") {
							list_item[a].addEventListener('tap',function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:'rl'});},false);
						} else {
							list_item[a].addEventListener('mouseup',function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:'rl'});},false);
						}
					}
			}	
		} else if (list_item[a].id.match(/change2cat/gi) ) {
			// Handle this after all others below	
		} else {
			if ('ontouchend' in document.documentElement) { // Prevent misfires on touch devices
					if (typeof IScroll != "undefined") {
					list_item[a].addEventListener('tap',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:x});}}(sort_list[a]),false);
					} else {
					list_item[a].addEventListener('touchend',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:x});}}(sort_list[a]),false);
					}
			} else {
					if (typeof iScroll == "undefined") {
						list_item[a].addEventListener('mouseup',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:x});}}(sort_list[a]),false);
					} else {
						if (RYU.device.Platform == "Firefox" || RYU.device.Platform == "IE") { // Prevent iScroll Hover misfires in Firefox
							list_item[a].addEventListener('click',function(x){this.getElementsByTagName('a')[0].href="#";return false;},false);
						}
						if (typeof IScroll != "undefined") {	// if it is iScroll v5 use tap detect
						list_item[a].addEventListener('tap',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:x});}}(sort_list[a]),false);
						} else {
						list_item[a].addEventListener('mouseup',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:x});}}(sort_list[a]),false);
						}
					}
			}
		} 
	}
	var r = 0;
	for (var a=0; a < list_item.length; a++) {
		if (list_item[a].id.match(/change2cat/gi) ){
				if ('ontouchend' in document.documentElement) { // Prevent misfires on touch devices
						list_item[a].addEventListener('touchend',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:x});}}(r),false);
				} else {
						if (typeof iScroll == "undefined") {
							list_item[a].addEventListener('mouseup',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:x});}}(r),false);
						} else {
							if (RYU.device.Platform == "Firefox" || RYU.device.Platform == "IE") { // Prevent iScroll Hover misfires in Firefox
								list_item[a].addEventListener('click',function(){this.getElementsByTagName('a')[0].href="javascript:void(0);";return false;},false);
							}
							if (typeof IScroll != "undefined") {				
							list_item[a].addEventListener('tap',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:x});}}(r),false);
							} else {
							list_item[a].addEventListener('mouseup',function(x){return function(){RYU.tapCheck('list',{element:this,panel:1,sort:0,catalog:x});}}(r),false);
							}
						}
				}
				r++;		
		}
	}
}


// We need to set Link Targets after we know Scrolling/Zooming //
// This also gets re-run if those settings are turned off too  //
var linkTargeting = function() {
	if (linkOpens == 1) {	// _self
		var linkAction = '_self';
	} else if (linkOpens == 3) { // _parent
		var linkAction = '_parent';
	} else if (linkOpens == 4) { // _top
		var linkAction = '_top';
	} else if (linkOpens == 5) { // in-app
		var linkAction = 'inapp';
	} else {	// _blank
		var linkAction = '_blank';
	}
	linkOpens = 'on'+iClick+'="RYU.tapCheck(\'link\',{url:\'\'+this.title+\'\',target:\''+linkAction+'\',cat:\'\'+this.parentNode.parentNode.getElementsByClassName(\'catid\')[0].innerHTML+\'\'});"';
}();

// ******** INITIALIZE SORTER ****************//
function initSorter() {
	// triggered when dataSrc loads //
	sortInit = function(){
		// triggered when Rack loads //
		dataSrc = document;
		dataTbl = document.getElementById('table');
		rackdoc = document.getElementsByTagName('body')[0];
	
			sorter = new TINY.table.sorter("sorter");
			sorter.head = "head";
			sorter.asc = "asc";
			sorter.desc = "desc";
			sorter.even = "evenrow";
			sorter.odd = "oddrow";
			sorter.evensel = "evenselected";
			sorter.oddsel = "oddselected";
			sorter.paginate = true;
			sorter.currentid = "currentpage";
			sorter.limitid = "pagelimit";
			sorter.init("table",1);
			// I want it to start with descending dates //
			sorter.init("table",1);
			
			var sortby = dataTbl.getElementsByTagName('th');
			var sortli="";
			for (var s=0,a=0; s < sortby.length; s++) {
				if (sortby[s].className != "nosort") {
				sort_list[a] = s;
				sortli = sortli + '<li class="list_up"><a href="#">'+sortby[s].innerHTML+'</a></li>';
				a++;
				}
			}
			sortli = sortli;
			if (!document.getElementById('nav')) {
			var sortlist = document.createElement('ul');
			sortlist.setAttribute('id','nav');
			rackdoc.appendChild(sortlist);
			} else {
			var sortlist = document.getElementById('nav');
			}
			sortlist.innerHTML=sortli;
			
			var sortli = sortlist.getElementsByTagName('li');

				var catli = document.createElement('li');
				catli.className = "list_up";
				catli.id = "go2list";
				if (mylist.length > 0) {
				catli.setAttribute('style','display:block;');
				} else {
				catli.setAttribute('style','display:none;');
				}
				catli.innerHTML = '<a href="#" class="l10n">My Reading List</a>';
				sortlist.appendChild(catli);

		if (rackData.length > 1) {
			for (var r=0; r < rackData.length; r++) {
				var catli = document.createElement('li');
					catli.id = "change2cat"+r+"";
					catli.className = "list_up";

				if (r==catalog) {
				catli.innerHTML = '<a href="#">&#10095; '+unescape(rackData[r][0])+'</a>';				
				} else {
				catli.innerHTML = '<a href="#">'+unescape(rackData[r][0])+'</a>';
				}
				sortlist.appendChild(catli);

			}
		}

		var rows = dataTbl.getElementsByTagName('tr');
		var promos = [];
		var feature_html = "";
		
		function imgCheck(str) { // Check that string is an image file name or not
			if (str.match(/png|gif|jpg|jpeg|svg+/i)) {
				if (str.match(/img|src=/i)) { // Make sure it is not HTML
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}


	var masthead_html = document.getElementById('rackdata').getElementsByTagName('table')[0].getElementsByTagName('td')[1].innerHTML;
	if (imgCheck(masthead_html)) {
		masthead_html = masthead_html.replace(/^\s*|\s*$/g,''); // remove any whitespace
		masthead_html = '<img src="'+rackImg()+masthead_html+'" id="app_logo" alt="Ryuzine Rack"/>';
		document.getElementById('navset0').getElementsByClassName('title')[0].innerHTML = masthead_html;
	} else {
		document.getElementById('navset0').getElementsByClassName('title')[0].innerHTML = unescape(RYU.config.applogo);
	}
	
	if (maxpromos==0) {
		// disable promo carousel
		RYU.config.showpromos = 0;
		hideRackTop();
	} else {
		// find and show promos
		for (var r=1; r<rows.length; r++) {
			if (rows[r].getElementsByTagName('td')[8].innerHTML != "") {
				promos.push(r);  // Store Row References for Promos
			}
		}
		
		if (promos[0] != "1") { // Make sure newest item is always a promo
			var somorp = [1];
			for (var p=0; p < promos.length; p++) {
				somorp.push(promos[p]);
			}
			promos = somorp;
		}
		
		if(promos.length%2 == 0) { promos.length = promos.length-1; }
		if (promos.length > maxpromos) { promos.length = maxpromos};
		for (var p=0; p < promos.length; p++) {
			if (p==0) { var promo_set = "promo_in";}
			else if (p==promos.length-1) { var promo_set = "promo_out"; }
			else if (maxpromos > 4 && p==promos.length-2) { var promo_set = "promo_wayout"; }
			else if (p==1) { var promo_set = "promo_ondeck"; }
			else {var promo_set = "promo_deck";}
			// If promo is set to "auto" or if it is the latest one with nothing set for promos build one //
			if (rows[promos[p]].getElementsByTagName('td')[8].innerHTML.toLowerCase().trim()=="auto" || rows[promos[p]].getElementsByTagName('td')[8].innerHTML.trim()=="") {
				buildPromo(promos[p],p,promo_set);
			} else {
				var imgFile = rows[promos[p]].getElementsByTagName('td')[8].innerHTML;
				if (imgCheck(imgFile)) {
					imgFile = imgFile.replace(/^\s*|\s*$/g,''); // remove any whitespace
					feature_html = feature_html+'<div id="promo'+p+'" class="promo '+promo_set+'"><div></div><div></div><img class="promobanner" src="'+rackImg()+imgFile+'" width="100%" height="auto"><div class="mylar"></div>\n'+
					'<span class="catid">'+rows[promos[p]].getElementsByTagName('td')[0].innerHTML+' |</span>'+
					'<div class="read">\n'+
					'	<div class="button type2 center" title="'+ rows[promos[p]].getElementsByTagName('td')[5].innerHTML+'" '+linkOpens+'>\n<p>';
					if ( rows[promos[p]].getElementsByTagName('td')[6].innerHTML==mediaType[0][0] ||  rows[promos[p]].getElementsByTagName('td')[6].innerHTML=="") {
						feature_html = feature_html+unescape(mediaType[0][1]);
					} else if ( rows[promos[p]].getElementsByTagName('td')[6].innerHTML==mediaType[1][0]) {
						feature_html = feature_html+unescape(mediaType[1][1]);
					} else if ( rows[promos[p]].getElementsByTagName('td')[6].innerHTML==mediaType[2][0]) {
						feature_html = feature_html+unescape(mediaType[2][1]);
					} else if ( rows[promos[p]].getElementsByTagName('td')[6].innerHTML==mediaType[3][0]) {
						feature_html = feature_html+unescape(mediaType[3][1]);
					} else if ( rows[promos[p]].getElementsByTagName('td')[6].innerHTML==mediaType[4][0]) {
						feature_html = feature_html+unescape(mediaType[4][1]);
					} else {
						for (var m=0; m < mediaType.length; m++) {
							if ( rows[promos[p]].getElementsByTagName('td')[6].innerHTML==mediaType[m][0]) {
								var mc = m
							} else {
								var mc = 0;
							}
						} 
						if (mc != 0) {
							feature_html = feature_html+unescape(mediaType[mc][1]);
						} else {
							feature_html = feature_html+ rows[promos[p]].getElementsByTagName('td')[6].innerHTML;
						}
					}
					feature_html = feature_html+'</p></div></div>\n</div>';
				} else {
					feature_html = feature_html+'<div id="promo'+p+'" class="promo '+promo_set+'"><div class="description"><h4>Error 400: Bad Request</h4><p>Catalog file "'+rackData[catalog][1]+'" data error for promo ='+p+'.</p><p>Promo image file request in improper format.</p></div></div>';
				}
			}
		}

		function buildPromo(r,p,pset) {  // Automatically builds a promo if set to "auto"
			var latest = dataTbl.getElementsByTagName('tr')[r];
					if (latest.getElementsByTagName('td')[7].innerHTML=="") {
						var promopath = baseurl+'ryuzine/images/rack/default_thumbnail.jpg';
					} else {
						var promopath = rackImg();
					}
			feature_html = feature_html+'<div id="promo'+p+'" class="promo '+pset+'">\n'+
			'	<div class="cover cover_in"><img class="thumbnail" src="'+promopath+latest.getElementsByTagName('td')[7].innerHTML+'" /><div class="mylar"></div></div>\n'+
			'	<div class="description">\n'+
			'		<h1>'+latest.getElementsByTagName('td')[2].innerHTML+'</h1>\n'+
			'		<h4>'+latest.getElementsByTagName('td')[1].innerHTML+'</h4>\n'+
			'<div class="blurb">'+latest.getElementsByTagName('td')[3].innerHTML+'</div>\n';
			if (latest.getElementsByTagName('td')[4].innerHTML=="") {
				var thiscat = "Uncategorized"; } else { var thiscat = latest.getElementsByTagName('td')[4].innerHTML; }
			if (latest.getElementsByTagName('td')[6].innerHTML=="") {
				var thistype = "Unknown";} else {var thistype= latest.getElementsByTagName('td')[6].innerHTML; }
			feature_html = feature_html+'<p class="meta"><small><span class="catid">'+latest.getElementsByTagName('td')[0].innerHTML+' |</span> Category: <a href="javascript:RYU.pullNames(\''+thiscat+'\');">'+thiscat+'</a> | Media: <a href="javascript:RYU.pullNames(\''+thistype+'\');">'+thistype+'</a></small></p></div>\n'+
			'<div class="read">\n'+
			'	<div class="button type2 center" title="'+latest.getElementsByTagName('td')[5].innerHTML+'" '+linkOpens+'>\n<p>';
			if (latest.getElementsByTagName('td')[6].innerHTML==mediaType[0][0] || latest.getElementsByTagName('td')[6].innerHTML=="") {
				feature_html = feature_html+unescape(mediaType[0][1]);
			} else if (latest.getElementsByTagName('td')[6].innerHTML==mediaType[1][0]) {
				feature_html = feature_html+unescape(mediaType[1][1]);
			} else if (latest.getElementsByTagName('td')[6].innerHTML==mediaType[2][0]) {
				feature_html = feature_html+unescape(mediaType[2][1]);
			} else if (latest.getElementsByTagName('td')[6].innerHTML==mediaType[3][0]) {
				feature_html = feature_html+unescape(mediaType[3][1]);
			} else if (latest.getElementsByTagName('td')[6].innerHTML==mediaType[4][0]) {
				feature_html = feature_html+unescape(mediaType[4][1]);
			} else {
				for (var m=0; m < mediaType.length; m++) {
					if (latest.getElementsByTagName('td')[6].innerHTML==mediaType[m][0]) {
						var mc = m
					} else {
						var mc = 0;
					}
				} 
				if (mc != 0) {
					feature_html = feature_html+unescape(mediaType[mc][1]); alert('f. '+mediaType[mc][1]);
				} else {
					feature_html = feature_html+latest.getElementsByTagName('td')[6].innerHTML;
				}
			}
			feature_html = feature_html+'</p></div></div>\n'+
			'</div>';
			return feature_html;
		}

		if (!document.getElementById('racktop')) {
			var feature = document.createElement('div');
			feature.setAttribute('id','racktop');
			feature.className="show";
			rackdoc.appendChild(feature);
		} else {
			var feature = document.getElementById('racktop');
		}
		
		if (promos.length < 5) {
				if (promos.length < 3) {
				var feature_html = '<div id="carousel" class="noverflow">\n'+feature_html+'</div><div id="promonav_left" class="flipper"></div><div id="promonav_right" class="flipper"></div>\n';
				} else {
				var feature_html = '<div id="carousel" class="noverflow">\n'+feature_html+'</div><div id="promonav_left" class="flipleft promonav"></div><div id="promonav_right" class="flipright promonav"></div>\n';
				}
			} else {
			var feature_html = '<div id="carousel">\n'+feature_html+'</div>\n<div id="promonav_left" class="flipleft promonav"></div><div id="promonav_right" class="flipright promonav"></div>\n';
			}
		
		
			feature.innerHTML = feature_html;		
		document.getElementById('promonav_left').addEventListener(iDown,function(){RYU.carousel(0);},false);
		document.getElementById('promonav_right').addEventListener(iDown,function(){RYU.carousel(1);},false);
		if (autopromo > 0 && promos.length > 2) {
			// The DOM check for 'carousel' is a hack.  When previewing in Ryuzine Writer the promotimer will persist
			// this prevents interval continuing when IFRAME document is no longer a RyuzineRack
			promotimer = setInterval(function(){if(!document.getElementById('carousel')){clearInterval(promotimer);}else{RYU.carousel(1,1);}},autopromo*1000);
		}
	}
	pullNames();
	}();
	// Make sure parent page has loaded before trying DOM ops on it //
	// If the Data Source changes re-run Init //
	if (newSrc == 0) { 
	console.log('newSrc=0 run init');
	RYU.init(); } else { bookBinder();}
}
// ******** PULL NAMES FROM TABLE ************//
function pullNames(filter,into) {
	if (filter!=null) { 
		if (filterall==1 || filter=="reading_list") {var invisibles = true;} else { var invisibles = false;};
		var covani = "cover_out" ;
		if (filter=="Unknown" || filter=="Uncategorized") {
			// allow filtering by empty type or category
			filter = "";
			var covani = "cover_out";
		}
	} else { var invisibles = false; var covani = "cover_in" };
	var rows = dataTbl.getElementsByTagName('tr');
	var item_html = "";
	for (var r=1; r < rows.length; r++) { // First TR is full of TH not TD
		var item_id = rows[r].getElementsByTagName('td')[0].innerHTML
		if (checkList(item_id)) {var marked = true; } else { var marked = false; };
		if ( (filter=='reading_list' && marked) || rows[r].getElementsByTagName('td')[4].innerHTML==filter || rows[r].getElementsByTagName('td')[6].innerHTML==filter || filter==null) {
			if (rows[r].style.display!="none" || invisibles == true) {
				if (rows[r].getElementsByTagName('td')[7].innerHTML=="") {
					var imgpath = baseurl+'ryuzine/images/rack/default_thumbnail.jpg';
				} else {
					var imgpath = rackImg();
				}
		if (marked) {
			var markbutton = '<div class="plusbutton lb_minus" on'+iDown+'="RYU.unMark(\''+item_id+'\',this);" style="display:block;"></div>\n'+
							 '<div class="plusbutton lightboxbutton" on'+iDown+'="RYU.add2List(\''+item_id+'\',this);" style="display:none;"></div>\n';
			var markribbon = '<div class="ribbon" on'+iDown+'="RYU.pullNames(\'reading_list\');"></div>\n';
			var showribbon = ' marked';
		} else {
			var markbutton = '<div class="plusbutton lb_minus" on'+iDown+'="RYU.unMark(\''+item_id+'\',this);" style="display:none;"></div>\n'+
							 '<div class="plusbutton lightboxbutton" on'+iDown+'="RYU.add2List(\''+item_id+'\',this);" style="display:block;"></div>\n';
			var markribbon = '<div class="ribbon" on'+iDown+'="RYU.pullNames(\'reading_list\');"></div>\n';
			var showribbon = "";
		}
		item_html = item_html+'<div id="slot'+r+'" class="slot">\n'+
		'<div class="rack_card'+showribbon+'">'+
		'<div class="cover '+covani+'" >\n'+
			'<img src="'+imgpath+rows[r].getElementsByTagName('td')[7].innerHTML+'" class="thumbnail"/>';
				item_html+='<div class="mylar" on'+iDown+'="RYU.tapCheck(\'details\',{item:\''+r+'\'});"></div>\n';
		item_html+= markribbon+'<div class="date">'+markbutton+		
		'<p>'+rows[r].getElementsByTagName('td')[1].innerHTML+'</p></div>\n'+
		'</div>\n'+
		'	<div class="description">\n'+
		'		<h1>'+rows[r].getElementsByTagName('td')[2].innerHTML+'</h1>\n'+
		'		<h4>'+rows[r].getElementsByTagName('td')[1].innerHTML+'</h4>\n'+
		'<div class="blurb">'+rows[r].getElementsByTagName('td')[3].innerHTML+'</div>';	// might pull <p> so can't be <p>
		if (rows[r].getElementsByTagName('td')[4].innerHTML=="") {
			var thiscat = "Uncategorized"; } else { var thiscat = rows[r].getElementsByTagName('td')[4].innerHTML; }
		if (rows[r].getElementsByTagName('td')[6].innerHTML=="") {
			var thistype = "Unknown";} else {var thistype= rows[r].getElementsByTagName('td')[6].innerHTML; }
		item_html = item_html+'<p class="meta"><small><span class="catid">'+item_id+' |</span> Category: <a href="javascript:RYU.pullNames(\''+thiscat+'\');">'+thiscat+'</a> | Media: <a href="javascript:RYU.pullNames(\''+thistype+'\');">'+thistype+'</a><span class="on_reading_list"> | Reading List:<a href="javascript:RYU.pullNames(\'reading_list\');">Show List</a></span></small></p></div>\n'+
		'<div class="read" >\n'+	// button positioning container
		'	<div class="button type2 center" title="'+rows[r].getElementsByTagName('td')[5].innerHTML+'" '+linkOpens+'>\n<p>';
		if (rows[r].getElementsByTagName('td')[6].innerHTML==mediaType[0][0] || rows[r].getElementsByTagName('td')[6].innerHTML=="") {
			item_html = item_html+unescape(mediaType[0][1]);
		} else if (rows[r].getElementsByTagName('td')[6].innerHTML==mediaType[1][0]) {
			item_html = item_html+unescape(mediaType[1][1]);
		} else if (rows[r].getElementsByTagName('td')[6].innerHTML==mediaType[2][0]) {
			item_html = item_html+unescape(mediaType[2][1]);
		} else if (rows[r].getElementsByTagName('td')[6].innerHTML==mediaType[3][0]) {
			item_html = item_html+unescape(mediaType[3][1]);
		} else if (rows[r].getElementsByTagName('td')[6].innerHTML==mediaType[4][0]) {
			item_html = item_html+unescape(mediaType[4][1]);
		} else {
			for (var m=0; m < mediaType.length; m++) {
				if (rows[r].getElementsByTagName('td')[6].innerHTML==mediaType[m][0]) {
					var mc = m
				} else {
					var mc = 0;
				}
			} 
			if (mc != 0) {
				item_html = item_html+unescape(mediaType[mc][1]);
			} else {
				item_html = item_html+rows[r].getElementsByTagName('td')[6].innerHTML;
			}
		}
		item_html=item_html+'</p></div></div>\n';
		item_html+='</div></div>\n\n';
		}
		}
	}
	
	if (into=='dropbar_thumbs') {
		if (!document.getElementById('dropbar_thumbs')) {
			// do nothing
		} else {
			var itemlist = document.getElementById('dropbar_thumbs');
			itemlist.innerHTML = item_html;
		}
	} else {
		for (var i=0; i < iscrollers.length; i++) {
				if (iscrollers[i][0] == 'binder' && iscrollers[i][1] != null) {
					onRebind(iscrollers[i][1]);
				}
		}
		
		if (!document.getElementById('item_list')) {
		var itemlist = document.createElement('ul');
		namelist.setAttribute('id','item_list');
		rackdoc.appendChild(itemlist);
		} else {
		var itemlist = document.getElementById('item_list');
		}
		itemlist.innerHTML = item_html;
	}
	
	if (RYU.config.filterall!=null) {  // animate covers when filtering
		var covers = document.getElementsByClassName('cover');
		for (c=0; c<covers.length; c++) {
				covers[c].className="cover cover_in";
		}
	}
	
}

function checkList(r) {
	for (var x=0; x < mylist.length; x++) {
		if ( catalog == mylist[x][0] && r == mylist[x][1] ) {
			return true;
		}
	}
}

function add2List(r,n,act) {
	if (checkList(r)) {
		alert(RYU._lc('This item is already on your reading list.'));
	} else {
		var ask = confirm(RYU._lc('Add to Reading List?'));
		if (ask == true) {
			if (mylist.length == 0) {
				document.getElementById('go2list').style.display="block"
			}
			var thisItem = [catalog,r];
			mylist.push(thisItem);
			updateReadingList();
			if (n!=null) {
				if (n=='dropbar_current') {
					document.getElementById('dropbar_current').removeChild(document.getElementById('numark'));
					refreshDropBar(r,act,1);
					RYU.changePage('left',1);
				} else {
					n.parentNode.getElementsByTagName('div')[0].style.display = "block";
					n.style.display = "none";
					n.parentNode.parentNode.parentNode.className="rack_card marked";
				}
			}
		}
	}
}

function removeMarkfromIndex(arr,m) {
	arr.splice(m,1);
}

function unMark(r,n,act) {
	var ask = confirm(RYU._lc('Remove from Reading List?'));
	if (ask == true) {
		for (var x=0; x < mylist.length; x++) {
			if ( catalog == mylist[x][0] && r == mylist[x][1] ) {
				var dex = x;
			}
		}
		if (dex == null) { alert(RYU._lc('App Error: can not find item in reading list')); return;}
		removeMarkfromIndex(mylist,dex);
		updateReadingList();
		if (n!=null) {
			if (n=='dropbar_current') {
				document.getElementById('dropbar_current').removeChild(document.getElementById('unmark'));
				refreshDropBar(r,act,1);
				RYU.changePage('left',1);
			} else {
			n.parentNode.getElementsByTagName('div')[1].style.display = "block";
			n.style.display = "none";
			n.parentNode.parentNode.parentNode.className="rack_card";
			}
		}
	}
}

function updateReadingList() {
	// Get rid of any existing cookie //
	Delete_Cookie("readinglist");
	// update and write new array //
	Set_Cookie("readinglist",mylist);
	if (mylist.length == 0) {
		document.getElementById('go2list').style.display="none";
	}
}

function getReadingListCovers(act) {
	// The thumbnails need to use the same method as the bar buttons //
	if (linkOpens.match(/onclick/g) || linkOpens.match(/ontouchstart/g) || linkOpens.match(/ontouchend/g)) {
		var stripAction = linkOpens.split('="'); stripAction = stripAction[1];
		var barAction = act+'="'+stripAction+'';
	} else {
		var barAction = linkOpens;
	}
	var rows = dataTbl.getElementsByTagName('tr');
	var item_html = "";
	for (var r=1; r < rows.length; r++) { // First TR is full of TH not TD
		var item_id = rows[r].getElementsByTagName('td')[0].innerHTML
		if (checkList(item_id)) {
		// If there is no cover image use the default one //
		if (rows[r].getElementsByTagName('td')[7].innerHTML=="") {
			var coverthumb = baseurl+'ryuzine/images/rack/default_thumbnail.jpg';
		} else {
			var coverthumb =rackImg()+rows[r].getElementsByTagName('td')[7].innerHTML;
		}
		item_html=item_html+'<div class="thumb"><span class="catid">'+item_id+'</span><div title="'+rows[r].getElementsByTagName('td')[5].innerHTML+'" '+barAction+'>'+
		'<img src="'+coverthumb+'"></div></div>';
		if (r==24) { r = rows.length; }; // No room for more so stop!
	}
	}
	return item_html
}


// ******** INITIALIZE RYUZINE ***************//
var init = function(pg) {
	body = document.getElementsByTagName('body')[0];
		up_box = document.getElementById('upbox');
		font_opt = document.getElementById('font_panel');
		color_opt = document.getElementById('colorbox');
		opt_slide = document.getElementById('opt_panel');
		opt_list = document.getElementById('optlist');
		toc_slide = document.getElementById('toc_panel');
		toc_list = document.getElementById('toclist');
		view_opt = document.getElementById('views_panel');
		controls = document.getElementById('tabbar0');
		slide_box = document.getElementById('slidebox1');
		light_box = document.getElementById('lightbox');
		lightshade = document.getElementById('shade');
		sh = document.getElementById('sheet');
		find_slide = document.getElementById('find_panel');
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
if (document.getElementsByClassName) {
	RYU.config.ovrCount = document.getElementsByClassName('vr').length;
} else {
	RYU.config.ovrCount = getElementsByClassName('vr').length;
}
var b = 0;

	// This apparently  ONLY way to cross-browser attach the onkeyup listener
	document.onkeyup = function(evt) {
		evt = evt || window.event;
		keyNav(evt);
	}
		if (RYU.config.ovrCount > 0 ) {
				window.addEventListener('orientationchange',function(){if(window.orientation){RYU.bookBinder();OVR.vrSliderFix();}},false);
				window.addEventListener('resize',function(){RYU.bookBinder;OVR.vrSliderFix();},false);
		} 
		else {
				window.addEventListener('orientationchange',function(){if(window.orientation){RYU.bookBinder();}},false);
				window.addEventListener('resize',function(){RYU.bookBinder()},false);
		}
		
	for (var a=0; a<pagecount; a++) {
		folio[a] = document.getElementById('folio'+a);
			shadow[a] = document.getElementById('shadow'+a);
				if (RYU.config.pageshadows == 0) {shadow[a].style.display = "none";}
			page[a] = document.getElementById('page'+a);

				live[a]	= document.getElementById('live'+a);
				column[a] = document.getElementById('column'+a);
				footer[a] = document.getElementById('footer'+a);
				marginL[a] = document.getElementById('marginleft-'+a);
				marginR[a] = document.getElementById('marginright-'+a);
	}
// build default options
var option = [ [],[],[],[],[],[],[],[],[],[],[] ];
option[0][0] = "toggle";
option[0][1] = "showpromos";
option[0][2] = "Featured Items";
option[0][3] = function(){RYU.promoToggle();};
option[0][4] = RYU.config.showpromos;

option[1][0] = "drop";
option[1][1] = "rackItems";
option[1][2] = "Item Limit";
option[1][3] = function(){RYU.limitItems(this.value);};
	// rectify number of items to allowable values
	if (RYU.config.rackItems >=100) { RYU.config.rackItems = 100;option[1][4] = [ ['5','5'],['10','10'],['20','20'],['50','50'],['100','100',1] ]}
	else if (RYU.config.rackItems <100 	&& RYU.config.rackItems >=50) { RYU.config.rackItems = 50;option[1][4] = [ ['5','5'],['10','10'],['20','20'],['50','50',1],['100','100'] ]}
	else if (RYU.config.rackItems <50 	&& RYU.config.rackItems >=20) { RYU.config.rackItems = 20;option[1][4] = [ ['5','5'],['10','10'],['20','20',1],['50','50'],['100','100'] ]}
	else if (RYU.config.rackItems <20 	&& RYU.config.rackItems >=10) { RYU.config.rackItems = 10;option[1][4] = [ ['5','5'],['10','10',1],['20','20'],['50','50'],['100','100'] ]}
	else if (RYU.config.rackItems <10 	&& RYU.config.rackItems >=5)  { RYU.config.rackItems = 5;option[1][4] = [ ['5','5',1],['10','10'],['20','20'],['50','50'],['100','100'] ]}
	else {RYU.config.rackItems = 10;option[1][4] = [ ['5','5'],['10','10',1],['20','20'],['50','50'],['100','100'] ]} // default value

option[2][0] = "toggle";
option[2][1] = "filterall";
option[2][2] = "Filter All"
option[2][3] = function(){RYU.filterToggle();};
option[2][4] = RYU.config.filterall;

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
option[5][2] = "Zoom & Pan";
option[5][3] = function(){RYU.zoomToggle();};
option[5][4] = RYU.config.zoompan;

option[6][0] = "toggle";
option[6][1] = "themeset";
option[6][2] = "Theme UI";
option[6][3] = function(){RYU.themeToggle();};
option[6][4] = RYU.config.themeset;

option[7][0] = "toggle";
option[7][1] = "nags";
option[7][2] = "Show All Dialogs";
option[7][3] = function(){};
option[7][4] = RYU.config.nags;

option[8][0] = "text";
option[8][1] = "optnotice";
option[8][2] = "Disabling features can improve performance.  Older browsers cannot display some options";
option[8][3] = null;
option[8][4] = null;

option[9][0] = "button3";
option[9][1] = "aboutbutton";
option[9][2] = "About Ryuzine";
option[9][3] = function(){RYU.toggleDialog('about');};
option[9][4] = null;

option[10][0] = "button4";
option[10][1] = 'altoptdone';
option[10][2] = 'Close';
option[10][3] = function(){RYU.togglePanel(4);};
option[10][4] = null;

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
	
	p=0;x=1;z=0;events=0;prevW=0;prevH=0;aCheck=null; // Default TOC Method
	
	// Integrated Ad Triggers //
if (splashad != 0 && !document.getElementById('skipad')) {
	splashad = 0;	// no splash ad was found during rewrite so zero out timer
}
    document.getElementById('under_glass').addEventListener(iDown,function(){RYU.togglePanel('all');},false);
	if (isNaN(RYU.config.appbanner)){
		document.getElementById('appbanner').className="appbanner_dn";
	}
	document.getElementById('appbanner').addEventListener(iDown,function(){RYU.restoreDefault(this);},false);
	// Set up events for UI //
		if (document.getElementById('appbanner').getElementsByClassName('xbox').length > 0) {
			document.getElementById('appbanner').getElementsByClassName('xbox')[0].addEventListener(iDown,function(){RYU.bannerClear();},false);
		}
	document.getElementById('page_first').addEventListener(iDown,function(){RYU.changePage('left',1);},false);
	document.getElementById('page_back').addEventListener(iDown,function(){RYU.changePage('left');},false);
	document.getElementById('page_next').addEventListener(iDown,function(){RYU.changePage('right');},false);
	document.getElementById('page_last').addEventListener(iDown,function(){RYU.changePage('right',1);},false);
	document.getElementById('fontbutton').addEventListener(iDown,function(){RYU.togglePanel(0);},false);
			document.getElementById('fontdone').addEventListener(iDown,function(){RYU.togglePanel(0);},false);
			document.getElementById('fontup').addEventListener(iDown,function(){RYU.resizeText(1);},false);
			document.getElementById('fontdn').addEventListener(iDown,function(){RYU.resizeText(-1);},false);
			document.getElementById('colors').addEventListener(iDown,function(){RYU.colorText();},false);
			document.getElementById('color_basic').addEventListener(iDown,function(){RYU.colorText(0);},false);
			document.getElementById('color_sepia').addEventListener(iDown,function(e){e=window.event? event : e;if(e.shiftKey){RYU.colorText(3);}else{RYU.colorText(1);}},false);			
			document.getElementById('color_black').addEventListener(iDown,function(e){e=window.event? event : e;if(e.shiftKey){RYU.colorText(4);}else{RYU.colorText(2);}},false);
	document.getElementById('sortbutton').addEventListener(iDown,function(){RYU.togglePanel(1);},false);
			document.getElementById('findbutton').addEventListener(iDown,function(){RYU.togglePanel(5);},false);
			document.getElementById('tocdone').addEventListener(iDown,function(){RYU.togglePanel(1);},false);
	document.getElementById('viewsbutton').addEventListener(iDown,function(){RYU.togglePanel(2);},false);
		document.getElementById('viewsdone').addEventListener(iDown,function(){RYU.togglePanel(2);},false);
		document.getElementById('viewbutton1').addEventListener(iDown,function(){RYU.changeView('rackgrid');RYU.togglePanel(2);},false);
		document.getElementById('viewbutton2').addEventListener(iDown,function(){RYU.changeView('rackdetail');RYU.togglePanel(2);},false);
		document.getElementById('viewbutton3').addEventListener(iDown,function(){RYU.changeView('racklist');RYU.togglePanel(2);},false);
		document.getElementById('viewbutton4').addEventListener(iDown,function(){RYU.togglePanel(2);RYU.controlsDelay(0);},false);
	document.getElementById('findall').addEventListener(iDown,function(){RYU.findThis();RYU.togglePanel(5);},false);
	document.getElementById('sharebutton').addEventListener(iDown,function(){RYU.togglePanel(3);},false);
	document.getElementById('optbutton').addEventListener(iDown,function(){RYU.togglePanel(4);},false);
		document.getElementById('optdone').addEventListener(iDown,function(){RYU.togglePanel(4);},false);
	
	if (maxpromos==0) {
		document.getElementById('opt_showpromos_li').style.display="none";
	}
	if (cssTransform != undefined) {
		if (cssTransitionDelay != undefined) {
		if ( (nativeScroll != undefined && nativeScroll != null) || (RYU.device.OS=="Android" && RYU.device.v >= 3) ) {

		} else {
			document.getElementById('opt_nscroll_li').style.display="none";
			RYU.config.nscroll = 0;
		}

		} else { // IE9 and FF 3.x can use most of the styles but cannot animate
		document.getElementById('opt_animate_li').style.display="none";
		document.getElementById('opt_nscroll_li').style.display="none";
		}
	} else {
		document.getElementById('opt_animate_li').style.display="none";
		document.getElementById('opt_nscroll_li').style.display="none";
		RYU.config.pageshadows = 0;
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
		aniToggle(RYU.config.animate);
		zoomToggle(RYU.config.zoompan);
		scrollToggle(RYU.config.nscroll);
		iScrollToggle(RYU.config.iscroll_iscroll);

	document.getElementById('zoom').addEventListener(iDown,function(){RYU.zoomMode();},false);
	// Set initial Items for Page //
	limitItems(RYU.config.rackItems);
	// Fix UI problem if Android 2.x //
	if (RYU.device.OS=="Android" && RYU.device.v < 3 ) {
			document.getElementById('binder').style.position="absolute";
	}
	//	bookBinder();
	if (!Get_Cookie("racklist")) {
		changeView('rackgrid');
	} else {
		changeView(''+Get_Cookie("racklist")+'')
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
				'	<p style="text-align:center;"><small><strong>Ryuzine Rack</strong><br/>'+
				'	'+RYU._lc("Version")+' '+version+'<br/></p>'+
				'	<p>'+RYU._lc("Ryuzine™ is a javascript application designed for publishing content to the web and mobile devices in a familiar magazine-style format.")+' '+RYU._lc("Publishing Kit available at")+' <a href="http://www.ryumaru.com/products/ryuzine" target="_blank">www.ryumaru.com</a>.</p>'+
				'	<p>'+RYU._lc("Ryuzine was created by K.M. Hansen, original code ©2011-2015 All Rights Reserved.")+'</p>'+
				'	<p>'+RYU._lc("Read the license and a list of project contributors:")+' <a href="'+baseurl+'ryuzine/LICENSE.txt" target="_blank">'+RYU._lc("LICENSE FILE")+'</a>, <a href="'+baseurl+'ryuzine/AUTHORS.txt" target="_blank">'+RYU._lc("CONTRIBUTORS")+'</a></p>'+
				'	<div id="rmlogo"></div>'+
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
if ( (RYU.device.OS == "Android" && RYU.device.v < 3) || (RYU.device.Platform == "Safari"  && RYU.device.v < 4) || (RYU.device.OS == "Windows Phone 7") ) { iScroll = undefined; }

	var panels = document.getElementsByClassName('style1');
	for (var a=0; a < panels.length; a++) {
		iScrollApply(panels[a]);
	}
	iScrollApply(document.getElementById('binder'),document.getElementById('binder'),'sheet');
	W = window.innerWidth;
	H = window.innerHeight;
	document.getElementById('spineshadow').style.zIndex=pagecount+1;
	elementSizes();
	prevW=W;
	prevH=H;

	splashAction();
	resizeBoxAd();

	if (RYU.device.OS=="iOS" && nativeScroll != undefined) {
		// iOS needs a temporary reflow to initialize native scrolling //
		up_box.style.display="block";
		setTimeout(function(){document.getElementById('upbox').style.display="none"},1000);
	}
	toc_addEventListeners();
}

var splashAction = function() {
		if (RYU.config.themeset!=0) {
			var checkval = 2;	// look for tcheck width 2px
		} else { 
			var checkval = 1;	// look for tcheck width 1px
		}
		if (handle==null) {
			handle = window.setInterval(function(){
				console.log('recheck!');
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
		splashAction = function(){};	// we only want this to run once!
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
	console.log('clearSplash('+adtime+')');
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
			var splashtime = parseInt( (parseFloat(duration)+parseFloat(delay)+adtime)*1000 ); 
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
			var splashtime = parseInt( (parseFloat(duration)+parseFloat(delay))*1000 );
			console.log('clear loadicon in '+splashtime+'ms');
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
	if (display=="block" && typeof iScroll != "undefined" && nscroll == 0 ) {
		if (livescroll[p] == null || livescroll[p] == undefined) {
		livescroll[p] = new iScroll(live[p], { scrollbarClass: 'iscrollbar', scrollbars: 'custom', mouseWheel: true, interactiveScrollbars: true});
		}
	} else {
		if (typeof iScroll != "undefined") {
			if (livescroll[p] != null || livescroll[p] != undefined) {
				livescroll[p].destroy();
				livescroll[p] = null;
			}
		}
	}
}

function out3d(p) {
	if (css3d == 1) {
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
	if (css3d == 1) {
		return "rotate3d(0,1,0,0deg)";
	} else {
		return "scaleX(1)";
	}
}

function changePage(dir,stop) {
	var pl = parseInt(document.getElementById('pagelimit').innerHTML);
	var cp = parseInt(document.getElementById('currentpage').innerHTML);
	if (RYU.config.animate==0) {
		if (dir=="left") {
			if (cp==1) {} else {
				setTimeout(function(){document.getElementById('loadicon').className="spinning";},100);
			if(stop!=null){sorter.move(-1,true);}else{sorter.move(-1);};
				if (window.innerWidth < 720) {
					document.getElementById('pagecounter').style.display = 'block';
					setTimeout(function(){document.getElementById('pagecounter').className='counter_in';},100);
				}
			}
		} else {
			if (cp==pl) {} else {
				setTimeout(function(){document.getElementById('loadicon').className="spinning";},100);
			if(stop!=null){sorter.move(1,true);}else{sorter.move(1);};
				if (window.innerWidth < 720) {
					document.getElementById('pagecounter').style.display = 'block';
					setTimeout(function(){document.getElementById('pagecounter').className='counter_in';},100);
				}
			}
		}
		setTimeout(function(){document.getElementById('loadicon').className="";folio[0].style[cssTransitionDuration]="1s";folio[0].className="folio sheet_in";hideRackTop();RYU.pullNames();},1100);
		setTimeout(function(){if(window.innerWidth<720){document.getElementById('pagecounter').className='';document.getElementById('pagecounter').style.display='';}},2000);	
	} else {
		folio[0].className="folio sheet_out_part_"+dir;
		if (dir=="left") {
			if (cp==1) {} else {
				setTimeout(function(){document.getElementById('loadicon').className="spinning";},100);
				if (window.innerWidth < 720) {
					document.getElementById('pagecounter').style.display = 'block';
					setTimeout(function(){document.getElementById('pagecounter').className='counter_in';},100);
				}
				folio[0].className="folio sheet_out_"+dir;
			setTimeout(function(){if(stop!=null){sorter.move(-1,true);}else{sorter.move(-1);};folio[0].style[cssTransitionDuration]="0s";folio[0].className="folio sheet_out_right";},1000);
			}
		} else {
			if (cp==pl) {} else {
				setTimeout(function(){document.getElementById('loadicon').className="spinning";},100);
				if (window.innerWidth < 720) {
					document.getElementById('pagecounter').style.display = 'block';
					setTimeout(function(){document.getElementById('pagecounter').className='counter_in';},100);
				}
				folio[0].className="folio sheet_out_"+dir;
			setTimeout(function(){if(stop!=null){sorter.move(1,true);}else{sorter.move(1);};folio[0].style[cssTransitionDuration]="0s";folio[0].className="folio sheet_out_left";},1000);	
			}
		}
		setTimeout(function(){document.getElementById('loadicon').className="";folio[0].style[cssTransitionDuration]="1s";folio[0].className="folio sheet_in";hideRackTop();RYU.pullNames();},1100);
		setTimeout(function(){if(window.innerWidth<720){document.getElementById('pagecounter').className='';document.getElementById('pagecounter').style.display='';}},2000);	
	}
}

function hideRackTop() {
	if (document.getElementById('currentpage').innerHTML=="1" && RYU.config.showpromos == 1) {
		document.getElementById('racktop').className = "show";
	} else {
		document.getElementById('racktop').className = "hide";
	}
}

 function carousel(dir,a) {
 	if (a==null) {
 		clearInterval(promotimer);
 	}
	var mypromos = document.getElementsByClassName('promo');
	var d = 0;
	if (dir==1) {
		for (var p=0; p < mypromos.length; p++) {
			// find current center promo
			if (mypromos[p].className=='promo promo_in') {
				d = p;
			}
			// shift deck from left -> right if necessary
			if (mypromos[p].className=='promo promo_wayout') {
				mypromos[p].className= 'promo promo_deck';
			}
		}
		mypromos[d].className='promo promo_out';
		if (d==0) { var plus1 = mypromos.length-1; var plus2 = mypromos.length-2;
		} else if (d==1) {
			var plus1 = d-1; var plus2 = mypromos.length-1;
		} else {    var plus1 = d-1; var plus2 = d-2; }
		mypromos[plus1].className='promo promo_wayout';
		mypromos[plus2].className='promo promo_deck';
		if (d==mypromos.length-1) { var minus1 = 0; var minus2 = 1;
		} else if (d==mypromos.length-2) {
			var minus1 = d+1; var minus2 = 0;
		} else { var minus1 = d+1; var minus2 = d+2; }
		mypromos[minus1].className='promo promo_in';
		mypromos[minus2].className='promo promo_ondeck';
	} else {
		for (var p=0; p < mypromos.length; p++) {
			// find current center promo
			if (mypromos[p].className=='promo promo_in') {
				d = p;
			}
			// shift deck right -> left if necessary
			if (mypromos[p].className=='promo promo_deck') {
				mypromos[p].className= 'promo promo_wayout';
			}
		}
		mypromos[d].className='promo promo_ondeck';
		if (d==0) { 		var minus1 = mypromos.length-1; var minus2 = mypromos.length-2;
		} else if (d==1) {	var minus1 = 0; var minus2 = mypromos.length-1;
		} else {			var minus1 = d-1; var minus2 = d-2; }
		mypromos[minus1].className='promo promo_in';
		mypromos[minus2].className='promo promo_out';
		if (mypromos.length>4) {
			// only do this if there are 5 or more promos
			if (d==mypromos.length-1) { var plus1 = 0; var plus2 = 1;
			} else if (d==mypromos.length-2) { var plus1 = d+1; var plus2 = 0;
			} else { plus1 = d+1; plus2 = d+2; }
			mypromos[plus1].className='promo promo_deck';
			mypromos[plus2].className='promo promo_wayout';
		}
	}
}

var showDetails = function(n) {
	var details = document.getElementById('slot'+n).innerHTML;
	addDialogBox('detailbox','Item Details',details);
	toggleDialog('detailbox');	// now open it
}

var rid = "";
function findThis() {
var b = document.getElementById('item_list');
var hilites = document.getElementsByName(rid);
for (var a=0; a < hilites.length; a++) {
	hilites[a].style.color = "";
	hilites[a].style.backgroundColor="";
	hilites[a].style.fontWeight="";
}

var s = document.getElementById('findinput').value;
if (s==" " || s=="" || s==null) { return };
var s='('+s+')';
var x=new RegExp(s,'gi');
var rn=Math.floor(Math.random()*100);
rid='s' + rn;

var h1s = b.getElementsByTagName('h1');
var h4s = b.getElementsByTagName('h4');
var ps = b.getElementsByTagName('p');

for (var a=0; a < ps.length; a++) {
	ps[a].innerHTML=ps[a].innerHTML.replace(x,'<span name="'+rid+'" style="color:#000;background-color:yellow; font-weight:bold;">'+'$1'+'</span>');
}
for (var a=0; a < h1s.length; a++) {
	h1s[a].innerHTML=h1s[a].innerHTML.replace(x,'<span name="'+rid+'" style="color:#000;background-color:yellow; font-weight:bold;">'+'$1'+'</span>');
}
for (var a=0; a < h4s.length; a++) {
	h4s[a].innerHTML=h4s[a].innerHTML.replace(x,'<span name="'+rid+'" style="color:#000;background-color:yellow; font-weight:bold;">'+'$1'+'</span>');
}
alert(RYU._lc('Found')+' ' + document.getElementsByName(rid).length + ' '+_lc('matches.'));
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
		swipeGesture(fingerSwipe,sideside);
	   	   	sideside = touch.pageX;
	   	   	touch=0;
	}

var swipeGesture = function (fingerSwipe,sideside) {
			// Leftbound Book
			if (fingerSwipe < sideside && (sideside-fingerSwipe) > 100 ) {
				changePage('right');
			}
			if (fingerSwipe > sideside && (fingerSwipe-sideside) > 100 ) {
				changePage('left');
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
	function tapCheck(action,args) {
		if (touchmoveCheck==1) {	// do not fire!
		} else {
			if (action=='list' || action==0) {
				RYU.swapList(args.element,args.panel,args.sort,args.catalog);
			} else if (action=='details' || action==1) {
				RYU.showDetails(args.item);
			} else if (action=='link' || action==2) {
				if (args.target=='inapp') {
					RYU.openInApp(args.url,args.cat);
				} else {
					window.open(args.url,args.target);
				}
			} else {
				// no idea so do nothing
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
		if (e.keyCode == keyL && !RYU.config.block_keynav()) {
			changePage('left');
		}
		if (e.keyCode == keyR && !RYU.config.block_keynav()) {
			changePage('right');
		} else {}
		if (e.keyCode == 36) { // Home Goes to Front Cover
			changePage('left',1);
		}
		if (e.keyCode == 35) { // End goes to back cover
			changePage('right',1);
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
			togglePanel(4);
		}
		if ( (e.keyCode == 187 || e.keyCode == 107) && e.ctrlKey) { // CTRL+[+] (Font +)
			resizeText(1);
		}
		if ( (e.keyCode == 189 || e.keyCode == 109) && e.ctrlKey) { // CTRL+[-] (Font -)
			resizeText(-1);
		}
		if (e.keyCode == 27) { // ESC from Dialogs
			RYU.toggleDialog('all');
		}
		if (e.keyCode == 45 && e.ctrlKey) { // CTRL + Insert (open bookmark manager)
			if (mylist.length > 0) {
			RYU.pullNames('reading_list');
			} else {
			alert(RYU._lc('Reading List is empty.'));
			}		
		}
		if (e.keyCode == 46 && e.ctrlKey && e.shiftKey) {
			var ask = confirm(RYU._lc('DELETE ENTIRE READING LIST? (Warning: This cannot be undone!)'));
			if (ask == true) {
				mylist = [];
				updateReadingList();
				pullNames();
			}
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
	panelopen[6] = 0;

function togglePanel(n) {
	onRebind(tocscroll);onRebind(optscroll);
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
	linkTargeting();changePage('left',1);
}


function swapList(n,panel,pp,cats) {
		n.className="list_down";
		setTimeout(function(){togglePanel(panel);},300);
		if (cats != null) {
			if (cats == "rl") {
				n.className="list_up";RYU.pullNames('reading_list');
			} else {
				setTimeout(function(){n.className="list_up";changeCatalogs(cats);},1000);
			}		
		} else {
		setTimeout(function(){n.className="list_up";sorter.wk(document.getElementById('table').getElementsByTagName('th')[pp].cellIndex);RYU.pullNames();},1000);
		}
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
	Set_Cookie('racklist',''+url+'');
	view = url; // Just in case cookies are disabled
		altview = 1;
		for (var i=0; i < iscrollers.length; i++) {
				if (iscrollers[i][0] == 'binder' && iscrollers[i][1] != null) {
					onRebind(iscrollers[i][1]);
				}
		}
		for (a=0; a<pagecount; a++) {
			column[a].setAttribute('style',''); // Nuke any element styles
			column[a].style.display="block";
			page[a].setAttribute('style',''); // Nuke element level styles
			page[a].style[cssTransform]="scaleX(1)"; // IE9 req explicit value
			page[a].style.visibility="visible";		 // FF3.x req explicit value
			folio[a].setAttribute('style',''); // Nuke
			folio[a].style[cssTransform]="scaleX(1)";
			folio[a].style.visibility="visible";
			live[a].style.height="auto";
		}
		document.getElementById('screen_format').href = ""+baseurl+"ryuzine/css/"+url+".css";
		if (url == "plain") {
			document.getElementById('this_issue').href = ""+baseurl+"ryuzine/css/blank.css";
		}
		else {
			document.getElementById('this_issue').href = ""+baseurl+"ryuzine/css/blank.css";
		}
		setTimeout(function(){bookBinder();},2000); //FF4 needs delay or it chokes
}

/* 	Guided Help Stuff
	Not Yet Implemented
*/

function writeHelp() {

}
	function helpPlay(a) {

	}
	function guidedHelp(s) {

	}
	// Automatic Play All Method //
	function playHelp(c) {

	}
// End New Guided Help Stuff //


function boxLink(b,l) {
	// Generic function to jump to links inside positioned scrolling divs //
	document.getElementById(b).scrollTop = document.getElementById(l).offsetTop;
}

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
	hidecontrols = setTimeout('RYU.controlsToggle('+c+')',2500);
}

function controlsToggle(c) {

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
				// if theme is empty check to see if there is a default theme set //
				var themepath = defaultTheme;
			} else {
				var themepath = ""+baseurl+"ryuzine/theme/"+theme+"/theme.css";
			}
			document.getElementById('ui_theme').href=themepath;
		} else {
			// If not swapping themes and default theme is set use it //
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
	} else {
	document.getElementById('opt_animate').className="opt-switch opt-on";
	}
}

function pgslideParent() {
	// if a theme swaps the positions of the tabbar and navbar this will move the appbanner too //
	if (document.getElementById('controlbox1').offsetTop<=0) {
		if (document.getElementById('appbanner').parentNode.id=='controlbox0') {
			document.getElementById('controlbox1').insertBefore(document.getElementById('appbanner'),document.getElementById('controlbox1').firstChild);
		}
	} else {
		if (document.getElementById('appbanner').parentNode.id=='controlbox1') {
			document.getElementById('controlbox0').insertBefore(document.getElementById('appbanner'),document.getElementById('controlbox0').firstChild);
		}
	}	
}


function scrollToggle(a) {
	if (a!=null) { RYU.config.nscroll = a; }
	if (RYU.config.nscroll==0) {
		document.getElementById('opt_nscroll').className="opt-switch opt-off";
	} else {
		document.getElementById('opt_nscroll').className="opt-switch opt-on";
	}
	if (!Get_Cookie("racklist")) {changeView(view);} else {changeView(''+Get_Cookie("racklist")+'');}
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
	if (altview==1) {if (!Get_Cookie("racklist")) {changeView(view);} else {changeView(''+Get_Cookie("racklist")+'');}}
	console.log('ISCROLL SWITCH: run bookBinder() in 1s');
	setTimeout(function(){bookBinder();},1000);
}

function zoomToggle(z) {
	if (z!=null) { RYU.config.zoompan = z; }
	if ('ontouchstart' in document.documentElement || RYU.device.Platform == "Firefox Mobile" || RYU.device.Platform == "Windows Phone 7" ) {
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
			if (RYU.device.OS=="Windows Phone 7") {
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

function filterToggle(a) {
	if (a!=null) { RYU.config.filter = a; }
	if (RYU.config.filter==0) {
		document.getElementById('opt_filterall').className = "opt-switch opt-off";
	} else {
		document.getElementById('opt_filterall').className = "opt-switch opt-on";
	}
}

function promoToggle(a) {
	if (a!=null) { RYU.config.showpromos = a;}
	if (RYU.config.showpromos==0) {
		document.getElementById('opt_showpromos').className = "opt-switch opt-off";
		hideRackTop();
	} else {
		document.getElementById('opt_showpromos').className = "opt-switch opt-on";
		hideRackTop();
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

function changeCatalogs(cats) {
	if (cats == null) {
		catalog = 0;
	} else { catalog = cats;};
	newSrc = 1;
	if (document.getElementById('loadbox') == undefined) {
		// Build Data Holder //
		var loadbox_dom = document.createElement('iframe');
		loadbox_dom.setAttribute('id','loadbox');
		loadbox_dom.setAttribute('style','display:none;');
		document.getElementsByTagName('body')[0].appendChild(loadbox_dom);
	}
	document.getElementById('loadbox').setAttribute('onload','RYU.loadRackData();');
	if (rackData[catalog][1]=="autocat"+catalog+"") {
		var catFile = document.getElementById('loadbox').contentWindow.document;
		catFile.open();
		catFile.write('<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Ryuzine Rack Data</title></head><body>'+
		document.getElementById(''+rackData[catalog][1]+'').innerHTML+'</body></head></body></html>');
		catFile.close();		
	} else {
		document.getElementById('loadbox').src = ''+baseurl+'data/'+rackData[catalog][1];			
	}
	clearInterval(promotimer);	// otherwise if new cat has fewer promos carousel would still animate
}

function loadRackData() {
	// Copy table from IFRAME into DIV
	document.getElementById('rackdata').innerHTML = document.getElementById('loadbox').contentWindow.document.getElementsByTagName('body')[0].innerHTML;
	document.getElementById('rackdata').getElementsByTagName('table')[1].setAttribute('id','table');
	// Remove IFRAME (delay prevents an onload "cancel" error in Safari, Removal prevents Native Scrolling error in iOS)
	setTimeout(function(){document.getElementsByTagName('body')[0].removeChild(document.getElementById('loadbox'));},1000);
	// Run Table Sorter on Div
	RYU.initSorter();
}

function openInApp(url,cid) {
	if (document.getElementById('detailbox')){
		RYU.toggleDialog('detailbox');
	}
	if (document.getElementById('longbox') == undefined) {
		if (document.getElementById('shade_box')) {
			body.removeChild(document.getElementById('shade_box'));
		}
		// Build Viewer Holder //
		var inappviewer_dom = document.createElement('div');
			inappviewer_dom.setAttribute('id','inappviewer');
			inappviewer_dom.className='out';
		var longbox_dom = document.createElement('iframe');
		longbox_dom.setAttribute('id','longbox');
		longbox_dom.className='longbox_out';
		inappviewer_dom.appendChild(longbox_dom);
		body.appendChild(inappviewer_dom);
		var backrack_dom = document.createElement('div');
		backrack_dom.setAttribute('id','dropbar');
		var b2r = document.createElement('div');
			b2r.id = "back2rack";
			b2r.className = "button type1 left";
			b2r.innerHTML = '<p><span class="symbol"></span><span class="label 1l0n">'+RYU._lc("Go Back to Rack")+'</span></p>';
			b2r.setAttribute('on'+iClick+'','RYU.back2rack();RYU.togglePanel(\'all\');');
		var dtab = document.createElement('div');
			dtab.id = "droptab";
			dtab.setAttribute('on'+iClick+'','RYU.toggleDropBar();RYU.togglePanel(\'all\');');
			dtab.innerHTML = '=';
		var rlist = document.createElement('div');
			rlist.id = "rlbutton";
			rlist.className = "button type1 right";
			rlist.innerHTML = '<p><span class="symbol"></span><span class="label l10n">'+RYU._lc("My List")+'</span></p>';
			rlist.setAttribute('on'+iClick+'','RYU.togglePanel(\'rlist_panel\');');		
		// Build Bookmarks Panel
		var bookmarks_dom = document.createElement('div');
		bookmarks_dom.setAttribute('id','rlist_panel');
		bookmarks_dom.className = "panel style1 right out";
		bookmarks_dom.innerHTML = '<div class="titlebar" id="bmark_titlebar">\n'+
		'<h1 id="bmarktitle" class="title l10n">Reading List</h1>\n'+
		'<div id="dropbar_current">\n'+
		'</div>\n'+
		'<div id="bmarkdone" class="button type2 done right" on'+iClick+'="RYU.togglePanel(\'rlist_panel\');"><p><span class="symbol"></span><span class="label l10n">Done</span></p>\n'+
		'</div>\n'+
		'</div>\n'+
		'<div id="bmarklist" class="area">\n'+
		'<div id="dropbar_thumbs" class="scrollbox">\n'+
		'</div>\n'+
		'</div>\n'+
		'<div class="pointer"></div>\n';
		backrack_dom.appendChild(b2r);
		backrack_dom.appendChild(dtab);
		backrack_dom.appendChild(rlist);
		backrack_dom.appendChild(bookmarks_dom);
		inappviewer_dom.appendChild(backrack_dom);
		iScrollApply('rlist_panel');
	}
	document.getElementById('dropbar').className="navbars dropbar_hide";
	document.getElementById('longbox').src = url;
	document.getElementById('longbox').className="longbox_in";
	setTimeout(function(){document.getElementById('inappviewer').className='in';document.getElementById('longbox').focus();},1000);
	refreshDropBar(cid);
}

//function refreshDropBar(cid,dbaction,chk) {
function refreshDropBar(cid,chk) {
	if (cid!=null) { 
		if (chk==null) {
			cid=cid.split(' ');
			cid=cid[0];
		}
		if (checkList(cid)) {
			document.getElementById('dropbar_current').innerHTML='<div id="unmark" class="button type2 quarter left" on'+iClick+'="RYU.unMark('+cid+',\'dropbar_current\',\'on'+iClick+'\');"><p><span class="symbol"></span><span class="label">'+RYU._lc("Delete")+'</span></p></div>';
		} else {
			document.getElementById('dropbar_current').innerHTML='<div id="numark" class="button type2 quarter left" on'+iClick+'="RYU.add2List('+cid+',\'dropbar_current\',\'on'+iClick+'\');"><p><span class="symbol"></span><span class="label">'+RYU._lc("Add")+'</span></p></div>';
		}
	} else {
		document.getElementById('dropbar_thumbs').innerHTML='';
	}
	RYU.pullNames('reading_list','dropbar_thumbs');
}

function back2rack() {
	document.getElementById('inappviewer').className='out';
}

function toggleDropBar() {
	if (typeof document.getElementById('dropbar') != undefined) { // make sure it exists first!
		var b2k = document.getElementById('dropbar');
		if (b2k.className=='navbars dropbar_hide') {
			b2k.className ='navbars dropbar_show';
		} else {
			b2k.className ='navbars dropbar_hide';
		}
	}
}	
	
	
if (RYU.device.OS == "Windows Phone 7" && RYU.device.bv >= 9 ) { // WP7 needs this to exist before flowing page //
// Note: Conditional Comments did not work for this! //
	document.write('<meta name="viewport" id="zooming" content="width=device-width,height=device-height,initial-scale=1.0,minimum-scale=1.0,maximum-scale=10.0,user-scalable=yes" />');
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
			back2rack : back2rack,
			toggleDropBar : toggleDropBar,
			openInApp : openInApp,
			baseurl : baseurl,
			device : RYU.device,
			init : init,
			bookBinder : bookBinder,
			loadRackData : loadRackData,
			changeCatalogs : changeCatalogs,
			initSorter : initSorter,
			changePage : changePage,
			limitItems : limitItems,
			pullNames : pullNames,
			carousel : carousel,
			changePage : changePage,
			bannerAd : bannerAd,
			bannerClear : bannerClear,
			showDetails : showDetails,
			resizeText : resizeText,
			colorText :colorText,
			tapCheck : tapCheck,
			scrollIt : scrollIt,
			touchScroll : touchScroll,
			mScrollItOn : mScrollItOn,
			mScrollItOff : mScrollItOff,
			keyNav: keyNav,
			swapList : swapList,
			changeView : changeView,
			toggleDialog : toggleDialog,
			hideDialog : hideDialog,
			togglePanel : togglePanel,
			toggleOptSwitch : toggleOptSwitch,
			setOptGhostList : setOptGhostList,
			zoomMode : zoomMode,
			zoomToggle : zoomToggle,
			findThis : findThis,
			defaultPrevention : defaultPrevention,
			preventDefault : preventDefault,
			restoreDefault : restoreDefault,
			enableDefault : enableDefault,
			touchmoveSet : function(v){touchmoveCheck=v;},
			touchmoveCheck : touchmoveCheck,
			is_supported : is_supported,
			helpPlay : helpPlay,
			playHelp : playHelp,
			guidedHelp : guidedHelp,
			controlsToggle : controlsToggle,
			controlsDelay : controlsDelay,
			controlSlide : controlSlide,
			promoToggle : promoToggle,
			filterToggle : filterToggle,
			themeToggle : themeToggle,
			aniToggle : aniToggle,
			scrollToggle : scrollToggle,
			iScrollToggle : iScrollToggle,
			iScrollApply  : iScrollApply,
			hasClass : hasClass,
			addClass : addClass,
			removeClass : removeClass,
			elementSizes : elementSizes,
			onDemand : onDemand,
			php : php,
			rackData : rackData,
			add2List : add2List,
			unMark : unMark,
			boxLink : boxLink,
			addon : addon,
			iEvent : iEvent,
			config : RYU.config

	}
}();
// Build UI //
window.onload = function() {
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
	document.getElementById('lightbox_format').href = "css/blank.css";
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
		if (anchor[a].href.match(/#/gi) && anchor[a].parentNode.className != "nav_link") {
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
		splashScreen = splashScreen.trim();
} else {
	var splashScreen = "";
}
// see if config file has custom title for this html document
if (RYU.config.rackTitle != "" && RYU.config.rackTitle != "Newsstand") {
	if (sourceFile.getElementsByTagName('title')[0].innerHTML=="Newsstand") {
		sourceFile.getElementsByTagName('title')[0].innerHTML=RYU.config.rackTitle;
	}
}

var imgCheck = [];
if (sourceFile.getElementById('splash_title')) {
	var sourceTitle = sourceFile.getElementById('splash_title');
	if (sourceTitle.childNodes.length > 0) {
		for (var s=sourceTitle.childNodes.length-1; s > -1; s--) {
			if (sourceTitle.childNodes[s].nodeName.toLowerCase() === 'img') {
				imgCheck.push(sourceTitle.childNodes[s].src);
				sourceTitle.removeChild(sourceTitle.childNodes[s]);
			}
		};
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
if (splashTitle == "") {
	if (sourceFile.getElementsByTagName('title').length > 0) {
		footerTitle = escape(sourceFile.getElementsByTagName('title')[0].innerHTML);
		footerTitle = smartQuotes(footerTitle);
	} else {
		footerTitle = escape("Newsstand");
	}
} else {
	footerTitle = splashTitle;
}

if (imgCheck.length > 0) { 	// we have a logo image
	applogo = escape('<img src="'+imgCheck[0]+'" id="app_logo" alt="'+footerTitle+'"/>'); // ignore all but first one
} else {
	applogo = '';
}

var customWidget = 0;
var socialWidget = null;

 if (sourceFile.getElementById('social_widget')) {
		socialWidget = sourceFile.getElementById('social_widget').innerHTML;
//		sourceFile.body.removeChild(sourceFile.getElementById('social_widget'));
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
	appbanner_html = appbanner_html+'\n<p class="xbox">Please visit and support our sponsors!<span>CLOSE [X]</span></p></div>';
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

if (document.getElementsByClassName) {
	var sectionHeads = sourceFile.getElementsByClassName('section_head');
} else {
	var sectionHeads = getElementsByClassName('section_head');
}
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

if (document.getElementsByClassName) {
	var pageBoxes = sourceFile.getElementsByClassName('page_box');
} else {
	var pageBoxes = getElementsByClassName('page_box');
}

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
	//			var framecount = findcount[1].split("cols");
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
	var splash_html = '<p id="skipad" onclick="RYU.clearSplash(0);">Skip Ad</p>'+splashScreen;
} else {
	var splash_html = '<div id="splashblock">\n'+
'<p class="splash-title">'+unescape(applogo)+unescape(splashTitle)+'</p>\n'+
'<p class="splash-port">a ryuzine rack<span>&trade;</span></p>\n'+
'</div>\n'+
'<p class="splash-fineprint">'+copyRight+'</p>\n';
}
splashbox_dom.innerHTML = '<div id="splashcell">'+splash_html+'</div>';

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
'<div id="live'+x+'" class="live">\n'+
'<div id="column'+x+'" class="columns '+pageBoxColumns[x]+'">'+pageBox[x]+
'</div>\n'+
'</div>\n'+
'<div id="footer'+x+'" class="footer">\n'+
'<p>'+splashTitle+' <span class="pgnum"><span class="rdash"> -</span> '+x+' <span class="ldash">-</span> </span></p>\n'+
'</div>\n'+
'<div id="marginleft-'+x+'" class="flipleft flipper">\n'+
'<div class="margin-arrow"></div>\n'+
'</div>\n'+
'<div id="marginright-'+x+'" class="flipright flipper">\n'+
'<div class="margin-arrow"></div>\n</div>\n'+bmark+
'\n</div></div>\n';
}
// End of Pages Area //
binder_html=binder_html+'<div id="bmark"></div><div id="spineshadow" class="spine_fill"></div>\n';

// Build Exit Message //
binder_html = binder_html+'<div id="plankR" class="plank right">'+exitSign+'</div>\n</div>\n</div>\n';
binder_dom.innerHTML = binder_html

// Build Navbars for Phone UI //
var controlsTop_dom = document.createElement('div');
controlsTop_dom.setAttribute('id','controlbox0');
controlsTop_dom.className = "navbars_show";
var controlsTop_html ='<div id="zoom" class="button"><p><span class="symbol"></span><span class="label"></span></p></div>\n'+
'<p id="pagecounter"><span class="l10n">Page</span> <span id="currentpage"></span> / <span id="pagelimit"></span></p>\n'+
'<div id="appbanner" class="appbanner_up">\n'+
'<div class="appbannerbox">\n'+appbanner_html+'</div>\n'+
'</div>\n'+
'<div id="navbar0" class="navbars">\n';
if (applogo != '') {
	appTitle = applogo;
	RYU.config.applogo = applogo;
} else {
	appTitle = splashTitle;
	RYU.config.applogo = appTitle;
}

controlsTop_html=controlsTop_html+'<div id="navset0" class="navset nav_in">\n'+
'	<div class="titlebar"><h1 class="title">'+unescape(appTitle)+'</h1>\n'+
'</div>\n'+
'	<div id="page_first" class="button type1 left"><p><span class="symbol"></span><span class="label l10n">First</span></p></div>\n'+
'	<div id="page_back"  class="button type1 left"><p><span class="symbol"></span><span class="label l10n">Back</span></p></div>\n'+
'	<div id="page_last" class="button type1 right"><p><span class="symbol"></span><span class="label l10n">Last</span></p></div>\n'+
'	<div id="page_next" class="button type1 right"><p><span class="symbol"></span><span class="label l10n">Next</span></p></div>\n'+
'</div>\n';
controlsTop_dom.innerHTML = controlsTop_html;


// Build Tabbar at bottom of UI //
var controlsBot_dom = document.createElement('div');
controlsBot_dom.setAttribute('id','controlbox1');
controlsBot_dom.className = "tabbars_show";
var controlsBot_html='<div id="controltoggle" class="button up"><p><span class="symbol"></span><span class="label"></span></p></div>\n'+
'<div id="tabbar0" class="tabbars">\n'+
'<div id="controlset0" class="controlset control_in">\n'+
'<div class="button type1 quarter left" id="sortbutton"><p><span class="symbol"></span><span class="label l10n">Sort</span></p></div>\n'+
'<div class="button type1 quarter left" id="fontbutton"><p><span class="symbol"></span><span class="label l10n">Font</span></p></div>\n'+
'<div class="button type1 quarter center" id="sharebutton"><p><span class="symbol"></span><span class="label l10n">Share</span></p></div>\n'+
'<div class="button type1 quarter right" id="optbutton"><p><span class="symbol"></span><span class="label l10n">Options</span></p></div>\n'+
'<div class="button type1 quarter right" id="viewsbutton"><p><span class="symbol"></span><span class="label l10n">Views</span></p></div>\n'+'</div>\n'+
'<!--// End of controls //-->\n'+
'</div>\n</div>\n';
controlsBot_dom.innerHTML=controlsBot_html;

// Create container for UI Elements //
var upbox_dom = document.createElement('div');
upbox_dom.setAttribute('id','upbox');

var glass_dom = document.createElement('div');
glass_dom.id = "under_glass";

// Build Fonts Panel //
var fonts_dom = document.createElement('div');
fonts_dom.setAttribute('id','font_panel');
fonts_dom.className = "panel style3 out";
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

// Build SORT Panel //
var toc_dom = document.createElement('div');
toc_dom.setAttribute('id','toc_panel');
toc_dom.className = "panel style1 left out";
var toc_html = '<div class="titlebar" id="toc_titlebar">\n'+
'<h1 id="sorttitle" class="title l10n">Sort List</h1>\n'+
'<div class="button type1 quarter right" id="findbutton"><p><span class="symbol"></span><span class="label l10n">Find</p></div>\n'+
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
views_dom.className = "panel style2 out";
var views_html = '<div class="titlebar">\n'+
'<h1 id="viewstitle" class="title l10n">Other Views</h1>\n'+
'<div id="viewsdone" class="button type2 right">\n'+
'<p>Done</p>\n'+
'</div>\n'+
'</div>\n'+
'<div class="area">\n'+
'<div id="viewbutton1" class="button type3"><p><span class="symbol"></span><span class="label l10n">Gallery Grid</span></p></div>\n'+
'<div id="viewbutton2" class="button type3"><p><span class="symbol"></span><span class="label l10n">Detail List</span></p></div>\n'+
'<div id="viewbutton3" class="button type3"><p><span class="symbol"></span><span class="label l10n">Simple List</span></p></div>\n'+
'<div id="viewbutton4" class="button type4"><p><span class="symbol"></span><span class="label l10n">Cancel</span></p></div>\n'+
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

// Build Search Box //
var find_dom = document.createElement('div');
find_dom.setAttribute('id','find_panel');
find_dom.className = "panel style3 out";
find_dom.innerHTML = '<div id="findbox">\n<input type="text" id="findinput" value="" onfocus="this.value=\'\';">\n<a id="findall" href="#">\n<div class="button type2 right">\n<p><span class="symbol"></span><span class="label l10n">Find All</span></p>\n</div>\n</a>\n</div>\n\n<div class="pointer"></div>';

// Put all the UI Elements in the upbox //
upbox_dom.appendChild(glass_dom);
//upbox_dom.appendChild(bookmarks_dom);
upbox_dom.appendChild(fonts_dom);
upbox_dom.appendChild(toc_dom);
upbox_dom.appendChild(views_dom);
upbox_dom.appendChild(share_dom);
upbox_dom.appendChild(options_dom);
upbox_dom.appendChild(find_dom);

// Build Lightbox Gallery //
// Build Lightbox Gallery //
var lightbox_dom = document.createElement('div');
	lightbox_dom.id = 'lightbox';
var lightbox_shade = document.createElement('div');
	lightbox_shade.id = 'shade';
	lightbox_dom.appendChild(lightbox_shade);

	
for (x=lightBoxes.length-1; x >= 0; x--) {
	if (lightBoxes[x].id != 'boxad') {	// moved to dialog
	lightbox_dom.appendChild(lightBoxes[x]);
	}
}
// Pan-Zoom Control //
var pan_dom = document.createElement('div');
pan_dom.setAttribute('id','pan');
pan_dom.className = "pan_off";

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

// Build Data Holder //
var loadbox_dom = document.createElement('iframe');
loadbox_dom.setAttribute('id','loadbox');
loadbox_dom.setAttribute('style','display:none;');
if (RYU.rackData[0][1]=="autocat0") { 
loadbox_dom.src = "";
} else {
loadbox_dom.src = ""+RYU.baseurl+"data/"+RYU.rackData[0][1]+"";
loadbox_dom.setAttribute('onload','RYU.loadRackData();');
}

var databox_dom = document.createElement('div');
databox_dom.setAttribute('id','rackdata');

var body = document.getElementsByTagName('body')[0];
body.id = "ryuzinerack";
body.innerHTML="";	/* IE discards DOM content inside it so we need to do splash after */


body.appendChild(splashbox_dom);
body.appendChild(load_icon);
body.appendChild(binder_dom);
body.appendChild(upbox_dom);
body.appendChild(lightbox_dom);
body.appendChild(pan_dom);
//if (sourceFile.getElementById('appbanner')) {
//	body.removeChild(sourceFile.getElementById('appbanner'));
//}
body.appendChild(controlsTop_dom);
body.appendChild(controlsBot_dom);
body.appendChild(help_dom);
body.appendChild(databox_dom);
body.appendChild(loadbox_dom);
//buildOptions();
// Error catch any missing required elements
if (!document.getElementById("racktop") || !document.getElementById('item_list') || !document.getElementById('footer')) {
	var fakepage = document.getElementById('column0');
		fakepage.innerHTML = '';
	var rack_top = document.createElement('div');
		rack_top.id = 'racktop';
		rack_top.className = 'run-ads';
	fakepage.appendChild(rack_top);
	var listo = document.createElement('div');
		listo.id = 'item_list';
	fakepage.appendChild(listo);
}
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
console.log(RYU.rackData[0][1]);
	if (RYU.rackData[0][1]=="autocat0") {
		document.getElementById('loadbox').setAttribute('onload','RYU.loadRackData();');
		var catFile = document.getElementById('loadbox').contentWindow.document;
		catFile.open();
		catFile.write('<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Ryuzine Rack Data</title></head><body>'+
		document.getElementById('autocat0').innerHTML+'</body></head></body></html>');
		catFile.close();
	}

} else {
	alert('ERROR: This is not a valid Ryuzine Rack HTML file.');
}
console.log('Rack Rewrite Done');	
}
}

