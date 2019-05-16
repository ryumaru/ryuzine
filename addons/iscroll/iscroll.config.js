/*
name	: iScroll
version	: 5.0
author	: Matteo Spinelli
url		: http://iscrolljs.com/
license	: MIT
about	: Adds iOS style scrolling regardless of platform.  Adapted for Ryuzine by K.M. Hansen.
	
	You can update the iScroll version by simply grabbing the latest
	ZIP from:
	
	https://github.com/cubiq/iscroll/archive/master.zip
	
	While iScroll does work on newer Android devices it can prevent regular links from
	being clickable, so native scrolling is recommended.  However, native scrolling can
	cause misfires on those same links.  To enable iScroll on Android change the variable
	below to "true."
	
*/

RYU.addon.register(function(){
	var android = false;	// <-- true | false : enable/disable iScroll on Android
	var name = 'iscroll';
	var info = {
			name	: "iScroll",
			version	: "5.0",
			author	: "Matteo Spinelli",
			url		: "http://iscrolljs.com/",
			license	: "MIT",
			about	: "Adds iOS style scrolling regardless of platform.  Adapted for Ryuzine by K.M. Hansen."
		}
	if ( (RYU.device.OS == "Android" && android == false) || 
		 (RYU.device.Platform == "Safari"  && RYU.device.v < 4) || 
		 (RYU.device.OS == "Windows Phone 7") ) { 
			iScroll = undefined;
			return {
				name : name,
				info : info
			}
	} else {
		// Localization strings
		if (RYU.addon.localize) {
			switch(RYU.config.language) {
			case 'en':
			var label = 'iScroll Scrolling';
			break;
			case 'de':
			var label = 'iScroll Scrolling';
			break;
			case 'es':
			var label = 'Toque iScroll';
			break;
			case 'fr':
			var label = 'Tactile iScroll';
			break;
			case 'ja':
			var label = 'スクロールiScroll';
			break;
			case 'zh_HANS':
			var label = 'iScroll滚动';
			break;
			case 'zh_HANT':
			var label = 'iScroll滾動';
			break;
			case 'da':
			var label = 'iScroll Rulning';
			break;
			case 'fi':
			var label = 'iScroll Vieritys';
			break;
			case 'el':
			var label = 'iScroll Scrolling';
			break;
			case 'hi':
			var label = 'स्क्रॉलिंग iScroll';
			break;
			case 'it':
			var label = 'iScroll Scorrimento';
			break;
			case 'ko':
			var label = '스크롤 iScroll';
			break;
			case 'no':
			var label = 'iScroll Rulling';
			break;
			case 'pt':
			var label = 'iScroll Rolagem';
			break;
			case 'ru':
			var label = 'Прокрутка iScroll';
			break;
			case 'sv':
			var label = 'iScroll Rullning';
			break;
			default:
			var label = 'iScroll Scrolling';
			};
		} else {
			var label = 'iScroll Scrolling';
		}
		return {
			name : name,
			info : info,
			inject : {js:[['/iscroll-master/build/iscroll.js?5.0',1,'iscroll_script']]},
			ui : {controls : [['toggle','iscroll',label,function(){RYU.iScrollToggle()},1,1]]}
		}
	}
}()
);
setTimeout('RYU.bookBinder()',1000);