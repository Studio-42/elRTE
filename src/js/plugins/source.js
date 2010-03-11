(function($) {
	/**
	 * elRTE plugin
	 * Create tabs to toggle between editor and source
	 *
	 **/
	elRTE.prototype.plugins.source = function(rte) {
		this.name = 'source';
		this.description = 'Create tabs to toggle between editor and source';
		this.author = 'Dio el Claire, dio@std42.ru';
		
		rte.debug('plugin source loaded');
		
		if (rte.options.allowSource) {

			var ed  = $('<li class="elrte-togglebar-tab inline-block active">'+rte.i18n('Editor')+'</li>'),
				src = $('<li class="elrte-togglebar-tab inline-block">'+rte.i18n('Source')+'</li>');
				
			ed.add(src).click(function() {
				if (!$(this).hasClass('active')) {
					rte.toggle();
				}
			});
				
			rte.bind('toggle', function(e) {
				if ($(e.target.editor).is(':visible')) {
					src.removeClass('active');
					ed.addClass('active');
				} else {
					ed.removeClass('active');
					src.addClass('active');
				}
			});
			
			$('<ul class="elrte-togglebar" />')
				.append(ed)
				.append(src)
				.insertAfter(rte.view.workzone);
		}
		
	}
	
})(jQuery);