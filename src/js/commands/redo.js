/**
 * @class redo - redo button
 *
 * @param  elRTE
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.redo = function() {
	this.title = 'Redo previous action';
	
	this._exec = function() {
		return this.rte.history.redo();
	}
	
	this._state = function() {
		return this.rte.history.canRedo() ? elRTE.CMD_STATE_ENABLED : elRTE.CMD_STATE_DISABLED;
	}
	
	this.events = {
		'wysiwyg historyChange' : function(e) { this.update(); },
		'close source' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
}


