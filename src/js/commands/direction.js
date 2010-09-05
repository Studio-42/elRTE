(function($) {
	
	/**
	 * Common methods for ltr/rtl classes 
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands._direction = {
		test : function(n) {
			return this.regExp.test(n.nodeName) && $(n).attr('dir') == this.node.attr.dir;
		},
		innerWrap : function(n) {
			return this.dom.is(n, 'block');
		},
		wrap : function(n) {
			var self = this, 
				d = this.dom,
				w = [];

			function wrap() {
				d.filter(w, self.testWrap||'notEmpty').length && $(d.wrap(w, self.node));
				w = [];
			}
			
			$.each(n, function(i, n) {
				if (n.nodeName == 'BDO') {
					$(n).attr('dir', self.node.attr.dir);
				} else if (self.acceptWrap(n)) {
					w.length && !d.isSiblings(n, w[w.length-1]) && wrap();
					w.push(n);
				}
			});
			wrap();
		}
	}
	
	/**
	 * @class BDO tag with dir=ltr
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.ltr = function() {
		this.title      = 'Left to right';
		this.node       = { name : 'bdo', attr : { dir : 'ltr' }}
		this.regExp     = /^BDO$/;
		this.test       = $.proxy(this.rte.commands._direction.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._direction.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._direction.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
	}	
	
	/**
	 * @class BDO tag with dir=rtl
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.rtl = function() {
		this.title      = 'Right to left';
		this.node       = { name : 'bdo', attr : { dir : 'rtl' }}
		this.regExp     = /^BDO$/;
		this.test       = $.proxy(this.rte.commands._direction.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._direction.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._direction.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
	}

})(jQuery);