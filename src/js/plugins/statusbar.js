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
		
		rte.view.statusbar.show();
		
		rte.bind('focus change toggle', function(e) {
			$(e.target.document.body).find('.'+this.cssClass).removeClass(this.cssClass);
			rte.view.statusbar.empty();
			if (rte.wysiwyg) {
				var n = rte.dom.parents(rte.selection.getNode(), 'all', null, true),
					l = n.length;
				
				while (l--) {
					var link = $('<span>'+n[l].nodeName.toLowerCase()+'</span>')
						.hover( (function(n) { return function(e) { $(n).toggleClass(cssClass, e.type=='mouseenter') } })(n[l]) );
					rte.view.statusbar.append(link).append(l>0 ? ' &raquo; ' : '');
				}
			}
		}).bind('save close', function(e) {
			$(e.target.document.body).find('.'+cssClass).removeClass(cssClass);
		});
		
	}
	
})(jQuery);