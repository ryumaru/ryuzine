/*
name	: Lightbox
version	: 1.0
author	: K.M. Hansen
url		: http://www.kmhcreative.com/labs
license	: MIT
about	: The original Ryuzine integrated lightbox, broken out into an add-on

	This is the original Ryuzine integrated lightbox which has been broken out
	into an add-on.  If your Ryuzine source file uses the older markup for lightbox
	links and lightboxed content you should use this add-on.  If you are using the
	new method with direct-linking to media and galleries use the "RyuBox" add-on.

 */
RYU.addon.register({
	name : 'lightbox',	//<-- required!
	info : {
		name	: "Lightbox",
		version	: "1.0",
		author	: "K.M. Hansen",
		url		: "http://www.kmhcreative.com/labs",
		license	: "MIT",
		about	: "The original Ryuzine integrated lightbox, broken out into an add-on"
	},
	requires : ['!ryulightbox','!ryuzinewriter'],
	inject : {			
		js:[
			['js/lightbox.js?1.0']
		],
		css:[
			['css/lightbox.css?1.0',1]
		]
	},
	galleryscroll : []
});
