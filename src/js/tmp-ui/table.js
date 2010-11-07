/**
 * @class Fast create table and add data to table cells
 * 
 * @param  Object  table attributes
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.table = function(attr) {
	this.table = $('<table/>').attr(attr||{});
	this.row   = false;
	
	/**
	 * Create new cell [and row] and add content to it
	 * 
	 * @param  String|Array  cell[s] html
	 * @param  Boolean       create new row
	 * @param  Object        cell[s] attributes
	 * @return void
	 **/
	this.append = function(el, newRow, attr) {
		var l, _td;
		
		function td(o) {
			_td = $('<td/>').append(o);
			attr && _td.attr(attr);
			return _td;
		}
		
		if (newRow || !this.row) {
			this.row = $('<tr/>').appendTo(this.table);
		}
		if (!$.isArray(el)) {
			this.row.append(td(el));
		} else {
			l = el.length;
			while (l--) {
				this.row.prepend(td(el[l]));
			}
		}
		return this;
	}
	
	/**
	 * Return table jquery
	 * 
	 * @return jQuery
	 **/
	this.get = function() {
		return this.table;
	}
}
	
	