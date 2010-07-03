(function($) {

	elRTE.prototype._command = new function() {
		this.name    = 'command';
		this.title   = '';
		this.rte     = null;
		this._button = null;
		this._disabled = -1;
		this._enabled  = 0;
		this._active   = 1;
		
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.sel;

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
					
				this.rte.bind('change focus', function(e) {
					switch (self.state()) {
						case self._disabled: self._button.removeClass('active').addClass('disabled'); break;
						case self._enabled : self._button.removeClass('active disabled');             break;
						case self._active  : self._button.removeClass('disabled').addClass('active'); break;
					}
				}).bind('blur close', function(e) {
					self._button.removeClass('active').addClass('disabled');
				});
			}
			
			return this._button;
		}
		
		/**
		 * Create and return command ui (button)
		 *
		 * @return  jQuery
		 **/
		this.ui = function() {
			if (!this._ui) {
				var self = this;
				
				this._ui = $('<li unselectable="on" class="elrte-button inline-block disabled '+this.name+'" title="'+this.title+'" />')
					.click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						self.rte.focus();
						if (!$(this).hasClass('disabled')) {
							
							if (typeof(self.uiAction) == 'function') {
								/* for commands with menu/palletes etc */
								self.uiAction();
							} else if (self.exec()) {
								/* for others commands */
								self.rte.trigger('change');
							}
						}
					}).hover(function(e) {
						$(this).toggleClass('hover', e.type == 'mouseenter' && !$(this).hasClass('disabled'));
					});
					
				this.rte.bind('change focus', function(e) {
					self.updateUi(self.state());
				}).bind('blur close', function(e) {
					self.updateUi(self._disabled);
				});
			}
			
			return this._button;
		}
		
		/**
		 * Update command ui (button) state
		 *
		 * @param  Number  command state
		 **/
		this.updateUi = function(s) {
			switch (s) {
				case self._disabled: self._ui.removeClass('active').addClass('disabled'); break;
				case self._enabled : self._ui.removeClass('active disabled');             break;
				case self._active  : self._ui.removeClass('disabled').addClass('active'); break;
			}
		}
		
		/**
		 * Execute command
		 *
		 * @param Object  command arguments
		 * @return Boolean
		 **/
		this.exec = function(o) {
			this.rte.trigger('exec')
			this.rte.log('exec command '+this.name)
		}
		
		/**
		 * Return command state (this._disabled/this._enabled/this._active)
		 *
		 * @return Number
		 **/
		this.state = function() {
			return this._enabled;
		}
		
		/**
		 * Return current command value (selected node state for example) if enabled
		 *
		 * @return Object
		 **/
		this.value = function() {
			return false;
		}
		
		
	}



	
})(jQuery);