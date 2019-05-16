/*	LOCALIZE PARSE SCRIPT

	parse ( element , format , context );

		element : omit | ‘’ | 0 | ID = 	If omitted, empty quotes, or zero the element is the entire webapp.  If you provide an ID only items inside the named element
										with class=“l10n” will be returned.

		format : 0 | 1 = 	zero (default) is to return the raw strings.  “1” will return strings formatted for a translation file (you should only use “1” if you are not using
				   			the PHP File Operations and have to copy & paste the output into a file manually).

		context : ‘webapp’ | ‘addon_name’ = This will pull and merge in any strings used in “modal” dialog boxes.  Since they do not exist within the document structure
							    			there would normally be no way to retrieve them.  You have to set these up in your add-on beforehand, however.  Anything
							    			sent to “_lc()” with a context will be added to a modal context list of strings that can be retrieved via the add-on’s name.
	Duplicate strings are automatically removed.
*/
// prevent injection of this file from repeating
delete RYU.addon.localize.inject;
if (RYU.config.xfileman == 1) {
	// add PHP File operations to dialog
	if (!document.getElementById('ryuzinewriter')) { var writeto = '';} else { var writeto = 'ryuzinewriter/';}
	var d_content = '<iframe id="save_strings_frame" scrolling="no" src="'+writeto+'addons/localize/contrib/save_strings.php" style="display:none;"></iframe>';
	var d_action = [
		['button1','parse1','Process',function(){RYU.addon.localize.parse(); return false;},'rotate left'],
		['button1','parse2','Save',function(){RYU.saveLocalizationStrings(); return false;},'save right']
	];
	// append RYU with new function to handle creating localization string files
	RYU.saveLocalizationStrings = function() {
		// reference to iframe with id 'ifrm'
		var ifrm = document.getElementById('save_strings_frame');
		// reference to window in the iframe
		var win = ifrm.contentWindow;
		// reference to document in iframe
		var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
		// reference to a form named 'ifrmTest' in iframe
		var form = doc.getElementById('save_strings_form');
		// Port content into form field //
		doc.getElementById('save_strings_scope').value = RYU.config.parse_element;
		doc.getElementById('save_strings_type').value = RYU.config.parse_raw || 0;
		doc.getElementById('save_strings_content').value = document.getElementById('translation').value;	
		// Submit the form //
		form.submit();
	}
} else {
	var d_content = '';
	var d_action = [['button1','parse1','Process',function(){RYU.addon.localize.parse(); return false;},'rotate left']];
}
// register new dialog for output of parse
RYU.addon.register({
	name: 'localize',
	ui : {
		dialogs : [
			['parseoutput','Parse Output','Type: <select id="parse_type">'+
			'<option value="0">Raw Strings</option>'+
			'<option value="1">Formatted Strings</option>'+
			'</select>'+
			'<span id="parse_name">Element:<input type="text" id="parse_element" /></span>'+
			'<br/>Context: <input type="text" id="parse_context"/> <small><em>("webapp" or optional name of Add-On)</em></small>'+
			'<br/>Parse Output:\n'+
			'<textarea id="translation" style="width:98%;height:125px;resize:vertical;"></textarea>'+d_content,
			d_action,
			1]
		]
	}
});
// redefine parse function
RYU.addon.localize.parse = function(element,raw,context) {
		if (RYU.config.language!='en') {
			alert('Ryuzine is already localized to "'+RYU.config.language+'". Set language to "en" in config file and re-run parse()');
			return;
		}
		if (!document.getElementById('localize_parseoutput') || document.getElementById('localize_parseoutput').className=='ryudialog out'){
			RYU.toggleDialog('localize_parseoutput');
		}
	element = element || document.getElementById('parse_element').value || '';
	context = context || document.getElementById('parse_context').value || '';
	console.log('element = '+element+' : context = '+context);
	if (element == null || element == '' || element == '0') {
		if (document.getElementById('ryuzinewriter')) {
			element = 'ryuzinewriter';
		} else if (document.getElementById('ryuzinereader')) {
			element = 'ryuzinereader';
		} else if (document.getElementById('ryuzinerack')) {
			element = 'ryuzinerack';
		} else {
			console.log('cannot determine webapp'); return;
		}
		context = 'webapp';
	}
	raw = raw || document.getElementById('parse_type').value.split(',')[1] || 0;
	// pass values into config and form
	RYU.config.parse_element = element; document.getElementById('parse_element').value = element;
	RYU.config.parse_raw = raw; document.getElementById('parse_type').value = raw;
	RYU.config.parse_context = context; document.getElementById('parse_context').value = ''+context+'';
	// now get all the l10n elements!
		if (element != 'ryuzinewriter' && element != 'ryuzinereader' && element != 'ryuzinerack') {
			var gettext = document.getElementById(''+element+'').getElementsByClassName('l10n');
		} else {
			var gettext = document.getElementsByClassName('l10n');
		}
		var innerText = function(element) {	// Make sure content contains a text string
			if ('innerText' in document.documentElement) {
				return element.innerText;	// webkit and IE browsers
			} else if ('textContent' in document.documentElement) {
				return element.textContent;	// firefox
			} else {
				return element.innerHTML;	// whatever
			}
		}
		var localize = [];
		for (var x=0; x < gettext.length; x++) {
			// Add Inner HTML Text
			if (localize.indexOf(gettext[x].innerHTML) < 0) { localize.push(gettext[x].innerHTML);}
			// Add Title Attribute Text
			if (gettext[x].hasAttribute('title')) {
				if (localize.indexOf(gettext[x].title) < 0) { localize.push(gettext[x].title); }
			}
		}
		if ( context !=null && context != '' && RYU.addon.localize.modals[context] != undefined) {
			console.log('RYU.addon.localize.modals['+context+'] = '+RYU.addon.localize.modals[context]);
			var merge  = localize.concat(RYU.addon.localize.modals[context]);
			localize   = merge.filter(function(item,pos){return merge.indexOf(item)==pos});
		}
	
		if (raw==null || raw=='0') {	// default is raw string output for copy+paste to translation utility
			var strings = '';
			for (var s=0; s < localize.length; s++) {
				strings += localize[s].replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+'\n\n';
			}
			if (RYU.config.xfileman=='1') {
				alert('Save file for merge operation.  Then copy and paste the text into an auto-translation utility or send it to a translator');
			} else {
				alert('Copy and paste the text into an auto-translation utility or send it to a translator');
			}
		} else {
			if (element != 'ryuzinewriter' && element != 'ryuzinereader' && element != 'ryuzinerack' ) {
					var strings='\/* Localization String Output for Element ID "'+element+'"\n'+
							'	Copy and Paste the strings below into an empty file\n'+
							'	save it into your Add-On as "/language/xx.js" where\n'+
							'	"xx" is the language code.  Then translate each string\n'+
							'	into the corresponding language and call it on register:\n'+
							'		inject : {\n'+
							'			js : [\n'+
							'				["/language/"+RYU.config.language+".js"]\n'+
							'			]\n'+
							'		}\n'+
							'	This appends the  RYU.config.localize object\n'+
							'	then you should make string replacements like:\n'+
							'		_e("My String")\n'+
							'*\/\n\n'+
							'if (RYU.addon.localize){RYU.addon.localize.append({\n';
				for (var s=0; s < localize.length; s++) {
					strings += '"'+localize[s].replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+'" = " ";\n';
				}
					strings += '})};';
			} else {
				if (document.getElementById('ryuzinewriter')) { 
						var whichapp = 'Ryuzine Writer'; var subset = 'writer_'; var config = 'writer.config.js';
				} else {var whichapp = "Ryuzine Reader/Rack/Press"; var subset = ''; var config = 'ryuzine.config.js';}
				if (RYU.config.xfileman=='1') {
				alert('Save the output to a file.  It will be in:\n'+
					'	/addons/localize/contrib/'+subset+'_xx.js\n'+
					'Copy and paste translation strings into the empty quotes\n'+
					'opposite the english strings and then rename the file using\n'+
					'the country code to replace the "xx" in the file name\n'+
					'and then move the file to:\n'+
					'	/addons/localize/language/');
				} else {
				alert('Copy and Paste this into a new Javascript document and save it to:\n'+
					  '		/addons/localize/language/'+subset+'_xx.js\n'+
					  'Copy and paste translation strings into the empty quotes\n'+
					  'opposite the english strings and then rename the file using\n'+
					  'the country code to replace the "xx" in the file name\n'+
					  'and then move the file to:\n'+
					  '		/addons/localize/language/');s
				}
				var strings=''+
					'\/*	'+whichapp+' Localization Add-On\n'+
					'	Version 1.0\n\n'+
					'	Language Code: xx\n\n'+
					'	Set the language country code in '+config+'\n'+	
					'	Enter localization strings for standard UI below.\n'+
					'*\/\n\n'+
					'RYU.config.localize = {\n';
				for (var s=0; s < localize.length; s++) {
					if (s==localize.length-1) { var cs = ''} else {var cs = ',';}
					strings += '"'+localize[s].replace(/\"/g, '&#34;').replace(/\n|\r|<br\s*\/?>/gi," ").replace(/&amp;|\s&\s/gi,"&#38;")+'" : " "'+cs+'\n';
				}
				strings += '};\nRYU.addon.localize.translate();';
			}
		}
		document.getElementById('translation').value = strings;
	};
RYU.addon.localize.parse(RYU.config.parse_element,RYU.config.parse_raw,RYU.config.parse_context);