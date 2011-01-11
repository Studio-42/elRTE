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
		
		/*******************************************************/
		/*                    UI OPTIONS                       */
		/*******************************************************/		
		
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
		
		/*******************************************************/
		/*                  EDITOR OPTIONS                     */
		/*******************************************************/
		/**
		 * Allow user view and edit source?
		 * To toggle between editor and source command or plugin required.
		 * 
		 * @type Boolean
		 * @default true
		 */
		allowSource : true, 
		
		/**
		 * If true - switch current from source to wysisyg before switch to another document
		 * 
		 * @type Boolean
		 * @default true
		 */
		autoToggle : true,
		
		/**
		 * Always show documents tabs? if set to false - tabsbar hide when only one documents opened 
		 * 
		 * @type Boolean
		 * @default true
		 */
		alwaysShowTabs : false,
		
		/**
		 * Allow sort tabs manually
		 * 
		 * @type Boolean
		 * @default true
		 */
		sortableTabs : true,
		
		/**
		 * Sidebar widget position (left|right)
		 * 
		 * @type String
		 * @default "left"
		 */
		sidebarPos : 'left',
		
		/**
		 * Maximum undo/redo steps, 0 - for disable history
		 * 
		 * @type Number
		 * @default 50
		 */
		historySize : 10,
		
		/**
		 * How to display debug message in console.log.
		 * "all" - display all messages
		 * ["source[.type]", ...] - display messages only from required objects.methods
		 * false|[] = do not display
		 * 
		 * @type String|Number|Boolean
		 * @default false
		 */
		debug    : false,
		
		/**
		 * Event listeners to bind on editor initialization
		 * 
		 * @type Object
		 * @default {}
		 */
		callbacks : {},
		
		/*******************************************************/
		/*               DOCUMENTS OPTIONS                     */
		/*******************************************************/
		
		/**
		 * Content to load as documents in editor
		 * Can contains jQuery objects, DOMElements, Objects or Strings
		 * 
		 * @type Array
		 * @default []
		 * @example
		 * Load jQuery
		 * options.documents = [$(selector)]
		 * @example 
		 * Load DOMElements
		 * options.documents = [document.getElementById('my-id')]
		 * @example
		 * Load Object
		 * options.documents = [ { id : 'myid', name : "myname", title : 'Document', content : "some text..." } ]
		 * @example
		 * Load string
		 * options.documents = ["Here is document content ...."]
		 */
		documents : [],
		
		/**
		 * If document source is DOMElements - hide it
		 * 
		 * @type Boolean
		 * @default true
		 */
		hideDocSource : true,

		/**
		 * If true - last opened document set active (visible)
		 * 
		 * @type Boolean
		 * @default false
		 */
		focusOpenedDoc : false,
		
		/**
		 * Can be document be reloaded via api or command
		 * true|"allow" - reload withot question
		 * 'ask - ask user
		 * false|"deny" - do not reload
		 *
		 * @type Boolean|String
		 * @default 'ask
		 */
		reloadDocs : 'ask',
		
		/**
		 * If true - documents can be closed
		 * 
		 * @type Boolean
		 * @default false
		 */
		allowCloseDocs : true,
		
		/*******************************************************/
		/*                DOCUMENT OPTIONS                     */
		/*******************************************************/
		
		/**
		 * Document doctype
		 * 
		 * @type String
		 */
		doctype : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
		
		/**
		 * Document character set
		 * 
		 * @type String
		 * @default 'UTF-8'
		 */
		charset : 'UTF-8',
		
		/**
		 * Document css files
		 * 
		 * @type Array
		 * @default  ['src/css/elrte-inner.css']
		 */
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
		allowDragAndDrop : true,
		/* --- paste options --- */
		/* allow/disallow paste text in editor */
		allowPaste : true,
		/* If true - only text will be pasted */
		pasteOnlyText : false,
		/* this attributes will be deleted from pasted text */
		pasteDenyAttr : ['id', 'name', 'class', 'language', 'onclick', 'ondblclick', 'onhover', 'onkeup', 'onkeydown', 'onkeypress'],
		
		fmOpen : function(cb) { },
		
		/* --- paste options --- */
		plugins : ['path'/*, 'wordcount'*/], // ['source_', 'path', 'wordcount', 'webkit', 'autosave'],
		

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
			edit       : [/*'pastetext', 'pasteformattext', */'selectall', 'removeformat'],
			history    : ['undo', 'redo'],
			style      : ['bold', 'italic', 'underline', 'strike', 'sup', 'sub'],
			font       : ['fontfamily', 'fontsize', 'formatblock', 'textcolor', 'textbg' /*'fontstyle',  */] ,
			indents    : ['outdent', 'indent'],
			alignment  : ['alignleft', 'aligncenter', 'alignright', 'alignjustify'],
			lists      : ['ul', 'ol'],
			links      : ['anchor', 'link', 'unlink'],
			semantic   : ['ins', 'del', 'abbr', 'cite'],
			misc       : ['nbsp', 'stopfloat', 'hr', 'pagebreak', 'blockquote', 'div', 'specialchars'],
			direction  : ['dirltr', 'dirrtl'],
			table      : ['table'],
			control    : ['docstructure', 'source' , 'fullscreen']
		},
		
		/**
		 * Commands presets. Contains commands groups names (from options.commands).
		 * 
		 * @type Object
		 * @example
		 * options.commands.mypreset = ['edit', 'mygroup', ...]
		 */
		presets : {
			'test' : ['edit', 'links', 'font', 'control']
			// 'test' : ['document', 'history', 'style', 'semantic', 'alignment', 'font', 'indents', 'lists', 'direction', 'misc', 'control']
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
			path      : { hover : true },
			wordcount : { count : 'all'},
			autosave  : { interval : 0 }
		},
		
		/* --- commands options --- */
		/* commands, which create inline elements use span tag with css instead of tag */
		styleWithCss : false,
		/* commands configuration */
		commandsConf : {
			// docstructure : {
				// initActive : false
			// },
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
				links : [
					['http://std42.ru', 'Studio 42'],
					['http://google.com', 'Google'],
					['http://ya.ru', 'Yandex']
				],
				// simple : true,
				// advanced : false,
				// events : false,
				target : true,
				classes : 'one two three four'
				// classes : [ 'one', 'two', 'three' ]
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