(function($) {
	/**
	 * @class elRTE plugin
	 * Add support for Shift+Enter for Safari/Chrome
	 *
	 **/
	elRTE.prototype._plugins.webkit = function(rte) {
		
		if ($.browser.webkit) {

			rte.bind('keydown', function(e) {
				

				if (e.keyCode == 13) {
					var n = rte.selection.getNode();
					if (n.nodeName == 'BODY' 
					|| rte.dom.parent(n, /^DIV$/, null, true) 
					|| (rte.dom.parent(n, /^P$/,  null, true) && e.shiftKey)) {
						e.preventDefault();
						rte.selection.select( rte.selection.insertNode(rte.dom.create('br')) ).collapse(false);
					}
				}
			});
		}
	}
	
})(jQuery);