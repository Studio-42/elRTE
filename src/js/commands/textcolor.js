/**
 * @class elRTE command.
 * Insert non breakable space into selection
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.textcolor = function() {
	this.title = 'Text color';
	this.conf = { ui : 'palette' };
	
	
	this._exec = function() {
		// return this.sel.insertHtml('&nbsp;');
	}
	
	this._getState = function() {
		return this.dom.is(this.sel.node(), 'text') ? this.STATE_ENABLE : this.STATE_DISABLE;
	}

}
