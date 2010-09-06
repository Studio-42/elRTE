(function($) {
	
	/**
	 * Common methods for lists commands
	 * @TODO - andavnec interface - list-style selection
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands._lists = {
		
		exec : function() {
			this.rte.active.document.execCommand(this.name == 'ul' ? 'insertunorderedlist' : 'insertorderedlist', false, null);
			return true;
		},
		
		getState : function() {
			var self = this;
			return this.dom.closestParent(this.sel.node(), function(n) { return n.nodeName == self.name.toUpperCase(); }, true) ? this.STATE_ACTIVE : this.STATE_ENABLE;
		}
	}
	
	/**
	 * @class elRTE command.
	 * Insert unordered list.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.ul = function() {
		this.title     = 'Unordered list';
		this._exec     = $.proxy(elRTE.prototype.commands._lists.exec, this);
		this._getState = $.proxy(elRTE.prototype.commands._lists.getState, this);
	}
	
	/**
	 * @class elRTE command.
	 * Insert ordered list.
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.ol = function() {
		this.title     = 'Ordered list';
		this._exec     = $.proxy(elRTE.prototype.commands._lists.exec, this);
		this._getState = $.proxy(elRTE.prototype.commands._lists.getState, this);
	}
	
})(jQuery);