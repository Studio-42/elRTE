(function($) {
	elRTE.prototype.commands.blockquote = function(rte) {
		this.rte    = rte;
		this.name   = 'blockquote';
		this.title  = 'Blockquote';
		
		this.state = function() {
			if (this.rte.wysiwyg) {
				if (this.sel.collapsed() && this.dom.parent(this.sel.getNode(), /^BLOCKQUOTE$/, null, true)) {
					return 1
				}
				return 0
			}
			return -1;
		}
		
		
		this.exec = function() {
			var //b = this.sel.getBookmark(),
				// s = this.sel.selected(),
				n = this.dom.create('blockquote');
				
			// this.rte.log(s)
			// this.rte.log(this.dom.is(n, 'blockText'))
			// debugger
			// this.dom.smartWrapAll(s, 'blockquote')
			$(n).html($(this.sel.cloneContents()).html())
			// this.sel.insertNode(n)
			// var html = '<blockquote>'+$(this.sel.cloneContents()).html()+'</blockquote>'
			// this.rte.log(html)
			n = this.sel.insertNode(n)
			this.sel.select(n)
			// var r = this.sel.getRange();
			// r.surroundContents(this.dom.create('blockquote'))
			// this.sel.moveToBookmark(b)
		}
		
		this.init(rte);
	
		
		
	}
	
	elRTE.prototype.commands.blockquote.prototype = elRTE.prototype.command;
	
})(jQuery);