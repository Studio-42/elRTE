/**
 * @class elRTE command.
 * Insert horizontal rule.
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.hr = function() {
	this.title = 'Horizontal rule';
	
	this._exec = function() {
		return this.sel.deleteContents().insertNode(this.dom.create('hr'));
	}
	
	this.events = {
		'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
	}
	
}
