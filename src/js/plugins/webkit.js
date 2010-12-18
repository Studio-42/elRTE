/**
 * @class elRTE plugin
 * Add support for Shift+Enter for Safari/Chrome
 *
 **/
elRTE.prototype.plugins.webkit = function(rte) {
	this.name        = 'webkit';
	this.description = 'Add support for Shift+Enter and image selection for Safari/Chrome';
	this.author      = 'Dmitry Levashov, dio@std42.ru';
	
	if ($.browser.webkit) {
		rte.bind('keydown', function(e) {
			if (e.keyCode == 13 && e.shiftKey) {
				e.preventDefault();
				// rte.selection.insertHtml('<br>');
				rte.selection.insertNode(rte.dom.create('br'))
			}
		}, true)
		.bind('click', function(e) {
			var n = e.target;
			if (n.nodeName == 'IMG' || n.nodeName == 'HR') {
				rte.selection.select(e.target)
			}
		});
	}
	
}
