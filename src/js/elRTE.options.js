(function($) {
	
	elRTE.prototype.options = {
		/* --- editor view --- */
		
		/* additional css class for editor */
		cssClass : '',
		/* editor workzone(!) height */
		height : 0,
		/* interface language */
		lang : 'en',
		/* current toolbar name */
		toolbar : 'default',
		/* display toolbar? */
		showToolbar : true,
		/* make editor resizable (required jquery.ui.resizable) */
		resizable : false,
		
		/* --- editor options --- */
		/* allow user view and edit source? required plugin or command */
		allowSource : true, 
		/* switch current doc from source to editor when switching to another doc */
		autoToggle : true,
		/* always show documents tabs, if false - tabs hide when only one doc opened */
		alwaysShowTabs : true,
		sortableTabs : true,
		/* max undo/redo steps, 0 - for disable history */
		historySize : 0,
		/* send debug to log? variants: "all" - for all messages, ["source[.type]", ...] - for debug from only required objects/methods */
		debug    : false,
		
		/* --- editor documents options --- */
		/* load target element as document */
		loadTarget : true,
		/* additional nodes or js objects to load in editor as documents */
		documents : [],
		/* hide document source node after document loaded */
		hideDocSource : true,
		/* Loading documents rule. If true - opened document set active */
		focusOpenedDoc : false,
		
		/* allow close docuents? Closed document not saves, except autosave is enabled */
		allowCloseDocs : true,
		// allow reopen opened document (allow|ask|deny|true|false)
		reopenDoc : false,
		
		allowDragAndDrop : true,
		/* --- options for every editor document --- */
		/* iframe doctype */
		doctype : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
		/* documents charset */
		charset : 'UTF-8',
		/* css files to load in iframe */
		cssfiles : ['src/css/elrte-inner.css'],
		
		/* --- filter(clean html) options --- */
		/* if set, all other tags will be removed */
		allowTags : [],
		/* if set, this tags will be removed */
		denyTags : ['applet', 'base', 'basefont', 'bgsound', 'blink', 'body', 'col', 'colgroup', 'iframe', 'isindex', 'frameset', 'html', 'head', 'meta', 'marquee', 'noframes', 'noembed', 'o:p', 'object', 'title', 'xml'],
		/* this attributes will be deleted */
		denyAttr : ['id'],
		/* If false - all text nodes will be wrapped by paragraph tag */
		allowTextNodes : true,
		/* allow browser specific styles like -moz|-webkit|-o */
		allowBrowsersSpecStyles : false,
		/* user replacement rules */
		replace : [ ],
		/* user restore rules */
		restore : [ ],
		
		/* --- paste options --- */
		/* allow/disallow paste text in editor */
		allowPaste : true,
		/* If true - only text will be pasted */
		pasteOnlyText : false,
		/* this attributes will be deleted from pasted text */
		pasteDenyAttr : ['id', 'name', 'class', 'language', 'onclick', 'ondblclick', 'onhover', 'onkeup', 'onkeydown', 'onkeypress'],
		
		fmOpen : function(cb) { },
		
		/* --- paste options --- */
		plugins : [], // ['source_', 'path', 'wordcount', 'webkit', 'autosave'],
		
		/* --- toolbar options --- */
		
		/* panels configuration */
		panels : {
			document   : ['save'],
			edit       : ['pastetext', 'pasteformattext', 'selectall', 'removeformat'],
			history    : ['undo', 'redo'],
			style      : ['bold', 'italic', 'underline', 'strike', 'sup', 'sub'],
			font       : ['fontfamily', 'fontsize', 'formatblock', 'fontstyle', 'textcolor', 'textbg'] ,
			indents    : ['outdent', 'indent'],
			alignment  : ['alignleft', 'aligncenter', 'alignright', 'alignjustify'],
			lists      : ['ul', 'ol'],
			links      : ['anchor', 'link', 'unlink'],
			
			semantic   : ['ins', 'del', 'abbr', 'cite'],
			misc       : ['nbsp', 'stopfloat', 'hr', 'pagebreak', 'blockquote', 'div', 'specialchars'],
			test : ['save', 'save', 'nbsp', 'bold', 'fontsize_', 'specialchars_', 'textcolor', 'textbg', 'source'],
			
			direction  : ['dirltr', 'dirrtl'],
			table      : ['table'],
			
			
			
			
			control    : ['docstructure', 'source', 'fullscreen']
		},
		// ?
		panelsNames : {},
		/* toolbars presets */
		toolbars : {
			'test' : ['test'],
			'empty' : [],
			'default' : ['document', 'edit', 'history', 'style', 'font', 'alignment', 'table', 'indents', 'lists', 'links', 'semantic', 'misc',  'control']

		},
		toolbarType : 'normal',
		
		toolbar : 'empty',
		
		/* --- plugins options --- */
		pluginsConf : {
			wordcount : { count : 'all'},
			autosave  : { interval : 0 }
		},
		
		/* --- commands options --- */
		/* commands, which create inline elements use span tag with css instead of tag */
		styleWithCss : false,
		/* commands configuration */
		commandsConf : {
			docstructure : {
				// initActive : false
			},
			fontstyle : {
				opts : [
					{ name : 'Blue header 3',     element : 'h3',   'class' : 'blue', style : 'color:blue' },
					{ name : 'Paragraph justify', element : 'p',    'class' : 'justify',  },
					{ name : 'Paragraph red',     element : 'p',    'class' : 'red',  },
					{ name : 'Marker',            element : 'span', 'class' : 'marker', style : 'background-color:yellow' },
					{ name : 'Bold text',         element : 'strong', style : 'font-weight:bold' },
					{ name : 'Image on left',     element : 'img',    'class' : 'imgleft',  },
					{ name : 'List',     element : 'ul',    'class' : 'mylist',  },
					{ name : 'Table',     element : 'table',    'class' : 'mytable',  }
				]
			},
			link : {
				// simple : true,
				// disableAdvanced : true,
				// disableEvents : true
			},
			formatblock : {
				// label : false
			},
			fontsize : {
				
			},
			fontfamily : {
				// label : false
			}, 
			// pasteformattext : { width : 800, height:400}
			
			
		}
	}
	
})(jQuery);