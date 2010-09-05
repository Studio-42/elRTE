(function($) {
	
	/**
	 * @class Display document structure
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.docstructure = function() {
		this.title  = 'Toggle display document structure';
		this._class = 'elrte-structure';
	
		this.bind = function() {
			var self = this;
			
			if (this.rte.commandConf(this.name, 'initState') == 'on') {
				// add css class to each new document if enabled
				this.rte.bind('open', function(e) {
					$(self.rte.document(e.data.id).document.body).addClass(self._class);
				});
			}
			
			this.rte.bind('wysiwyg', function() {
				self._setState();
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._setState(self.STATE_DISABLE);
			});
		}

		/**
		 * Toggle document structure highlight
		 *
		 * @return void
		 **/
		this._exec = function() {
			var d = this.rte.active;
			d && $(d.document.body).toggleClass(this._class);
			this._setState();
		}
		
		this._getState = function() {
			var d = this.rte.active;
			return d ? $(d.document.body).hasClass(this._class) ? this.STATE_ACTIVE : this.STATE_ENABLE : this.STATE_DISABLE;
		}
		
	}
	
})(jQuery);