/**
 * @class elRTE command.
 * Insert pagebreak placeholder
 * @TODO replace/restore placeholder in filter
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.pagebreak = function() {
	this.title    = 'Page break';
	this.cssClass = 'elrte-pagebreak'

	this._exec = function() {
		this.sel.insertHtml('<img src="'+this.rte.filter.url+'pixel.gif" class="elrte-protected '+this.cssClass+'" />');
	}
	
	this.events = {
		'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); },
		'mousedown'    : function(e) { $(e.target).hasClass(this.cssClass) && e.preventDefault(); }
	}
}
