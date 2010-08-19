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
					// check start node is before end node
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
			if (this.dom.isNode(s) && this.dom.isNode(e)) {
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
			}
			
			return this;
		}

		/**
		 * Remove bookmarks
		 *
		 * @param  Array  bookmark nodes or ids
		 * @return elRTE.selection
		 **/
		this.rmBookmark = function(bm) {
			var s = bm[0] && bm[0].nodeType == 1 ? bm[0] : this.doc.getElementById(''+bm[0]),
				e = bm[1] && bm[1].nodeType == 1 ? bm[1] : this.doc.getElementById(''+bm[1]);
			if (this.dom.isNode(s) && this.dom.isNode(e)) {
				this.dom.remove([s, e]);
			}
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
		
		this.get = function() {
			var r = [], bm;
			
			if (!this.collapsed()) {
				bm = this.bookmark();
				this.doc.body.normalize();
				
				s = bm[0].nextSibling;
				e = bm[1].previousSibling;
				this.rmBookmark(bm);
				
				while (this.dom.parents(e, function(n) { return n == s }).length) {
					s = s.firstChild;
				}
				while (this.dom.parents(s, function(n) { return n == e }).length) {
					e = e.firstChild;
				}
				c = this.dom.commonAncestor(s, e);
				this.rte.log(c)
				
				// this.rte.log(this.dom.is(c, 'onlyChild'))
				
				while (c.nodeName != 'BODY' && c.parentNode.nodeName != 'BODY' && this.dom.is(c, 'onlyChild')) {
					this.rte.log('move from '+c.nodeName+' to '+c.parentNode.nodeName)
					c = c.parentNode;
				}
				this.rte.log(c)
				
				// var t = this.dom.parents(e, function(n) { return n == s })
				// this.rte.log(t)
				
				while (s !=c && s.parentNode !=c && this.dom.is(s, 'first')) {
					s = s.parentNode;
				}
				while (e !=c && e.parentNode != c && this.dom.is(e, 'last')) {
					e = e.parentNode;
				}
				
				if (s.parentNode == c && e.parentNode == c && this.dom.is(s, 'first') && this.dom.is(e, 'last')) {
					s = e = s.parentNode
				}
				
				this.rte.log(s)
				this.rte.log(e)
				// return false
				// this.rte.log(c)
				r = s === e ? [s] : this.dom.traverse(s, e, c);
			}
			return r;
		}
	}
	
	// elRTE.prototype.selection.prototype.filterSelected = function(f) {
	// 	return this.dom.filter(this.getSelected(), f);
	// }
	// 
	// elRTE.prototype.selection.prototype.wrapSelected = function(f, wf, w) {
	// 	return this.dom.wrapAll(this.filterSelected(f), wf, w);
	// }
	// 
	// elRTE.prototype.selection.prototype.selected = function(opts) {
	// 	var o = $.extend({ filter : '', wrapFilter : '', wrapNode : ''}, opts||{}),
	// 		s = this.getSelected();
	// 		
	// 	if (o.filter) {
	// 		s = this.dom.filter(s, o.filter);
	// 	}
	// 	if (o.wrapFilter && o.wrapNode) {
	// 		s = this.dom.wrapAll(s, o.wrapFilter, o.wrapNode);
	// 	}
	// 	return s;
	// }
	
	
	
})(jQuery);