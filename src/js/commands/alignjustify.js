/**
 * @class elRTE command - align text justify
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.alignjustify = function() {
	this.title     = 'Align justify';
	this._val       = 'justify';
	this._exec     = $.proxy(elRTE.prototype.mixins.alignment.exec, this);
	this._getState = $.proxy(elRTE.prototype.mixins.alignment.state, this);
}
