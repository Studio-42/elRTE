(function($) {
	
	elRTE.prototype.w3cSelection = function(rte) {
		// this.constructor.prototype.constructor.call(this, rte);
		this.superclass(rte)
		var self = this;
		// $(this.rte.doc).bind('mouseup', function(e) {
		// 	// self.log(e.target)
		// 	self.node = e.target.nodeName.match(/^(HR|IMG)$/) ? e.target : null;
		// }).bind('keyup', function() {
		// 	self.node = null;
		// })
	
		/**
		 * @return Selection
		 **/
		this.getSelection = function() {
			return this.win.getSelection();
		}
	
		/**
		 * @return Range
		 **/
		this.getRange = function() {
			var s = this.getSelection();
			return s.rangeCount ? s.getRangeAt(0) : this.doc.createRange();
		}
	
		this.cloneRange = function() {
			return this.getRange().clone();
		}
	
		/**
		 * return true if range is collapsed
		 * @return Boolean
		 **/
		this.collapsed = function() {
			return this.getRange().collapsed;
		}
		
		/**
		 * collapse range
		 * @return w3cSelection
		 **/
		this.collapse = function(toStart) {
			this.getRange().collapse(toStart);
			return this;
		}
	
		/**
		 * select node
		 * @param DOMElement
		 * @return w3cSelection
		 **/
		this.selectNode = function(n) {
			var s = this.getSelection(),
				r = this.getRange();
			r.selectNode(n);
			s.removeAllRanges();
			s.addRange(r);
			return this;
		}
	
		/**
		 * select from start node to end node
		 * @param  DOMElement
		 * @param  DOMElement
		 * @return w3cSelection
		 **/
		this.select = function(start, end) {
			var s = this.getSelection(),
				r = this.getRange();
			r.setStartBefore(start);
			r.setEndAfter(end);
			s.removeAllRanges();
			s.addRange(r);
			return this;
		}
	
		/**
		 * Return clone of selection contents wrapped in div
		 *
		 * @return DOMElement
		 **/
		this.cloneContents = function() {
			var c = this.getRange().cloneContents(),
				l = c.childNodes.length, i,
				n = this.dom.create('div');
			for (i=0; i<l; i++) {
				n.appendChild(c.childNodes[i].cloneNode(true));
			}
			return n;
		}
	
		/**
		 * Insert node into begining of selection
		 * @param  DOMElement
		 * @return w3cSelection
		 **/
		this.insertNode = function(n, r) {
			var r = this.getRange();
			(r||this.getRange()).insertNode(n);
			return n;
		}
	
		/**
		 * Insert html into selection
		 * @param  String
		 * @return w3cSelection
		 **/
		this.insertHtml = function(html) {
			var n = $(this.dom.create('span')).html(html);
			this.insertNode(n)
			n.replaceWith(n.html());
			return this;
		}
	
		/**
		 * Create bookmark (to store selection)
		 * @return String
		 **/
		this.getBookmark = function() {
			this.win.focus();
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
		 * @return w3cSelection
		 **/
		this.moveToBookmark = function(b) {
			var s = b[0] && b[0].nodeName ? b[0] : this.doc.getElementById(b[0]),
				e = b[1] && b[1].nodeName ? b[1] : this.doc.getElementById(b[1]);

			this.win.focus();
			if (s.nodeName && e.nodeName) {
				this.select(s, e);
				s.parentNode.removeChild(s);
				e.parentNode.removeChild(e);
			}
			return this;
		}
		
		/**
		 * Remove bookmarks nodes
		 * @return w3cSelection
		 **/
		this.cleanBookmarks = function() {
			$(this.doc.body).find('.elrte-bm').remove();
			return this;
		}
	
		/**
		 * Return common ancestor for selected nodes
		 *
		 * @return DOMElement
		 **/
		this.getNode = function() {
			var n;
			if (this.node) {
				return this.node
			} 
			n = this.getRange().commonAncestorContainer;
			return n.nodeType == 1 ? n : n.parentNode;
		}
		
		this.info = function() {
			var s = this.getSelection(),
				r = this.getRange();
			self.log('Selection:')
			self.log(s.anchorNode)
			self.log('anchorOffset: '+s.anchorOffset)
			self.log(s.focusNode)
			self.log('focusOffset: '+s.focusOffset)
			self.log('isCollapsed: '+s.isCollapsed)
			self.log('rangeCount: '+s.rangeCount)
			self.log('Range:')
			self.log('collapsed: '+r.collapsed)
			self.log(r.commonAncestorContainer)
			self.log(r.startContainer)
			self.log(r.startOffset)
			self.log(r.endContainer)
			self.log(r.endOffset)
		
		}
		
		function realSelected(n, p, s) {
			while (n.nodeName != 'BODY' && n.parentNode && n.parentNode.nodeName != 'BODY' && (p ? n!== p && n.parentNode != p : 1) && ((s=='left' && self.rte.dom.isFirstNotEmpty(n)) || (s=='right' && self.rte.dom.isLastNotEmpty(n)) || (self.rte.dom.isFirstNotEmpty(n) && self.rte.dom.isLastNotEmpty(n))) ) {
				n = n.parentNode;
			}
			return n;
		}
		
	
		
	}
	
	
	elRTE.prototype.w3cSelection.prototype = elRTE.prototype.selection.prototype;
	
	elRTE.prototype.w3cSelection.prototype.superclass = elRTE.prototype.selection;
	
})(jQuery);