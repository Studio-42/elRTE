(function($) {

	elRTE.prototype.command = new function() {
		
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.selection;
			this.createButton();
			this.bind();
		}
		
		/**
		 * Create button for toolbar and bind event
		 */
		this.createButton = function() {
			var self = this;
			this.button = $('<li unselectable="on" class="elrte-button inline-block disabled '+this.name+'" title="'+this.title+'" />')
				.bind('click', function(e) {
					// e.preventDefault()
					self.rte.focus();
					if (!$(this).hasClass('disabled')) {
						self.exec();
						self.rte.trigger('change');
					}
				})
				.hover(function(e) { 
					!$this.hasClass('disabled') && $(this).toggleClass('hover', e.type == 'mouseenter') 
				});
		}
		
		/**
		 * @return Number  -1 for disable button, 0 - normal state, 1 - active button 
		 */
		this.state = function() {
			return 0;
		}
		
		/**
		 * Bind to rte events
		 */
		this.bind = function() {
			var self = this;

			this.rte.bind('focus change', function() {
				var s = self.state();
				if (s == -1) { 
					self.button.removeClass('active').addClass('disabled');
				} else {
					self.button.removeClass('disabled').toggleClass('active', s>0);
				}
			});
			this.rte.bind('blur close source', function() {
				self.button.removeClass('active').addClass('disabled');
			});
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