/*	
	Original Integrated Lightbox for Ryuzine
	-----------------------------------------
	This is the extricated original integrated lightbox code
	from Ryuzine 0.9.6.6 that requires the older, heavier
	markup on both the lightbox links and the lightboxed items.
	
	All lightboxed content MUST be embedded in the document, it
	does not lightbox any direct media links.  It will, however,
	back-convert new format embeds to the old format.
	
	If you need direct linking to media, named galleries, or
	are using the newer markup do NOT use this lightbox addon,
	use the "ryulightbox" addon instead.
	
*/

RYU.buildLightBoxes = function() {
var iDown = RYU.iEvent().iDown;

if (document.getElementById('ryuzinerack')) {
	var figbox = document.createElement('figure');
		figbox.id='detailbox';
		figbox.className = 'light_boxed';
		figbox.innerHTML = '<div class="rack_card"></div>'; // placeholder
	document.getElementById('lightbox').appendChild(figbox);
	
	RYU.showDetails = function(n) {
		document.getElementById('detailbox').getElementsByClassName('gallerybox')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].innerHTML = document.getElementById('slot'+n).innerHTML;
		RYU.lightBox('detailbox',1);
	}
}


lightBoxes = document.getElementsByClassName('light_boxed');
var lightBoxed = [];
var lightBoxedOrient = [];
var lightBoxedId = [];
	for (var x=0; x<lightBoxes.length; x++) {
		lightBoxed[x] = lightBoxes[x].innerHTML;
		// Find orientation of this lightbox content //
		if (lightBoxes[x].className.length > 11 ) { 	// look for orientation class
			var findcount = lightBoxes[x].className.split(" ");
			lightBoxedOrient[x] = findcount[1];
		}
		else { // assume landscape orientation if not stated
			lightBoxedOrient[x] = "land";
		}
		if (lightBoxes[x].id) {
			lightBoxedId[x] = lightBoxes[x].id;
		} else {
			lightBoxedId[x] = x;
		}
	}
// 	Find new format lightbox links to embedded content and convert them
//	we don't need to use RYU.config.preplinks() here because we are removing
//	the links from the DOM and adding them back inside the new containers so
//	that process automatically removes the default event listeners...
var atags = document.getElementsByTagName('a');
for (x=atags.length-1; x >=0; x--) {
	if (atags[x].rel=='lightbox' && atags[x].hostname == window.location.host && atags[x].href.match(/#/gi)) {
		// ok we know it's a new lightbox link, it points to the same server, and it points to a embedded lightbox
		RYU.addClass(atags[x],'lightbox_link');	// make sure below can find it
		var ndiv = document.createElement('div');
			ndiv.className = 'new_link';
		atags[x].parentNode.insertBefore(ndiv,atags[x]);
		ndiv.appendChild(atags[x]);	// move <a> into div
	};
}

var lightBoxLinks = document.getElementsByClassName('lightbox_link');
var lightBoxLink = [];
var lightBoxTarget = [];
var lightBoxType = [];
	for (var x=0; x<lightBoxLinks.length; x++) {
		console.log('lightboxlinks['+x+'].href = '+lightBoxLinks[x].href);
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
				lightBoxType[x] = "lb_plus";
			}
		} else {	// anchor links < v1.0
			var	lbtarget = lightBoxLinks[x].href;
				lbtarget = lbtarget.split('#');
			if (lightBoxLinks[x].hasAttribute('data-linkid')){	// v1.0 anchor link
				lbtarget = lightBoxLinks[x].getAttribute('data-linkid');
			}
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
					lightBoxType[x] = "lb_plus";
				}
			}
		}
	}
// This replaces links to lightbox content with fancy ones //

var linkReplace = document.getElementsByClassName('new_link');
var newLink = '';
	for (var x=0; x<linkReplace.length; x++) {
		if (lightBoxType[x]=="" || lightBoxType[x]==undefined) { 
			var lb_leader = "";
			lightBoxType[x] = "lightboxbutton"; } 
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
		if (!lightBoxLink[x].match(/<img/gi)) {	// has no thumbnail
			newLink = '<a href="javascript:RYU.lightBox(\''+lightBoxTarget[x]+'\',1);" ontouchstart="RYU.lightBox(\''+lightBoxTarget[x]+'\',1);">'+lightBoxLink[x]+'</a>\n';
		} else {	// has thumbnail so put icon on it
			newLink = '<div class="lightboxthumb center">'+lightBoxLink[x]+'<a href="javascript:RYU.lightBox(\''+lightBoxTarget[x]+'\',1);" ontouchstart="RYU.lightBox(\''+lightBoxTarget[x]+'\',1);" class="'+lb_leader+lightBoxType[x]+'"></a></div>\n';
		}
		linkReplace[x].innerHTML = newLink;
	}

// Restructure Lightboxed elements //
var lightbox_html = '<div id="shade"></div>\n';
for (x=0; x<lightBoxes.length; x++) {
	if (!isNaN(lightBoxedId[x])) { lightBoxedId[x] = 'lightbox-'+lightBoxedId[x]};
	if (lightBoxes[x].getElementsByClassName('rack_card').length > 0) {
		var gallery = '<div id="gallery'+x+'" class="gallerybox card"><div class="area"><div class="scrollbox">'+lightBoxed[x]+'</div></div></div>\n';
		} else {
		var gallery = '<div id="gallery'+x+'" class="gallerybox">'+lightBoxed[x]+'</div>\n';		
		}
	lightbox_html=lightbox_html+'<div id="'+lightBoxedId[x]+'" class="lighttable lightbox_out">\n'+
'<div class="lightcell '+lightBoxedOrient[x]+'">\n'+
'<div class="pic">\n'+
'<div class="blocky">\n'+
'<div class="button closeit"><p><span class="symbol"></span><span class="label">Close</span></p></div>\n'+
'</div>\n'+gallery+
//'<div id="gallery'+x+'" class="'+galleryclass+'">'+lightBoxed[x]+'</div>\n'+
'</div>\n'+
'</div>\n'+
'</div>\n';
}
document.getElementById('lightbox').innerHTML = lightbox_html;

	// attach Lightbox Events //
		var lightboxes = document.getElementsByClassName('lighttable');
	
	for (var b=0; b<lightboxes.length; b++) {
		var lb = lightboxes[b].id;
			document.getElementById(''+lb+'').getElementsByClassName('blocky')[0].addEventListener(iDown,function(x){return function(){RYU.lightBox(''+x+'',0);}}(lb),false)	
		}



}();
RYU.lightBox = function(n,dir) {
	var bndr = document.getElementById('binder');
	var gallery = document.getElementById(''+n+'');
	var light_box = document.getElementById('lightbox');
	var lightshade = document.getElementById('shade');
	
	if (dir==0) { // close it
		var bn = bndr.className; bn = bn.split(' '); bn = bn[0]; bndr.className = ''+bn+'';
		setTimeout(function(){gallery.className = "lighttable lightbox_out";},1);
		setTimeout(function(){lightshade.style.background="transparent";},1500);
		setTimeout(function(){gallery.style.visibility="hidden";light_box.style.display="none";light_box.style.left="-200%";light_box.style.top="-200%";},2000);
	} else { // open it
		bndr.className = binder.className + ' binder_filter';
		light_box.style.display="block";
		light_box.style.left="0";light_box.style.top="0";
		if (document.documentElement.filters) {
			lightshade.style.background="#000";
			lightshade.style.filter="alpha(opacity=75)";
		}
		else {
			setTimeout(function(){lightshade.style.background="rgba(0,0,0,0.75)"},1);
		}
		gallery.style.visibility="visible";
		setTimeout(function(){gallery.className = "lighttable lightbox_in";RYU.iScrollApply(''+n+'');},250);
	}
};
