(function($) {
	/**
	 * @class elRTE plugin
	 * Count words in active document
	 * @todo fix regexp to count words+new line
	 **/
	elRTE.prototype.plugins.wordcount = function(rte) {
		this.name        = 'wordcount';
		this.description = 'Count words plugin';
		this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.authorURL   = 'http://www.std42.ru';
		this.docURL      = '';
		
		var panel = $('<div style="float:right;"/>').prependTo(rte.view.statusbar.show());
		
		function count(e) {
			txt = $(rte.active.document.body).text().replace(/[0-9\.(){},;:!?%#$¿'"_+=\\\/\-]*/g, '').replace(/&nbsp;|&#160;/gi, '').split(/\s+/)
			panel.text(rte.i18n('Words')+': '+txt.length);
		}
		
		rte.bind('close source', function() {
			panel.text('');
		}).bind('change wysiwyg', count);
	}
	
})(jQuery);