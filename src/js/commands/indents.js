(function($) {
	
	/**
	 * @class elRTE command.
	 * Increase text padding or list items deep.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.indent = function() {
		this.title = 'Indent';
		this.step  = parseInt(this.rte.commandConf(this.name, 'step'))||20;
		
		this._exec = function() {
			var self = this, 
				sel  = self.sel,
				dom  = self.dom,
				step = self.step,
				n    = sel.collapsed() ? [sel.node()] : sel.get(), 
				b    = sel.bookmark(),
				f    = n[0], 
				l    = n[n.length-1],
				li1 = dom.closestParent(f, /^LI$/, true),
				li2 = dom.closestParent(l, /^LI$/, true),
				lst = li1 && li2 ? dom.commonAncestor(li1, li2) : false,
				s, e, p, ilst;
			
			lst = lst ? dom.closestParent(lst, 'list', dom.is(lst, 'list')) : false

			function indent(n) {
				var p = (dom.is(n, 'text') ? 'padding' : 'margin')+'-left',
					n = $(n);
				n.css(p, (parseInt(n.css(p)) || 0) + step + 'px');
			}
			
			if (lst) {
				// there is common list node
				if (dom.isSiblings(li1, li2) && !(dom.is(li1, 'first') && dom.is(li2, 'last'))) {
					// list items belongs to one parent but is not it's first and last childs  
					if (!(p = dom.prevAll(li1, 'li').shift())) {
						dom.append((p = dom.before(dom.create('li'), li1)), dom.create('br'));
					}
					if (!(ilst = $(p).children('ul')[0])) {
						dom.append(p, (ilst = dom.create(lst.nodeName)));
					}
					dom.append(ilst, dom.traverse(li1, li2));
				} else {
					// list items is first and last childs  
					indent(lst);
				}
			} else {
				if (!(s = dom.closestParent(f, 'blockText', true))) {
					s = dom.topParent(f, 'inline', true);
					s = [s].concat(dom.prevUntil(s, 'any', 'block')).pop();
				}

				if (!(e = dom.closestParent(l, 'blockText', true))) {

					e = dom.topParent(l, 'inline', true);
					e = [e].concat(dom.nextUntil(e, 'any', 'block')).pop();
				}
				n = dom.traverse(s, e);
				
				o = { 
					accept  : 'any', 
					wrap    : function(n) { dom.wrap(n, { name : dom.topParent(n[0], 'blockText') ? 'div' : 'p', css : { 'padding-left' : step+'px' } }); }, 
					inner   : false, 
					testCss : 'blockText', 
					setCss  : function(n) {  
							var p = (dom.is(n, 'text') ? 'padding' : 'margin')+'-left', n = $(n);
							n.css(p, (parseInt(n.css(p)) || 0) + step + 'px');
						} 
				};
				dom.smartWrap(n, o);
			}
			sel.toBookmark(b);
			return true;
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	
	/**
	 * @class elRTE command.
	 * Decrease text padding or list items deep.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.outdent = function() {
		this.title = 'Outdent';
		this.step  = parseInt(this.rte.commandConf(this.name, 'step'))||20;
		
		this._test = $.proxy(function(n) {
			var css;
			return /^(UL|OL)$/.test(n.nodeName) || parseInt((css = this.dom.css(n))['padding-left'])>0 || parseInt(css['margin-left'])>0;
		}, this)
		
		this._exec = function() {
			var self = this, 
				sel  = self.sel,
				dom  = self.dom,
				step = self.step,
				n    = sel.collapsed() ? [sel.node()] : sel.get(), 
				b    = sel.bookmark(),
				li1 = dom.closestParent(n[0], /^LI$/, true),
				li2 = dom.closestParent(n[n.length-1], /^LI$/, true),
				lst = li1 && li2 ? dom.commonAncestor(li1, li2) : false,
				_n, next, p, l;
			
			lst = lst ? dom.closestParent(lst, 'list', dom.is(lst, 'list')) : false;
			
			
			function test(n) {
				return parseInt((css = dom.css(n))['padding-left'])>0 || parseInt(css['margin-left'])>0;
			}
			
			function outdent(i, n) {
				var p = (dom.is(n, 'text') ? 'padding' : 'margin')+'-left', 
					v = parseInt(dom.css(n, p))||0,
					n = $(n);

				if (v>0) {
					v = v < self.step ? 0 : v - self.step;
					n.css(p, v > 0 ? v+'px' : '');
				}
			}
			
			if (lst) {
				if (dom.isSiblings(li1, li2) && dom.is(li1, 'first') && dom.is(li2, 'last')) {
					if (test(lst)) {
						outdent(0, lst);
					} else {
						p = lst.parentNode;
						if (p.nodeName == 'LI') {
							p = dom.slice(p, lst);
							dom.remove(dom.prevAll(lst, 'element'));
							dom.unwrap(lst);
							dom.unwrap(p);
						} else {
							$.each(dom.children(lst, /^LI$/), function(i, n) {
								n.appendChild(dom.create('br'))
								dom.unwrap(n);
							});
							dom.unwrap(lst);
						}
					}
					
				} else {
					n = dom.filter(dom.traverse(li1, li2), /^LI$/);
					l = n.length;

					while (l--) {
						_n = n[l];
						lst = _n.parentNode;
						if (dom.is(lst, 'list')) {
							next = dom.nextAll(_n,  /^LI$/).shift();
							if ($.inArray(next, n) != -1) {
								next = false;
							}
							lst = dom.slice(lst, _n);
							p = lst.parentNode;
							if (p.nodeName == 'LI') {
								dom.unwrap(dom.slice(p, lst));
								dom.unwrap(lst);
								next && dom.before(dom.create('br'), next.parentNode);
							} else {
								if (!dom.children(_n, 'list').length) {
									_n.appendChild(dom.create('br'));
								}
								dom.unwrap(_n);
								dom.unwrap(lst);
							}
						}
					}
				}
			} else {
				n = sel.node();
				
				if ((_n = dom.closestParent(n, test, true))) {
					_n = [_n];
				} else {
					_n = dom.closest(n, test);
				}

				$.each(_n, outdent);
			}
			sel.toBookmark(b);
			return true;
		}
		
		this._getState = function() {
			return this.dom.closestParent(this.sel.node(), this._test, true) ? this.STATE_ENABLE : this.STATE_DISABLE;
		}

		
	}
	
})(jQuery);