(function($) {
	/**
	 * @class elRTE command.
	 * Create/remove blockquote
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.blockquote = function() {
		this.title      = 'Blockquote';
		this._regExp    = /^BLOCKQUOTE$/;
		this._cutRegExp = /^(TABLE|UL|OL|P)$/;
		
		this._exec = function() {
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
				n = dom.wrap(dom.traverse(s, e), 'blockquote');
				sel.select(n);
			}
			return true;	
		}
		
		this._getState = function() {
			return this.sel.collapsed() 
				? this.dom.closestParent(this.sel.node(), this._regExp, true) ? this.STATE_ACTIVE : this.STATE_DISABLE
				: this.STATE_ENABLE;
		}

	}
	
})(jQuery);