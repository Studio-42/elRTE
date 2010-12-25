/**
 * @class elRTE plugin
 * Count words/symbols in active document
 **/
elRTE.prototype.plugins.wordcount = function(rte) {
	
	var panel      = $('<div class="elrte-pl-wordcount"/>'),
		type       = rte.pluginConf('wordcount', 'count'),
		charsLabel = rte.i18n('Symbols'),
		wordsLabel = rte.i18n('Words');
	
	rte.bind('load', function() {
		rte.statusbar.append(panel, 'right')
	})
	.bind('source close', function(e) {
		e.data.id == rte.active.id && panel.text('');
	})
	.bind('wysiwyg change', function(e) {
		update();
	})
	.bind('keyup', function() {
		rte.typing && update();
	});
	
	
	function words(text) {
		var t = $.trim(text).replace(/[\.(){},;:!?%#$¿'"_+=\\\/\-]*/g, '');
		return t.length ? t.split(/\s+/).length : 0;
	}
	
	function chars(text) {
		return $.trim(text).replace(/\r|\n|\t|\s/gi, '').length;
	}
	
	function update() {
		var text = rte.active.raw().replace(/<\/?(p|div|br)[^>]*>/gi, ' ').replace(/<\/?\w+[^>]*>/gi, '').replace(/&nbsp;|&#160;/gi, ' ');
		
		switch (type) {
			case 'chars':
				text = charsLabel+': '+chars(text);
				break;
				
			case 'words':
				text = wordsLabel+': '+words(text);
				break;
				
			default:
				text = charsLabel+': '+chars(text)+' / '+wordsLabel+': '+words(text);
		}
		panel.text(text)
	}
	
	this.info = {
		name      : 'Count words/symbols',
		author    : 'Dmitry (dio) Levashov, dio@std42.ru',
		authorurl : 'http://www.std42.ru',
		url       : 'http://elrte.org/redmine/projects/elrte/wiki/'
	}
	
}
