/**
 * @class history  - save/restore editor content
 *
 * @param  elRTE  rte  объект-редактор
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 **/
(function($) {
elRTE.prototype.history = function(rte) {
	this.rte   = rte;
	this.body  = $(this.rte.doc.body);
	this._prev = []
	this._next = [];

	/**
	 * Add current content and selection to history
	 **/
	this.add = function() {
		var b = this.rte.selection.getBookmark();

		if (this.rte.options.historyLength>0 && this._prev.length>= this.rte.options.historyLength) {
			this._prev.slice(this.rte.options.historyLength);
		}
		this._prev.push([this.body.html(), [$(b[0]).attr('id'), $(b[1]).attr('id')]]);
		this._next = [];
		this.rte.selection.cleanBookmarks();
	}
	
	/**
	 * Restore content from prev history and save current content in next history
	 **/
	this.back = function() {
		if (this._prev.length) {
			var p = this._prev.pop(),
				b = this.rte.selection.getBookmark();
			this._next.push([this.body.html(), [$(b[0]).attr('id'), $(b[1]).attr('id')]]);
			this.body.html(p[0]);
			this.rte.selection.moveToBookmark(p[1]);
		}
	}

	/**
	 * Restore content from next history and save current content in prev history
	 **/
	this.fwd = function() {
		if (this._next.length) {
			var p = this._next.pop(),
				b = this.rte.selection.getBookmark();
			this._prev.push([this.body.html(), [$(b[0]).attr('id'), $(b[1]).attr('id')]]);
			this.body.html(p[0]);
			this.rte.selection.moveToBookmark(p[1]);
		}
	}
	
	/**
	 * Return true if can go history one step back
	 * @return Boolean
	 **/
	this.canBack = function() {
		return this._prev.length;
	}

	/**
	 * Return true if can go history one step forward
	 * @return Boolean
	 **/
	this.canFwd = function() {
		return this._next.length;
	}

}
})(jQuery);