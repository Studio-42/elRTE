/**
 * @class elRTE command.
 * Toggle view between editor and source if allowed.
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.source = function() {

	this.title = 'Toggle view between editor and source';
	
	this._exec = function() {
		this.rte.toggle();
	}
	
	this.events = {
		wysiwyg : function() { this.update(elRTE.CMD_STATE_ENABLED); },
		source  : function() { this.update(elRTE.CMD_STATE_ACTIVE); },
		close   : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
}
