(function($) {
elRTE.prototype.ui.prototype.buttons.bold = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);
	var self = this;
	
	this.command = function() {
		var s, b, n, l, r;
		
		var t = new Date().getMilliseconds()
		
		function unwrap(n) {
			n.nodeName.match(/^(STRONG|B)$/) ? self.dom.unwrap(n) : $(n).css('font-weight', '');
		}
		
		if (this.sel.collapsed()) {
			/* selection collapsed - remove parent strong if exists */
			if ((n = this.dom.parent(this.sel.getNode(), 'strong', null, true))) {
				b = this.sel.getBookmark(); 
				n.nodeName.match(/^(STRONG|B)$/) ? this.dom.unwrap(n) : $(n).css('font-weight', '');
				this.sel.moveToBookmark(b).collapse(true);
			}
		} else {
			
			if (this.dom.selectionMatchAll('strong')) {
				s = this.rte.selection.selected();
				b = this.rte.selection.getBookmark();
				
				for (var i=0; i < s.length; i++) {
					$.each(this.dom.find(s[i], 'strong', true), function() {
						unwrap(this);
					});
				};
				l = this.rte.dom.parent(b[0], 'strong');
				r = this.rte.dom.parent(b[1], 'strong');
				
				if (l && r && l == r) {
					/* selection inside strong */
					this.dom.unwrapPart(l, b[0], b[1]);
				} else {
					/* intersect with strong on left side */
					l && this.dom.moveNodesAfter(l, b[0]);
					/* intersect with strong on right side */
					r && this.dom.moveNodesBefore(r, b[1]);
				}
				this.sel.moveToBookmark(b);
			} else {
				/* not strong in selection - create it */
				this.dom.smartWrapAll((s = this.sel.selected()), 'strong');
				this.rte.selection.select(s[0], s[s.length-1]);
			}
		}
		this.rte.log(new Date().getMilliseconds()-t)

		this.rte.ui.update();
	}
	
	this.update = function() {
		this.domElem.removeClass('disabled').toggleClass('active', this.dom.selectionMatchAll('strong'));
	}
}
})(jQuery);