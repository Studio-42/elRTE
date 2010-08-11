(function($) {
	
	/**
	 * @Class elRTE editor
	 * @todo  add  history methods wrappers to api
	 * @param DOMElement  
	 * @param Object  editor options
	 */
	elRTE = function(t, o) {
		if (!t || !t.nodeName) {
			return alert('elRTE init failed! First argument should be DOMElement');
		}
		
		this.time('load')
		var self = this, tb, p, c,  l, i, id, ids=[];
		
		/* version */
		this.version   = '1.1 dev';
		/* build date */
		this.build     = '20100810';
		/* is os - macos? */
		this.macos     = navigator.userAgent.indexOf('Mac') != -1;
		/* messages language */
		this.lang      = 'en';
		/* DOM element on witch elRTE created */
		this.target    = $(t).hide()[0];
		/* editor config */
		this.options   = $.extend(true, {}, this.options, o);
		/* cuurent toolbar name */
		this.toolbar   = this.options.toolbars[this.options.toolbar] ? this.options.toolbar : 'default';
		/* messages */
		this.messages  = this.i18Messages[this.options.lang]||{};
		/* loaded commands */
		this.commands  = {};
		/* loaded plugins */
		this.plugins   = {};
		/* shortcuts */
		this.shortcuts = {};
		/* editor DOM element id. Used as base part for inner elements ids */
		this.id        = 'elrte-'+($(t).attr('id')||$(t).attr('name')||Math.random().toString().substr(2));
		/* active documents is in wysiwyg mode */
		// this.wysiwyg   = false;    
		this.ndx = 0;
		/* opened documents */
		this.documents = { };
		/* active(visible) document */
		this.active    = null;
		/* events listeners */
		this.listeners = {
			/* called once after elRTE init and load all documents */
			'load'      : [],
			/* called before? editor will be set visible */
			'show'      : [],
			/* called before? editor will be set hidden */
			'hide'      : [],
			/* called after new document added to editor */
			'open'      : [], 
			/* called after document set active */
			'focus'     : [], 
			/* called after document switch to source mode */
			'source'    : [],
			/* called after document switch to wysiwyg mode */
			'wysiwyg'      : [],
			/* called before close document */
			'close'     : [],
			/* called before command will be executed */
			'exec'      : [],
			/* called after user typed new symbol into document */
			'input'     : [],
			/* called after some changes was made in document or carret change position. Warning! change may rise on any (not only active doc) */
			'change'    : [],
			/* called before send form */
			'save'      : [],
			/* called on mousedown on document */
			'mousedown' : [],
			/* called on mouseup on document */
			'mouseup'   : [],
			/* called on keydown on document */
			'keydown'   : [],
			/* called on keyup on document */
			'keyup'     : [],
			/* called on click on document */
			'click'     : [],
			/* called on double click on document */
			'dblclick'  : [],
			/* called before paste in document */
			'paste'     : []
			};
		/* object with various utilits */	
		this.utils     = new this.utils(this)
		/* editor view/renderer */
		this.view      = new this.view(this);
		/* DOM manipulation */
		this.dom       = new this.dom(this);
		/* selection and text range object */
		this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);
		/* cleaning content object */
		this.filter = new this.filter(this)
		/* history object */
		// this.history = new this.history(this);
		
		/* load commands */
		this.log(this.options.toolbar)
		self.log(this.options.toolbars[this.options.toolbar]||[])
		tb = this.options.toolbars[this.options.toolbar]||[];
		$.each(tb, function(i, n) {
			$.each(self.options.panels[n]||[], function(i, cn) {
				typeof((c = self._commands[cn])) == 'function' && (self.commands[cn] = new c(self));
			})
		})
		this.log(this.commands)
		// tb = this.options.toolbars[this.toolbar];
		// tb = this.options.toolbars[this.options.toolbar]||[]
		// i = tb.length;
		// while (i--) {
		// 	p = this.options.panels[tb[i]]; 
		// 	if (typeof(p) != 'undefined' && (l = p.length)) {
		// 		while (l--) {
		// 			if (typeof(this._commands[p[l]]) == 'function') {
		// 				this.commands[p[l]] = new this._commands[p[l]](this);
		// 			}
		// 		}
		// 	}
		// }
		/* create toolbar if enabled */
		// this.options.allowToolbar && this.view.showToolbar(tb);

		/* load plugins */
		$.each(this.options.plugins, function(i, n) {
			// p = self._plugins[n];
			typeof((p = self._plugins[n])) == 'function' && (self.plugins[n] = new p(self))
		});
		
		/* add target node as document if enabled */
		this.options.loadTarget && this.options.documents.unshift(t);
		/* load documents */
		$.each(this.options.documents, function(i, d) {
			if ((id = self.open(d))) {
				ids.push(id);
			}
		});
		/* focus required/first document */
		ids.length && this.focus(ids[this.options.active]||ids[this.options.loadDocsInBg ? 0 : ids.length-1]);
		
		/* bind to parent form save events */
		this.view.editor.parents('form').bind('submit', function() { self.trigger('save'); });
		
		/* complete editor load */
		this.trigger('load');
		delete(this.listeners.load);

		/* fix ff bug with carret position in textarea */
		if ($.browser.mozilla) {
			this.bind('source', function(e) {
				self.active.source[0].setSelectionRange(0,0);
			});
		}
		// this.sync(ids[1])
		this.timeEnd('load');
		// this.log(this.content(true))
	}

	/*** API ***/

	/**
	 * Return true if active document si in wysiwyg mode
	 *
	 * @return Boolean
	 **/
	elRTE.prototype.isWysiwyg = function() {
		return this.active && this.active.isWysiwyg();
	}

	/**
	 * Return number of loaded documents
	 *
	 * @return Number
	 **/
	elRTE.prototype.count = function() {
		var i = 0;
		$.each(this.documents, function() {
			i++;
		});
		return i;
	}

	/**
	 * Return document by id or index
	 * If document not found return active document (may be undefined if no documents loaded!)
	 *
	 * @param  String|Number  document id/index (or undefined for active document)
	 * @return Object
	 **/
	elRTE.prototype.getDocument = function(id) {
		return this.documents[id]||this.active;
	}

	/**
	 * Open document in editor and return its id.
	 * Document may be dom element or js object:
	 * {
	 *   id       : document id - not required, if not set - generates automatically, 
	 *   name     : name for textarea - not required - if not set - id used,
	 *   content  : document text - required,
	 *   closable : allow close document,
	 *   save     : object (not implemented yet)
	 * }
	 *
	 * @param  DOMElement|Object  document to load in editor
	 * @return String
	 **/
	elRTE.prototype.open = function(d) {
		if (!d || (d.nodeType != 1 && typeof(d.content) != 'string')) {
			return;
		}
		
		var self = this,
			ndx  = ++this.ndx,
			id   = this.id+'-document-'+ndx,
			n    = d.nodeType == 1,
			doc  = {
				id        : id, 
				ndx       : ndx, 
				title     : d.title||this.i18n('Document')+' '+ndx,
				closeable : $(d).hasClass('closable')||d.closable||this.options.allowCloseDocs,
				source    : n && d.nodeName == 'TEXTAREA' ? $(d).addClass('elrte-source') : $('<textarea class="elrte-source" name="'+(d.name||id)+'" />').val((n ? $(d).html() : d.content)||''),
				editor    : $('<iframe frameborder="0" class="elrte-editor" />')
			}, html
			;
		
		/* render document */
		this.view.add(doc);
		
		/* add to editor documents */
		doc.window   = doc.editor[0].contentWindow;
		doc.document = doc.editor[0].contentWindow.document;
		this.documents[id] = doc;

		/* create body in iframe */
		html = this.options.doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+this.options.charset+'" />';
		$.each(this.options.cssfiles, function() {
			html += '<link rel="stylesheet" type="text/css" href="'+this+'"/>';
		});
		doc.document.open();
		doc.document.write(this.options.doctype+html+'</head><body> </body></html>');
		doc.document.close();

		// add methods to document
		doc.isWysiwyg = (function(self) { return function() { return self.editor.is(':visible') || self.editor.css('display') != 'none'; }})(doc);
		doc.get       = (function(self) { return function(t) { return (t ? t == 'wysiwyg' : self.isWysiwyg()) ? $(self.document.body).html() : doc.source.val(); }})(doc);
		doc.set       = (function(self) { return function(c, t) { (t ? t == 'wysiwyg' : self.isWysiwyg()) ? $(self.document.body).html(c) :  doc.source.val(c); }})(doc);
		doc.focus     = (function(self) { return function() { if (self.editor.parent().is(':visible')) { self.editor.is(':visible') ? self.window.focus() : self.source[0].focus();} return true; }})(doc);
		doc.toggle    = this.options.allowSource
			? (function(self) { return function() { return !!(self.editor.parent().is(':visible') && self.editor.add(self.source).toggle() && self.focus()); }})(doc)
			: function() { return false };
		
		/* set document content from textarea */
		doc.set(this.filter.wysiwyg(doc.get('source')), 'wysiwyg');

		/* make iframe editable */
		if ($.browser.msie) {
			doc.document.body.contentEditable = true;
		} else {
			try { doc.document.designMode = "on"; } 
			catch(e) { }
		}


		/* bind events to document */
		// $(doc.document).bind('paste', function(e) {
		// 	self.trigger('paste').trigger('change');
		// })
		// .bind('cut', function(e) {
		// 	self.trigger('change');
		// })
		// .bind('keydown', function(e) {
		// 	var i, s, p;
		// 	for (i in self.shortcuts) {
		// 		if (self.shortcuts.hasOwnProperty(i)) {
		// 			s = self.shortcuts[i];
		// 			p = s.pattern;
		// 			if (p.keyCode == e.keyCode 
		// 			&& (!p.ctrlKey  || p.ctrlKey  == e.ctrlKey) 
		// 			&& (!p.altKey   || p.altKey   == e.altKey) 
		// 			&& (!p.shiftKey || p.shiftKey == e.shiftKey) 
		// 			&& (!p.metaKey  || p.metaKey  == e.metaKey)) {
		// 				if (e.isPropagationStopped()) {
		// 					return;
		// 				}
		// 				s.callback(e);
		// 			}
		// 		}
		// 	}
		// 	!e.isPropagationStopped() && self.trigger(e);
		// })
		// .bind('keyup mousedown mouseup click dblclick', function(e) {
		// 	if (this == self.active.document) {
		// 		self.trigger(e);
		// 		var ev, c;
		// 
		// 		if (e.type == 'mouseup') {
		// 			ev = $.Event('change');
		// 		} else if (e.type == 'keyup') {
		// 			c = e.keyCode;
		// 			if (self.utils.isKeyArrow(c) || c== 13 || e.ctrlKey || (self.macos && (c == 91 || c == 93 || c == 224))) {
		// 				ev = $.Event('change');
		// 			} else if (self.utils.isKeyDel(c)) {
		// 				ev = $.Event('change');
		// 				ev.isDel = true;
		// 			} else if (self.utils.isKeyChar(c) && !e.ctrlKey) {
		// 				ev = $.Event('input')
		// 			}
		// 		}
		// 		if (ev) {
		// 			ev.originalEvent = e;
		// 			self.trigger(ev);
		// 		}
		// 	}
		// });

		this.trigger(this.event('open', doc));
		/* when loading document into empty editor after editor was loaded */
		if (!this.listeners.load && (this.count() == 1 || !this.options.loadDocsInBg)) {
			this.focus(d.id);
		}
		return id;
	}

	/**
	 * Close document
	 *
	 * @param String  document id
	 * @return elRTE
	 */
	elRTE.prototype.close = function(id) {
		var d = this.getDocument(id);
		
		if (d) {
			// switch to prev/next document before close active
			d == this.active && this.count()>1 && this.focus(this.view.getPrev()||this.view.getNext());
			this.trigger(this.event('close', d)).view.remove(d.id);
			delete this.documents[d.id];
			if (this.active.id == d.id) {
				this.active = null;
			}
		}
		return this;
	}

	/**
	 * Set document active (visible) if is not. 
	 * Get focus to document editor/source
	 *
	 * @param  String  document id
	 * @return elRTE
	 **/
	elRTE.prototype.focus = function(id) {
		var d = this.getDocument(id), 
			a = this.active;
		
		if (d) {
			if (d == a) { // document already active
				d.focus();
			} else { // switch to another document
				// set active doc in wysiwyg mode if required
				a && !a.isWysiwyg() && this.options.autoToggle && this.toggle();
				// show doc
				this.view.showDoc(d.id);
				// set doc active
				this.active = d;
				// get focus to doc
				d.focus();
				// rise events
				this.trigger('focus').trigger(d.isWysiwyg() ? 'wysiwyg' : 'source');
			}
		}
		return this;
	}
	
	/**
	 * Switch between editor and source in active document 
	 * if source access eneabled
	 * @todo for firefox set curret to start of texarea (bind to source event)
	 *
	 * @return elRTE
	 */
	elRTE.prototype.toggle = function() {
		this.active && this.sync(this.active.id) && this.active.toggle() && this.trigger(this.active.isWysiwyg() ? 'wysiwyg' : 'source');
		return this;
	}
	
	/**
	 * Sync data between editor/source in active document or in all documents
	 * If editor is visible for now, data copy from editor to source and otherwise
	 *
	 * @param  String  document id, undefined to sync all documents 
	 * @return elRTE
	 **/
	elRTE.prototype.sync = function(id) {
		var self = this, t;

		$.each(id && (d = this.getDocument(id)) ? [d] : this.documents, function() {
			t = this.isWysiwyg() ? 'source' : 'wysiwyg';
			this.set(self.filter.proccess(t, this.get()), t);
			self.debug('sync: '+this.id);
		});
		return this;
	}

	/**
	 * Create and return event with required type and elrteDocument set to required or active document
	 *
	 * @param  String       event name
	 * @param  Object       document (not set for active document)
	 * @return jQuery.Event
	 */
	elRTE.prototype.event = function(n, d) {
		var e = $.Event(n);
		e.elrteDocument = d && d.editor ? d : this.active;
		return e;
	}

	/**
	 * Bind callback to event(s)
	 * To bind multiply events at once, separate events names by space
	 *
	 * @param  String    event name
	 * @param  Function  callback
	 * @param  Boolean   put listener before others (on top)
	 * @return elRTE
	 */
	elRTE.prototype.bind = function(e, c, t) {
		var self = this;
		
		if (typeof(c) == 'function') {
			$.each($.trim(e).split(/\s+/), function(i, n) {
				if (typeof(self.listeners[n]) == 'undefined') {
					self.listeners[n] = [];
				}
				self.listeners[n][t?'unshift':'push'](c);
			});
		}
		return this;
	}
	
	/**
	 * Bind keybord shortcut to keydown event
	 *
	 * @param  String    shortcut pattern in form: "ctrl+shift+z"
	 * @param  String    shortcut description
	 * @param  Function  callback
	 * @return Boolean
	 */
	elRTE.prototype.shortcut = function(p, d, c) {
		p = p.toUpperCase();
		var _p = p.split('+'),
			l  = _p.length, 
			s  = { keyCode : 0 };
		while (l--) {
			switch (_p[l]) {
				case 'CTRL'  : s.ctrlKey  = true; break;
				case 'ALT'   : s.altKey   = true; break;
				case 'SHIFT' : s.shiftKey = true; break;
				case 'META'  : s.metaKey  = true; break;
				default      : s.keyCode  = _p[l].charCodeAt(0);
			}
		}
		if (s.keyCode>0 && (s.ctrlKey || s.altKey || s.shiftKey || s.metaKey) && typeof(c) == 'function') {
			this.shortcuts[p] = {pattern : s, callback : c, description : this.i18n(d)};
			return true;
		}
		return false;
	}
	
	/**
	 * Send notification to all event subscribers
	 *
	 * @param  String event name
	 * @param  Object extra parameters
	 * @return elRTE
	 */
	elRTE.prototype.trigger = function(e, d) {
		var self=this;
		
		if (!e.type) {
			e = this.event(e);
		}
		
		if (!e.elrteDocument && this.active) {
			e.elrteDocument = this.active;
		}

		this.debug(e.type+' '+(e.elrteDocument ? e.elrteDocument.id : 'no document'));
		
		$.each(this.listeners[e.type]||[], function() {
			if (e.isPropagationStopped()) {
				self.debug(e.type+' stopped');
				return false;
			}
			this(e, d);
		});
		
		return this;
	}
	
	/**
	 * Get/set content for required or active document
	 * If document id not set - method will be apply to active document
	 *
	 * @param  String   document id
	 * @param  String   new content
	 * @param  Object   set options: {raw : true|false (do not clear content), quiet : true|false (do not rise change event)}
	 * @return String|Boolean
	 */
	elRTE.prototype.content = function(id, c, o) {
		var d = this.getDocument(id);
		if (d) {
			// get content
			if (typeof(c) == 'undefined') {
				d.isWysiwyg() && this.sync(d.id);
				return d.get('source');
			}
			// set content
			o = o||{};
			d.set(o.raw ? c : this.filter.proccess(d.isWysiwyg() ? 'wysiwyg' : 'source', c));
			d.focus();
			!o.quiet && this.trigger(this.event('change', d));
			return true;
		}
	}
	
	/**
	 * Show editor if hidden
	 *
	 * @return elRTE
	 */
	elRTE.prototype.show = function() {
		if (this.view.editor.is(':hidden')) {
			this.view.editor.show();
			this.trigger('show');
		}
		return this;
	}
	
	/**
	 * Hide editor if visible
	 *
	 * @return elRTE
	 */
	elRTE.prototype.hide = function() {
		if (this.view.editor.is(':visible')) {
			this.view.editor.hide();
			this.trigger('hide');
		}
		return this;
	}
	
	/**
	 * Exec command if exists
	 *
	 * @param  String  command name
	 * @param  Object  command options
	 * @return Boolean
	 */
	elRTE.prototype.exec = function(c, o) {
		if (this.commands[c]) {
			if (this.commands[c].exec(o)) {
				this.trigger('change');
				return true;
			}
		}
	}

	/**
	 * Return true if command enabled
	 *
	 * @return Boolean
	 */
	elRTE.prototype.commandEnabled = function(c) {
		return this.commands[c] ? this.commands[c].state() > this.commands[c]._disabled : false;
	}
	
	/**
	 * Return command value if exists. (current node properties)
	 *
	 * @return String
	 */
	elRTE.prototype.commandValue = function(c) {
		return this.commands[c] ? this.commands[c].value() : false;
	}

	/**
	 * Return command state (-1 for disabled, 0 for enabled, 1 for active (has value))
	 *
	 * @return Number
	 */
	elRTE.prototype.commandState = function(c) {
		return this.commands[c] ? this.commands[c].state() : false;
	}

	/* SERVICE METHODS */
	
	/**
	 * Return message translated into current language
	 *
	 * @param  String  m message
	 * @return String
	 */
	elRTE.prototype.i18n = function(m) {
		return this.messages[m]||m;
	}

	/**
	 * send message to console log if debug is enabled in config
	 *
	 * @param String  message
	 */
	elRTE.prototype.debug = function(m) {
		this.options.debug && this.log(m)
	}

	/**
	 * send message to console log
	 *
	 * @param String  message
	 */
	elRTE.prototype.log = function(m) {
		window.console && window.console.log && window.console.log(m);
		return this;
	}

	elRTE.prototype.time = function(l) {
		window.console && window.console.time && window.console.time(l);
	}
	
	elRTE.prototype.timeEnd = function(l) {
		window.console && window.console.timeEnd && window.console.timeEnd(l);
	}

	/**
	 * elRTE plugins classes
	 *
	 */
	elRTE.prototype._plugins = {};
	
	/**
	 * elRTE commands classes
	 *
	 */
	elRTE.prototype._commands = {};	

	/**
	 * elRTE messages
	 *
	 */
	elRTE.prototype.i18Messages = {}

	/**
	 * jquery plugin
	 *
	 * @param Object|String  elrte options or command
	 */
	$.fn.elrte = function(o) {
		
		return this.each(function() {
			if (!this.elrte) {
				this.elrte = new elRTE(this, typeof(o) == 'object' ? o : {});
			}
			
			if (o.cmd && typeof o.cmd == 'string') {
				switch (o.cmd) {
					case 'open':
						window.console.log('open')
						break;
						
					case 'close':
						window.console.log('close')
						break;
						
					case 'val':
						window.console.log('val')
						break;
						
					case 'trigger':
						window.console.log('trigger')
						break;
				}
			}
			
			

		});
	}
	
})(jQuery);