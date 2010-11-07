/**
 * jQuery plugin
 * Color palette drop-down menu
 *
 * @param  Object  options
 * @param  elRTE   current editor
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
$.fn.elrteWidgetColor = function(o, rte) {
	
	o = $.extend({}, $.fn.elrteWidgetColor.defaults, o||{});
	
	
	var self   = this,
		c      = 'elrte-widget-color',
		color  = '',
		colors = [
			'#800000', '#8b4513', '#006400', '#2f4f4f', '#000080', '#4b0082', '#800080', '#000000', 
			'#ff0000', '#daa520', '#6b8e23', '#708090', '#0000cd', '#483d8b', '#c71585', '#696969',
			'#ff4500', '#ffa500', '#808000', '#4682b4', '#1e90ff', '#9400d3', '#ff1493', '#a9a9a9',
			'#ff6347', '#ffd700', '#32cd32', '#87ceeb', '#00bfff', '#9370db', '#ff69b4', '#dcdcdc',
			'#ffdab9', '#ffffe0', '#98fb98', '#e0ffff', '#87cefa', '#e6e6fa', '#dda0dd', '#ffffff'
		],
		inner = $('<div class="elrte-widget-menu-inner"/>'),
		ind   = $('<div class="'+c+'-ind"/>'),
		auto  = $('<div class="'+c+'-button">'+rte.i18n('Automatic')+'</div>')
			.prepend(ind)
			.mousedown(function() {
				o.callback(ind.attr('name'));
			}),
		dialog  = $('<div class="'+c+'-button">'+rte.i18n('More colors')+'</div>')
			.mousedown(function(e) {
				$('<div/>').elrtedialogcolor({ 
					callback : function(c) { o.callback(c); }, 
					color    : color 
				}, rte).open()
			}),
		palette = '<div class="'+c+'-palette">';
		
	for (i = 0; i < colors.length; i++) {
		n = colors[i];
		palette += '<div name="'+n+'" class="'+c+'-item" style="background-color:'+n+'"/>';
	}
	palette = $(palette+'</div>');

	palette.children()
		.hover(function(e) {
			var t = $(this), 
				c = t.attr('name');
	
			e.type == 'mouseenter' 
				? t.css('outline', '2px solid '+(c == '#ffffff' ? '#eee' : c)) 
				: t.css('outline', c == '#ffffff' ? '1px solid #eee' : '');
		})
		.mousedown(function(e) {
			self.hide();
			o.callback($(this).attr('name'));
		});

	auto.add(dialog).hover(function() {
		$(this).toggleClass('elrte-hover');
	});

	if (!o.allowAuto) {
		auto.hide();
	}

	this.addClass('elrte-widget-menu '+c)
		.html('<div class="elrte-widget-header">'+o.label+'</div>')
		.append(inner.append(auto).append(palette).append(dialog));

	
		
	this.val = function(c, a) {
		color = c;
		ind.css('background-color', a).attr('name', a);
	}
		
	return this;
}

$.fn.elrteWidgetColor.defaults = {
	label     : '',
	allowAuto : true,
	callback  : function() { }
}

