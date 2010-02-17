/*
 * DOM utilites for elRTE 
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 */
(function($) {
elRTE.prototype.dom = function(rte) {
	var self  = this;
	this.rte  = rte;
	this.doc  = rte.doc;
	this.body = rte.doc.body;
	this.html = rte.doc.body.parentNode;
	
	this.filters = {
		dummy         : { },
		all           : { regexp : /.*/ },
		block         : { regexp : /^(ADDRESS|BLOCKQUOTE|CENTER|DD|DIR|DIV|DL|FIELDSET|FORM|H[1-6]|HR|LI|OL|P|PRE|TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|UL)$/},
		inline        : { func : function(n) { return n.nodeType == 3 || !self.filters.block.regexp.test(n.nodeName); } },
		text          : { 
			regexp : /^(A|ABBR|ACRONYM|ADDRESS|B|BDO|BIG|BLOCKQUOTE|CAPTION|CENTER|CITE|CODE|DD|DEL|DFN|DIV|DT|EM|FIELDSET|FONT|H[1-6]|I|INS|KBD|LABEL|LEGEND|LI|MARQUEE|NOBR|NOEMBED|P|PRE|Q|SAMP|SMALL|SPAN|STRIKE|STRONG|SUB|SUP|TD|TH|TT|VAR)$/,
			func   : function(n) { return n.nodeType == 3; }
		},
		notText       : { func : function(n) { return !self.is(n, 'text'); } },
		blockText     : { func : function(n) { return  self.is(n, 'block')  && self.is(n, 'text');    } },
		inlineText    : { func : function(n) { return  self.is(n, 'inline') && self.is(n, 'text');    } },
		body          : { regexp : /^BODY$/ },
		headers       : { regexp : /^H[1-6]$/	},
		strong        : {
			regexp : /^(STRONG|B)$/,
			func   : function(n) { return /font\-weight\s*:\s*bold/i.test($(n).attr('style')||''); }
		},
		textNode      : { func : function(n) { return n.nodeType == 3; } },
		empty         : { func : function(n) { return (n.nodeType == 1 && (n.childNodes.length==0 || $.trim($(n).text()).length==0 )) || (n.nodeType == 3 && $.trim(n.nodeValue).length==0) || n.nodeType == 8 || n.nodeType == 4; } },
		notEmpty      : { func : function(n) { return !self.filters.empty.func(n); } },
		onlyChild     : { func : function(n) { return self.filters.first.func(n) && self.filters.last.func(n); } },
		first         : {
			func : function(n) {
				while ((n = self.prev(n))) {
					if (self.filters.notEmpty.func(n)) {
						return false;
					}
				}
				return true;
			}
		},
		last          : {
			func : function(n) {
				while ((n = self.next(n))) {
					if (self.filters.notEmpty.func(n)) {
						return false;
					}
				}
				return true;
			}
		}
		
	}
	
	/**
	 * Create and return DOM Element
	 *
	 * @param  String  Node name
	 * @param  Array   Node attributes
	 * @return DOMElement
	 **/
	this.create = function(n, a) {
		var n = this.doc.createElement(n);
		a && $(n).attr(a);
		return n;
	}
	
	/**
	 * Return node for bookmark with unique ID
	 *
	 * @return DOMElement
	 **/
	this.createBookmark = function() {
		return this.create('span', { id : 'elrte-bm-'+Math.random().toString().substr(2), 'class' : 'elrte-bm'});
	}
	
	/********************************************************************************/
	/*                                  SEARCH                                      */
	/********************************************************************************/
	
	/**
	 * Return true if node matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.is = function(n, f) {
		
		if (typeof(f) == 'string' && this.filters[f]) {
			f = this.filters[f];
			return f.rule == 'and'
				?  f.regexp && f.regexp.test(n.nodeName||'')  &&  f.func && f.func(n)
				: (f.regexp && f.regexp.test(n.nodeName||'')) || (f.func && f.func(n));
		} else if (f instanceof RegExp) {
			return f.test(n.nodeName);
		} else if ($.isFunction(f)) {
			return f(n);
		}
		return false;
	}
	
	/**
	 * Return nodes matched by filter
	 *
	 * @param  Array         n  array of nodes to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Array
	 **/
	this.filter = function(n, f) {
		var l = n.length||0, r = [];
		
		while (l--) {
			this.is(n[l], f) && r.unshift(n[l]);
		}
		return r;
	}
	
	/**
	 * Return any children nodes matched by filter
	 *
	 * @param  DOMElement               node to test
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @param  Boolean                  check parent node before children
	 * @return Array
	 **/
	this.find = function(n, f, addSelf) {
		var r = addSelf && this.is(n, f) ? [n] : [], c, i;

		if (n.nodeType == 1 && n.childNodes.length) {
			c = n.childNodes;
			for (i=0; i < c.length; i++) {
				this.is(c[i], f) && r.push(c[i]);
				if (c[i].nodeType == 1 && c[i].childNodes.length) {
					r = r.concat(this.find(c[i], f));
				}
			};
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
		var c = this.body;
		
		if (s && e) {
			if (s == e) {
				c = s;
			} else {
				var sp = this.parents(s, 'all', this.html, true).reverse(),
					ep = this.parents(e, 'all', this.html, true).reverse(),
					len = Math.min(sp.length, ep.length), i=0;
				while (i++<len && sp[i] == ep[i]) {
					c = sp[i];
				}	
			}
		}
		return c.nodeType != 1 && this.is(c, 'onlyChild') ? c.parentNode : c;
	}
	
	this.isSiblings = function(n) {
		var l = n.length;
		while (l--) {
			if (n[l].parentNode != n[0].parentNode) {
				return false;
			}
		}
		return true;
	}
	
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
	 * Return direct children nodes matched by filter
	 *
	 * @param  DOMElement               node to test
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.children = function(n, f) {
		return n.nodeType == 1 && n.childNodes.length ? this.filter(n.childNodes, f) : [];
	}
	
	/**
	 * Return closest children nodes matched by filter
	 *
	 * @param  DOMElement               node to test
	 * @param  String|RegExp|Function   filter name or RegExp or function
	 * @return Array
	 **/
	this.descendants = function(n, f) {
		var r = [], c, i;
		
		if (n.nodeType == 1 && n.childNodes.length) {
			c = n.childNodes;
			for (i=0; i<c.length; i++) {
				if (this.is(c[i], f)) {
					r.push(c[i]);
				} else if (c[i].nodeType == 1 && c[i].childNodes.length) {
					r = r.concat(this.descendants(c[i], f));
				}
			}
		}
		return r;
	}
	
	/**
	 * Return closest parent matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @param  DOMElement    p  if set, find parents not up this
	 * @return DOMElement|null
	 **/
	this.parent = function(n, f, p, addSelf) {
		p = p && p.nodeType == 1 ? p : this.body;
		
		if (addSelf && n!=p && this.is(n, f)) {
			return n;
		}
		while (n && n.parentNode && (n = n.parentNode) && n != p) {
			if (this.is(n, f)) {
				return n;
			}
		}
		return false;
	}
	
	/**
	 * Return parents matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @param  DOMElement    p  if set, find parents not up one
	 * @return Array
	 **/
	this.parents = function(n, f, p, addSelf) {
		var r = addSelf && this.is(n, f) ? [n] : [];
		while ((n = this.parent(n, f, p))) {
			r.push(n);
		}
		return r;
	}
	
	/**
	 * Return list of nodes between start and end nodes
	 *
	 * @param  DOMElement s start node
	 * @param  DOMElement e end node
	 * @return Array
	 **/
	this.traverse = function(s, e, p) {
		var p = p||this.commonAncestor(s, e),
		sp = s, ep = e, n=s, res = [s], tmp = [e];

		while (sp.parentNode != p) {
			sp = sp.parentNode;
		}
		
		while (ep.parentNode != p) {
			ep = ep.parentNode;
		}

		while (n != sp) {
			res = res.concat(this.nextAll(n));
			n = n.parentNode;
		}
		
		while ((n = this.next(n)) && n != ep) {
			res.push(n);
		}

		n = e;
		while (n != ep) {
			tmp = tmp.concat(this.prevAll(n));
			n = n.parentNode;
		}
		return res.concat(tmp.reverse());
	}
	
	/**
	 * Return next sibling node
	 *
	 * @param  DOMElement 
	 * @return DOMElement
	 **/
	this.next = function(n) {
		return n && n.nextSibling ? n.nextSibling : false;
	}
	
	/**
	 * Return all next siblings
	 *
	 * @param  DOMElement 
	 * @return Array
	 **/
	this.nextAll = function(n) {
		var r = [];
		while (n && n.nextSibling && (n = n.nextSibling)) {
			r.push(n);
		}
		return r;
	}
	
	/**
	 * Return next previous node
	 *
	 * @param  DOMElement 
	 * @return DOMElement
	 **/
	this.prev = function(n) {
		return n && n.previousSibling ? n.previousSibling : false;
	}
	
	/**
	 * Return all previous siblings
	 *
	 * @param  DOMElement 
	 * @return Array
	 **/
	this.prevAll = function(n) {
		var r = [];
		while (n.previousSibling && (n = n.previousSibling)) {
			r.push(n);
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
	this.selectionMatchAll = function(f) {
		var n = this.rte.selection.getNode();
		return this.is(n, f) || this.parent(n, f) || this.find(this.rte.selection.cloneContents(), f).length ? true : false;
	}
	
	/**
	 * Return true if selection matches filter
	 *
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.selectionMatch = function(f) {
		return this.is(this.rte.selection.getNode(), f);
	}
	
	/**
	 * Return true if any of selection parents matches filter
	 *
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.selectionHasParent = function(f) {
		return this.parent(this.rte.selection.getNode(), f) ? true : false;
	}
	
	/**
	 * Return true if any of selection childs matches filter
	 *
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.selectionHasChild = function(f) {
		return this.find(this.rte.selection.cloneContents(), f).length ? true : false;
	}
	
	/********************************************************************************/
	/*                                MANIPULATION                                  */
	/********************************************************************************/
	
	/**
	 * Split node by boundary ponit. Return new node.
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement b point
	 * @return DOMElement
	 **/
	this.split = function(n, b) {
		var c = n.cloneNode(false);
		
		n.nextSibling 
			? n.parentNode.insertBefore(c, n.nextSibling) 
			: n.parentNode.appendChild(c);
		$.each(this.traverse(b, n.lastChild), function(i) {
			i>0 && c.appendChild(this);
		});
		return c;
	}
	
	
	/********************************************************/
	/*                      Утилиты                         */
	/********************************************************/	
	
	
	

	
	
	/**
	 * Return attribute value in lower case (stupid IE), src,href,rel,action attributes returns as is.
	 *
	 * @param  DOMElement 
	 * @param  String  
	 * @return String
	 **/
	this.attr = function(n, attr) {
		var v = '';
		attr = attr.toLowerCase();
		if (n.nodeType == 1 && (v = $(n).attr(attr))) {
			return v.match(/^(src|href|rel|action)$/) ? v : v.toLowerCase();
		} 
		return '';
	}
	
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


	/********************************************************/
	/*                       New                            */
	/********************************************************/
	
	
	
	
	
	
	
	/**
	 * Unwrap part of node contents between boundary points 
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement l left point
	 * @param  DOMElement r right point
	 * @return void
	 **/
	this.unwrapPart = function(n, l, r) {
		var c = this.split(n, r);
		$.each(this.traverse(l, n.lastChild), function() {
			c.parentNode.insertBefore(this, c);
		});
		return this;
	}

	/**
	 * Move all child nodes from the bounding point till end of the node after node. 
	 *
	 * @param  DOMElement n node
	 * @param  DOMElement b bounding point
	 * @return void
	 **/
	this.moveNodesAfter = function(n, b) {
		var _n, p = n.parentNode;

		$.each(this.traverse(b, n.lastChild).reverse(), function() {
			_n = self.cloneParents(this, n);
			if (n.nextSibling) {
				p.insertBefore(_n, n.nextSibling);
			} else {
				p.appendChild(_n);
			}
		});
		return this;
	}
	
	/**
	 * Move all child nodes from the begining of node till bounding point before node. 
	 *
	 * @param  DOMElement n node to split
	 * @param  DOMElement b bounding point
	 * @return void
	 **/
	this.moveNodesBefore = function(n, b) {
		var _n, p = n.parentNode;

		$.each(this.traverse(n.firstChild, b), function() {
			p.insertBefore(self.cloneParents(this, n), n);
		});
		return this;
	}
	
	
	
	/**
	 * Return clone DOM of node parents till required parent or node itself
	 *
	 * @param  DOMElement n node
	 * @param  DOMElement p parent
	 * @return DOMElement
	 **/
	this.cloneParents = function(n, p) {
		var ret = null;
		$.each(this.parents(n, 'all', p), function() {
			if (!ret) {
				ret = this.cloneNode(false);
			} else {
				ret.appendChild(this.cloneNode(false));
			}
		});
		if (ret) {
			ret.appendChild(n);
		} else {
			ret = n;
		}
		return ret;
	}
	
	/**
	 * Replace node with contents
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
	

	
	
	this.wrap = function(n, w) {
		n = $.isArray(n) ? n : [n], l = n.length;
		while (l--) {
			if (this.is(n[l], 'block') || this.is(n[l], 'text') || n[l].nodeName == 'IMG') {
				n[l].parentNode.insertBefore((w = w.nodeType ? w.cloneNode(false) : this.create(w)), n[l]);
				w.appendChild(n[l]);
			}
		}
	}
	
	this.wrapAll = function(n, w) {
		if ($.isArray(n) && n.length>0) {
			for (i=0; i < n.length; i++) {
				i == 0 && n[i].parentNode.insertBefore((w = w.nodeType ? w : this.create(w)), n[i]);
				w.appendChild(n[i]);
			};
		}
	}
	
	this.wrapInner = function(n, w) {
		if (n.nodeType == 1 && n.childNodes.length) {
			n.insertBefore((w = w.nodeType ? w : this.create(w)), n.firstChild);
			while ((n = this.next(w))) {
				w.appendChild(n);
			}
		}
	}
	
	this.smartWrap = function(n, w) {
		var bn, n1, n2, bf, ba, i;
		
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
				for (i=0; i<n.childNodes.length; i++) {
					this.smartWrap(n.childNodes[i], w.cloneNode(false));
				}
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
					// if (this.filter(n1, 'notEmpty').length) {
					// 	if (this.isSiblings(n1)) {
					// 		this.wrapAll(n1, w);
					// 	} else {
					// 		this.wrap(n1, w);
					// 	}
					// }
					// wrap block node
					this.smartWrap(bn[0], w.cloneNode(false));
					this.smartWrapAll(n2, w.cloneNode(false))
					// wrap nodes from block child till node end
					// if (this.filter(n2, 'notEmpty').length) {
					// 	if (bn.length == 1) {
					// 		// no other block nodes in this node
					// 		this.smartWrapAll(n2, w.cloneNode(false))
					// 		// if (this.isSiblings(n2)) {
					// 		// 	this.wrapAll(n2, w.cloneNode(false));
					// 		// } else {
					// 		// 	this.wrap(n2, w);
					// 		// }
					// 	} else {
					// 		this.smartWrapAll(n2, w.cloneNode(false))
					// 		// for (var i=0; i < n2.length; i++) {
					// 		// 	this.smartWrap(n2[i], w.cloneNode(false));
					// 		// };
					// 	}
					// }
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
	
	this.smartWrapAll = function(n, w) {
		var buffer = [];
		
		function dropBuffer() {
			var empty = true
			for (var i=0; i < buffer.length; i++) {
				if (!self.is(buffer[i], 'empty')) {
					empty = false
				}
			};
			if (!empty) {
				self.rte.log('fucking shit')
				self.wrapAll(buffer, w);
			}
			buffer = [];
		}
		// this.rte.log(n)
		for (var i=0; i < n.length; i++) {
			
			if (!this.is(n[i], 'blockText') && !this.has(n[i], 'blockText') && (!buffer.length || n[i].parentNode == buffer[buffer.length-1].parentNode)) {
				
				buffer.push(n[i])
			} else {
				this.rte.log('go go')
				this.rte.log(n[i])
				this.rte.log(buffer)
				dropBuffer()
				this.smartWrap(n[i], w)
			}
			
		};
		dropBuffer()
		return
		if (this.isSiblings(n) && !this.has(n, 'blockText') && this.filter(n, 'notEmpty').length) {
			this.rte.log('go')
			this.wrapAll(n, w)
		} else {
			for (var i=0; i < n.length; i++) {
				this.smartWrap(n[i], w)
				// f(s[i], 'strong')
			};
		}
	}
	
	
}

})(jQuery);