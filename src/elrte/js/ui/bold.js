(function($) {
elRTE.prototype.ui.prototype.buttons.bold = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);
	var self = this;
	
	this.command = function() {
		
		// this.dom.childs(this.sel.getNode(), 'textInline')
		// this.rte.log(this.sel.getSelected())
		// var sel = this.sel.filterSelected('notEmpty')
		// this.rte.log(sel)
		
		// this.rte.log(this.dom.wrapAll(sel, 'textNode', 'div'))
		
		// this.rte.log(this.sel.wrapSelected('notEmpty', 'textNode', 'div'))
		// this.rte.log(this.sel.selected({filter : 'notEmpty', wrapFilter : 'textNode', wrapNode : 'div'}))
		// this.sel.getSelected()
		// return;
		// this.rte.history.add();

		var s, b, n, l, r;
		
		var t = new Date().getMilliseconds()
		
		function unwrap(n) {
			n.nodeName.match(/^(STRONG|B)$/) ? self.dom.unwrap(n) : $(n).css('font-weight', '')
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
				// s = this.rte.selection.selected({filter : 'notEmpty', wrapFilter : 'textInline', wrapNode : 'strong'});
				
				// this.rte.log(s)
				var f = function(n, w) {
					// self.rte.log(n)
					
					
					w = w.nodeType ? w : self.dom.create(w);
					
					if (self.dom.is(w, 'blockText')) {
						if (w.nodeName == 'P') {
							if (self.dom.is(n, 'blockText')) {
								self.dom.wrapInner(n, w);
							} else if (self.dom.is(n, 'inline')) {
								self.dom.wrap(n, w);
							}
						} else {
							self.dom.wrap(n, w);
						}
					} else if (self.dom.is(w, 'inlineText')) {
						if (self.dom.is(n, 'block') && !self.dom.is(n, 'text')) {
							for (var i=0; i<n.childNodes.length; i++) {
								f(n.childNodes[i], w.cloneNode(false));
							}
						} else if (self.dom.is(n, 'text') && !self.dom.is(n, 'empty')) {
							var blocks = self.dom.descendants(n, 'blockText');
							if (blocks.length) {
								var before = self.dom.traverse(n.firstChild, blocks[0]);
								var after = self.dom.traverse(blocks[0], n.lastChild);
								before.pop();
								after.shift();
								if (self.dom.filter(before, 'notEmpty').length) {
									if (before[0].parentNode == before[before.length-1].parentNode) {
										self.dom.wrapAll(before, w.cloneNode(false));
									} else {
										for (var i=0; i < before.length; i++) {
											self.dom.wrap(before[i], w.cloneNode(false))
										};
									}
									
								}
								
								f(blocks[0], w.cloneNode(false));
								if (blocks.length == 1 && after[0].parentNode == after[after.length-1].parentNode) {
									self.dom.wrapAll(after, w.cloneNode(false));
								} else {
									for (var i=0; i < after.length; i++) {
										f(after[i], w.cloneNode(false))
									};
									
								}
							} else {
								if (self.dom.is(n, 'block')) {
									self.dom.wrapInner(n, w);
								} else {
									self.dom.wrap(n, w);
								}
							}
						}
					}
				}
				
				s = this.sel.selected();
				
				this.dom.smartWrapAll(s, 'strong');
				
				// if (this.dom.isSiblings(s) && !this.dom.has(s, 'blockText') && this.dom.filter(s, 'notEmpty').length) {
				// 	this.rte.log('go')
				// 	this.dom.wrapAll(s, 'strong')
				// } else {
				// 	for (var i=0; i < s.length; i++) {
				// 		this.dom.smartWrap(s[i], 'strong')
				// 		// f(s[i], 'strong')
				// 	};
				// }
				// this.rte.log(s)
				
				
				// $.each(s, function() {
				// 	if (this.nodeName != 'STRONG') {
				// 		self.rte.log(this)
				// 		self.dom.wrapInner(this, 'strong');
				// 	}
				// })
				this.rte.selection.select(s[0], s[s.length-1]);
				// TODO join siblings with the same nodeNames
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