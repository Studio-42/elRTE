(function($) {
	
	elRTE.prototype.commands.undo = function(rte) {
		this.rte    = rte;
		this.name   = 'undo';
		this.title  = 'Undo';
		
		this.exec = function() {
			this.rte.log('undo')
			
			this.rte.history.back();
		}
		
		this.init(rte);
		
	}
	
	elRTE.prototype.commands.undo.prototype = elRTE.prototype.command;
	
})(jQuery);