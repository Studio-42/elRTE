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
		}, true).bind('source close', function(e) {
			// on source mode or on close active document switch to global objects to avoid errors
			if (e.type == 'source' || e.data.id == self.rte.active.id) {
				self.win  = window;
				self.doc  = document;
			}
		}, true);
		
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
						// this.rte.log('here')
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
			this.rte.focus();
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
		 * Move selection into node next for required [and collapse]
		 *
		 * @param  DOMElement
		 * @param  Boolean|undefined  collapse to start/end or not collapse
		 * @return elRTE.Selection
		 **/
		this.selectNext = function(n, c) {
			var s = this.dom.next(n), t;
			
			!s && n.parentNode.appendChild((s = this.dom.createTextNode("")));
			if (c && $.browser.webkit) {
				s.parentNode.insertBefore((t = this.dom.createTextNode('\uFEFF')), s);
				$(this.doc).one('keyup mouseup', function() {
					t.nodeValue = t.nodeValue.replace('\uFEFF', '');
				});
			}
			this.select(s);
			c != void 0 && this.collapse(!!c);
			return this;
		}
		
		/**
		 * Surrounds selection with new node. If selection collapsed, do some browser spec stuffs
		 *
		 * @param  DOMElement
		 * @return DOMElement
		 **/
		this.surroundContents = function(n) {
			var s = this.selection(),
				r = this.range(), t;
				
			if (this.collapsed()) {
				if (n = this.insertNode(n)) {
					n.appendChild((t = this.dom.createTextNode($.browser.webkit ? '\uFEFF' : '')));
					this.selectContents(n).collapse(false);
					$.browser.webkit && $(this.doc).one('keyup mouseup', function() {
							t.nodeValue = t.nodeValue.replace('\uFEFF', '');
						});
				}
			} else {
				r.surroundContents(n);
				s.removeAllRanges();
				s.addRange(r);
			}
			return n;
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
			var s = bm && bm[0] ? (bm[0].nodeType == 1 ? bm[0] : this.doc.getElementById(''+bm[0])) : false,
				e = bm && bm[1] ? (bm[1].nodeType == 1 ? bm[1] : this.doc.getElementById(''+bm[1])) : false, n;

			if (this.dom.isNode(s) && this.dom.isNode(e)) {
				this.select(s, e);
				if ($.browser.mozilla || $.browser.opera) {
					if ((n = s.nextSibling) && (n === e || (n.nextSibling === e && n.nodeType != 1 && n.nodeValue == '')) ) {
						this.collapse();
					}
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
			var s = bm && bm[0] ? (bm[0].nodeType == 1 ? bm[0] : this.doc.getElementById(''+bm[0])) : false,
				e = bm && bm[1] ? (bm[1].nodeType == 1 ? bm[1] : this.doc.getElementById(''+bm[1])) : false;

			this.dom.isNode(s) && this.dom.isNode(e) && this.dom.remove([s, e]);
			return this;
		}

		/**
		 * Return array of nodes cloned from selection 
		 *
		 * @return Array
		 **/
		this.cloneContents = function() {
			return this.range().cloneContents();
		}
		
		this.deleteContents = function() {
			this.range().deleteContents();
			return this;
		}
		
		/**
		 * Return selection common ancestor container
		 *
		 * @return DOMElement
		 **/
		this.node = function() {
			var n = this.range().commonAncestorContainer;
			return n;
			return n.nodeType == 1 ? n : n.parentNode;
		}
		
		/**
		 * Return array of selected nodes
		 *
		 * @return Array
		 **/
		this.get = function(exp) {
			var r = [], bm, s, e, c;
			
			if (!this.collapsed()) {
				bm = this.bookmark();
				this.doc.body.normalize();
				s = bm[0].nextSibling;
				e = bm[1].previousSibling||bm[1].parentNode.previousSibling||this.dom.after(this.dom.createTextNode(''), bm[1]);
				this.rmBookmark(bm);
				// this.rte.log(s)
				// this.rte.log(e)
				
				// fix selection. 
				while (this.dom.parents(e, function(n) { return n == s }).length) {
					this.rte.log('fix1')
					s = s.firstChild;
				}
				while (this.dom.parents(s, function(n) { return n == e }).length) {
					this.rte.log('fix2')
					e = e.lastChild;
				}
				c = this.dom.commonAncestor(s, e);
				// move start node up as posiible but not up container
				while (s !=c && s.parentNode !=c && this.dom.is(s, 'first')) {
					s = s.parentNode;
				}
				// move end node up as posiible but not up container
				while (e !=c && e.parentNode != c && this.dom.is(e, 'last')) {
					e = e.parentNode;
				}
				// expand selection - move start, end and common ancestor container up as posiible
				while (c.nodeName != 'BODY' && s.parentNode == c && e.parentNode == c && this.dom.is(s, 'first') && this.dom.is(e, 'last')) {
					s = e = c;
					c = c.parentNode;
					if (!exp) {
						break;
					}
				}
				// this.rte.log(s)
				// this.rte.log(e)
				// this.rte.log(c)
				r = s === e ? [s] : this.dom.traverse(s, e, c);
			}
			return r;
		}
	}
	
	
})(jQuery);