(function($) {
elRTE.prototype.ui.prototype.buttons.bold = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);
	var self = this;

	// this.nodes = {
	// 	bold : {
	// 		semantic : 'strong',
	// 		style    : { name : 'span', css : {'font-weight' : 'bold'}}
	// 	},
	// 	italic : {
	// 		semantic : 'em',
	// 		style    : { name : 'span', css : {'font-style' : 'italic'}}
	// 	}
	// 	
	// };
	// 
	// this.node = this.nodes[this.name]

	this.node = {
		semantic : 'strong',
		style    : { name : 'span', css : {'font-weight' : 'bold'}}
	}

	// this.rte.log(this.node)

	this.test = function(n) {
		return /^(STRONG|B)$/.test(n.nodeName) || self.dom.findInStyle(n, 'font-weight');
	}
	
	this.command = function() {
		var s, b, n, l, r;
		
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
						this.nodeName.match(/^(STRONG|B)$/) ? self.dom.unwrap(this) : $(this).css('font-weight', '');
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
				s = this.rte.selection.selected();
				// b = this.rte.selection.getBookmark();
				this.dom.smartWrapAll(s, this.node.semantic);
				// this.sel.moveToBookmark(b);
				this.rte.selection.select(s[0], s[s.length-1]);
			}
		}

		this.rte.ui.update();
	}
	
	this.update = function() {
		this.domElem.removeClass('disabled').toggleClass('active', this.dom.selectionMatchAll( this.test ));
	}
}

// elRTE.prototype.ui.prototype.buttons.italic = function(rte, name) {
// 	this.constructor.prototype.constructor.call(this, rte, name);
// 	var self = this;
// 	
// 	this.node = {
// 		semantic : 'em',
// 		style    : { name : 'span', css : {'font-style' : 'italic'}}
// 	}
// }
// 
// elRTE.prototype.ui.prototype.buttons.italic = elRTE.prototype.ui.prototype.buttons.bold;



})(jQuery);