/*
name	: "OVR Player",
version	: "1.0",
author	: "K.M. Hansen",
url		: "http://www.kmhcreative.com/labs/ovr/",
license	: "MIT",
about	: "Turns a sequence of images taken around an object into an Virtual Reality Object you can spin left-right."

	
	IMPORTANT: You should load this add-on AFTER any lightbox add-on you may be using.
	If the OVR object cannot initially be rotated unless or until the browser is resized
	or the device orientation is changed this add-on initialized too late to overwrite the
	RYU.lightBox function.  Try moving it even later, or to the end, of your list of add-ons
	in your configuration file.

 */

// Instead of loading config.ovr.js let's just do it here so there's only ONE config file!
var com = com || {};
	com.kmhcreative = com.kmhcreative || {};
	com.kmhcreative.Ovr = com.kmhcreative.Ovr || {};

com.kmhcreative.Ovr.config = function(){
	// let's take advantage of Ryuzine's localization function
	if (RYU.addon.localize) {
		switch(RYU.config.language) {
		case 'en':
		var label = 'Hold+Drag Left/Right to Rotate';
		break;
		case 'de':
		var label = 'Halten Sie+Drag links/rechts zu drehen';
		break;
		case 'es':
		var label = 'Mantenga+Arrastrar Izquierda/Derecha para girar';
		break;
		case 'fr':
		var label = 'Tenez+Drag gauche/droite pour faire pivoter';
		break;
		case 'ja':
		var label = '回転するように+ドラッグ左/右を押したまま';
		break;
		case 'zh_HANS':
		var label = '按住并拖动左/右旋转';
		break;
		case 'zh_HANT':
		var label = '按住並拖動左/右旋轉';
		break;
		case 'da':
		var label = 'Hold+Træk venstre/højre for at rotere';
		break;
		case 'fi':
		var label = 'Pidä+Drag vasen/oikea Kierrä';
		break;
		case 'el':
		var label = 'Κρατήστε+Σύρετε αριστερά/δεξιά για να περιστρέψετε';
		break;
		case 'hi':
		var label = 'बारी बारी से करने के लिए+खींचें वाम/अधिकार पकड़ो';
		break;
		case 'it':
		var label = 'Tenere+Trascina sinistra/destra per ruotare';
		break;
		case 'ko':
		var label = '회전+드래그 왼쪽/오른쪽을 잡고';
		break;
		case 'no':
		var label = 'Hold+Drag venstre/høyre for å rotere';
		break;
		case 'pt':
		var label = 'Segure+arraste para a esquerda/direita para girar';
		break;
		case 'ru':
		var label = 'Держите+Drag влево/вправо, чтобы повернуть';
		break;
		case 'sv':
		var label = 'Håll+Drag Vänster/höger för att rotera';
		break;
		default:
		var label = 'Hold+Drag Left/Right to Rotate';
		};
	} else {
		var label = 'Hold+Drag Left/Right to Rotate';
	}	
	return {
		preload: "yes",
		divBox: "none",
		shiftvr: 0,
		showmessage: "yes",
		messagetext: label
	}
}();
com.kmhcreative.Ovr.vrSliderFix = function(){}; // dummy to be replaced
 
 
RYU.addon.register(
{
	name : 'ovr-addon',
	requires : ['ryuzinereader'],
	info : {
		name	: "OVR Player",
		version	: "1.0",
		author	: "K.M. Hansen",
		url		: "http://www.kmhcreative.com/labs/ovr/",
		license	: "MIT",
		about	: "Turns a sequence of images taken around an object into an Virtual Reality Object you can spin left-right."
	},

	inject : {
		css:[
			['ovr/ovr.css',0]
		],
		js: [
			['ovr/ovr.swap.js',0],
			['ovr/ovr.js',0]
		]
	},
	actions : function(){
		window.addEventListener('orientationchange',function(){if(window.orientation){com.kmhcreative.Ovr.vrSliderFix();}},false);
		window.addEventListener('resize',function(){com.kmhcreative.Ovr.vrSliderFix();},false);
		setTimeout(function(){
			com.kmhcreative.Ovr.init();
			/*	LightBox content is initially hidden so OVR cannot get coordinates for slidezone
				so we need to run vrSliderFix whenever the lightBox is opened which means appending
				to the existing lightBox function like so:
			*/
			RYU.lightBox = (function(){
				var cached_function = RYU.lightBox;
				return function(x,y){
					cached_function.apply(this,arguments);
					setTimeout('com.kmhcreative.Ovr.vrSliderFix()',2000);	// allow animation to play out before getting coordinates
				};
			}());
		},2000);
	}
}
);