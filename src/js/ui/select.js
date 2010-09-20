/**
 * Create select from given options, add change callback and return it
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