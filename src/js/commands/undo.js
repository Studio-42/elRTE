(function($) {
	
	/**
	 * @class undo - undo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.undo = function() {
		this.title = 'Undo last action';
		
		
		this._exec = function() {
			return this.rte.history.undo();
		}
		
		this._getState = function() {
			return this.rte.history.canUndo() ? this.STATE_ENABLE : this.STATE_DISABLE;
		}
		
		this.events = {
			'wysiwyg historyChange' : this.update,
			'close source' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}
		
	}

	
})(jQuery);