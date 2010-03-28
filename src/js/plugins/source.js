(function($) {
	/**
	 * @class elRTE plugin
	 * Create tabs to toggle between editor and source in active document
	 *
	 **/
	elRTE.prototype.plugins.source = function(rte) {
		this.name        = 'source';
		this.description = 'Create tabs to toggle between editor and source';
		this.author      = 'Dmitry Levashov, dio@std42.ru';
		
		if (rte.options.allowSource) {

			var ed  = $('<li class="elrte-tab inline-block active">'+rte.i18n('Editor')+'</li>'),
				src = $('<li class="elrte-tab inline-block">'+rte.i18n('Source')+'</li>'),
				bar = $('<ul class="elrte-togglebar" />')
					.hide()
					.insertAfter(rte.view.workzone)
					.append(ed)
					.append(src);
			
			ed.add(src).mousedown(function(e) {
				e.stopPropagation();
				e.preventDefault();
				$(this).hasClass('active') ? rte.focus() : rte.toggle();
			});
				
			rte.bind('open', function() {
				bar.show();
			}).bind('close', function() {
				rte.documents.length == 1 && bar.hide();
			}).bind('focus source', function(e) {
				src.toggleClass('active', e.type == 'source');
				ed.toggleClass('active',  e.type == 'focus');
			});
			
		}
	}
	
})(jQuery);