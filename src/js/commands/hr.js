/**
 * @class elRTE command.
 * Insert horizontal rule.
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.hr = function() {
	this.title = 'Horizontal rule';
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
		return this.sel.deleteContents().insertNode(this.dom.create('hr'));
	}
	
}
