/**
 * @class elRTE command.
 * Insert non breakable space into selection
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.nbsp = function() {
	this.title = 'Non breakable space';
	
	this._exec = function() {
		return this.sel.insertHtml('&nbsp;');
	}
	
	this.events = {
		wysiwyg        : function()  { this.update(elRTE.CMD_STATE_ENABLED); },
		'source close' : function(e) { this.update(e.data.id == this.rte.active.id ? elRTE.CMD_STATE_DISABLED : elRTE.CMD_STATE_ENABLED); }
	}

}
