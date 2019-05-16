/*	LOCALIZE MERGE SCRIPT

	RYU.addon.localize.merge(base,lang,type,code);	// Opens the Merge Dialog with parameters and processes them if it can.

	Parameters:
	base	= the base language (english) text file.
	lang	= the translated strings text file.
	type	= format of the merged output, valid values are:
			  0 = for the Localize Add-On (placed in /addons/localize/language/)
			  1 = for a Custom Add-On (place in /addons/youraddon/language/)
	code 	= language code for this translation (will use “xx” if none is given)

If PHP File Operations are not available you’ll have to manually copy and paste the output of the merge into a file and save it.

*/
// prevent injection of this file from repeating
delete RYU.addon.localize.inject;
if (RYU.config.xfileman == 1) {
	// add PHP File operations to dialog
	if (!document.getElementById('ryuzinewriter')){ var writeto = ''; } else { var writeto = 'ryuzinewriter/';}
	var d_content = '<iframe id="save_merged_frame" scrolling="no" src="'+writeto+'addons/localize/contrib/save_strings.php" style="display:none;"></iframe>';
	var d_action = [
		['button1','merge1','Process',function(){RYU.addon.localize.merge(); return false;},'rotate left'],
		['button1','merge2','Save',function(){RYU.saveMergedStrings(); return false;},'save right']
	];
	// append RYU with new function to handle creating localization string files
	RYU.saveMergedStrings = function() {
		// reference to iframe with id 'ifrm'
		var ifrm = document.getElementById('save_merged_frame');
		// reference to window in the iframe
		var win = ifrm.contentWindow;
		// reference to document in iframe
		var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
		// reference to a form named 'ifrmTest' in iframe
		var form = doc.getElementById('save_strings_form');
		// Port content into form field //
		doc.getElementById('save_strings_scope').value = RYU.config.merge_scope || '';
		doc.getElementById('save_strings_type').value = 1;	// we only want a .js file
		doc.getElementById('save_strings_code').value = RYU.config.merge_code;
		doc.getElementById('save_strings_content').value = document.getElementById('merged_text').value;	
		// Submit the form //
		form.submit();
	}
} else {
	var d_content = '';
	var d_action = [		['button1','merge1','Process',function(){RYU.addon.localize.merge(); return false;},'rotate left']];
	RYU.addon.localize.merge = function(){alert('PHP File Operations are not available so Merge functions will not work.')};
}
// register new dialog for output of parse
RYU.addon.register({
	name: 'localize',
	ui : {
		dialogs : [
			['mergefiles','Merge Files','Base Text: <input type="text" id="base_file"/> Translation:<input type="text" id="lang_file"/>\n'+
			'Language: <input type="text" id="lang_code" value="en"/> Format: <select id="merge_type">'+
			'<option value="0">Localize Add-On</option><option value="1">Custom Add-On</option><option value="2">Xinha Editor</option></select>\n<br/>'+
			'Merged Output:\n'+
			'<textarea id="merged_text" style="width:98%;height:190px;resize:vertical;"></textarea>'+d_content,
			d_action,
			1]
		]
	}
});
// redefine merge function
RYU.addon.localize.merge = function(base,lang,type,code) {
	if (!document.getElementById('localize_mergefiles') || document.getElementById('localize_mergefiles').className=='ryudialog out'){
		RYU.toggleDialog('localize_mergefiles');
	}
	base = base || document.getElementById('base_file').value;
	lang = lang || document.getElementById('lang_file').value;
	type = type || document.getElementById('merge_type').value || 0;
	code = code || document.getElementById('lang_code').value || 'en';
	if (base==null||lang==null) { return;}	// need input first!
	if (!base.match(".txt") || !lang.match(".txt")) {
		alert('Only TXT files can be merged!');
		base = null; lang = null;
		return;
	}
	if (!document.getElementById('ryuzinewriter')){ var writeto = ''; } else { var writeto = 'ryuzinewriter/';}
	// pass values into config and form
	RYU.config.merge_base = base; document.getElementById('base_file').value = base;
	RYU.config.merge_lang = lang; document.getElementById('lang_file').value = lang;
	RYU.config.merge_type = type; document.getElementById('merge_type').value = type;
	RYU.config.merge_code = code; document.getElementById('lang_code').value = code;
	var parse  = writeto+'addons/localize/contrib/'+base;
	var merge  = writeto+'addons/localize/contrib/'+lang;	
	var xmlhttp, basetext;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', parse, false);
	xmlhttp.send();
	basetext = xmlhttp.responseText;
	basetext = basetext.split(/\n|\r/g);
	var filter = [];
	for (var b=0; b < basetext.length; b++) {
		if (basetext[b]!='') {
			filter.push(basetext[b].replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;"));
		}
	}
	basetext = filter;
	filter = [];
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', merge, false);
	xmlhttp.send();
	newtext = xmlhttp.responseText;
	newtext = newtext.split(/\n|\r/g);
	for (var n=0; n < newtext.length; n++) {
		if (newtext[n]!=''){
			filter.push(newtext[n].replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;"));
		}
	}
	newtext = filter;
	if (type=='1') {	// format for Custom Ryuzine Add-On
		var strings='\/* Add-On Localization File for language code "'+code+'"\n'+
				'	Place this script inside a "language" folder\n'+
				'	inside your Add-On and then call it on register:\n'+
				'		inject : {\n'+
				'			js : [\n'+
				'				["/language/addon_"+RYU.config.language+".js"]\n'+
				'			]\n'+
				'		}\n'+
				'	This appends the  RYU.config.localize object\n'+
				'	then it runs the translate function'+
				'*\/\n\n'+
				'if (RYU.addon.localize){RYU.addon.localize.append({\n';
		for (var b=0; b < basetext.length; b++) {
			if (b==basetext.length-1) { var cs='';}else{var cs=',';}
			strings += '"'+basetext[b]+'" : "'+newtext[b]+'"'+cs+'\n';
		}
		strings += '});RYU.addon.localize.translate();};';
		RYU.config.merge_scope = 'addon';	
	} else if (type=='2') {	// format for Xinha Editor
		var strings = '// I18N constants\n'+
		'// LANG: "'+code+'", ENCODING: UTF-8N\n'+
		'\n'+
		'{\n';
		for (var b=0; b < basetext.length; b++) {
			if (b==basetext.length-1) { var cs='';}else{var cs=',';}
			strings += '"'+basetext[b]+'" : "'+newtext[b]+'"'+cs+'\n';
		}
		strings += '};';
		RYU.config.merge_scope = 'xinha';
	} else {	// format for Localize Add-On
		if (document.getElementById('ryuzinewriter')) { 
				var scope = 'ryuzinewriter'; var whichapp = 'Ryuzine Writer'; var subset = 'writer_'; var config = 'writer.config.js';
		} else {
			if (document.getElementById('ryuzinereader')) { var scope = 'ryuzinereader';
			} else if (document.getElementById('ryuzinerack')) { var scope = 'ryuzinerack'; } else { var scope = '';}
				var whichapp = "Ryuzine Reader/Rack/Press"; var subset = ''; var config = 'ryuzine.config.js';}
		var strings=''+
			'\/*	'+whichapp+' Localization Add-On\n'+
			'	Version 1.0\n'+	
			'	Language Code: '+code+'\n\n'+
			'	Set the language country code in '+config+'\n'+
			'*\/\n\n'+
			'RYU.config.localize = {\n';
		for (var b=0; b < basetext.length; b++) {
			if (b==basetext.length-1) { var cs='';}else{var cs=',';}
			strings += '"'+basetext[b]+'" : "'+newtext[b]+'"'+cs+'\n';
		}
		strings += '};\nRYU.addon.localize.translate();';
		RYU.config.merge_scope = scope;
	}
	document.getElementById('merged_text').value = strings;
}
RYU.addon.localize.merge(RYU.config.merge_base,RYU.config.merge_lang,RYU.config.merge_type,RYU.config.merge_code);