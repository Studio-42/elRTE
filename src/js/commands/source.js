(function($) {
	
	/**
	 * @class elRTE command.
	 * Toggle view between editor and source if allowed.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.source = function() {

		this.title = 'Toggle view between editor and source';
		
		this._exec = function() {
			this.rte.toggle();
		}
		
		this.events = {
			'wysiwyg' : function() { this._setState(this.STATE_ENABLE); },
			'source'  : function() { this._setState(this.STATE_ACTIVE); },
			'close'   : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}
	}
	
})(jQuery);