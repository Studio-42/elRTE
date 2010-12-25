/**
 * @class elRTE command fullscreen
 *
 * Toggle editor between normal/fullscreen view
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.fullscreen = function() {
	this.title  = 'Fullsreen';
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	this.events = {
		load          : function() { this.update(elRTE.CMD_STATE_ENABLED); },
		fullscreenon  : function() { this.update(elRTE.CMD_STATE_ACTIVE); },
		fullscreenoff : function() { this.update(elRTE.CMD_STATE_ENABLED); }
	}
	
	/**
	 * Call elRTE.fullscreen method
	 * Return undefined to avoid rise "change" event
	 *
	 * @return void
	 */
	this._exec = function() {
		this.rte.fullscreen();
	}
	
	/**
	 * Detect and return command state
	 *
	 * @return Number
	 */
	this._state = function(s) {
		return elRTE.CMD_STATE_ENABLED;
	}
}
