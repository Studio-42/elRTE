/**
 * @class elRTE command.
 * Create/remove div
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.div = function() {
	this.title      = 'Block element (DIV)';
	this._node      = 'div';
	this._regExp    = /^DIV$/;
	this._cutRegExp = /^(TABLE|UL|OL|P)$/;
	this._exec      = $.proxy(this.rte.mixins.blockTextElement.exec, this);
	this._getState  = $.proxy(this.rte.mixins.blockTextElement.state, this);
}
