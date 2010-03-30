(function($) {
	/**
	 * @class elRTE plugin
	 * Show path to selected node in status bar 
	 * and highlight node on hever path to it
	 **/
	elRTE.prototype.plugins.statusbar = function(rte) {
		this.name        = 'statusbar';
		this.description = 'Show path to selected node in status bar';
		this.author      = 'Dmitry Levashov, dio@std42.ru';
		var cssClass     = 'elrte-highlight';
		var panel        = $('<div style="float:left"/>').appendTo(rte.view.statusbar);
		
		function clean() {
			panel.children().trigger('mouseleave').end().text('');
		}
		
		rte.bind('load', function() {
			rte.view.statusbar.show();
		}).bind('close source blur', function() {
			clean();
		}).bind('update change', function(e) {
			var n = rte.dom.parents(rte.selection.getNode(), 'all', null, true),
				l = n.length;

			clean();

			while (l--) {
				panel.append(
					$('<span>'+n[l].nodeName.toLowerCase()+'</span>').hover( (function(n) { return function(e) { $(n).toggleClass(cssClass, e.type=='mouseenter') } })(n[l]) )
					).append(l>0 ? ' &raquo; ' : '');
			}
		});
	}
	
})(jQuery);