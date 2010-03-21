(function($) {
	
	elRTE.prototype.msSelection = function(rte) {

		this.superclass(rte);
		var self = this;
		
		/**
		 * @return Selection
		 **/
		this.getSelection = function() {
			return this.doc.selection;
		}
		
		/**
		 * @return Range
		 **/
		this.getRange = function() {
			var r;
			try { 
				r = this.doc.selection.createRange(); 
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
		 * @return msSelection
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
		
		this.cloneContents = function() {
			var d = this.dom.create('div')
			$(d).html(this.getRange().htmlText)
			return d;
		}
		
		/**
		 * select from start node to end node
		 * @param  DOMElement
		 * @param  DOMElement
		 * @return msSelection
		 **/
		this.select = function(start, end) {
			var r  = this.doc.body.createTextRange(),
				r1 = r.duplicate(),
				r2 = r.duplicate();
			
			r1.moveToElementText(start);
			r2.moveToElementText(end||start);
			r.setEndPoint('StartToStart', r1);
			r.setEndPoint('EndToEnd',     r2);
			r.select();
			return this;
		}
		
		/**
		 * Insert node into begining of selection
		 * @param  DOMElement
		 * @return DOMElement
		 **/
		this.insertNode = function(n) {
			var id = 'tmp-'+Math.random().toString().substr(2),
				w  = this.dom.create('span');
			$(n).attr('id', id);
			w.appendChild(n)
			this.insertHtml(w.innerHTML);
			n = this.doc.getElementById(id);
			$(n).removeAttr('id');
			return n;
		}
	
		/**
		 * Insert html into selection
		 * @param  String
		 * @return msSelection
		 **/
		this.insertHtml = function(html) {
			this.getRange().pasteHTML(html);
			return this;
		}
		
		/**
		 * Create bookmark (to store selection)
		 * @return String
		 **/
		this.getBookmark = function() {

			this.win.focus();
			var r  = this.getRange(),
				r1 = r.duplicate(),
				r2 = r.duplicate(),
				s  = this.dom.createBookmark(),
				e  = this.dom.createBookmark(),
				_s = this.dom.create('span'),
				_e = this.dom.create('span');

			_s.appendChild(s);
			_e.appendChild(e);

			r1.collapse(true);
			r1.pasteHTML(_s.innerHTML);
			r2.collapse(false);
			r2.pasteHTML(_e.innerHTML);

			return [this.doc.getElementById($(s).attr('id')), this.doc.getElementById($(e).attr('id'))];
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