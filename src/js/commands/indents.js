(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert horizontal rule.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.indent = function() {
		this.title = 'Indent';
		this.step  = 20;
	
		
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

			function test(n) {
				return dom.is('inline');
			}

			function indent(n) {
				var p = (dom.is(n, 'text') ? 'padding' : 'margin')+'-left',
					n = $(n);
				n.css(p, (parseInt(n.css(p)) || 0) + step + 'px');
			}
			
			function wrap(n) {
				dom.wrap(n, { name : dom.topParent(n[0], 'blockText') ? 'div' : 'p', css : { 'padding-left' : step+'px' } });
			}
			

			if (lst) {
				if (dom.isSiblings(li1, li2) && !(dom.is(li1, 'first') && dom.is(li2, 'last'))) {
					if (!(p = dom.prevAll(li1, 'li').shift())) {
						dom.append((p = dom.before(dom.create('li'), li1)), dom.create('br'));
					}
					if (!(ilst = $(p).children('ul')[0])) {
						dom.append(p, (ilst = dom.create(lst.nodeName)));
					}
					dom.append(ilst, dom.traverse(li1, li2));
				} else {
					indent(lst)
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
				dom.wrapSiblings(n, 'blockText', indent, wrap, 'notEmpty');
			}
			sel.toBookmark(b);
			return true;
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	
})(jQuery);