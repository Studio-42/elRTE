/**
 * @class Display document structure
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.docstructure = function() {
	this.title = 'Toggle display document structure';
	this.c     = 'elrte-structure';
	this.conf  = { initActive : true };

	/**
	 * Toggle document structure highlight
	 *
	 * @return void
	 **/
	this._exec = function() {
		var d = this.rte.active;
		d && $(d.document.body).toggleClass(this.c);
		this.update();
	}
	
	this._state = function() {
		var d = this.rte.active;
		return d ? $(d.document.body).hasClass(this.c) ? elRTE.CMD_STATE_ACTIVE : elRTE.CMD_STATE_ENABLED : elRTE.CMD_STATE_DISABLED;
	}
	
	this.events = {
		wysiwyg        :  function() { this.update()},
		'source close' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
	
	this._init = function() {
		// add css class to every new document
		if (this.conf.initActive) {
			this.events.open = function(e) { $(this.rte.documentById(e.data.id).document.body).addClass(this.c) };
		}
	}
}

