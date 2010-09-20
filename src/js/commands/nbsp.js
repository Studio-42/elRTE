(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert non breakable space into selection
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.nbsp = function() {
		this.title = 'Non breakable space';
		
		// this.bind = function() {
		// 	var self = this;
		// 
		// 	this.rte.bind('wysiwyg', function() {
		// 		self._update(self.STATE_ENABLE);
		// 	}).bind('source close', function(e) {
		// 		e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
		// 	});
		// }
		// this._listeners = [];
		
		
		this._exec = function() {
			return this.sel.insertHtml('&nbsp;');
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}

	}
	
})(jQuery);