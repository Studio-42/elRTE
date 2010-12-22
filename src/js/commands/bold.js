/**
 * @class Set/unset bold text
 * @param  String  command name
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.bold = function() {
	this.title    = 'Bold';
	this.author   = 'Dmitry (dio) Levashov, dio@std42.ru';
	this.nodeName = 'strong';
	this.regExp   = /^(B|STRONG)$/;
	this.cssProp  = 'font-weight';
	this.cssVal   = 'bold';
	this.shortcut = 'ctrl+b';
	this.test     = $.proxy(this.rte.mixins.textElement.test,   this);
	this.unwrap   = $.proxy(this.rte.mixins.textElement.unwrap, this);
	this.wrap     = $.proxy(this.rte.mixins.textElement.wrap,   this);
	this._init    = $.proxy(this.rte.mixins.textElement.init,   this);
	this._exec    = $.proxy(this.rte.mixins.textElement.exec,   this);
	this._state   = $.proxy(this.rte.mixins.textElement.state,  this);
}
