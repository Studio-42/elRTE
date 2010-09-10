(function($) {
	/**
	 * Common bind method for undo/redo classes
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.historyBind = function() {
		var self = this;
		
		this.rte.bind('wysiwyg historyChange', function(e) {
			self._update();
		}).bind('close source', function(e) {
			e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
		});
	}

	/**
	 * @class undo - undo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.undo = function() {
		this.title = 'Undo last action';
		
		this.bind = function() {
			this.rte.commands.historyBind.call(this);
		}
		
		this._exec = function() {
			return this.rte.history.undo();
		}
		
		this._getState = function() {
			return this.rte.history.canUndo() ? this.STATE_ENABLE : this.STATE_DISABLE;
		}
	}
	
	/**
	 * @class redo - redo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.redo = function() {
		this.title = 'Redo previous action';
		
		this.bind = function() {
			this.rte.commands.historyBind.call(this);
		}
		
		this._exec = function() {
			return this.rte.history.redo();
		}
		
		this._getState = function() {
			return this.rte.history.canRedo() ? this.STATE_ENABLE : this.STATE_DISABLE;
		}
	}
	
})(jQuery);