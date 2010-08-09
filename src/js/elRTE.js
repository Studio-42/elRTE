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
		var self = this, tb, l, p, i;
		
		/* version */
		this.version   = '1.1 dev';
		/* build date */
		this.build     = '20100705';
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
		this.wysiwyg   = false;    
		/* opened documents */
		this.documents = [];
		/* active(visible) document */
		this.active    = null;
		/* events listeners */
		this.listeners = {
			/* called after elRTE init and load all documents */
			'load'      : [],
			/* called before editor will be set visible */
			'show'      : [],
			/* called before editor will be set hidden */
			'hide'      : [],
			/* called after new document added to editor */
			'open'      : [], 
			/* called after document switch to wysiwyg mode */
			'focus'     : [], 
			/* called after document switch to source mode */
			'source'    : [],
			/* called before(!) document editor set invisible */
			'blur'      : [],
			/* called before close document */
			'close'     : [],
			/* called before content from document will be returned. if needed modify event.elrteDocument.source value */
			'get'       : [],
			/* callend after new content will be set for document */
			'set'       : [],
			/* called before command will be executed */
			'exec'      : [],
			/* called after user typed new symbol into document */
			'input'     : [],
			/* called after some changes was made in document or carret change position */
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
		/* editor view */
		this.view      = new this.view(this);
		/* DOM manipulation */
		this.dom       = new this.dom(this);
		/* selection and text text range */
		this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);

		this.filter = new this.filter(this)
		/* history object */
		this.history = new this.history(this);
		
		/* load commands */
		tb = this.options.toolbars[this.toolbar];
		i = tb.length;
		while (i--) {
			p = this.options.panels[tb[i]]; 
			if (typeof(p) != 'undefined' && (l = p.length)) {
				while (l--) {
					if (typeof(this._commands[p[l]]) == 'function') {
						this.commands[p[l]] = new this._commands[p[l]](this);
					}
				}
			}
		}
		/* create toolbar if enabled */
		this.options.allowToolbar && this.view.showToolbar(tb);

		/* load plugins */
		for (i=0; i < this.options.plugins.length; i++) {
			if ( (p = this._plugins[this.options.plugins[i]]) ) {
				this.plugins[p] = new p(this);
			}
		};
		
		/* add target node as document if enabled */
		this.options.loadTarget && this.options.documents.unshift(t);
		/* load documents */
		for (i=0; i<this.options.documents.length; i++) {
			this.open(this.options.documents[i]);
		}
		/* focus required/first document */
		if (this.documents.length) {
			this.focus(this.documents[this.options.active] ? this.options.active : 0);
		}
		/* bind to parent form save events */
		this.view.editor.parents('form').bind('submit', function() { self.trigger('save'); });
		
		/* complete editor load */
		this.trigger('load');
		delete(this.listeners.load);

		this.timeEnd('load');
	}

	/*** API ***/

	/**
	 * Return index of document by id or -1 if not exists
	 *
	 * @param  String  document id
	 * @return Number
	 **/
	elRTE.prototype.indexOf = function(id) {
		var l = this.documents.length;
		while (l--) {
			if (this.documents[l].id === id) {
				return l;
			}
		}
		return -1;
	}

	/**
	 * Return document by id or index
	 *
	 * @param  String|Number  document id/index
	 * @return Object
	 **/
	elRTE.prototype.getDocument = function(i) {
		if (typeof(i) == 'string') {
			i = this.indexOf(i);
		}
		if (typeof(i) == 'number' && typeof(this.documents[i]) != 'undefined') {
			return this.documents[i];
		}
	}

	/**
	 * Open document in editor and return its id.
	 * Document may be dom node or js object:
	 * {
	 *   id       : document id - not required, if not set - generates automatically, 
	 *   name     : name for textarea - not required - if not set - id used,
	 *   content  : document text - required,
	 *   closable : allow close document,
	 *   save     : object (not implemented yet)
	 * }
	 *
	 * @param  DOMElement|Object  document
	 * @return String
	 **/
	elRTE.prototype.open = function(d) {
		if (!d || (d.nodeType != 1 && typeof(d.content) != 'string')) {
			return;
		}
		
		var self  = this,
			ndx   = this.documents.length+1,
			id    = this.id+'-document-'+ndx,
			title = this.i18n('Document')+' '+ndx,
			doc   = { id : id, title : d.title||title },
			html;
			
		if (d.nodeType == 1) {
			doc.source    = d.nodeName == 'TEXTAREA' ? $(d) : $('<textarea name="'+(d.name||id)+'" />').val($(d).html());
			doc.closeable = $(d).hasClass('closable') ? true : this.options.allowCloseDocs;
		} else {
			doc.source    = $('<textarea name="'+(d.name||id)+'" />').val(d.content||'');
			doc.closeable = typeof(d.closable) != 'undefined' ? !!d.closable : this.options.allowCloseDocs;
		}
		
		doc.editor = $('<iframe frameborder="0" />');
		
		/* render document */
		this.view.add(doc);
		
		/* add to editor documents */
		doc.window   = doc.editor[0].contentWindow;
		doc.document = doc.editor[0].contentWindow.document;
		this.documents.push(doc);

		/* create body in iframe */
		html = this.options.doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+this.options.charset+'" />';
		$.each(self.options.cssfiles, function() {
			html += '<link rel="stylesheet" type="text/css" href="'+this+'"/>';
		});
		doc.document.open();
		doc.document.write(this.options.doctype+html+'</head><body> </body></html>');
		doc.document.close();
		
		/* set document content from textarea */
		$(doc.document.body).html(this.filter.wysiwyg(doc.source.val()));

		/* make iframe editable */
		if ($.browser.msie) {
			doc.document.body.contentEditable = true;
		} else {
			try { doc.document.designMode = "on"; } 
			catch(e) { }
		}

		/* bind events to document */
		$(doc.document).bind('paste', function(e) {
			self.trigger('paste').trigger('change');
		})
		.bind('cut', function(e) {
			self.trigger('change');
		})
		.bind('keydown', function(e) {
			var i, s, p;
			for (i in self.shortcuts) {
				if (self.shortcuts.hasOwnProperty(i)) {
					s = self.shortcuts[i];
					p = s.pattern;
					if (p.keyCode == e.keyCode 
					&& (!p.ctrlKey  || p.ctrlKey  == e.ctrlKey) 
					&& (!p.altKey   || p.altKey   == e.altKey) 
					&& (!p.shiftKey || p.shiftKey == e.shiftKey) 
					&& (!p.metaKey  || p.metaKey  == e.metaKey)) {
						if (e.isPropagationStopped()) {
							return;
						}
						s.callback(e);
					}
				}
			}
			!e.isPropagationStopped() && self.trigger(e);
		})
		.bind('keyup mousedown mouseup click dblclick', function(e) {
			if (this == self.active.document) {
				self.trigger(e);
				var ev, c;

				if (e.type == 'mouseup') {
					ev = $.Event('change');
				} else if (e.type == 'keyup') {
					c = e.keyCode;
					if (self.utils.isKeyArrow(c) || c== 13 || e.ctrlKey || (self.macos && (c == 91 || c == 93 || c == 224))) {
						ev = $.Event('change');
					} else if (self.utils.isKeyDel(c)) {
						ev = $.Event('change');
						ev.isDel = true;
					} else if (self.utils.isKeyChar(c) && !e.ctrlKey) {
						ev = $.Event('input')
					}
				}
				if (ev) {
					ev.originalEvent = e;
					self.trigger(ev);
				}
			}
		});

		this.trigger(this.event('open', doc));
		/* when loading document into empty editor after editor was loaded */
		if (!this.documents.length == 1 && !this.listeners.load) {
			this.focus(d.id);
		}
		
		// this.log($(doc.document.body).html().match(/<(\w)(:\w)?([^>]*)>/g))
		// this.log($(doc.document.body).html().match(/(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g))
		
		return id;
	}

	/**
	 * Close document
	 *
	 * @param Number|String  document index/id
	 * @return elRTE
	 */
	elRTE.prototype.close = function(i) {
		var e   = $.Event('close'), 
			l   = this.documents.length, 
			tmp = [],
			d, next;
			
		if ((d = this.getDocument(i)) && d.closeable) {
			
			if (d.id == this.active.id && l>1) {
				next = this.getDocument((i = this.indexOf(d.id))==0 ? 1 : i-1);
			}

			e.elrteDocument = d;
			this.trigger(e);
			this.view.remove(d.id);

			while (l--) {
				d.id != this.documents[l].id && tmp.push(this.documents[l]);
			}
			this.documents = tmp;
			next && this.focus(next.id)
		}
		return this;
	}

	/**
	 * Set document active (visible) if is not. 
	 * Set focus into document editor/source
	 *
	 * @param  String|Number  document id/index
	 * @return elRTE
	 **/
	elRTE.prototype.focus = function(i) {
		var d, a = this.active;
		
		if (this.documents.length) {
			d = this.getDocument(i)||a||this.documents[0];
			
			if (a && d != a) {
				!this.wysiwyg && this.options.autoToggle && this.toggle();
				this.wysiwyg  && this.trigger('blur');
				this.view.focus(d.id);
			}
			
			this.wysiwyg = this.view.workzone.children('#'+d.id).children('iframe').is(':visible');
			(this.wysiwyg ? d.window : d.source[0]).focus();
			
			if (d != a) {
				this.active = d;
				this.trigger(this.wysiwyg ? 'focus' : 'source');
			}
		}
		return this;
	}
	
	/**
	 * Switch between editor and source in active document 
	 * if source access eneabled
	 * @todo for firefox set curret to start of texarea
	 *
	 * @return elRTE
	 */
	elRTE.prototype.toggle = function() {
		if (this.options.allowSource && this.active) {
			this.wysiwyg && this.trigger('blur');
			this.sync(this.active.id).view.toggle();
			this.focus();
			this.trigger(this.wysiwyg ? 'focus' : 'source');
		}
		return this;
	}
	
	/**
	 * Sync data between editor/source in active document or in all documents
	 * If editor is visible for now, data copy from editor to source and other wise
	 *
	 * @param  String|Number  document id/index, not set for sync all documents 
	 * @return elRTE
	 **/
	elRTE.prototype.sync = function(i) {
		var d, l;
		d = typeof(i) != 'undefined' && (d = this.getDocument(i)) ? [d] : this.documents;
		l = d.length;

		while (l--) {
			if (d[l].source.is(':visible')) {
				$(d[l].document.body).html(this.filter.wysiwyg(d[l].source.val()));
			} else {
				d[l].source.val(this.filter.source($(d[l].document.body).html()));
			}
		}
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
		if (typeof(d) == 'object') {
			e.elrteDocument = d;
		} else if (this.active) {
			e.elrteDocument = this.active;
		}
		return e;
	}

	/**
	 * Bind callback to event(s)
	 * To bind multiply events at once, separate events names by space
	 *
	 * @param String    event name
	 * @param Function  callback
	 * @param Boolean   put listener before others (on top)
	 * @return elRTE
	 */
	elRTE.prototype.bind = function(e, c, t) {
		var ev;
		if (typeof(c) == 'function') {
			e = e.split(' ');
			for (var i=0; i < e.length; i++) {
				ev = $.trim(e[i]);
				if (typeof(this.listeners[ev]) == 'undefined') {
					this.listeners[ev] = [];
				}
				t ? this.listeners[ev].unshift(c) : this.listeners[ev].push(c);
			};
		}
		return this;
	}
	
	/**
	 * Bind keybord shortcut to keydown event
	 *
	 * @param String    shortcut pattern in form: "ctrl+shift+z"
	 * @param String    shortcut description
	 * @param Function  callback
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
	 * @param String event name
	 * @param Object event data
	 * @return  elRTE
	 */
	elRTE.prototype.trigger = function(e, d) {
		if (typeof(e) == 'string') {
			e = $.Event(e);
		}
		if (!e.elrteDocument && this.active) {
			e.elrteDocument = this.active;
		}

		if (typeof(d) == 'object') {
			e.data = d;
		}

		this.debug(e.type+' '+e.elrteDocument.id);
		if (this.listeners[e.type] && this.listeners[e.type].length) {
			for (var i=0; i < this.listeners[e.type].length; i++) {
				if (e.isPropagationStopped()) {
					this.log(e.type+' stopped')
					break;
				}
				this.listeners[e.type][i](e);
			};
		}
		
		return this;
	}
	
	/**
	 * Return required or active document content
	 *
	 * @param  String|Number  document id/index
	 * @param  Object         options: raw : do not clear content, quiet : do not rise events
	 * @return String
	 */
	elRTE.prototype.getContent = function(i, o) {
		var d = this.getDocument(i)||this.active, c, e;
		if (d) {
			o = o||{};
			if (o.raw) {
				c = d.source.is(':visible') ? d.source.val() : $(d.document.body).html();
			} else {
				this.sync(d.id);
				c = d.source.val();
			}
			!o.quiet && this.trigger(this.event('get', d));
			return c;
		}
		return '';
	}

	/**
	 * Set content for required or active document
	 *
	 * @param  String         new content
	 * @param  String|Number  document id/index
	 * @param  Object         options: raw : do not clear content, quiet : do not rise events
	 * @return Boolean
	 */
	elRTE.prototype.setContent = function(c, i, o) {
		var d = this.getDocument(i)||this.active, c, e;
		if (d) {
			o = o||{};
			if (!o.raw) {
				c = d.source.is(':visible') ? this.filter.toSource(c) : this.filter.fromSource(c);
			} 
			d.source.is(':visible') ? d.source.val(c) : $(d.document.body).html(c);
			!o.quiet && this.trigger(this.event('set', d));

			if (d == this.active) {
				this.focus();
				this.wysiwyg && !o.quiet && this.trigger('change');
			}
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