/**
 * @class elRTE command - align text to left
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.alignleft = function() {
	this.title     = 'Align left';
	this._val       = 'left';
	this._exec     = $.proxy(this.rte.mixins.alignment.exec, this);
	this._getState = $.proxy(this.rte.mixins.alignment.state, this);
}
