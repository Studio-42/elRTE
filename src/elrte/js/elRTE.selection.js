(function($) {
	
	elRTE.prototype.selection = function(rte) {
		this.rte = rte;
		this.win = rte.window;
		this.doc = rte.doc;
		this.dom = rte.dom;
		this.log = rte.log;
		this.node = null;
	}
	
	elRTE.prototype.selection.prototype.rawSelected = function(collapsed, blocks) {
		var res = {so : null, eo : null, nodes : []};
		var r   = this.getRange();
		var ca  = r.commonAncestorContainer;
		var s, e;  // start & end nodes
		var sf  = false; // start node fully selected
		var ef  = false; // end node fully selected
		var dom = this.dom

		ca.normalize()

		function realSelected(n, p, s) {
			while (n.nodeName != 'BODY' && n.parentNode && n.parentNode.nodeName != 'BODY' && (p ? n!== p && n.parentNode != p : 1) && ((s=='left' && dom.isFirstNotEmpty(n)) || (s=='right' && dom.isLastNotEmpty(n)) || (dom.isFirstNotEmpty(n) && dom.isLastNotEmpty(n))) ) {
				n = n.parentNode;
			}
			return n;
		}

		// возвращает true, если нода не текстовая или выделена полностью
		function isFullySelected(n, s, e) {
			if (n.nodeType == 3) {
				e = e>=0 ? e : n.nodeValue.length;
				return (s==0 && e==n.nodeValue.length) || $.trim(n.nodeValue).length == $.trim(n.nodeValue.substring(s, e)).length;
			} 
			return true;
		}

		// возвращает true, если нода пустая или в ней не выделено ни одного непробельного символа
		function isEmptySelected(n, s, e) {
			if (n.nodeType == 1) {
				return dom.isEmpty(n);
			} else if (n.nodeType == 3) {
				return $.trim(n.nodeValue.substring(s||0, e>=0 ? e : n.nodeValue.length)).length == 0;
			} 
			return true;
		}


		//this.dump()
		// начальная нода
		if (r.startContainer.nodeType == 1) {
			if (r.startOffset<r.startContainer.childNodes.length) {
				s = r.startContainer.childNodes[r.startOffset];
				res.so = s.nodeType == 1 ? null : 0;
			} else {
				s = r.startContainer.childNodes[r.startOffset-1];
				res.so = s.nodeType == 1 ? null : s.nodeValue.length;
			}
		} else {
			s = r.startContainer;
			res.so = r.startOffset;
		} 

		// выделение схлопнуто
		if (r.collapsed) {
			if (collapsed) {
				//  блочное выделение
				if (blocks) {
					s = realSelected(s);
					if (!this.rte.dom.isEmpty(s) || (s = this.rte.dom.next(s))) {
						res.nodes = [s];
					} 

					// добавляем инлайн соседей 
					if (this.rte.dom.isInline(s)) {
						res.nodes = this.rte.dom.toLineStart(s).concat(res.nodes, this.rte.dom.toLineEnd(s));
					}

					// offset для текстовых нод
					if (res.nodes.length>0) {
						res.so = res.nodes[0].nodeType == 1 ? null : 0;
						res.eo = res.nodes[res.nodes.length-1].nodeType == 1 ? null : res.nodes[res.nodes.length-1].nodeValue.length;
					}

				} else if (!this.rte.dom.isEmpty(s)) {
					res.nodes = [s];
				}

			}
			return res;
		}

		// конечная нода
		if (r.endContainer.nodeType == 1) {
			e = r.endContainer.childNodes[r.endOffset-1];
			res.eo = e.nodeType == 1 ? null : e.nodeValue.length;
		} else {
			e = r.endContainer;
			res.eo = r.endOffset;
		} 
		// this.rte.log('select 1')
		//this.dump(ca, s, e, res.so, res.eo)

		// начальная нода выделена полностью - поднимаемся наверх по левой стороне
		if (s.nodeType == 1 || blocks || isFullySelected(s, res.so, s.nodeValue.length)) {
//			this.rte.log('start text node is fully selected')
			s = realSelected(s, ca, 'left');
			sf = true;
			res.so = s.nodeType == 1 ? null : 0;
		}
		// конечная нода выделена полностью - поднимаемся наверх по правой стороне
		if (e.nodeType == 1 || blocks || isFullySelected(e, 0,  res.eo)) {
//			this.rte.log('end text node is fully selected')
			e = realSelected(e, ca, 'right');
			ef = true;
			res.eo = e.nodeType == 1 ? null : e.nodeValue.length;
		}

		// блочное выделение - если ноды не элементы - поднимаемся к родителю, но ниже контейнера
		if (blocks) {
			if (s.nodeType != 1 && s.parentNode != ca && s.parentNode.nodeName != 'BODY') {
				s = s.parentNode;
				res.so = null;
			}
			if (e.nodeType != 1 && e.parentNode != ca && e.parentNode.nodeName != 'BODY') {
				e = e.parentNode;
				res.eo = null;
			}
		}

		// если контенер выделен полностью, поднимаемся наверх насколько можно
		if (s.parentNode == e.parentNode && s.parentNode.nodeName != 'BODY' && (sf && this.rte.dom.isFirstNotEmpty(s)) && (ef && this.rte.dom.isLastNotEmpty(e))) {
//			this.rte.log('common parent')
			s = e = s.parentNode;
			res.so = s.nodeType == 1 ? null : 0;
			res.eo = e.nodeType == 1 ? null : e.nodeValue.length;
		}
		// начальная нода == конечной ноде
		if (s == e) {
//			this.rte.log('start is end')
			if (!this.rte.dom.isEmpty(s)) {
				res.nodes.push(s);
			}
			return res;
		}
		 // this.rte.log('start 2')
		  //this.dump(ca, s, e, res.so, res.eo)

		// находим начальную и конечную точки - ноды из иерархии родителей начальной и конечно ноды, у которых родитель - контейнер
		var sp = s;
		while (sp.nodeName != 'BODY' && sp.parentNode !== ca && sp.parentNode.nodeName != 'BODY') {
			sp = sp.parentNode;
		}
		//this.rte.log(s.nodeName)
		// this.rte.log('start point')
		// this.rte.log(sp)

		var ep = e;
//		this.rte.log(ep)
		while (ep.nodeName != 'BODY' && ep.parentNode !== ca && ep.parentNode.nodeName != 'BODY') {
			this.rte.log(ep)
			ep = ep.parentNode;
		}
		// this.rte.log('end point')
		// this.rte.log(ep)


		//  если начальная нода не пустая - добавляем ее
		if (!isEmptySelected(s, res.so, s.nodeType==3 ? s.nodeValue.length : null)) {
			res.nodes.push(s);
		}
		// поднимаемся от начальной ноды до начальной точки
		var n = s;
		while (n !== sp) {
			var _n = n;
			while ((_n = this.rte.dom.next(_n))) {
					res.nodes.push(_n);
			}
			n = n.parentNode;
		}
		// от начальной точки до конечной точки
		n = sp;
		while ((n = this.rte.dom.next(n)) && n!= ep ) {
//			this.rte.log(n)
			res.nodes.push(n);
		}
		// поднимаемся от конечной ноды до конечной точки, результат переворачиваем
		var tmp = [];
		n = e;
		while (n !== ep) {
			var _n = n;
			while ((_n = this.rte.dom.prev(_n))) {
				tmp.push(_n);
			}
			n = n.parentNode;
		}
		if (tmp.length) {
			res.nodes = res.nodes.concat(tmp.reverse());
		}
		//  если конечная нода не пустая и != начальной - добавляем ее
		if (!isEmptySelected(e, 0, e.nodeType==3 ? res.eo : null)) {
			res.nodes.push(e);
		}

		if (blocks) {
			// добавляем инлайн соседей слева
			if (this.rte.dom.isInline(s)) {
				res.nodes = this.rte.dom.toLineStart(s).concat(res.nodes);
				res.so    = res.nodes[0].nodeType == 1 ? null : 0;
			}
			// добавляем инлайн соседей справа
			if (this.rte.dom.isInline(e)) {
				res.nodes = res.nodes.concat(this.rte.dom.toLineEnd(e));
				res.eo    = res.nodes[res.nodes.length-1].nodeType == 1 ? null : res.nodes[res.nodes.length-1].nodeValue.length;
			}
		}

		// все радуются! :)
		return res;
	}
	
	/**
	 * Возвращает массив выбранных нод
	 *
	 * @param   Object  o  параметры получения и обработки выбраных нод
	 * @return  Array
	 **/
	elRTE.prototype.selection.prototype.selected = function(o) {
		var opts = {
			collapsed : false,  // вернуть выделение, даже если оно схлопнуто
			blocks    : false,  // блочное выделение
			filter    : false,  // фильтр результатов
			wrap      : 'text', // что оборачиваем
			tag       : 'span'  // во что оборачиваем
		}
		opts = $.extend({}, opts, o);
		
		// блочное выделение - ищем блочную ноду, но не таблицу
		if (opts.blocks) {
			var n  = this.getNode(), _n = null;
			if (_n = this.rte.dom.selfOrParent(n, 'selectionBlock') ) {
				return [_n];
			} 
		}

		var sel    = this.rawSelected(opts.collapsed, opts.blocks);
		var ret    = [];
		var buffer = [];
		var ndx    = null;
		var dom    = this.dom;

		// оборачиваем ноды в буффере
		function wrap() {
			
			function allowParagraph() {
				for (var i=0; i < buffer.length; i++) {
					if (buffer[i].nodeType == 1 && (dom.selfOrParent(buffer[i], /^P$/) || $(buffer[i]).find('p').length>0)) {
						return false;
					}
				};
				return true;
			} 
			
			if (buffer.length>0) {
				var tag  = opts.tag == 'p' && !allowParagraph() ? 'div' : opts.tag;
				var n    = dom.wrap(buffer, tag);
				ret[ndx] = n;
				ndx      = null;
				buffer   = [];
			}
		}
		
		// добавляем ноды в буффер
		function addToBuffer(n) {
			if (n.nodeType == 1) {
				if (/^(THEAD|TFOOT|TBODY|COL|COLGROUP|TR)$/.test(n.nodeName)) {
					$(n).find('td,th').each(function() {
						var tag = opts.tag == 'p' && $(this).find('p').length>0 ? 'div' : opts.tag;
						var n = dom.wrapContents(this, tag);
						return ret.push(n);
					})
				} else if (/^(CAPTION|TD|TH|LI|DT|DD)$/.test(n.nodeName)) {
					var tag = opts.tag == 'p' && $(n).find('p').length>0 ? 'div' : opts.tag;
					var n = dom.wrapContents(n, tag);
					return ret.push(n);
				} 
			} 
			var prev = buffer.length>0 ? buffer[buffer.length-1] : null;
			if (prev && prev != dom.prev(n)) {
				wrap();
			}
			buffer.push(n); 
			if (ndx === null) {
				ndx = ret.length;
				ret.push('dummy'); // заглушка для оборачиваемых элементов
			}
		}
		
		if (sel.nodes.length>0) {
			
			for (var i=0; i < sel.nodes.length; i++) {
				var n = sel.nodes[i];
					// первую и посл текстовые ноды разрезаем, если необходимо
					 if (n.nodeType == 3 && (i==0 || i == sel.nodes.length-1) && $.trim(n.nodeValue).length>0) {
						if (i==0 && sel.so>0) {
							n = n.splitText(sel.so);
						}
						if (i == sel.nodes.length-1 && sel.eo>0) {
							n.splitText(i==0 && sel.so>0 ? sel.eo - sel.so : sel.eo);
						}
					}

					switch (opts.wrap) {
						// оборачиваем только текстовые ноды с br
						case 'text':
							if ((n.nodeType == 1 && n.nodeName == 'BR') || (n.nodeType == 3 && $.trim(n.nodeValue).length>0)) {
								addToBuffer(n);
							} else if (n.nodeType == 1) {
								ret.push(n);
							}
							break;
						// оборачиваем все инлайн элементы	
						case 'inline':
							if (this.rte.dom.isInline(n)) {
								addToBuffer(n);
							} else if (n.nodeType == 1) {
								
								ret.push(n);
							}
							break;
						// оборачиваем все	
						case 'all':
							if (n.nodeType == 1 || !this.rte.dom.isEmpty(n)) {
								addToBuffer(n);
							}
							break;
						// ничего не оборачиваем
						default:
							if (n.nodeType == 1 || !this.rte.dom.isEmpty(n)) {
								ret.push(n);
							}
					}
			};
			wrap();
		}
		// this.rte.log('buffer')
		// this.rte.log(buffer)
		// this.rte.log('ret')
		// this.rte.log(ret)		
		return opts.filter ? this.rte.dom.filter(ret, opts.filter) : ret;
	}

	
	
})(jQuery);