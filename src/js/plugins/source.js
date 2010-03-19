(function($) {
	/**
	 * elRTE plugin
	 * Create tabs to toggle between editor and source
	 *
	 **/
	elRTE.prototype.plugins.source = function(rte) {
		this.name        = 'source';
		this.description = 'Create tabs to toggle between editor and source';
		this.author      = 'Dmitry Levashov, dio@std42.ru';
		
		rte.debug('plugin source loaded');
		
		if (rte.options.allowSource) {

			var ed  = $('<li class="elrte-tab inline-block active">'+rte.i18n('Editor')+'</li>'),
				src = $('<li class="elrte-tab inline-block">'+rte.i18n('Source')+'</li>');
			
			ed.add(src).mousedown(function(e) {
				e.stopPropagation();
				e.preventDefault();
				$(this).hasClass('active') ? rte.focus() : rte.toggle();
			}).appendTo($('<ul class="elrte-togglebar" />').insertAfter(rte.view.workzone));
				
			rte.bind('toggle', function(e) {
				if ($(e.target.editor).is(':visible')) {
					src.removeClass('active');
					ed.addClass('active');
				} else {
					ed.removeClass('active');
					src.addClass('active');
				}
			});
			
		}
		
	}
	
})(jQuery);