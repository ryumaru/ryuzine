/*	
name	: "RYU Lightbox",
version	: "1.0",
author	: "K.M. Hansen",
url		: "http://www.kmhcreative.com/labs",
license	: "MIT",
about	: "The new, simpler to use Ryuzine Lightbox."

	If you are using the new method with direct-linking to media and galleries 
	use the "RyuBox" add-on.If your Ryuzine source file uses the older markup 
	for lightbox links and lightboxed content you should use the "lightbox" add-on.  

 */

RYU.addon.register({
	name : 'ryulightbox',
	info : {
		name	: "RYU Lightbox",
		version	: "1.0",
		author	: "K.M. Hansen",
		url		: "http://www.kmhcreative.com/labs",
		license	: "MIT",
		about	: "The new, simpler to use Ryuzine Lightbox."
	},
	requires : ['!lightbox','!ryuzinewriter'],
	/* 	CONFIG OPTIONS:
		reltxt : 'lightbox',	string to match that tells script this is a lightbox link
		single : 0 | 1,			0 = single lightbox | 1 = group single lightboxes into gallery
		iframe : true|false,	true = allow iframed content | false = offsite links open in new window
	*/
	config : {
		reltxt : 'lightbox',
		single : 0,
		iframe : false
	},
	inject : {			
		js:[
			['js/ryulightbox.js?1.0']
		],
		css: [
			['css/ryulightbox.css?1.0']
		]
	}
});