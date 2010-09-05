(function($) {
	
	/**
	 * @class elRTE command.
	 * Select all document's content 
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.selectall = function() {
		this.title = 'Select all';
		
		this._exec = function() {
			return this.sel.selectAll();
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	
})(jQuery);