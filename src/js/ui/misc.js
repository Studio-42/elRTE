(function($) {

	/**
	 * @class Create table, add data to table cells
	 * 
	 * @param  Object  table attributes
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.table = function(attr) {
		this.table = $('<table/>').attr(attr||{});
		this.row = false;
		
		this.append = function(el, newRow, attr) {
			var i, _td;
			
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
				for (i = 0; i < el.length; i++) {
					this.row.append(td(el[i]));
				}
			}
			return this;
		}
		
		this.get = function() {
			return this.table;
		}
	}
	
	/**
	 * Return select from given options and add change callback
	 * 
	 * @param  Object    options
	 * @param  Function  change callback
	 * @return jQuery
	 **/
	elRTE.prototype.ui.select = function(opts, change) {
		var s = '<select>';
		$.each(opts, function(v, l) {
			s += '<option value="'+v+'">'+l+'</option>';
		});
		s = $(s+'</select>');
		change && s.change(change);
		return s;
	}
	
	/**
	 * Return div with jqueryUI icon and click/hover callbacks
	 * 
	 * @param  String  icon(class) name
	 * @param  String  title
	 * @param  Function  click callback
	 * @return jQuery
	 **/
	elRTE.prototype.ui.button = function(icon, title, callback) {
		return $('<div class="ui-state-default ui-corner-all" title="'+title+'"><div style="width:16px;height:16px;margin:2px" class="ui-icon '+icon+'"></div></div>')
			.click( callback )
			.hover(function() { $(this).toggleClass('ui-state-hover') });
	}
	
})(jQuery);