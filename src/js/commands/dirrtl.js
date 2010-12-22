(function($) {
	
	/**
	 * @class BDO tag with dir=rtl
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.dirrtl = function() {
		this.title  = 'Text direction from right to left';
		this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.css    = 'direction';
		this.val    = 'rtl';
		this.attr   = 'dir';
		this.node   = { name : 'p', css : {}, attr : {} };
		
		this._init  = $.proxy(this.rte.mixins.alignmentDirection.init,  this);
		this._exec  = $.proxy(this.rte.mixins.alignmentDirection.exec,  this);
		this._state = $.proxy(this.rte.mixins.alignmentDirection.state, this);
		
	}
	
})(jQuery);