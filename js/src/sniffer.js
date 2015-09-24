/*
	RYU_WEB-O-DETECTO
	Modified version of web-o-dectecto.js for RYUZINE
	MUST be placed before main ryuzine js file!
	Version 1.0
	URI: https://gist.github.com/kmhcreative/cc73f6a5da2e0919432f
	
	======== DESCRIPTION =========

	Feature Detection is best, however browser quirks and bugs
	still force sniffing UA strings to make webapps work, but
	the strings can also be spoofed and some browsers purposely
	try to be identified as more widely used browsers, so you
	never know for sure.  This script attempts to not only figure
	out EXACTLY what browser is running, but also the environment
	including operating system and display mode.
	
	========== LICENSE ===========

	The MIT License (MIT)

	Copyright (c) 2015 K.M. Hansen <software@kmhcreative.com>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

	=========== OBJECTS ============
	
	device.OS :
		Operating System - this is usually the general OS name
		but in some cases it may be more specific.  Values:
		
		Windows | Windows 10 | Windows 10 Mobile | Windows Phone 8 | Windows Phone 7
		Linux | Mac | iOS | Android | BlackBerryOS | webOS

	device.Platform :
		Browser Type - for webapps the browser IS the platform
		and can determine which features or syntax are used. Values:
		
		Edge | IE | Android | Silk | Chrome | Chrome Mobile | Safari | Mobile Safari 
		Firefox | Firefox Mobile | Opera | WebKit | Desktop (unknown browser)
		
	device.appName :
		Browser Name - the actual name of the browser, which may be
		based on some other browser platform.  Value:
		
		Browser | Silk | Chrome Mobile | Mobile Safari | Firefox Mobile
		Opera Mini | Opera Mobile		 
		
	device.v :
		Version - this is usually the BROWSER version, not OS,
		since that is more useful to webapps.  Except on Android
		where OS version is more useful. Numeric value x.x
	
	device.bv :
		Browser Version - typically contains the same value as device.v
		except on Android where it is the ACTUAL version of the browser.
		Numeric value x.x
		
	device.metro :
		Browser appears to be displaying website in "Metro/Modern" full-screen 
		mode on Windows 8.x (but there is no way to be certain). Values:
		
		0 | undefined = not in Metro mode 		| 		1 = in Metro mode
		
	device.app :
		Browser appears to be displaying website in "App View" after being
		bookmarked to the Homescreen on iOS.  Values:
		
		0 | undefined  = not in App View mode 	| 		1 = in App View mode
		
	=========== NOTES ============	
	
	Usually device.OS or device.Platform will be enough info, however if you are
	working around a known quirk on a given platform or specific browser device.appName
	and device.bv should give you enough granular data to zero-in on the right target.
	
	The detection order below is specifically to capture info from the UA strings of
	browsers often detected as other browsers BEFORE they are detected as those other
	browsers.  Because presumably you want to know what the browser ACTUALLY is to 
	work around some specific issue with THAT browser.
	
	Device and Browser version numbers are truncated to either major version or the
	major.minor version so you can use greater/lesser/equal to "point releases" too,
	but not major.minor.release or major.minor.release.build, etc. For those just
	check against the next minor version up/down.

*/
var RYU = RYU || {};
RYU.device = (function(){
var device = {};	// everything is a sub-object of this object
if (navigator.userAgent.match(/Edge/i)) {
	// Edge UA lies about what it is so check it first
	var ver = navigator.userAgent.match(/Edge\/../i);
	ver = ver[0].split("/");
	ver = parseFloat(ver[1]);
	device.v = ver;
	if (navigator.userAgent.match(/Android/i)){
		device.OS = "Windows 10 Mobile";	// Windows 10 Mobile (aka Windows Phone 10)
		device.appName = "Edge Mobile";
	} else {
		device.OS = "Windows 10";	// because only Win10 can run Edge
	}
	device.Platform = "Edge";
} else if (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Trident/i)){
	// IE Mobile also lies about what it is
	if (navigator.userAgent.match(/IEMobile/i)) {
		if (navigator.userAgent.match(/Windows Phone 8/i)) {
			device.OS = "Windows Phone 8";
		} else {
			device.OS = "Windows Phone 7";
			iScroll = undefined; // iScroll does not work with Windows Phone 7
		}
		device.appName = "IE Mobile";
	} else {device.OS = "Windows"; }	// some version of it anyway
	device.Platform = "IE";
	// now get the browser version
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		device.v = new Number(RegExp.$1); // capture x.x portion and store as a number
	} else if (/IEMobile\/(\d+\.\d+)/.test(navigator.userAgent)) {
		device.v = new Number(RegExp.$1);
	} else if (/rv:(\d+\.\d+)\)/.test(navigator.userAgent)) {
		device.v = new Number(RegExp.$1);
	} else {};
	if (device.v < 9 || device.v == 10) { 
		iScroll = undefined; // Legacy IE cannot use this anyway
		if (device.v >= 10) { // Try to figure out if it is IE in Win 8.x "Metro" mode
			device.metro = function() {
				var metro = 0;
				try { metro = !!new ActiveXObject("htmlfile"); // Might be desktop mode with plugins disabled
				} catch (e) {
					metro = 0;
				}
				if (metro != 0) {
					if(window.innerWidth == screen.width && window.innerHeight == screen.height) {
						metro = 1; // It is probably in Metro mode, but may still be desktop in fullscreen mode
					} else {
						metro = 0;
					}
				}
				return metro;
			}
		}
	}
} else if (navigator.userAgent.match(/Android/i)) {
	device.OS = "Android";
	if (navigator.userAgent.match(/Firefox/) || navigator.userAgent.match(/Fennec/)) {
		device.Platform = "Firefox";
		device.appName  = "Firefox Mobile";
		device.v = 4; 	// assume it's at least 4, FFM UA string doesn't include Android version!
	} else {
		if (navigator.userAgent.match(/Silk/)) {
			// check for Silk first because it will say it is Chrome too
			// device.OS = "FireOS";	// uncomment only if you need to sniff FireOS
			device.Platform = "Chrome";
			device.appName  = "Silk";
			var bv = navigator.userAgent.match(/Silk\/(\d+\.\d+)/i);
				bv = parseFloat(bv[0].split("/")[1]);
				device.bv = bv; // actual browser version	
		} else if ( navigator.userAgent.match(/OPR/i) || navigator.userAgent.match(/Opera/i)) {
			// check for Opera first because new Opera will say it is Chrome
				if (navigator.userAgent.match(/Opera/i)) { // old Opera version
					var bv = navigator.userAgent.match(/Opera\/(\d+\.\d+)/i);
					device.Platform = "Opera";	
					device.appName = "Opera Mini";
				} else {
					// this needs to be before Chrome because new Blink-based Opera lies and says it is Chrome.
					var bv = navigator.userAgent.match(/OPR\/(\d+\.\d+)/i);
					device.Platform = "Chrome";
					device.appName = "Opera Mobile";
				}
				bv = parseFloat(bv[0].split("/")[1]);
				device.bv = bv;			
		} else if (navigator.userAgent.match(/Chrome/)) {
			device.Platform = "Chrome";
			device.appName  = "Chrome Mobile";
			var bv = navigator.userAgent.match(/Chrome\/(\d+\.\d+)/i);
				bv = parseFloat(bv[0].split("/")[1]);
				device.bv = bv;	// actual browser version
		} else {
			device.Platform = "Android"; // Android 2.x UA string does not say Chrome
			device.appName  = "Browser";
			var bv = navigator.userAgent.match(/AppleWebKit\/(\d+\.\d+)/i);
				bv = parseFloat(bv[0].split("/")[1]);
				device.bv = bv;	// actual WebKit Build
		}
		var ver = navigator.userAgent.match(/Android (\d+\.\d+)/i);
		ver = ver[0].split(" ");
		ver = parseFloat(ver[1]);
		device.v = ver;	// Android Version from UA String
	}
} else if ( navigator.userAgent.match(/OPR/i) || navigator.userAgent.match(/Opera/i) || window.opera ) {
		device.Platform = "Opera";
			if (navigator.userAgent.match(/Opera/i)) { // old Opera version
        	var fullVersion = window.opera.version();
			device.v = parseInt(''+fullVersion,10);
			var subVersion = fullVersion.split('.');
			device.bv = subVersion[1];
		} else {
			// this needs to be before Chrome because new Blink-based Opera lies and says it is Chrome.
			var ver = navigator.userAgent.match(/OPR\/(\d+\.\d+)/i);
				ver = parseFloat(ver[0].split("/")[1]);
			device.v = ver;
		}
} else if ( navigator.userAgent.match(/Chrome/i) ) {
		device.Platform = "Chrome"; // Check first since UA string contains Safari
		var fullVersion  = ''+parseFloat(navigator.appVersion); 
		var majorVersion = parseFloat(navigator.appVersion,7);
		var verOffset = navigator.userAgent.indexOf("Chrome");
		fullVersion = navigator.userAgent.substring(verOffset+7);
		device.v = parseFloat(''+fullVersion,10);
} else if (navigator.userAgent.match(/wOSBrowser/i) || navigator.userAgent.match(/webOS/i)) {
	device.OS = "webOS"; // check first since UA string contains Safari
	device.Platform = "WebKit";
	device.appName  = "Browser";
} else if (navigator.userAgent.match(/RIM/i) || navigator.userAgent.match(/PlayBook/i) || navigator.userAgent.match(/BlackBerry/i)) {
	device.OS = "BlackBerryOS";	// check first since UA string contains Safari
	device.Platform = "WebKit";
	device.appName  = "Browser";
} else if (navigator.userAgent.match(/Safari/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ) {
	device.Platform = "Safari";
	if (navigator.userAgent.match(/iOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ) {
		device.OS = "iOS";
		device.appName  = "Mobile Safari";
		var fullVersion = navigator.appVersion;
		fullVersion = fullVersion.split("OS ");
		var majorVersion = parseInt(fullVersion[1]);
		if (majorVersion > 7) { // iOS 8.x userAgent string reports as v 10
			if (navigator.appVersion.match(/Version/gi)) {	// browser view
				fullVersion  = navigator.appVersion.split("Version/");
				majorVersion = parseFloat(fullVersion[1]);	// point value is not accurate anyway
			} else {	// appView so no version value!
				majorVersion = 8;	// we will just have to assume it is at least v 8.0	
			}
		}
		device.v = majorVersion; // This is OS major version, not browser version
		if (!navigator.userAgent.match(/Safari/)) { // App View
			device.app = 1;
		} else { // Browser View, get actual browser version
			var fullVersion = navigator.appVersion;
			fullVersion = fullVersion.split("/");
			var majorVersion = parseFloat(fullVersion[2]);
			device.bv = majorVersion;
		}
	} else {
		var fullVersion  = ''+parseFloat(navigator.appVersion); 
		var majorVersion = parseInt(navigator.appVersion,7);
		var verOffset = navigator.userAgent.indexOf("Safari");
		fullVersion = navigator.userAgent.substring(verOffset-6);
		device.v = parseFloat(''+fullVersion,10);
	}
} else if (navigator.userAgent.match(/Firefox/i)) {
	if (navigator.userAgent.match(/\(Mobile/i) || navigator.userAgent.match(/\(Tablet/i)) {
		// only FF UA string with "Mobile"/"Tablet" right after parenthesis is Firefox OS	
		device.OS = "Firefox OS";
	}
	device.Platform = "Firefox" // Desktop Firefox
	var ver = navigator.userAgent.match(/Firefox\/../i);
	ver = ver[0].split("/");
	ver = parseFloat(ver[1]);
	device.v = ver;
} else {
	device.Platform = "Unknown";
	device.appName  = "Unknown";
}
// Rectify device OS if not already set
if (device.OS == undefined) {
	if (navigator.userAgent.match(/Windows/i)) { device.OS = "Windows";}
	else if (navigator.userAgent.match(/Macintosh/i)) { device.OS = "Mac";}
	else if (navigator.userAgent.match(/Linux/i)) { device.OS = "Linux";}
	else {};
}
// If Browser Version is not set use Device Version
if (device.bv == undefined) { device.bv = device.v; }
// If Browser AppName is not set use Platform Name
if (device.appName == undefined) { device.appName = device.Platform; }
// Now for a shorthand way to determine if we are on a mobile device or not
if (device.OS == 'Android' || device.OS == 'iOS' || device.OS == 'Windows 10 Mobile' || device.OS == 'Windows Phone 7' || device.OS == 'Windows Phone 8' || device.OS == 'BlackBerryOS' || device.OS == 'webOS' || device.OS == 'Firefox OS') {
	device.mobile = true;
} else {
	device.mobile = false;
}
	return device;
}());