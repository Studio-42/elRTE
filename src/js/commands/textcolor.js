/**
 * @class elRTE command.
 * Insert non breakable space into selection
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.textcolor = function() {
	this.title = 'Text color';
	this.conf = { ui : 'color' };
	
	
	this._exec = function(v) {
		this.rte.log(v)
		// return this.sel.insertHtml('&nbsp;');
	}
	
	this._find = function() {
		var dom = this.dom;
		
		return dom.closestParent(this.sel.node(), function(n) { return n.nodeType == 1 && dom.css(n, 'color') }, true);
	}
	
	this._updValue = function() { 
		
		this._val = this.utils.color2Hex(this.dom.css(this._find(), 'color'))
	}
	
	this._getState = function() {
		return this.dom.is(this.sel.node(), 'text') ? this.STATE_ENABLE : this.STATE_DISABLE;
	}

}
