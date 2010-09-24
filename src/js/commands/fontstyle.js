/**
 * @class elRTE command.
 * Apply user defined css classes
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.fontstyle = function() {
	var enable = false
	this.title     = 'Styles';
	this.conf   = { widget : 'styleslist' };

	this._val      = [];
	this._disabled = [];
	this.opts = {};
	this._selectors = {}
	this.opts = [];	
	
	/**
	 * Create options and selectors lists
	 * 
	 * @return void
	 **/
	this._onInit = function() {
		var o = this.conf.opts||[], 
			l = o.length,
			i, r, e;

		
		while (l--) {
			r = o[l];
			r.element = r.element.toLowerCase();
			e = r.element;
			
			if (r.name && e) {
				if (/^(ol|ul)$/.test(e)) {
					r.type = 'list'
				} else if (/^(img|hr|embed)$/.test(e)) {
					r.type = 'obj';
				} else if (/^(table|tr|th|td)$/.test(e)) {
					r.type = 'table';
				} else if (/^(address|blockquote|caption|dd|dir|div|dl|dt|fieldset|form|h[1-6]|li|menu|p|pre)$/.test(e)) {
					r.type = 'block'
				} else if (r['class'] || e != 'span') {
					r.type = 'inline';
				}
				
				if (r.type) {
					this.opts.unshift(r)
				}
			}
			
		}
		// this.rte.log(this.opts)
	}
	
	this._exec = function(v) {
		var self = this,
			dom  = this.dom,
			sel  = this.sel,
			exp  = !sel.collapsed(),
			// b    =  sel.bookmark(),
			opts = this._opts,
			// o    = opts[v] && $.inArray(v, this._disabled) == -1 ? opts[v] : false,
			selector, cssClass, n, o;

		this.rte.log(v)
		this.rte.log(this.opts[v])
		return false

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
			// remove class from parents nodes
			$.each(dom.filter(dom.parents(sel.node(), 'element', true), test), function(i, n) {
				unwrap(n);
			});
			// remove class from child
			exp && dom.smartUnwrap(sel.get(true), { accept : test, unwrap : unwrap });
		} else if (o.inline) {
			// set class for inline nodes if selection expanded
			exp && dom.smartWrap(sel.get(true), { testCss : selector, setCss : setClass, wrap : function(n) { dom.wrap(n, { name : 'span', attr : { 'class' : cssClass } }) } }); 
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
	
	this._updValue_ = function() {
		var self= this,
			dom = this.dom,
			sel = this.sel,
			selectors = this._selectors;

		this._val = [];
		this._disabled = [];
		
		this.rte.log(selectors)
		
		$.each(dom.parents(sel.node(), 'element', true), function(i, n) {
			$.each(selectors, function() {
				var s = this.selector,
					c = this['class'];
			})
		})
		
	}
	
	this._updValue_ = function() {
		var self= this,
			dom = this.dom,
			sel = this.sel,
			opts = this.opts,
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
		
		$.each(val, function(i) {
			self._val.push(i);
		});
		
		$.each(opts, function(i, o) {
			if (!accepted[i] && !(o.inline && !self.sel.collapsed())) {
				self._disabled.push(i);
			}
		})

	}
	
	this._getState = function() {
		return this.opts.length ? this.STATE_ENABLE : this.STATE_DISABLE;
	}
	
}

