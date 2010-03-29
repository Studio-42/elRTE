(function($) {
	
	elRTE.prototype.options = {
		/* additional nodes to load in editor as documents */
		documents      : [],
		loadTarget : true,
		/* active document index */
		active  : 0,
		/* iframe doctype */
		doctype : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
		/* send debug to log? */
		debug    : true,
		/* allow user view and edit source? required plugin or command */
		allowSource : true, 
		/* additional css class for elrte */
		cssClass : '',
		/* editor workzone height */
		height   : 0,
		/* interface language */
		lang     : 'en',
		
		allowCloseDocs : true,
		
		allowTags : [],
		denyTags : ['iframe'],
		
		historySize : 100,
		
		/* plugins to load */
		plugins : ['source', 'dummy', 'statusbar', 'webkit'],
		
		toolbar : 'default',
		
		panels : {
			style      : ['bold', 'blockquote' /*, 'italic', 'underline', 'sub', 'sup'*/],
			history    : ['undo', 'redo'],
			fullscreen : ['fullscreen'] // @todo rename it
		},
		
		panelsNames : {},
		
		toolbars : {
			'default' : ['style', 'history', 'fullscreen']
		}
	}
	
})(jQuery);