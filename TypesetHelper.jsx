/**
 * Typeset Helper
 * Version: 0.1.1
 * Description: A typesetting script for Photoshop CS6+. It's meant to lay the groundwork for your typesetting. It will copy/paste the text from a script onto the relevant pages, with some basic font settings.
 * Author: Ikkyusan
 *
 * How to use it:
 * 1) Place the current file into Photoshop's application subfolder Presets/Scripts
 * 2) Run Photoshop, then File>Automate>Typeset Helper
 * Alternatively, you can just do File>Scripts>Browse and open the script.
 * Alternatively, normally you can also run the script by double-clicking on it. Or do a right-click, 'Open-with Photoshop'.
 *
 * Thanks to:
 * the people from www.ps-scripts.com for their snippets
 * Marc Autret from www.indiscripts.com for his ExtendScript RegexTester he posted on www.indiscripts.com
 * and as usual, every contributors from stackoverflow
 */

/*
<javascriptresource>
<name>Typeset Helper...</name>
<menu>automate</menu>
</javascriptresource>
*/

// enable double clicking from the
// Macintosh Finder or the Windows Explorer
#target photoshop

// Make Photoshop the frontmost application
app.bringToFront();

// vars
var os = $.os.toLowerCase().indexOf('mac') >= 0 ? 'Mac' : 'Windows';
var psdFilter, txtFilter, jsonFilter;
var selectedFiles = [];
var targetFolder = '';
var scriptPath = '';
var fontFallback = 'ArialMT';
var defaultFonts = {
	regular: {
		name: 'CCJeffCampbell',
		size: 20,
		correspondingLineStyles: ['regular', 'regular_font']
	},
	italic: {
		name: 'CCJeffCampbellItalic',
		size: 20,
		correspondingLineStyles: ['italic', 'thoughts']
	},
	nib: {
		name: 'CCJeffCampbellItalic',
		size: 20,
		correspondingLineStyles: ['nib']
	},
	bolditalic: {
		name: 'CCJeffCampbellBoldItalic',
		size: 22,
		correspondingLineStyles: ['yell', 'shout', 'bolditalic', 'scream']
	},
	sfx: {
		name: 'BadaBoomBB',
		size: 25,
		correspondingLineStyles: ['sfx']
	},
	sfxib: {
		name: 'AdamWarrenpro-BoldItalic',
		size: 25,
		correspondingLineStyles: ['sfxib']
	},
	handwritten: {
		name: 'MDBurnette',
		size: 20,
		correspondingLineStyles: ['handwritten']
	},
	notes: {
		name: 'ElectraLTStd-Bold',
		size: 16,
		correspondingLineStyles: ['panel_note', 'footnote', 'notes', 'note', 'newspaper', 'tv', 'radio', 'book', 'sign', 'pa']
	}
};
var layerGroups = {
	bubbles: {
		name: 'BUBBLES',
		styles:	['regular_font', 'regular', 'italic', 'nib', 'thoughts', 'yell', 'shout', 'scream', 'bolditalic', 'handwritten', 'sfxib']
	},
	sfxs: {
		name: 'SFXS',
		styles: ['sfx']
	},
	others: {
		name: 'OTHERS',
		styles: ['panel_note', 'footnote', 'notes', 'note', 'newspaper', 'tv', 'radio', 'book', 'sign', 'pa']
	}
};
var ignoredLineSymboles = ['—', '-', '--'];
var emptyPage = ['blank', 'empty', 'no_text'];
var doubleBubbleSplitter = '//';
var selectedFonts = clone(defaultFonts);
var fontNames = [];
for (var i=0; i < app.fonts.length; i++) {
	fontNames.push(app.fonts[i].postScriptName);
};
fontNames.unshift('No selection');

if (os === 'Windows') {
	psdFilter = 'Adobe PSD:*.psd';
	txtFilter = 'Text File:*.txt';
	jsonFilter = 'JSON File:*.json';
}
else {
	psdFilter = function(filename) { return fileFilter(filename, ['psd']); }
	txtFilter = function(filename) {	return fileFilter(filename, ['txt']);	}
	jsonFilter = function(filename) {	return fileFilter(filename, ['json']); }
}


// polyfills and stuff

/* JSON2.JS from https://github.com/douglascrockford/JSON-js */
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?i+"":"null";case"boolean":case"null":return i+"";case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;u>r;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;u>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {
		var k;
		if (this == null) throw new TypeError('"this" is null or not defined');
		var o = Object(this);
		var len = o.length >>> 0;
		if (len === 0) return -1;
		var n = +fromIndex || 0;
		if (Math.abs(n) === Infinity) n = 0;
		if (n >= len) return -1;
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
		while (k < len) {
			if (k in o && o[k] === searchElement) return k;
			k++;
		}
		return -1;
	};
}

if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}

function clone(obj) {
	if(null === obj || "object" != typeof obj) return obj;
	var copy;
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}
	throw new Error('Unable to copy obj! Its type is not supported.');
};

function unique(/*str[]*/ arr) {
	var o = {},
		r = [],
		n = arr.length,
		i;
	for (i = 0 ; i < n ; ++i)
		o[arr[i]] = null;
	for (i in o)
		r.push(i);
	o = null;
	return r;
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// help dialog
function showHelp() {
	var dlg = new Window('dialog', 'Translation script rules', [100, 100, 800, 750]);
	var btnShowExample = dlg.add('button', [190, 600, 280, 630], 'Script ex.');
	btnShowExample.onClick = function() { showScriptExample(); }
	var btnShowFontsExample = dlg.add('button', [295, 600, 405, 630], 'Fonts JSON ex.');
	btnShowFontsExample.onClick = function() { showFontsExample(); }
	var btnCancel = dlg.add('button', [435, 600, 500, 630], 'Close');
	btnCancel.onClick = function() {
		this.parent.close();
		dlg = null;
	}
	var text = dlg.add('edittext', [10, 10, 690, 590], undefined, {readonly: true, multiline: true});
	text.text = "\
### Page numbers\
- They must be written on three or four digits.\
- They must be followed by a # character.\
- Double-pages are numbered like this : 010-011#\
- The end of the script is marked by the anchor END#\
- The working script is what is between the first page 001# and END#\
- Text before and after these anchors will not be taken into account, so it's a good place to add translation notes and whatnot.\
\
\
### Files\
- Files must be in psd format.\
- The filenames must end with the page number, preceded by a space, a dash or an undescore. e.g. : \
		Super-Series_vol4_010.psd\
For a double-page :	\
		Super-Series_vol4_012-013.psd\
\
\
### Bubbles\
- The rule is one bubble per line. In other words, bubbles are separated by a carriage return.\
- Some lines can be ignored. For instance, to keep the script readable, empty lines are used to lighten the text. Also, sometimes it can be useful to separate the panels. In which case, the line must contain only the separation symbol.\
- The parts of a multi-bubble are considered to be different bubbles. But, we still need to know when a line is part of a multi-bubble. For this, we put a double slash at the beginning of the following parts. e.g. :\
\
	This is a the first part of the multi-bubble.\
	// This line corresponds to the second part of the multi-bubble.\
\
- When a page doesn't contain any text, or at least, nothing to be typesetted, you can make the script skip it using one of the empty page keywords. Between brackets, as usual. It must the first text of the page. Meaning, you can add a whole essay after that, it won't be typesetted.\
\
\
### Styles and text type/placement\
The text type (or placement) defines the nature of the text line. The text can be in a bubble, it can be not in a bubble (like some narrative stuff), it can be a sfx, or a sfx in a bubble, or a footnote...\
Based on this, not only the text type gives us typesetters a clue as to where to insert the text on the page, it also tells us what style should be applied.\
\
Thus, text types/placements are actually text styles.\
\
- They must be written between square brackets, like so : [italic]\
- Only one style OR placement per line.\
- They can be written at the beginning OR just after a line. e.g. :\
\
	[nib] This text is not in a bubble.\
	This bubble should be in italic. [italic]\
\
- Usually, the text type should be placed at the beginning of the line, not the end.\
- Usually, the style should be added at the end of the line, not the beginning.\
- A style can be applied for a whole page. In which case, add the style right after the page number :\
\
	035# [shout]\
	All the bubbles will be written in \"bolditalic style\"\
\
- It is possible to override this \"page style\" by adding the style you at the beginning or the end of the line.\
- What about the multi-bubbles ? Almost the same principle. The sister parts will inherit the style of the ***previous part***. You can of course override the style of each part of the bubble. e.g. :\
\
	This first part is a shout bubble. [shout]\
	// Second part will inherit the previous style.\
	// But we want the third part to be written in italic. [italic]\
\
\
### Notes\
Basically, notes are everything that doesn't correspond to the styles' keywords.\
- They must be (you guessed it) written between square brackets.\
- They must not contain any carriage return.\
- They must be placed at the end of a line, after everything else.\
\
\
## Layer sorting\
Typeset Helper has a checkbox \"Use layer groups\". When checked, it makes the script sort the layers in different groups.\
The groups will be created if they don't exist.\
- BUBBLES group will contain, well, the bubbles, but also the not-in-bubble, and the sfxib.\
- SFXS group will contain the sfx.\
- OTHERS will contain footnotes, and all the rest.\
\
\
## Keywords and relations\
(keywords are at the right)\
\
### Font styles relations\
- regular font style : [regular], [regular_font]\
- italic font style : [italic], [thoughts]\
- bolditalic font style : [yell], [shout], [scream], [bolditalic]\
- not in bubble font style : [nib]\
- sfx font style : [sfx] \
- sfx in bubble : [sfxib]\
- handwritten font style : [handwritten]\
- notes font style : [panel_note], [footnote], [notes], [note], [newspaper], [tv], [radio], [book], [sign], [pa]\
\
### Layer groups relations\
- BUBBLES : [regular_font], [regular], [italic], [nib], [thoughts], [bolditalic], [yell], [shout], [scream], [handwritten], [sfxib]\
- SFXS : [sfx]\
- OTHERS : [panel_note], [footnote], [notes], [note], [newspaper], [tv], [radio], [book], [sign], [pa]\
\
### The rest\
- Empty page : [blank], [empty], [no_text]\
- Panel separation symbols :	-, —, --\
- Multi-bubble separator :	//\
";

	dlg.center();
	dlg.show();
}


function showScriptExample() {
	var dlg = new Window('dialog', 'Script Example', [100, 100, 800, 750]);
	var btnCancel = dlg.add('button', [295, 600, 405, 630], 'Close');
	btnCancel.onClick = function() {
		this.parent.close();
		dlg = null;
	}
	var text = dlg.add('edittext', [10, 10, 690, 590], undefined, {readonly: true, multiline: true});
	text.text = "\
Title : A book in a foreign language\
Translator : Yours truly\
Base language : a language I barely understand\
\
These notes won't be taken into account by the typesetter script.\
\
\
001#\
First Bubble.\
\
—\
\
Second Bubble. This one is not supposed to be on the same panel as the previous bubble.\
—\
\
[nib] Not that it really matters : it's just to show that some special characters can be ignored. In this case, a long dash was on the previous line to signify a change of panel.\
\
[sfx] Another bubble, this one is a double-bubble. First part is sfx styled.\
// Second part, will be a sfx too, because no style has been defined on this line.\
\
Another double-bubble. First part is bolditalic style. [yell] \
// The second part, on the other hand, will be handwritten. [handwritten]\
\
\
002# [italic] [all the bubbles on this page will be written in italic, unless the style is overriden on a line]\
[nib] A text not in bubble.\
\
A big bubble...\
// All the part of this multi-bubble will be written in italic.\
// Because no override style has been defined, and the page style is 'italic'.\
\
Giga pudding! [shout] [this bubble will be written in bolditalic style, even if the page was set to 'italic']\
\
\
003#\
[blank] [this page has no text, it won't be typesetted]\
\
\
004# [not a style, just a note]\
[sfx] Some sfx\
\
[sfx] Blamo!\
\
[sfxib] Sfx in balloon.\
\
\
END#\
\
Everything that appears after the END anchor won't be taken into account either.\
	";
	dlg.center();
	dlg.show();
}


function showFontsExample() {
	var dlg = new Window('dialog', 'Fonts JSON Example', [100, 100, 800, 750]);
	var text = dlg.add('edittext', [10, 10, 690, 590], undefined, {readonly: true, multiline: true});
	var btnCancel = dlg.add('button', [295, 600, 405, 630], 'Close');
	btnCancel.onClick = function() {
		this.parent.close();
		dlg = null;
	}
	text.text ='\
// The font names are the postscript names of the fonts\
{\
	"regular": {\
		"name": "CCJeffCampbell",\
		"size": 20\
	},\
	"italic": {\
		"name": "CCJeffCampbellItalic",\
		"size": 20\
	},\
	"bolditalic": {\
		"name": "CCJeffCampbellBoldItalic",\
		"size": 22\
	},\
	"nib": {\
		"name": "CCJeffCampbellItalic",\
		"size": 20\
	},\
	"sfx": {\
		"name": "BadaBoomBB",\
		"size": 25\
	},\
	"sfxib": {\
		"name": "AdamWarrenpro-BoldItalic",\
		"size": 25\
	},\
	"handwritten": {\
		"name": "MDBurnette",\
		"size": 20\
	},\
	"notes": {\
		"name": "ElectraLTStd-Bold",\
		"size": 16\
	}\
}\
';
	dlg.center();
	dlg.show();
}


function showAvailableFonts() {
	var dlg = new Window('dialog', 'Available fonts', [100, 100, 800, 750]);
	var text = dlg.add('edittext', [10, 10, 690, 590], undefined, {readonly: true, multiline: true});
	var btnCancel = dlg.add('button', [295, 600, 405, 630], 'Close');
	btnCancel.onClick = function() {
		this.parent.close();
		dlg = null;
	}
	text.text = fontNames.join('\n');
	dlg.center();
	dlg.show();
}


function fileFilter(filename, extensions) {
	if (filename instanceof Folder) return true;
	var dot = filename.toString().lastIndexOf('.');
	if (dot == -1) return false;
	var extension = filename.toString().substr(dot + 1, filename.toString().length - dot);
	extension = extension.toLowerCase();
	for (var i = 0; i < extensions.length; i++) {
		if (extension ==  extensions[i]) return true;
	}
	return false;
}


function getPageNumber(filename) {
	var reg = /^.*[-_\ ]([\d-]{3,9})\.psd$/;
	var match = reg.exec(filename);
	return (!!match && !!match[1])? match[1] : null;
}


// pageNumber can be a double page, like "006-007"
// returns array of matches or null
// [0]: the whole match
// [1]: undefined or a page note. Mainly used to apply a style to a whole page, like [italic]
// [2]: the page's bubbles.
// [3]: start of the next page or end
function getPageText(text, pageNumber) {
	var reg = new RegExp(pageNumber + '#\\ ?(.*)?\\n([\\s\\S]*?)($|END|[\\d-]{3,9}#)');
	var match = reg.exec(text);
	return (!!match)? match : null;
}


// returns the first style found, or null
function getTextStyle(text, fallback) {
	if(!!!text) return (!!fallback)? fallback : null;
	var reg = /\[(\w+)\]/;
	var match = reg.exec(text);
	if (!!match && !!match[1]) {
		for (var key in layerGroups) {
			if (layerGroups[key].styles.indexOf(match[1]) > -1) return match[1];
		}
	}
	return (!!fallback)? fallback : null;
}


function pageContainsText(text) {
	if(!!!text) return false;
	text = text.trim();
	if(text.length === 0) return false;
	else {
		for(var i = 0; i < emptyPage.length; i++) {
			if(text.indexOf('[' + emptyPage[i] + ']') == 0) return false;
		}
		return true;
	}
}


function skipThisLine(text) {
	if (!!!text) return true;
	text = cleanLine(text);
	return !!!text || text.length == 0 || ignoredLineSymboles.indexOf(text) > -1;
}


function isDoubleBubblePart(text) {
	if (!!!text) return false;
	text = text.trim();
	var reg = /^\/{2}.*$/;
	var match = reg.test(text);
	return !!match;
}


function cleanLine(text) {
	if(!!!text) return null;
	var reg = /(\[[\s\w\d]*\]\ ?)*(\/{0,2})([^\[]*)/;
	var match = reg.exec(text);
	return (!!match && !!match[match.length - 1])? match[match.length - 1].trim() : null;
}


// WTF, Adobe, seriously. We shouldn't even need this.
function getAdjustedSize(size) {
	return size / (activeDocument.resolution / 72);
}


function getBasicTextboxWidth(fontSize) {
	return Math.round(getAdjustedSize(fontSize) * 7);
}


function getCorrespondingFontSetting(style) {
	for (var key in selectedFonts) {
		if (selectedFonts.hasOwnProperty(key)) {
			if (selectedFonts[key].correspondingLineStyles.indexOf(style) > -1) return selectedFonts[key];
		}
	}
	return selectedFonts.regular;
}


function getLayerDimensions(layer) {
	return {
		width: layer.bounds[2] - layer.bounds[0],
		height: layer.bounds[3] - layer.bounds[1]
	};
}


function getRealTextLayerDimensions(textLayer) {
	var textLayerCopy = textLayer.duplicate(activeDocument, ElementPlacement.INSIDE);
	textLayerCopy.textItem.height = activeDocument.height;
	textLayerCopy.rasterize(RasterizeType.TEXTCONTENTS);
	var dimensions = getLayerDimensions(textLayerCopy);
	textLayerCopy.remove();
	return dimensions;
}


function adjustTextLayer(textLayer) {
	var dimensions = getRealTextLayerDimensions(textLayer);
	textLayer.textItem.height = dimensions.height;
}


function addTextLayer(text, fontSetting, hyphenate, layerGroup, nth) {
	var textLayer = activeDocument.artLayers.add();
	textLayer.kind = LayerKind.TEXT;
	var textItem = textLayer.textItem;
	textItem.kind = TextType.PARAGRAPHTEXT;
	textItem.width = getBasicTextboxWidth(fontSetting.size);
	textItem.height = activeDocument.height;
	textItem.justification = Justification.CENTER;
	textItem.hyphenation = hyphenate;
	textItem.font = fontSetting.name;
	textItem.antiAliasMethod = AntiAlias.SMOOTH;
	textItem.size = getAdjustedSize(fontSetting.size) + 'px';
	textItem.position = [nth * 20,  nth * 20];
	textItem.contents = text;
	adjustTextLayer(textLayer);
	if (!!layerGroup) textLayer.move(layerGroup, ElementPlacement.INSIDE);
	textLayer = null;
	textItem = null;
}


function resetLayerRefs() {
	for (var key in layerGroups) {
		layerGroups[key].layerRef = null;
	}
}


function setFontsUI() {
	for(var key in selectedFonts) {
		dlg['select_' + key].selection = fontNames.indexOf(selectedFonts[key].name);
		dlg['edit_' + key + '_size'].text = selectedFonts[key].size;
	}
	dlg.useLayerGroups.value = true;
	dlg.hyphenate.value = true;
}


function setSelectedFonts(fontsObject) {
	for (var key in selectedFonts) {
		if (!!fontsObject[key] && !!fontsObject[key].name && fontNames.indexOf(fontsObject[key].name) > -1) {
			selectedFonts[key].name = fontsObject[key].name ;
		}
		else selectedFonts[key].name = (fontNames.indexOf(defaultFonts[key].name) > -1)? defaultFonts[key].name : fontFallback;
		selectedFonts[key].size = (!!fontsObject[key] && !!fontsObject[key].size && isNumber(fontsObject[key].size))? fontsObject[key].size : defaultFonts[key].size;
	}
}


function setFonts(fontsObject) {
	setSelectedFonts(fontsObject);
	setFontsUI();
}


function fontsFromFile() {
	var fontsFile = File.openDialog('Please select the fonts json file.', jsonFilter);
	if (fontsFile != null) {
		var fileOK = fontsFile.open('r');
		if(fileOK){
			var content;
			content = fontsFile.read();
			var fontsObject = JSON.parse(content);
			setFonts(fontsObject);
			fontsFile.close();
		}
		else{
			alert('Failed to open file');
		}
	}
}


function failsafe() {
	if (!!!dlg.selectedFiles.items.length) {
		alert('Please select some files first');
		return false;
	}
	if (!!!targetFolder) {
		alert('Please select a target folder');
		return false;
	}
	if (!!!scriptPath) {
		alert('Please select the script that needs to be typesetted');
		return false;
	}
	for(var key in selectedFonts) {
		if (!isNumber(selectedFonts[key].size) || selectedFonts[key].size < 1) {
			alert('Invalid font size for : ' + key);
			return false;
		}
	}
	return confirm('This will overwrite the files in target folder. Do you still wish to continue ?', true);
}


function run() {
	try {
		if (!failsafe()) return false;
		var scriptFile = new File(scriptPath);
		var fileOK = scriptFile.open('r');
		if(fileOK){
			var text = scriptFile.read();
			// set app prefs to pixels.
			var originalTypeUnits = app.preferences.typeUnits;
			app.preferences.typeUnits = TypeUnits.PIXELS;
			var originalRulerUnits = app.preferences.rulerUnits;
			app.preferences.rulerUnits = Units.PIXELS;
			var useLayerGroups = dlg.useLayerGroups.value;
			var hyphenate = dlg.hyphenate.value;
			var skipSfxs = dlg.skipSfxs.value;

			var fileList = dlg.selectedFiles.items;
			for (var i = 0; i < fileList.length; i++) {
				var pageNumber = getPageNumber(fileList[i].toString());
				if (!!!pageNumber) {
					alert('No page number for file : ' + fileList[i].toString());
				}
				else {
					var pageScript = getPageText(text, pageNumber);

					if (!!pageScript) {
						var pageNote = pageScript[1];
						var bubbles = pageScript[2];
						var previousStyle = 'regular';
						var psdFile =  new File(fileList[i]);
						open(psdFile);
						// are the bubbles actually bubbles ?
						if (pageContainsText(bubbles)) {
							// we've got some text to typeset for this page, so let's get started
							if (useLayerGroups == true) {
								for (var key in layerGroups) {
									try {
										layerGroups[key].layerRef = app.activeDocument.layerSets.getByName(layerGroups[key].name);
									}
									catch (e) {
										layerGroups[key].layerRef = app.activeDocument.layerSets.add();
										layerGroups[key].layerRef.name = layerGroups[key].name;
									}
								}
							}
							// page's global style, forced to regular if none is set.
							var pageStyle = getTextStyle(pageNote, 'regular');
							var lines = bubbles.split('\n');
							var n = 0;
							for (var j = 0; j < lines.length; j++) {
								var line = lines[j];
								if (!skipThisLine(line)) {
									// line style will be the first thing that's between brackets
									// but if we're dealing with a double-bubble part, maybe there's a previous style set for it
									var lineStyle = (isDoubleBubblePart(line))? getTextStyle(line, previousStyle) : getTextStyle(line, pageStyle);
									var cleanedText = cleanLine(line);
									var correspondingFont = getCorrespondingFontSetting(lineStyle);
									// alert('style ' + lineStyle + ' == ' + cleanedText);
									n++;
									if (skipSfxs && lineStyle == 'sfx') {
										continue
									}
									else {
										if (useLayerGroups == true) {
											for (var key in layerGroups) {
												if (layerGroups[key].styles.indexOf(lineStyle) > -1) {
													addTextLayer(cleanedText, correspondingFont, hyphenate, layerGroups[key].layerRef, n);
													break;
												}
												else continue;
											}
										}
										else {	// otherwise, simply add the layer to the document
											addTextLayer(cleanedText, correspondingFont, hyphenate, null, n);
										}
									}
									previousStyle = lineStyle;
								}
							}
							resetLayerRefs();
						}

						var saveFile = new File(targetFolder + '/' + app.activeDocument.name);
						app.activeDocument.saveAs(saveFile);
						app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
						psdFile = null;
						saveFile = null;
					}
				}
			}
			app.preferences.typeUnits = originalTypeUnits;
			app.preferences.rulerUnits = originalRulerUnits;
			scriptFile.close();
			alert('Done');
		}
		else{
			alert('Failed to open script');
		}
	}
	catch (e) {
		alert(e);
	}
}


// UI
var dlg = new Window('dialog', 'Typeset parameters', [100, 100, 610, 820]);

// files
dlg.files = dlg.add('panel', [10, 10, 500, 320], 'Files', {borderStyle: 'etched', su1PanelCoordinates: true});
dlg.selectedFiles = dlg.files.add('listbox', [10, 10, 350, 220], [], {multiselect: true});
dlg.btnSelectTargetFiles = dlg.files.add('button', [360, 10, 480, 30], 'Browse files');
dlg.btnRemoveSelectedFiles = dlg.files.add('button', [360, 40, 480, 60], 'Remove selected');
dlg.btnRemoveAllFiles = dlg.files.add('button', [360, 70, 480, 90], 'Remove all');

dlg.btnSelectTargetFiles.onClick = function() {
	var files = File.openDialog('Please select the files you want to typeset', psdFilter, true);
	var pre = [];
	for (var i = 0; i < dlg.selectedFiles.items.length; i++) {
		pre.push(dlg.selectedFiles.items[i].fsName);
	}
	dlg.selectedFiles.removeAll();
	if (files != null) {
		for (var i = 0; i < files.length; i++) {
			pre.push(files[i].fsName);
		}
		pre = unique(clone(pre)).sort();
		for (var i = 0; i < pre.length; i++) {
			dlg.selectedFiles.add('item', pre[i]);
		}
	}
};

dlg.btnRemoveSelectedFiles.onClick = function() {
	var lst = dlg.selectedFiles;
	if (!!!lst.selection) return false;
	var se = lst.selection;
	for (var i = 0; i < se.length; i++) {
		lst.remove(se[i]);
	}
};

dlg.btnRemoveAllFiles.onClick = function() { dlg.selectedFiles.removeAll(); };

dlg.btnSelectScriptPath = dlg.files.add('button', [360, 230, 480, 250], 'Translation file');
dlg.editScriptPath = dlg.files.add('edittext', [10, 230, 350, 250], '', {readonly: true});
dlg.btnSelectScriptPath.onClick = function() {
	var file = File.openDialog('Please select the script file', txtFilter, false);
	if (file != null) {
		scriptPath = file.fsName;
		dlg.editScriptPath.text = scriptPath;
	}
}

dlg.btnSelectTargetFolder = dlg.files.add('button', [360, 260, 480, 280], 'Target folder');
dlg.editTargetFolder = dlg.files.add('edittext', [10, 260, 350, 280], '', {readonly: true});
dlg.btnSelectTargetFolder.onClick = function() {
	var folder = Folder.selectDialog('Select target folder', null, false);
	if (folder != null) {
		targetFolder = folder.fsName;
		dlg.editTargetFolder.text = targetFolder;
	}
}

// font choice
dlg.fonts = dlg.add('panel', [10, 330, 500, 640], 'Fonts', {borderStyle: 'etched', su1PanelCoordinates: true});

dlg.fonts.add('statictext', [10, 10, 90, 27], 'Type');
dlg.fonts.add('statictext', [230, 10, 260, 27], 'Font');
dlg.fonts.add('statictext', [420, 10, 480, 27], 'Size (px)');

dlg.fonts.add('statictext', [10, 35, 90, 50], 'Regular');
dlg.select_regular = dlg.fonts.add('dropdownlist', [100, 30, 400, 55], fontNames);
dlg.select_regular.onChange = function() { selectedFonts.regular.name = this.selection; }
dlg.edit_regular_size = dlg.fonts.add('edittext', [430, 32, 460, 52], selectedFonts.regular.size);
dlg.edit_regular_size.onChange = function() { selectedFonts.regular.size = this.text; }

dlg.fonts.add('statictext', [10, 60, 90, 75], 'Italic');
dlg.select_italic = dlg.fonts.add('dropdownlist', [100, 55, 400, 80], fontNames);
dlg.select_italic.onChange = function() { selectedFonts.italic.name = this.selection; }
dlg.edit_italic_size = dlg.fonts.add('edittext', [430, 57, 460, 77], selectedFonts.italic.size);
dlg.edit_italic_size.onChange = function() { selectedFonts.italic.size = this.text; }

dlg.fonts.add('statictext', [10, 85, 90, 100], 'Bolditalic');
dlg.select_bolditalic = dlg.fonts.add('dropdownlist', [100, 80, 400, 105], fontNames);
dlg.select_bolditalic.onChange = function() { selectedFonts.bolditalic.name = this.selection; }
dlg.edit_bolditalic_size = dlg.fonts.add('edittext', [430, 82, 460, 102], selectedFonts.bolditalic.size);
dlg.edit_bolditalic_size.onChange = function() { selectedFonts.bolditalic.size = this.text; }

dlg.fonts.add('statictext', [10, 110, 90, 125], 'NIB');
dlg.select_nib = dlg.fonts.add('dropdownlist', [100, 105, 400, 130], fontNames);
dlg.select_nib.onChange = function() { selectedFonts.nib.name = this.selection; }
dlg.edit_nib_size = dlg.fonts.add('edittext', [430, 107, 460, 127], selectedFonts.nib.size);
dlg.edit_nib_size.onChange = function() { selectedFonts.nib.size = this.text; }

dlg.fonts.add('statictext', [10, 135, 90, 150], 'Sfx');
dlg.select_sfx = dlg.fonts.add('dropdownlist', [100, 130, 400, 155], fontNames);
dlg.select_sfx.onChange = function() { selectedFonts.sfx.name = this.selection; }
dlg.edit_sfx_size = dlg.fonts.add('edittext', [430, 132, 460, 152], selectedFonts.sfx.size);
dlg.edit_sfx_size.onChange = function() { selectedFonts.sfx.size = this.text; }

dlg.fonts.add('statictext', [10, 160, 90, 175], 'Sfxib');
dlg.select_sfxib = dlg.fonts.add('dropdownlist', [100, 155, 400, 180], fontNames);
dlg.select_sfxib.onChange = function() { selectedFonts.sfxib.name = this.selection; }
dlg.edit_sfxib_size = dlg.fonts.add('edittext', [430, 157, 460, 177], selectedFonts.sfxib.size);
dlg.edit_sfxib_size.onChange = function() { selectedFonts.sfxib.size = this.text; }

dlg.fonts.add('statictext', [10, 185, 90, 200], 'Handwritten');
dlg.select_handwritten = dlg.fonts.add('dropdownlist', [100, 180, 400, 205], fontNames);
dlg.select_handwritten.onChange = function() { selectedFonts.handwritten.name = this.selection; }
dlg.edit_handwritten_size = dlg.fonts.add('edittext', [430, 182, 460, 202], selectedFonts.handwritten.size);
dlg.edit_handwritten_size.onChange = function() { selectedFonts.handwritten.size = this.text; }

dlg.fonts.add('statictext', [10, 210, 90, 225], 'Notes');
dlg.select_notes = dlg.fonts.add('dropdownlist', [100, 205, 400, 230], fontNames);
dlg.select_notes.onChange = function() { selectedFonts.notes.name = this.selection; }
dlg.edit_notes_size = dlg.fonts.add('edittext', [430, 208, 460, 228], selectedFonts.notes.size);
dlg.edit_notes_size.onChange = function() { selectedFonts.notes.size = this.text; }

dlg.hyphenate = dlg.fonts.add('checkbox', [10, 240, 150, 260], 'Hyphenate');

dlg.skipSfxs = dlg.fonts.add('checkbox', [10, 270, 150, 290], 'Skip sfxs');

dlg.btnDefaultFonts = dlg.fonts.add('button', [270, 240, 350, 260], 'Default');
dlg.btnDefaultFonts.onClick = function() { setFonts(defaultFonts); }

dlg.btnFontsFromFile = dlg.fonts.add('button', [360, 240, 480, 260], 'Load JSON');
dlg.btnFontsFromFile.onClick = function() {	fontsFromFile(); }

// and the rest
dlg.useLayerGroups = dlg.add('checkbox', [20, 650, 170, 670], 'Use layer groups');

dlg.btnHelp = dlg.add('button', [20, 680, 50, 710], '?');
dlg.btnHelp.onClick = function() { showHelp(); }

dlg.btnFontList = dlg.add('button', [60, 680, 160, 710], 'Font list');
dlg.btnFontList.onClick = function() { showAvailableFonts(); }

dlg.btnCancel = dlg.add('button', [300, 680, 390, 710], 'Cancel');

dlg.btnRun = dlg.add('button', [400, 680, 490, 710], 'Run');

dlg.btnCancel.onClick = function() { this.parent.close(); };

dlg.btnRun.onClick = function() {	run(); };

setFonts(defaultFonts);

dlg.center();
dlg.show();