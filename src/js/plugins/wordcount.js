(function($) {
	/**
	 * @class elRTE plugin
	 * Count words in active document
	 * @todo fix regexp to count words+new line
	 **/
	elRTE.prototype._plugins.wordcount = function(rte) {
		this.name        = 'wordcount';
		this.description = 'Count words plugin';
		this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.authorURL   = 'http://www.std42.ru';
		this.docURL      = '';
		
		var panel = $('<div style="float:right;"/>').prependTo(rte.view.statusbar);
		
		function count(e) {
			if (e.type == 'focus' 
			|| (e.isDel || (e.originalEvent.keyCode && (e.originalEvent.keyCode == 32 || e.originalEvent.keyCode == 13)))) {
				// rte.time('count')
				var m = ($(rte.active.document.body).text().replace(/[0-9.(){},;:!?%#$¿'"_+=\\\/-]*/g, '').replace(/&nbsp;|&#160;/gi, '')+' ').match(/([^\s])+\s/gm),
					c = m ? m.length : 0;
				// rte.timeEnd('count')
				panel.text(rte.i18n('Words')+': '+c);
			}
		}
		
		rte.bind('blur close source', function() {
			panel.text('');
		}).bind('change focus input', count);
	}
	
})(jQuery);