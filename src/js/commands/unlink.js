(function($) {
	
	/**
	 * @class elRTE command.
	 * Remove links
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.unlink = function() {
		this.title = 'Delete link';
		
		/**
		 * Return selected links if exists
		 *
		 * @return Array
		 **/
		this._find = function() {
			var sel = this.sel,
				dom = this.dom,
				n   = sel.node(),
				ret = [],
				l, _n;

			if ((n = dom.closestParent(n, 'link', true))) {
				ret.push(n)
			} else if (!sel.collapsed()) {
				n = sel.get(true).reverse();
				l = n.length;
				while (l--) {
					if (dom.is(n[l], 'link')) {
						ret.push(n[l]);
					} else if ((_n = dom.find(n[l], 'link')).length) {
						ret = ret.concat(_n);
					}
				}
				if ((_n = dom.closestParent(n[0], 'link'))) {
					ret.push(_n);
				} else if (n.length>1 && (_n = dom.closestParent(n[n.length-1], 'link'))) {
					ret.push(_n);
				}
			}
			
			return ret;
		}

		/**
		 * Remove all linls in selection
		 *
		 * @return void
		 **/
		this._exec = function() {
			var sel = this.sel,
				dom = this.dom, 
				n = this._find(), 
				l = n.length, b;
			
			if (l) {
				b = sel.bookmark();
				while (l--) {
					dom.unwrap(n[l]);
				}
				sel.toBookmark(b);
				return true;
			}
		}

		this._getState = function() {
			return this.dom.testSelection('link') ? this.STATE_ACTIVE : this.STATE_DISABLE;
		}

	}
	
})(jQuery);