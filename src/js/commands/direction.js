(function($) {
	

	elRTE.prototype.commands.ltr = function(n) {
		this.name  = n;
		this.title = 'Left to right';
		
		this._exec = function() {
			var n, w;
			if (this._state == this.STATE_ACTIVE) {
				
			} else {
				n = this.sel.node();
				this.rte.log(n)
				w = this.dom.parents(n, 'text', n.nodeType == 1).shift();
				this.rte.log(w)
				
				if (w) {
					$(w).attr('dir', 'ltr').find('[dir]').removeAttr('dir');
				}
				
			}
		}
		
		this._getState = function() {
			var f = function(n) {
				return n.nodeType == 1 && $(n).attr('dir') == 'ltr';
			}
			
			return this.dom.testSelection(f).length ? this.STATE_ACTIVE : this.STATE_ENABLE;
		}

	}
	
	elRTE.prototype.commands.rtl = function(n) {
		this.name  = n;
		this.title = 'Right to left';
		
		this._exec = function() {
			var self = this, 
				w = [],
				c,
				f = function(n) { return !self.dom.is(n, 'empty') && !self.dom.is(n, 'emptySpan'); },
				n = this.sel.node();
			
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
			} else {
				
				n = this.sel.get();
				this.rte.log(n)
				var s = n[0],
					e = n[n.length-1],
					c = this.dom.commonAncestor(s, e),
					b = c.nodeName == 'BODY',
					sp = this.dom.parents(s, 'any', true, c).pop(), //b ? this.dom.parents(s, 'any', true).pop() : c,
					ep = this.dom.parents(e, 'any', true, c).pop()//b ? this.dom.parents(e, 'any', true).pop() : c
					;
				// this.rte.log(c)
				this.rte.log(sp)
				this.rte.log(ep)
				// return
				s = this.dom.split(sp, s, true)
				e = this.dom.split(ep, e, false)
				n = this.dom.traverse(s, e)
				// this.rte.log(s)
				// this.rte.log(e)
				this.rte.log(n)
				// return
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
				
				return true
				
				if ((w = this.dom.parents(n, 'blockText', n.nodeType == 1)).length) {
					set(w[0]);	
				} else if ((w = this.dom.parents(n, 'text')).length || (w = this.dom.parents(n, 'text', true)).length) {
					n = w.pop();
					w = this.dom.prevAll(n, 'inline').reverse().concat([n]).concat(this.dom.nextAll(n, 'inline'));
					wrap();
				} else {
					
						
						
						
					// this.rte.log(this.dom.split(b ? this.dom.parents(s, 'any', true) : c, s, true))
					// this.rte.log(c)
					
					// if (this.dom.is(n[0], 'inline')) {
					// 	n = this.dom.prevAll(n[0], 'inline').reverse().concat(n);
					// }
					// if (this.dom.is(n[n.length-1], 'inline')) {
					// 	n = n.concat(this.dom.nextAll(n[n.length-1], 'inline'));
					// }
					// this.rte.log(w)
					// $.each(n, function(i, n) {
					// 	if (self.dom.is(n, 'blockText')) {
					// 		set(n);
					// 	} else {
					// 		if (w.length && n.previousSibling !== w[w.length-1]) {
					// 			wrap();
					// 		}
					// 		w.push(n);
					// 	}
					// });
					// wrap();
				}
			}
			
			
			// else {
			// 	
			// 	if (n.nodeName == 'BODY') {
			// 		set(this.dom.filter(n.childNodes, 'blockText'));
			// 		c = this.dom.filter(n.childNodes, 'inline');
			// 		$.each(c, function(i, n) {
			// 			if (w.length && n.previousSibling !== c[i-1]) {
			// 				wrap();
			// 			}
			// 			w.push(n);
			// 		})
			// 		wrap();
			// 	} else if ((w = this.dom.parents(n, 'blockText', n.nodeType == 1)).length) {
			// 		set(w[0]);
			// 		// $(w[0]).attr('dir', 'rtl').find('[dir]').removeAttr('dir');
			// 	} else {
			// 		n = this.dom.parents(n, 'text').pop()||n;
			// 		this.rte.log(n)
			// 		w = this.dom.prevAll(n, 'inline').reverse().concat([n]).concat(this.dom.nextAll(n, 'inline'))
			// 		wrap();
			// 	}
				
				// w = this.dom.parents(n, 'blockText', n.nodeType == 1)||this.dom.parents(n, 'text', n.nodeType == 1)
				// if (!w.length) {
				// 	
				// }
				// this.rte.log(w)
				// return
				// if ((w = this.dom.parents(n, 'text', n.nodeType == 1)).length) {
				// 	$(w[0]).attr('dir', 'rtl').find('[dir]').removeAttr('dir');
				// } else if (n.nodeType == 3) {
				// 	wrap(this.dom.prevAll(n, 'inline').reverse().concat([n]).concat(this.dom.nextAll(n, 'inline')));
				// } else {
				// 	set(this.dom.filter(n.childNodes, 'blockText'));
				// 	c = this.dom.filter(n.childNodes, 'inline');
				// 	$.each(c, function(i, n) {
				// 		if (w.length && n.previousSibling !== c[i-1]) {
				// 			wrap();
				// 		}
				// 		w.push(n);
				// 	})
				// 	wrap();
				// }
			// }
			return true;
			
			
			
			if (this._state == this.STATE_ACTIVE) {
				
			} else {
				n = this.sel.node();
				// this.rte.log(n)
				w = this.dom.parents(n, 'text', n.nodeType == 1).shift();
				
				if (w) {
					this.rte.log(w)
					this._set(w)
				} else {
					if (n.nodeType == 3) {
						w = this.dom.prevAll(n, 'inline').reverse().concat([n]).concat(this.dom.nextAll(n, 'inline'))
						this.rte.log(w)
						this.dom.wrap(w, { name : 'p', attr : { dir : 'rtl' }})
					} else {
						w = this.dom.filter(n.childNodes, 'inline')
						
						// this.rte.log(w)
						$.each(w, function(i, n) {
							if (n.previousSibling !== w[i-1] && buffer.length) {
								wrap(buffer)
							}
							buffer.push(n)
						})
						wrap(buffer)
					}
				}
				
			}
			return true;
		}
		
		this._set = function(n) {
			$(n).attr('dir', 'rtl').find('[dir]').removeAttr('dir');
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