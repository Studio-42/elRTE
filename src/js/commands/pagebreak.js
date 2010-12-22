/**
 * @class elRTE command.
 * Insert pagebreak placeholder
 * @TODO replace/restore placeholder in filter
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.pagebreak = function() {
	this.title    = 'Page break';
	this.author   = 'Dmitry (dio) Levashov, dio@std42.ru';
	this.cssClass = 'elrte-pagebreak'

	/**
	 * Events handlers
	 * 
	 * @type Object
	 */
	this.events = {
		wysiwyg        : function()  { this.update(elRTE.CMD_STATE_ENABLED); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); },
		mousedown      : function(e) { $(e.target).hasClass(this.cssClass) && e.preventDefault(); }
	}

	this._exec = function() {
		this.sel.insertHtml('<img src="'+this.rte.filter.url+'pixel.gif" class="elrte-protected '+this.cssClass+'" />');
	}
}
