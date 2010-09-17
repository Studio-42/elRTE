(function($) {
	
	/**
	 * @class BDO tag with dir=rtl
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.dirrtl = function() {
		this.title     = 'Right to left';
		this.node      = { name : 'bdo', attr : { dir : 'rtl' }}
		this.regExp    = /^BDO$/;
		this.test      = $.proxy(this.rte.mixins.direction.test, this);
		this.unwrap    = $.proxy(this.rte.mixins.textElement.unwrap, this);
		this.wrap      = $.proxy(this.rte.mixins.direction.wrap, this);
		this._exec     = $.proxy(this.rte.mixins.textElement.exec, this);
		this._getState = $.proxy(this.rte.mixins.textElement.state, this);
		
	}
	
})(jQuery);