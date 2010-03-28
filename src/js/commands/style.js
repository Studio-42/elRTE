(function($) {
	/**
	 * @Class Parent class for bold,italic etc.
	 *
	 */
	elRTE.prototype.commands.style = function() {

		/**
		 *
		 */
		this.state = function() {
			return this.rte.wysiwyg ? (this.dom.selectionMatchAll(this.test) ? 1 : 0) : -1;
		}
		
		this.exec = function() {
			var bm = this.sel.getBookmark();
			this.sel.moveToBookmark(bm);
			// var bm = this.sel.getBookmark();
			// this.sel.moveToBookmark(bm);
			return
			var self = this, 
				c = this.sel.collapsed(),
				b = this.sel.getBookmark(), 
				s = this.sel.selected(), 
				n, l, r, i;
			this.rte.log(c)
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
				/* find nodes in selection and unwrap */
				$.each(s, function() {
					$.each(self.dom.descendants(this, self.test), function() {
						unwrap(this);
					});
					self.test(this) && unwrap(this);
				});
				
			} else {
				/* not required node in selection - create it */
				// this.dom.smartWrapAll(s, this.node);
				// this.rte.history.add();
				this.wrap(s);
			}

			this.sel.moveToBookmark(b);
			c && this.sel.collapse(true);
			return true;
		}
		
		this.wrap = function(s) {
			this.dom.smartWrapAll(s, this.node);
		}
		
		this._init = function(rte) {
			this.init(rte);
			var self  = this;
			this.test = function(n) { 
				return n.nodeName.match(self.find) || self.dom.cssMatch(n, self.css, self.cssval); 
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
		this.find   = /^U$/;
		this.css    = 'text-decoration';
		this.cssval = 'underline';
		this.node   = {name : 'span', css : {'text-decoration' : 'underline'}};

		this.wrap = function(s) {
			$.each(s, function() {
				if (this.nodeType == 1) {
					$(this).css(self.css, self.cssval);
				} else if (this.nodeType == 3) {
					this.dom.wrap(this, self.node);
				}
			});
		}

		this._init(rte);
	}
	
	/**
	 * @Class Make text sub
	 *
	 * @param elRTE
	 */
	elRTE.prototype.commands.sub = function(rte) {
		this.name   = 'sub';
		this.title  = 'sub';
		this.find   = /^SUB$/;
		this.css    = 'vertical-align';
		this.cssval = 'sub';
		this.node   = 'sub';

		this._init(rte);
	}
	
	/**
	 * @Class Make text sup
	 *
	 * @param elRTE
	 */
	elRTE.prototype.commands.sup = function(rte) {
		this.name   = 'sup';
		this.title  = 'sup';
		this.find   = /^SUP$/;
		this.css    = 'vertical-align';
		this.cssval = 'super';
		this.node   = 'sup';

		this._init(rte);
	}
	
	elRTE.prototype.commands.bold.prototype = 
	elRTE.prototype.commands.italic.prototype = 
	elRTE.prototype.commands.underline.prototype = 
	elRTE.prototype.commands.sub.prototype =
	elRTE.prototype.commands.sup.prototype = new elRTE.prototype.commands.style();
	


})(jQuery);