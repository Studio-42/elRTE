(function($) {
	/**
	 * @class Parent class for undo/redo buttons
	 */
	elRTE.prototype.commands.history = function(rte) {
		
		this._init = function(rte) {
			this.init(rte);
		}
		
		/**
		 * Bind to rte and history events
		 */
		this.bind = function() {
			var self = this;

			this.rte.bind('close source blur', function() {
				self.button.removeClass('active').addClass('disabled');
			}).history.bind(function(e) {
				self.button.toggleClass('disabled', !e.data[self.name]);
			});
		}
		
		/**
		 * Call history method
		 * Not return true to avoid history rewrite problem
		 * History call trigger('change') itself
		 */
		this.exec = function() {
			this.rte.history[this.name]();
		}
	}
	
	elRTE.prototype.commands.history.prototype = elRTE.prototype.command;
	
	/**
	 * @class Undo ccommand
	 */
	elRTE.prototype.commands.undo = function(rte) {
		this.name  = 'undo';
		this.title = 'Undo';
		this._init(rte)
	}
	
	/**
	 * @class Redo ccommand
	 */
	elRTE.prototype.commands.redo = function(rte) {
		this.name  = 'redo';
		this.title = 'Redo';
		this._init(rte)
	}
	
	elRTE.prototype.commands.undo.prototype =
	elRTE.prototype.commands.redo.prototype = new elRTE.prototype.commands.history();
	
})(jQuery);