/**
 * @class Display document structure
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.docstructure = function() {
	this.title    = 'Toggle display document structure';
	this.cssClass = 'elrte-structure';
	this.conf     = { initActive : true };

	/**
	 * Toggle document structure highlight
	 *
	 * @return void
	 **/
	this._exec = function() {
		var d = this.rte.active;
		d && $(d.document.body).toggleClass(this.cssClass);
		this.update();
	}
	
	this._getState = function() {
		var d = this.rte.active;
		return d ? $(d.document.body).hasClass(this.cssClass) ? this.STATE_ACTIVE : this.STATE_ENABLE : this.STATE_DISABLE;
	}
	
	this.events = {
		'wysiwyg'      : this.update,
		'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
	}
	
	this._onInit = function() {
		// add css class to every new document
		if (this.conf.initActive) {
			this.events.open = function(e) { $(this.rte.document(e.data.id).document.body).addClass(this.cssClass) };
		}
	}
}

