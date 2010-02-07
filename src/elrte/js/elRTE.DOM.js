/*
 * DOM utilites for elRTE 
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 */
(function($) {
elRTE.prototype.dom = function(rte) {
	this.rte = rte;
	this.doc = rte.doc;
	this.body = rte.doc.body
	var self = this;
	this.regExp = {
		textNodes         : /^(A|ABBR|ACRONYM|ADDRESS|B|BDO|BIG|BLOCKQUOTE|CAPTION|CENTER|CITE|CODE|DD|DEL|DFN|DIV|DT|EM|FIELDSET|FONT|H[1-6]|I|INS|KBD|LABEL|LEGEND|LI|MARQUEE|NOBR|NOEMBED|P|PRE|Q|SAMP|SMALL|SPAN|STRIKE|STRONG|SUB|SUP|TD|TH|TT|VAR)$/,
		textContainsNodes : /^(A|ABBR|ACRONYM|ADDRESS|B|BDO|BIG|BLOCKQUOTE|CAPTION|CENTER|CITE|CODE|DD|DEL|DFN|DIV|DL|DT|EM|FIELDSET|FONT|H[1-6]|I|INS|KBD|LABEL|LEGEND|LI|MARQUEE|NOBR|NOEMBED|OL|P|PRE|Q|SAMP|SMALL|SPAN|STRIKE|STRONG|SUB|SUP|TABLE|THEAD|TBODY|TFOOT|TD|TH|TR|TT|UL|VAR)$/,
		block             : /^(APPLET|BLOCKQUOTE|BR|CAPTION|CENTER|COL|COLGROUP|DD|DIV|DL|DT|H[1-6]|EMBED|FIELDSET|LI|MARQUEE|NOBR|OBJECT|OL|P|PRE|TABLE|THEAD|TBODY|TFOOT|TD|TH|TR|UL)$/,
		selectionBlock    : /^(APPLET|BLOCKQUOTE|BR|CAPTION|CENTER|COL|COLGROUP|DD|DIV|DL|DT|H[1-6]|EMBED|FIELDSET|LI|MARQUEE|NOBR|OBJECT|OL|P|PRE|TD|TH|TR|UL)$/,		
		header            : /^H[1-6]$/,
		formElement       : /^(FORM|INPUT|HIDDEN|TEXTAREA|SELECT|BUTTON)$/,
		all               : /.*/,
		dummy             : /\s/,
		body              : /^(BODY|HTML)$/,
		strong            : /^(STRONG|B)$/
	};
	
	
	this.filters = {
		dummy    : [/\s/],
		all      : [/.*/],
		body     : [/^(BODY|HTML)$/],
		headers  : [/^H[1-6]$/],
		strong   : [/^(STRONG|B)$/, function(n) { return /font\-weight\s*:\s*bold/i.test($(n).attr('style')||'');  }],
		text     : [/^(A|ABBR|ACRONYM|ADDRESS|B|BDO|BIG|BLOCKQUOTE|CAPTION|CENTER|CITE|CODE|DD|DEL|DFN|DIV|DT|EM|FIELDSET|FONT|H[1-6]|I|INS|KBD|LABEL|LEGEND|LI|MARQUEE|NOBR|NOEMBED|P|PRE|Q|SAMP|SMALL|SPAN|STRIKE|STRONG|SUB|SUP|TD|TH|TT|VAR)$/],
		block    : [/^(APPLET|BLOCKQUOTE|BR|CAPTION|CENTER|COL|COLGROUP|DD|DIV|DL|DT|H[1-6]|EMBED|FIELDSET|LI|MARQUEE|NOBR|OBJECT|OL|P|PRE|TABLE|THEAD|TBODY|TFOOT|TD|TH|TR|UL)$/],
		selBlock : [/^(APPLET|BLOCKQUOTE|BR|CAPTION|CENTER|COL|COLGROUP|DD|DIV|DL|DT|H[1-6]|EMBED|FIELDSET|LI|MARQUEE|NOBR|OBJECT|OL|P|PRE|TD|TH|TR|UL)$/],
		form     : [/^(FORM|INPUT|HIDDEN|TEXTAREA|SELECT|BUTTON)$/]
	};
	
	/********************************************************/
	/*                      Утилиты                         */
	/********************************************************/	
	
	/**
	 * Возвращает body редактируемого документа
	 *
	 * @return Element
	 **/
	this.root = function() {
		return this.rte.body;
	}

	this.create = function(t) {
		return this.rte.doc.createElement(t);
	}

	/**
	 * Вовращает индекс элемента внутри родителя
	 *
	 * @param  Element n  нода
	 * @return integer
	 **/
	this.indexOf = function(n) {
		var ndx = 0;
		n = $(n);
		while ((n = n.prev()) && n.length) {
			ndx++;
		}
		return ndx;
	}
	
	/**
	 * Вовращает значение аттрибута в нижнем регистре (ох уж этот IE)
	 *
	 * @param  Element n  нода
	 * @param  String  attr имя аттрибута
	 * @return string
	 **/
	this.attr = function(n, attr) {
		var v = '';
		if (n.nodeType == 1) {
			v = $(n).attr(attr);
			if (v && attr != 'src' && attr != 'href') {
				v = v.toString().toLowerCase();
			}
		} 
		return v||'';
	}
	
	/**
	 * Вовращает ближайший общий контейнер для 2-х эл-тов
	 *
	 * @param  Element n  нода1
	 * @param  Element n  нода2
	 * @return Element
	 **/
	this.findCommonAncestor = function(n1, n2) {
		if (!n1 || !n2) {
			return this.rte.log('dom.findCommonAncestor invalid arguments');
		}
		if (n1 == n2) {
			return n1;
		} else if (n1.nodeName == 'BODY' || n2.nodeName == 'BODY') {
			return this.rte.doc.body;
		}
		var p1 = $(n1).parents(), p2 = $(n2).parents(), l  = p2.length-1, c  = p2[l];
		for (var i = p1.length - 1; i >= 0; i--, l--){
			if (p1[i] == p2[l]) {
				c = p1[i];
			} else {
				break;
			}
		};
		return c;
	}
	/**
	 * Вовращает TRUE, если нода пустая
	 * пустой считаем ноды:
	 *  - текстовые эл-ты, содержащие пустую строку или тег br
	 *  - текстовые ноды с пустой строкой
	 *
	 * @param  DOMElement n  нода
	 * @return bool
	 **/
	this.isEmpty = function(n) {
		if (n.nodeType == 1) {
			return this.regExp.textNodes.test(n.nodeName) ? $.trim($(n).text()).length == 0 : false;
		} else if (n.nodeType == 3) {
			return /^(TABLE|THEAD|TFOOT|TBODY|TR|UL|OL|DL)$/.test(n.parentNode.nodeName)
				|| n.nodeValue == ''
				|| ($.trim(n.nodeValue).length== 0 && !(n.nextSibling && n.previousSibling && n.nextSibling.nodeType==1 && n.previousSibling.nodeType==1 && !this.regExp.block.test(n.nextSibling.nodeName) && !this.regExp.block.test(n.previousSibling.nodeName) ));
		}
		return true;
	}

	/********************************************************/
	/*                  Перемещение по DOM                  */
	/********************************************************/

	/**
	 * Вовращает следующую соседнюю ноду (не включаются текстовые ноды не создающие значимые пробелы между инлайн элементами)
	 *
	 * @param  DOMElement n  нода
	 * @return DOMElement
	 **/
	this.next = function(n) {
		while (n.nextSibling && (n = n.nextSibling)) {
			if (n.nodeType == 1 || (n.nodeType == 3 && !this.isEmpty(n))) {
				return n;
			}
		}
		return null;
	}

	/**
	 * Вовращает предыдующую соседнюю ноду (не включаются текстовые ноды не создающие значимые пробелы между инлайн элементами)
	 *
	 * @param  DOMElement n  нода
	 * @return DOMElement
	 **/
	this.prev = function(n) {
		while (n.previousSibling && (n = n.previousSibling)) {
			if (n.nodeType == 1 || (n.nodeType ==3 && !this.isEmpty(n))) {
				return n;
			}
		}
		return null;
	}

	this.isPrev = function(n, prev) {
		while ((n = this.prev(n))) {
			if (n == prev) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Вовращает все следующие соседнии ноды (не включаются текстовые ноды не создающие значимые пробелы между инлайн элементами)
	 *
	 * @param  DOMElement n  нода
	 * @return Array
	 **/
	this.nextAll = function(n) {
		var ret = [];
		while ((n = this.next(n))) {
			ret.push(n);
		}
		return ret;
	}
	
	/**
	 * Вовращает все предыдующие соседнии ноды (не включаются текстовые ноды не создающие значимые пробелы между инлайн элементами)
	 *
	 * @param  DOMElement n  нода
	 * @return Array
	 **/
	this.prevAll = function(n) {
		var ret = [];
		while ((n = this.prev(n))) {
			ret.push(n);
		}
		return ret;
	}
	
	/**
	 * Вовращает все следующие соседнии inline ноды (не включаются текстовые ноды не создающие значимые пробелы между инлайн элементами)
	 *
	 * @param  DOMElement n  нода
	 * @return Array
	 **/
	this.toLineEnd = function(n) {
		var ret = [];
		while ((n = this.next(n)) && n.nodeName != 'BR' && n.nodeName != 'HR' && this.isInline(n)) {
			ret.push(n);
		}
		return ret;
	}
	
	/**
	 * Вовращает все предыдующие соседнии inline ноды (не включаются текстовые ноды не создающие значимые пробелы между инлайн элементами)
	 *
	 * @param  DOMElement n  нода
	 * @return Array
	 **/
	this.toLineStart = function(n) {
		var ret = [];
		while ((n = this.prev(n)) && n.nodeName != 'BR' && n.nodeName != 'HR' && this.isInline(n) ) {
			ret.unshift(n);
		}
		return ret;
	}
	
	/**
	 * Вовращает TRUE, если нода - первый непустой эл-т внутри родителя
	 *
	 * @param  Element n  нода
	 * @return bool
	 **/
	this.isFirstNotEmpty = function(n) {
		while ((n = this.prev(n))) {
			if (n.nodeType == 1 || (n.nodeType == 3 && $.trim(n.nodeValue)!='' ) ) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * Вовращает TRUE, если нода - последний непустой эл-т внутри родителя
	 *
	 * @param  Element n  нода
	 * @return bool
	 **/
	this.isLastNotEmpty = function(n) {
		while ((n = this.next(n))) {
			if (!this.isEmpty(n)) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * Вовращает TRUE, если нода - единственный непустой эл-т внутри родителя
	 *
	 * @param  DOMElement n  нода
	 * @return bool
	 **/
	this.isOnlyNotEmpty = function(n) {
		return this.isFirstNotEmpty(n) && this.isLastNotEmpty(n);
	}
	
	/**
	 * Вовращает последний непустой дочерний эл-т ноды или FALSE
	 *
	 * @param  Element n  нода
	 * @return Element
	 **/
	this.findLastNotEmpty = function(n) {
		this.rte.log('findLastNotEmpty Who is here 0_o');
		if (n.nodeType == 1 && (l = n.lastChild)) {
			if (!this.isEmpty(l)) {
				return l;
			}
			while (l.previousSibling && (l = l.previousSibling)) {
				if (!this.isEmpty(l)) {
					return l;
				}
			}
		}
		return false;
	}
	
	/**
	 * Возвращает TRUE, если нода "inline" 
	 *
	 * @param  DOMElement n  нода
	 * @return bool
	 **/
	this.isInline = function(n) {
		if (n.nodeType == 3) {
			return true;
		} else if (n.nodeType == 1) {
			n = $(n);
			var d = n.css('display');
			var f = n.css('float');
			return d == 'inline' || d == 'inline-block' || f == 'left' || f == 'right';
		}
		return true;
	}
	
	
	/********************************************************/
	/*                  Поиск элементов                     */
	/********************************************************/
	
	/**
	 * Вовращает элемент(ы) отвечающие условиям поиска
	 *
	 * @param  DOMElement||Array  n       нода
	 * @param  RegExp||String     filter  фильтр условия поиска (RegExp или имя ключа this.regExp или *)
	 * @return DOMElement||Array
	 **/
	this.filter = function(n, filter) {
		var t = typeof(filter), ret=[], i;
		if (t=='object' || t == 'string') {
			filter = this.regExp[filter] || filter;
			if (!n.push) {
				return n.nodeName && filter.test(n.nodeName) ? n : null;
			}
			for (i=0; i < n.length; i++) {
				if (n[i].nodeName && n[i].nodeName && filter.test(n[i].nodeName)) {
					ret.push(n[i]);
				}
			};
			return ret.length ? ret : null;
		}
		return null;
	}
	
	
	/**
	 * Вовращает массив родительских элементов, отвечающих условиям поиска
	 *
	 * @param  DOMElement      n  нода, родителей, которой ищем
	 * @param  RegExp||String  filter   фильтр условия поиска (RegExp или имя ключа this.regExp или *)
	 * @return Array
	 **/
	this.parents = function(n, filter) {
		var t = typeof(filter), ret = [];
		// this.rte.log(n)
		if (t=='object' || t == 'string') {
			filter = filter == '*' ? /.?/ : (this.regExp[filter] || filter);
			while (n && (n = n.parentNode) && n.nodeName != 'BODY' && n.nodeName != 'HTML') {
				// this.rte.log(n)
				if (filter.test(n.nodeName)) {
					
					ret.push(n);
				}
			}
		}
		// this.rte.log(ret)
		// this.rte.log(filter)
		return ret;
	}
	
	/**
	 * Вовращает ближайший родительский эл-т, отвечающий условиям поиска
	 *
	 * @param  DOMElement     n  нода, родителя, которой ищем
	 * @param  RegExp||String f   фильтр условия поиска (RegExp или имя ключа this.regExp или *)
	 * @return DOMElement
	 **/
	this.parent = function(n, f) { 
		return this.parents(n, f)[0] || null; 
	}
	
	/**
	 * Вовращает или саму ноду или ее ближайшего родителя, если выполняются условия sf для самой ноды или pf для родителя
	 *
	 * @param  DOMElement     n  нода, родителя, которой ищем
	 * @param  RegExp||String sf   фильтр условия для самой ноды
	* @param  RegExp||String  pf   фильтр условия для родителя
	 * @return DOMElement
	 **/
	this.selfOrParent_ = function(n, sf, pf) {
		return this.filter(n, sf) || this.parent(n, pf||sf);
	}
	
	/**
	 * Вовращает родительскую ноду - ссылку
	 *
	 * @param  Element n  нода
	 * @return Element
	 **/
	this.selfOrParentLink = function(n) {
		n = this.selfOrParent(n, /^A$/);
		return n && n.href ? n : null;
	}

	/**
	 * Вовращает TRUE, если нода -  anchor
	 *
	 * @param  Element n  нода
	 * @return bool
	 **/
	this.selfOrParentAnchor = function(n) {
		n = this.selfOrParent(n, /^A$/);
		return n && !n.href && n.name ? n : null;
	}

	/**
	 * Вовращает массив дочерних ссылок
	 *
	 * @param  DOMElement n  нода
	 * @return Array
	 **/
	this.childLinks = function(n) {
		var res = [];
		$('a[href]', n).each(function() { res.push(this); });
		return res;
	}
	
	
	/********************************************************/
	/*                    Изменения DOM                     */
	/********************************************************/
	
	/**
	 * Оборачивает одну ноду другой
	 *
	 * @param  DOMElement n  оборачиваемая нода
	 * @param  DOMElement w  нода обертка или имя тега
	 * @return DOMElement
	 **/
	this.wrap = function(n, w) {
		n = n.length ? n : [n];
		w = w.nodeName ? w : this.create(w);
		w = n[0].parentNode.insertBefore(w, n[0]);
		$(n).each(function() {
			if (this!=w) {
				w.appendChild(this);
			}
		})
		return w;
	}
	
	/**
	 * Оборачивает все содержимое ноды
	 *
	 * @param  DOMElement n  оборачиваемая нода
	 * @param  DOMElement w  нода обертка или имя тега
	 * @return DOMElement
	 **/
	this.wrapContents = function(n, w) {
		w = w.nodeName ? w : this.create(w);
		for (var i=0; i < n.childNodes.length; i++) {
			w.appendChild(n.childNodes[i]);
		};
		n.appendChild(w);
		return w;
	}
	
	this.cleanNode = function(n) {

		if (n.nodeType != 1) {
			return;
		}
		if (/^(P|LI)$/.test(n.nodeName) && (l = this.findLastNotEmpty(n)) && l.nodeName == 'BR') {
			$(l).remove();
		}
		$n = $(n);
		$n.children().each(function() {
			this.cleanNode(this);
		});
		if (n.nodeName != 'BODY' && !/^(TABLE|TR|TD)$/.test(n) && this.isEmpty(n)) {
			return $n.remove();
		}
		if ($n.attr('style') === '') {
			$n.removeAttr('style');
		}
		if (this.rte.browser.safari && $n.hasClass('Apple-span')) {
			$n.removeClass('Apple-span');
		}
		if (n.nodeName == 'SPAN' && !$n.attr('style') && !$n.attr('class') && !$n.attr('id')) {
			$n.replaceWith($n.html());
		}
	}
	
	this.cleanChildNodes = function(n) {
		var cmd = this.cleanNode;
		$(n).children().each(function() { cmd(this); });
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
	
	function filter(f) {
		return f = typeof(f) == 'object' ? f : self.regExp[f]||self.regExp.dummy;
	}
	
	/**
	 * Return true if node matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.is = function(n, f) {
		switch(typeof(f)) {
			case 'string':
				f = this.filters[f]||this.filters['dummy'];
				return f[0].test(n.nodeName) || (f[1] ? f[1](n) : false);
				break;
			case 'object':
				return f.test(n.nodeName);
				break;
			case 'function':
				return f(n);
		}
		return false;
	}

	/**
	 * Find in node childs nodes matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Array
	 **/
	this.find = function(n, f) {
		var r = [];
		$(n).find('*').each(function() {
			if (self.is(this, f)) {
				r.push(this);
			}
		})
		return r;
	}
	
	/**
	 * Return closest parent which is child node of p or body and with node name matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @param  DOMElement    p  if set, find parents not up one
	 * @return DOMElement|null
	 **/
	this.parent = function(n, f, p) {
		p = p||this.body;
		while (n && n.nodeName && n != this.body && (n = n.parentNode) && n != p) {
			if (this.is(n, f)) {
				return n;
			}
		}
		return null;
	}
	
	/**
	 * Return parents - childs of p(or body) with node names matched by filter
	 *
	 * @param  DOMElement    n  node to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @param  DOMElement    p  if set, find parents not up one
	 * @return Array
	 **/
	this.parents = function(n, f, p) {
		var r = [];
		while ((n = this.parent(n, f, p))) {
			r.push(n);
		}
		return r;
	}
	
	/**
	 * Return true if selection is matches filter or has parent or child matches filter
	 *
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Boolean
	 **/
	this.selectionIs = function(f) {
		var n = this.rte.selection.getNode();
		return this.is(n, f) || this.parent(n, f) || (!this.rte.selection.collapsed() && this.find(this.rte.selection.cloneContents(), f).length) ? true : false;
	}
	
	/**
	 * Return nodes matched by filter
	 *
	 * @param  Array         n  array of nodes to test
	 * @param  String|RegExp|Function f  filter name or RegExp or function
	 * @return Array
	 **/
	this.filter = function(n, f) {
		var l = n.length, r = [];
		while (l--) {
			if (this.is(n[l], f)) {
				r.unshift(n);
			}
		}
		return r;
	}
	
	this.cutNode = function(n, l, r) {
		var c = n.cloneNode(false), p, nodes;
		
		n.nextSibling ? n.parentNode.insertBefore(c, n.nextSibling) : n.parentNode.appendChild(c);
		n.appendChild($(this.create('span')).addClass('elrte-bm')[0]);
		nodes = this.traverse(r, n.lastChild);
		n.removeChild(nodes.pop())
		nodes.shift();

		$.each(nodes, function() {
			c.appendChild(this);
		});

		$.each(this.traverse(l, r), function() {
			c.parentNode.insertBefore(this, c)
		});
	}

	this.moveNodesToRight = function(n, b) {
		var nodes, i, p = n.parentNode, _n;
		
		n.appendChild($(this.create('span')).addClass('elrte-bm')[0]);
		nodes = this.traverse(b, n.lastChild);
		n.removeChild(nodes.pop());
		i = nodes.length;
		while (i--) {
			_n = this.cloneParents(nodes[i], n);
			if (n.nextSibling) {
				p.insertBefore(_n, n.nextSibling);
			} else {
				p.appendChild(_n);
			}
		}
	}
	
	this.moveNodesToLeft = function(n, b) {
		var nodes, p = n.parentNode, _n;
		
		n.insertBefore($(this.create('span')).addClass('elrte-bm')[0], n.firstChild);
		nodes = this.traverse(n.firstChild, b);
		
	}
	
	this.traverse = function(s, e) {
		var p = this.findCommonAncestor(s, e), sp = s, ep = e, n=s, res = [], tmp = [e];
		this.doc.body.normalize();
		while (sp.parentNode != p) {
			sp = sp.parentNode;
		}
		
		while (ep.parentNode != p) {
			ep = ep.parentNode;
		}
		
		res.push(s)
		while (n != sp) {
			n!=s && res.push(n);
			$.merge(res, this.nextAll(n));
			n = n.parentNode;
		}
		
		while ((n = this.next(n)) && n != ep) {
			res.push(n);
		}
		
		n = e;
		while (n != ep) {
			n != e && tmp.push(n);
			tmp = tmp.concat(this.prevAll(n));
			n = n.parentNode;
		}
		return res.concat(tmp.reverse());
	}
	
	
	this.cloneParents = function(n, p) {
		var ret=null;
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
	
	this.unwrap = function(n) {
		// $(n).replaceWith($(n).html());
		while (n.firstChild) {
			n.parentNode.insertBefore(n.firstChild, n);
		}
		n.parentNode.removeChild(n);
	}
	
}

})(jQuery);