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
		
		this.events = {
			'wysiwyg' : function() { this._setState(this.STATE_ENABLE); },
			'source close'   : function() { this.rte.count() == 1 && this._setState(this.STATE_DISABLE); }
		}
	}
	
})(jQuery);