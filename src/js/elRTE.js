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
	 * 
	 * @param DOMElement  
	 * @param Object  editor options
	 */
	elRTE = function(o, node) {
		
		var self = this,
			// loaded = false,
			node = node && node.nodeType == 1 ? node : void(0),
			$node = node ? $(node).data('elrte', this).hide() : void(0), //.hide(),
			o    = $.extend(true, {}, this.options, o || {}),
			fullscreenClass = 'elrte-fullscreen',
			// store resizable state to avoid double bindings event 
			resizable = false,
			minWidth  = parseInt(o.minWidth)  || 300,
			minHeight = parseInt(o.minHeight) || 250,
			width     = typeof(o.width) == 'number' ? o.width+'px' : o.width||'auto',
			height    = (parseInt(o.height) || 400)+'px',
			tb, intr;
		
		
		/**
		 * Return true if editor in DOM and visible
		 *
		 * @return Boolean
		 */
		this.enabled = function() {
			return self.workzone.is(':visible') && self.workzone.parents('body').length;
		}
		
		/**
		 * Return true visible
		 *
		 * @return Boolean
		 */
		this.visible = function() {
			return self.workzone.is(':visible');
		}
		/*******************************************************/
		/*                         Events                      */
		/*******************************************************/
		
		/**
		 * Create/normalize event - add event.data object if not exists and
		 * event.data.id - document id on wich event is fired
		 * event.data.elrte - current editor instance
		 * 
		 * @return jQuery.Event
		 */
		this.event = function(e, data) {
			if (!e.type) {
				e = $.Event(e.toLowerCase());
			}
			e.data = $.extend({ id : this.active ? this.active.id : '' }, e.data, data, { elrte : this});
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
		this.bind = function(e, c, t) {
			var l = this.listeners, 
				e = $.trim(e.toLowerCase()).split(/\s+/), 
				i = e.length, 
				n;
				
			if (typeof(c) == 'function') {
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
			var l = this.listeners[e.toLowerCase()] || [],
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
					setTimeout(function() {self.unbind(e.type, h);}, 3);
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
		 * @param  Event|String  event or event type
		 * @param  Object        extra parameters
		 * @return elRTE
		 */
		this.trigger = function(e, d) {
			var self = this, 
				e    = this.event(e, d),
				l    = this.listeners[e.type]||[];

			this.debug('event.'+e.type,  (e.data.id||'no document')+' '+(l.length ? 'trigger' : 'no listeners'));

			if (l.length) {

				$.each(l, function(i, c) {
					if (e.isPropagationStopped()) {
						return false;
					}
					c(e, d);
					// try {
					// 	c(e, d);
					// } catch (ex) {
					// 	self.debug('error.trigger', e.type)
					// }
				});
			}
			return this;
		}
		
		/*******************************************************/
		/*                 Documents manipuations              */
		/*******************************************************/
		
		/**
		 * Open document[s]
		 * Accept jQuery object, DOMElement, Object, String or array of this elements
		 *
		 * @param Array|Object|DOMElement|jQuery|String  document[s] source
		 * @return elRTE
		 */
		this.open = function(d) {
			var self = this;

			// dont load docs utill editor will be loaded and visible
			if (!this.enabled()) {
				return this.one('show', function() {
					self.open(d);
				});
			}

			if (d.jquery || $.isArray(d)) {
				$.each(d, function(i, e) {
					if (e.jquery) {
						e.each(function(i, n) {
							new self.document(n, self);
						});
					} else {
						new self.document(e, self);
					}
				});
			} else {
				new this.document(d, this);
			}
			
			return this;
		}
		
		/**
		 * Close document
		 *
		 * @param String  document id
		 * @return elRTE
		 */
		this.close = function(id) {
			var d = this.documentById(id), 
				a = this.active, 
				next = d === a ? this.tabsbar.getNext() : '';

			if (d && this.options.allowCloseDocs) {
				
				if (d.close()) {

					this.trigger(this.event('close', {id : id}));
					d === a && delete this.active;
					this.focus(next);
				}
			}
			return this;
		}
		
		/**
		 * Set document active (visible) if it is not visible. 
		 * Give focus to document editor/source
		 *
		 * @param  String  document id
		 * @return elRTE
		 **/
		this.focus = function(id) {
			var d = this.documentById(id), 
				a = this.active;

			if (d) {
				if (d == a) { 
					// document already active - only set focus into it
					d.focus();
				} else { 
					// switch to another document
					// set active doc in wysiwyg mode if required before hide it
					a && !a.wysiwyg() && this.options.autoToggle && this.toggle();
					// set doc active, show focus into it
					this.active = d.show().focus();
					// trigger event
					this.trigger(d.wysiwyg() ? 'wysiwyg' : 'source');
				}
			}
			return this;
		}
		
		/**
		 * Switch active document between editor and source mode if source access enabled
		 *
		 * @return elRTE
		 */
		this.toggle = function() {
			this.active && this.active.toggle();
			return this.focus();
		}
		
		/**
		 * Return true if active document is in wysiwyg mode
		 *
		 * @return Boolean
		 **/
		this.isWysiwyg = function() {
			this.log('isWysiwyg() depricated!')
			return this.wysiwyg();
		}
		
		this.wysiwyg = function() {
			return this.active && this.active.wysiwyg();
		}
		
		/**
		 * Return number of loaded documents
		 *
		 * @todo - static counter ?
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
		 * If document not found return active document (or undefined if no documents loaded!)
		 *
		 * @param  String  document id (or undefined for active document)
		 * @return Object
		 **/
		// this.document = function(id) {
		// 	this.log('document called')
		// 	return this.documents[id]||this.active;
		// }
		this.documentById = function(id) {
			return this.documents[id]||this.active;
		}
		
		/**
		 * Return document by name
		 *
		 * @param  String  document name
		 * @return Object
		 **/
		this.documentByName = function(n) {
			var d;
			$.each(this.documents, function() {
				if (this.name == n) {
					d = this;
					return false;
				}
			});
			return d;
		}
		
		/**
		 * Return document by index
		 *
		 * @param  Number  document index
		 * @return Object
		 **/
		this.documentByIndex = function(n) {
			var d;
			$.each(this.documents, function() {
				if (this.ndx == n) {
					d = this;
					return false;
				}
			});
			return d;
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
			var c = this.options['pluginsConf'];
			return o ? (c && c[n] ? c[n][o] : false) : (c ? c[n] : false);
		}
		
		/**
		 * Exec editor method return result
		 * @TODO add obj.cmd call support
		 * @param  String  editor method name
		 * @return mixed
		 */
		this.exec = function(cmd) {
			var obj  = this,
				args = Array.prototype.slice.call(arguments, 1),
				i;
			
			if ((i = cmd.indexOf('.')) > 0) {
				obj = this[cmd.substr(0, i)]
				cmd = cmd.substr(i+1);
			}
			
			return typeof(obj[cmd]) == 'function' ? obj[cmd].apply(obj, args) : false;
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
		 * Call command method "exec" and return result
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
		
		
		
		
		
		
		/*******************************************************/
		/*                   View manipulations                */
		/*******************************************************/
		
		/**
		 * Return true if editor is visible
		 *
		 * @return Boolean
		 */
		this.isVisible = function() {
			return this.workzone.is(':visible');
		}
		
		/**
		 * Return true if editor in fullscreen mode
		 *
		 * @return Boolean
		 */
		this.isFullscreen = function() {
			return this.workzone.hasClass(fullscreenClass);
		}
		
		/**
		 * Return true if editor is resizable
		 *
		 * @return Boolean
		 */
		this.isResizable = function() {
			return resizable;
		}
		
		/**
		 * Switch to next document after active one
		 *
		 * @TODO add cmd+arrows shortcut
		 * @return elRTE
		 */
		this.next = function() {
			return this.focus(this.tabsbar.getNext());
		}
		
		/**
		 * Switch to previous document before active one
		 *
		 * @return elRTE
		 */
		this.prev = function() {
			return this.focus(this.tabsbar.getPrev());
		}
		
		/**
		 * Show editor if hidden
		 *
		 * @return elRTE
		 */
		this.show = function() {
			if (!this.enabled()) {
				this.workzone.show();
				this.focus().trigger('show');
			}
			return this;
		}
		
		/**
		 * Hide editor if visible
		 *
		 * @return elRTE
		 */
		this.hide = function() {
			if (this.enabled()) {
				this.workzone.hide();
				this.trigger('hide');
			}
			return this;
		}
		
		/**
		 * Close all documents and remove editor from DOM
		 *
		 * @return void
		 */
		this.destroy = function() {
			var self = this;
			
			$.each(this.documents, function() {
				self.close(this.id);
			});
			
			this.trigger('destroy').workzone.remove();
			node && $node.removeData('elrte').show();
			delete this;
		}
		
		/**
		 * Update workzone and iframes/textareas height.
		 * resize/resizestop handler
		 *
		 * @return elRTE
		 */
		this.updateHeight = function() {
			var h = 'height',
				o = 'outerHeight',
				v = self.workzone[h]() - (self.container[o](true) - self.main[h]());
				
			v -= ((self.toolbar.is(':visible')   ? self.toolbar[o](true)   : 0) 
				+ (self.tabsbar.is(':visible')   ? self.tabsbar[o](true)   : 0)
				+ (self.statusbar.is(':visible') ? self.statusbar[o](true) : 0));

			self.viewport[h](v).find('iframe,textarea')[h](v);

			return this;
		}
		
		/**
		 * Enable/disable editor resizable
		 *
		 * @param  Boolean  switch on/off resizable
		 * @return void
		 */
		this.resizable = function(state) {
			var self = this,
				o = this.options,
				e = o.resizeHelper ? 'resizestop' : 'resize';
			
			if (state !== void(0)) {
				if (o.resizable && $.fn.resizable) {
					if (state && !resizable) {
						this.workzone
							.resizable({
								handles   : 'se', 
								helper    : o.resizeHelper,
								minWidth  : minWidth, 
								minHeight : minHeight 
							})
							.bind(e, function() {
								self.trigger('resize')
							})
							// .bind(e, this.updateHeight);
						resizable = true;

					} else if (!state && resizable) {
						this.workzone.resizable('destroy').unbind(e);
						resizable = false;
					}
				}
				// this.focus();
			}	
			
			return resizable;
		}
		

		
		this.fullscreen = function() {
			
			var self = this,
				c = fullscreenClass,
				f = this.isFullscreen(),
				p = 'elrtepos',
				e = f ? 'fullscreenoff' : 'fullscreenon',
				z = 'elrtezindex',
				i = parseInt(this.workzone.css('z-index')) || 0,
				m;
			
			if (this.isVisible()) {
				if (f) {
					this.workzone
						.removeClass(c)
						.css({
							'width'   : width, 
							'height'  : height,
							'z-index' : this.workzone.data(z)
						})
						.removeData(z)
						.parents().each(function(i, n) {
							var $n = $(n), 
								pos = $n.data(p);

							pos && $n.css('position', pos).removeData(p);
						});
				} else {

					m = $('body :visible:not(#'+this.id+'):not(#'+this.id+' *)').maxZIndex();

					this.workzone
						.addClass(c)
						.data(z, this.workzone.css('z-index'))
						.css('z-index', m > 0 ? m+1 : i || 'auto')

						.parents().each(function(i, n) {
							var $n = $(n),
								pos = $n.css('position');

							if (!/^(html|body)$/i.test(n.nodeName) && (pos == 'relative' || pos == 'absolute')) {
								$n.css('position', '').data(p, pos);
							}
						});
				}

				$(window).resize()
				this.resizable(f)
				this.trigger(f ? 'fullscreenoff' : 'fullscreenon');
				// this.fixMozillaCarret();

			}
			return this;
		}
		
		
		
		self.time('load');
		
		/**
		 * elRTE version number.
		 *
		 * @type String
		 */
		this.version = '2.0 dev';
		
		/**
		 * elRTE build date.
		 *
		 * @type String
		 */
		this.build = '20101215';
		
		/**
		 * Editor options
		 *
		 * @type Object
		 */
		this.options = o;
		
		/**
		 * Editor instance id
		 * Used for viewport id and as base part for documents ids
		 *
		 * @type String
		 */
		this.id = o.id || 'elrte-'+Math.round(Math.random()*1000000);
		
		/**
		 * Editor ui and messages language
		 * If set to "auto", editor try to detect browser language.
		 * If messages with required language does no exists - set to "en"
		 *
		 * @type String
		 * @default "auto"
		 */
		this.lang = (function() {
			var l = o.lang == 'auto' ? window.navigator.userLanguage || window.navigator.language : o.lang, 
				i = l.indexOf('-'), _l;
			
			if (i > 1) {
				l = l.substr(0, i)+'_'+l.substr(i+1).toUpperCase();
			}
			i = self.i18[l];
			return self.i18[i && i.dir && (i.dir == 'ltr' || i.dir == 'rtl') ? l : 'en'];
		})();
		
		/**
		 * Editor localized messages
		 * 
		 * @type Object
		 */
		this.messages = this.lang.messages || {};

		/**
		 * Is browser on Mac OS?
		 * 
		 * @type Boolean
		 */
		this.macos = navigator.userAgent.indexOf('Mac') != -1;
		
		/**
		 * Editor parent form
		 * Defines in load() function
		 * 
		 * @type jQuery
		 */
		this.form;
		
		/**
		 * Is xhtml doctype used for editable iframe?
		 * 
		 * @type Boolean
		 */
		this.xhtml = /xhtml/i.test(o.doctype);
		
		/**
		 * Active shortcuts
		 * 
		 * @type Object
		 */
		this.shortcuts = {};

		this.KEY_UNKNOWN = 0;
		this.KEY_CHAR    = 1;
		this.KEY_ENTER   = 2;
		this.KEY_DEL     = 3;
		this.KEY_TAB     = 4;
		this.KEY_ARROW   = 5;
		this.KEY_SERVICE = 6;

		this.lastKey = 0;
		this.typing  = false;
		/* cached change on keydown to rise change event after keyup */
		this.change = false;
		/* last opened document number */
		this.ndx = 0;
		this.counter = 0;
		/* opened documents */
		this.documents = { };
		/* active(visible) document */
		this.active    = null;
		/* events listeners */
		this.listeners = {
			/* called once after elRTE init and load documents */
			'load'      : [],
			/* called after editor will be set visible */
			'show'      : [],
			/* called after editor will be set hidden */
			'hide'      : [],
			// called on mousedown on editor interface
			editorfocus : [],
			// called on mousedown outside editor
			editorblur  : [],
			/* called on editor resize */
			'resize'    : [],
			/* called after new document added to editor */
			'open'      : [], 
			/* called after document switch to source mode */
			'source'    : [],
			/* called after document switch to wysiwyg mode */
			'wysiwyg'   : [],
			/* called before close document */
			'close'     : [],
			/* called before destroy editor instance */
			'destroy'   : [],
			/* called before command will be executed */
			'exec'      : [],
			/* called after some changes was made in document. */
			'change'    : [],
			/* called after change carret position */
			'changepos'  : [],
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
		 * Placeholders images base URL (see elRTE.filter.js)
		 * 
		 * @type String
		 */
		this.imgUrl = (function() {
			var n = $('<span class="elrte-test-url">test</span>').prependTo('body'),
			 	u = (n[0].currentStyle !== void(0) ? n[0].currentStyle['backgroundImage'] : document.defaultView.getComputedStyle(n[0], null).getPropertyValue('background-image'))
					.replace(/^url\((['"]?)([\s\S]+\/)[\s\S]+\1\)$/i, "$2");
			n.remove();
			return u;
		})();
		
		/**
		 * Object contains various utilits
		 * 
		 * @type Object
		 */	
		this.utils = new this.utils(this)
		
		/**
		 * DOM manipulations object
		 * 
		 * @type Object
		 */
		this.dom = new this.dom(this);
		
		/**
		 * Selection/text range manipulations object
		 * 
		 * @type Object
		 */
		this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);
		
		/**
		 * Ceaning content object
		 * 
		 * @type Object
		 */
		this.filter = new this.filter(this);
		
		/**
		 * History object
		 * 
		 * @type Object
		 */
		this.history = new this.history(this);
		
		/**
		 * Loaded commands
		 * 
		 * @type Object
		 */
		this._commands = (function(cp) {
			var _c = {}, c;

			$.each(o.presets[o.preset]||[], function(i, g) {
				$.each(o.commands[g]||[], function(i, n) {
					if ((c = self.commands[n]) && typeof(c) == 'function' && !_c[n]) {
						c.prototype = cp;
						_c[n] = new c();
						_c[n].name = n;
						_c[n].init(o.commandsConf[n]||{});
					}
				});
			});
			return _c;
		})(new this.command(this));
		
		/**
		 * Loaded plugins
		 * 
		 * @type Object
		 */
		this._plugins = (function() {
			var _p = {}, p;
			
			if ($.browser.mozilla) {
				o.plugins.unshift('gecko');
			} else if ($.browser.webkit) {
				o.plugins.unshift('webkit');
			} else if ($.browser.opera) {
				o.plugins.unshift('opera');
			}
			$.each(o.plugins, function(i, n) {
				if (typeof((p = self.plugins[n])) == 'function' && !_p[n]) {
					_p[n] = new p(self);
				}
			});
			return _p;
		})();

		// this.log(this._plugins)
		
		/**
		 * Widget. Displays tabs with documents names
		 * 
		 * @type jQuery
		 */
		this.tabsbar = this.ui.tabsbars[this.ui.tabsbars[o.tabsbar] ? o.tabsbar : 'default'](this);
		
		/**
		 * Widget. Displays various commands widgets
		 * 
		 * @type jQuery
		 */
		this.sidebar = this.ui.sidebars[this.ui.sidebars[o.sidebar] ? o.sidebar : 'default'](this);
		
		/**
		 * Widget. Displays status panel. Used by plugins (path etc.)
		 * 
		 * @type jQuery
		 */
		this.statusbar =  this.ui.statusbars[this.ui.statusbars[o.statusbar] ? o.statusbar : 'default'](this);
		
		/**
		 * Documents container
		 * 
		 * @type jQuery
		 */
		this.viewport  = $('<div class="elrte-workzone-"/>');
		
		/**
		 * Container for tabsbar & workzone.
		 * Required to correct display document and sidebar
		 * 
		 * @type jQuery
		 */
		this.main = $('<div class="ui-tabs ui-widget ui-widget-content ui-corner-all elrte-main"/>')
			.append(this.tabsbar.add(this.viewport));

		/**
		 * Container. Includes sidebar and main container
		 * 
		 * @type jQuery
		 */
		this.container = $('<div class="ui-helper-clearfix elrte-container"/>')
			.append(this.sidebar.add(this.main));

		/**
		 * Editor container.
		 * 
		 * @type jQuery
		 */
		this.workzone  = $('<div class="ui-helper-reset ui-helper-clearfix ui-widget ui-widget-content ui-corner-all elrte elrte-'+(this.lang.dir)+'" '+(o.cssClass||'')+'" id="'+this.id+'" role="application" />')
			.append(this.container.add(this.statusbar))
			.css({
				'min-width'  : minWidth+'px', 
				'min-height' : minHeight+'px',
				'width'      : width, 
				'height'     : height
			})
			.mousedown(function(e) {
				if (e.target.nodeName != 'TEXTAREA') {
					e.stopPropagation();
					e.preventDefault();
				}
				self.focus().trigger('editorfocus');
			});
		
		$(document.body).mousedown(function(e) {
			self.trigger('editorblur');
		})
		/**
		 * Toolbar widget.
		 * 
		 * @type jQuery
		 */
		this.toolbar = typeof(tb = this.ui.toolbars[o.toolbar]) == 'function'
			? tb(this).insertBefore(o.toolbarPosition == 'bottom' ? this.statusbar : this.container)
			: $('<div/>');
		
		// bind documents events handlers
		this
			.bind('open', function(e) {
				// focus opened doc if required
				(self.counter == 1 || o.focusOpenedDoc) && self.focus(e.data.id);
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
			
					if (self.lastKey == self.KEY_ENTER 
					||  self.lastKey == self.KEY_TAB 
					||  self.lastKey == self.KEY_DEL 
					|| (self.lastKey == self.KEY_CHAR && !self.selection.collapsed())) {
						self.trigger('exec');
						self.change = true;
					} 
				}
			}, true)
			.bind('keyup', function(e) {
				// e.stopPropagation()
				if (self.change) {
					self.trigger('change', {event : e});
				} else if (self.lastKey == self.KEY_ARROW) {
					self.trigger('changepos', {event : e});
				}
				self.typing  = self.lastKey == self.KEY_CHAR || self.lastKey == self.KEY_DEL;
				self.lastKey = 0;
				self.change  = false;
			}, true)
			.bind('mouseup', function(e) {
				self.lastKey = 0;
				self.typing = false;
				// click on selection not collapse it at a moment
				setTimeout(function() { self.trigger('changepos', {event : e}); }, 1);
			})
			.bind('cut', function(e) {
				setTimeout(function() { self.trigger('change'); }, 5);
			}, true)
			.bind('paste', function(e) {
				// paste handler
				if (!o.allowPaste) {
					// paste denied 
					e.stopPropagation();
					e.preventDefault();
				} else {
					// create sandbox for paste, clean it content and unwrap
					var dom = self.dom,
						sel = self.selection,
						filter = self.filter,
						a   = self.active,
						n = dom.create({name : 'div', css : {position : 'absolute', left : '-10000px',top : '0', width : '1px', height : '1px', overflow : 'hidden' }}),
						r = dom.createTextNode(' _ ')
						;

					n.appendChild(r);
					n = sel.deleteContents().insertNode(n);
					sel.select(n.firstChild);
					setTimeout(function() {
						if (n.parentNode && !r.parentNode) {
							// clean sandbox content
							$(n).html(filter.proccess('paste', $(n).html()));
							r = n.lastChild;
							dom.unwrap(n);
							if (r) {
								sel.select(r).collapse(false);
							}
						} else {
							// smth wrong - clean all doc
							n.parentNode && n.parentNode.removeChild(n);
							a.val(filter.wysiwyg(a.val()));
							sel.select(a.document.body).collapse(true);
						}
						self.trigger('change');
					}, 15);
				}
			}, true)
			.bind('dragstart dragend drop', function(e) {
				// disable drag&drop
				if (!o.allowDragAndDrop) {
					e.preventDefault();
					e.stopPropagation();
				} 
			}, true)
			.bind('drop', function(e) {
				self.trigger('change');
			}, true)
			// .bind('open close resize', function(e) {
			// 	// self.log('editor resize on '+e.type)
			// 	self.updateHeight()
			// });
		
		// bind user events handlers
		$.each(o.callbacks || {}, function(e, c) {
			self.bind(e, c);
		});
			
		/**
		 * Check target node is in DOM
		 *
		 * @return Boolean
		 **/
		function inDom() {
			return !!($node || self.viewport).parents('body').length;
 		}
		
		/**
		 * Attach viewport to DOM and load documents
		 *
		 * @return void
		 **/
		function load() {
			// if node is given - attach editor to DOM
			node && self.workzone.insertAfter(node);
			
			// bind to parent form submit events 
			self.form = self.workzone.parents('form').bind('submit', $.proxy(self.save, self));

			self.trigger('load', { elrte : self }).trigger('show');
				
			// self.log(self.workzone.css('width'))
			// self.log(self.workzone.width())
				
			// delete event "load" subscribers
			delete(self.listeners.load);

			// bind to window.resize to update tabs view
			$(window).resize(function() {
				// self.log('window resize')
				if (self.workzone.hasClass('elrte-fullscreen')) {
					var dw = self.workzone.outerWidth() - self.workzone.width(),
						dh = self.workzone.outerHeight() - self.workzone.height();

					self.workzone
						.width($(window).width()   - dw)
						.height($(window).height() - dh);
				}
				// fix viewport height on toolbar height change
				self.trigger('resize');
			});
			
			// add target node as document if enabled 
			node && o.loadTarget && o.documents.unshift(node);
			
			
			
			// open documents
			self.open(o.documents)
				.bind('open close resize', function(e) {
					self.updateHeight();
				}).trigger('resize')
				.timeEnd('load');
				
				
		}
		
		this.resizable(true);
		
		if (inDom()) {
			// node is in dom - attach editor to page and open documents,
			load();
		} else {
			// wait till node was attached to dom
			intr = setInterval(function() {
				if (inDom()) {
					clearInterval(intr);
					load();
				}
			}, 150);
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

	/**
	 * send message to console log if debug is enabled in config
	 *
	 * @param String  message group name
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
	 * elRTE commands mixins classes
	 *
	 */
	elRTE.prototype.mixins = {};
	
	/**
	 * elRTE ui
	 *
	 */
	elRTE.prototype.ui = {
		tabsbars : {
			'default' : function(rte) { return $('<ul/>').elrtetabsbar(rte); }
		},
		sidebars : {
			'default' : function(rte) { return $('<div/>').elrtesidebar(rte); }
		} ,
		statusbars : {
			'default' : function(rte) { return $('<div/>').elrtestatusbar(rte); }
		},
		toolbars : { 
			'default' : function(rte) {
				return $('<div/>').elrtetoolbar(rte);
			}
		}, 
		dialog : function(n, o) {
			return $(n).addClass('elrte-dialog').dialog(o)
		},
		dialogs : {
			
			color : function(rte, o) {
				return $('<div/>').elrtecolordialog(rte, o).dialog(o);
			}
		},
		cmdui : {
			button : function(cmd) {
				return $('<div/>').elrtebutton(cmd);
			},
			menu : function(cmd) {
				return $('<div/>').elrtemenubutton(cmd);
			},
			color : function(cmd) {
				return $('<div/>').elrtecolorbutton(cmd);
			}
		} 
	};	

	// elRTE.CSS_CLASS_ACTIVE    = 'ui-state-active';
	// elRTE.CSS_CLASS_DISABLED  = 'ui-state-disabled'
	// elRTE.CSS_CLASS_HOVER     = 'ui-state-hover';
	// elRTE.CSS_CLASS_HIGHLIGHT = 'ui-state-hover';

	elRTE.CMD_STATE_DISABLED = 0;
	elRTE.CMD_STATE_ENABLED  = 1;
	elRTE.CMD_STATE_ACTIVE   = 2;
	
	// elRTE.BUTTON_CLASS = 'elrte-btn';
	// elRTE.MENU_BUTTON_CLASS = 'elrte-btn-menu';
	
	/**
	 * elRTE i18n data
	 *
	 * @type Object
	 */
	elRTE.prototype.i18 = {
		en : {
			code     : 'en',
			name     : 'English',
			dir      : 'ltr',
			messages : { }
		}
	}
	

})(jQuery);