(function($) {
	
	/**
	 * @class elRTE command stopfloat
	 * Insert br tag with style="clear:both"
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.source = function(n) {
		var self   = this;
		this.name  = n;
		this.title = 'Toggle view between editor and source';
		
		this.bind = function() {
			var self = this;

			this.rte.bind('wysiwyg', function() {
				self._setState(self.STATE_ENABLE);
			}).bind('source', function(e) {
				self._setState(self.STATE_ACTIVE);
			}).bind('close', function(e) {
				e.data.id == self.rte.active.id && self._setState(self.STATE_DISABLE);
			});
		}
		
		this._exec = function() {
			this.rte.toggle();
		}
		
	}
	
})(jQuery);