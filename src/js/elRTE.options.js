(function($) {
	
	elRTE.prototype.options = {
		/**
		 * Editor instance id
		 * 
		 * @type String
		 * @default ""
		 * @example
		 * options.id = 'my-elrte-editor'
		 */
		id : '',
		
		/* ==================  UI OPTIONS ================= */
		
		/**
		 * Ui language
		 * 
		 * @type String
		 * @default "auto"
		 * @example
		 * options.lang = 'ru'
		 */
		lang : 'auto',
		
		/**
		 * Additional css class for editor
		 * 
		 * @type String
		 * @example
		 * options.cssClass = 'myclass'
		 */
		cssClass : '',

		/**
		 * Editor minimum width in pixels. 
		 * 
		 * @type Number
		 * @default 300
		 */
		minWidth : 300,
		
		/**
		 * Editor width in any css format or number of pixels.
		 * 
		 * @type Number|String
		 * @default "auto"
		 */
		width : 'auto',
		
		/**
		 * Editor minimum height in pixels. 
		 * 
		 * @type Number
		 * @default 250
		 */
		minHeight: 250,
		
		/**
		 * Editor height in pixels. 
		 * 
		 * @type Number
		 * @default 400
		 */
		height : 400,
		
		/**
		 * Editor toolbar. For now only "default" available - simple toolbar with buttons
		 * Set to '' to disable toolbar
		 *
		 * @type String
		 * @default "default"
		 */
		toolbar : 'default',
		
		/**
		 * Toolbar position. top|bottom
		 * 
		 * @type String
		 * @default "top"
		 */
		toolbarPosition : 'top',
		
		/**
		 * Editor tabsbar. For now only "default" available.
		 *
		 * @type String
		 * @default "default"
		 */
		tabsbar : 'default',
		
		/**
		 * Editor sidebar. For now only "default" available.
		 *
		 * @type String
		 * @default "default"
		 */
		sidebar : 'default',
		
		/**
		 * Editor statusbar. For now only "default" available.
		 *
		 * @type String
		 * @default "default"
		 */
		statusbar : 'default',
		
		/**
		 * Enable editor resizable abillity
		 * 
		 * @type Boolean
		 * @default true
		 */
		resizable : true,
		
		/**
		 * Resizable helper class name.
		 * If set editor view updates on resizestop event,
		 * otherwise - on resize event
		 * 
		 * @type String
		 * @default ""
		 * @example
		 * options.resizeHelper = 'ui-resizable-helper'
		 */
		resizeHelper : '',
		
		/* --- editor options --- */
		/* allow user view and edit source? required plugin or command */
		allowSource : true, 
		/* switch current doc from source to editor when switching to another doc */
		autoToggle : true,
		/* always show documents tabs, if false - tabs hide when only one doc opened */
		alwaysShowTabs : false,
		sortableTabs : true,
		sidebarPos : 'left',
		/* max undo/redo steps, 0 - for disable history */
		historySize : 0,
		/* send debug to log? variants: "all" - for all messages, ["source[.type]", ...] - for debug from only required objects/methods */
		debug    : false,
		
		load : null,
		
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
		

		/* ==================  COMMANDS OPTIONS ================= */

		/**
		 * Commands groups. Required by editor toolbar to groups commands buttons into panels
		 * 
		 * @type Object
		 * @example
		 * options.commands.mygroup = ['cmd1Name', 'cmd2Name', ...]
		 */
		commands : {
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
			test       : ['save', 'nbsp', 'bold', 'fontsize'],
			direction  : ['dirltr', 'dirrtl'],
			table      : ['table'],
			control    : ['docstructure', 'source'/* , 'fullscreen'*/]
		},
		
		/**
		 * Commands presets. Contains commands groups names (from options.commands).
		 * 
		 * @type Object
		 * @example
		 * options.commands.mypreset = ['edit', 'mygroup', ...]
		 */
		presets : {
			'test' : ['test', 'control']
		},
		/**
		 * Commands preset to load in editor. Contains one of presets name.
		 * 
		 * @type String
		 * @example
		 * options.commands.preset = 'mypreset'
		 */
		preset : 'test',


		/* --- toolbar options --- */
		
		
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
			// save : { ui : false }
			// pasteformattext : { width : 800, height:400}
			
			
		}
	}
	
})(jQuery);