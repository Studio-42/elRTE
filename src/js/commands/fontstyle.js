/**
 * @class elRTE command.
 * Apply user defined css classes
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.fontstyle = function() {
	var self = this, 
		o    = this.rte.commandConf('fontstyle', 'opts'), 
		n, l, s;
	
	this.title     = 'Style';
	this.buttonType = 'menuButton';
	this._val      = [];
	this._disabled = [];
	this._opts     = [];

	// if (o) {
	// 	this._opts = {};
	// 	$.each(o, function(i, o) {
	// 		s = o.selector;
	// 		n = 'style'+i;
	// 		self._opts[n] = o;
	// 		if (typeof(s) == 'string' && !self.dom.filters[s]) {
	// 			self._opts[n].selector = (function(s) { return function(n) { return $(n).is(s); } })(s);
	// 		}
	// 	});
	// 	
	// }
	
	this._onInit = function() {
		this._opts = this._conf.opts||[];
		this.buttonType = this._opts.compact ? 'expandButton' : 'menuButton'
		this.rte.log(this._conf.opts)
	}
	
	this._exec = function(v) {
		var self = this,
			dom  = this.dom,
			sel  = this.sel,
			exp  = !sel.collapsed(),
			b    =  sel.bookmark(),
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
	
	
	this._setVal = function() {
		var self= this,
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
		this._ui && this._ui.val(this._val, this._disabled);
	}
	
	this._getState = function() {
		return this._opts.length ? this.STATE_ENABLE : this.STATE_DISABLE;
	}
	
}

