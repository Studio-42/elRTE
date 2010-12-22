/**
 * @class elRTE command save
 * Call editor "save" command
 * @author Dmitry (dio) Levashov, dio@std42.ru
 *
 **/
elRTE.prototype.commands.save = function() {
	this.title  = 'Save';
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	this.events = {
		open  : function() { this.update(elRTE.CMD_STATE_ENABLED); },
		close : function() { !this.rte.counter && this.update(elRTE.CMD_STATE_DISABLED); }
	}
	
	this._exec = function() {
		this.rte.save();
	}
	
	
}
	
