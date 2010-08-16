(function($) {
	/**
	 * @class elRTE plugin
	 * Count words/symbols in active document
	 **/
	elRTE.prototype.plugins.wordcount = function(rte) {
		var self = this;
		this.name        = 'wordcount';
		this.description = 'Count words plugin';
		this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.authorURL   = 'http://www.std42.ru';
		this.docURL      = '';
		this.count       = rte.pluginConf(this.name, 'count');
		this.panel       = $('<div class="elrte-statusbar-wordcount"/>').prependTo(rte.view.statusbar.show());
		
		rte.bind('close', function(e) {
			e.data.id == rte.active.id && self.panel.text('');
		}).bind('source', function() {
			self.panel.text('');
		}).bind('wysiwyg change input', function(e) {
			var text = rte.active.get().replace(/<\/?(p|div|br)[^>]*>/gi, ' ').replace(/<\/?\w+[^>]*>/gi, '').replace(/&nbsp;|&#160;/gi, ' '),
				str;

			function words() {
				var t = $.trim(text).replace(/[\.(){},;:!?%#$¿'"_+=\\\/\-]*/g, '');
				return t.length ? t.split(/\s+/).length : 0;
			}
			
			function chars() {
				return $.trim(text).replace(/\r|\n|\t|\s/gi, '').length;
			}
			
			switch (self.count) {
				case 'chars':
					str = rte.i18n('Symbols')+': '+chars();
					break;
				
				case 'words':
					str = rte.i18n('Words')+': '+words();
					break;
					
				default:
					str = rte.i18n('Words')+'/'+rte.i18n('Symbols')+': '+words()+'/'+chars();
			}
			self.panel.text(str);
		});
		
	}
	
})(jQuery);