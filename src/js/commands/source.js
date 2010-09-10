(function($) {
	
	/**
	 * @class elRTE command.
	 * Toggle view between editor and source if allowed.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.source = function() {

		this.title = 'Toggle view between editor and source';
		
		this.bind = function() {
			var self = this;
			
			if (this.rte.options.allowSource) {
				this.rte.bind('wysiwyg', function() {
					self._update(self.STATE_ENABLE);
				}).bind('source', function(e) {
					self._update(self.STATE_ACTIVE);
				}).bind('close', function(e) {
					e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
				});
			}
		}
		
		this._exec = function() {
			this.rte.toggle();
		}
	}
	
})(jQuery);