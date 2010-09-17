(function($) {

	/**
	 * @class Set/unset strike text
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.strike = function() {
		this.title     = 'Strike';
		this.regExp    = /^(S|STRIKE|DEL)$/;
		this.cssProp   = 'text-decoration';
		this.cssVal    = 'line-through';
		this.test      = $.proxy(this.rte.mixins.textElement.test, this);
		this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.mixins.textElement.wrap, this);
		this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.textElement.state, this);
		
		this.rte.mixins.textElement.init.call(this);
	}
	
})(jQuery);