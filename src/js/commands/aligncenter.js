(function($) {

	/**
	 * @class elRTE command - align text center
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.aligncenter = function() {
		this.title     = 'Align center';
		this.val       = 'center';
		this._exec     = $.proxy(elRTE.prototype.mixins.alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.mixins.alignment.state, this);
	}

})(jQuery);