/*	Ryuzine Lightbox Add-On
	Author: K.M. Hansen
	E-Mail:	software@kmhcreative.com

	Expects <a> with rel="lightbox" (or whatever you set in config) for links
	Expects <figure> with ID for lightbox content
	or a direct link to the image file which will
	then be automatically lightboxed.
*/
RYU.config.block_keynav('lightbox');
RYU.config.preplinks();	// removes default event listeners from lightbox links
RYU.buildLightBoxes = function() {
// build lightbox container and controls if not present
	if (!document.getElementById('lightbox')) {
		var lightbox = document.createElement('div');
			lightbox.id='lightbox';
			document.getElementsByTagName('body')[0].appendChild(lightbox);	
	} else {
		var lightbox = document.getElementById('lightbox');
	}
	if (!document.getElementById('shade')) {	
		var shade = document.createElement('div');
			shade.id="shade";
			lightbox.appendChild(shade);
	} else {
		var shade = document.getElementById('shade');
	}		
			shade.addEventListener(RYU.iEvent().iClick,function(){RYU.lightBox(3);},false);
		var galleryback = document.createElement('a');
			galleryback.id = 'galleryback';
			galleryback.href ='#';
			galleryback.className = "button";
			galleryback.innerHTML='<p><span class="symbol"></span><span class="label">Back</span></p>';
			galleryback.addEventListener(RYU.iEvent().iClick,function(e){e.preventDefault();RYU.lightBox(1,this)},false);
			lightbox.appendChild(galleryback);
		var gallerynext = document.createElement('a');
			gallerynext.id = 'gallerynext';
			gallerynext.href = '#';
			gallerynext.className = "button";
			gallerynext.innerHTML='<p><span class="symbol"></span><span class="label">Next</span></p>';	
			gallerynext.addEventListener(RYU.iEvent().iClick,function(e){e.preventDefault();RYU.lightBox(1,this)},false);
			lightbox.appendChild(gallerynext);		

if (document.getElementById('ryuzinerack')) {
	var figbox = document.createElement('figure');
		figbox.id='detailbox';
		figbox.className = 'light_boxed deck';
	document.getElementById('lightbox').appendChild(figbox);
	
	RYU.showDetails = function(n) {
		document.getElementById('detailbox').innerHTML = '<div class="area"><div class="scrollbox">'+document.getElementById('slot'+n).innerHTML+'</div></div>';
		var fakea = document.createElement('a');
			fakea.href = '#detailbox';
		RYU.lightBox(1,fakea);
		fakea = null;
	}
}


	RYU.config.embeds = [];
	// Find old format lightboxed elements
	var lightboxed = document.getElementsByClassName('light_boxed');
	for (var b=lightboxed.length-1; b >= 0; b--) {
		if (lightboxed[b].tagName.toLowerCase() != 'figure') {	// we have an old format one
			var lbid = lightboxed[b].id;
			if (!isNaN(parseInt(lbid))) { // if it is a number prefix with "lightbox-"
				lbid = 'lightbox-'+lbid+'';
			}
			var lbcss= lightboxed[b].className;
			if (lightboxed[b].getElementsByClassName('caption').length > 0) {	// we have a caption
				var cap = lightboxed[b].getElementsByClassName('caption')[0].innerHTML;
				lightboxed[b].removeChild(lightboxed[b].getElementsByClassName('caption')[0]);
				var newfigcap = document.createElement('figcaption');
					newfigcap.innerHTML = '<p>'+cap+'</p>';
			} else { var cap = ''; var newfigcap = null; }
			var lbtxt = lightboxed[b].innerHTML;
			lightboxed[b].parentNode.removeChild(lightboxed[b]); // sayonara!
			var newfig = document.createElement('figure');
				newfig.id = lbid;
				newfig.className = lbcss;	// assumes 4:3 ratio of old lightbox
				newfig.innerHTML = lbtxt;
			if (newfigcap!=null) {
				newfigcap.className = 'caption';
				newfig.appendChild(newfigcap);
			}
			document.getElementById('lightbox').appendChild(newfig);
		}
	}
// Move lightboxed elements into lightbox container		
		var figures = document.getElementsByTagName('figure');
		for (var f=figures.length-1; f > -1; f--) {
			if (RYU.hasClass(figures[f],'light_boxed')) {	// there may be figures that are not lightboxes!
				// look for <a> tags and make sure they open in new window
				if (figures[f].getElementsByTagName('a').length > 0) {
					var alink = figures[f].getElementsByTagName('a');
					for (var a=alink.length-1; a>=0;a--) {
						alink[a].setAttribute('target','_blank');
						// does it have an image inside of it?  We don't want a giant clickable area!
						if (alink[a].getElementsByTagName('img').length > 0) {
							var link_img = alink[a].getElementsByTagName('img');
							for (var i=link_img.length-1;i>=0;i--) {
								// move the <img> tag in front of the <a> tag
								alink[a].parentNode.insertBefore(link_img[i],alink[a]);
								// create a <figcaption> tag
								var fcap = document.createElement('figcaption');
									fcap.className = 'caption';
								// now insert it before the <a> tag
								alink[a].parentNode.insertBefore(fcap,alink[a]);
								// if <a> tag is now empty, put <img> tag src inside it as text
								if (alink[a].childNodes.length==0){
									alink[a].innerHTML = alink[a].href.split('/')[alink[a].href.split('/').length-1];
								}
								// move <a> tag inside <figcaption>
								fcap.appendChild(alink[a]);						
							}
						}
					}
				}
				// move all figures into the lightbox container
				figures[f].innerHTML = '<div class="area"><div class="scrollbox">'+figures[f].innerHTML+'</div></div>';
				RYU.addClass(figures[f],'deck');
				RYU.config.embeds.push(figures[f].id);
				document.getElementById('lightbox').appendChild(figures[f]);
			}
		}

// Finds old format lightbox links
var lightBoxLinks = document.getElementsByClassName('lightbox_link');
var lightBoxLink = [];
var lightBoxTarget = [];
var lightBoxType = [];
	for (var x=0; x<lightBoxLinks.length; x++) {
		lightBoxLink[x] = lightBoxLinks[x].innerHTML;
		if (lightBoxLinks[x].tagName.toLowerCase() != "a") { // OLD method with DIVs
			// Find the target for this link //
			if (lightBoxLinks[x].className.match(/ t-/gi)) { // look for t-x class
				lightBoxTarget[x] = lightBoxLinks[x].className.match(/t-[^\s]+/gi)[0].replace('t-','');
				if (!isNaN(parseInt(lightBoxTarget[x]))) { // if it is a number prefix with "lightbox-"
				lightBoxTarget[x] = 'lightbox-'+lightBoxTarget[x]+'';
				}
			}
			else {
				console.log('No target set for Lightbox link '+x);
				lightBoxTarget[x] = 'lightbox-0';
			}
			// Find the type for this link //
			if (lightBoxLinks[x].className.length > 17 ) { // look for type class
				var findtype = lightBoxLinks[x].className.split(" ");
				var typecount = findtype[2].split("_");
				lightBoxType[x] = typecount[1]; // set Type to that indicated
			} else {
				lightBoxType[x] = "";
			}
		} else {	// New method with anchor links
			var	lbtarget = lightBoxLinks[x].href;
				lbtarget = lbtarget.split('#');
				if (!isNaN(parseInt(lbtarget[1]))) {	// if it just a number prefix it with "lightbox-"
				lightBoxTarget[x] = 'lightbox-'+lbtarget[1]+'';
				}else{
				lightBoxTarget[x] = ''+lbtarget[1]+'';
				}
			var lbstyles = lightBoxLinks[x].className;
				lbstyles = lbstyles.split(' ');
			for (var s=0; s < lbstyles.length; s++) {
				if (lbstyles[s].match(/lb_/gi)) {
					lightBoxType[x] = lbstyles[s];
				} else {
					lightBoxType[x] = "";
				}
			}
		}
	}
// This replaces old format links with new format //
var linkReplace = document.getElementsByClassName('new_link');
var newLink = '';
	for (var x=0; x<linkReplace.length; x++) {
		if (lightBoxType[x]=="" || lightBoxType[x]==undefined) { 
			var lb_leader = "";
			lightBoxType[x] = "lb_plus"; } 
		else {
			if (lightBoxType[x].match(/lb_/gi)) {
				var lb_leader = "";
			} else {
				var lb_leader = "lb_";	//<-- old method
			}
		}
		if (window.devicePixelRatio >= 2) {
			var rez = "hires/";
		} else { 
			var rez = "";
		}
		newLink = '<a href="#" data-linkid="'+lightBoxTarget[x]+'" rel="'+RYU.addon.ryulightbox.config.reltxt+'" class="'+lb_leader+lightBoxType[x]+'">'+lightBoxLink[x]+'</a>';	
		linkReplace[x].innerHTML = newLink;
	}
// Now that everything should be in the new link format, we can restructure them with the fancy icon...//
	var atags = document.getElementsByTagName('a');
	for (var a=atags.length-1; a > -1; a--) {
		if (atags[a].rel.match(''+RYU.addon.ryulightbox.config.reltxt+'')) {
			// if iframe is blocked and href is off-site just open in a new window instead //
			if (RYU.addon.ryulightbox.config.iframe==false && atags[a].hostname != window.location.host ) {
				if (!atags[a].hasAttribute('target')) {
					 atags[a].setAttribute('target','_blank');
				}
				atags[a].setAttribute('rel','');	// unlightbox it!
			} else {
				if (atags[a].querySelectorAll('img').length > 0) {	// it is a thumbnail
					var box = document.createElement('div');
						box.className = 'lightboxthumb';
						box.innerHTML = atags[a].innerHTML;
					atags[a].parentNode.insertBefore(box,atags[a]);
					atags[a].innerHTML = '';
					if (!atags[a].className.match(/lb_/gi) && !atags[a].className.match(/lightboxbutton/gi)) {
						// no icon type is set, add default
						RYU.addClass(atags[a],'lb_plus');
					}
					box.appendChild(atags[a]);
				} else { // if it is a text link
					RYU.addClass(atags[a],'lightboxlink');
				}
				atags[a].addEventListener(RYU.iEvent().iClick,function(e){e.preventDefault();RYU.lightBox(1,this)},false);
			}
		} else {	
			// it is not a lightbox link so do nothing with it
		}
	}

// Build array of named galleries and members
RYU.config.gallery = [];
	var galleryArray = function() {
			var atags = document.getElementsByTagName('a');
			for (var a=0; a < atags.length; a++) {
				if (atags[a].rel.match(''+RYU.addon.ryulightbox.config.reltxt+'')) {
					// if data-gallery exists
					if (atags[a].hasAttribute('data-gallery')) {
						// get the gallery name and url
						var galleryname = atags[a].getAttribute('data-gallery');
					} else {
						var galleryname = 'inpage';	// allows accessing single images as gallery
					}
					var url = atags[a].href;
					if (url.match('#') && url.split('#')[1].length > 0) { // anchor link
						url = '#'+atags[a].href.split('#')[1];
					} else if ( (url.match('#') && url.split('#')[1].length==0) || url.match('javascript') || url.match('void') || url == window.location ) { // href is not a valid link!
						if (atags[a].hasAttribute('data-linkid')) {	// look for linkid
							url = '#'+atags[a].getAttribute('data-linkid');
						} else {	// crap, no linkid or url - BAIL!
							return;
						} 
					} else {
						url = atags[a].href;	// probably don't need this
					}
					// look for caption
					if (atags[a].hasAttribute('data-caption') && atags[a].getAttribute('data-caption')!='') {
						var caption = atags[a].getAttribute('data-caption');
					} else if (atags[a].hasAttribute('title') && atags[a].title!='') {
						var caption = atags[a].title;
					} else if (atags[a].parentNode.getElementsByTagName('img').length > 0) {	// wordpress puts title attr on img not link
						if (atags[a].parentNode.getElementsByTagName('img')[0].hasAttribute('title')) {
							caption = atags[a].parentNode.getElementsByTagName('img')[0].title;
						} else { caption = ""; }
					} else {
						var caption = "";	// either no caption or it is embedded
					}
						var group = 0; var member = 0;	// assume neither group nor member exists
						// Search gallery array for match
						for (var g=0; g < RYU.config.gallery.length; g++) {
							if (RYU.config.gallery[g][0] == galleryname) {	// we have a match!
								group = 1;
								// now look at the members for a match
								for (var m=0; m < RYU.config.gallery[g][1].length; m++) {
									if (RYU.config.gallery[g][1][m] == url) {	// already a member
										member = 1;
									}
								}
							}
						}
						if (group==1) { // galleryname exists
							if (member==0) {	// push member onto existing list
								for (var g=0; g < RYU.config.gallery.length; g++) {
									if (RYU.config.gallery[g][0] == galleryname) {
										RYU.config.gallery[g][1].push(url);
										RYU.config.gallery[g][2].push(caption);
									}
								}
							}
						} else { // nothing exists
							RYU.config.gallery.push([galleryname,[url],[caption]]);	
						}
				}
			};	// end of array builder
	}();
}();
RYU.buildLightBox = function(el) {
	// regular target call
	var target = el.href;
	if (target.match('#') && target.split('#')[1].length > 0) { // anchor link
		target = el.href.split('#')[1];
	} else if ( (target.match('#') && target.split('#')[1].length==0) || target.match('javascript') || target.match('void') || target == window.location.href ) { // href is not a valid link!
		if (el.hasAttribute('data-linkid')) {	// look for linkid
			target = el.getAttribute('data-linkid');
		} else {	// crap, no linkid or url - BAIL!
			return;
		} 
	} else {	// direct link to media
		var idcheck = el.href.replace(/(file:|http:|\/|\.|\?|#)/gi,'');
		if (document.getElementById(''+idcheck+'')) {	// element already exists!
			target = idcheck;
		} else {
			var xofig = document.createElement('figure');
				if (el.hasAttribute('data-aspect')) {
					xofig.className="light_boxed "+el.getAttribute('data-aspect');
				} else {
					xofig.className="light_boxed";
				}
				xofig.id = idcheck;
			var area = document.createElement('div');
				area.className = "area";
			var scroll = document.createElement('div');
				scroll.className = "scrollbox";
			if (target.match(/(\.jpg|\.jpeg|\.gif|\.png)/gi)) {
				if (el.hasAttribute('data-layout')) { var cs = el.getAttribute('data-layout');}else{var cs = ""};
				var media = '<img src="'+target+'" class="'+cs+'"/>';
			} else if (target.match(/(http|www\.|\.htm|\.html|\.asp|\.php)/gi) && RYU.addon.ryulightbox.config.iframe==true) {
				var media = '<iframe src="'+target+'" class="browser" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			} else {
				var media = '<p>Linked media type is not supported by Ryu Lightbox</p>';
			}
				scroll.innerHTML = media;
			var capit = document.createElement('figcaption');
				if (el.hasAttribute('data-caption') && el.getAttribute('data-caption') != '') {	
					var caption = el.getAttribute('data-caption');			
				} else if (el.hasAttribute('title') && el.title != '') {
					var caption = el.title;
				} else if (el.parentNode.getElementsByTagName('img').length > 0) {	// wordpress puts title attr on img not link
					if (el.parentNode.getElementsByTagName('img')[0].hasAttribute('title')) {
						caption = el.parentNode.getElementsByTagName('img')[0].title;
					} else { caption = ""; }
				} else {
					var caption = "";
				}
				if (caption=="") {	// catch empties
					caption = 'Source <a href="'+target+'" target="_blank">'+target+'</a>';
				}
				capit.innerHTML = '<p>'+caption+'</p>';
				scroll.appendChild(capit);
				area.appendChild(scroll);
				xofig.appendChild(area);
			document.getElementById('lightbox').appendChild(xofig);
			target = xofig.id;
		}
	}
	// if this is a gallery position in carousel
	if (el.hasAttribute('data-baseclass')) {
		var baseClass = el.getAttribute('data-baseclass');
	} else { 
		var baseClass = 'deck';
	}
	RYU.addClass(document.getElementById(target),baseClass);
	// return target
	return target;
}
RYU.lightBox = function(dir,el) {
	// send any IN to OUT before bringing new IN
	var figs = document.querySelectorAll('.light_boxed');
		for (var f=0; f < figs.length; f++) {
			if (RYU.hasClass(figs[f],'in')) {
				if (dir!=3 && el.id == 'galleryback') {	// if gallery back nav reverse stacking direction
					RYU.addClass(figs[f],'deck');
				} else {
					RYU.addClass(figs[f],'out');
				}
				RYU.removeClass(figs[f],'in');
				if (RYU.config.embeds.indexOf(figs[f].id)===-1) {
					setTimeout(function(x) {return function() {
						x.style.display="none";
						document.getElementById('lightbox').removeChild(x);								
					}}(figs[f]),1000);
				} else {
					setTimeout(function(x){return function(){x.style.display="none";}}(figs[f]),1000);
				}
			}
		}
	// Re-stack the deck
	if (dir==3) {
		setTimeout(function(){
			var figs = document.getElementsByClassName('light_boxed');
			for (var f=0; f < figs.length; f++) {
				RYU.removeClass(figs[f],'in');RYU.removeClass(figs[f],'out');RYU.addClass(figs[f],'deck');				
			}
			document.getElementById('lightbox').className="";
			document.getElementById('lightbox').style.display="none";
		},1000);
	return;
	}
	// get or build target
	var target = RYU.buildLightBox(el);
	var url = el.href;
	if (url.match('#') && url.split('#')[1].length > 0) { // anchor link
		url = '#'+el.href.split('#')[1];
	} else if ( (url.match('#') && url.split('#')[1].length==0) || url.match('javascript') || url.match('void') || url == window.location ) { // href is not a valid link!
		if (el.hasAttribute('data-linkid')) {	// look for linkid
			url = '#'+el.getAttribute('data-linkid');
		} else {	// crap, no linkid or url - BAIL!
			return;
		} 
	} else {
		url = el.href;	// probably don't need this
	}
	
	if (dir==1) {
		// check if it is part of a gallery group
		var gback = document.getElementById('galleryback');
		var gnext = document.getElementById('gallerynext');
		var set_gallery = ""; var gview = "";
		if ( (el.hasAttribute('data-gallery') || RYU.addon.ryulightbox.config.single==1) && RYU.config.gallery.length > 0 ) {
			set_gallery = el.getAttribute('data-gallery') || 'inpage';
			for (var g=0; g < RYU.config.gallery.length; g++) {
				if (RYU.config.gallery[g][0] == set_gallery) {
					gback.setAttribute('data-gallery',set_gallery);
					gnext.setAttribute('data-gallery',set_gallery);
				
					for (var m=0; m < RYU.config.gallery[g][1].length; m++) {
						if (url == RYU.config.gallery[g][1][m]) {
							if (m==0) {
								gback.href = RYU.config.gallery[g][1][RYU.config.gallery[g][1].length-1];
								gback.title= RYU.config.gallery[g][1][RYU.config.gallery[g][2].length-1];
								gback.setAttribute('data-baseclass','out');
								gnext.href = RYU.config.gallery[g][1][m+1];
								gnext.title =RYU.config.gallery[g][2][m+1];
								gnext.setAttribute('data-baseclass','deck');
							} else if (m==RYU.config.gallery[g][1].length-1) {
								gback.href = RYU.config.gallery[g][1][m-1];
								gback.title= RYU.config.gallery[g][2][m-1];  // store any caption in link title
								gback.setAttribute('data-baseclass','out');
								gnext.href = RYU.config.gallery[g][1][0];
								gnext.title= RYU.config.gallery[g][2][0];
								gnext.setAttribute('data-baseclass','deck');
							} else {
								gback.href = RYU.config.gallery[g][1][m-1];
								gback.title= RYU.config.gallery[g][2][m-1];
								gback.setAttribute('data-baseclass','out');
								gnext.href = RYU.config.gallery[g][1][m+1];
								gnext.title= RYU.config.gallery[g][2][m+1];
								gnext.setAttribute('data-baseclass','deck');
							}
						}
					}
				}
			}
			gview = " gallery ";
		} else {
			set_gallery = "";
			gback.setAttribute('data-gallery','');
			gnext.setAttribute('data-gallery','');
			gback.href = '';gback.title = '';
			gnext.href = '';gnext.title = '';
			gback.removeAttribute('data-baseclass');
			gnext.removeAttribute('data-baseclass');
			gview = "";
		}
		document.getElementById('lightbox').className = gview;
		document.getElementById('lightbox').style.display="block";
		document.getElementById(''+target+'').style.display="block";
		setTimeout(function(){RYU.removeClass(document.getElementById(target),'deck');RYU.removeClass(document.getElementById(target),'out');RYU.addClass(document.getElementById(target),'in');RYU.iScrollApply(''+target+'')},1000);
	} else {
		RYU.removeClass(document.getElementById(target),'in');RYU.addClass(document.getElementById(target),'out');
		setTimeout(function(){
		document.getElementById(target).style.display="none";
		document.getElementById('lightbox').className="";
		document.getElementById('lightbox').style.display="none"},1000);
	}
}
// add keyboard controls

document.onkeydown = function(e){
	if(e.keyCode==27){					// ESC key closes lightbox
		RYU.lightBox(3);
	}
	if (RYU.hasClass(document.getElementById('lightbox'),'gallery')) {
		if (e.keyCode == 37) {
			RYU.lightBox(1,document.getElementById('galleryback'));
		}
		if (e.keyCode == 39) {
			RYU.lightBox(1,document.getElementById('gallerynext'));
		}
	}
};