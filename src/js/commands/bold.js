(function($) {

	/**
	 * @class Set/unset bold text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.bold = function() {
		this.title     = 'Bold';
		this.nodeName  = 'strong';
		this.regExp    = /^(B|STRONG)$/;
		this.cssProp   = 'font-weight';
		this.cssVal    = 'bold';
		this.shortcut  = 'ctrl+b';
		this.test      = $.proxy(this.rte.mixins.textElement.test, this);
		this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.mixins.textElement.wrap, this);
		this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.textElement.state, this);
		
		this.rte.mixins.textElement.init.call(this);
	}

})(jQuery);