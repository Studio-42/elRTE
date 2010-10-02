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
	
	this.notTextRegExp = /^(AREA|BR|EMBED|IMG|HR|OBJECT|PARAM)$/;
	this.textRegExp  = /^(A|ABBR|ACRONYM|ADDRESS|B|BDO|BIG|BLOCKQUOTE|BUTTON|CAPTION|CENTER|CITE|CODE|DD|DEL|DFN|DIV|DL|DT|EM|FIELDSET|FONT|FORM|H[1-6]|I|INS|KBD|LABEL|LEGEND|LI|MARQUEE|NOBR|NOEMBED|P|PRE|Q|S|SAMP|SMALL|SPAN|STRIKE|STRONG|SUB|SUP|TD|TH|TT|U|VAR|XMP)$/;
	this.blockRegExp = /^(ADDRESS|BLOCKQUOTE|CAPTION|CENTER|COL|COLGROUP|DD|DIR|DIV|DL|DT|FIELDSET|FORM|H[1-6]|HR|LI|MENU|OBJECT|OL|P|PRE|TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|UL)$/;
	this.listRegExp  = /^(OL|UL)$/
	
	
	this.filters = {
		any           : function()  { return true; },
		none          : function()  { return false; },
		node          : function(n) { return !!(n && n.nodeType && n.parentNode); },
		element       : function(n) { return !!(n && n.nodeType == 1); },
		block         : function(n) { return self.blockRegExp.test(n.nodeName); },
		inline        : function(n) { return !self.blockRegExp.test(n.nodeName); },
		text          : function(n) { return n.nodeType == 3 || !self.notTextRegExp.test(n.nodeName);}, //function(n) { return n.nodeType == 3 || self.textRegExp.test(n.nodeName); },
		notText       : function(n) { return self.notTextRegExp.test(n.nodeName); }, //function(n) { !self.filters.text(n); }, 
		blockText     : function(n) { return self.filters.block(n) && self.filters.text(n); },
		inlineText    : function(n) { return !self.filters.block(n) && self.filters.text(n); },
		blockNotText  : function(n) { return self.filters.block(n) && !self.filters.text(n); },
		inlineNotText : function(n) { return !self.filters.block(n) && !self.filters.text(n); },
		textNode      : function(n) { return n.nodeType == 3; },
		textElement   : function(n) { return n.nodeType == 1 && self.filters.text(n); },
		textOrBr      : function(n) { return n.nodeName == 'BR' || self.filters.text(n); },
		empty         : function(n) { return n.nodeType == 1 ? !(n.childNodes.length || $.trim($(n).text().length)) : (n.nodeType == 3 ? !$.trim(n.nodeValue).length : true); },
		notEmpty      : function(n) { return !self.filters.empty(n); },
		first         : function(n) { return n.nodeName != 'BODY' && !self.prevAll(n, 'notEmpty').length; },
		last          : function(n) { return n.nodeName != 'BODY' && !self.nextAll(n, 'notEmpty').length; },
		onlyChild     : function(n) { return self.filters.first(n) && self.filters.last(n); },
		emptySpan     : function(n) { var $n = $(n); return n.nodeName == 'SPAN' && ((!$n.attr('style') && !$n.attr('class')) || self.filters.empty(n) ); },
		list          : function(n) { return self.listRegExp.test(n.nodeName); },
		li            : function(n) { return n.nodeName == 'LI'; },
		anchor        : function(n) { return n.nodeName == 'A' && !n.href; },
		link        : function(n) { return n.nodeName == 'A' && n.href; }
	};
	
	
	
	this.rte.bind('wysiwyg', function(e) {
		self.doc  = self.rte.active.document;
		self.body = self.doc.body;
		self.html = self.doc.body.parentNode;
	})
	.bind('close source', function(e) {
		if (e.data.id == self.rte.active.id) {
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
		$.isPlainObject(o.css) && n.css(o.css);
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
	 * Return true if node matched by filter
	 *
	 * @param  DOMElement      node to test
	 * @param  DOMElement|String|RegExp|Function  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.is = function(n, f) {
		if (n && n.nodeType) {
			if (!f || typeof(f) === 'string') {
				f = this.filters[f] ? f : 'any';
				return this.filters[f](n);
			} else if (f instanceof RegExp) {
				return f.test(n.nodeName);
			} else if (typeof(f) == 'function') {
				return f(n);
			} else if (f && f.nodeType) {
				return n === f;
			} 
		} else {
			this.rte.debug('error.dom', 'dom.is() required node, '+typeof(n)+' given')
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
				r.push(node);
			}
		});
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
	 * Check two nodes to be sibglings nodes
	 *
	 * @param  DOMElement
	 * @param  DOMElement
	 * @return Boolean
	 **/
	this.isSiblings = function(n1, n2) {
		return n1.parentNode && n1.parentNode === n2.parentNode;
	//	return n1.previousSibling === n2 || n1.nextSibling === n2;
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
		until = until||this.body;
		return this.is(n, 'node') && !this.is(n, until) && (p = n.parentNode) && !this.is(p, until) && this.is(p, f) ? p : false
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

		until = until||this.body;
		if (this.is(n, 'node') && !this.is(n, until)) {
			addSelf && this.is(n, f) && r.push(n);

			while ((n = this.parent(n, 'any', until))) {
				this.is(n, f) && r.push(n);
			}
		}
		return r;
	}
	
	/**
	 * Return closest node parent matched by filter
	 *
	 * @param  DOMElement              node to test
	 * @param  String|RegExp|Function  filter
	 * @param  DOMElement              find parents not up this
	 * @return DOMElement
	 **/
	this.closestParent = function(n, f, addSelf, until) {
		return this.parents(n, f, addSelf, until).shift();
	}
	
	/**
	 * Return most node top parent matched by filter
	 *
	 * @param  DOMElement              node to test
	 * @param  String|RegExp|Function  filter
	 * @param  DOMElement              find parents not up this
	 * @return DOMElement
	 **/
	this.topParent = function(n, f, addSelf, until) {
		return this.parents(n, f, addSelf, until).pop();
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
		
		if (this.is(n, 'element')) {
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
		return n && n.nodeType && n.nextSibling && this.is(n.nextSibling, f||'any') ? n.nextSibling : false;
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
	 * @param  DOMElement|String|RegExp|Function  filter to stop search
	 * @return Array
	 **/
	this.nextUntil = function(n, f, e) {
		var r = [];

		while ((n = this.next(n)) && !this.is(n, e)) {
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
		return n && n.nodeType && n.previousSibling && this.is(n.previousSibling, f||'any') ? n.previousSibling : false;
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
	 * @param  DOMElement|String|RegExp|Function  filter to stop search
	 * @return Array
	 **/
	this.prevUntil = function(n, f, e) {
		var r = [];

		while ((n = this.prev(n)) && !this.is(n, e)) {
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
		
		if (this.is(s, 'node') && this.is(e, 'node')) {
			
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
		
		return c.nodeType == 1 ? c : c.parentNode;
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
	/*                                     CSS                                      */
	/********************************************************************************/

	/**
	 * Return node inline style (or style property) if exists
	 *
	 * @param  DOMElement  node
	 * @param  String      css property name
	 * @TODO move parseStyle/serializeStyle here
	 * @return Array|String
	 **/
	this.css = function(n, css) {
		var c;
		if (n && n.nodeType == 1) {
			c = this.rte.utils.parseStyle($(n).attr('style'));
			return css ? c[css]||'' : c;
		}
		return '';
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
	 * wrapper for insertBefore()
	 *
	 * @param  DOMElement  node to insert
	 * @param  DOMElement  refrence node
	 * @return DOMElement
	 **/
	this.before = function(n, ref) {
		return ref.parentNode.insertBefore(n, ref)
	}
	
	/**
	 * Insert node after refrence node
	 *
	 * @param  DOMElement  node to insert
	 * @param  DOMElement  refrence node
	 * @return DOMElement
	 **/
	this.after = function(n, ref) {
		var p = ref.parentNode,
			s = ref.nextSibling;
		return s ? p.insertBefore(n, s) : p.appendChild(n);
	}
	
	this.append = function(p, n) {
		// n = n.nodeType ? [n] : n;
		$.each(n.nodeType ? [n] : n, function(i, n) {
			p.appendChild(n);
		})
	}
	
	/**
	 * Return node[s]
	 *
	 * @param  DOMElement|Array  node(s) to remove
	 * @return elRTE.dom
	 **/
	this.remove = function(o) {
		var self = this;
		$.each(o.length ? o : [o], function(i, n) {
			self.is(n, 'node') && n.parentNode.removeChild(n);
		});
		return this;
	}
	
	this.split = function(p, n, s) {
		var c, sb;
		if (this.parents(n, 'any', true, p).length) {
			while (n != p) {
				// sb = this[s ? 'prevAll' : 'nextAll'](n);
				sb = s ? this.prevAll(n).reverse() : this.nextAll(n); 
				n = n.parentNode;
				if (this.filter(sb, 'notEmpty').length) {
					c = n.cloneNode(false);
					this[s ? 'before' : 'after'](c, n);
					// this.rte.log(sb)
					this.append(c, sb);
					
				}
			}
		}
		
		return n;
	}
	
	this.slice = function(p, n) {
		return this.split(this.split(p, n, true), n);
	}
	
	/**
	 * Wrap group of nodes with node
	 *
	 * @param  DOMElement|Array  node(s) to wrap
	 * @param  DOMElement|Array  wrapper node
	 * @return elRTE.dom
	 **/
	this.wrap = function(n, w) {
		if (!w.nodeType) {
			w = this.create(w);
		}
		if (!$.isArray(n)) {
			n = [n];
		}
		if (this.is(n[0], 'node')) {
			this.before(w, n[0]);
			$.each(n, function(i, n) {
				w.appendChild(n);
			});
		}
		return w;
	}

	this.replace = function(n, r) {
		if (this.is(n, 'node')) {
			if (!r.nodeType) {
				r = this.create(r);
			}
			this.before(r, n);
			this.append(r, this.unwrap(n));
			return r;
		}
		
	}

	/**
	 * Wrap group of siblings nodes based on rule
	 *
	 * @param  Array   nodes to wrap
	 * @param  Object  wrap rules
	 * @return elRTE.dom
	 **/
	this.smartWrap = function(nodes, o) {
		var self = this, 
			w = [], 
			ch, a, b;
		
		o = $.extend({
			accept  : 'textOrBr',
			inner   : 'blockText',
			wrap    : function() { },
			testCss : false,
			setCss  : false
		}, o);

		function wrap() {
			self.filter(w, 'notEmpty').length && o.wrap(w);
			w = [];
		}
		
		$.each(nodes, function(i, n) {
			if (self.is(n, o.accept)) {
				if (o.setCss && self.is(n, o.testCss) && n.nodeType == 1) {
					wrap();
					o.setCss(n);
				} else if (o.inner && self.is(n, o.inner)) {
					wrap();
					self.smartWrap(n.childNodes, o);
				} else if (o.inner && (ch = self.closest(n, o.inner)).length) {
					wrap();
					$.each(ch, function(i) {
						b = self.traverse(i == 0 ? n.firstChild : ch[i-1], this);
						b.pop();
						self.smartWrap(b, o);
						self.smartWrap(this.childNodes, o);

						if (i == ch.length-1) {
							a = self.traverse(this, n.lastChild);
							a.shift();
							self.smartWrap(a, o);
						}
					});
				} else {
					w.length && self.prev(n) !== w[w.length-1] && wrap();
					w.push(n)
				}
			} else {
				wrap();
			}
		})
		wrap();
		return this;
	}
	
	/**
	 * Replace node with its contents
	 *
	 * @param  DOMElement n node
	 * @return void
	 **/
	this.unwrap = function(n) {
		var r = [];
		if (n && n.nodeType) {
			while (n.firstChild) {
				r.push(n.firstChild);
				this.before(n.firstChild, n);
			}
			n.parentNode.removeChild(n);
		}
		return r;
	}
	
	this.smartUnwrap = function(n, o) {
		var self = this,
			st = n[0],
			en = n[n.length-1],
			unw, c, g, l;
			
		o = $.extend({
			accept : 'none',
			testCut : 'inline',
			unwrap : function() { }
		}, o);
		
		/**
		 * Find top parent matched by o.accept method and return it parent node
		 *
		 * @param DOMElement
		 * @return DOMElement
		**/
		function container(c) {
			var p = self.parents(c, o.accept, true);
			return p.length ? p.pop() : c;
		}
		
		/**
		 * Find node parents matched by t method, cut it by node
		 * Return nodes list to unwrap
		 *
		 * @param DOMElement
		 * @param String   cut direction
		 * @return Array
		**/
		function intersect(n, dir) {
			var r = [],
				p = self.parents(n, o.accept, false, c.parentNode).pop(),
				s, // siblings 
				im = dir == 'left' ? 'before' : 'after', // insert node method
				cl; // clone node
			
			if (p) {
				while (n !== p) {
					s = dir == 'left' ? self.prevAll(n).reverse() : self.nextAll(n);
					n = n.parentNode;
					if (self.filter(s, 'notEmpty').length && self.is(n, o.testCut)) {
						cl = self[im](n.cloneNode(false), n);
						$.each(s, function() {
							cl.appendChild(this)
						});
					}
					if (self.is(n, o.accept)) {
						r.push(n);
					}
				}
			}
			return r;
		}
		
		c = container(this.commonAncestor(st, en));
		
		// unwrap first/last node parents
		$.each($.unique([].concat(intersect(st, 'left')).concat(intersect(en, 'right')) ), function(i, n) {
			o.unwrap(n);
		});
		
		unw = this.filter(n, function(n) { return o.accept(n) || self.find(n, o.accept).length; }),
		
		$.each(unw, function(i, n) {
			// unwrap all child nodes
			$.each(self.find(n, o.accept), function() {
				o.unwrap(this);
			});
			if (n === st) {
				st = n.firstChild;
			} 
			if (n === en) {
				en = n.lastChild;
			}
			o.unwrap(n);
		});
		
		return [st, en];
		
	}
	
	/**
	 * Unwrap group of nodes.
	 * Return first and last node to select
	 *
	 * @param Array  nodes list
	 * @param Function  node test method
	 * @param Function||String  method to check - can we cut parent node (for first/last node parents)
	 * @param Function  unwrap method
	 * @return Array
	**/
	this._smartUnwrap = function(n, t, ct, u) {
		var self = this, 
			st = n[0],
			en = n[n.length-1],
			unw = this.filter(n, function(n) { return t(n) || self.find(n, t).length; }),
			c, f, l;
		
		// this.rte.log(n)
		
		/**
		 * Find top parent matched by t method and return it parent node
		 *
		 * @param DOMElement
		 * @return DOMElement
		**/
		function container(c) {
			var p = self.parents(c, t, true);
			return p.length ? p.pop() : c;
		}

		/**
		 * Find node parents matched by t method, cut it by node
		 * Return nodes list to unwrap
		 *
		 * @param DOMElement
		 * @param String   cut direction
		 * @return Array
		**/
		function intersect(n, dir) {
			var r = [],
				p = self.parents(n, t, false, c.parentNode).pop(),
				s, // siblings 
				im = dir == 'left' ? 'before' : 'after', // insert node method
				cl; // clone node
			
			if (p) {
				while (n !== p) {
					s = dir == 'left' ? self.prevAll(n).reverse() : self.nextAll(n);
					n = n.parentNode;
					if (self.filter(s, 'notEmpty').length && self.is(n, ct)) {
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
		
		c = container(this.commonAncestor(st, en));

		// unwrap first/last node parents
		$.each($.unique([].concat(intersect(st, 'left')).concat(intersect(en, 'right')) ), function(i, n) {
			u(n);
		});
		
		$.each(unw, function(i, n) {
			// unwrap all child nodes
			$.each(self.find(n, t), function() {
				u(this);
			});
			if (n === st) {
				st = n.firstChild;
				// f = n.firstChild
			} 
			if (n === en) {
				en = n.lastChild;
				// l = n.lastChild
			}
			u(n);
		});
		
		return [st||f, en||l];
	}
	
	
	/********************************************************/
	/*                       Таблицы                        */
	/********************************************************/
	
// 	this.tableMatrix = function(n) {
// 		var mx = [];
// 		if (n && n.nodeName == 'TABLE') {
// 			var max = 0;
// 			function _pos(r) {
// 				for (var i=0; i<=max; i++) {
// 					if (!mx[r][i]) {
// 						return i;
// 					}
// 				};
// 			}
// 			
// 			$(n).find('tr').each(function(r) {
// 				if (!$.isArray(mx[r])) {
// 					mx[r] = [];
// 				}
// 				
// 				$(this).children('td,th').each(function() {
// 					var w = parseInt($(this).attr('colspan')||1);
// 					var h = parseInt($(this).attr('rowspan')||1);
// 					var i = _pos(r);
// 					for (var y=0; y<h; y++) {
// 						for (var x=0; x<w; x++) {
// 							var _y = r+y;
// 							if (!$.isArray(mx[_y])) {
// 								mx[_y] = [];
// 							}
// 							var d = x==0 && y==0 ? this : (y==0 ? x : "-");
// 							mx[_y][i+x] = d;
// 						}
// 					};
// 					max= Math.max(max, mx[r].length);
// 				});
// 			});
// 		}
// 		return mx;
// 	}
// 	
// 	this.indexesOfCell = function(n, tbm) {
// 		for (var rnum=0; rnum < tbm.length; rnum++) {
// 			for (var cnum=0; cnum < tbm[rnum].length; cnum++) {
// 				if (tbm[rnum][cnum] == n) {
// 					return [rnum, cnum];
// 				}
// 				
// 			};
// 		};
// 	}
// 	
// 	this.fixTable = function(n) {
// 		if (n && n.nodeName == 'TABLE') {
// 			var tb = $(n);
// 			//tb.find('tr:empty').remove();
// 			var mx = this.tableMatrix(n);
// 			var x  = 0;
// 			$.each(mx, function() {
// 				x = Math.max(x, this.length);
// 			});
// 			if (x==0) {
// 				return tb.remove();
// 			}
// 			// for (var i=0; i<mx.length; i++) {
// 			// 	this.rte.log(mx[i]);
// 			// }
// 			
// 			for (var r=0; r<mx.length; r++) {
// 				var l = mx[r].length;
// 				//this.rte.log(r+' : '+l)
// 				
// 				if (l==0) {
// 					//this.rte.log('remove: '+tb.find('tr').eq(r))
// 					tb.find('tr').eq(r).remove();
// //					tb.find('tr').eq(r).append('<td>remove</td>')
// 				} else if (l<x) {
// 					var cnt = x-l;
// 					var row = tb.find('tr').eq(r);
// 					for (i=0; i<cnt; i++) {
// 						row.append('<td>&nbsp;</td>');
// 					}
// 				}
// 			}
// 			
// 		}
// 	}
// 	
// 	this.tableColumn = function(n, ext, fix) {
// 		n      = this.selfOrParent(n, /^TD|TH$/);
// 		var tb = this.selfOrParent(n, /^TABLE$/);
// 		ret    = [];
// 		info   = {offset : [], delta : []};
// 		if (n && tb) {
// 			fix && this.fixTable(tb);
// 			var mx = this.tableMatrix(tb);
// 			var _s = false;
// 			var x;
// 			for (var r=0; r<mx.length; r++) {
// 				for (var _x=0; _x<mx[r].length; _x++) {
// 					if (mx[r][_x] == n) {
// 						x = _x;
// 						_s = true;
// 						break;
// 					}
// 				}
// 				if (_s) {
// 					break;
// 				}
// 			}
// 			
// 			// this.rte.log('matrix');
// 			// for (var i=0; i<mx.length; i++) {
// 			// 	this.rte.log(mx[i]);
// 			// }
// 			if (x>=0) {
// 				for(var r=0; r<mx.length; r++) {
// 					var tmp = mx[r][x]||null;
// 					if (tmp) {
// 						if (tmp.nodeName) {
// 							ret.push(tmp);
// 							if (ext) {
// 								info.delta.push(0);
// 								info.offset.push(x);
// 							}
// 						} else {
// 							var d = parseInt(tmp);
// 							if (!isNaN(d) && mx[r][x-d] && mx[r][x-d].nodeName) {
// 								ret.push(mx[r][x-d]);
// 								if (ext) {
// 									info.delta.push(d);
// 									info.offset.push(x);
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 		return !ext ? ret : {column : ret, info : info};
// 	}

	
	
}

})(jQuery);