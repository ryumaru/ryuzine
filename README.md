# RYUZINE

Ryuzine is a magazine-style webapp publishing platform targeting both desktop and mobile readers with a cross-platform, responsive interface built on HTML5, Javascript, and CSS3 web technologies.  It does not rely on any third-party frameworks or libraries.

If you’re not interested in contributing code to the Ryuzine project you should download the Ryuzine [Publishers Distribution Kit](http://www.ryumaru.com/ryuzine/downloads/) (PDK) instead of the GitHub source code.

### Ryuzine Reader

The main Ryuzine webapp (aka “Ryuzine Reader”) is a webapp template that builds the responsive User Interface around an HTML document pre-formatted for conversion.  It is ideal for presenting web content in the format of a magazine, newsletter, or comic book in which the reader can flip through the pages just as they could with an actual, printed publication.

The Ryuzine files alone, however, don’t do anything.  It has to be associated with an HTML5 document using the Ryuzine Document Specification (in which various elements of the publication are “tagged” with specific class names and ID properties).

Creating publications is made easier by using either the “Ryuzine Writer” stand-alone authoring webapp (which creates static HTML webapps capable of being downloaded and read offline) or by bridging WordPress blog content via the “Ryuzine Press” plugin.  Of course, you could also create your publications with any HTML editor your prefer, so long as it conformed to the document specification format.

### Ryuzine Rack

Ryuzine Rack is a newsstand style webapp built on the same foundation as Ryuzine Reader.  It is designed to act as a library, store, links page, blogroll, promotions page, or catalog on your website.  While the main intent is to create a newsstand of Ryuzine publications you can create unlimited “catalogs” of various different types of online items organized however you like.

“Catalogs” are simple HTML files containing a table of data for Ryuzine Rack to display.  Because these catalogs are loaded into the webapp and processing happens on the client-side they reflow/reorder almost instantaneously even on mobile devices over cellular data connections.

Creating “catalog” files is made easier by using either the “Ryuzine Writer” stand-along authoring webapp (which has a Rack Data Builder function similar to a spreadsheet) or with the “Ryuzine Press” plugin for WordPress (which automatically adds Ryuzine Press Editions, but also allows you to customize Ryuzine Rack with other data, such as links to other websites or downloads).

### Some Assembly Required

If you downloaded source code from GitHub all the component parts of the Ryuzine webapps are separated into different repositories and you’ll need to assemble the webapp like flat-pack furniture before you can use it:

* you need a folder on your development server where you will work on Ryuzine publications (it doesn’t matter what you name the folder).
* inside that development folder you need sub-folders to store the support files for your individual publications named as follows:
	* css
	* data
	* fonts
	* images
	* js
* unzip the “master-ryuzine” file you downloaded from GitHub and rename it just “ryuzine”
* put the Reader/Rack add-ons in the “/ryuzine/addons” folder
	* iscroll add-on needs to have [iScroll](https://github.com/cubiq/iscroll/archive/master.zip) unzipped into it.
* put the Reader/Rack themes in the “/theme” folder
* Download and unzip [Font Awesome](https://github.com/FortAwesome/Font-Awesome/archive/4.1.0.zip) to the “/ryuzine/fonts” folder, change the name to just lowercase “font-awesome”
* Move/Copy the HTML files in the /ryuzine/res/ folder up two levels (so they are siblings of the “ryuzine” folder itself).


### Installation

Technically no installation is necessary.  Static publications can be distributed as ZIP archive downloads and (depending on the browser and OS security settings) opened and read offline.

That said, the primary method would be to upload static publications to a web server and serve them like any other HTML pages.

AUTHORING static publications requires installing Ryuzine on a Development Server and then installing Ryuzine Writer inside of Ryuzine (if you download the [PDK](http://www.ryumaru.com/ryuzine/downloads/) package then Writer is already inside it).  However, on Mac and Linux systems the built-in PHP webserver can be used as your Development Server, in which case Ryuzine Writer (and other work-in-progress Ryuzine publications) can be run from within an arbitrarily placed Ryuzine folder (i.e., it would not necessarily need to be placed in the built-in webserver’s HTML folder or in the /htdocs folder of a XAMPP/MAMPP installation).

Dynamic publications (those that bridge WordPress blog content into the Ryuzine webapp) require that Ryuzine Reader be installed *inside* the Ryuzine Press plugin (which has a utility for doing so).

### Code Contributions

**THIS REPOSITORY USES SUBTREES!**  The "addons" and "themes" folders are imported as subtrees from the "ryuzine-addons" and "ryuzine-themes" repositories, respectively.  Each of those, however, are entirely made up of subtrees imported from the individual add-on and theme repositories.  You should make changes to the repository for the specific add-on or theme instead of editing files in this repository. Then pull the commits from that repository into either the "ryuzine-addons" or "ryuzine-themes" repository, and finally pull those repositories into this one.

See also *Open Source Porject Contributions* at http://www.ryumaru.com/contributing-code/ and *Open Source Code of Conduct* at http://www.ryumaru.com/open-source-code-conduct/ for more details.

### License

“Ryuzine” and “Ryuzine Writer” are released under the Mozilla Public License (MPL) 2.0, the full text of which is bundled with the webapps. “Ryuzine Press” is released under the GNU General Public License version 3 (GPLv3).  Add-ons, Themes, Skins or other components may be under other licenses.

Distribution of publications in Ryuzine format does not require you to also provide source code if the webapp or plugin code has not been modified.

“Ryuzine” and the Ryuzine logos are trademarks of K.M. Hansen & Ryu Maru.  If you are distributing unaltered software, downloaded directly from Ryu Maru, to anyone in any way or for any purpose, no further permission is required.  Any other use of our trademarks requires prior authorization.
