(function($) {
	
	/**
	 * @class elRTE command stopfloat
	 * Insert br tag with style="clear:both"
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.stopfloat = function() {
		this.title = 'Stop element floating';
		
		this._exec = function() {
			return this.sel.insertNode(this.dom.create({name : 'br', css : { clear : 'both' }}));
		}
		
		this.events = {
			'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
			'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}
	}

})(jQuery);