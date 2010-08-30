(function($) {
	/**
	 * @class elRTE plugin
	 * Show path to selected node in status bar 
	 * and highlight node on hover it's path
	 *
	 **/
	elRTE.prototype.plugins.path = function(rte) {
		var self = this;
		this.name        = 'path';
		this.description = 'Show path to selected node in status bar';
		this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.authorURL   = 'http://www.std42.ru';
		this.docURL      = '';
		this.panel       = $('<div class="elrte-statusbar-path"/>').appendTo(rte.view.statusbar);
		// this.cssClass    = 'elrte-highlight';  
		
		
		this.clean = function() {
			this.panel.children().trigger('mouseleave').end().text('');
		}
		
		rte.bind('load', function() {
			rte.view.statusbar.show();
		}).bind('source', function() {

			setTimeout( function() {self.clean();}, 1)
		}).bind('close', function(e) {
			e.data.id == rte.active.id && self.clean();
		}).bind('wysiwyg change changePos', function(e) {

			setTimeout(function() {
				var n = rte.selection.node(),
					p = [], 
					l;

				n.nodeType == 1 && !/^BODY$/.test(n.nodeName) && p.push(n);
				p = p.concat(rte.dom.parents(rte.selection.node()));
				l = p.length;
				self.clean();
				while (l--) {
					self.panel.append(
						$('<span>'+p[l].nodeName.toLowerCase()+(l>0 ? ' &raquo; ' : '')+'</span>')
							.hover($.proxy( function(e) { $(this).toggleClass('elrte-highlight', e.type=='mouseenter') }, p[l] ))
							// .hover((function(n) { return function(e) { $(n).toggleClass(self.cssClass, e.type=='mouseenter') } })(n[l]))
					);
				}
			}, 1);
		});
	}
	
})(jQuery);