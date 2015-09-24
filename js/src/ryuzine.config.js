/*	RYUZINE READER/RACK CONFIG FILE
	Version 1.0
	
	Load this file before ryuzine.js or ryuzine.rack.js
*/

var RYU = RYU || {};
RYU.config = {
	/* 	LOCALIZATION SETTINGS	*/
	language	:	"en",		// ISO 639-1 language code (ignored is "localize" add-on is not loaded)
	/*	RYUZINE READER/RACK		*/
	binding		:	"left",		// Book Binding "spine" side
	pgsize		:	0,			// 0 = square | 1 = tall | 2 = fill all
	zoompan		:	0,			// User Scale-Able: 0 = no | 1 = yes
	maxzoom		:	5.0,		// Maximum Zoom Factor (if zooming is enabled)
	viewani		:	1,			// 0 = on | 1 = off : Animate Changing Views
	pgslider	:	0,			// 0 = on | 1 = off	: Page Slider navigation on load
	bmarkData	:	[			// Default preset Reader bookmarks : ["label","URL"]
		["Ryuzine User Forums","http://www.ryumaru.com/forum/"],
		["Ryu Maru Website","http://www.ryumaru.com"]
	],
	/*	RYUZINE RACK SETTINGS	*/
	rackTitle	:	"Newsstand",	// Optional custom title for Ryuzine Rack
	rackItems	:	10,				// 0 = default | value = number of items per page (5, 10, 20, 50, 100)
	linkOpens	:	0,				// 0 = default | 1 = _self | 2 = _blank | 3 = _parent | 4 = _top | 5 = inrack | "id" = window id
	rackData	:	[				// Data Catalog in /data/cat/ folder : ["Label","filename.htm"]
		["Catalog 1","catalog1.htm"]
	],
	mediaType	:	[			// Media Types : ["type","label"]
		["Ryuzine","Read Now"],
		["Download","Download ⬇"],
		["PDF","Download ⬇"],
		["Print","$ Buy Now"],
		["Website","View Site"]
	],
	/* 	THEME SETTINGS			*/
	swapThemes	:	0,				// 0 = no | 1 = yes : Swap themes based on device type
	deskTheme	:	"urban",		// Fallback theme for unspecified desktop/laptop OS
	winTheme	:	"urban",		// General Windows desktop/laptop systems
	macTheme	:	"mobilefruit",	// Macintosh Systems
	nixTheme	:	"",				// Linux Systems
	iOSTheme	:	"mobilefruit",	// iOS Devices (iPad, iPhone, iPod Touch)
	andTheme	:	"paperbot",		// Android Phones and Tablets
	wp7Theme	:	"urban",		// Windows Phone 7 devices
	w8mTheme	:	"urban",		// Windows 8.x desktop/laptops in "Metro" mode
	wOSTheme	:	"",				// WebOS (legacy device)
	bbtTheme	:	"",				// BlackBerry Tablet (legacy device)
	/* 	INTEGRATED ADVERTISING 	*/
	splashad	:	0,			// 0 = no splash ad | value = display time for ad in seconds
	boxad		:	0,			// 0 = no box ad	| value = display time in seconds | "x" = persistent (user must close)
	appbanner	:	0,			// 0 = no banner ad	| value = display time in seconds | "x" = persistent (user must close)
	autopromo	:	5,			// 0 = off | value = animation interval in seconds (Ryuzine Rack)
	maxpromos	:	5,			// Maximum number of promotions in carousel	(Ryuzine Rack)
	AddOns		: [

	]
};