/**
 * @class elRTE command - align text to right
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.alignright = function() {
	this.title  = 'Align right';
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	this.css    = 'text-align';
	this.val    = 'right';
	this.node   = { name : 'p', css : { 'text-align' : this.val } };
	
	this._set   = $.proxy(this.rte.mixins.alignmentDirection.set,  this);
	this._exec  = $.proxy(this.rte.mixins.alignmentDirection.exec,  this);
	this._state = $.proxy(this.rte.mixins.alignmentDirection.state, this);
}
