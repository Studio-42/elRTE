/**
 * @class elRTE plugin
 * Fix minor gecko bugs with reflow iframe with designMode
 *
 **/
elRTE.prototype.plugins.mozilla = function(rte) {
	this.name        = 'mozilla';
	this.description = 'Fix minor gecko bugs with reflow iframe with designMode';
	this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
	
	if ($.browser.mozilla) {
		rte.bind('source', function(e) {
			rte.active.source[0].setSelectionRange(0, 0);
		}, true)
		.bind('show', function() {
			if (rte.active) {
				rte.wysiwyg() ? rte.fixMozillaCarret() : rte.active.source[0].setSelectionRange(0, 0);
			}
		}, true);
	}
}
