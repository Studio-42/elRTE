/**
 * @class elRTE command.
 * Toggle view between editor and source if allowed.
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.source = function() {
	/**
	 * Short command description for button title
	 * 
	 * @type String
	 */
	this.title = 'Toggle view between editor and source';
	
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
		wysiwyg : function()  { this.update(elRTE.CMD_STATE_ENABLED); },
		source  : function()  { this.update(elRTE.CMD_STATE_ACTIVE); },
		close   : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
	
	/**
	 * Toggle document between wysiwyg and source mode
	 *
	 * @return false to avoid "change" event fired
	 **/
	this._exec = function() {
		return !this.rte.toggle();
	}
	
}
