/**
 * @class elRTE command.
 * Select all document's content 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.selectall = function() {
	this.title = 'Select all';
	
	this.events = {
		wysiwyg        : function() { this.update(elRTE.CMD_STATE_ENABLED); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED) }
	}
	
	this._exec = function() {
		return this.sel.selectAll();
	}
	
	
}

