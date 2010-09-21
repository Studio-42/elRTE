$.fn.elrtemenu = function(o) {
	o = $.extend({}, $.fn.elrtemenu.defaults, o||{});
	var self = this,
		ac   = 'elrte-ui-active',
		mc   = o.cssClass,
		ic   = o.cssClass+'-item',
		s    = o.label ? '<div class="'+mc+'-header">'+o.label+'</div>' : '';
	
	$.each(o.opts, function(v, l) {
		s += '<div class="'+ic+'" name="'+v+'">'+o.tpl.replace(/\{value\}/, v).replace(/\{label\}/, l)+'</div>';
	});
	
	this.items = this.addClass(mc)
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.append(s)
		.find('.'+ic)
		.hover(function() {
			$(this).toggleClass('elrte-ui-hover');
		})
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			self.hide();
			o.callback($(this).attr('name'));
		});
	
	this.val = function(v) {
		this.items.removeClass(ac).filter('[name="'+v+'"]').addClass(ac);
	}

	return this;
}


$.fn.elrtemenu.defaults = {
	label    : '',
	cssClass : 'elrte-ui-widget-menu',
	tpl      : '{label}',
	opts     : {},
	callback : function() { }
}