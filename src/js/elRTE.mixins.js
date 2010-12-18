	/**
	 * Collection of mixin methods for text elements.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.mixins.textElement = {
		
		/**
		 * Init object based on rte.options.styleWithCss
		 *
		 * @return void
		 **/
		init : function() {
			var p = this.cssProp,
				v = this.cssVal;
				
			this.useCss = (this.rte.options.styleWithCss && p && v) || !this.nodeName;
			if (this.useCss) {
				this.node = { name : 'span', css : {} };
				this.node.css[p] = v;
			} else {
				this.node = this.nodeName;
			}
		},
		
		/**
		 * Check node by required name or css propery
		 *
		 * @param  DOMElement  tested node
		 * @return Boolean
		 **/
		test : function(n) {
			return n.nodeType == 1 && (this.regExp.test(n.nodeName) || (this.cssProp ? this.dom.css(n, this.cssProp) == this.cssVal : false));
		},
		
		/**
		 * Return current command state
		 *
		 * @return Number
		 **/
		state : function() {
			return this.dom.testSelection(this.test) ? elRTE.CMD_STATE_ACTIVE : elRTE.CMD_STATE_ENABLED;
		},
		
		/**
		 * Unwrap nodes
		 *
		 * @param  Array  nodes for unwrap
		 * @return void
		 **/
		unwrap : function(n) {
			var d = this.dom,
				p = this.cssProp;
			if (this.regExp.test(n.nodeName)) {
				d.unwrap(n);
			} else if (p) {
				$(n).css(p, '');
				if ((d.is(n, 'empty') && d.is(n, 'inline')) || d.is(n, 'emptySpan')) {
					d.unwrap(n);
				}
				// d.is(n, 'empty') && d.is(n, 'inline') && d.unwrap(n);
			}
		},
		
		/**
		 * Wrap nodes
		 *
		 * @param  Array  nodes for unwrap
		 * @return void
		 **/
		wrap : function(n) {
			this.dom.wrap(n, this.node);
		},
		
		/**
		 * Wrap/unwrap selection
		 *
		 * @return Boolean
		 **/
		exec : function() {
			var self = this,
				s = this.sel,
				d = this.dom,
			 	c = s.collapsed(), 
				b = s.bookmark(),
				n = s.node(), p, o;

			if (this.state == elRTE.CMD_STATE_ACTIVE) {
				if (c) {
					p = b[1].parentNode;
					if (d.is(p, this.test) && d.is(b[1], 'last')) {
						s.rmBookmark(b).selectNext(p, true); 
					} else {
						$.each(d.parents(n, this.test, true), function(i, n) {
							self.unwrap(n);
						});
						s.toBookmark(b);
					}
				} else {
					var o = {
						accept : self.test,
						unwrap : self.unwrap
					}
					d.smartUnwrap(s.get(true), o);
					s.toBookmark(b);
				}
			} else {
				if (c) {
					s.surroundContents(d.create(this.node));
				} else {
					n = s.get();
					o = { wrap : self.wrap };
					if (this.useCss) {
						o.inner   = false;
						o.testCss = 'textElement';
						o.setCss  = function(n) { $(n).css(self.cssProp, self.cssVal).find('*').css(self.cssProp, ''); };
					}
					d.smartWrap(n, o);
				}
				s.toBookmark(b);
			}
			return true;
		}
	}

	/**
	 * Common methods for align text commands
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.mixins.blockTextElement = {
		/**
		 * Return current command state
		 *
		 * @return Number
		 **/
		state : function() {
			return this.sel.collapsed() 
				? this.dom.closestParent(this.sel.node(), this._regExp, true) ? this.STATE_ACTIVE : this.STATE_DISABLE
				: this.STATE_ENABLE;
		},
		
		/**
		 * Wrap/unwrap selection
		 *
		 * @return Boolean
		 **/
		exec : function() {
			var dom = this.dom,
				sel = this.sel, 
				n, bm,
				f, l, c, s, e;
				
			if (sel.collapsed() && (n = dom.closestParent(sel.node(), this._regExp, true))) {
				bm = sel.bookmark();
				dom.unwrap(n);
				sel.toBookmark(bm);
			} else {
				n = sel.get(true);
				f = n[0];
				l = n[n.length-1];
				c = dom.commonAncestor(f, l)

				if ((s = dom.topParent(f, this._cutRegExp)) || (e = dom.topParent(l, this._cutRegExp))) {
					if (s) {
						f = dom.split(s, f, true);
					}
					if (e) {
						l = dom.split(e, l, false);
					}
					c = dom.commonAncestor(f, l);
				}
				
				s = dom.topParent(f, 'any', true, c)||f;
				e = dom.topParent(l, 'any', true, c)||l;
				s = dom.split(s, f, true);
				e = dom.split(e, l, false);
				n = dom.wrap(dom.traverse(s, e), this._node);
				sel.select(n);
			}
			return true;
		}
	}


	/**
	 * Common methods for align text commands
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.mixins.alignment = {
		/**
		 * Return current command state
		 *
		 * @return Number
		 **/
		state : function() {
			var dom = this.dom,
				n = dom.closestParent(this.sel.node(), function(n) { return dom.is(n, 'blockText') && $(n).css('text-align'); }, true);
			return $(n).css('text-align') == this._val ? elRTE.CMD_STATE_ACTIVE : elRTE.CMD_STATE_ENABLED;
		},
		
		/**
		 * Align text
		 *
		 * @return Boolean
		 **/
		exec : function() {
			var	sel  = this.sel,
				dom  = this.dom,
				b    = sel.bookmark(),
				n    = sel.collapsed() ? [sel.node()] : sel.get(), 
				v    = this._val,
				f    = n[0], 
				l    = n[n.length-1],
				s, e, o;
				
			if (!(s = dom.closestParent(f, 'blockText', true))) {
				s = dom.topParent(f, 'inline', true);
				s = [s].concat(dom.prevUntil(s, 'any', 'block')).pop();
			}

			if (!(e = dom.closestParent(l, 'blockText', true))) {
				e = dom.topParent(l, 'inline', true);
				e = [e].concat(dom.nextUntil(e, 'any', 'block')).pop();
			}
			n = dom.traverse(s, e);
			$.each(n, function() {
				$(this).find('*').css('text-align', '');
			});
			o = { 
				accept  : 'any', 
				wrap    : function(n) { dom.wrap(n, { name : dom.topParent(n[0], 'blockText') ? 'div' : 'p', css : { 'text-align' : v } }); }, 
				inner   : false, 
				testCss : 'blockText', 
				setCss  : function(n) { $(n).css('text-align', v); } 
			};
			dom.smartWrap(n, o);
			sel.toBookmark(b);
			return true;
		}
	}

	/**
	 * Common methods for ltr/rtl classes 
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.mixins.direction = {
		test : function(n) {
			return this.regExp.test(n.nodeName) && $(n).attr('dir') == this.node.attr.dir;
		},
		
		wrap : function(n) {
			var dom = this.dom;
			$(dom.wrap(n, this.node)).find('bdo').each(function() { dom.unwrap(this); })
		}
	}
	
	/**
	 * Common methods for fontsize and fontfamily classes
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.mixins.font = {
		/**
		 * Return true if node has required css property
		 * @param  DOMElement  
		 * @return Boolean
		 **/
		test : function(n) {
			return this.dom.css(n, this.css);
		},
		
		/**
		 * Remove required css property 
		 * @param  DOMElement  
		 * @return void
		 **/
		unwrap : function(n) {
			$(n).css(this.css, ''); 
			if (this.dom.is(n, 'emptySpan')) {
				this.dom.unwrap(n);
			} 
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
				css  = this.css,
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
				} else if ((n = dom.closestParent(sel.node(), this.test, true))) {
					this.unwrap(n);
				}
			} else {
				// unwrap all childs with font-size
				o = {
					accept : this.test,
					unwrap : this.unwrap
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
			return true;
		},
		
		/**
		 * Check parents node for required css property
		 * and update ui
		 * 
		 * @return Boolean
		 **/
		update : function() {
			var dom = this.dom,
				n   = dom.closestParent(this.sel.node(), this.test, true);

			this._val = this._parseVal(dom.css(n, this.css));
		}
		
	}
	
	
	/**
	 * Common methods for lists commands
	 * @TODO - andavnced interface - list-style selection
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.mixins.list = {
		
		exec : function() {
			this.rte.active.document.execCommand(this.name == 'ul' ? 'insertunorderedlist' : 'insertorderedlist', false, null);
			return true;
		},
		
		state : function() {
			var self = this;
			return this.dom.closestParent(this.sel.node(), function(n) { return n.nodeName == self.name.toUpperCase(); }, true) ? elRTE.CMD_STATE_ACTIVE : elRTE.CMD_STATE_ENABLED;
		}
	}
	
	
