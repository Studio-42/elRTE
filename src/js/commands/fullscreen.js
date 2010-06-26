(function($) {
	
	elRTE.prototype._commands.fullscreen = function(rte) {
		this.name = 'fullscreen';
		this.title = 'Full screen';
		this.view   = rte.view;
		this.height = rte.view.workzone.height();
		
		// rte.log(rte.view.editor.height())
		// rte.log(rte.view.workzone.height())
		
		var self = this;
		this.init(rte);
		this.rte.bind('load', function(e) {
			// self.rte.log('load')
			// self.rte.log(self.view.editor.height())
			// self.rte.log(self.view.workzone.height())
		})
		
		this.exec = function() {
			this.rte.log('exec 2 '+this.name)
		}
		


	}
	
	elRTE.prototype._commands.fullscreen.prototype = elRTE.prototype._command;




	
	// elRTE.prototype.commands.fullscreen = function(rte) {
	// 	this.rte    = rte;
	// 	this.name   = 'fullscreen';
	// 	this.title  = 'Full screen';
	// 	this.view   = this.rte.view;
	// 	this.height = this.view.workzone.height();
	// 	this.delta  = this.view.toolbar.outerHeight(true)
	// 		+this.view.tabsbar.outerHeight(true)
	// 		+(this.view.statusbar.is(':visible') ? this.view.statusbar.outerHeight(true) : 0)+34;
	// 	
	// 	this.bind = function() { }
	// 	
	// 	this.exec = function() {
	// 		if (this.view.editor.hasClass('fullscreen')) {
	// 			this.view.editor.removeClass('fullscreen');
	// 			this.view.workzone.height(this.height);
	// 			this.button.removeClass('active');
	// 		} else {
	// 			this.view.editor.addClass('fullscreen');
	// 			this.view.workzone.height($(window).height()-this.delta);
	// 			this.button.addClass('active');
	// 		}
	// 	}
	// 	
	// 	this.init(rte);
	// 	this.button.removeClass('disabled');
	// }
	// 
	// elRTE.prototype.commands.fullscreen.prototype = elRTE.prototype.command;
	
})(jQuery);