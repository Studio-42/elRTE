/**
 * Extend jQuery expressions.
 * Find elements in set which has elRTE editor instance
 *
 * @example
 * Select only nodes with elRTE instances
 *  $("selector:elrte")
 */
$.expr[':'].elrte = function(e) {
	var inst = $(e).data('elrte-editor');
	return !!(inst && inst.id);
}

$.fn.elrte = function(o) {
	
	this.each(function() {
		var $this = $(this);
		
		if (!$this.data('elrte') && !$this.data('_elrte_lock')) {
			$this.data('_elrte_lock', 1)
			// .data('elrte', new elRTE(o, this))
			new elRTE(o, this)
			$this.removeData('_elrte_lock');
		}
	});
	
	if (typeof(o) == 'string') {
		var inst = $(this).getElrte();
		
		return inst ? inst.exec.apply(inst, arguments) : void(0);
	}
	
	return this;
}

$.fn.getElrte = function() {
	return this.eq(0).data('elrte');
}