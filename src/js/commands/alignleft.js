(function($) {

	/**
	 * @class elRTE command - align text to left
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.alignleft = function() {
		this.title     = 'Align left';
		this.val       = 'left';
		this._exec     = $.proxy(elRTE.prototype.mixins.alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.mixins.alignment.state, this);
	}

})(jQuery);