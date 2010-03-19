(function($) {
	/**
	 * @class elRTE plugin
	 * 
	 *
	 **/
	elRTE.prototype.plugins.statusbar = function(rte) {
		this.name        = 'statusbar';
		this.description = 'Create tabs to toggle between editor and source';
		this.author      = 'Dmitry Levashov, dio@std42.ru';
		
		rte.debug('plugin statusbar loaded');
		
		rte.view.statusbar.show();
		
		rte.bind('update', function() {
			if (rte.wysiwyg) {
				var n = rte.selection.getNode();
				var nodes = rte.dom.parents(n, 'all', null, true)
				rte.log(nodes)
			}
		})
		
	}
	
})(jQuery);