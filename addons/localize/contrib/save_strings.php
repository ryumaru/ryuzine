<!DOCTYPE html>
<html>
<head>
<title>Save Strings</title>
<?php
die("this script is disabled for security");
/**
	To use this script:
	1. Comment or Remove the "die" on line 6
	2. Run RYU.addon.localize.parse() in browser javascript console to parse strings
	3. Run RYU.addon.localize.merge() in browser javascript console to merge string files
	4. Files are saved in /addons/localize/contrib/
	5. If you are adding language support for the webapps themselves (instead of just for
	   your own add-on) please contribute your translation files back to Ryuzine on GitHub
**/
function saveStrings($scope,$type,$filecontents,$code) {
	if ($scope == 'ryuzinewriter') {
		$pfx = 'writer_';
	} else if ($scope == 'ryuzinerack' || $scope == 'ryuzinereader') {
		$pfx = '';
	} else if ($scope == 'xinha') {
		$pfx = 'xinha_';
	} else {
		$pfx = $scope.'_';
	}
	if ( $type == '0') {
		$ext = '.txt';
	} else {
		$ext = '.js';
	}
	if ( $code == '') {
		$code = 'en';
	}
	$filename = $pfx.$code.$ext;
	$MY_PATH = $_SERVER['DOCUMENT_ROOT'].$_SERVER['PHP_SELF'];
	$MY_PATH = explode('save_strings.php',$MY_PATH);
	$myFile = $MY_PATH[0].$filename;
	$fh = fopen($myFile,'w') or die("can't open file");
	$stringData = $filecontents;
	fwrite($fh,$stringData);
	fclose($fh);
	echo '<script>alert("Strings exported for file '.$myFile.'");</script>';
}
if($_SERVER['REQUEST_METHOD'] == "POST")  {
	saveStrings($_POST['save_strings_scope'],$_POST['save_strings_type'],$_POST['save_strings_content'],$_POST['save_strings_code'],0);
}
?>
</head>
<body>
<form name="save_strings_form" id="save_strings_form" method="post" action="" >
<input type="hidden" name="save_strings_content" id="save_strings_content" />
<input type="hidden" name="save_strings_scope" id="save_strings_scope" />
<input type="hidden" name="save_strings_type" id="save_strings_type" />
<input type="hidden" name="save_strings_code" id="save_strings_code" />
</form>
</body>
</html>