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
		
		// this.init(rte);

		this.exec = function() {
			var n;
			if ((n = this.sel.insertHtml('&nbsp;')).length) {
				this.sel.select(n[0]).collapse();
				return true;
			}
		}
		
		this.state = function() {
			return this._enabled;
		}
		
	}
	
	elRTE.prototype.commands.nbsp.prototype = elRTE.prototype.command;
	
})(jQuery);