(function($) {
elRTE.prototype.history = function(rte) {
	this.rte = rte;
	this._prev = []
	this._next = [];

	
	this.add = function() {
		if (this.rte.options.historyLength>0 && this._prev.length>= this.rte.options.historyLength) {
			this._prev.slice(this.rte.options.historyLength);
		}
		this._prev.push($(this.rte.doc.body).html());
		this._next = [];
	}
	
	this.back = function() {
		
		if (this._prev.length) {
			this._next.push($(this.rte.doc.body).html());
			$(this.rte.doc.body).html(this._prev.pop());
		}
	}

	this.fwd = function() {
		if (this._next.length) {
			this._prev.push($(this.rte.doc.body).html());
			$(this.rte.doc.body).html(this._next.pop());
			
		}
	}
	
	this.canBack = function() {
		return this._prev.length;
	}
	
	this.canFwd = function() {
		return this._next.length;
	}

}
})(jQuery);