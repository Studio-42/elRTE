/**
 * jQuery plugin
 * Return total width for all elements in set
 * @usage
 * var w = $('selector').sumWidth() - return sum of .width()
 * var w = $('selector').sumWidth({ type : 'inner' }) - return sum of .innerWidth()
 * var w = $('selector').sumWidth({ type : 'outer' }) - return sum of .outerWidth()
 * var w = $('selector').sumWidth({ type : 'outer', margins : true }) - return sum of .outerWidth(true) - include margins
 * @param  Object  plugin options
 * @return Number
 */
$.fn.sumWidth = function(o) {
	var w = 0, c;
	
	o = $.extend({ type : '', margins : false }, o||{});
	
	if (o.type == 'outer') {
		o.margins = !!o.margins;
		c = 'outerWidth';
	} else {
		o.margins = void(0);
		c = o.type == 'inner' ? 'innerWidth' : 'width';
	}

	this.each(function() {
		w += $(this)[c](o.margins);
	});

	return parseInt(w);
}

$.fn.sumOuterHeight = function(m) {
	var h = 0;
	
	this.each(function() {
		h += $(this).outerHeight(m);
	});
	
	return Math.ceil(h)
}

/**
 * jQuery plugin
 * Return maximum width for all elements in set
 *
 * @return Number
 */
$.fn.maxWidth = function() {
	var w = 0;
	
	this.each(function() {
		w = Math.max(w, $(this).width());
	});
	return Math.ceil(w);
}

/**
 * jQuery plugin
 * Return maximum height for all elements in set
 *
 * @return Number
 */
$.fn.maxHeight = function(m) {
	var h = 0;
	
	this.each(function() {
		h = Math.max(h, $(this).height());
	});
	return Math.round(h);
}

$.fn.maxZIndex = function() {
	var i = 0;
	
	this.each(function() {
		var z = $(this).css('z-index');
		if (z > 0 && z > i) {
			i = parseInt(z);
		}
	});
	return i;
}

$.fn.elrtetable = function(o) {
	
	o = $.extend({ cellspacing : 0 }, o);
	
	function cell(v, a, h) {
		var c;

		if (v.nodeName == 'TD' || v.nodeName == 'TH' || (''+v).indexOf('<td') == 0 || (''+v).indexOf('<th') == 0) {
			c = $(v);
		} else if (v[0] && (v[0].nodeName == 'TD' || v[0].nodeName == 'TH')) {
			c = v;
		}  else {
			c = $('<t'+(h ? 'h' : 'd')+'/>').append(v);
		}
		return c.attr(a||{});
	}
	
	function table(n) {
		return n && n[0] && n[0].nodeName == 'TABLE' ? $(n[0]) : false;
	}
	
	this.cell = function(v, a, h) {
		var tb, r;
		
		if ((tb = table(this))) {
			if (!(r = tb.find('tr:last')).length) {
				r = $('<tr/>').appendTo(tb);
			}
			r.append(cell(v, a, h))
		}
		return this;
	}
	
	this.row = function(v, attr) {
		var tb, r;
		
		if ((tb = table(this))) {
			r = $('<tr/>').attr(attr||{});
			$.each(v||[], function(i, n) {
				r.append(cell(n));
			});
			r.appendTo(tb);
		}
		return this
	}
	
	return this.each(function() {
		if (this.nodeName == 'TABLE') {
			$(this).attr(o||{}).css('border-collapse', 'collapse');
		}
	})
	
}
