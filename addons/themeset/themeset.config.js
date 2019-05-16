/*	
name	: "Set Theme Add-On",
version	: "1.0",
author	: "K.M. Hansen",
url		: "http://www.kmhcreative.com/labs",
license	: "MIT",
about	: "Replaces Theme UI toggle switch in Options Panel with drop-down list."
	
	It works whether swapThemes is in use or not, but there is a slight
	delay before the preference setting kicks in meaning the end user
	sees a glimpse of the default or swapped theme before it is replaced
	by the user's preference.

*/
RYU.addon.register(function(){
	var themes = [
		['none','NONE'],
		['comix','Comix'],
		['comix_dark','Comix Dark'],
		['dark','Dark Color'],
		['light','Light Color'],
		['light_writer','Light Writer'],
		['mobilefruit','Mobile Fruit'],
		['mobilefruit_writer','Mobile Fruit Writer'],
		['paperbot','PaperBot'],
		['urban','Urban'],
		['writer','Writer']		
	]
	// find the defaultTheme (if any)
	var curtheme = document.getElementById('ui_theme').href.split('/theme/')[1].split('/')[0];
	for (var t=0; t < themes.length; t++) {
		if (themes[t][0]==curtheme) {	// current theme matches a theme value in array
			RYU.config.themeset_mytheme = curtheme;	// create and set config value
			break;
		}
	}
	// hide the Theme UI toggle switch
	if (document.getElementById('ryuzinewriter')) {
		document.getElementById('opt_rzw_themeset_li').style.display = 'none';
		var toggleid = 'mytheme_rzw';
		var subfoldr = 'ryuzinewriter';
		var themecss = 'writer.css';
	} else {
		document.getElementById('opt_themeset_li').style.display = 'none';
		var toggleid = 'mytheme';
		var subfoldr = 'ryuzine';
		var themecss = 'theme.css';
	}
	return {
		name : 'themeset',
		info : {
			name	: "Set Theme Add-On",
			version	: "1.0",
			author	: "K.M. Hansen",
			url		: "http://www.kmhcreative.com/labs",
			license	: "MIT",
			about	: "Replaces Theme UI toggle switch in Options Panel with drop-down list."
		},
		ui : {
			controls : [
				['drop',toggleid,'Theme UI',function(){RYU.addon.themeset.pickTheme();},themes,1],
			]
		},
		pgslideParent : function() {
			if (document.getElementById('ryuzinereader')) {	// only one with a tocslider
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
		},
		pickTheme : function() {
			var mytheme = document.getElementById('themeset_'+toggleid+'').value;
			if (mytheme == 'none') {
				mytheme = 'dark'; RYU.config.themeset = 0;RYU.config.rzw_themeset = 0;
			} else { RYU.config.themeset = 1;RYU.config.rzw_themeset = 1;}
			document.getElementById('ui_theme').href = RYU.baseurl+subfoldr+'/theme/'+mytheme+'/'+themecss;
			if (!document.getElementById('ryuzinewriter')){
				setTimeout("RYU.addon.themeset.pgslideParent()",1000);	// reflow before checking position
			}
		},
		// set drop down list and switch to that theme
		actions : setTimeout(function(){RYU.setOptGhostList('themeset_'+toggleid+'',1);RYU.addon.themeset.pickTheme();},300)
	}
}()
);