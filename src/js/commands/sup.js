(function($) {

	/**
	 * @class Set/unset Superscript text
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.sup = function() {
		this.title     = 'Superscript';
		this.node      = 'sup';
		this.regExp    = /^SUP$/;
		this.cssProp   = 'vertical-align';
		this.cssVal    = 'super';
		this.test      = $.proxy(this.rte.mixins.textElement.test, this);
		this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.mixins.textElement.wrap, this);
		this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.textElement.state, this);
		
		this.rte.mixins.textElement.init.call(this);
	}
	
})(jQuery);