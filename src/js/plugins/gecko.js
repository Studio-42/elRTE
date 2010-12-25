/**
 * @class elRTE plugin
 * Fix minor gecko bugs with reflow iframe with designMode
 *
 **/
elRTE.prototype.plugins.gecko = function(rte) {
	
	this.info = {
		name      : 'Gecko based browsers fixes',
		author    : 'Dmitry (dio) Levashov, dio@std42.ru',
		authorurl : 'http://www.std42.ru',
		url       : 'http://elrte.org/redmine/projects/elrte/wiki/'
	}
	
	if ($.browser.mozilla) {
		rte.bind('source', function(e) {
			rte.active.source[0].setSelectionRange(0, 0);
		}, true)
		.bind('show fullscreenon fullscreenoff', function(e) {
			if (rte.active) {
				// rte.wysiwyg() ? rte.fixMozillaCarret() : rte.active.source[0].setSelectionRange(0, 0);
				if (rte.wysiwyg()) {
					rte.active.editor.add(rte.active.source).toggle();
					rte.active.source.focus();
					rte.active.editor.add(rte.active.source).toggle();
					rte.focus();
				} else {
					rte.active.source[0].setSelectionRange(0, 0);
					rte.active.source[0].scrollTop = 0;
				}
			}
		}, true);
	}
}
