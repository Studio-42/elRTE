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
	return Math.round(w);
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