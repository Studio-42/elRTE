(function($) {

	elRTE.prototype.command = new function() {
		
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.selection;
			this.createButton();
			this.bind();
		}
		
		this.createButton = function() {
			var self = this;
			this.button = $('<li class="elrte-button inline-block '+this.name+'" title="'+this.title+'" />')
				.bind('click', function(e) {
					self.rte.focus();
					if (!$(this).hasClass('disabled')) {
						self.exec();
						self.rte.trigger('update');
					}
				}).hover(
					function() { $(this).addClass('hover') },
					function() { $(this).removeClass('hover') }
				);
		}
		
		this.state = function() {
			this.rte.log('command state')
			return this.rte.wysiwyg ? 0 : -1;
		}
		
		this.bind = function() {
			// this.rte.log('command bind '+this.name)
			var self = this;

			function update() {
				var s = self.state();

				if (s == -1) { 
					self.button.removeClass('active').addClass('disabled');
				} else {
					self.button.removeClass('disabled').toggleClass('active', s>0);
				}
			}

			this.rte.bind('update, toggle', update);
		}
		
		this.exec = function() { 
			this.rte.log('command '+this.name+' exec')
		}
		
	}


//////////////////


	elRTE.prototype.command_ = function(rte) {
		this.rte = rte;
		this.dom = rte.dom;
		this.sel = rte.selection;
		this.createButton();
		this.bind();
	}
	
	elRTE.prototype.command_.prototype.createButton = function() {
		var self = this;
		this.button = $('<li class="elrte-button inline-block '+this.name+'" title="'+this.title+'" />')
			.bind('click', function(e) {
				self.rte.focus();
				if (!$(this).hasClass('disabled')) {
					self.exec();
					self.rte.trigger('update');
				}
			}).hover(
				function() { $(this).addClass('hover') },
				function() { $(this).removeClass('hover') }
			);
	}
	
	elRTE.prototype.command_.prototype.state = function() {
		return this.rte.wysiwyg ? 0 : -1;
	}
	
	elRTE.prototype.command_.prototype.bind = function() {
		// this.rte.log('command bind '+this.name)
		var self = this;
	
		function update() {
			var s = self.state();
	
			if (s == -1) { 
				self.button.removeClass('active').addClass('disabled');
			} else {
				self.button.removeClass('disabled').toggleClass('active', s>0);
			}
		}
	
		this.rte.bind('update, toggle', update);
	}
	
	elRTE.prototype.command_.prototype.exec = function() { 
		this.rte.log('command '+this.name+' exec')
	}
	
	


	
})(jQuery);