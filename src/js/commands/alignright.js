(function($) {

	/**
	 * @class elRTE command - align text to right
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.alignright = function() {
		this.title     = 'Align right';
		this.val       = 'right';
		this._exec     = $.proxy(elRTE.prototype.mixins.alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.mixins.alignment.state, this);
	}

})(jQuery);