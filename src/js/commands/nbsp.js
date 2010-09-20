(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert non breakable space into selection
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.nbsp = function() {
		this.title = 'Non breakable space';
		
		this._exec = function() {
			return this.sel.insertHtml('&nbsp;');
		}
		
		this.events = {
			'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
			'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}

	}
	
})(jQuery);