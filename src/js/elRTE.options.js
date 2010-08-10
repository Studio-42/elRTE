(function($) {
	
	elRTE.prototype.options = {
		/* additional nodes to load in editor as documents */
		documents      : [],
		/* load target do element as document */
		loadTarget : true,
		/* active document index */
		active  : 0,
		/* iframe doctype */
		doctype : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
		/* documents charset */
		charset : 'UTF-8',
		/* send debug to log? */
		debug    : false,
		/* allow user view and edit source? required plugin or command to display ui */
		allowSource : true, 
		/* switch current doc from source to editor when switching to another doc */
		autoToggle : true,
		/* always show documents tabs, if false - tabs hide when only one doc opened */
		tabsAlwaysShow : true,
		/* additional css class for elrte */
		cssClass : '',
		/* editor workzone height */
		height   : 0,
		/* interface language */
		lang     : 'en',
		/* allow close docs by default, may ovveride by "closeable" options for every document */
		allowCloseDocs : true,
		/* if set all other tag will be removed */
		allowTags : [],
		/* if set this tags will be removed */
		denyTags : ['applet', 'base', 'basefont', 'bgsound', 'blink', 'body', 'col', 'colgroup', 'iframe', 'isindex', 'frameset', 'html', 'head', 'meta', 'marquee', 'noframes', 'noembed', 'o:p', 'object', 'title', 'xml'],
		/* If false - all text nodes will be wrapped by paragraph tag */
		allowTextNodes : true,
		/* allow browser specific styles like -moz|-webkit|-o */
		allowBrowsersSpecStyles : false,
		/* user replacement rules */
		replace : [ function(html) { return html.replace(/\{(xz)\}/gi, "PLACEHODER:$1 ") } ],
		/* user restore rules */
		restore : [ function(html) { return html.replace(/PLACEHODER:(\w+)/, "{$1}") } ],
		/* max undo/redo steps */
		historySize : 5,
		/* plugins to load */
		plugins : ['source'/*, 'dummy', 'path', 'webkit', 'wordcount'*/],
		/* display or not toolbar */
		allowToolbar : true,
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
			'default' : [/*'style', 'history', 'clean',*/'style', 'fullscreen']
		}
	}
	
})(jQuery);