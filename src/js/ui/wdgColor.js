$.fn.elrteWdgColor = function(o, rte) {
	var self = this,
		c    = 'elrte-widget-palette', 
		hc   = 'elrte-ui-hover',
		colors = [
			'#800000', '#8b4513', '#006400', '#2f4f4f', '#000080', '#4b0082', '#800080', '#000000', 
			'#ff0000', '#daa520', '#6b8e23', '#708090', '#0000cd', '#483d8b', '#c71585', '#696969',
			'#ff4500', '#ffa500', '#808000', '#4682b4', '#1e90ff', '#9400d3', '#ff1493', '#a9a9a9',
			'#ff6347', '#ffd700', '#32cd32', '#87ceeb', '#00bfff', '#9370db', '#ff69b4', '#dcdcdc',
			'#ffdab9', '#ffffe0', '#98fb98', '#e0ffff', '#87cefa', '#e6e6fa', '#dda0dd', '#ffffff'
		],
		i, n;
	
	o = $.extend({}, $.fn.elrteWdgColor.defaults, o||{});

	this.autoInd = $('<div class class="'+c+'-item" >1</div>')
	this.btnAuto = $('<div class="'+c+'-button">'+rte.i18n('Automatic')+'</div>').prepend(this.autoInd);

	this.palette = '<div class="'+c+'-small">';
	for (i = 0; i < colors.length; i++) {
		n = colors[i];
		this.palette += '<div name="'+n+'" class="'+c+'-item" style="background-color:'+n+'"/>';
	}
	this.palette = $(this.palette+'</div>');

	this.dialog  = $('<div class="'+c+'-button">'+rte.i18n('More colors')+'</div>')
		.mousedown(function(e) {
			new rte.ui.dialogColor({ value : self.value, callback : function(v) { o.callback(v); } }, rte).open()
		})
		.hover(function() {
			$(this).toggleClass(hc)
		})
	// this.reset   = $('<div class="'+c+'-button">'+rte.i18n('Reset color')+'</div>')
	// 	.mousedown(function() { o.callback(''); })
	// 	.hover(function() { $(this).toggleClass(hc); });
	
	
	
	this.palette.children()
		.hover(function(e) {
			var t = $(this), c = t.attr('name');
		
			e.type == 'mouseenter' 
				? t.css('outline', '2px solid '+(c == '#ffffff' ? '#eee' : c)) 
				: t.css('outline', c == '#ffffff' ? '1px solid #eee' : '');
		})
		.mousedown(function() {
			o.callback($(this).attr('name'));
		});
	
	this.addClass('elrte-ui-widget-menu '+c)
		.html('<div class="elrte-ui-header">'+o.label+'</div>')
		.append(this.btnAuto)
		.append(this.palette)
		.append(this.dialog);
	
		
	this.val = function(v) {
		this.autoInd.css('background-color', v)
	}
	
	return this;
}

$.fn.elrteWdgColor.defaults = {
	label    : '',
	cssClass : 'elrte-ui-widget-menu',
	autoColor : '',
	callback : function() { }
}