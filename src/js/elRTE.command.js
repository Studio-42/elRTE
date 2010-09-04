(function($) {
	// @TODO - autobind cmd shortcut
	elRTE.prototype.command = function(rte) {
		
		/* short command description for button title */
		this.title = '';
		/* editor instance */
		this.rte = rte;
		/* editor DOM object */
		this.dom = rte.dom;
		/* editor selection object */
		this.sel = rte.selection;
		
		
		this.STATE_DISABLE = 0;
		this.STATE_ENABLE = 1;
		this.STATE_ACTIVE = 2;
		
		this._dClass = 'elrte-ui-disabled';
		this._aClass = 'elrte-ui-active';
		this._hClass = 'elrte-ui-hover';
		/* button/menu or other ui element placed on toolbar */
		this._ui;
		this._state = 0;
		
		this.bind = function() {
			var self = this;
			
			this.rte.bind('wysiwyg', function() {
				self._setState();
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._setState(self.STATE_DISABLE);
			}).bind('change changePos', function() {
				self._state>0 && self._setState();
			});
		}
		
		this.state = function() {
			return this._state;
		}
		
		this.ui = function() {
			return this._ui||this._createUI();
		}
		
		this.exec = function() {
			// this.rte.log('exec')
			return !!(this._state && this.rte.trigger('exec', {cmd : this.name}) && this._exec() && this.rte.trigger('change'));
		}
		
		this._exec = function() {
			
		}
		
		this._setState = function(s) {
			this._state = s === void(0) ? this._getState() : s;
			this._ui && this._updateUI();
		}
		
		this._getState = function() {
			return this.STATE_DISABLE;
		}
		
		this._createUI = function() {
			var self = this;
			return this._ui = $('<li class="elrte-ib elrte-ui-button elrte-ui-'+this.name+' '+this._dClass+'" title="'+this.title+'" />')
				.mousedown(function(e) {
					e.preventDefault();
					e.stopPropagation();
					self.rte.focus();
					self._state>0 && self.exec();
				})
				.hover(function(e) {
					$(this).toggleClass(self._hClass, e.type == 'mouseenter' && self._state>0);
				});
		}
		
		this._updateUI = function() {
			if (this._ui) {
				switch (this._state) {
					case this.STATE_DISABLE : this._ui.removeClass(this._aClass).addClass(this._dClass); break;
					case this.STATE_ENABLE  : this._ui.removeClass(this._aClass+' '+this._dClass);       break;
					case this.STATE_ACTIVE  : this._ui.removeClass(this._dClass).addClass(this._aClass); break;
				}
			}
		}
		
	}
	
	/**
	 * @class abstract class for any text element.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands._textElement = {
		/**
		 * Check node for required name or css propery
		 *
		 * @param  DOMElement  tested node
		 * @return Boolean
		 **/
		test : function(n) {
			return n.nodeType == 1 && (this.regExp.test(n.nodeName) || (this.cssProp ? this.dom.css(n, this.cssProp) == this.cssVal : true));
		},
		
		/**
		 * Return current command state
		 *
		 * @return Number
		 **/
		getState : function() {
			return this.dom.testSelection(this.test) ? this.STATE_ACTIVE : this.STATE_ENABLE;
		},
		
		/**
		 * Unwrap nodes
		 *
		 * @param  Array  nodes for unwrap
		 * @return void
		 **/
		unwrap : function(n) {
			var d = this.dom;
			if (this.regExp.test(n.nodeName)) {
				d.unwrap(n);
			} else {
				$(n).css(this.cssProp, '');
				d.is(n, 'empty') && d.is(n, 'inline') && d.unwrap(n);
			}
		},
		
		/**
		 * Wrap nodes
		 *
		 * @param  Array  nodes unwrap
		 * @return void
		 **/
		wrap : function(n) {
			var self = this, 
				d = this.dom,
				p = this.cssProp,
				v = self.cssVal,
				w = [];
			
			function wrap() {
				d.filter(w, self.testWrap||'notEmpty').length && $(d.wrap(w, { name : 'span' })).css(p, v);
				w = [];
			}
			
			if ((this.rte.options.styleWithCss || !this.node) && p) {
				
				$.each(n, function(i, n) {
					if (d.is(n, 'textElement')) {
						$(n).css(p, v);
					} else if (self.acceptWrap(n)) {
						w.length && !d.isSiblings(n, w[w.length-1]) && wrap();
						w.push(n);
					}
				});
				wrap();
			} else {
				d.wrap(n, this.node);
			}
			
		},
		
		/**
		 * Return true if node contents must be wrapped
		 *
		 * @param  DOMElement  node
		 * @return Boolean
		 **/
		innerWrap : function(n) {
			return this.rte.options.styleWithCss || !this.node ? false : this.dom.is(n, 'block');
		},
		
		/**
		 * Return true if node accepted for wrap (outer or inner)
		 *
		 * @param  DOMElement  node
		 * @return Boolean
		 **/
		acceptWrap : function(n) {
			return this.dom.is(n, 'text') || (n.nodeName != 'IMG' && this.dom.is(n, 'inline'));
		},
		
		/**
		 * Wrap/unwrap selection
		 *
		 * @return void
		 **/
		exec : function() {
			var self = this,
				s = this.sel,
				d = this.dom,
			 	c = s.collapsed(), 
				n = s.node(), p, b;
			
			if (this._state == this.STATE_ACTIVE) {
				if (c) {
					b = s.bookmark();
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
					n = d.smartUnwrap(s.get(true), this.test, 'inline', this.unwrap);
					s.select(n[0], n[1]);
				}
			} else {
				if (c) {
					s.surroundContents(d.create(this.node));
				} else {
					n = s.get();
					d.smartWrap(n, this.acceptWrap, this.innerWrap||'block', this.wrap, this.testWrap||'notEmpty');
					s.select(n[0], n[n.length-1]);
				}
			}
			return true;
		}
		
	}
	
})(jQuery);