(function($) {
	/**
	 * @class elRTE plugin
	 * Add support for Shift+Enter for Safari/Chrome
	 *
	 **/
	elRTE.prototype.plugins.webkit = function(rte) {
		this.name        = 'webkit';
		this.description = 'Add support for Shift+Enter for Safari/Chrome';
		this.author      = 'Dmitry Levashov, dio@std42.ru';
		
		
		
		if ($.browser.webkit) {
			rte.bind('keydown', function(e) {
				if (e.keyCode == 13 && e.shiftKey) {
					rte.log('webkit')
					e.preventDefault();
					rte.selection.insertHtml('<br>');
				}
			});
		}
		
	}
	
})(jQuery);