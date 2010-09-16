(function($) {
	
	elRTE.prototype.commands._blockTextElement = {
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
		},
		
		state : function() {
			return this.sel.collapsed() 
				? this.dom.closestParent(this.sel.node(), this._regExp, true) ? this.STATE_ACTIVE : this.STATE_DISABLE
				: this.STATE_ENABLE;
		}
	}
	
	/**
	 * @class elRTE command.
	 * Create/remove blockquote
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.blockquote = function() {
		this.title      = 'Blockquote';
		this._node      = 'blockquote';
		this._regExp    = /^BLOCKQUOTE$/;
		this._cutRegExp = /^(TABLE|UL|OL|P)$/;
		
		this._exec = $.proxy(this.rte.commands._blockTextElement.exec, this);
		this._getState = $.proxy(this.rte.commands._blockTextElement.state, this);
	}
	
	/**
	 * @class elRTE command.
	 * Create/remove div
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.div = function() {
		this.title      = 'Block element (DIV)';
		this._node      = 'div';
		this._regExp    = /^DIV$/;
		this._cutRegExp = /^(TABLE|UL|OL|P)$/;
		
		this._exec = $.proxy(this.rte.commands._blockTextElement.exec, this);
		this._getState = $.proxy(this.rte.commands._blockTextElement.state, this);
		
	}
	
})(jQuery);