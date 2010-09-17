(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert ordered list.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.ol = function() {
		this.title     = 'Ordered list';
		this._exec     = $.proxy(elRTE.prototype.mixins.list.exec, this);
		this._getState = $.proxy(elRTE.prototype.mixins.list.state, this);
	}
	
})(jQuery);