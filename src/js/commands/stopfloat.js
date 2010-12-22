/**
 * @class elRTE command stopfloat
 * Insert br tag with style="clear:both"
 * @author Dmitry (dio) Levashov, dio@std42.ru
 *
 **/
elRTE.prototype.commands.stopfloat = function() {
	this.title = 'Stop element floating';
	this.author   = 'Dmitry (dio) Levashov, dio@std42.ru';
	/**
	 * Events handlers
	 * 
	 * @type Object
	 */
	this.events = {
		wysiwyg        : function()  { this.update(elRTE.CMD_STATE_ENABLED); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
	
	this._exec = function() {
		return this.sel.insertNode(this.dom.create({name : 'br', css : { clear : 'both' }}));
	}
	
}
