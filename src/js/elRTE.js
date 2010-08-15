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
		var self = this, c, ui, p, id, ids=[];
		
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
		this._commands  = {};
		/* loaded plugins */
		this._plugins   = {};
		/* shortcuts */
		this.shortcuts = {};
		this.change = false;
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
			'wysiwyg'   : [],
			/* called before close document */
			'close'     : [],
			/* called before command will be executed */
			'exec'      : [],
			/* called after some changes was made in document. */
			'change'    : [],
			/* called after carret change position */
			'chagePos'  : [],
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
			/* called before cut from document */
			'cut'       : [],
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
		this.history = new this.history(this);
		
		/* load commands */
		$.each(this.options.toolbars[this.options.toolbar]||[], function(i, n) {
			$.each(self.options.panels[n]||[], function(i, cn) {
				if (typeof((c = self.commands[cn])) == 'function') {
					// self.log(c.rte)
					self._commands[cn] = new c(self);
					if ((ui = self._commands[cn].ui())) {
						self.view.addUI(ui, n);
					}
				}
			});
		});

		/* load plugins */
		$.each(this.options.plugins, function(i, n) {
			typeof((p = self.plugins[n])) == 'function' && (self._plugins[n] = new p(self));
		});
		
		/* add target node as document if enabled */
		this.options.loadTarget && this.options.documents.unshift(t);
		/* load documents */
		$.each(this.options.documents, function(i, d) {
			(id = self.open(d)) && ids.push(id);
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
		
		// rise cut/paste events on ctrl+x/v in opera, but not on mac :(
		// on mac opera think meta is a ctrl key
		// i hope only a few nerds use opera on mac :)
		// TODO test on linux/win
		if ($.browser.opera && !this.macos) {
			
			$(doc.document).bind('keydown', function(e) {
				if ((e.keyCode == 88 || e.keyCode == 86) && e.ctrlKey) {
					e.stopPropagation();
					e.preventDefault();
					self.trigger(e.keyCode == 88 ? 'cut' : 'paste');
				}
			});
		}
		
		$(doc.document).bind('paste', function(e) {
			if (!self.options.allowPaste) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				var n = self.dom.create({name : 'div', css : {position : 'absolute', width : '10px', height : '10px', 'overflow' : 'hidden' }}),
					r = self.dom.createTextNode(' _ ');
					
				self.trigger('paste');
				n.appendChild(r);
				n = self.selection.insertNode(n);
				self.selection.select(n.firstChild);
				setTimeout(function() {
					if (n.parentNode) {
						
						self.options.pasteOnlyText
							? $(n).text($(n).text().replace(/\n/g, '<br>'))
							: $(n).html(self.filter.proccess('paste', $(n).html()));
						
						r = n.lastChild;
						self.dom.unwrap(n);
						if (r) {
							self.selection.select(r);
							self.selection.collapse(false)
						}

					} else {
						// smth wrong - clean all doc
						self.log('wrong')
						n.parentNode && n.parentNode.removeChild(n);
						self.active.set(self.filter.wysiwyg2wysiwyg(self.active.get('wysiwyg')), 'wysiwyg');
						self.selection.select(self.active.document.body)
						self.selection.collapse(true)
					}
					self.trigger('change');
				}, 30);
			}
		})
		.bind('dragstart drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.bind('cut', function(e) {
			self.trigger('cut')
			setTimeout(function() { self.trigger('change'); }, 5);
		})
		.bind('keydown', function(e) {
			var p, c = e.keyCode;

			self.change = false;
			// exec shortcut callback
			$.each(self.shortcuts, function(n, s){
				p = s.pattern;
				if (p.keyCode == e.keyCode && p.ctrlKey == e.ctrlKey && p.altKey == e.altKey && p.shiftKey == e.shiftKey && p.metaKey == e.metaKey) {
					e.stopPropagation();
					e.preventDefault();
					s.callback(e);
					return false;
				}
			});

			if (!e.isPropagationStopped()) {
				if (c == 9){
					e.stopPropagation();
					e.preventDefault();
					// alert('tab')
					self.selection.insertHtml("&nbsp;&nbsp;&nbsp;&nbsp;")
					// return
					// self.change
				} 
				// cache if input modify DOM or change carret/selection position
				// not bulletproof method - we rise change event on any symbol key with ctrl|meta pressed, 
				// but i dont know other method to catch emacs-like shortcuts ctrl+(a|e|d)
				// another minus - we rise change twice on ctrl+x/ctrl-v
				// but i think its not a big deal ;)
				self.change = self.utils.isKeyDel(c) || c == 13 || c == 9 || (self.utils.isKeyChar(c) && (!self.selection.collapsed() || e.ctrlKey || (self.macos&&e.metaKey)));
				self.trigger(e);
			}
		})
		.bind('keyup', function(e) {
			if (self.change) {
				self.trigger('change', {originalEvent : e});
				self.change = false;
			} else if (self.utils.isKeyArrow(e.keyCode)) {
				self.trigger('changePos', {originalEvent : e});
			}
			self.trigger(e);
		})
		.bind('mousedown mouseup click dblclick', function(e) {
			e.type == 'mouseup' && self.trigger('changePos', {originalEvent : e});
			self.trigger(e);
		})

		this.trigger('open', { id : doc.id });

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
		// p = p.toUpperCase();
		var _p = p.toUpperCase().split('+'),
			l  = _p.length, 
			s  = { keyCode : 0, ctrlKey : false, altKey : false, shiftKey : false, metaKey : false };
		while (l--) {
			switch (_p[l]) {
				case 'CTRL'  : s.ctrlKey  = true; break;
				case 'ALT'   : s.altKey   = true; break;
				case 'SHIFT' : s.shiftKey = true; break;
				case 'META'  : s.metaKey  = true; break;
				default      : s.keyCode  = _p[l].charCodeAt(0);
			}
		}
		if (s.keyCode>0 && (s.altKey||s.ctrlKey||s.metaKey) && typeof(c) == 'function') {
			this.shortcuts[p] = {pattern : s, callback : c, description : this.i18n(d)};
			this.debug('shortcut', 'add '+p)
		}
		return this;
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
			e = $.Event(e)
			// e = this.event(e);
		}
		e.data = d||{}
		if (!e.data.id && this.active) {
			e.data.id = this.active.id
		}
		// if (!e.elrteDocument && this.active) {
		// 	e.elrteDocument = this.active;
		// }

		this.debug('event.'+e.type,  (e.data.id||'no document')+' '+(this.listeners[e.type] ? 'trigger' : 'ignore'));
		// this.log(d)
		$.each(this.listeners[e.type]||[], function() {
			if (e.isPropagationStopped()) {
				self.debug('event.'+e.type, 'stopped');
				return false;
			}
			this(e, d);
		});
		
		return this;
	}
	
	/**
	 * Get content from required/active document
	 * If document id not set - return active document content
	 *
	 * @param  String  document id 
	 * @return String
	 * @TODO clean source
	 **/
	elRTE.prototype.get = function(id, o) {
		var d = this.getDocument(id);
		if (d) {
			if (!o.raw) {
				d.isWysiwyg() && this.sync(d.id);
			}
			
			return d.get('source');
		}
	}
	
	/**
	 * Set required/active document content
	 * If document id not set - set active document content
	 *
	 * @param  String   new content
	 * @param  String   document id 
	 * @param  Object  set options: {raw : true|false (do not clear content), quiet : true|false (do not rise change event)}
	 * @return String
	 **/
	elRTE.prototype.set = function(c, id, o) {
		var d = this.getDocument(id);
		if (d) {
			o = o||{};
			d.set(o.raw ? c : this.filter.proccess(d.isWysiwyg() ? 'wysiwyg' : 'source', c));
			d.focus();
			!o.quiet && d == this.active && this.trigger(this.event('change', d));
			return true;
		}
	}
	
	/**
	 * Wrapper for get/set methods
	 * this.content() - returns active document content
	 * this.content(id) - returns document with id content
	 * this.content('some text..', [options]) - set active document content
	 * this.content(id, 'some text..', [options]) - set document with id content
	 *
	 * @return String|Boolean
	 **/
	elRTE.prototype.content = function() {
		var id, c, o

		if (typeof(arguments[0]) == 'undefined') {
			this.log('get from active')
			id = this.active.id;
		} else if (this.documents[arguments[0]]) {
			id = arguments[0];
			if (typeof(arguments[1]) != 'undefined') {
				c = arguments[1];
				o = arguments[2]||{}
			}
		} else {
			id = this.active.id
			c = arguments[0];
			o = arguments[1]||{}
		}
		return c ? this.set(''+c, id, o) : this.get(id);
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
		o = $.isArray(o) ? o : [];
		// this.log(c)
		// this.log(o)
		if (this[c]) {
			return this[c].apply(this, o);
		}
		
		if (this._commands[c] && this._commands[c].exec(o.length?o[0]:{})) {
			this.trigger('change');
			return true;
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
		return this._commands[c] ? this._commands[c].state() : false;
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
	elRTE.prototype.debug = function(n, m) {
		if (this.options.debug == 'all') {
			this.log(n+': '+m);
		} else if (this.options.debug.length) {
			var _n = n.split('.');
			if ($.inArray(n, this.options.debug) != -1 || (_n[0] && $.inArray(_n[0], this.options.debug) != -1) || (_n[1] && $.inArray(_n[1], this.options.debug) != -1)) {
				this.log(n+': '+m);
			}
		}

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
	elRTE.prototype.plugins = {};
	
	/**
	 * elRTE commands classes
	 *
	 */
	elRTE.prototype.commands = {};	

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
		
		this.each(function() {
			if (!this.elrte) {
				this.elrte = new elRTE(this, typeof(o) == 'object' ? o : {});
			}
		});
		
		if (this.length && typeof(o) == 'string') {
			var a = Array.prototype.slice.call(arguments)
			a.shift()
			// window.console.log(a)
			// return this[0].elrte.exec.apply(this[0].elrte, a)
			return this[0].elrte.exec(o, a);
		}
		return this;
	}
	
})(jQuery);