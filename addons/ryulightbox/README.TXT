============================
|	RYULIGHTBOX	   |
============================
	Version 1.0

RYULIGHTBOX is an add-on for Ryuzine Reader & Rack webapps for use
with the native lightbox format using <figure> and <figcaption>

Note: If you have a Ryuzine publication using the old <div> format Ryulightbox will automatically convert those to the new format on the fly so they can be used with this add-on without having to edit the publication.

ABOUT RYULIGHTBOX
=================
This lightbox does not use any frameworks like jQuery, Mootools, etc., it is just HTML5+Javascript+CSS3.  It seeks to address some of the problems found with just about every lightbox script out there, namely:

1. Lightbox controls are usually tied to the lightboxed content, meaning as different sized content is displayed the close and gallery navigation buttons change their relative positions on the screen.

2. Most scripts create a single lightbox and then swap out the content inside of it.  There are little if any CSS animation options aside from the box expanding and contracting to fit the content and/or fading in/out.

3. Many lightbox scripts grab ALL the lightboxed content and preload it.  This is a problem with large galleries, large images, and especially on mobile devices (such as iPhone and iPad) that impose cache limits because it’s too easy for a preloaded gallery to exceed the limit.  This either severely slows down the experience and/or crashes the mobile browser.

4. Some scripts only allow direct-linking to media, others only allow embedding media in pre-existing containers.  Few let you mix and match.

5. The point of a lightbox is typically to show a larger view of something when a thumbnail is clicked.  However, on small screen devices it is possible for the lightboxed image to actually be displayed at a scaled size smaller than the thumbnail, which is obviously pointless.

Here is how these issues are addressed by RYULIGHTBOX:

1. Control buttons are in FIXED positions on-screen, independent of the ligthboxed content being displayed.  This makes for a better and more consistent user experience, especially on mobile devices where the controls are kept to the outside edges/corners where the user is likely to be holding the device.

2. Creates multiple lightboxes and allows you to apply pretty much any CSS3 animations and transforms to them.

3. Only preloads EMBEDDED content.  Direct-linked media is only loaded on-demand and is removed from the DOM on closing.

4. You can freely mix-and-match embedded content (where you can control the entire layout of what appears inside the lightbox) and direct-linked media (which puts the media in an lightbox automatically created on-the-fly).

5. The lightbox container has preset sizes and overflows content that doesn’t fit - which is the expected, default behavior in a web browser.  Large images remain large, since the point is typically to view detail.

USING RYULIGHTBOX
==================

1. Make sure the “ryulightbox” folder is in your Ryuzine /addons folder.

2. Add “ryulightbox” to the AddOns array in your publication’s “ryuzine.config.js” file.

4. Within your publication add the “lightbox links” users click to open the content in a lightbox.  The minimum required for this is:

	<a href=“[url]” rel=“lightbox”/>

That’s it!  Of course you may want to be a little more specific about what it is and the format.  Here is the complete list of other things you can put inside the <a> tag:

	href=“[url]”
	Absolute or relative URL or #anchor link

	rel=“lightbox”
	Tells the script this is a RyuLightBox link (you can change it from “lightbox”)

	class=“lb_[type]”
	Changes the icon that appears on the lightbox link to indicate
	what kind of content it is.  Valid types are:
		lb_plus	: “+” icon (also if type is omitted)
		lb_3d	: 3D/VR content
		lb_document : generic document icon
		lb_info	: (i) icon
		lb_larger : arrows indicating expand
		lb_magnify: magnifying glass
		lb_minus  : circle with (-) in it
		lb_movie  : filmstrip icon
		lb_video  : TV with play button in it
		lb_website: globe with lines on it

	data-linkid=“[embed-id]”
	Alternate way to link to embedded lightbox by ID when href=“#”
	or something else that isn’t a valid lightbox link.

	data-gallery=“[galleryname]”
	If you want to include the content from this link in a gallery
	indicate the gallery by name.  Items can only be a member of one
	named gallery at a time.

	If you would like all single images to be automatically grouped
	into a gallery set “single” to “1” in the ryulightbox.config.js file
	(note: gallery feature is ignored by RyuzineRack).

	data-aspect=“square|wide|book|tall”
	Determines the aspect ratio of the lightbox:
		square = 4:3 ratio (default if omitted)
		wide   = 16:9 widescreen ratio
		book   = 3:4 ratio for portrait content
		tall   = 9:16 ratio for portrait content

	data-layout=“landscape|portrait”
	Determines whether images within the lightbox are scaled
	by width (landscape) or height (portrait).  You should only
	need to use this if you are putting images with different
	orientations inside a single lightbox.  Otherwise just set
	the “data-aspect” and let it scale to fit by width.

	For embedded lightbox content you can still control the
	scaling by orientation by classname.  If all the images
	in the lightbox are the same orientation you can either
	include <figure class=“light_boxed land”> (or “port”).

	However, if your embedded lightbox has images of both
	orientations you should include class=“portrait” or 
	class=“landscape” inside the <img> tag to control whether
	it scales by width or height, respectively.

	data-caption=“[some text]”
	If you are direct-linking to media and want to also include
	a caption under the content in the automatically generated
	lightbox indicate the text for the <figcaption> this way.

	If you are linking to embedded content you should put your
	caption inside a <figcaption> inside the <figure> for that
	embed instead of doing it in the link.

	title=“[some text]”
	Alternatively, if you include a title but not a data-caption
	then the title will appear as the caption under direct-linked
	media.  If there is also a data-caption, however, that would
	be preferred over the title text.

EMBEDDED LIGHTBOXES
===================
As noted above you don’t have to just direct-link to media by URL, you can also embed content in your Ryuzine publication instead.  The simplest form of this would be:

	<figure id=“myid” class=“light_boxed”>
		<img src=“images/myimag.png”/>
	</figure>
	
	or, if you also want a caption under it:

	<figure id=“myid” class=“light_boxed”>
		<img src=“images/myimage.png”/>
		<figcaption>This is my images</figcaption>
	</figure>


Then include a lightbox link somewhere in your publication like this:

	<a href=“#myid” rel=“lightbox”/>

	or like this:

	<a href=“#” data-linkid=“myid” rel=“lightbox”/>

If you are using Ryuzine Writer 1.0 to create your publication the Ryuzine Elements panel in the Editor has a dialog for creating both links and embedded lightboxes.

NOTES
=====
To direct-link a video from YouTube you need to use the embed URL because “same origin” policy will block linking to the whole page.
	
	YES: http://www.youtube.com/embed/gObBleDeGoOp

	NO!: http://youtu.be/gObBleDeGoOp

Or grab the “Embed” link from YouTube and put it in an embedded <figure> in your publication.  Just make sure that, before you try to link to ANY video form anywhere, that you have set “iframe” to “true” in the “ryulightbox.config.js” file or it won’t work at all.

For Vimeo you must use the “player” format URL:

	YES: http://player.vimeo.com/video/00000000
	NO!: https://vimeo.com/00000000

Be aware that iPhones and iPads running iOS 8.0 - 8.2 have a bug in Safari Mobile that causes the browser to crash if you include just about any content in an <iframe>.  The bug appears to have been fixed in iOS 8.3.

LICENSE
=======
Ryulightbox is released under the MIT license.  Feel free to improve it, add to it, or adapt it to other uses.






