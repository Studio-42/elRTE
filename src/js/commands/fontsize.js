(function($) {
	
	/**
	 * Common methods for fontsize and fontfamily classes
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands._font = {
		
		/**
		 * Create command menu and return command ui
		 * @return jQuery
		 **/
		ui : function() {
			var rte = this.rte,
				css = this._css,
				conf = {
					name     : this.name,
					label    : rte.i18n(this.title),
					callback : $.proxy(this.exec, this),
					opts     : {}
				};
			
			$.each(this._opts, function(v, l) {
				conf.opts[v] = { 
					label : rte.i18n(l), 
					style : v != 'default' ? css+': '+v : ''
				};
			});
			this._menu = new this.rte.ui.menu(conf, rte);
			return this._ui = this._menu.ui;
		},
		
		/**
		 * Set css property to selected text
		 * @param  String  css property value
		 * @return Boolean
		 **/
		exec : function(v) {
			var self = this,
				dom  = this.dom,
				sel  = this.sel,
				css  = this._css,
				c    = sel.collapsed(),
				node = { name : 'span', css : {} },
				b, n, o;
				
			if (v == 'default') {
				v = '';
			}
				
			// not doubled current font-size
			if (v == this.val && v != '') {
				return false;
			}
			node.css[css] = v;
			b = sel.bookmark();
			
			if (c) {
				if (this._val && (n = b[1].parentNode) && dom.is(b[1], 'last') && dom.css(n, css)) {
					// if carrent is at the end of node with font-size (after typing) - move carret outside
					b = sel.rmBookmark(b).selectNext(n, true).bookmark();
				}
				if (v) {
					// surround carret with node
					sel.toBookmark(b).surroundContents(dom.create(node));
					b = sel.bookmark();
				} 
			} else {
				// unwrap all childs with font-size
				o = {
					accept : function(n) { return dom.css(n, css); },
					unwrap : function(n) { $(n).css(css, ''); dom.is(n, 'emptySpan') && dom.unwrap(n); }
				}
				dom.smartUnwrap(sel.get(true), o);

				b = sel.toBookmark(b).bookmark();
				// wrap nodes
				if (v) {
					o = { 
						wrap    : function(n) { dom.wrap(n, node); }, 
						inner   : false,
						testCss : 'textElement',
						setCss  : function(n) { $(n).css(css, v); }
					};
					dom.smartWrap(sel.get(), o);
				}
			}
			sel.toBookmark(b);
			setTimeout(function() { self._menu.set(v); }, 2);
			return true;
		},
		
		/**
		 * Check parents node for required css property
		 * and update ui
		 * 
		 * @return Boolean
		 **/
		val : function() {
			var dom = this.dom,
				css = this._css,
				n = dom.closestParent(this.sel.node(), function(n) { return dom.css(n, css) }, true);

			this._val = this._parseVal(dom.css(n, css));
			this._menu.set([this._val]);
		}
		
	}
	
	/**
	 * @class elRTE command.
	 * Change font size
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.fontsize = function() {
		this.title = 'Font size';
		this._val  = '';
		this._css  = 'font-size';
		this._opts = {
			'default'  : 'Default',
			'xx-small' : 'Small (8pt)',
			'x-small'  : 'Small (10pt)',
			'small'    : 'Small (12pt)',
			'medium'   : 'Normal (14pt)',
			'large'    : 'Large (18pt)',
			'x-large'  : 'Large (24pt)',
			'xx-large' : 'Large (36pt)'
		};
		
		this._exec = $.proxy(elRTE.prototype.commands._font.exec, this);
		
		this._createUI = $.proxy(elRTE.prototype.commands._font.ui, this);
		
		this._setVal = $.proxy(elRTE.prototype.commands._font.val, this);
		
		/**
		 * Translate font-size in px|pt|% into absolute value
		 * 
		 * @param  String  css font-size value
		 * @return String
		 **/
		this._parseVal = function(v) {
			var x = 100;
			
			function size2abs(s) {
				var x = 100;
				if (s.indexOf('pt') != -1) {
					x = 12;
				} else if (s.indexOf('px') != -1) {
					x = 16;
				} else if (s.indexOf('em') != -1) {
					x = 1;
				}
				s = Math.round((100*parseFloat(s, 1)/x)/10)*10;
				
				if (s > 0) {
					if (s <= 70) {
						return 'xx-small';
					}
					if (s <= 80) {
						return 'x-small';
					}
					if (s <= 100) {
						return 'small';
					}
					if (s <= 120) {
						return 'medium';
					}
					if (s <= 150) {
						return 'large';
					}
					if (s <= 200) {
						return 'x-large';
					}
					if (s > 200) {
						return 'xx-large';
					}
				}
				
				return '';
			}
			
			return this._opts[v] ? v : size2abs(v);
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	
	/**
	 * @class elRTE command.
	 * Change font family
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.fontfamily = function() {
		this.title = 'Font family';
		this._val  = '';
		this._css  = 'font-family';
		this._opts = {
			'default'                                       : this.rte.i18n('Default'),
			'andale mono,sans-serif'                        : 'Andale Mono',
			'arial,helvetica,sans-serif'                    : 'Arial',
			'arial black,gadget,sans-serif'                 : 'Arial Black',
			'book antiqua,palatino,sans-serif'              : 'Book Antiqua',
			'comic sans ms,cursive'                         : 'Comic Sans MS',
			'courier new,courier,monospace'                 : 'Courier New',
			'georgia,palatino,serif'                        : 'Georgia',
			'helvetica,sans-serif'                          : 'Helvetica',
			'impact,sans-serif'                             : 'Impact',
			'lucida console,monaco,monospace'               : 'Lucida console',
			'lucida sans unicode,lucida grande,sans-serif'  : 'Lucida grande',
			'tahoma,sans-serif'                             : 'Tahoma',
			'times new roman,times,serif'                   : 'Times New Roman',
			'trebuchet ms,lucida grande,verdana,sans-serif' : 'Trebuchet MS',
			'verdana,geneva,sans-serif'                     : 'Verdana'
		}
		
		this._fonts = [
			{ regexp : /andale/i,                    name : 'andale mono,sans-serif' },
			{ regexp : /arial,/i,                    name : 'arial,helvetica,sans-serif' },
			{ regexp : /(arial\s+black|gadget)/i,    name : 'arial black,gadget,sans-serif' },
			{ regexp : /(book\s+antiqua)/i,          name : 'book antiqua,palatino,sans-serif' },
			{ regexp : /comic\s+sans/i,              name : 'comic sans ms,cursive' },
			{ regexp : /courier/i,                   name : 'courier new,courier,monospace' },
			{ regexp : /georgia/i,                   name : 'georgia,palatino,serif' },
			{ regexp : /impact/i,                    name : 'impact,sans-serif' },
			{ regexp : /(lucida\s+console|monaco)/i, name : 'lucida console,monaco,monospace' },
			{ regexp : /lucida\s+sans/i,             name : 'lucida sans unicode,lucida grande,sans-serif' },
			{ regexp : /times/i,                     name : 'times new roman,times,serif' },
			{ regexp : /tahoma/i,                    name : 'tahoma,sans-serif' },
			{ regexp : /trebuchet/i,                 name : 'trebuchet ms,lucida grande,verdana,sans-serif' },
			{ regexp : /verdana/i,                   name : 'verdana,geneva,sans-serif' },
			{ regexp : /palatino/i,                  name : 'book antiqua,palatino,sans-serif' },
			{ regexp : /helvetica/i,                 name : 'helvetica,sans-serif' },
			{ regexp : /lucida grande/i,             name : 'trebuchet ms,lucida grande,verdana,sans-serif' },
			{ regexp : /,serif/i,                    name : 'times new roman,times,serif' },
			{ regexp : /sans-serif/i,                name : 'arial,helvetica,sans-serif' },
			{ regexp : /monospace/i,                 name : 'courier new,courier,monospace' },
			{ regexp : /cursive/i,                   name : 'comic sans ms,cursive' },
		].reverse();
		
		this._exec = $.proxy(elRTE.prototype.commands._font.exec, this);
		
		this._createUI = $.proxy(elRTE.prototype.commands._font.ui, this);
		
		this._setVal = $.proxy(elRTE.prototype.commands._font.val, this);
		
		/**
		 * Check given css font-family property for known fonts
		 * and return closests font set
		 * 
		 * @param  String  css font-family value
		 * @return String
		 **/
		this._parseVal = function(v) {
			var l, f;
			
			v = $.trim(v);
			if (v.length) {
				v = ','+v.replace(/'|"/g, '').replace(/\s*,\s*/g, ',')+',';
				l = this._fonts.length;
				while (l--) {
					f = this._fonts[l];
					if (f.regexp.test(v)) {
						return f.name;
					}
				}
			}
			return '';
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
		
	}
	
	elRTE.prototype.commands.fontstyle = function() {
		var self= this, o = this.rte.commandConf('fontstyle', 'opts'), n, l, s;
		this.title = 'Style';
		this._val  = [];
		this._disabled = [];
		this._opts = {};
		
		$.each(o, function(i, o) {
			s = o.selector;
			n = 'style'+i;
			self._opts[n] = o;
			if (typeof(s) == 'string' && !self.dom.filters[s]) {
				self._opts[n].selector = (function(s) { return function(n) { return $(n).is(s); } })(s);
			}
		});
		
		
		// this.rte.log(this._opts)
		
		this._exec = function(v) {
			var self = this,
				dom  = this.dom,
				sel  = this.sel,
				b    =  sel.bookmark(),
				c    = sel.collapsed(),
				opts = this._opts,
				o    = opts[v] && $.inArray(v, this._disabled) == -1 ? opts[v] : false,
				selector, cssClass, n, o;

			if (!o) {
				return false;
			}

			selector = o.selector;
			cssClass = o['class'];

			function test(n) {
				return dom.is(n, selector) && $(n).hasClass(cssClass);
			}

			function unwrap(n) {
				$(n).removeClass(cssClass); 
				dom.is(n, 'emptySpan') && dom.unwrap(n);
			}

			function setClass(n) {
				$(n).addClass(cssClass);
			}

			if ($.inArray(v, this._val) != -1) {
				// rmove class from parents nodes
				$.each(dom.filter(dom.parents(sel.node(), 'element'), test, true), function(i, n) {
					unwrap(n);
				});
				// remove class from child
				!c && dom.smartUnwrap(sel.get(true), { accept : test, unwrap : unwrap });
			} else if (o.inline) {
				// set class for inline nodes if selection expanded
				!c && dom.smartWrap(sel.get(true), { testCss : selector, setCss : setClass, wrap : function(n) { dom.wrap(n, { name : 'span', attr : { 'class' : cssClass } }) } }); 
			} else  {
				// set class for block parent node
				n = dom.closestParent(sel.node(), selector, true);
				if (n) {
					$(n).addClass(cssClass);
				} else {
					$.each(sel.get(true), function(i, n) {
						if (dom.is(n, selector)) {
							$(n).addClass(cssClass);
						} else {
							$.each(dom.closest(n, selector), function(i, n) {
								$(n).addClass(cssClass);
							});
						}
					});
				}
			}
			sel.toBookmark(b);
			return true;
		}
		
		this._createUI = function() {
			if (this._opts) {
				var self = this,
					conf = {
						name     : this.name,
						label    : this.rte.i18n(this.title),
						callback : $.proxy(this.exec, this),
						opts     : { 'reset' : { label : this.rte.i18n('Reset styles') }}
						
					};
				
				$.each(this._opts, function(c, v) {
					conf.opts[c] = {
						label : v.label,
						tag   : 'span',
						style : v.style
					}
				});
				
				this._menu = new this.rte.ui.menu(conf, this.rte);
				return this._ui = this._menu.ui;
			}
		}
		
		this._setVal = function() {
			var 
				self= this,
				dom = this.dom,
				sel = this.sel,
				opts = this._opts,
				accepted = {}, val = {}, n, ch;
			
			this._val = [];
			this._disabled = [];
			
			$.each(dom.parents(sel.node(), 'element', true), function(i, n) {
				$.each(opts, function(i, o) {
					if (dom.is(n, o.selector)) {
						accepted[i] = true;
						if ($(n).hasClass(o['class'])) {
							val[i] = true;
						}
					}
				})
			});
			
			if (!sel.collapsed()) {
				n = dom.filter(sel.cloneContents().childNodes, 'element');
				
				$.each(opts, function(i, o) {
					if (!val[i]) {
						// self.rte.log('check '+i);
						
						$.each(n, function(j, n) {
							if (dom.is(n, o.selector)) {
								accepted[i] = true;
								if ($(n).hasClass(o['class'])) {
									val[i] = true;
									return false;
								}
							} else if ((ch = dom.closest(n, o.selector)).length) {
								accepted[i] = true;
								$.each(ch, function(k, n) {
									if ($(n).hasClass(o['class'])) {
										val[i] = true;
										return false;
									}
								});
							}
						});
					}
				});
			}
			
			// this.rte.log(accepted);
			// this.rte.log(val)
			
			$.each(val, function(i) {
				self._val.push(i)
			});
			
			$.each(opts, function(i, o) {
				if (!accepted[i] && !(o.inline && !self.sel.collapsed())) {
					self._disabled.push(i)
				}
			})
			this._menu.set(this._val, this._disabled);
			return;

		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
		
	}
	
	
})(jQuery);