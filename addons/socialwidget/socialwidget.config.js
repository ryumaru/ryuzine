/*	
name	: "Social Widget",
version	: "1.0",
author	: "K.M. Hansen",
url		: "http://www.kmhcreative.com/labs",
license	: "MIT",
about	: "Default social media sharing widget for Ryuzine."
	
	If no custom social/sharing widget is detected this is the default
	one that will be loaded.  As this is handled by the rewrite function
	you should never have to actually include this addon in your config file.
	
*/
RYU.addon.register({
	name : 'socialwidget',
	info : {
		name	: "Social Widget",
		version	: "1.0",
		author	: "K.M. Hansen",
		url		: "http://www.kmhcreative.com/labs",
		license	: "MIT",
		about	: "Default social media sharing widget for Ryuzine."
	},
	inject : {js:[['socialwidget.js?1.0',0,'socialwidget']]}
});
