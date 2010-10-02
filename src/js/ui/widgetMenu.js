/**
 * jQuery plugin
 * Drop-down menu widget
 *
 * @param  Object
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
$.fn.elrteWidgetMenu = function(o) {
	o = $.extend({}, $.fn.elrteWidgetMenu.defaults, o||{});
	
	var self = this,
		ac   = 'elrte-active',
		c    = 'elrte-widget-menu',
		ic   = c+'-item',
		s    = '<div class="elrte-widget-header">'+o.label+'</div><div class="'+c+'-inner">';
	
	$.each(o.opts, function(v, l) {
		s += '<div class="'+ic+'" name="'+v+'">'+o.tpl.replace(/\{value\}/g, v).replace(/\{label\}/g, l)+'</div>';
	});
	
	this.items = this.addClass(c+' '+o['class'])
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.append(s+'</div>')
		.find('.'+ic)
		.hover(function() {
			$(this).toggleClass('elrte-hover');
		})
		.mousedown(function(e) {
			self.hide();
			o.callback($(this).attr('name'));
		});
		
	this.val = function(v) {
		this.items.removeClass(ac).filter('[name="'+v+'"]').addClass(ac);
	}

	return this;	
}

$.fn.elrteWidgetMenu.defaults = {
	label    : '',
	'class'  : '',
	tpl      : '{label}',
	opts     : {},
	callback : function() { }
}
