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
		/* version */
		this.version = '1.1 dev';
		/* build date */
		this.build = '20100906';
		/* DOM element on witch elRTE created */
		this.target = t;
		/* hide target */
		t = $(t).hide();
		/* editor DOM element id. Used as base part for inner elements ids */
		this.id = 'elrte-'+($(t).attr('id')||$(t).attr('name')||Math.random().toString().substr(2));
		// form 
		this.form = t.parents('form');
		/* editor config */
		this.options = $.extend(true, {}, this.options, o);
		/* messages language */
		this.lang = 'en';
		this.xhtml = /xhtml/i.test(this.options.doctype);
		/* messages */
		this.messages = this.i18Messages[this.options.lang]||{};
		/* is macosX? */
		this.macos = navigator.userAgent.indexOf('Mac') != -1;
		/* loaded commands */
		this._commands = {};
		/* loaded plugins */
		this._plugins = {};
		/* shortcuts */
		this.shortcuts = {};

		this.KEY_UNKNOWN = 0;
		this.KEY_CHAR    = 1;
		this.KEY_ENTER   = 2;
		this.KEY_DEL     = 3;
		this.KEY_TAB     = 4;
		this.KEY_ARROW   = 5;
		this.KEY_SERVICE = 6;

		this.lastKey = 0;
		
		/* "constants" - change source */
		// this.CHANGE_NON  = 0;
		// this.CHANGE_KBD = 1;
		// this.CHANGE_DEL = 2;
		// this.CHANGE_CMD = 3;
		// this.CHANGE_POS = 4;
		/* cached change on keydown to rise change event after keyup */
		this.change = false;
		/* max loaded doc number */
		this.ndx = 0;
		/* opened documents */
		this.documents = { };
		/* active(visible) document */
		this.active    = null;
		/* events listeners */
		this.listeners = {
			/* called once after elRTE init and load documents */
			'load'      : [],
			/* called before? editor will be set visible */
			'show'      : [],
			/* called before? editor will be set hidden */
			'hide'      : [],
			/* called after new document added to editor */
			'open'      : [], 
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
			'paste'     : [],
			'hideUI' : []
			};
		
		/**
		 * Initilize editor
		 *
		 * @return void
		 **/	
		this.init = function() {
			var self = this, 
				o = this.options,
				ids = [], 
				c, ui, p, id;
			/* object with various utilits */	
			this.utils = new this.utils(this)
			/* editor view/renderer */
			this.view = new this.view(this);
			/* DOM manipulation */
			this.dom = new this.dom(this);
			/* selection and text range object */
			this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);
			/* cleaning content object */
			this.filter = new this.filter(this)
			/* history object */
			this.history = new this.history(this);
			
			// init commands prototype
			this.command = new this.command(this);
			/* load commands */
			$.each(o.toolbars[o.toolbar]||[], function(i, p) {

				$.each(o.panels[p]||[], function(i, n) {
					
					if (typeof((c = self.commands[n])) == 'function' && !self._commands[n]) {
						c.prototype = self.command;
						c = new c();
						c.name = n;
						self._commands[n] = c.init(o.commandsConf[n]||{});
						// delete self._commands[n].init
					}
				});
			});

			this.view.buildUI(o.toolbars[o.toolbar], this._commands)


			/* load plugins */
			$.browser.webkit && this.options.plugins.unshift('webkit');
			$.each(this.options.plugins, function(i, n) {
				if (typeof((p = self.plugins[n])) == 'function' && !self._plugins[n]) {
					self._plugins[n] = new p(self);
				}
			});
			/* add target node as document if enabled */
			this.options.loadTarget && this.options.documents.unshift(this.target);
			/* load documents */
			$.each(this.options.documents, function(i, d) {
				if (id = self.open(d)) {
					ids.push(id);
				}
			});
			/* focus required/first document */
			ids.length && this.focus(ids[this.options.active]||ids[this.options.loadDocsInBg ? 0 : ids.length-1]);

			/* bind to parent form save events */
			this.form.bind('submit', $.proxy(this.save, this));

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
			
			$(document).mousedown(function() {
				self.trigger('hideUI');
			});
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
		this.document = function(id) {
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
			var l = this.listeners, e, i, n;

			if (typeof(c) == 'function') {
				e = $.trim(e).split(/\s+/);
				i = e.length;
				while (i--) {
					n = e[i];
					if (l[n] === void(0)) {
						l[n] = [];
					}
					l[n][t?'unshift':'push'](c);
				}
			}
			return this;
		}
		
		/**
		 * Remove event listener if exists
		 *
		 * @param  String    event name
		 * @param  Function  callback
		 * @return elRTE
		 */
		this.unbind = function(e, c) {
			var l = this.listeners[e] || [],
				i = l.indexOf(c);

			i>-1 && l.splice(i, 1);
			return this;
		}
		
		/**
		 * Bind callback to event(s) The callback is executed at most once per event.
		 * To bind multiply events at once, separate events names by space
		 *
		 * @param  String    event name
		 * @param  Function  callback
		 * @return elRTE
		 */
		this.one = function(e, c) {
			var self = this,
				h = $.proxy(c, function(e) {
					setTimeout(function() {self.unbind(e.type, h);}, 3)
					return c.apply(this, arguments);
				});
			return this.bind(e, h);
		}
		
		/**
		 * Bind keybord shortcut to keydown event
		 *
		 * @param  String    shortcut pattern in form: "ctrl+shift+z"
		 * @param  String    command name for exec trigger
		 * @param  String    shortcut description
		 * @param  Function  callback
		 * @return elRTE
		 */
		this.shortcut = function(pt, cmd, ds, cb) {
			var p = pt.toUpperCase().split('+'),
				l = p.length, 
				k = { keyCode : 0, ctrlKey : false, altKey : false, shiftKey : false, metaKey : false };
			
			while (l--) {
				switch (p[l]) {
					case 'CTRL'  : k.ctrlKey  = true; break;
					case 'ALT'   : k.altKey   = true; break;
					case 'SHIFT' : k.shiftKey = true; break;
					case 'META'  : k.metaKey  = true; break;
					default      : k.keyCode  = p[l].charCodeAt(0);
				}
			}
			if (k.keyCode>0 && (k.altKey||k.ctrlKey||k.metaKey) && typeof(cb) == 'function') {
				this.shortcuts[pt] = {
					pattern     : k, 
					callback    : cb, 
					cmd         : cmd,
					description : this.i18n(ds)
				};
				this.debug('shortcut', 'add '+pt);
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
			var self = this, l;
			
			if (!e.type) {
				e = $.Event(''+e);
			}
			l = this.listeners[e.type]||[];
			
			if (l.length) {
				e.data = $.extend({ id :  this.active ? this.active.id : '0'}, e.data||{}, d||{});
				this.debug('event.'+e.type,  (e.data.id||'no document')+' '+(l.length ? 'trigger' : 'no listeners'));
				$.each(l, function(i, c) {
					if (e.isPropagationStopped()) {
						return false;
					}
					c(e, d);
					// try {
					// 	c(e, d);
					// } catch (ex) {
					// 	self.log('trigger exeption. event: '+e.type)
					// }

				});
			}
			return this;
		}
		
		/**
		 * Open document in editor and return document id in editor.
		 * Document may be dom element or js object:
		 * {
		 *   title    : document title to display in tab, not required
		 *   name     : name for textarea, not required,if not set - id used,
		 *   content  : document text, required,
		 *   save     : object (not implemented yet)
		 * }
		 *
		 * @param  DOMElement|Object  document to load in editor
		 * @return String
		 **/
		this.open = function(d) {
			var self = this, o = this.options, html;
			
			function sync(d) {
				t = d.wysiwyg() ? 'source' : 'wysiwyg';
				d.set(self.filter.proccess(t, d.get()), t);
			}
			
			function doc(src) {
				var ndx = ++self.ndx, title, $src, ta;
				
				this.id     = self.id+'-document-'+ndx;
				this.title  = self.i18n('Document')+' '+ndx;
				this.editor = $('<iframe frameborder="0" class="elrte-editor"/>');
				this.type   = 'post';

				if (src.nodeType == 1) {
					$src        = $(src);
					title       = $src.attr('title');
					this.name   = $src.attr('name')||$src.attr('id')||id;
					this.url    = $src.attr('rel')||'';
					this.source = src.nodeName == 'TEXTAREA' ? $src : $('<textarea name="'+this.name+'"/>').val($src.html());
				} else {
					src         = $.extend({name : '', content : '', title : '', url : '', type : ''}, src);
					title       = src.title;
					this.name   = src.name||this.id;
					this.url    = src.url;
					this.type   = src.type;
					this.source = $('<textarea name="'+this.name+'"/>').val(' '+src.content);
				}
				this.source.addClass('elrte-source');
				if (title) {
					this.title = title;
				}

				this.wysiwyg = function() {
					return /* this.editor.is(':visible') ||*/ this.editor.css('display') != 'none';
				}

				this.get = function(t) {
					return (t ? t == 'wysiwyg' : this.wysiwyg()) ? $(this.document.body).html() : this.source.val();
				}
				
				this.set = function(c, t) {
					(t ? t == 'wysiwyg' : this.wysiwyg()) ? $(this.document.body).html(c) :  this.source.val(c);
				}
				
				this.focus = function() {
					this.wysiwyg() ? this.window.focus() : this.source[0].focus();
				}
				
				this.toggle = function() {
					if (o.allowSource && this.editor.parent().is(':visible')) {
						sync(this);
						this.editor.add(this.source).toggle();
						this.focus();
						self.trigger(this.wysiwyg() ? 'wysiwyg' : 'source');
					} 
					return this;
				}
			}
			
			d = new doc(d);
			
			/* render document */
			this.view.add(d);
			
			/* add to editor documents */
			d.window   = d.editor[0].contentWindow;
			d.document = d.editor[0].contentWindow.document;
			this.documents[d.id] = d;
			
			/* create body in iframe */
			html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+o.charset+'" />';
			$.each(o.cssfiles, function() {
				html += '<link rel="stylesheet" type="text/css" href="'+this+'"/>';
			});
			d.document.open();
			d.document.write(o.doctype+html+'</head><body>'+this.filter.wysiwyg(d.get('source'))+' </body></html>');
			d.document.close();
			
			/* make iframe editable */
			if ($.browser.msie) {
				d.document.body.contentEditable = true;
			} else {
				try { d.document.designMode = "on"; } 
				catch(e) { }
			}
			
			/* bind events to document */

			// rise cut/paste events on ctrl+x/v in opera, but not on mac :(
			// on mac opera think meta is a ctrl key
			// i hope only a few nerds use opera on mac :)
			// TODO test on linux/win
			if ($.browser.opera && !this.macos) {
				$(d.document).bind('keydown', function(e) {
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
			
			$(d.document).bind('paste', function(e) {
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
					n = self.selection.deleteContents().insertNode(n);
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

				self.change  = false;
				self.lastKey = self.utils.keyType(e);
				
				// exec shortcut callback
				$.each(self.shortcuts, function(n, s){
					p = s.pattern;
					if (p.keyCode == c && p.ctrlKey == e.ctrlKey && p.altKey == e.altKey && p.shiftKey == e.shiftKey && (p.meta ? p.metaKey == e.metaKey : true)) {
						e.stopPropagation();
						e.preventDefault();
						s.cmd && self.trigger('exec', { cmd : s.cmd });
						s.callback(e) && self.trigger('change', { cmd : s.cmd });
						return false;
					}
				});

				if (!e.isPropagationStopped()) {
					if (c == 9){
						// on tab pressed insert spaces
						// @todo - collapse before insertHtml?
						e.preventDefault();
						self.selection.insertHtml("&nbsp;&nbsp;&nbsp;");
					} 
					
					// self.lastKey = self.utils.keyType(e);
					
					if (self.lastKey == self.KEY_ENTER 
					||  self.lastKey == self.KEY_TAB 
					||  self.lastKey == self.KEY_DEL 
					|| (self.lastKey == self.KEY_CHAR && !self.selection.collapsed())) {
						self.trigger('exec');
						self.change = true;
					} 
					
					self.trigger(e);

				}
			})
			.bind('keyup', function(e) {
				self.trigger(e);
				
				if (self.change) {
					self.trigger('change', {event : e});
				} else if (self.lastKey == self.KEY_ARROW) {
					self.trigger('changePos', {event : e});
				}
				
				self.lastKey = 0;
				self.change = false;
			})
			.bind('mouseup', function(e) {
				self.lastKey = 0;
				// click on selection not collapse it at moment
				setTimeout(function() { self.trigger('changePos', {event : e}); }, 1);
			})
			.bind('mousedown mouseup click dblclick', function(e) {
				self.trigger(e);
			});

			this.trigger('open', { id : d.id });
			
			if (!this.init && this.count() == 1) {
				this.focus(d.id);
			}
			
			return d.id;
		}
		
		/**
		 * Close document
		 *
		 * @param String  document id
		 * @return elRTE
		 */
		this.close = function(id) {
			var d = this.document(id);

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
			var d = this.document(id), 
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
					this.trigger(d.wysiwyg() ? 'wysiwyg' : 'source');
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
			this.active && this.active.toggle();
			return this;
		}
		
		/**
		 * Get/set editor content.
		 * Usage:
		 * this.val() - returns active document content
		 * this.val(id) - returns document with id content
		 * this.val('some text..') - set active document content
		 * this.val(id, 'some text..') - set document with id content
		 *
		 * @return String|Boolean
		 **/
		this.val = function() {
			var self = this,
				a    = arguments,
				d    = this.documents[a[0]],
				id   = this.active ? this.active.id : void(0), 
				c, o, d;

			function get(id) {
				return ((d = self.document(id)))
					? self.filter.proccess(d.wysiwyg() ? 'source' : 'source2source', d.get())
					: '';
			}
			
			function set(id, c) {
				if ((d = self.document(id))) {
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
		
		/**
		 * Update textareas contents for required/all documents
		 * 
		 * @param  String  document id
		 * @return elRTE
		 */
		this.updateSource = function(id) {
			var self = this,
				d = this.documents;
			$.each(d[id] ? [d[id]] : d, function(i, d) {
				d.set(self.filter.proccess(w = d.wysiwyg() ? 'source' : 'source2source', d.get()), 'source');
			});
			return this;
		}
		
		/**
		 * Save editor documents
		 * If documents has own url for save - submit to this urls, others submit with parent form
		 *
		 * @param  Event
		 * @return void
		 */
		this.save = function(e) {
			var self = this, 
				url  = this.form.attr('action'), 
				t, f;
				
			if ((!e || !e.type) && this.form.length ) {
				return this.form.submit();
			} 

			self.updateSource();
			self.trigger('save');
			t = $('<iframe name="elrte_trg" style="position:absolute;left:-1000px"/>').appendTo('body');
			$.each(this.documents, function(i, d) {
				if (d.url && d.url != url) {
					f = $('<form action="'+d.url+'" method="'+(d.type||self.form.attr('method')||'post')+'" target="elrte_trg" />')
						.append(d.source)
						.appendTo('body')
						.submit();
				}
			});
			t.remove();
		}
		
		/**
		 * Return message translated into current language
		 *
		 * @param  String  message
		 * @return String
		 */
		this.i18n = function(m) {
			return this.messages[m]||m;
		}
		
		/**
		 * Return command options
		 *
		 * @param  String  command name
		 * @param  String  option name (if not set - return all config)
		 * @return String|Array
		 */
		this.commandConf = function(n, o) {
			var c = this.options['commandsConf'];
			return o ? (c && c[n] ? c[n][o] : false) : (c ? c[n] : false);
		}
		
		/**
		 * Return plugin options
		 *
		 * @param  String  plugin name
		 * @param  String  option name (if not set - return all config)
		 * @return String|Array
		 */
		this.pluginConf = function(n, o) {
			var c = this.options['pluginConf'];
			return o ? (c && c[n] ? c[n][o] : false) : (c ? c[n] : false);
		}
		
		/**
		 * Exec editor method return result
		 * @TODO add obj.cmd call support
		 * @param  String  editor method name
		 * @return mixed
		 */
		this.exec = function(cmd) {
			var a = Array.prototype.slice.call(arguments);
			a.shift();
			
			return this[cmd] ? this[cmd].apply(this, a) : false;
			
			return this[cmd]
				? this[cmd].apply(this, a)
				: this._commands[cmd] ? this._commands[cmd].exec.apply(this._commands[cmd], a) : false;
		}
		
		/**
		 * Return true if command loaded in editor
		 *
		 * @param  String  command name
		 * @return Boolean
		 */
		this.cmdLoaded = function(cmd) {
			return !!this._commands[cmd];
		}
		
		/**
		 * Return curent command state (-1 : disable, 0 : enabled, 1 : active)
		 *
		 * @param  String  command name
		 * @return Number
		 */
		this.cmdState = function(cmd) {
			var c = this._commands[cmd]; 
			return c ? c.state() : -1;
		}
		
		/**
		 * Return true if command may be executed
		 *
		 * @param  String  command name
		 * @return Boolean
		 */
		this.cmdEnabled = function(cmd) {
			return this.cmdState() > -1;
		}
		
		/**
		 * Return command value if enabled
		 *
		 * @param  String  command name
		 * @return String
		 */
		this.cmdValue = function(cmd) {
			var c = this._commands[cmd]; 
			return c ? c.value() : false;
		}
		
		/**
		 * Exec command method "exec" and return result
		 *
		 * @param  String  editor command name
		 * @return mixed
		 */
		this.execCmd = function(cmd) {
			var c = this._commands[cmd],
				a = Array.prototype.slice.call(arguments);
			a.shift();
			return c ? c.exec.apply(c, a) : false;
		}
		
		
		
		
		/* SERVICE METHODS */
		/**
		 * send message to console log
		 *
		 * @param String  message
		 */
		this.log = function(m) {
			// window.console && window.console.log && window.console.log.apply(null, arguments);
			window.console && window.console.log && window.console.log(m);
		}
		
		/**
		 * send message to console log if debug is enabled in config
		 *
		 * @param String  message group name
		 * @param String  message
		 */
		this.debug = function(n, m) {
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
		 * Switches to next document after active one
		 *
		 * @TODO add cmd+arrows shortcut
		 * @return elRTE
		 */
		this.next = function() {
			this.count()>1 && this.focus(this.view.getNext()||this.view.getFirst());
			return this;
		}
		
		/**
		 * Switches to previous document before active one
		 *
		 * @return elRTE
		 */
		this.prev = function() {
			this.count()>1 && this.focus(this.view.getPrev()||this.view.getLast());
			return this;
		}
		
		/**
		 * Show editor if hidden
		 *
		 * @return elRTE
		 */
		this.show = function() {
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
		this.hide = function() {
			if (this.view.editor.is(':visible')) {
				this.view.editor.hide();
				this.trigger('hide');
			}
			return this;
		}
		
		
		this.init();
		this.timeEnd('load');

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
	
	elRTE.prototype.mixins = {};
	
	/**
	 * elRTE commands classes
	 *
	 */
	elRTE.prototype.ui = {};	

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
		
		/**
		 * Exec command and return result ONLY for first editor
		 */
		this.exec = function() {
			var e = this[0];
			return e && e.elrte ? e.elrte.exec.apply(e.elrte, Array.prototype.slice.call(arguments)) :false;
		}
		
		if (this.length && typeof(o) == 'string') {
			return this[0].elrte ? this[0].elrte.exec.apply(this[0].elrte, Array.prototype.slice.call(arguments)) : false;
		}
		return this;
	}
	
	
})(jQuery);