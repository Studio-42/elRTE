(function($) {
	/**
	 * @class elRTE plugin
	 * Create tabs to toggle active document between wysiwyg/source modes
	 * @param elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype._plugins.source = function(rte) {
		this.name        = 'source';
		this.description = 'Create tabs to toggle between editor and source';
		this.author      = 'Dmitry Levashov, dio@std42.ru';
		
		if (rte.options.allowSource) {

			var te = $('<li class="elrte-toggle-tab elrte-ib elrte-tab-active">'+rte.i18n('Editor')+'</li>'),
				ts = $('<li class="elrte-toggle-tab elrte-ib">'+rte.i18n('Source')+'</li>'),
				tb = $('<ul class="elrte-src-tabsbar"/>').hide().insertAfter(rte.view.workzone).append(te).append(ts);
			
			te.add(ts).mousedown(function(e) {
				e.stopPropagation();
				e.preventDefault();
				$(this).hasClass('elrte-tab-active') ? rte.focus() : rte.toggle();
			});
				
			rte.bind('open', function() {
				tb.show();
			}).bind('close', function() {
				rte.count() == 1 && tb.hide();
			}).bind('wysiwyg  source', function(e) {
				ts.toggleClass('elrte-tab-active', e.type == 'source');
				te.toggleClass('elrte-tab-active', e.type == 'wysiwyg');
			});
		}
	}
	
})(jQuery);