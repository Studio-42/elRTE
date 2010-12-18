/**
 * @class Display document structure
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.docstructure = function() {
	/**
	 * Short command description for button title
	 * 
	 * @type String
	 */
	this.title = 'Toggle display document structure';
	
	/**
	 * Command author
	 * 
	 * @type String
	 */
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	
	/**
	 * Css clss to highlight document structure
	 * 
	 * @type String
	 */
	this.c     = 'elrte-structure';
	
	/**
	 * Command configuration
	 * 
	 * @type    Object
	 */
	this.conf  = { initActive : true };

	/**
	 * Events handlers
	 * 
	 * @type Object
	 */
	this.events = {
		wysiwyg        :  function() { this.update()},
		'source close' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}

	/**
	 * Toggle document structure highlight
	 *
	 * @return true
	 **/
	this._exec = function() {
		var d = this.rte.active;
		
		d && $(d.document.body).toggleClass(this.c);
		this.update();
		return true;
	}
	
	/**
	 * Detect and return command state
	 *
	 * @return Number
	 */
	this._state = function() {
		var d = this.rte.active;
		return d ? $(d.document.body).hasClass(this.c) ? elRTE.CMD_STATE_ACTIVE : elRTE.CMD_STATE_ENABLED : elRTE.CMD_STATE_DISABLED;
	}
	
	/**
	 * Add "open" event handler to add css class to every new document
	 * Called while init command
	 *
	 * @return void
	 */
	this._init = function() {
		// add css class to every new document
		if (this.conf.initActive) {
			this.events.open = function(e) { $(this.rte.documentById(e.data.id).document.body).addClass(this.c) };
		}
	}
}

