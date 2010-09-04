(function($) {
	
	elRTE.prototype.commands.rtl = function(n) {
		this.name  = n;
		this.title = 'Right to left';
		this.node = { name : 'bdo', attr : { dir : 'rtl' }}
		
		this._test = function(n) {
			return n.nodeName == 'BDO' && $(n).attr('dir') == 'rtl';
		}
		
		this._exec = function() {
			var self = this,
			 	c = this.sel.collapsed(), 
				n = this.sel.node(), p, b;
				
			if (this._state == this.STATE_ACTIVE) {
				if (c) {
					b = this.sel.bookmark();
					$.each(this.dom.parents(n, this._test, true), function() { self.dom.unwrap(this); });
					this.sel.toBookmark(b).collapse(true);
				} else {
					n = this.dom.smartUnwrap(this.sel.get(true), this._test, 'inline', function (n) { self.dom.unwrap(n) });
					// this.rte.log(n)
					this.sel.select(n[0], n[1]);
				}
			} else {
				if (c) {
					this.sel.surroundContents(this.dom.create(this.node));
				} else {
					n = this.sel.get();
					this.dom.smartWrap(n, 'block', this.node);
					this.sel.select(n[0], n[n.length-1]);
				}
			}
			return true;
		}
		
		this._getState = function() {
			return this.dom.testSelection(this._test) ? this.STATE_ACTIVE : this.STATE_ENABLE;
		}
		
	}

	
	elRTE.prototype.commands._rtl = function(n) {
		this.name  = n;
		this.title = 'Right to left';
		
		this._exec = function() {
			var self = this,
				w = [],
				n = this.sel.node(),
				f = function(n) { return !self.dom.is(n, 'empty') && !self.dom.is(n, 'emptySpan'); },
				s, e, c;
			
			function wrap() {
				if (self.dom.filter(w, f).length) {

					self.dom.wrap(w, { name : self.dom.parents(w[0], 'block', true).length ? 'div' : 'p', attr : { dir : 'rtl' }});
				}
				w = [];
			}
			
			
			function set(n) {
				$(n).attr('dir', 'rtl').find('[dir]').removeAttr('dir');
			}
				
			if (this._state == this.STATE_ACTIVE) {
				$(this.dom.parents(n, function(n) { return $(n).attr('dir') == 'rtl' }, n.nodeType == 1)).add($(n).find('[dir]')).removeAttr('dir');
			} else if (this.sel.collapsed()) {
				if ((w = this.dom.parents(n, 'blockText', n.nodeType == 1)).length) {
					set(w[0]);	
				} else {
					w = this.dom.parents(n, 'text', true);
					n = w.pop();
					w = this.dom.prevAll(n, 'inline').reverse().concat([n]).concat(this.dom.nextAll(n, 'inline'));
					wrap();
				}
			} else {
				n = this.sel.get();
				s = n[0];
				e = n[n.length-1];
				
				s = this.dom.prevAll(s).reverse().concat([s]).shift()
				e = [e].concat(this.dom.nextAll(e)).pop();
				c = this.dom.commonAncestor(s, e);
				// this.rte.log(s)
				s = this.dom.split(this.dom.parents(s, 'any', true, c).pop(), s, true)
				e = this.dom.split(this.dom.parents(e, 'any', true, c).pop(), e, false)
				this.sel.select(s, e);
				n = this.sel.get()
				// n = this.dom.traverse(s, e);
				// this.rte.log(s)
				// this.rte.log(e)
				this.rte.log(n)
				$.each(n, function(i, n) {
					if (self.dom.is(n, 'blockText')) {
						set(n)
					} else if (!self.dom.is('block')) {
						if (w.length && n.previousSibling !== w[w.length-1]) {
							wrap()
						}
						w.push(n)
					}
				})
				wrap()
				this.sel.select(n[0], n[n.length-1])
			}
			return true;
		}
		
		
		this._getState = function() {
			var f = function(n) {
				return n.nodeType == 1 && $(n).attr('dir') == 'rtl';
			}
			var s = this.dom.testSelection(f);
			// this.rte.log(s)
			return s ? this.STATE_ACTIVE : this.STATE_ENABLE;
		}

	}
	
})(jQuery);