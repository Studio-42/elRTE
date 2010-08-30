(function($) {
	/**
	 * @class history - parent class for undo/redo commands
	 *
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.history = function() {
		
		/**
		 * Return button state based on history state
		 *
		 * @return Number
		 **/
		this.state = function() {
			return this.rte.history[this.name == 'undo' ? 'canUndo' : 'canRedo']() ? this._enabled : this._disabled;
		}
		
		/**
		 * Exec history command (undo/redo)
		 * Not return true because history call trigger "change" itself 
		 *
		 * @return Number
		 **/
		this.exec = function() {
			this.rte.history[this.name]();
		}
		
		/**
		 * Bind update ui methods
		 *
		 * @return void
		 **/
		this._bind = function() {
			var self = this;
			
			this.rte.bind('wysiwyg historyChange', function(e) {
				self.updateUI(self.state());
			}).bind('close source', function(e) {
				if (e.type == 'source' || e.data.id == self.rte.active.id) {
					self.updateUI(self._disabled);
				}
			});
		}
	}
	
	elRTE.prototype.commands.history.prototype = elRTE.prototype.command;
	
	/**
	 * @class undo - undo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.undo = function(n) {
		this.name  = n;
		this.title = 'Undo last action';
		// this.init(rte);
	}
	
	/**
	 * @class redo - redo button
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.redo = function(n) {
		this.name  = n;
		this.title = 'Redo previous action';
		// this.init(rte);
	}
	
	elRTE.prototype.commands.undo.prototype = elRTE.prototype.commands.redo.prototype = new elRTE.prototype.commands.history;
	
})(jQuery);