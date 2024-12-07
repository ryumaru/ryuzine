/*	Simple Social Widget
	====================
	for Ryuzine 1.0+
	
	If no custom social/sharing widget is detected this is the default
	one that will be loaded.  It is broken out into this add-on so you
	can modify it to suit your needs.
	
*/
var RYU = RYU || {};
RYU.socialWidget = function(shareLink,splashTitle,media,desc) {
	// configuration
		var style = "medium iconfont";
		/* Valid styles are:
			"" 			: text labels in color boxes
			"small" 	: 16x16 image icons
			"medium"	: 24x24 image icons
			"large"		: 32x32 image icons
			"label"		: text labels in color boxes with 16x16 image icon to left
		  + "iconfont"	: size or label but using an svg iconfont from FontAwesome
		  				  (does not require FontAwesome be installed)
		*/ 
	// Check if CSS is loaded, and if not load it
	if (!document.getElementById('socialwidget_styles')) {
		var css = document.createElement('link');
			css.id 	= 'socialwidget_styles';
			css.rel	= 'stylesheet';
			css.type= 'text/css';
			css.href= RYU.baseurl+'ryuzine/addons/socialwidget/social_icons/social_buttons.css';
		document.getElementsByTagName('head')[0].appendChild(css);
	}

	if (!document.getElementById('share_panel')) {
		// share_panel is missing from DOM
	} else {
		// error catch if variable(s) didn't get passed
		if (shareLink==null) { shareLink = RYU.config.socialwidget.url || window.location;}
		if (splashTitle==null) { splashTitle = RYU.config.socialwidget.title || document.getElementsByTagName('title')[0].innerHTML; }
		if (media==null) { media = RYU.config.socialwidget.media || ''; }
		if (desc==null) {desc = RYU.config.socialwidget.desc || '';}	
		socialWidget = '<div class="rz-sharethis '+style+'">\n'+
		'<a href="http://www.facebook.com/sharer.php?u='+shareLink+'&amp;t='+splashTitle+'" title="Share on Facebook" rel="nofollow" target="_blank" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'height=400,width=700\');" class="rz-share facebook"><span>Facebook</span></a>\n'+
		'<a href="https://www.threads.net/intent/post?text='+shareLink+'%0A%0Z'+splashTitle+'" title="Share on Threads" rel="nofollow" target="_blank" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'height=400,width=700\');" class="rz-share threads"><span>Threads</span></a>\n'+
		'<a href="http://bsky.app/intent/compose?text=Check out the '+splashTitle+' webapp at &url=%20$'+shareLink+'" title="Share on Bluesky" rel="nofollow" target="_blank" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'height=400,width=700\');" class="rz-share bluesky"><span>Bluesky</span></a>\n'+
		'<a href="http://www.reddit.com/submit?url='+shareLink+'&amp;title='+splashTitle+'" title="Share on Reddit" rel="nofollow" target="_blank" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'height=400,width=700\');" class="rz-share reddit"><span>Reddit</span></a>\n'+
		'<a href="http://tumblr.com/widgets/share/tool?canonicalUrl='+shareLink+'" title="Share on Tumblr" rel="nofollow" target="_blank" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'height=400,width=700\');" class="rz-share tumblr"><span>Tumblr</span></a>\n'+
		'<a href="'+shareLink+'" title="Share on Mastodon" rel="nofollow" target="_blank" onclick="event.preventDefault();some.share(this.href);event.stopImmediatePropagation();" class="rz-share mastodon"><span>Mastodon</span></a>\n'+
		'<a href="http://pinterest.com/pin/create/button/?url='+shareLink+'&media='+media+'&description='+unescape(desc)+'" title="Pin this!" rel="nofollow" target="_blank" class="rz-share pinterest" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'width=632,height=270\');"><span>Pinterest</span></a>\n'+
		'<a href="http://www.linkedin.com/shareArticle?mini=true&amp;title='+splashTitle+'&amp;url='+shareLink+'" title="Share on LinkedIn" rel="nofollow" target="_blank" onclick="event.preventDefault();window.open(this.href,\'_blank\',\'height=400,width=700\');" class="rz-share linkedin"><span>LinkedIn</span></a>\n'+
		'<a href="mailto:?subject='+splashTitle+' Ryuzine WebApp&amp;body=%0A'+RYU._lc("I thought you might be interested in this (copy and paste the URL into your web browser address bar)")+':%0A%0A'+shareLink+'%0A%0ADescription: '+unescape(desc)+'%0A%0A'+RYU._lc("Please note: This message was NOT sent to you by the owner of the linked site, please reply to the person who sent this to you.")+'" title="Share by E-mail" rel="nofollow" target="_blank" class="rz-share rz-mail"><span>E-mail Link!</span></a>\n'+
		'</div>\n';
		document.getElementById('share_panel').getElementsByTagName('div')[0].innerHTML = socialWidget;
	};
}();