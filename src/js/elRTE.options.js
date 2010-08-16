(function($) {
	
	elRTE.prototype.options = {
		/* additional css class for elrte */
		cssClass : '',
		/* editor workzone height */
		height : 0,
		/* interface language */
		lang : 'en',
		/* iframe doctype */
		doctype : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
		/* documents charset */
		charset : 'UTF-8',
		/* css files to load in iframe */
		cssfiles : ['src/css/elrte-inner.css'],
		/* additional nodes or objects to load in editor as documents */
		documents : [],
		/* load target element as document */
		loadTarget : true,
		/* active document index */
		active  : false,
		/* If true - first loaded doc will be set active, if false - last loaded doc */
		loadDocsInBg : true,
		/* allow close docs by default, ovverided by "closeable" options for every document */
		allowCloseDocs : true,
		/* allow user view and edit source? required plugin or command to display ui */
		allowSource : true, 
		/* switch current doc from source to editor when switching to another doc */
		autoToggle : true,
		/* always show documents tabs, if false - tabs hide when only one doc opened */
		alwaysShowTabs : true,
		/* if set all other tag will be removed */
		allowTags : [],
		/* if set this tags will be removed */
		denyTags : ['applet', 'base', 'basefont', 'bgsound', 'blink', 'body', 'col', 'colgroup', 'iframe', 'isindex', 'frameset', 'html', 'head', 'meta', 'marquee', 'noframes', 'noembed', 'o:p', 'object', 'title', 'xml'],
		denyAttr : ['id'],
		pasteDenyAttr : ['id', 'name', 'class', 'style', 'language', 'onclick', 'ondblclick', 'onhover', 'onkeup', 'onkeydown', 'onkeypress'],
		pasteOnlyText : false,
		/* If false - all text nodes will be wrapped by paragraph tag */
		allowTextNodes : true,
		/* allow browser specific styles like -moz|-webkit|-o */
		allowBrowsersSpecStyles : false,
		/* user replacement rules */
		replace : [ function(html) { return html.replace(/\{(xz)\}/gi, "PLACEHODER:$1 ") } ],
		/* user restore rules */
		restore : [ function(html) { return html.replace(/PLACEHODER:(\w+)/, "{$1}") } ],
		allowPaste : true,
		/* max undo/redo steps */
		historySize : 20,
		/* plugins to load */
		plugins : ['source', 'wordcount'/*, 'dummy', 'path', 'webkit', 'wordcount'*/],
		/* display or not toolbar */
		showToolbar : true,
		
		resizable : true,
		/* cuurent toolbar name */
		toolbar : 'empty',
		
		panels : {
			style      : ['bold', 'italic' /* , 'italic', 'underline', 'sub', 'sup'*/],
			clean      : ['removeformat'],
			history    : ['undo', 'redo'],
			fullscreen : ['fullscreen'] // @todo rename it
		},
		
		panelsNames : {},
		
		toolbars : {
			'empty' : [],
			'default' : [/*'style', 'history', 'clean','style',*/ 'fullscreen']
		},
		/* send debug to log? */
		debug    : false,
	}
	
})(jQuery);