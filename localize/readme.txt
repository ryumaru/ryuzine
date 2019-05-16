RYUZINE LOCALIZE ADD-ON
Version 1.0
=======================

The new “Localize” add-on is much more robust and efficient than the old one.  It now contains translations for ALL of the webapps, with separate string replacement files for “Writer” and “Reader/Rack/Press.”

LOCALIZING ADD-ONS
===================

The recommended method for providing a translation in your Add-On is to use the “inject:js” to load a language file.  Best practice is to place all your translation string files inside a “/language” or “/lang” sub-folder within your add-on.

LOCALIZING STRINGS

If you are writing into an element with innerHTML() you can simply wrap the localizable strings with the class “l10n” (lower-case “L”, number 10, lowercase “N”) like this:

	var content = ‘<input type=“checkbox” id=“mycheck”/><span class=“l10n”>My Checkbox</span>’;

If you are using the UI Builder functions all the labels and titles are automatically set to support localization, but you may still need to provide translations for custom text:

	var checklabel = “My Checkbox”;
	. . . .
	ui : {
		controls : [
			[‘checkbox’,’mycheck’,checklabel,function(){MyFunction();},0,0,’’]
		]
	},

You shouldn’t need to run the Localize “translate()” function, it is automatically run when your translation strings file is loaded.  The only time you’d need to run it manually is if you are using an alternative method for localizing the strings within your add-on (see “Other Methods” below).

The other way to localize strings is to use the “_lc()” function, which is an on-demand way to gettext and return a translated string (if one is available), otherwise it just echoes the string back.  
	
	RYU._lc( string , context );
	string = either a string in quotes or a passed variable that is a string.
	context = the name of your add-on (technically optional, but useful for parse)


This is the only way to provide localization support for strings that cannot be wrapped in the “l10n” CSS class name.  You should use this to translate title and value attributes and the text of modal dialogs (alert, confirm, and prompt boxes).  You should include the “context” parameter too, which will make it easy to add all these strings to those found in the document by “parse” (more on that later):


	var checklabel = RYU._lc(“My Checkbox”,”myaddon”);
	var checkval = RYU._lc(“All”,”myaddon”);
	var notice = RYU._lc(“All items selected”,”myaddon”);
	. . . .
	ui : {
		controls : [
			[‘checkbox’,’mycheck’,checklabel,function(){alert(‘’+notice+’’);},checkval,0,’’]
		]
	},

By declaring the variables with the _lc() function it checks the available strings and returns the translation if one is found.  You should therefore always load scripts BEFORE you add UI controls or your custom strings won’t yet be available.

TRANSLATION FILES

The translation files inside your add-on’s “/language” folder should each be a javascript file named with the country code (en.js, de.js, ja.js, etc).  Within that file the format is:

	if (RYU.addon.localize) { RYU.addon.localize.append({
		“Base Language String 1” : “Translation 1”,
		“Base Language String 2” : “Translation 2”,
		. . . .
		“Base Language String X” : “Translation X”
	})};RYU.addon.localize.translate();

The Localize “append” function checks your translation strings against those already loaded and only adds the new ones.  Then it runs the “translate()” function which swaps out the “base” strings with the translated strings.

You don’t have to make these files from scratch.  The Localize add-on also has utility functions for parsing translatable strings and merging translation string files to make it easier for you to support multiple languages in your add-on.  See the section below on “Parse” and “Merge.”

HINT: You should include an “en.js” file so there won’t be a 404 error, but the file itself can be empty if your Add-On was originally written in English.


LOAD  YOUR TRANSLATIONS

HINT: load your translation file before other files and before using the UI Builder.

You most likely only want to enqueue the language strings file if the Localize add-on is enabled.  If your add-on registers with an anonymous function you can do it like this in your add-on config.js file:

	if (RYU.addon.localize) {
		var lang = [‘language/‘+RYU.config.language+’.js’];
	} else {
		var lang = ‘’;
	}
	. . . .
	return {
		inject : {
			js : [ lang ]
		}
	}

If you haven’t provided translations for all the languages supported by the Localize add-on you can also change the “IF” statement to check that the language set in the config file is among the translations you’ve provided, and if not, doesn’t try to load a (non-existent) file:

	var codes = [ja’,’ko’,’zh_HANS’];
	if (RYU.addon.localize && codes.indexOf(RYU.config.language)!=-1) {
		var lang = [‘lang/‘+RYU.config.language+’.js’];
	} else {
		var lang = ‘’;
	}
	. . . .
	return {
		inject : {
			js : [lang]
		}
	}

Now your Add-On will only load translation strings if the config file is set to Japanese, Korean, or Simplified Chinese.  Remember, however, if you’re using the “Parse” function you’ll need to make sure “en” is included in your list of valid codes.

OTHER METHODS (Not Recommended)

If, for some reason, you don’t want to use the translation files you can perform the translations within your add-on’s config.js file.  This is not the recommended method and is included here only for completeness and because the old add-on system would have used this method so if you are converting an older add-on it may already have this sort of code in it.

	SWITCH:CASE

	var codes = [‘en’,’ja’,’ko’,’de’];
	if (RYU.addon.localize && codes.indexOf(RYU.config.language)!=-1) {
		switch(RYU.config.language) {
			case “en” :
				var checklabel = “My Checkbox”;
			break;
			case “de”:
				var checklabel = “Meine Checkbox”;
			case “ja” :
				var checklabel = “私のチェックボックス”;
			break;
			case “ko”:
				var checklabel = “내 확인란”;
			break;
			default:
				var checklabel = “My Checkbox”;			
		}
	} else {
		var checklabel = “My Checkbox”;
	}

	As you can see using Switch:Case is rather verbose and redundant and requires a check that the language code is among those for which you provided translations, but you can insert the variables you defined directly without having to run any other Localize functions.


You could also use Switch:Case blocks to append your translations without using an external file.  If your add-on didn’t have many strings to localize it might actually be more efficient to just set these in your add-on’s config.js file than to load another external file:

	var codes = [‘en’,’ja’,’ko’,’de’];
	if (RYU.addon.localize && codes.indexOf(RYU.config.language)!=-1) {
		switch(RYU.config.language) {
			case “en” :
				RYU.addon.localize.append[“My Checkbox”] = “My Checkbox”;
			break;
			case “de”:
				RYU.addon.localize.append[“My Checkbox”] = “Meine Checkbox”;
			case “ja” :
				RYU.addon.localize.append[“My Checkbox”] = “私のチェックボックス”;
			break;
			case “ko”:
				RYU.addon.localize.append[“My Checkbox”] = “내 확인란”;
			break;
			default:
				RYU.addon.localize.append[“My Checkbox”] = “My Checkbox”;			
		}
	} 

This method requires that you either are using RYU._lc() to localize strings afterwards or are running RYU.addon.localize.translate() in the delayed “action” at the end of your add-on:

	action : function(){
		if(RYU.addon.localize){RYU.addon.localize.translate();};
	}


PARSE LOCALIZABLE STRINGS

Any text wrapped in HTML tags with the class “localize” can be targeted for localization.  The “localize” Add-On has a “parse” function to help you.  It automatically finds all the text flagged as localizable and generates the corresponding code blocks to copy and paste into your Add-On, or even all the strings in the entire Webapp so you can generate updated language files.  It isn’t enabled by default, so go to the “localize/localize.config.js” file and uncomment the “parse” block in the code.  Then from the Console type RYU.addon.localize.parse() with or without parameters, depending on what sort of output you require.

	parse ( element , format , context );

		element : omit | ‘’ | 0 | ID = If omitted, empty quotes, or zero the element is the entire webapp.  If you provide an ID only items inside the named element
						with class=“l10n” will be returned.

		format : 0 | 1 = zero (default) is to return the raw strings.  “1” will return strings formatted for a translation file (you should only use “1” if you are not using
				   the PHP File Operations and have to copy & paste the output into a file manually).

		context : ‘webapp’ | ‘addon_name’ = This will pull and merge in any strings used in “modal” dialog boxes.  Since they do not exist within the document structure
							    there would normally be no way to retrieve them.  You have to set these up in your add-on beforehand, however.  Anything
							    sent to “_lc()” with a context will be added to a modal context list of strings that can be retrieved via the add-on’s name.

Any duplicate strings are automatically removed so you don’t have to translate unnecessary entries.  It works with the already rendered document so any content that was generated by javascript will also be included (so long as the strings were wrapped in an element with class=“l10n”).  This will also grab elements with “title” attributes, and if they also happen to have inner HTML that does not contain a text string the inner HTML is filtered out, but the “title” text is not. 

When you run a parse on the entire webapp it will also load another file (either /contrib/contrib.js or /contrib/writer_contrib.js) which has all the javascript generated strings for the default alert(); prompt(); and confirm(); dialog boxes.  Since these are generated on-demand and are not part of the document elements the main parse function can’t find these strings, so they are merged into the list from an outside file.

SAVING STRINGS

If PHP file operations are not available the strings will appear in the dialog box text area and will have to be manually copied from the box and pasted into a text file.

If you working on your development server and have PHP file operations enabled you can have it automatically save the strings for you.

1. There is a file at /localize/contrib/save_strings.php

2. IMPORTANT: The script is normally set to die in order to prevent files being written to your server.  To enable the script comment out line 6.

3. IMPORTANT: In Ryuzine open a browser console and type:

	RYU.config.xfileman=‘1’;RYU.addon.localize.parse()

That will give you the Parse dialog with file operations, even though Reader and Rack do not normally use or support file operations.

4. The parsed strings appear in a text box with a “Save” button that will (assuming server permissions are set to allow it) write the strings into a file for you - so you don’t have to copy & paste.  It saves you a step is all.  

5. The file will be saved in the /ryuzinewriter/addons/localize/contrib/ folder with a  name like “writer_xx.js” where you change the “xx” to the correct two-letter language code, add in the translated strings, and then put this file in the /ryuzinewriter/addons/localize/language/ folder with the rest of them.


IMPORTANT:  Any double quotes are automatically converted to “&#34;” and any newline (\n), carriage returns (\r), or manual breaks (<br/>) are also automatically replaced by an empty space.  Ideally, though, you should avoid using any of these in the text you plan to localize.

MERGE LOCALIZATION STRINGS

There is also a “merge” function which can take two plain text files of strings and attempt to merge them into a properly formatted localization file.

	RYU.addon.localize.merge();	// Opens the Merge Dialog	

	RYU.addon.localize.merge(base,lang,type,code);	// Opens the Merge Dialog with parameters and processes them if it can.

	Parameters:
	base	= the base language (english) text file.
	lang	= the translated strings text file.
	type	= format of the merged output, valid values are:
		0 = for the Localize Add-On (placed in /addons/localize/language/)
		1 = for a Custom Add-On (place in /addons/youraddon/language/)
	code 	= language code for this translation (will use “xx” if none is given)

If PHP File Operations are not available you’ll have to manually copy and paste the output of the merge into a file and save it.

If you working on your development server and have PHP file operations enabled you can have it automatically save the strings for you.

1. There is a file at /localize/contrib/save_strings.php

2. IMPORTANT: The script is normally set to die in order to prevent files being written to your server.  To enable the script comment out line 6.

3. IMPORTANT: In Ryuzine open a browser console and type:

	RYU.config.xfileman=‘1’;RYU.addon.localize.merge()

That will give you the Merge dialog with file operations, even though Reader and Rack do not normally use or support file operations.

4. In the Merge Dialog enter the base language file (likely en.txt or en_addon.txt), the name of the translated file (for example "es.txt" or "es_addon.txt" for the Spanish translation), which type of merged file to create (one for the Ryuzine webapps or for an add-on), and the language code to merge with (in this example "es" for Spanish).

5. The file will be saved in the /ryuzinewriter/addons/localize/contrib/ folder with a  name like “xx.js” or "xx_addon.js" or "writer_es.js" where you change the “xx” to the correct two-letter language code.

6. If it is for Ryuzine Reader or Rack put the "es.js" file in ryuzine/addons/localize/language/, for Ryuzine Writer it would go in ryuzinewriter/addons/localize/language/ and for an add-on it would go in /addon-name/language/ (or however you are arranging files inside the add-on).

STYLING FOR DIFFERENT LANGUAGES

It is possible that you may need to make adjustments to the UI styles as well.  For example, German and Japanese can require significantly more characters than English for the same label.  In which case you’d need to reduce the font size to allow the translation to fit properly.  You may also need to declare certain default fonts commonly installed on the computers of users in the target language’s locale.  Taking the example of Japanese, the labels on the Options Panel run longer than the space available, and we also want to make sure to use native fonts if available, so inside the “Localize” Add-On is a sub-folder named “css/“ which has optional stylesheets for languages that require them.  In this case it would be the “writer_ja.css” stylesheet.  It would be a good idea to keep the format of the stylesheet name the same as the corresponding javascript that contains the translation strings, just so it is clear what goes together.  That stylesheet is really simple, all it does is define some new default page fonts and resize some things:

body, body * {
	font-family:"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
	font-size: 13px;
}
.title {
	font-family:"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
	font-size: 18px;
}
.optitem {
	font-family:"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
	font-size: 12px;
}

Then, at the end of of “writer_ja.js” we just need to register this stylesheet to the “localize” add-on, which can be done in one line:

	RYU.addon.register({name:'localize',inject:{css:[['css/writer_ja.css']]}});

That’s it!  Now, if the language is set to “ja” it will first load the localization strings and then register the custom language stylesheet.

Text that is generated by javascript, such as that in alert(), confirm(), or prompt() dialogs should either have the text passed in as a pre-localized variable or set the text with the _e() method.  

TRANSLATING THE XINHA EDITOR	

The Xinha WYSIWYG editor has it’s own localization scheme.  Ryuzine Writer will attempt to synchronize it with the UI language, but it supports a much smaller complement of languages than Ryuzine does.  Still, if you want to add support for another language to the WYSIWYG editor too you need to add language string files in a number of different places or it won’t work:

	Xinha Core: 	/ryuzinewriter/xinha/lang
	Modules:	/ryuzinewriter/xinha/modules/[individual module]/lang/
	Plug-Ins:	/ryuzinewriter/xinha/plugins/[individual plugin]/lang/

Xinha also uses slightly different “country codes” than Ryuzine Writer.  It is on the “To Do List” to rectify these inconsistencies but isn’t presently a priority.

Then each Xinha Plug-in also has a “lang” folder with individual files for the strings to translate.  The two-letter language codes have been altered to follow the same format as the Ryuzine Localize Add-On, but technically it just passes the entire language string, so if you need to be more specific (i.e., use language, script, locale identifiers) you can create whatever level of language targeting you require.  Localizing the Xinha Editor is quite an undertaking in and of itself and the PHP utility that used to make it easier no longer works in newer versions of PHP (if someone can fix it, please do).  So you’ll need to just copy one of the existing files in the “lang” folder and swap out the translated strings.

If you are creating or modifying a plugin for the Xinha editor include language localization files inside the plugin’s own “lang” folder.  You should use Xinha._lc(“string”,”nameOfPlugIn”) to localize strings within the Xinha Editor.  However, you can also use Ryuzine’s string localizer _e(“string”) but don’t do this if your plug-in is not Ryuzine specific.

NOTE: The inclusion of a “en.js” file is optional, Xinha ignores it because it is the base language.

HOW-TO LOCALIZE THE RYUZINE WEBAPPS

1. First, find the “save_string.php” file in /addons/localize/contrib/ and comment or delete the “die” on line 6.

2. In the webapp config file make sure the “language” is set to “en”

3. In the webapp config file make sure the ONLY add-on being loaded is “localize”

4. Inside the /addons/localize/contrib/ folder are two pre-parsed plain text files:
	en.txt
	writer_en.txt

These contain all the localizable strings for Ryuzine Reader/Rack/Press (en.txt) and Ryuzine Writer (writer_en.txt).  Open the one corresponding to the webapp you are going to localize.

5. If you are a native speaker of the target language translate each string, leaving the line returns between them and save your new text file into the /contrib folder.  If you are using an automatic translation utility (like translate.google.com) copy and paste the text into it as “english” and then select the target language.  Copy the translated text to the clipboard, open a blank text document, paste the translated strings into it and save it to the /contrib folder.

6. Open the javascript console for your web browser and type RYU.addon.localize.merge();  This will open the merge dialog in the webapp itself.

7. In the “Base Text” box enter either “en.txt” or “writer_en.txt” (depending on which webapp you are working with) and then the file name of the localized, translated strings you saved earlier as a .txt file.  Note that both files MUST have the file extension .txt or the merge operation will fail!

8. In the “Language” box enter the country code (typically two letters) for the target language.

9. Leave the drop-down box set to “Localize Add-On” which means you are generating a merged file for use with the Localize add-on itself.

10. Press the “Process” button at the bottom of the dialog box and the merged output will appear in the text area box.  If it looks correct you can hit the “Save” button and it will save the file into the /contrib folder.  Then all you need to do is move it into the /addons/localize/language/ folder and you’re done!

HINT:  You can also set the parameters and execute the merge in one command, let’s say you’ve translated Ryuzine Writer for Esperanto : 

	RYU.addon.localize.merge(‘writer_en.txt’,’writer_eo.txt’,0,’eo’);

	Then hit the “Save” button when the “Merge Files” dialog opens.
	

