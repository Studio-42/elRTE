/**
 * jQuery plugin
 * elRTE sidebar
 *
 * @param elRTE  editor instance
 */
$.fn.elrtesidebar = function(rte) {
	var c = 'elrte-sidebar',
		pos = rte.options.sidebarPos == 'right' ? '-right' : '-left', 
		mc = 'elrte-main-sidebar'+pos;


	this.show = function() {
		$(this).show().next().addClass(mc);
	}
	
	this.hide = function() {
		$(this).hide().next().removeClass(mc);
	}
	
	return this.each(function() {
		$(this).hide().addClass('ui-widget ui-widget-content ui-corner-all '+c+' '+c+pos).text('sidebar');
	});
	
}