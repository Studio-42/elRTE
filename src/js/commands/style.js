(function($) {
	/**
	 * @Class Base class for bold,italic etc.
	 *
	 */
	elRTE.prototype.commands.style = function() {

		this.state = function() {
			// if (this.rte.wysiwyg) {
			// 			var n = this.sel.getNode();
			// 			this.rte.log($(n).css('font-weight'))
			// 			if (this.test(n)) {
			// 				return 1;
			// 			} else if (this.dom.cssMatch(n, this.css, '400')) {
			// 				return 0
			// 			}
			// 			return this.dom.selectionMatchAll(this.test) ? 1 : 0
			// 		}
			// 		
			// 		return -1;
			return this.rte.wysiwyg ? (this.dom.selectionMatchAll(this.test) ? 1 : 0) : -1;
		}
		
		this.exec = function() {

			var self = this, 
				c = this.sel.collapsed(),
				s = this.sel.selected(), 
				b = this.sel.getBookmark(), 
				n, l, r, i;
			
			function unwrap(n) {
				n.nodeName.match(self.find) ? self.dom.unwrap(n) : $(n).css(self.css, '');
			}
			
			if (c) {
				/* selection collapsed - unwrap parent with required tag/style if exists */
				if ((n = this.dom.parent(this.sel.getNode(), this.test, null, true))) {
					unwrap(n);
				}
			} else if (this.dom.selectionMatchAll(this.test)) {
				
				/* find selection and nodes intersect */
				l = this.rte.dom.parent(s[0], this.test);
				r = this.rte.dom.parent(s[s.length-1], this.test);

				if (l && r && l == r) {
					/* selection inside node */
					n = this.dom.is(l, 'block') ? l : this.dom.slice(l, s[0], s[s.length-1]);
					unwrap(n);
				} else {
					if (l) {
						/* intersect with node on left side */
						if (l.nodeName.match(this.find)) {
							this.dom.moveNodesAfter(l, s[0]);
						} else {
							(this.dom.is(l, 'block') ? l : $(this.dom.split(l, s[0], true))).css(this.css, '');
						}
					} 
					if (r) {
						/* intersect with node on right side */
						if (r.nodeName.match(this.find)) {
							this.dom.moveNodesBefore(r, s[s.length-1]);
						} else {
							!this.dom.is(r, 'block') && this.dom.split(r, s[s.length-1]);
							$(r).css(this.css, '');
						}
					}
				}
				
				$.each(s, function() {
					$.each(self.dom.descendants(this, self.test), function() {
						unwrap(this);
					});
					self.test(this) && unwrap(this);
				})
				
			} else {
				/* not required node in selection - create it */
				this.dom.smartWrapAll(s, this.node);
			}
			this.sel.moveToBookmark(b);
			c && this.sel.collapse(true);
			this.rte.trigger('update');
		}
		
		this._init = function(rte) {
			this.init(rte);
			var self  = this;
			this.test = function(n) { 
				// self.rte.log(n)
				return n.nodeName.match(self.find) || self.dom.cssMatch(n, self.css, self.cssval); 
				// return n.nodeType == 1 && (n.nodeName.match(self.find) || $(n).css(self.css).match(self.cssval)); 
			};
		}
		
	}
	
	elRTE.prototype.commands.style.prototype = elRTE.prototype.command;
	
	/**
	 * @Class Make text bold
	 *
	 * @param elRTE
	 */
	elRTE.prototype.commands.bold = function(rte) {
		var self    = this;
		this.name   = 'bold';
		this.title  = 'Bold';
		this.find   = /^(STRONG|B)$/;
		this.css    = 'font-weight';
		this.cssval = /(bold|900)/;
		this.defval = 'normal'
		this.node   = 'strong';
		
		this._init(rte);
	}
	
	/**
	 * @Class Make text italic
	 *
	 * @param elRTE
	 */
	elRTE.prototype.commands.italic = function(rte) {
		var self    = this;
		this.name   = 'italic';
		this.title  = 'Italic';
		this.find   = /^(EM|I)$/;
		this.css    = 'font-style';
		this.cssval = 'italic';
		this.node   = 'em';

		this._init(rte);
	}
	
	/**
	 * @Class Make text underlined
	 *
	 * @param elRTE
	 */
	elRTE.prototype.commands.underline = function(rte) {
		var self    = this;
		this.name   = 'underline';
		this.title  = 'Underline';
		this.find   = 'U';
		this.css    = 'text-decoration';
		this.cssval = 'underline';
		this.node   = 'strong';

		this._init(rte);
	}
	
	elRTE.prototype.commands.bold.prototype = elRTE.prototype.commands.italic.prototype = elRTE.prototype.commands.underline.prototype = new elRTE.prototype.commands.style()
	


})(jQuery);