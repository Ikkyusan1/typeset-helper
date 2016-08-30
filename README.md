# typeset-helper
A typesetting script for Photoshop CS6+. It's meant to lay the groundwork for your typesetting. It will copy/paste the text from a script onto the relevant pages, with some basic font settings.

What it doesn't do is putting the text in the relevant bubbles. The simple reason for this is that we should keep our translation scripts as humanly readable as possible. Cluttering the text with bubble coordinates is not a good idea. Notes and short instructions are already too much, but they're necessary.


## How to use it:
 1. Place the jsx file into Photoshop's subfolder Presets/Scripts
 2. Run Photoshop, then File>Automate>Typeset Helper

Alternatively, you can just do File>Scripts>Browse and open the script.
Third option : normally you can also run the script by double-clicking on it. Or do a right-click, "Open-with Photoshop".


## Translation script rules

### Page numbers
- They must be written on three or four digits.
- They must be followed by a # character.
- Double-pages are numbered like this : ```010-011#```
- The end of the script is marked by the anchor ```END#```
- The working script is what is between the first page ```001#``` and ```END#```
- Text before and after these anchors will not be taken into account, so it's a good place to add translation notes and whatnot.


### Files
- Files must be in psd format.
- The filenames must end with the page number, preceded by a space, a dash or an undescore. e.g. : ```Super-Series_vol4_010.psd``` For a double-page :	```Super-Series_vol4_012-013.psd```


### Bubbles
- The rule is one bubble per line. In other words, bubbles are separated by a carriage return.
- Some lines can be ignored. For instance, to keep the script readable, empty lines are used to lighten the text. Also, sometimes it can be useful to separate the panels. In which case, the line must contain only the separation symbol.
- The parts of a multi-bubble are considered to be different bubbles. But, we still need to know when a line is part of a multi-bubble. For this, we put a double slash at the beginning of the following parts. e.g. :
```
This is a the first part of the multi-bubble.
// This line corresponds to the second part of the multi-bubble.
```
- When a page doesn't contain any text, or at least, nothing to be typesetted, you can make the script skip it using one of the empty page keywords. Between brackets, as usual. It must the first text of the page. Meaning, you can add a whole essay after that, it won't be typesetted.


### Styles and text type/placement
The text type (or placement) defines the nature of the text line. The text can be in a bubble, it can be not in a bubble (like some narrative stuff), it can be a sfx, or a sfx in a bubble, or a footnote...
Based on this, not only the text type gives us typesetters a clue as to where to insert the text on the page, it also tells us what style should be applied.

Thus, text types/placements are actually text styles.

- They must be written between square brackets, like so : ```[italic]```
- Only one style ***OR*** placement per line.
- They can be written at the beginning ***OR*** just after a line. e.g. :
```
[nib] This text is not in a bubble.
This bubble should be in italic. [italic]
```
- Usually, the text type should be placed at the beginning of the line, not the end.
- Usually, the style should be added at the end of the line, not the beginning.
- A style can be applied for a whole page. In which case, add the style right after the page number :
```
035# [shout]
All the bubbles will be written in "bolditalic style"
```
- It is possible to override this "page style" by adding the style you at the beginning or the end of the line.
- What about the multi-bubbles ? Almost the same principle. The sister parts will inherit the style of the ***previous part***. You can of course override the style of each part of the bubble. e.g. :
```
This first part is a shout bubble. [shout]
// Second part will inherit the previous style.
// But we want the third part to be written in italic. [italic]
```

### Notes
Basically, notes are everything that doesn't correspond to the styles' keywords.
- They must be (you guessed it) written between square brackets.
- They must not contain any carriage return.
- They must be placed at the end of a line, after everything else.


## Layer sorting
Typeset Helper has a checkbox 'Use layer groups'. When checked, it makes the script sort the layers in different groups.
The groups will be created if they don't exist.
- BUBBLES group will contain, well, the bubbles, but also the not-in-bubble, and the sfxib.
- SFXS group will contain the sfx.
- OTHERS will contain footnotes, and all the rest.


## Keywords and relations
(keywords are at the right)

### Font styles relations
- regular font style : [regular], [regular_font]
- italic font style : [italic], [thoughts]
- bolditalic font style : [yell], [shout], [scream], [bolditalic]
- not in bubble font style : [nib]
- sfx font style : [sfx]
- sfx in bubble : [sfxib]
- handwritten font style : [handwritten]
- notes font style : [panel_note], [footnote], [notes], [note], [newspaper], [tv], [radio]

### Layer groups relations
- BUBBLES : [regular_font], [regular], [italic], [nib], [thoughts], [bolditalic], [yell], [shout], [scream], [handwritten], [sfxib]
- SFXS : [sfx]
- OTHERS : [panel_note], [footnote], [notes], [note], [newspaper], [tv], [radio]

### The rest
- Empty page : [blank], [empty], [no_text]
- Panel separation symbols :	-, —, --
- Multi-bubble separator :	//

## Load font choice from JSON
It is possible to load the font choice from a json file. The font names are the postscript names of the fonts. Here's what it should look like :
```
{
	"regular": {
		"name": "CCJeffCampbell",
		"size": 20
	},
	"italic": {
		"name": "CCJeffCampbellItalic",
		"size": 20
	},
	"bolditalic": {
		"name": "CCJeffCampbellBoldItalic",
		"size": 22
	},
	"nib": {
		"name": "CCJeffCampbellItalic",
		"size": 20
	},
	"sfx": {
		"name": "BadaBoomBB",
		"size": 25
	},
	"sfxib": {
		"name": "AdamWarrenpro-BoldItalic",
		"size": 25
	},
	"handwritten": {
		"name": "MDBurnette",
		"size": 20
	},
	"notes": {
		"name": "ElectraLTStd-Bold",
		"size": 16
	}
}
```


## Greetings
To the people from www.ps-scripts.com for their snippets.

To Marc Autret from www.indiscripts.com for his ExtendScript RegexTester he posted on www.indiscripts.com

And as usual, to every contributors from stackoverflow.