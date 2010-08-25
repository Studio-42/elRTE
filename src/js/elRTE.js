(function($) {
	
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(searchElement, fromIndex){
			for(var i = fromIndex||0, length = this.length; i<length; i++) {
				if(this[i] === searchElement) { return i; }
			}
			return -1;
		};
	}
		
	
	
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
		var self = this;
		
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
		this.typing = false;
		/* editor DOM element id. Used as base part for inner elements ids */
		this.id        = 'elrte-'+($(t).attr('id')||$(t).attr('name')||Math.random().toString().substr(2));
		/* loaded docs number ! */
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
			
		this.init = function() {
			var c, ui, p, id, ids=[];
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
			// @TODO check duplicate panels
			$.each(this.options.toolbars[this.options.toolbar]||[], function(i, n) {
				$.each(self.options.panels[n]||[], function(i, cn) {
					if (typeof((c = self.commands[cn])) == 'function' && !self._commands[cn]) {
						self._commands[cn] = new c(self);
						if ((ui = self._commands[cn].ui())) {
							self.view.addUI(ui, n);
						}
					}
				});
			});
			
			/* load plugins */
			$.browser.webkit && this.options.plugins.unshift('webkit');
			$.each(this.options.plugins, function(i, n) {
				if (typeof((p = self.plugins[n])) == 'function' && !self._plugins[n]) {
					self._plugins[n] = new p(self);
				}
			});
			/* add target node as document if enabled */
			this.options.loadTarget && this.options.documents.unshift(t);
			/* load documents */
			$.each(this.options.documents, function(i, d) {
				if (id = self.open(d)) {
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
			
			delete this.init;
		}
		
		/**
		 * Return number of loaded documents
		 *
		 * @return Number
		 **/
		this.count = function() {
			var i = 0;
			$.each(this.documents, function() {
				i++;
			});
			return i;
		}
		
		/**
		 * Return document by id
		 * If document not found return active document (may be undefined if no documents loaded!)
		 *
		 * @param  String|Number  document id/index (or undefined for active document)
		 * @return Object
		 **/
		this.getDocument = function(id) {
			return this.documents[id]||this.active;
		}
		
		/**
		 * Return true if active document is in wysiwyg mode
		 *
		 * @return Boolean
		 **/
		this.isWysiwyg = function() {
			return this.active && this.active.wysiwyg();
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
		this.bind = function(e, c, t) {
			var l = this.listeners;

			if (typeof(c) == 'function') {
				$.each($.trim(e).split(/\s+/), function(i, n) {
					if (typeof(l[n]) == 'undefined') {
						l[n] = [];
					}
					l[n][t?'unshift':'push'](c);
				});
			}
			return this;
		}
		
	
		
		this.unbind = function(e, c) {
			var l = this.listeners[e] || [],
				i = l.indexOf(c);

			i>-1 && l.splice(i, 1);
			return this;
		}
		
		this.one = function(e, c) {
			var self = this,
				h = $.proxy(c, function(e) {
					self.unbind(e.type, h);
					return c.apply(this, arguments);
				});
			return this.bind(e, h);
		}
		
		/**
		 * Bind keybord shortcut to keydown event
		 *
		 * @param  String    shortcut pattern in form: "ctrl+shift+z"
		 * @param  String    shortcut description
		 * @param  Function  callback
		 * @return Boolean
		 */
		this.shortcut = function(p, d, c) {
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
				this.debug('shortcut', 'add '+p);
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
		this.trigger = function(e, d) {
			if (!e.type) {
				e = $.Event(''+e);
			}

			e.data = $.extend({ id :  this.active ? this.active.id : '0'}, e.data||{}, d||{});
			
			this.debug('event.'+e.type,  (e.data.id||'no document')+' '+(this.listeners[e.type] ? 'trigger' : 'no listeners'));

			$.each(this.listeners[e.type]||[], function() {
				if (e.isPropagationStopped()) {
					return false;
				}
				this(e, d);
			});

			return this;
		}
		
		this.createDocument = function(src) {
			var d = new this.document(this.id+'-document-', src)
		}
		
		/**
		 * Open document in editor and return its id.
		 * Document may be dom element or js object:
		 * {
		 *   title    : document title to display in tab, not required
		 *   name     : name for textarea, not required,if not set - id used,
		 *   content  : document text, required,
		 *   closable : allow close document,
		 *   save     : object (not implemented yet)
		 * }
		 *
		 * @param  DOMElement|Object  document to load in editor
		 * @return String
		 **/
		this.open = function(d) {
			if (!d || (d.nodeType != 1 && typeof(d.content) != 'string')) {
				return;
			}
			this.createDocument(d)
			var self = this,
				o    = this.options,
				ndx  = ++this.ndx,
				id   = this.id+'-document-'+ndx,
				$d   = $(d),
				n    = d.nodeType == 1,
				ta  = n && d.nodeName == 'TEXTAREA',
				c   = n ? $d[ta ? 'val' : 'html']() : ''+d.content,
				html,
				doc  = {
					id        : id, 
					ndx       : ndx, 
					title     : d.title||this.i18n('Document')+' '+ndx,
					closeable : $d.hasClass('closable')||d.closable||o.allowCloseDocs,
					source    : (ta ? $d : $('<textarea name="'+((n ? $d.attr('name')||$d.attr('id') : d.name)||id)+'" />').val(c)).addClass('elrte-source'),
					editor    : $('<iframe frameborder="0" class="elrte-editor" />')
				};

			/* render document */
			this.view.add(doc);

			/* add to editor documents */
			doc.window   = doc.editor[0].contentWindow;
			doc.document = doc.editor[0].contentWindow.document;
			this.documents[id] = doc;

			/* create body in iframe */
			html = o.doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+o.charset+'" />';
			$.each(o.cssfiles, function() {
				html += '<link rel="styleshwysiwygeet" type="text/css" href="'+this+'"/>';
			});
			doc.document.open();
			doc.document.write(o.doctype+html+'</head><body>'+c+' </body></html>');
			doc.document.close();

			// add methods to document
			doc.wysiwyg = (function(s) { return function() { return s.editor.is(':visible') || s.editor.css('display') != 'none'; }})(doc);
			doc.get     = (function(s) { return function(t) { return (t ? t == 'wysiwyg' : s.wysiwyg()) ? $(s.document.body).html() : s.source.val(); }})(doc);
			doc.set     = (function(s) { return function(c, t) { (t ? t == 'wysiwyg' : s.wysiwyg()) ? $(s.document.body).html(c) :  s.source.val(c); }})(doc);
			doc.focus   = (function(s) { return function() { if (s.editor.parent().is(':visible')) { s.editor.is(':visible') ? s.window.focus() : s.source[0].focus();} return true; }})(doc);
			doc.toggle  = o.allowSource
				? (function(s) { return function() { return !!(s.editor.parent().is(':visible') && s.editor.add(s.source).toggle() && s.focus()); }})(doc)
				: function() { return false };

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
						if (e.keyCode == 86 && !o.allowPaste) {
							return;
						}
						self.trigger(e.keyCode == 88 ? 'cut' : 'paste');
					}
				});
			}

			$(doc.document).bind('paste', function(e) {
				// paste handler
				if (!self.options.allowPaste) {
					// paste denied 
					e.stopPropagation();
					e.preventDefault();
				} else {
					// create sandbox for paste, clean it content and unwrap
					var n = self.dom.create({name : 'div', css : {position : 'absolute', left : '-10000px',top : '0', width : '1px', height : '1px', overflow : 'hidden' }}),
						r = self.dom.createTextNode(' _ ');

					self.trigger('paste');
					n.appendChild(r);
					n = self.selection.insertNode(n);
					self.selection.select(n.firstChild);
					setTimeout(function() {
						if (n.parentNode && !r.parentNode) {
							// clean sandbox content
							$(n).html(self.filter.proccess('paste', $(n).html()));
							r = n.lastChild;
							self.dom.unwrap(n);
							if (r) {
								self.selection.select(r);
								self.selection.collapse(false);
							}
						} else {
							// smth wrong - clean all doc
							n.parentNode && n.parentNode.removeChild(n);
							self.active.set(self.filter.wysiwyg2wysiwyg(self.active.get('wysiwyg')), 'wysiwyg');
							self.selection.select(self.active.document.body);
							self.selection.collapse(true);
						}
						self.trigger('change');
					}, 15);
				}
			})
			.bind('dragstart dragend drop', function(e) {
				// disable drag&drop
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
						// on tab pressed insert spaces
						e.stopPropagation();
						e.preventDefault();
						self.selection.insertHtml("&nbsp;&nbsp;&nbsp;");
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
					// cached changes
					self.trigger('change', {originalEvent : e});
					self.change = self.typing = false;
				} else if (self.utils.isKeyArrow(e.keyCode)) {
					// carret change position
					self.trigger('changePos', {originalEvent : e});
					self.typing = false;
				} else {
					self.typing = true;
				}
				self.trigger(e);
			})
			.bind('mousedown mouseup click dblclick', function(e) {
				e.type == 'mouseup' && self.trigger('changePos', {originalEvent : e});
				self.typing = false;
				self.trigger(e);
			})

			this.trigger('open', { id : doc.id });

			/* load document into empty editor after editor was loaded */
			if (!this.init && (this.count() == 1 || !o.loadDocsInBg)) {
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
		this.close = function(id) {
			var d = this.getDocument(id);

			if (d) {
				// switch to prev/next document before close active
				d == this.active && this.count()>1 && this.focus(this.view.getPrev()||this.view.getNext());
				this.trigger('close', {id : d.id}).view.remove(d.id);

				if (this.active.id == d.id) {
					this.active = null;
				}
				delete this.documents[d.id];
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
		this.focus = function(id) {
			var d = this.getDocument(id), 
				a = this.active;

			if (d) {
				if (d == a) { // document already active
					d.focus();
				} else { // switch to another document
					// set active doc in wysiwyg mode if required
					a && !a.wysiwyg() && this.options.autoToggle && this.toggle();
					// show doc
					this.view.showDoc(d.id);
					// set doc active
					this.active = d;
					// get focus to doc
					d.focus();
					// rise events
					this.trigger('focus').trigger(d.wysiwyg() ? 'wysiwyg' : 'source');
				}
			}
			return this;
		}
		
		/**
		 * Switch between editor and source in active document 
		 * if source access eneabled
		 *
		 * @return elRTE
		 */
		this.toggle = function() {
			this.active && this.sync(this.active.id) && this.active.toggle() && this.trigger(this.active.wysiwyg() ? 'wysiwyg' : 'source');
			return this;
		}
		
		/**
		 * Sync data between editor/source in active document or in all documents
		 * If editor is visible for now, data copy from editor to source and otherwise
		 *
		 * @param  String  document id, undefined to sync all documents 
		 * @return elRTE
		 **/
		this.sync = function(id) {
			var self = this, t;

			$.each(id && (d = this.getDocument(id)) ? [d] : this.documents, function() {
				t = this.wysiwyg() ? 'source' : 'wysiwyg';
				this.set(self.filter.proccess(t, this.get()), t);
				self.debug('sync: '+this.id);
			});
			return this;
		}
		
		/**
		 * Get content from required/active document
		 * If document id not set - return active document content
		 *
		 * @param  String  document id 
		 * @return String
		 **/
		elRTE.prototype.get = function(id, o) {
			var d = this.getDocument(id);
			if (d) {
				if (!o.raw) {
					d.wysiwyg() ? this.sync(d.id) : d.set(self.filter.proccess('source2source', d.get()));
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
		this.set = function(c, id, o) {
			var d = this.getDocument(id);
			if (d) {
				o = o||{};
				d.set(o.raw ? c : this.filter.proccess(d.wysiwyg() ? 'wysiwyg' : 'source', c));
				d.focus();
				!o.quiet && d == this.active && this.trigger('change', { id : d.id });
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
		this.content = function() {
			var self = this,
				a = arguments,
				d = this.documents[a[0]],
				id = this.active ? this.active.id : void(0), 
				c, o, d;

			function get(id) {
				return (d = self.getDocument(id))
					? self.filter.proccess(d.wysiwyg() ? 'wysiwyg' : 'source2source', d.get())
					: '';
			}
			
			function set(id, c) {
				if ((d = self.getDocument(id))) {
					d.set(self.filter.proccess(d.wysiwyg() ? 'wysiwyg' : 'source', ''+c));
					d.focus();
					d == self.active && self.trigger('change', { id : d.id });
					return true;
				}
				return false;
			}
			
			if (a[0] !== void(0)) {
				if (d) {
					id = d.id;
					if (typeof(a[1]) !== void(0)) {
						c = a[1];
					}
				} else {
					c = arguments[0];
				}
			}
			return c ? set(id, c, o) : get(id, o);
		}
		
		this.init();
		this.timeEnd('load');
		// this.log(this)
	}

	/*** API ***/


	
	elRTE.prototype.document = function(id, src) {
		this.id = id;
		this.title = '',
		this.source;
		this.editor;
		if (src.nodeType != 1) {
			src = $.extend({ content : ' ' }, src)
		}
		window.console.log(src)
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

	elRTE.prototype._conf = function(t, n, o) {
		var c = this.options[t == 'cmd' ? 'commandsConf' : 'pluginsConf'];
		return o
			? (c && c[n] ? c[n][o] : false)
			: (c ? c[n] : false);
	}

	elRTE.prototype.commandConf = function(n, o) {
		return this._conf('cmd', n, o);
	}

	elRTE.prototype.pluginConf = function(n, o) {
		return this._conf('pl', n, o);
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
		// window.console && window.console.log && window.console.log.apply(null, arguments);
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