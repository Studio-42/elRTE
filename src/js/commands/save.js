(function($) {
	
	/**
	 * @class elRTE command stopfloat
	 * Insert br tag with style="clear:both"
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.save = function() {

		this.title = 'Save';
		
		this.bind = function() {
			var self = this;

			this.rte.bind('wysiwyg source', function() {
				self._update(self.STATE_ENABLE);
			}).bind('close', function(e) {
				e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
			});
		}
		
		this._exec = function() {
			this.rte.save();
		}
		
	}
	
})(jQuery);