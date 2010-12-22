/**
 * @class elRTE command - align text to left
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.alignleft = function() {
	this.title  = 'Align left';
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	this.css    = 'text-align';
	this.val    = 'left';
	this.node   = { name : 'p', css : { 'text-align' : this.val } };
	
	this._set   = $.proxy(this.rte.mixins.alignmentDirection.set,  this);
	this._exec  = $.proxy(this.rte.mixins.alignmentDirection.exec,  this);
	this._state = $.proxy(this.rte.mixins.alignmentDirection.state, this);
}
