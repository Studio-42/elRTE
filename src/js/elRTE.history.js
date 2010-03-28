(function($) {
	
	elRTE.prototype.history = function(rte) {
		this.rte = rte;
		var prev = {}, next = [];
		
		/**
		 * Save active document in history
		 **/
		this.add = function() {
			if (this.rte.options.historySize > 0 && this.rte.active) {
				var id = this.rte.active.id,
					bm = this.rte.selection.getBookmark();
					
				if (!prev[id]) {
					prev[id] = [];
				} 
				
				prev[id].unshift({ 
					html : $(this.rte.active.document.body).html(), 
					s    : bm[0].id, 
					e    : bm[1].id
				});
				
				this.rte.selection.removeBookmark(bm);
				if (prev[id].length > this.rte.options.historySize) {
					prev[id].pop();
				}
			}
		}
		
		this.canBack = function() {
			
		}
		
		this.back = function() {
			
			if (this.rte.active) {
				var id = this.rte.active.id, d;
				// if (prev[id] && prev[])
			}
			
			if (this.rte.active && prev[this.rte.active.id] && prev[this.rte.active.id].length) {

				var id = this.rte.active.id,
					d = prev[id].shift();
				this.rte.log(d)
				
				$(this.rte.active.document.body).html(d.html);
				this.rte.active.window.focus();
				this.rte.selection.moveToBookmark([d.s, d.e]);
			}
		}
	
	}
	
	
	
})(jQuery);