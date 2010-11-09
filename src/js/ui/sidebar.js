
$.each(['show', 'hide'], function(i, name) {

	$.fn[name] = (function(om, cm) { 
			return function(d, e, c) {
				return this.each(function() {
					var $this = $(this);
					$this.hasClass('elrte-sidebar') && $this.parent()[cm]($this.data('parentClass'));
					om.call($this, d, e, c)
				})
			} 
		})($.fn[name], name === 'show' ? 'addClass' : 'removeClass');
})

/**
 * jQuery plugin
 * elRTE sidebar
 *
 * @param elRTE  editor instance
 */

$.fn.elrtesidebar = function(rte) {
	var c = 'elrte-sidebar',
		pos = rte.options.sidebarPos == 'right' ? '-right' : '-left', 
		pc = 'elrte-show-sidebar'+pos;

	
	return this.each(function() {
		var $this = $(this);
			
		
		$this.hide().addClass('ui-widget ui-widget-content ui-corner-all '+c+' '+c+pos).text('sidebar')
			.data('parentClass', pc)
		
		// rte.bind('load', function() {
		// 	// rte.log($this.parent())
		// 	$this.parent().addClass(pc)
		// })
		
	})
	
}