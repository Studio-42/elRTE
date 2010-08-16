(function($) {
	
	/**
	 * @class Display document structure
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.docstructure = function(rte) {
		this.name     = 'docstructure';
		this.title    = 'Toggle display document structure';
		this.cssClass = 'elrte-structure';
	
		this.init(rte);
		
		/**
		 * Return command state
		 *
		 * @return Number
		 **/
		this.state = function() {
			return this.rte.isWysiwyg()
				? ($(this.rte.active.document.body).hasClass(this.cssClass) ? this._active : this._enabled)
				: this._disabled;
		}
		
		/**
		 * Toggle document structure highlight
		 *
		 * @return void
		 **/
		this.exec = function() {
			$(this.rte.active.document.body).toggleClass(this.cssClass);
			this.updateUI(this.state());
		}
		
		/**
		 * Bind update ui methods
		 *
		 * @return void
		 **/
		this._bind = function() {
			var self = this;
			
			if (this.rte.commandConf(this.name, 'initState') == 'on') {
				// add css class to each new document if enabled
				this.rte.bind('open', function(e) {
					$(self.rte.document(e.data.id).document.body).addClass(self.cssClass);
				});
			}
			
			this.rte.bind('wysiwyg', function(e) {
				self.updateUI(self.state());
			}).bind('close source', function(e) {
				if (e.type == 'source' || e.data.id == self.rte.active.id) {
					self.updateUI(self._disabled);
				}
			});
		}
	}
	
	elRTE.prototype.commands.docstructure.prototype = elRTE.prototype.command;
	
})(jQuery);