(function($) {
	/**
	 * @class elRTE plugin
	 * Show path to selected node in status bar 
	 * and highlight node on hover it's path
	 *
	 **/
	elRTE.prototype._plugins.path = function(rte) {
		this.name        = 'path';
		this.description = 'Show path to selected node in status bar';
		this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.authorURL   = 'http://www.std42.ru';
		this.docURL      = '';
		this.panel       = $('<div class="elrte-statusbar-path"/>').appendTo(rte.view.statusbar);
		this.cssClass    = rte.options.highlightClass || 'elrte-highlight';
		
		var self = this;
		
		this.clean = function() {
			this.panel.children().trigger('mouseleave').end().text('');
		}
		
		rte.bind('load', function() {
			rte.view.statusbar.show();
		}).bind('blur close source', function() {
			self.clean();
		}).bind('change focus', function() {
			
			setTimeout(function() {
				var n = rte.dom.parents(rte.selection.getNode(), 'all', null, true),
					l = n.length;
				
				self.clean();

				while (l--) {
					self.panel.append(
						$('<span>'+n[l].nodeName.toLowerCase()+(l>0 ? ' &raquo; ' : '')+'</span>')
							.hover((function(n) { return function(e) { $(n).toggleClass(self.cssClass, e.type=='mouseenter') } })(n[l]))
					);
				}
			}, 0);
		});
	}
	
})(jQuery);