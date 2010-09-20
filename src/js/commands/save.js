(function($) {
	
	/**
	 * @class elRTE command stopfloat
	 * Insert br tag with style="clear:both"
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.save = function() {
		this.title = 'Save';
		
		this._exec = function() {
			this.rte.save();
		}
		
		this.events = {
			'wysiwyg' : function() { this._setState(this.STATE_ENABLE); },
			'close' : function() { this.rte.count() == 1 && this._setState(this.STATE_DISABLE); }
		}
	}
	
})(jQuery);