(function($) {

	/**
	 * @class elRTE command.
	 * Insert pagebreak placeholder
	 * @TODO replace/restore placeholder in filter
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.pagebreak = function() {
		var self = this;
		this.title = 'Page break';
		this._class = 'elrte-pagebreak'
		
		this.rte.bind('mousedown', function(e) {
			if ($(e.target).hasClass(self._class)) {
				e.preventDefault();
			}
		})
		
		this._exec = function() {
			this.sel.insertHtml('<img src="'+this.rte.filter.url+'pixel.gif" class="elrte-protected '+this._class+'" />');
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	
})(jQuery);