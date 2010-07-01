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
		debug    : true,
		/* allow user view and edit source? required plugin or command */
		allowSource : true, 
		/* switch cuurent doc to editor when switch to another doc */
		autoToggle : false,
		/* always show documents tabs, if false - tabs hide when only one doc opened */
		tabsAlwaysShow : true,
		/* additional css class for elrte */
		cssClass : '',
		/* editor workzone height */
		height   : 0,
		/* interface language */
		lang     : 'en',
		/* allow close docs by default, ovveride by closeable options for every document */
		allowCloseDocs : true,
		
		allowTags : [],
		denyTags : ['iframe'],
		/* max undo/redo steps */
		historySize : 2,
		/* plugins to load */
		plugins : ['source', 'dummy', 'path', 'webkit'],
		/* display or not toolbar */
		allowToolbar : true,
		/* cuurent toolbar name */
		toolbar : 'default',
		
		panels : {
			style      : ['bold', 'italic' /* , 'italic', 'underline', 'sub', 'sup'*/],
			clean      : ['removeformat'],
			history    : ['undo', 'redo'],
			fullscreen : ['fullscreen'] // @todo rename it
		},
		
		panelsNames : {},
		
		toolbars : {
			'default' : [/*'style', 'history', 'clean',*/'style', 'fullscreen']
		}
	}
	
})(jQuery);