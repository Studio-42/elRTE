(function($) {
	/**
	 * @class elRTE plugin
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
			
			$('<ul class="elrte-togglebar" />')
				.insertAfter(rte.view.workzone)
				.append(ed)
				.append(src)
			
			ed.add(src).mousedown(function(e) {
				e.stopPropagation();
				e.preventDefault();
				$(this).hasClass('active') ? rte.focus() : rte.toggle();
			})//.appendTo($('<ul class="elrte-togglebar" />').insertAfter(rte.view.workzone));
				
			rte.bind('toggle', function(e) {
				var v = $(e.target.editor).is(':visible');
				src.toggleClass('active', !v);
				ed.toggleClass('active', v);
			});
			
		}
		
	}
	
})(jQuery);