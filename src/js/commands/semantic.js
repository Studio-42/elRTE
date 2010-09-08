(function($) {
	elRTE.prototype.commands.ins = function() {
		this.title     = 'Insertion';
		this.node      = 'ins'
		this.regExp    = /^INS$/;
		this.test      = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap    = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.commands._textElement.wrap, this);
		this._exec     = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
	elRTE.prototype.commands.del = function() {
		this.title     = 'Deletion';
		this.node      = 'del'
		this.regExp    = /^DEL$/;
		this.test      = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap    = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.commands._textElement.wrap, this);
		this._exec     = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
	elRTE.prototype.commands.abbr = function() {
		this.title     = 'Abbrevation';
		this.node      = 'abbr'
		this.regExp    = /^ABBR$/;
		this.test      = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap    = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.commands._textElement.wrap, this);
		this._exec     = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
	elRTE.prototype.commands.cite = function() {
		this.title     = 'Citation';
		this.node      = 'cite'
		this.regExp    = /^CITE$/;
		this.test      = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap    = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.commands._textElement.wrap, this);
		this._exec     = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
})(jQuery);