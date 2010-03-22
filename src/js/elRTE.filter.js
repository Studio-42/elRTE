(function($) {
	
	elRTE.prototype.filter = function(rte) {
		var self = this;
		this.rte = rte;
		

		
		this.toHtml = function() {
			// this.rte.log(this)
			this.rules.dom.common(rte, '')
		}
		
		
	}
	
	// elRTE.prototype.filter.prototype = new function() {}
	
	elRTE.prototype.filter.prototype.rules = {
		
		dom : {
			common : function(rte, n) { rte.log('dom'); return n }
		},
		
		html : {
			common : function(rte, html) { return html }
		}
		
	}
	
	
	
	elRTE.prototype.filter.prototype.chains = {
		domToHtml : [ 'dom:common' ],
		htmlToDom : [ 'html:common' ]
	}
	
	// elRTE.prototype.filter.prototype = new function() {
	// 	this.rte = null
	// 	this.init = function(rte) {
	// 		this.rte = rte;
	// 	}
	// 	
	// 	this.rules = {
	// 		html : {
	// 			common : function(html) { return html }
	// 		},
	// 		dom  : {
	// 			common : function(n) { this.rte.log('dom'); return n }
	// 		}
	// 	}
	// }
	// 
	// elRTE.prototype.filter.prototype._rules = {
	// 	html : {
	// 		common : function(html) { return html }
	// 	},
	// 	dom  : {
	// 		common : function(n) { this.rte.log('rule'); return n }
	// 	}
	// }
	// 
	// elRTE.prototype._filter.prototype.chains = {
	// 	domToHtml : [ 'dom:common' ],
	// 	htmlToDom : [ 'html:common' ]
	// }
	// 

	
})(jQuery);