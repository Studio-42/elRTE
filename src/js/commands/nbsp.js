/**
 * @class elRTE command.
 * Insert non breakable space into selection
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.nbsp = function() {
	/**
	 * Short command description for button title
	 * 
	 * @type String
	 */
	this.title = 'Non breakable space';
	
	/**
	 * Command author
	 * 
	 * @type String
	 */
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	
	/**
	 * Events handlers
	 * 
	 * @type Object
	 */
	this.events = {
		wysiwyg        : function()  { this.update(elRTE.CMD_STATE_ENABLED); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
	
	/**
	 * Insert non breakable space into selection
	 * 
	 * @return true
	 */
	this._exec = function() {
		return !!this.sel.insertHtml('&nbsp;');
	}
	
	

}
