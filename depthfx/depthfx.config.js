/*	
name	: Depth FX
version	: 1.0
author	: K.M. Hansen
url		: http://www.kmhcreative.com/labs
license	: MIT
about	: Adds aesthetic shading effects to Ryuzine Reader (formerly called pagecurves)


	effects added on top of whatever theme might be applied.  
	This used to be the "pagecurves" add-on + the "spineshadow"
	functions. It also adds a switch to the Options panel to control it,
	and a cookie to remember the setting.

*/
RYU.addon.register(function(){
	if (RYU.config.binding=='right') {
		var stylesheet = 'rightbound.css?1.0';
	} else {
		var stylesheet = 'leftbound.css?1.0';
	}
	// Localization strings
	if (RYU.addon.localize) {
		switch(RYU.config.language) {
		case 'en':
		var label = 'Depth Effects';
		break;
		case 'de':
		var label = 'Schatten FX';
		break;
		case 'es':
		var label = 'Shadow FX';
		break;
		case 'fr':
		var label = 'Ombre FX';
		break;
		case 'ja':
		var label = '深さ効果';
		break;
		case 'zh_HANS':
		var label = '深度影响';
		break;
		case 'zh_HANT':
		var label = '深度影響';
		break;
		case 'da':
		var label = 'Dybde effekter';
		break;
		case 'fi':
		var label = 'Varjot';
		break;
		case 'el':
		var label = 'Σκιά FX';
		break;
		case 'hi':
		var label = 'गहराई प्रभाव';
		break;
		case 'it':
		var label = 'Ombra FX';
		break;
		case 'ko':
		var label = '깊이 효과';
		break;
		case 'no':
		var label = 'Dybde Effekter';
		break;
		case 'pt':
		var label = 'Sombra FX';
		break;
		case 'ru':
		var label = 'Тень FX';
		break;
		case 'sv':
		var label = 'Skugga FX';
		break;
		default:
		var label = 'Depth Effects';
		};
	} else {
		var label = 'Depth Effects';
	}

	return {
		name : 'depthfx',
		requires : ['ryuzinereader'],
		info : {
			name	: "Depth FX",
			version	: "1.0",
			author	: "K.M. Hansen",
			url		: "http://www.kmhcreative.com/labs",
			license	: "MIT",
			about	: "Adds aesthetic shading effects to Ryuzine Reader (formerly called &quot;pagecurves&quot;)"
		},

		inject : {
			css:[
				[stylesheet,0,'depthfx']
			]
		},

		ui : {
			controls : [
				['toggle','depth',label,function(){RYU.addon.depthfx.toggleDepth(''+stylesheet+'')},1,1]
			]
		},
		toggleDepth : function(s) {
			if (s==null) { s = stylesheet; }
			console.log('TOGGLE DEPTH: s = '+s);
			var link = document.getElementById('depthfx');
			if (RYU.config.depthfx_depth==1) {
				link.href = RYU.baseurl+'ryuzine/addons/depthfx/'+s;
			} else {
				link.href = "";
			}
		},
		actions : function(){
			// remove on Android devices due to browser bug
			if (RYU.device.OS=="Android") {
				document.getElementById('opt_depthfx_depth_li').parentNode.removeChild(document.getElementById('opt_depthfx_depth_li'));
				document.getElementById('depthfx').parentNode.removeChild(document.getElementById('depthfx'));
				document.getElementById('AddOn_depthfx').parentNode.removeChild(document.getElementById('AddOn_depthfx'));
				delete RYU.config.depthfx_depth;
				delete RYU.addon.depthfx;
			} else {
				RYU.addon.depthfx.toggleDepth(''+stylesheet+'');
			}
		}
	}
}()
);
