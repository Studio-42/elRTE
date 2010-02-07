(function($) {
elRTE.prototype.ui.prototype.buttons.bold = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);
	var self = this;
	
	this.command = function() {
		// this.rte.history.add()
		this.rte.window.focus();
		var s, b, n = this.rte.selection.getNode(), l, r;
		
		var t = new Date().getMilliseconds()
		
		if (this.sel.collapsed()) {
			/* selection collapsed - remove parent strong if exists */
			if ((s = this.dom.is(n, 'strong') ? n : this.dom.parent(n, 'strong'))) {
				b = this.sel.getBookmark(); 
				n.nodeName.match(/^(STRONG|B)$/) ? this.dom.unwrap(s) : $(n).css('font-weight', '');
				this.sel.moveToBookmark(b).collapse(true);
			}
		} else {
			if (!this.dom.selectionIs('strong')) {
				/* not strong in selection - create it */
				s = this.rte.selection.selected({wrap : 'all', tag : 'strong'});
				this.rte.selection.select(s[0], s[s.length-1]);
			} else {
				b = this.rte.selection.getBookmark();
				s = this.rte.selection.selected({wrap : false});
				this.rte.log(s)
				if (s.length == 1 && this.dom.is(s[0], 'strong')) {
					s[0].nodeName.match(/^(STRONG|B)$/) ? this.dom.unwrap(s[0]) : $(s[0]).css('font-weight', '');
				} else {
					l = this.rte.dom.parent(b[0], 'strong');
					r = this.rte.dom.parent(b[1], 'strong');
					if (l && r && l == r) {
						/* selection inside strong */
						this.dom.cutNode(l, b[0], b[1])
					} else {
						if (l) {
							this.dom.moveNodesToRight(l, b[0])
						}
						if (r) {
							this.dom.moveNodesToLeft(r, b[1])
						}
					}
				}

				
				

				// if (l && r && l == r) {
				// 	/* selection inside strong */
				// 	this.dom.cutNode(l, b[0], b[1])
				// } else {
				// 	if (l) {
				// 		l.appendChild($(this.rte.dom.create('span')).addClass('elrte-bm')[0])
				// 		var nodes = this.rte.dom.traverse(b[0], l.lastChild);
				// 		l.removeChild(nodes.pop())
				// 		var i = nodes.length;
				// 		
				// 		while(i--) {
				// 			var n = nodes[i], p;
				// 			if (n != b[0] && (p = this.rte.dom.cloneParents(n, l))) {
				// 				p.appendChild(n);
				// 				n = p;
				// 			}
				// 			if (l.nextSibling) {
				// 				l.parentNode.insertBefore(n, l.nextSibling)
				// 			} else {
				// 				l.parentNode.appendChild(n)
				// 			}
				// 		}
				// 	}
				// 	
				// 	if (r && r.firstChild) {
				// 		r.insertBefore($(this.rte.dom.create('span')).addClass('elrte-bm')[0], r.firstChild);
				// 		var nodes = this.rte.dom.traverse(r.firstChild, b[1]);
				// 		r.removeChild(nodes.shift())
				// 		var i = nodes.length
				// 		this.rte.log(nodes)
				// 		for (var i=0; i < nodes.length; i++) {
				// 			var n = nodes[i], p;
				// 			if (n != b[0] && (p = this.rte.dom.cloneParents(n, r))) {
				// 				p.appendChild(n);
				// 				n = p;
				// 			}
				// 			r.parentNode.insertBefore(n, r)
				// 		};
				// 	}
				// 	
				// }
				// this.sel.moveToBookmark(b);
			}
		}
		this.rte.log(new Date().getMilliseconds()-t)

	}
	
	this.update = function() {
		this.domElem.removeClass('disabled').toggleClass('active', this.dom.selectionIs('strong'));
	}
}
})(jQuery);