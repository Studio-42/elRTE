(function($) {
	
	/**
	 * @class redo - redo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.redo = function() {
		this.title = 'Redo previous action';
		
		this._exec = function() {
			return this.rte.history.redo();
		}
		
		this._getState = function() {
			return this.rte.history.canRedo() ? this.STATE_ENABLE : this.STATE_DISABLE;
		}
		
		this.events = {
			'wysiwyg historyChange' : this.update,
			'close source' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}
	}

	
})(jQuery);