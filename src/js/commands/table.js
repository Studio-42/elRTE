/**
 * @class elRTE command.
 * Create table
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.table = function() {
	this.title = 'Create table';
	this.conf  = { ui : 'table' };
	
	
	this.dialog = function() {
		this.rte.log('dialog')
	}
	
	this._exec = function(v) {
		var sel = this.sel,
			n   = this.dom.create({ name : 'table', attr : v.attr||{}});
		
		n = sel.deleteContents().insertNode(n);
		n = $(n).html(this.utils.strRepeat('<tr>'+this.utils.strRepeat('<td><br></td>', v.cols)+'</tr>', v.rows)).find('td:first')[0];
		this.sel.select(n.firstChild).collapse(true);
		return true;
	}
	
	this._getState = function() {
		return this.STATE_ENABLE;
	}
	
	this.events = {
		'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
	}
	
}