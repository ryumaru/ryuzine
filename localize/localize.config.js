/*
name	: Localize
version	: 1.0
author	: K.M. Hansen
url		: http://www.kmhcreative.com/labs
license	: MIT
about	: Automatically changes the Ryuzine UI language.  Translations by Google Translate.

	Set 2-character language code in ryuzine.config.js file
	If the language you need is not already in the file you can add/edit
	the localization strings in the files inside the "language" folder.
	Then add the country code to the array below to make it a valid option.
	
	If the language has much longer words than english or uses a monospace
	font, or if you need to provide a special font for the language, also
	include custom styling in the /localize/css/ folder.
	
	All translations were done by Google Translate and may not be accurate.
	If you can help correct, improve, or expand please do! 
	
	!!!!! IMPORTANT: THIS SHOULD BE THE FIRST ADD-ON YOU LOAD !!!!!
	Other add-ons may need to know if localization is being used to set localized strings.
	
*/

RYU.addon.register(function(){			
var codes = ['da','de','el','en','es','fi','fr','hi','it','ja','ko','no','pt','ru','sv','zh_HANS','zh_HANT'];	// valid country codes
if (codes.indexOf(RYU.config.language)===-1) {RYU.config.language = 'en';}	// sets default language if code is invalid
if (document.getElementById('ryuzinewriter')) {
	var app = 'writer_';
} else {
	var app = '';
}
return {
		name : 'localize',
		info : {
			name	: "Localize",
			version	: "1.0",
			author	: "K.M. Hansen",
			url		: "http://www.kmhcreative.com/labs",
			license	: "MIT",
			about	: "Automatically changes the Ryuzine UI language.  Translations by Google Translate."
		},
		inject : {
			js:[
				['language/'+app+RYU.config.language+'.js?1.0',0,'lang']
			]
		},
		translate : function() {
			var localize = document.getElementsByClassName('l10n');
			for (var t=0; t < localize.length; t++) {
				if (RYU.config.localize[''+localize[t].innerHTML.replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+'']) {	// replace innerHTML
					localize[t].innerHTML = RYU.config.localize[''+localize[t].innerHTML.replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+''];
				}
				if (localize[t].hasAttribute('title')) {
					if (RYU.config.localize[''+localize[t].title+'']) { // replace title
						localize[t].title = RYU.config.localize[''+localize[t].title+''];
					}
				}
			};
			RYU._lc = function(string,context) {		// redefine to gettext from translation library
					string.toString();	// make sure it is a string
					if (context==null){context='contrib';};RYU.addon.localize.modals[''+context+'']=RYU.addon.localize.modals[''+context+'']||[];RYU.addon.localize.modals[''+context+''].push(string);
					if (RYU.config.localize[''+string.replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+'']) {
						string = RYU.config.localize[''+string.replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+''];
					}
					return string;
				}
		},
		append  : function(appendix) {
			if (appendix==null) { return;}	// no object no append
			for (t in appendix) {
				if (!RYU.config.localize[t]){
					RYU.config.localize[t] = appendix[t];
				}
			};
			delete appendix; // we are done with it so trash it
		},
	/*	parse function automatically retrieves all localizable strings so you can make translations easier, 
		Type: RYU.addon.localize.parse() into the console to open dialog.  See documentation for use.	*/
		parse : function(element,raw,context){
			RYU.config.parse_element = element; // pass element if any
			RYU.config.parse_raw = raw;			// pass list type if any
			RYU.config.parse_context = context; // pass context if any
			RYU.addon.register({name:'localize',inject:{js:[
				['contrib/'+app+'modals.js'],	// get list of dynamic strings
				['contrib/localize.parse.js']	// rewrite parse function with script
			]}
			});
		},
	/*	merge function loads two plain text files and attempts to merge them into a single localization file.
		Type: RYU.addon.localize.merge() into the console to open dialog.  See documentation for use.
	*/
		merge : function(base,lang,type,code){
			RYU.config.merge_base = base; // pass base language txt file
			RYU.config.merge_lang = lang; // pass translated language txt file
			RYU.config.merge_type = type; // pass type of merged file to output	
			RYU.config.merge_code = code; // pass language code for merged file	
			RYU.addon.register({name:'localize',inject:{js:[
				['contrib/localize.merge.js']	// rewrite parse function with script
			]}
			});
		},
		modals : {}
	}
}());