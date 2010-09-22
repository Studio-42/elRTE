/**
 * @class Set/unset underlined text
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.underline = function() {
	this.title     = 'Underline';
	this.regExp    = /^(U|INS)$/;
	this.cssProp   = 'text-decoration';
	this.cssVal    = 'underline';
	this.shortcut  = 'ctrl+u';
	this.test      = $.proxy(this.rte.mixins.textElement.test, this);
	this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
	this.wrap      = $.proxy(this.rte.mixins.textElement.wrap, this);
	this._onInit   = $.proxy(this.rte.mixins.textElement.init, this);
	this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
	this._getState = $.proxy(this.rte.mixins.textElement.state, this);
}
