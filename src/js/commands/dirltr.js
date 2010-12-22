(function($) {
	
	/**
	 * @class BDO tag with dir=ltr
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.dirltr = function() {
		this.title     = 'Text direction frm left to right';
		this.css    = 'direction';
		this.val    = 'ltr';
		this.attr   = 'dir';
		this.node   = { name : 'p', css : {}, attr : {} };
		
		this._init  = $.proxy(this.rte.mixins.alignmentDirection.init,  this);
		this._exec  = $.proxy(this.rte.mixins.alignmentDirection.exec,  this);
		this._state = $.proxy(this.rte.mixins.alignmentDirection.state, this);
	}
	
})(jQuery);