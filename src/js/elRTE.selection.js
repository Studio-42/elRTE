(function($) {
	
	elRTE.prototype.selection = function(rte) {

		var self = this;
		this.rte = rte;
		this.dom = rte.dom;
		this._node = null;
		this.win  = window;
		this.doc  = document;
		
		rte.bind('wysiwyg', function() {
			// on focus - work with active document
			self.win = self.rte.active.window;
			self.doc = self.rte.active.document;
		}).bind('source close', function(e) {
			// on source mode or on close active document switch to global objects to avoid errors
			if (e.type == 'source' || e.data.id == self.rte.active.id) {
				self.win  = window;
				self.doc  = document;
			}
		});
		
		/**
		 * Return selection object
		 *
		 * @return Selection
		 **/
		this.selection = function() {
			return this.win.getSelection();
		}
		
		/**
		 * Return text range object
		 *
		 * @return Range
		 **/
		this.range = function() {
			var s = this.selection();
			return s && s.rangeCount ? s.getRangeAt(0) : this.doc.createRange();
		}
		
		/**
		 * Return true if range collapsed
		 *
		 * @return Boolean
		 **/
		this.collapsed = function() {
			return this.range().collapsed;
		}
		
		/**
		 * Collapse range
		 *
		 * @param  Boolean   collapse to start
		 * @return elRTE.Selection
		 **/
		this.collapse = function(st) {
			var s = this.selection(),
				r = this.range();
			r.collapse(st?true:false);
			s.removeAllRanges();
			s.addRange(r);
			return this;
		}
		
		/**
		 * Select from start node to end node
		 *
		 * @param  DOMElement
		 * @param  DOMElement
		 * @return elRTE.Selection
		 **/
		this.select = function(sn, en) {
			var s = this.selection(),
				r = this.doc.createRange(), r1, r2;

			if (this.dom.isNode(sn)) {
				if (this.dom.isNode(en) && en !== sn) {
					r1 = this.doc.createRange();
					r2 = this.doc.createRange();
					r1.selectNode(sn)
					r2.selectNode(en);
					if (r1.compareBoundaryPoints(r1.START_TO_END, r2) == 1) {
						r.setStartBefore(en);
						r.setEndAfter(sn);
					} else {
						r.setStartBefore(sn);
						r.setEndAfter(en);
					}
				} else {
					r.selectNode(sn);
				}
				s.removeAllRanges();
				s.addRange(r);
			} else {
				this.rte.debug('error.selection', 'select(): sn is not node');
			}
			return this;
		}
		
		/**
		 * Select all nodes in active document
		 *
		 * @return elRTE.Selection
		 **/
		this.selectAll = function() {
			return this.select(this.doc.body.firstChild, this.doc.body.lastChild);
		}
		
		/**
		 * Select node contents
		 *
		 * @param  DOMElement
		 * @return elRTE.Selection
		 **/
		this.selectContents = function(n) {
			var s = this.selection(),
				r = this.doc.createRange();
				
			if (this.dom.isNode(n)) {
				r.selectNodeContents(n);
				s.removeAllRanges();
				s.addRange(r);
			} else {
				this.rte.debug('error.selection', 'selectContents(): n is not a node');
			}
			
			return this
		}
		
		/**
		 * Insert node into selection and return node on success
		 * Return node need to compatibility with IE selection
		 *
		 * @param  DOMElement
		 * @return DOMElement|undefined
		 **/
		this.insertNode = function(n) {
			var s = this.selection(),
				r = this.range();
				
			try {
				r.insertNode(n);
			} catch (e) {
				return this.rte.debug('error.selection', 'insertNode(): '+e.message);
			}
			this.select(n).collapse()
			return n;
		}
		
		/**
		 * Insert html into selection and return nodes list
		 *
		 * @param  String
		 * @return Array|undefined
		 **/
		this.insertHtml = function(h) {
			var n = this.insertNode($(this.dom.create('span')).html(h||'')[0]), r;
			
			if (n) {
				r = Array.prototype.slice.call(n.childNodes);
				this.dom.unwrap(n);
				r.length && this.select(r[r.length-1]).collapse();
				return r;
			}
		}
	
		/**
		 * Insert bookmarks (spans) in begin and end of selection and return its;
		 *
		 * @return Array
		 **/
		this.bookmark = function() {
			var r  = this.range(),
				r1 = r.cloneRange(),
				r2 = r.cloneRange(),
				s  = this.dom.createBookmark(),
				e  = this.dom.createBookmark();

			r2.collapse(false);
			r2.insertNode(e);
			r1.collapse(true);
			r1.insertNode(s);
			this.select(s, e);
			return [s, e];
		}

		/**
		 * Move selection to bookmarks and remove it.
		 *
		 * @param  Array  bookmark nodes or ids
		 * @return elRTE.selection
		 **/
		this.toBookmark = function(bm) {
			var s = bm[0] && bm[0].nodeType == 1 ? bm[0] : this.doc.getElementById(''+bm[0]),
				e = bm[1] && bm[1].nodeType == 1 ? bm[1] : this.doc.getElementById(''+bm[1]),
				c = true;

			this.select(s, e);
			if ($.browser.mozilla || $.browser.opera) {
				$.each(this.dom.nextUntil(s, e), function(i, n) {
					if (n.nodeType == 1 || (n.textContent != '')) {
						return c = false;
					}
				});
				c && this.collapse();
			}
			this.dom.remove([s, e]);
			return this;
		}

		/**
		 * Remove bookmarks
		 *
		 * @param  Array  bookmark nodes or ids
		 * @return elRTE.selection
		 **/
		this.rmBookmark = function(bm) {
			this.dom.remove([bm[0] && bm[0].nodeType == 1 ? bm[0] : this.doc.getElementById(''+bm[0]), bm[1] && bm[1].nodeType == 1 ? bm[1] : this.doc.getElementById(''+bm[1])]);
			return this;
		}

		/**
		 * Return array of nodes cloned from selection 
		 *
		 * @return Array
		 **/
		this.cloneContents = function() {
			return this.range().cloneContents()
			return Array.prototype.slice.call(this.range().cloneContents().childNodes);
		}
		
		this.node = function() {
			var n = this.range().commonAncestorContainer;
			return n;
			return n.nodeType == 1 ? n : n.parentNode;
		}
		
	}
	
	/**
	 * @return Selection
	 **/
	elRTE.prototype.selection.prototype.getSelection = function() {
		return this.win.getSelection();
		// return (this.rte.active.window || window).getSelection();
	}

	/**
	 * @return Range
	 **/
	elRTE.prototype.selection.prototype.getRange = function() {
		var s = this.getSelection();
		// return s && s.rangeCount ? s.getRangeAt(0) : (this.rte.active.document || document).createRange();
		return s && s.rangeCount ? s.getRangeAt(0) : this.doc.createRange();
	}

	/**
	 * return true if range is collapsed
	 * @return Boolean
	 **/
	elRTE.prototype.selection.prototype.collapsed = function() {
		return this.getRange().collapsed;
	}

	/**
	 * collapse range
	 *
	 * @param  Boolean  collapse to start?
	 * @return selection
	 **/
	elRTE.prototype.selection.prototype.collapse = function(toStart) {
		var s = this.getSelection(), 
			r = this.getRange();
		r.collapse(toStart);
		s.removeAllRanges();
		s.addRange(r);
		return this;
	}


	
	/**
	 * Return clone of selection contents wrapped in div
	 *
	 * @return DOMElement
	 **/
	elRTE.prototype.selection.prototype.cloneContents = function() {
		var c = this.getRange().cloneContents(),
			l = c.childNodes.length, i,
			n = this.dom.create('div');
		for (i=0; i<l; i++) {
			n.appendChild(c.childNodes[i].cloneNode(true));
		}
		return n;
	}
	
	/**
	 * select from start node to end node
	 * @param  DOMElement
	 * @param  DOMElement
	 * @return w3cSelection
	 **/
	elRTE.prototype.selection.prototype.select = function(st, en) {
		var s = this.getSelection(),
			r = this.getRange();

		if (en) {
			r.setStartBefore(st);
			r.setEndAfter(en);
		} else {
			r.selectNode(st);
		}
		
		s.removeAllRanges();
		s.addRange(r);
		return this;
	}
	
	elRTE.prototype.selection.prototype.selectContents = function(n) {
		var s = this.getSelection(),
			r = this.getRange();	
		r.selectNodeContents(n);
		return this;
	}
	
	/**
	 * Insert node into begining of selection
	 * @param  DOMElement
	 * @return DOMElement
	 **/
	elRTE.prototype.selection.prototype.insertNode = function(n) {
		var r = this.getRange();
		r.deleteContents();
		r.insertNode(n);
		return n;
	}
	
	/**
	 * Insert html into selection
	 * @param  String
	 * @return selection
	 **/
	elRTE.prototype.selection.prototype.insertHtml = function(html) {
		var n = this.insertNode($(this.dom.create('span')).html(html||'')[0]),
			l = n.lastChild;

		this.rte.dom.unwrap(n);
		if (l && l.parentNode) {
			this.select(l);
			this.collapse();
		}
		return this;
	}
	
	/**
	 * Create bookmark (to store selection)
	 * @return Array
	 **/
	elRTE.prototype.selection.prototype.getBookmark = function() {
		var r  = this.getRange(),
			r1 = r.cloneRange(),
			r2 = r.cloneRange(),
			s  = this.dom.createBookmark(),
			e  = this.dom.createBookmark();
		
		r2.collapse(false);
		r2.insertNode(e);
		r1.collapse(true);
		r1.insertNode(s);
		this.select(s, e);
		return [s, e];
	}
	
	/**
	 * Move selection to bookmark
	 *
	 * @param Array  array of DOMElements - bookmarks nodes or ids list
	 * @return selection
	 **/
	elRTE.prototype.selection.prototype.moveToBookmark = function(b) {
		var d = this.rte.active.document,
			s = typeof(b[0]) == 'string' ? d.getElementById(b[0]) : b[0],
			e = typeof(b[1]) == 'string' ? d.getElementById(b[1]) : b[1];
		if (s && e) {
			this.select(s, e);
			if ($.browser.mozilla || $.browser.opera) {
				if (s.nextSibling.nodeType == 3 && s.nextSibling.textContent == '' && s.nextSibling.nextSibling == e) {
					this.collapse();
				}
			}
			s.parentNode.removeChild(s);
			e.parentNode.removeChild(e);
		}
		return this;
	}
	
	/**
	 * Remove bookmark nodes
	 *
	 * @param Array  array of DOMElements - bookmark nodes
	 * @return selection
	 **/
	elRTE.prototype.selection.prototype.removeBookmark = function(b) {
		var s = typeof(b[0]) == 'string' ? this.doc.getElementById(b[0]) : b[0],
			e = typeof(b[1]) == 'string' ? this.doc.getElementById(b[1]) : b[1];
		if (s && e) {
			s.parentNode.removeChild(s);
			e.parentNode.removeChild(e);
		}
		return this;
	}
	
	/**
	 * Remove all bookmarks nodes
	 * @return selection
	 **/
	elRTE.prototype.selection.prototype.cleanBookmarks = function(b) {
		$(this.doc.body).find('.elrtebm').remove();
		return this;
	}
	
	/**
	 * Return cached node or common ancestor for selected nodes
	 *
	 * @return DOMElement
	 **/
	elRTE.prototype.selection.prototype.getNode = function() {
		var n = this._node || this.getRange().commonAncestorContainer;
		return n.nodeType == 1 ? n : n.parentNode;
	}
	
	elRTE.prototype.selection.prototype.getSelected = function() {
		var res = [], s, e, c, b;
		
		if (!this.collapsed()) {
			
			b = this.getBookmark();
			this.doc.body.normalize();

			s = b[0];
			e = b[1];
			c = this.dom.commonAncestor(s, e);

			while (this.dom.is(s, 'first') && s.parentNode != c) {
				s.parentNode.parentNode.insertBefore(s, s.parentNode);
			}

			while (this.dom.is(s, 'last') && s.parentNode != c) {
				if (s.parentNode.nextSibling) {
					s.parentNode.parentNode.insertBefore(s, s.parentNode.nextSibling);
				} else {
					s.parentNode.parentNode.appendChild(s);
				}
			}
				
			while (this.dom.is(e, 'last') && e.parentNode != c) {
				if (e.parentNode.nextSibling) {
					e.parentNode.parentNode.insertBefore(e, e.parentNode.nextSibling);
				} else {
					e.parentNode.parentNode.appendChild(e);
				}
			} 

			while (this.dom.is(e, 'first') && e.parentNode != c) {
				e.parentNode.parentNode.insertBefore(e, e.parentNode);
			}

			while (c.nodeName != 'BODY' && s.parentNode == c && e.parentNode == c && this.dom.is(s, 'first') && this.dom.is(e, 'last')) {
				c.parentNode.insertBefore(s, c);
				if (c.nextSibling) {
					c.parentNode.insertBefore(e, c.nextSibling);
				} else {
					c.parentNode.appendChild(e)
				}
				c = c.parentNode;
				this.rte.log('levelUp!')
			}
			
			res = this.dom.traverse(s, e, c);
			this.removeBookmark(b);
			res.shift();
			res.pop();
			return res;
			// 
			// while (this.dom.is(s, 'first') && s!=c && s.parentNode != this.doc.body) {
			// 	s = s.parentNode; 
			// }
			// while (this.dom.is(e, 'last') && e!=c && e.parentNode != this.doc.body) {
			// 	e = e.parentNode;
			// }
			// c = this.dom.commonAncestor(s, e);
			// 
			// res = this.dom.traverse(s, e, c);
			// 
			// res[0] == b[0] && res.shift();
			// res[res.length-1] == b[1] && res.pop();
			// 
			// this.removeBookmark(b);
			// if (res.length==1 && this.dom.is(res[0], 'onlyChild') && res[0].parentNode != this.doc) {
			// 	res = [res[0].parentNode];
			// }
		}

		return res;
	}
	
	elRTE.prototype.selection.prototype.filterSelected = function(f) {
		return this.dom.filter(this.getSelected(), f);
	}
	
	elRTE.prototype.selection.prototype.wrapSelected = function(f, wf, w) {
		return this.dom.wrapAll(this.filterSelected(f), wf, w);
	}
	
	elRTE.prototype.selection.prototype.selected = function(opts) {
		var o = $.extend({ filter : '', wrapFilter : '', wrapNode : ''}, opts||{}),
			s = this.getSelected();
			
		if (o.filter) {
			s = this.dom.filter(s, o.filter);
		}
		if (o.wrapFilter && o.wrapNode) {
			s = this.dom.wrapAll(s, o.wrapFilter, o.wrapNode);
		}
		return s;
	}
	
	
	
})(jQuery);