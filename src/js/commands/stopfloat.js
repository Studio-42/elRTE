(function($) {
	
	/**
	 * @class elRTE command stopfloat
	 * Insert br tag with style="clear:both"
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.stopfloat = function() {
		this.title = 'Stop element floating';
		
		this.bind = function() {
			var self = this;

			this.rte.bind('wysiwyg', function() {
				self._update(self.STATE_ENABLE);
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
			});
		}
		
		this._exec = function() {
			return this.sel.insertNode(this.dom.create({name : 'br', css : { clear : 'both' }}));
		}

	}
	
	// elRTE.prototype.commands.stopfloat.prototype = elRTE.prototype.command;
	
})(jQuery);