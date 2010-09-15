(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert horizontal rule.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.hr = function() {
		this.title = 'Horizontal rule';
		
		this.bind = function() {
			var self = this;
		
			this.rte.bind('wysiwyg', function() {
				self._update(self.STATE_ENABLE);
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
			});
		}
		
		this._exec = function() {
			return this.sel.deleteContents().insertNode(this.dom.create('hr'));
		}
	}
	
})(jQuery);