(function($) {
	
	/**
	 * @class BDO tag with dir=ltr
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.dirltr = function() {
		this.title     = 'Left to right';
		this.node      = { name : 'bdo', attr : { dir : 'ltr' }}
		this.regExp    = /^BDO$/;
		this.test      = $.proxy(this.rte.mixins.direction.test, this);
		this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.mixins.direction.wrap, this);
		this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.textElement.state, this);
	}
	
})(jQuery);