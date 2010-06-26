(function($) {

	elRTE.prototype._command = new function() {
		this.name    = 'command';
		this.title   = '';
		this.rte     = null;
		this._button = null;
		
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.sel;
			// this.rte.log('init '+this.name)
		}
		
		this.button = function() {
			if (!this._button) {
				var self = this;
				
				this._button = $('<li unselectable="on" class="elrte-button inline-block disabled '+this.name+'" title="'+this.title+'" />')
					.click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						self.rte.focus();
						if (!$(this).hasClass('disabled') && self.exec()) {
							self.rte.trigger('change');
						}
					}).hover(function(e) {
						$(this).toggleClass('hover', e.type == 'mouseenter' && !$(this).hasClass('disabled'));
					});
					
				this.rte.bind('update change focus', function(e) {
					switch (self.state()) {
						case -1: self._button.removeClass('active').addClass('disabled'); break;
						case  0: self._button.removeClass('active disabled');             break;
						case  1: self._button.removeClass('disabled').addClass('active'); break;
					}
				}).bind('blur close', function(e) {
					self._button.removeClass('active').addClass('disabled');
				});
			}
			
			return this._button;
		}
		
		this.exec = function() {
			this.rte.log('exec command '+this.name)
		}
		
		this.state = function() {
			return 0;
		}
		
		
		
	}



	
})(jQuery);