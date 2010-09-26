/**
 * @class elRTE command.
 * Apply user defined css classes to required nodes (or create nodes with css classes)
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.fontstyle = function() {
	this.title    = 'Styles';
	this.conf     = { ui : 'style' };
	this.disabled = [];
	this.opts     = [];
	this._val     = [];
	this._types   = {
		list  : /^(ol|ul|dl|li|dd|dt)$/i,
		obj   : /^(img|hr|embed)$/i,
		table : /^(table|tr|th|td|caption)$/i,
		block : /^(address|blockquote|dir|div|fieldset|form|h[1-6]|menu|p|pre)$/i
	}
	/**
	 * Create options and selectors lists
	 * 
	 * @return void
	 **/
	this._onInit = function() {
		var o = this.conf.opts||[], 
			l = o.length,
			types = this._types,
			i, r, e;

		function type(r) {
			var e = r.element;
			
			for (i in types) {
				if (types.hasOwnProperty(i) && types[i].test(e)) {
					return i == 'block' || r['class'] ? i : false;
				}
			}
			return r['class'] || e != 'span' ? 'inline' : false;
		}
		
		while (l--) {
			r = o[l];
			r.element = r.element.toLowerCase();
			e = r.element;
			
			if (r.name && e) {
				(r.type = type(r)) && this.opts.unshift(r);
			}
		}
	}
	
	this._test = function(n, r) {
		if (n.nodeName.toLowerCase() === r.element) {
			if (r['class'] && $(n).hasClass(r['class'])) {
				return true;
			}
		}
	}
	
	/**
	 * Clean nodes with selected styles
	 * 
	 * @return Boolean
	 **/
	this._clean = function() {
		var self  = this,
			dom   = this.dom,
			sel   = this.sel,
			n     = sel.node(),
			l     = this._val.length,
			reg   = [],
			rules = [],
			rule, e, b, nodes;
			
		if (!l) {
			return false;
		}
		
		b    = sel.bookmark();
		
		function test(n, r) {
			var c = r['class'];
			if (n.nodeName.toLowerCase() === r.element) {
				return c ? $(n).hasClass(c) : true;
			}
		}
		
		function clean(n, r) {
			var c = r['class'];
			
			c && $(n).removeClass(c);
			if (r.type == 'block' || r.type == 'inline') {
				dom.unwrap(n);
			}
		}
		
		while (l--) {
			rules.push((rule = this.opts[this._val[l]]));
			e = rule.element;
			$.inArray(e, reg) === -1 && reg.push(e);
		}
		
		reg = new RegExp('^('+reg.join('|')+')$', 'i');
		
		// clean node and parents
		$.each(dom.parents(n, reg, true), function(i, n) {
			$.each(rules, function(i, rule) {
				if (test(n, rule)) {
					clean(n, rule);
					if (!dom.is(n, 'node')) {
						return false;
					}
				}
			});
		});
		
		if (!sel.collapsed()) {
			// find exceptable nodes in selection and clean its
			n = dom.traverse(dom.topParent(b[0], reg)||b[0], dom.topParent(b[1], reg)||b[1]);
			nodes = dom.filter(n, reg);
			$.each(n, function(i, n) {
				nodes = nodes.concat(dom.find(n, reg));
			});
			
			$.each(nodes, function(i, n) {
				$.each(rules, function(i, rule) {
					if (test(n, rule)) {
						clean(n, rule);
						if (!dom.is(n, 'node')) {
							return false;
						}
					}
				});
			});
		}
		sel.toBookmark(b);
		return true;
	}
	
	this._create = function(rule) {
		var self = this,
			dom  = this.dom,
			sel  = this.sel,
			_n   = sel.node(),
			c    = rule['class']||'',
			node = c  ? { name : rule.element, attr : { 'class' : c } } : rule.element,
			test = function(n) { return n.nodeName.toLowerCase() == rule.element; }, 
			n, f, l, s, e, b, tmp;
			
		if (rule.type == 'inline') {
			if (sel.collapsed()) {
				sel.surroundContents(dom.create(node));
			} else {
				n = sel.get(true);
				dom.smartWrap(n, { wrap : function(n) { dom.wrap(n, node) } });
			}
		} else if (rule.type == 'block') {
			n = dom.closestParent(sel.node(), test, true);
			
			// this.rte.log(n)
			if ((n = dom.closestParent(sel.node(), test, true))) {
				// acceptable node - change class
				$(n).addClass(c);
			} else if (sel.collapsed()) {
				b = sel.bookmark();
				n = dom.closestParent(sel.node(), 'blockText', true);
				
				if ((n = dom.closestParent(sel.node(), 'blockText', true))) {
					// replace closest parent block text node with required node
					dom.replace(n, node);
				} else {
					// wrap sibling inline nodes
					f = dom.topParent(b[0], 'inline', true)
					n = dom.prevUntil(f, 'any', function(n) { return dom.is(n, 'block') || n.nodeName == 'BR' }).reverse();
					n = n.concat(dom.nextUntil(f, 'any', function(n) { return dom.is(n, 'block') || n.nodeName == 'BR' }))
					this.rte.log(n);
					dom.wrap(n, node)
				}
				sel.toBookmark(b);
			} else {
				b = sel.bookmark();
				f = b[0];
				l = b[1];
				c = dom.commonAncestor(f, l);
				if ((s = dom.topParent(f, 'blockText')) || (e = dom.topParent(l, 'blockText'))) {
					if (s) {
						f = dom.split(s, f, true);
					}
					if (e) {
						l = dom.split(e, l, false);
					}
					
				}
				c = dom.commonAncestor(f, l);
				s = dom.topParent(f, 'any', true, c)||f;
				e = dom.topParent(l, 'any', true, c)||l;
				s = dom.split(s, f, true);
				e = dom.split(e, l, false);
				n = dom.wrap(dom.traverse(s, e), node);
				sel.toBookmark(b);
			}
			
		} else if (rule.type == 'obj') {
			if (dom.is(_n, test)) {
				$(_n).addClass(c)
			}
		} else if (rule.type == 'list' || rule.type == 'table') {
			if ((n = dom.closestParent(_n, test, true))) {
				$(n).addClass(c);
			} else {
				b = sel.bookmark();
				f = dom.topParent(b[0], test)||b[0];
				l = dom.topParent(b[1], test)||b[1];
				n = dom.traverse(f, l)
				tmp = dom.filter(n, test)
				$.each(n, function(i, n) {
					tmp = tmp.concat(dom.find(n, test));
				});

				$.each(tmp, function(i, n) {
					$(n).addClass(c);
				});
				
				sel.toBookmark(b);
			}
		} 
		
		return true
	}
	
	this._exec = function(v) {
		var self = this,
			dom  = this.dom,
			sel  = this.sel,
			ndx  = parseInt(v), p, r, l = this._val.length;
			
		if ($.inArray(ndx, this._val) != -1) {
			this.rte.log('do nothng')
			return false;
		} else if (v == 'clean') {
			return this._clean()
		} else if (this.opts[ndx]) {
			return this._create(this.opts[ndx]);
		}
		return true;
	}
	
	this._updValue = function() {
		var self = this,
			dom  = this.dom,
			sel  = this.sel,
			dis  = [];

		this._val = [];
		this.disabled = [];
		
		$.each(['obj', 'table', 'list'], function(i, t) {
			if (!dom.testSelection(self._types[t])) {
				dis.push(t);
			}
		});

		$.each(self.opts, function(i, r) {
			var e = r.element,
				c = r['class'],
				f = c ? function(n) { return n.nodeName.toLowerCase() == e && $(n).hasClass(c); } : function(n) { return n.nodeName.toLowerCase() == e  };
			
			if ($.inArray(r.type, dis) != -1) {
				self.disabled.push(i);
			} else if (dom.testSelection(f)) {
				self._val.push(i);
			}
		});
		
	}
	
	this._getState = function() {
		return this.opts.length ? this.STATE_ENABLE : this.STATE_DISABLE;
	}
	
}

