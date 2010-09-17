(function($) {

	/**
	 * @class Create/remove ins tag 
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.abbr = function() {
		this.title     = 'Abbrevation';
		this.node      = 'abbr'
		this.regExp    = /^ABBR$/;
		this.test      = $.proxy(this.rte.mixins.textElement.test, this);
		this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.mixins.textElement.wrap, this);
		this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.textElement.state, this);
	}

})(jQuery);