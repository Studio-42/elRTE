(function($) {
	/**
	 * @class elRTE command.
	 * Create/remove blockquote
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.blockquote = function() {
		this.title      = 'Blockquote';
		this._node      = 'blockquote';
		this._regExp    = /^BLOCKQUOTE$/;
		this._cutRegExp = /^(TABLE|UL|OL|P)$/;
		
		this._exec = $.proxy(this.rte.mixins.blockTextElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.blockTextElement.state, this);
	}

})(jQuery);