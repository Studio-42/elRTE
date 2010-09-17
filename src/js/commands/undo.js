(function($) {
	
	/**
	 * @class undo - undo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.undo = function() {
		this.title = 'Undo last action';
		
		this.bind = function() {
			this.rte.mixins.historyBind.call(this);
		}
		
		this._exec = function() {
			return this.rte.history.undo();
		}
		
		this._getState = function() {
			return this.rte.history.canUndo() ? this.STATE_ENABLE : this.STATE_DISABLE;
		}
	}

	
})(jQuery);