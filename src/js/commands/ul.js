(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert unordered list.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.ul = function() {
		this.title     = 'Unordered list';
		this._exec     = $.proxy(this.rte.mixins.list.exec, this);
		this._getState = $.proxy(this.rte.mixins.list.state, this);
	}
	
})(jQuery);