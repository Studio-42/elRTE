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
			var n;
			if (this.sel.collapsed()) {
				n = this.dom.parent(this.sel.getNode(), /^BLOCKQUOTE$/, null, true);
				if (n) {
					this.dom.unwrap(n);
					return true
				}
			} else {
				n = this.dom.create('blockquote');
				$(n).html($(this.sel.cloneContents()).html())
				n = this.sel.insertNode(n)
				this.sel.select(n)
				return true
			}
			


		}
		
		this.init(rte);
	
		
		
	}
	
	elRTE.prototype.commands.blockquote.prototype = elRTE.prototype.command;
	
})(jQuery);