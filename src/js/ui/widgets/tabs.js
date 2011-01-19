/**
 * jQuery plugin
 * Simple tabs for dialogs
 *
 * @return jQuery
 */
$.fn.elrtetabs = function(o) {
	
	/**
	 * Set first tab active
	 *
	 * @return jQuery
	 */
	this.reset = function() {
		return this.each(function() {
			$(this).children('ul:first').children(':first').children().click();
		});
	}
	
	return this.each(function() {
		var $this = $(this).addClass('ui-tabs ui-widget ui-widget-content ui-corner-all'),
			nav   = $this.children('ul:first').addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all'),
			tabs  = nav.children().addClass('ui-state-default ui-corner-top'),
			cont  = nav.nextAll('[id]').addClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');
			
		tabs.children()
			.click(function(e) {
				var t = $(this),
					a = 'ui-tabs-selected ui-state-active',
					h = 'ui-tabs-hide';
				
				e.preventDefault();
			
				tabs.removeClass(a);
				t.parent().addClass(a);
				cont.addClass(h).filter(t.attr('href')).removeClass(h);
				typeof(o.click) == 'function' && o.click(e);
			})
			.eq(0)
			.click();
	});
	
}
