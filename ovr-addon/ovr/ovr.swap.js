		// If using the optional OVR "Object VR" Viewer script you can define swap-out	//
		// versions of the images here. However, the OVR viewer does not scale up or  	//
		// down on window resize.  It is recommended, therefore, that you use one OVR 	//
		// viewer size for all window sizes so it does not have to scale up or down! 	//
		// This script must load BEFORE the OVR scripts or swap-outs won't work right.	//
var com = com || {};
	com.kmhcreative = com.kmhcreative || {};
	com.kmhcreative.Ovr = com.kmhcreative.Ovr || {};
	com.kmhcreative.Ovr.config = com.kmhcreative.Ovr.config || {}
	
com.kmhcreative.Ovr.config.swap = function(){			
		var ovrCount = 0; // Number of OVR Viewers (set to 0 to disable swap-outs) //
		var ovrImg = [];
		var ovrData = [];
	if ( ovrCount > 0 ) {
		for (var j=0; j<ovrCount; j++) {
				ovrData[j] = [];}
				ovrData[0][0] = ""; 	// mobile
				ovrData[0][1] = "images/portfolio/gallery/ovr/hires_medium/box/gingerbites_vr_00.jpg"; 	// desktop or tablet
				ovrData[0][2] = "";		// high-density mobile
				ovrData[0][3] = "images/portfolio/gallery/ovr/hires_medium/box/gingerbites_vr_00.jpg";		// high-density desktop or tablet
				
				ovrData[1][0] = "";
				ovrData[1][1] = "images/portfolio/gallery/ovr/hires_medium/display/popdisplay_vr_00.jpg";
				ovrData[1][2] = "";
				ovrData[1][3] = "images/portfolio/gallery/ovr/hires_medium/display/popdisplay_vr_00.jpg";
	}
	return {
		ovrCount : ovrCount,
		ovrData : ovrData
	}
}();