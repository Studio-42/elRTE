(function($) {
	/**
	 * @class Commands prototype
	 * Initilize by editor instance
	 * @param  elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.command = function(rte) {
		/* short command description for button title */
		this.title = '';
		/* editor instance */
		this.rte = rte;
		/* editor DOM object */
		this.dom = rte.dom;
		/* editor selection object */
		this.sel = rte.selection;
		// class "constants" - command states
		this.STATE_DISABLE = 0;
		this.STATE_ENABLE = 1;
		this.STATE_ACTIVE = 2;
		// ui class for disabled command
		this._dClass = 'elrte-ui-disabled';
		// ui class for active command
		this._aClass = 'elrte-ui-active';
		// class for hovered ui
		this._hClass = 'elrte-ui-hover';
		/* button/menu or other ui element placed on toolbar */
		this._ui;
		// currents command state
		this._state = 0;
		
		/**
		 * Bind to editor events
		 * By default, command listen "wysiwyg", "close" and "source" to switch between enable/disable states
		 * and "change" and "changePos" events to switch between enable/active states
		 *
		 * @return void
		 */
		this.bind = function() {
			var self = this;
			
			this.rte.bind('wysiwyg', function() {
				self._setState();
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._setState(self.STATE_DISABLE);
			}).bind('change changePos', function() {
				// self._state>0 && 
				self._setState();
			});
		}
		
		/**
		 * Return current command state
		 *
		 * @return Number
		 */
		this.state = function() {
			return this._state;
		}
		
		/**
		 * Create ui if not exists and return it
		 *
		 * @return jQuery
		 */
		this.ui = function() {
			return this._ui||this._createUI();
		}
		
		/**
		 * Exec command if possible and return if execed
		 *
		 * @return Boolean
		 */
		this.exec = function() {
			return !!(this._state && this.rte.trigger('exec', {cmd : this.name}) && this._exec() && this.rte.trigger('change'));
		}
		
		/**
		 * Abstact method to real command action
		 *
		 * @return Boolean
		 */
		this._exec = function() {
			
		}
		
		/**
		 * Set command state
		 * Should not be called from outside
		 *
		 * @param  Number  command state. If not set - command check it's state and set
		 * @return void
		 */
		this._setState = function(s) {
			this._state = s === void(0) ? this._getState() : s;
			this._ui && this._updateUI();
		}
		
		/**
		 * Check command state and return it
		 *
		 * @return Number
		 */
		this._getState = function() {
			return this.STATE_DISABLE;
		}
		
		/**
		 * Create ui (by default- simple button) and return it
		 *
		 * @return jQuery
		 */
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
		
		/**
		 * Update ui classes based on current state
		 *
		 * @return void
		 */
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
	 * Collection of mixin methods for text elements.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands._textElement = {
		
		init : function() {
			this.useCss = (this.rte.options.styleWithCss && this.cssProp && this.cssVal) || !this.nodeName;
			if (this.useCss) {
				this.node = { name : 'span', css : {}};
				this.node.css[this.cssProp] = this.cssVal;
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
			var d = this.dom,
				p = this.cssProp;
			if (this.regExp.test(n.nodeName)) {
				d.unwrap(n);
			} else if (p) {
				$(n).css(p, '');
				d.is(n, 'empty') && d.is(n, 'inline') && d.unwrap(n);
			}
		},
		
		wrap : function(n) {
			this.dom.wrap(n, this.node);
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
				n = s.node(), p, o, b = s.bookmark();

			if (this._state == this.STATE_ACTIVE) {
				if (c) {
					// b = s.bookmark();
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
					// s.select(n[0], n[1]);
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
					// s.select(n[0], n[n.length-1]);
					
				}
				s.toBookmark(b);
			}
			return true;
		}
		
	}
	
})(jQuery);