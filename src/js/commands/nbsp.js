(function($) {
	
	/**
	 * @class elRTE command nbsp
	 * Insert non breakable space into selection
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.nbsp = function(n) {
		var self   = this;
		this.name  = n;
		this.title = 'Non breakable space';
		
		this.exec = function() {
			return this.sel.insertHtml('&nbsp;');
		}
		
		this.state = function() {
			return this._enabled;
		}
		
	}
	
	elRTE.prototype.commands.nbsp.prototype = elRTE.prototype.command;
	
})(jQuery);