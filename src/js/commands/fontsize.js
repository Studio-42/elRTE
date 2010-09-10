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
				o = {
					name     : this.name,
					label    : rte.i18n(this.title),
					callback : $.proxy(this.exec, this),
					vars     : {}
				};
			
			$.each(this._opts, function(v, l) {
				o.vars[v] = { 
					label : rte.i18n(l), 
					style : v ? css+': '+v : ''
				};
			});
			this._menu = new this.rte.ui.menu(o, rte);
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
			this._menu.set((this._val = this._parseVal(dom.css(n, css))));
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
			''         : 'Default',
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
			''                                              : this.rte.i18n('Default'),
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
		 * and return closets font set
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
	
})(jQuery);