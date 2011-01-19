/**
 * jQuery plugin
 * Easy way to create table
 *
 * @return jQuery
 */
$.fn.elrtetable = function(o) {
	
	o = $.extend({ cellspacing : 0 }, o);
	
	function cell(v, a, h) {
		var c, l;

		if (v.nodeName == 'TD' || v.nodeName == 'TH' || (''+v).indexOf('<td') == 0 || (''+v).indexOf('<th') == 0) {
			c = $(v);
		} else if (v[0] && (v[0].nodeName == 'TD' || v[0].nodeName == 'TH')) {
			c = v;
		}  else {
			c = $('<t'+(h ? 'h' : 'd')+'/>');
			if ($.isArray(v)) {
				l = v.length;
				while (l--) {
					c.prepend(v[l]);
				}
			} else {
				c.append(v);
			}
		}
		a && c.attr(a);
		return c;
	}
	
	function table(n) {
		return n && n[0] && n[0].nodeName == 'TABLE' ? $(n[0]) : false;
	}
	
	/**
	 * Create new cell in last row.
	 * If there is no rows - new one created
	 *
	 * @param String|Array|DOMElement|jQuery cell content
	 * @param Object  cell attributes
	 * @param Boolean  true - to create th
	 * @return jQuery
	 */
	this.cell = function(v, a, h) {
		var tb = table(this), r;
		
		if (tb) {
			if (!(r = tb.find('tr:last')).length) {
				r = $('<tr/>').appendTo(tb);
			}
			r.append(cell(v, a, h))
		}
		return this;
	}
	
	/**
	 * Create new row.
	 *
	 * @param Array    content for cells in row
	 * @param Object   cell attributes
	 * @param Boolean  true - to create th
	 * @param Object   row attributes
	 * @return jQuery
	 */
	this.row = function(v, ca, h, ra) {
		var tb = table(this), r = $('<tr/>'), v = $.isArray(v) ? v : [v];
		
		if (tb) {
			ra && r.attr(ra);
			$.each(v, function(i, n) {
				r.append(cell(n, ca, h));
			});
			tb.append(r);
		}
		return this;
	}
	
	return this.each(function() {
		if (this.nodeName == 'TABLE') {
			$(this).attr(o||{}).addClass('elrte-dialog-table').css('border-collapse', 'collapse');
		}
	});
	
}
