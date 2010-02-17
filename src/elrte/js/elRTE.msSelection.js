(function($) {
	
	elRTE.prototype.msSelection = function(rte) {
		// this.constructor.prototype.constructor.call(this, rte);
		this.superclass(rte);
		var self = this;
		
		/**
		 * @return Selection
		 **/
		this.getSelection = function() {
			return this.win.document.selection;
		}
		
		/**
		 * @return Range
		 **/
		this.getRange = function() {
			var r;
			try { 
				r = this.win.document.selection.createRange(); 
			} catch(e) { 
				r = this.doc.body.createTextRange(); 
			}
			return r;
		}
		
		/**
		 * return true if range is collapsed
		 * @return Boolean
		 **/
		this.collapsed = function() {
			var r = this.getRange();
			return r.item ? false : r.boundingWidth == 0;
		}
		
		/**
		 * collapse range
		 * @return w3cSelection
		 **/
		this.collapse = function(toStart) {
			var r = this.getRange(), n;
			if (r.item) {
				n = r.item(0);
				r = this.doc.body.createTextRange();
				r.moveToElementText(n);
			}
			r.collapse(toStart);
			r.select();
			return this;
		}
		
		/**
		 * select node
		 * @param DOMElement
		 * @return w3cSelection
		 **/
		this.selectNode = function(n) {
			var r = this.getRange()
			r.moveToElementText(n);
			r.select();
			return this;
		}
		
		/**
		 * select from start node to end node
		 * @param  DOMElement
		 * @param  DOMElement
		 * @return w3cSelection
		 **/
		this.select = function(start, end) {
			var r  = this.doc.body.createTextRange(),
				r1 = r.duplicate(),
				r2 = r.duplicate();
			
			r1.moveToElementText(start)
			r2.moveToElementText(end)
			r.setEndPoint('StartToStart', r1)
			r.setEndPoint('EndToEnd', r2)
			r.select();
			// this.log(this.cloneContents())
			return this;
		}
		
		this.cloneContents = function() {
			var d = this.dom.create('div')
			// this.log(this.getRange().htmlText)
			$(d).html(this.getRange().htmlText)
			// d.innerHtml = this.getRange().htmlText
			return d;
			// return this.dom.create('div').innerHtml = this.getRange().htmlText
		}
		
		/**
		 * Insert node into begining of selection
		 * @param  DOMElement
		 * @return w3cSelection
		 **/
		this.insertNode = function(n) {
			var w = this.dom.create('span').appendChild(n)
			this.insertHtml(w.innerHTML)
			return this;
		}
	
		/**
		 * Insert html into selection
		 * @param  String
		 * @return w3cSelection
		 **/
		this.insertHtml = function(html) {
			this.getRange().pasteHTML(html);
			return this;
			// var n = $(this.dom.create('span')).html(html);
			// this.getRange().insertNode(n[0]);
			// n.replaceWith(n.html);
		}
		
		
		
		/**
		 * Create bookmark (to store selection)
		 * @return String
		 **/
		this.getBookmark = function() {
			return this.getRange().getBookmark();
		}
	
		/**
		 * Move selection to bookmark
		 * @return w3cSelection
		 **/
		this.moveToBookmark = function(b) {
			this.getRange().moveToBookmark(b);
			return this;
		}
		
		/**
		 * Remove bookmarks nodes
		 * @return w3cSelection
		 **/
		this.cleanBookmarks = function() {
			return this;
		}
		
		/**
		 * Return common ancestor for selected nodes
		 * @return DOMElement
		 **/
		this.getNode = function() {
			return this.getRange().parentElement();
		}
		
	}
	
	
	elRTE.prototype.msSelection.prototype = elRTE.prototype.selection.prototype;
	
	elRTE.prototype.msSelection.prototype.superclass = elRTE.prototype.selection;
	
})(jQuery);