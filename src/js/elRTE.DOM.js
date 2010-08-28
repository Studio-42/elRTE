/*
 * DOM utilites for elRTE 
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 */
(function($) {
elRTE.prototype.dom = function(rte) {
	var self  = this;
	this.rte  = rte;
	this.doc = document;
	this.body = document.body;
	this.html = document.body.parentNode;
	
	this.textRegExp = /^(A|ABBR|ACRONYM|ADDRESS|B|BDO|BIG|BLOCKQUOTE|BUTTON|CAPTION|CENTER|CITE|CODE|DD|DT|DEL|DFN|DIV|DT|EM|FONT|H[1-6]|I|INS|KBD|LABEL|LEGEND|LI|MARQUEE|NOBR|NOEMBED|P|PRE|Q|S|SAMP|SMALL|SPAN|STRIKE|STRONG|SUB|SUP|TD|TH|TT|U|VAR)$/;
	
	this.filters = {
		any : /.*/,
		block : /^(ADDRESS|BLOCKQUOTE|CENTER|DD|DT|DIR|DIV|DL|FIELDSET|FORM|H[1-6]|HR|LI|OBJECT|OL|P|PRE|TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|UL)$/,
		text  : function(n) { return n.nodeType == 3 || self.textRegExp.test(n.nodeName);  },
		textNode : function(n) { return n.nodeType == 3; },
		inline : function(n) { return n.nodeType == 3 || !self.filters.block.test(n.nodeName); },
		// @TODO check for nested not text node
		empty : function(n) { return n.nodeType == 1 ? !n.childNodes.length || !$.trim($(n).text()).length : !$.trim(n.nodeValue).length; },
		notEmpty : function(n) { return !self.filters.empty(n); },
		first : function(n) { return n.nodeName != 'BODY' && !self.prevAll(n, 'notEmpty').length; },
		last : function(n) { return n.nodeName != 'BODY' && !self.nextAll(n, 'notEmpty').length; },
		onlyChild : function(n) { return self.filters.first(n) && self.filters.last(n); }
	};
	
	
	
	this.rte.bind('wysiwyg', function(e) {
		self.doc  = self.rte.active.document;
		self.body = self.doc.body;
		self.html = self.doc.body.parentNode;
	}).bind('close source', function(e) {
		if (e.type == 'source' || e.data.id == self.rte.active.id) {
			self.doc  = document;
			self.body = document.body;
			self.html = document.body.parentNode;
		}
	});
	
	/**
	 * Create and return DOM Element
	 *
	 * @param  String|Array  Node name or node description map
	 * @return DOMElement
	 **/
	this.create = function(o) {
		var n;
		o = $.isPlainObject(o) && o.name ? o : { name : ''+o };
		try {
			n = this.doc.createElement(o.name);
		} catch (e) {
			this.rte.debug('error.dom', 'create(): unable create '+o.name);
			n = this.doc.createElement('span');
		}
		n = $(n);
		
		$.isPlainObject(o.attr) && n.attr(o.attr);
		$.isPlainObject(o.css) && n.attr(o.css);
		o['class'] && n.addClass(o['class']);
		return n[0];
	}
	
	/**
	 * Create and return text node with required text
	 *
	 * @param  String  node text
	 * @return DOMElement
	 **/
	this.createTextNode = function(d) {
		return this.doc.createTextNode(d)
	}
	
	/**
	 * Return node for bookmark with unique ID
	 *
	 * @return DOMElement
	 **/
	this.createBookmark = function() {
		return this.create({
			name    : 'span', 
			'class' : 'elrtebm',
			attr    : {
				id    : 'elrte-bm-'+Math.random().toString().substr(2), 
				elrte : 'bm' 
			}			
		});
	}
	
	/********************************************************************************/
	/*                                 SELECTORS                                    */
	/********************************************************************************/
	
	/**
	 * Return true if it is node in DOM
	 *
	 * @param  DOMElement
	 * @return Boolean
	 **/
	this.isNode = function(n) {
		return n && n.nodeType && n.parentNode;
	}
	
	/**
	 * Return true if node matched by filter
	 *
	 * @param  DOMElement      node to test
	 * @param  String|RegExp|Function  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.is = function(n, f) {
		if (n && n.nodeType) {
			f = f||'any';
			if (typeof(f) == 'string' && this.filters[f]) {
				f = this.filters[f];
			}
			if (typeof(f) == 'function') {
				return f(n);
			} else if (f instanceof RegExp) {
				return f.test(n.nodeName);
			}
		}
		return false;
	}
	
	/**
	 * Return nodes matched by filter
	 *
	 * @param  Array                   array of nodes to test
	 * @param  String|RegExp|Function  filter name or RegExp or function
	 * @return Array
	 **/
	this.filter = function(n, f) {
		var r = [], self = this;
		
		$.each(n||[], function(i, node) {
			if (self.is(node, f)) {
				r.push(node)
			}
		})
		return r;
	}
	
	/**
	 * Return any children nodes matched by filter
	 *
	 * @param  DOMElement               node to test
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.find = function(n, f) {
		var r = [], self = this;
		
		if (n && n.nodeType) {
			$.each(n.childNodes, function(i, c) {
				self.is(c, f) && r.push(c);
				if (c.nodeType == 1) {
					r = r.concat(self.find(c, f));
				}
			});
		}
		return r;
	}
	
	/**
	 * Return true, if all nodes in set is one parent childs
	 *
	 * @param  Array
	 * @return Boolean
	 **/
	this.isSiblings = function(n) {
		var l = n.length;
		while (l--) {
			if (n[l].parentNode != n[0].parentNode) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * Return true, if node in set has children matched by filter
	 *
	 * @param  Array  nodes set
	 * @param  String|RegExp|Function filter 
	 * @return Boolean
	 **/
	this.has = function(n, f) {
		n = $.isArray(n) ? n : [n], l = n.length;
		while (l--) {
			if (this.descendants(n[l], f).length) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Return node position number in parent
	 *
	 * @param  DOMElement 
	 * @return Integer
	 **/
	this.indexOf = function(n) {
		var ndx = 0;
		while ((n = this.prev())) {
			ndx++;
		}
		return ndx;
	}
	
	/********************************************************************************/
	/*                                TRAVERSING                                    */
	/********************************************************************************/

	/**
	 * Return node parent if matched by filter
	 *
	 * @param  DOMElement              node to test
	 * @param  String|RegExp|Function  filter
	 * @param  DOMElement              find parents not up this
	 * @return DOMElement|false
	 **/
	this.parent = function(n, f, until) {
		var p;
		
		if (this.isNode(n)) {
			if (!until || !this.isNode(until)) {
				until = this.body;
			}
			if (n != until && (p = n.parentNode) && p != until) {
				return this.is(p, f) ? p : false;
			}
		}
		return false;
	}
	
	/**
	 * Return all parents matched by filter
	 *
	 * @param  DOMElement              node to test
	 * @param  String|RegExp|Function  filter
	 * @param  DOMElement              find parents not up this
	 * @return Array
	 **/
	this.parents = function(n, f, addSelf, until) {
		var r = [];
		if (!until || !this.isNode(until)) {
			until = this.body;
		}
		if (this.isNode(n) && n != until) {
			if (addSelf && this.is(n, f)) {
				r.push(n);
			}
			while ((n = this.parent(n, 'any', until))) {
				this.is(n, f) && r.push(n);
			}
		}
		return r;
	}
	
	/**
	 * Return direct children nodes matched by filter
	 *
	 * @param  DOMElement               node to test
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.children = function(n, f) {
		return n && n.nodeType == 1 && n.childNodes.length ? this.filter(n.childNodes, f||'any') : [];
	}
	
	/**
	 * Return closest children nodes matched by filter
	 *
	 * @param  DOMElement               parent node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.closest = function(n, f) {
		var r = [], self = this;
		
		if (n && n.nodeType == 1) {
			$.each(n.childNodes, function(i, c) {
				if (self.is(c, f)) {
					r.push(c);
				} else if (c.nodeType == 1) {
					r = r.concat(self.closest(c, f));
				}
			});
		}
		return r;
	}
	
	/**
	 * Return next sibling node matched by filter
	 *
	 * @param  DOMElement               node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return DOMElement
	 **/
	this.next = function(n, f) {
		return this.isNode(n) && n.nextSibling
			? this.is(n.nextSibling, f) ? n.nextSibling : false
			: false;
	}
	
	/**
	 * Return all next siblings matched by filter
	 *
	 * @param  DOMElement               node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.nextAll = function(n, f) {
		var r = [];
		while ((n = this.next(n))) {
			this.is(n, f) && r.push(n);
		}
		return r;
	}
	
	/**
	 * Return all next siblings matched by filter until required node
	 *
	 * @param  DOMElement               node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @param  DOMElement               stop node
	 * @return Array
	 **/
	this.nextUntil = function(n, f, e) {
		var r = [];

		while ((n = this.next(n)) && n !== e) {
			this.is(n, f) && r.push(n);
		}
		return r;
	}
	
	/**
	 * Return previous sibling node matched by filter
	 *
	 * @param  DOMElement               node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return DOMElement
	 **/
	this.prev = function(n, f) {
		return this.isNode(n) && n.previousSibling
			? this.is(n.previousSibling, f) ? n.previousSibling : false
			: false;
	}
	
	/**
	 * Return all previous siblings matched by filter
	 *
	 * @param  DOMElement               node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.prevAll = function(n, f) {
		var r = [];
		while ((n = this.prev(n))) {
			this.is(n, f) && r.push(n);
		}
		return r;
	}
	
	/**
	 * Return all previous siblings matched by filter until required node
	 *
	 * @param  DOMElement               node
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @param  DOMElement               stop node
	 * @return Array
	 **/
	this.prevUntil = function(n, f, e) {
		var r = [];

		while ((n = this.prev(n)) && n !== e) {
			this.is(n, f) && r.push(n);
		}
		return r;
	}
	
	/**
	 * Return closest common parent node for 2 nodes
	 *
	 * @param  DOMElement
	 * @param  DOMElement
	 * @return DOMElement
	 **/
	this.commonAncestor = function(s, e) {
		var c = this.body, sp, ep, l, i=-1;
		
		if (this.isNode(s) && this.isNode(e)) {
			
			if (s === e) {
				c = s;
			} else {
				sp = this.parents(s).reverse();
				ep = this.parents(e).reverse();
				l = Math.min(sp.length, ep.length);

				while (++i < l && sp[i] === ep[i]) {
					c = sp[i];
				}
			}
		}
		return c;
	}
	
	/**
	 * Return list of nodes between start and end nodes
	 *
	 * @param  DOMElement  start node
	 * @param  DOMElement  end node
	 * @param  DOMElement  common nodes container
	 * @return Array
	 **/
	this.traverse = function(s, e, c) {
		var c   = c||this.commonAncestor(s, e), 
			sp  = this.parents(s, 'any', true, c).pop(), 
			ep  = this.parents(e, 'any', true, c).pop(), 
			n   = s, 
			r   = [s], 
			tmp = [e];
		
		if (s !== e) {
			// s === sp && r.push(s);
			while (n != sp) {
				r = r.concat(this.nextAll(n))
				n = n.parentNode;
			}
			r = r.concat(this.nextUntil(sp, 'any', ep))

			n = e;
			while (n != ep) {
				tmp = tmp.concat(this.prevAll(n));

				n = n.parentNode;
			}
			r = r.concat(tmp.reverse());
			// e === ep && r.push(e);
		}
		return r;
	}
	


	/********************************************************************************/
	/*                             SEARCH IN SELECTION                              */
	/********************************************************************************/
	/**
	 * Return true if selection or any parent or any child matches filter
	 *
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.testSelection = function(f) {
		var n = this.rte.selection.node();
		return this.is(n, f) || this.parents(n, f).length ? true : !!this.find(this.rte.selection.cloneContents(), f).length;
	}
	
	
	/********************************************************************************/
	/*                                MANIPULATION                                  */
	/********************************************************************************/
	
	
	
	/**
	 * Return node[s]
	 *
	 * @param  DOMElement|Array  node(s) to remove
	 * @return elRTE.dom
	 **/
	this.remove = function(o) {
		var self = this;
		$.each(o.length ? o : [o], function(i, n) {
			self.isNode(n) && n.parentNode.removeChild(n);
		});
		return this;
	}
	
	/**
	 * Wrap each node with other node
	 *
	 * @param  DOMElement|Array n node(s) to wrap
	 * @param  DOMElement|String w wrap node or nodename 
	 * @return void
	 **/
	this.wrap = function(n, w) {
		n = $.isArray(n) ? n : [n], l = n.length;
		w = w.nodeType ? w : this.create(w);
		while (l--) {
			if (this.is(n[l], 'block') || this.is(n[l], 'text') || n[l].nodeName == 'IMG') {
				n[l].parentNode.insertBefore((w = w.cloneNode(false)), n[l]);
				w.appendChild(n[l]);
			}
		}
	}
	
	/**
	 * Wrap group of nodes with other node
	 *
	 * @param  DOMElement|Array n node(s) to wrap
	 * @param  DOMElement|String w wrap node or nodename 
	 * @return void
	 **/
	this.wrapAll = function(n, w) {
		if ($.isArray(n) && n.length>0) {
			for (i=0; i < n.length; i++) {
				i == 0 && n[i].parentNode.insertBefore((w = w.nodeType ? w : this.create(w)), n[i]);
				w.appendChild(n[i]);
			};
		}
	}
	
	/**
	 * Wrap node contents with other node
	 *
	 * @param  DOMElement n node to wrap
	 * @param  DOMElement|String w wrap node or nodename 
	 * @return void
	 **/
	this.wrapInner = function(n, w) {
		if (n.nodeType == 1 && n.childNodes.length) {
			n.insertBefore((w = w.nodeType ? w : this.create(w)), n.firstChild);
			while ((n = this.next(w))) {
				w.appendChild(n);
			}
		}
	}
	
	/**
	 * Wrap node with other node depend on nodes types
	 * Method use some telepathy ability :)
	 *
	 * @param  DOMElement n node to wrap
	 * @param  DOMElement|String w wrap node or nodename 
	 * @return void
	 **/
	this.smartWrap = function(n, w) {
		var bn, n1, n2, i;
		
		w = w.nodeType ? w : this.create(w);
		
		if (this.is(w, 'blockText')) {
			// wrap is block text node
			if (w.nodeName == 'P') {
				// block nodes not allowed inside paragraph
				if (this.is(n, 'blockText')) {
					// wrap contents of text block node
					this.wrapInner(n, w);
				} else if (this.is(n, 'inline')) {
					// wrap any inline node
					// this.rte.log(n)
					this.wrap(n, w);
				}
			} else {
				// wrap any node
				this.wrap(n, w);
			}
		} else if (this.is(w, 'inlineText')) {
			// wrap is inline text node
			if (this.is(n, 'block') && !this.is(n, 'text')) {
				// node is table or list
				this.smartWrapAll(n.childNodes, w);
				// for (i=0; i<n.childNodes.length; i++) {
				// 	this.smartWrap(n.childNodes[i], w.cloneNode(false));
				// }
			} else if (this.is(n, 'text') && !this.is(n, 'empty')) {
				// node is non empty text node
				if ((bn = this.descendants(n, 'blockText')).length) {
					// node has child - block text node. we cannot wrapInner directly
					n1 = this.traverse(n.firstChild, bn[0]);
					n2 = this.traverse(bn[0], n.lastChild);
					n1.pop();
					n2.shift();
					// wrap nodes from node start till block child
					this.smartWrapAll(n1, w.cloneNode(false))
					// wrap block node
					this.smartWrap(bn[0], w.cloneNode(false));
					// wrap nodes from block child till node end
					this.smartWrapAll(n2, w.cloneNode(false))
				} else {
					// node does not contains block child
					if (this.is(n, 'block')) {
						this.wrapInner(n, w);
					} else {
						this.wrap(n, w);
					}
				}
			}
		}
	}
	
	/**
	 * Another one telepathy method :)
	 * Wrap group of nodes with other node depend on nodes types and nodes relative positions
	 *
	 * @param  DOMElement n node to wrap
	 * @param  DOMElement|String w wrap node or nodename 
	 * @return void
	 **/
	this.smartWrapAll = function(n, w) {
		var buffer = [], inline;
		
		w = w.nodeType == 1 ? w : this.create(w);
		inline = this.is(w, 'inline');
		
		function dropBuffer() {
			var empty = true, i;
			
			for (i=0; i < buffer.length; i++) {
				if (!self.is(buffer[i], 'empty')) {
					empty = false;
					break;
				}
			};
			if (!empty) {
				self.wrapAll(buffer, w.cloneNode(false));
			}
			buffer = [];
		}


		for (var i=0; i < n.length; i++) {
			if (inline && (this.is(n[i], 'blockText') || this.has(n[i], 'blockText'))) {
				dropBuffer();
				this.smartWrap(n[i], w.cloneNode(false));
			} else if (!buffer.length || n[i].parentNode == buffer[buffer.length-1].parentNode) {
				buffer.push(n[i]);
			} else {
				dropBuffer();
				this.smartWrap(n[i], w.cloneNode(false));
			}
			
		};
		dropBuffer();
	}
	
	/**
	 * Replace node with its contents
	 *
	 * @param  DOMElement n node
	 * @return void
	 **/
	this.unwrap = function(n) {
		while (n.firstChild) {
			n.parentNode.insertBefore(n.firstChild, n);
		}
		n.parentNode.removeChild(n);
	}
	
	/**
	 * Split node on two nodes by node-separator
	 *
	 * @param  DOMElement  node to split
	 * @param  DOMElement  node-separator
	 * @param  Boolean     split direction: from end of node-separator to node end (true) or from node start to separator start (false)
	 * @param 
	 * @return void
	 **/
	this.split = function(node, sep, end, test) {
		var r = [node], p, clone, sib;
		// this.rte.log(node)
		if (this.parents(sep, 'any', false, node.parentNode).pop() === node) {
			
		}

	}
	
	this._split = function(n, p, e, b) {
		var r = [n], pr, c, sib;
		
		while (p != n) {
			c = false;
			pr = p.parentNode; this.rte.log(pr)
			sib = e ? this.nextAll(p) : this.prevAll(p).reverse();
			if (sib.length && b(pr)) {
				c = pr.cloneNode(false);
				if (e) {
					if (pr.nextSibling) {
						pr.parentNode.insertBefore(c, pr.nextSibling);
					} else {
						pr.parentNode.appendChild(c);
					}
				} else {
					pr.parentNode.insertBefore(c, pr);
				}
				$.each(sib, function() {
					c.appendChild(this);
				});
			}
			p = pr;
		}
		if (c) {
			e ? r.push(c) : r.unshift(c);
		}
		return r;
	}
	
	this.slice = function(n, s, e, b) {
		var p, c, nodes, r = [n], tmp;
		
		s = this.isNode(s) ? s : n.firstChild;
		e = this.isNode(e) ? e : n.lastChild;
		
		tmp = this.split(n, s, false, b);
		r.unshift(tmp.length==2 ? tmp[0] : false)
		tmp = this.split(n, e, true, b);
		r.push(tmp.length==2 ? tmp[1] : false);
		
		return r;
	}
	
	this.smartUnwrap = function(n, ct, t, u) {
		var self = this, 
			st = n[0],
			en = n[n.length-1],
			unw = this.filter(n, function(n) { return t(n) || self.find(n, t).length; }),
			i = [],
			c;
		
		function container(c) {
			return c.nodeType == 1 ? c : self.parents(c, t).shift().parentNode;
		}
		c = container(this.commonAncestor(st, en));
		
		function intersect(n, dir) {
			var r = [],
				p = self.parents(n, t, false, c).pop(),
				s, // siblings 
				sm, // get siblings method
				im, // insert node method
				cl; // clone node
			if (dir == 'left') {
				sm = 'prevAll';
				im = 'insertBefore';
			} else {
				sm = 'nextAll';
				im = 'insertAfter';
			}

			if (p) {
				while (n !== p) {
					s = self[sm](n);
					n = n.parentNode;
					if (self.filter(s, 'notEmpty') && self.is(n, ct)) {
						cl = self[im](n.cloneNode(false), n);
						$.each(s, function() {
							cl.appendChild(this)
						});
					}
					if (self.is(n, t)) {
						r.push(n);
					}
				}
			}
			return r;
		}
		
		
		$.each($.unique([].concat(intersect(st, 'left')).concat(intersect(en, 'right'))), function(i, n) {
			u(n);
		})
		
		$.each(unw, function(i, n) {
			$.each(self.find(n, t), function() {
				u(this);
			});
			if (n === st) {
				st = n.firstChild;
			} else if (n === en) {
				en = n.lastChild;
			}
			u(n);
		})
		
		return [st, en]
		
		var self = this,
			st = n[0],
			en = n[n.length-1],
			c = this.commonAncestor(st, en),
			left, right, sib, toUnwrap = [];
		
		
		if (c.nodeType != 1) {
			c = this.parents(c, t).shift().parentNode;
		}
		
		function processIntersection(node, parent, test, cutTest, side) {
			var r = [], sib, clone;
			
			if (parent) {
				while (node !== parent) {
					sib = side == 'left' ? self.prevAll(node) : self.nextAll(node);
					node = node.parentNode;
					if (self.filter(sib, 'notEmpty').length && self.is(node, cutTest)) {
						clone = side == 'left' ? self.insertBefore(node.cloneNode(false), node) : self.insertAfter(node.cloneNode(false), node);
						$.each(sib, function(i, n) {
							clone.appendChild(this)
						});
					}
					if (self.is(node, test)) {
						r.push(node)
					}
				}
			}
			return r
		}
		
		toUnwrap = toUnwrap.concat(processIntersection(st, this.parents(st, t, false, c).pop(), t, b, 'left'))
			.concat(processIntersection(en, this.parents(en, t, false, c).pop(), t, b, 'right'))
		
		// left = this.parents(st, t, false, c).pop()
		// right = this.parents(en, t, false, c).pop()
		// this.rte.log(c)	
		// this.rte.log(left)
		// this.rte.log(b)
		// if (left) {
		// 	var node = st;
		// 	while (node != left) {
		// 		sib = this.prevAll(node)
		// 		node = node.parentNode;
		// 		if (this.filter(sib, 'notEmpty').length && this.is(node, b)) {
		// 			var clone = this.insertBefore(node.cloneNode(false), node)
		// 			$.each(sib, function(i, n) {
		// 				clone.appendChild(this)
		// 			});
		// 		}
		// 		if (this.is(node, t)) {
		// 			toUnwrap.push(node)
		// 		}
		// 	}
		// }
		// 
		// if (right) {
		// 	var node = en;
		// 	while (node != right) {
		// 		sib = this.nextAll(node)
		// 		node = node.parentNode;
		// 		if (this.filter(sib, 'notEmpty').length && this.is(node, b)) {
		// 			var clone = this.insertAfter(node.cloneNode(false), node)
		// 			$.each(sib, function(i, n) {
		// 				clone.appendChild(this)
		// 			});
		// 		}
		// 		if (this.is(node, t)) {
		// 			toUnwrap.push(node)
		// 		}
		// 	}
		// }
		
		this.rte.log($.unique(toUnwrap))
		$.each($.unique(toUnwrap), function(i, n) {
			u(n)
		})
		return n	
	}
	
	this.insertBefore = function(n, ref) {
		return ref.parentNode.insertBefore(n, ref)
	}
	
	this.insertAfter = function(n, ref) {
		var p = ref.parentNode,
			s = ref.nextSibling;
		return s ? p.insertBefore(n, s) : p.appendChild(n);
	}
	
	this.__smartUnwrap = function(n, b, t, u) {
		var start = n[0],
			end = n[n.length-1],
			left = this.parents(start, t).pop(),
			right = this.parents(end, t).pop(),
			toUnwrap = [], sib;
		
		// this.rte.log(n)
		this.rte.log(left)
		this.rte.log(this.parents(start, t))
		if (left) {
			var node = start;
			while (node !== left) {
				// this.rte.log(node)
				sib = this.prevAll(node)
				node = node.parentNode;
				if (sib.length && this.is(node, 'inline')) {
					var clone = node.cloneNode(false);
					node.parentNode.insertBefore(clone, node);
					$.each(sib, function(i, n) {
						clone.appendChild(this)
					})
					if (this.is(clone, 'empty')) {
						clone.parentNode.removeChild(clone)
					}
					
				}
				if (this.is(node, t)) {
					toUnwrap.push(node)
				}
			}
			
		}
		
		if (right) {
			var node = end;
			while (node !== right) {
				sib = this.nextAll(node);
				node = node.parentNode;
				if (sib.length && this.is(node, 'inline')) {
					var clone = node.cloneNode(false);
					this.insertAfter(clone, node)
					$.each(sib, function(i, n) {
						clone.appendChild(this)
					})
					if (this.is(clone, 'empty')) {
						clone.parentNode.removeChild(clone)
					}
					
				}
				if (this.is(node, t)) {
					toUnwrap.push(node)
				}
			}
		}
		// this.rte.log($.unique(toUnwrap))
		$.each($.unique(toUnwrap), function(i, n) {
			u(n)
		})
		
		return n
	}
	
	this._smartUnwrap = function(n, b, t, u) {
		var self = this,
			n = n && n.length ? n : [],
			s = n[0],
			e = n[n.length-1],
			a = this.commonAncestor(s, e),
			// t = typeof(t) == 'function' ? t : function() { return false },
			u = typeof(u) == 'function' ? u : function() { },
			l = this.parents(s, 'any', false, a.parentNode),
			r = this.parents(e, t),
			c = this.filter(n, function(n) { return t(n) || self.find(n, t).length; });
		this.rte.log(n)
		this.rte.log(a)
		this.rte.log(l)
		
		if (l.length) {
			var _n = s;
			
			while (_n !== a) {
				this.rte.log(_n)
				// this.rte.log(b(_n))
				_n = _n.parentNode;
				this.rte.log(_n)
				if (_n !== a && _n.nextSibling) {
					_n = _n.nextSibling
				}
			}
			
		}
		
		return n
		if (l.length || r.length || c.length) {
			if (l.length) {
				this.rte.log(l)
				var p = l.pop();
				var _n = s;
				
				while (_n !== p) {
					this.rte.log(_n)
					// this.rte.log(b(_n.parentNode))
					if (b(_n.parentNode)) {
						// this.rte.log(_n.parentNode)
						var sib = [_n].concat(this.nextAll(_n))
						this.rte.log(sib)
					}
					_n = _n.parentNode;
				}
			}
			
			return n;
			(l = l.length ? l.pop() : false) && this.split(l, s, false, b);
			(r = r.length ? r.pop() : false) && this.split(r, e, true,  b);
			
			l && $.each(this.parents(s, t), function() { u(this); });
			r && $.each(this.parents(e, t), function() { u(this); });
			$.each(c, function() {
				$.each(self.find(this, t), function() {
					u(this);
				});
				if (self.is(this, t)) {
					if (this === s) {
						s = this.firstChild;
					} else if (this === e) {
						e = this.lastChild;
					}
					u(this);
				}
			});
		}
		return [s, e];		
			
			
			this.rte.log(l)
			this.rte.log(r)
			this.rte.log(c)
			
	}
	
	/**
	 * Split node by boundary ponit. Return new node.
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement b point
	 * @param  Boolean    before  if true split before b, by default - after
	 * @return DOMElement
	 **/
	// this.split = function(n, b, before) {
	// 	var c = n, 		
	// 		nodes = before 
	// 			? this.is(b, 'first') ? [] : this.traverse(b, n.lastChild)
	// 			: this.is(b, 'last')  ? [] : this.traverse(this.next(b), n.lastChild);
	// 
	// 	if (nodes.length) {
	// 		c = n.cloneNode(false);
	// 		n.nextSibling 
	// 			? n.parentNode.insertBefore(c, n.nextSibling) 
	// 			: n.parentNode.appendChild(c);
	// 		for (var i=0; i < nodes.length; i++) {
	// 			c.appendChild(nodes[i])
	// 		};
	// 	}
	// 	return c;
	// }
	
	/**
	 * Slice node into 3 nodes by boundary ponits. 
	 * Return second node.
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement l left boundary node
	 * @param  DOMElement r right boundary node
	 * @return DOMElement
	 **/
	// this.slice = function(n, l, r) {
	// 	this.split(n, r);
	// 	return this.split(n, l, true);
	// }
	
	/**
	 * Unwrap part of node contents between boundary points 
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement l left point
	 * @param  DOMElement r right point
	 * @return void
	 **/
	// this.unwrapPart = function(n, l, r) {
	// 	var c = this.split(n, r), s = this.traverse(l, r);
	// 	
	// 	for (i=0; i < s.length; i++) {
	// 		c.parentNode.insertBefore(i>0 && i<s.length-1 ? self.cloneParents(s[i], n) : s[i], c);
	// 	};
	// 	return this;
	// }
	
	/**
	 * Return clone DOM of node parents till required parent or node itself
	 *
	 * @param  DOMElement n node
	 * @param  DOMElement p parent
	 * @return DOMElement
	 **/
	// this.cloneParents = function(n, p) {
	// 	var ret = n, _p = this.parents(n, 'all', p), tmp = null, i;
	// 	
	// 	for (i=0; i < _p.length; i++) {
	// 		if (this.is(_p[i], 'block')) {
	// 			break;
	// 		}
	// 		tmp = _p[i].cloneNode(false);
	// 		tmp.appendChild(ret);
	// 		ret = tmp;
	// 	};
	// 	return ret;
	// }
	
	/**
	 * Move all child nodes from the bounding point till end of the node after node. 
	 *
	 * @param  DOMElement n node
	 * @param  DOMElement b bounding point
	 * @return void
	 **/
	// this.moveNodesAfter = function(n, b) {
	// 	var _n, p = n.parentNode, nodes = this.traverse(b, n.lastChild);
	// 
	// 	$.each(nodes.reverse(), function() {
	// 		_n = self.cloneParents(this, n);
	// 		n.nextSibling ? p.insertBefore(_n, n.nextSibling) : p.appendChild(_n);
	// 	});
	// 	this.is(n, 'empty') && this.unwrap(n);
	// 	return nodes;
	// }
	
	/**
	 * Move all child nodes from the begining of node till bounding point before node. 
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement b bounding point
	 * @return void
	 **/
	// this.moveNodesBefore = function(n, b) {
	// 	var _n, p = n.parentNode, nodes = this.traverse(n.firstChild, b);
	// 
	// 	$.each(nodes, function() {
	// 		p.insertBefore(self.cloneParents(this, n), n);
	// 	});
	// 	this.is(n, 'empty') && this.unwrap(n);
	// 	return nodes;
	// }
	
	
	/********************************************************/
	/*                      Утилиты                         */
	/********************************************************/	
	
	
	this.cssMatch = function(n, k, v) {
		// alert(typeof($(n).css(k)))
		return n && n.nodeType == 1 && $(n).css(k).toString().match(v);
	}
	
	// this.findInStyle = function(n, k) {
	// 	var r = new RegExp(k+':\s*([^;\s]+)'),
	// 		m = ($(n).attr('style')||'').match(r);
	// 	return  m && m.length && m[1] ? $.trim(m[1]) : '';
	// }
	
	/********************************************************/
	/*                       Таблицы                        */
	/********************************************************/
	
	this.tableMatrix = function(n) {
		var mx = [];
		if (n && n.nodeName == 'TABLE') {
			var max = 0;
			function _pos(r) {
				for (var i=0; i<=max; i++) {
					if (!mx[r][i]) {
						return i;
					}
				};
			}
			
			$(n).find('tr').each(function(r) {
				if (!$.isArray(mx[r])) {
					mx[r] = [];
				}
				
				$(this).children('td,th').each(function() {
					var w = parseInt($(this).attr('colspan')||1);
					var h = parseInt($(this).attr('rowspan')||1);
					var i = _pos(r);
					for (var y=0; y<h; y++) {
						for (var x=0; x<w; x++) {
							var _y = r+y;
							if (!$.isArray(mx[_y])) {
								mx[_y] = [];
							}
							var d = x==0 && y==0 ? this : (y==0 ? x : "-");
							mx[_y][i+x] = d;
						}
					};
					max= Math.max(max, mx[r].length);
				});
			});
		}
		return mx;
	}
	
	this.indexesOfCell = function(n, tbm) {
		for (var rnum=0; rnum < tbm.length; rnum++) {
			for (var cnum=0; cnum < tbm[rnum].length; cnum++) {
				if (tbm[rnum][cnum] == n) {
					return [rnum, cnum];
				}
				
			};
		};
	}
	
	this.fixTable = function(n) {
		if (n && n.nodeName == 'TABLE') {
			var tb = $(n);
			//tb.find('tr:empty').remove();
			var mx = this.tableMatrix(n);
			var x  = 0;
			$.each(mx, function() {
				x = Math.max(x, this.length);
			});
			if (x==0) {
				return tb.remove();
			}
			// for (var i=0; i<mx.length; i++) {
			// 	this.rte.log(mx[i]);
			// }
			
			for (var r=0; r<mx.length; r++) {
				var l = mx[r].length;
				//this.rte.log(r+' : '+l)
				
				if (l==0) {
					//this.rte.log('remove: '+tb.find('tr').eq(r))
					tb.find('tr').eq(r).remove();
//					tb.find('tr').eq(r).append('<td>remove</td>')
				} else if (l<x) {
					var cnt = x-l;
					var row = tb.find('tr').eq(r);
					for (i=0; i<cnt; i++) {
						row.append('<td>&nbsp;</td>');
					}
				}
			}
			
		}
	}
	
	this.tableColumn = function(n, ext, fix) {
		n      = this.selfOrParent(n, /^TD|TH$/);
		var tb = this.selfOrParent(n, /^TABLE$/);
		ret    = [];
		info   = {offset : [], delta : []};
		if (n && tb) {
			fix && this.fixTable(tb);
			var mx = this.tableMatrix(tb);
			var _s = false;
			var x;
			for (var r=0; r<mx.length; r++) {
				for (var _x=0; _x<mx[r].length; _x++) {
					if (mx[r][_x] == n) {
						x = _x;
						_s = true;
						break;
					}
				}
				if (_s) {
					break;
				}
			}
			
			// this.rte.log('matrix');
			// for (var i=0; i<mx.length; i++) {
			// 	this.rte.log(mx[i]);
			// }
			if (x>=0) {
				for(var r=0; r<mx.length; r++) {
					var tmp = mx[r][x]||null;
					if (tmp) {
						if (tmp.nodeName) {
							ret.push(tmp);
							if (ext) {
								info.delta.push(0);
								info.offset.push(x);
							}
						} else {
							var d = parseInt(tmp);
							if (!isNaN(d) && mx[r][x-d] && mx[r][x-d].nodeName) {
								ret.push(mx[r][x-d]);
								if (ext) {
									info.delta.push(d);
									info.offset.push(x);
								}
							}
						}
					}
				}
			}
		}
		return !ext ? ret : {column : ret, info : info};
	}

	
	
}

})(jQuery);