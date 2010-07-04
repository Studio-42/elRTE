(function($) {
	/**
	 * @class elRTE command fullscreen
	 * Toggle editor between normal/fullscreen view
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype._commands.fullscreen = function(rte) {
		this.rte     = rte;
		this.name    = 'fullscreen';
		this.title   = 'Full screen';
		/* editor node */
		this.editor  = rte.view.editor;
		/* workzone node */
		this.wz      = rte.view.workzone;
		/* workzone height */
		this.height  = 0;
		/* difference between editor and workzone heights */
		this.delta   = 0;
		/* parents with position=relative */
		this.parents = [];
		/* editor fullscreen css class */
		this._class  = 'elrte-fullscreen';
		
		var self = this;
		
		/* remember parents with position=relative */
		rte.bind('load', function() {
			self.editor.parents().each(function() {
				if (this.nodeName != 'BODY' && this.nodeName != 'HTML' && $(this).css('position') == 'relative') {
					self.parents.push(this);
				}
			});
		});
		
		/**
		 * Update editor height on window resize
		 *
		 **/
		function resize() {
			self.rte.view.setWorkzoneHeight($(window).height()-self.delta);
		}
		
		/**
		 * Toggle between normal/fullscreen view
		 *
		 **/
		this.exec = function() {
			var l = this.parents.length;
			
			if (this.editor.hasClass(this._class)) {
				this.editor.removeClass(this._class);
				this.rte.view.setWorkzoneHeight(this.height);
				$(window).unbind('resize', resize);
				while (l--) {
					$(this.parents[l]).css('position', 'relative');
				}
			} else {
				while (l--) {
					$(this.parents[l]).css('position', 'static');
				}
				this.height = this.wz.height(); 
				this.delta  = this.editor.outerHeight()-this.height;
				this.editor.addClass(this._class);
				this.rte.view.setWorkzoneHeight($(window).height()-this.delta);
				$(window).bind('resize', resize);
			}
			this._ui.toggleClass('elrte-ui-active', this.state())
		}
		
		/**
		 * Override parent method. No need to bind to events.
		 * Remove disabled class instead, so this button always enabled
		 *
		 **/
		this._bind = function() { 
			this._ui.removeClass('elrte-ui-disabled');
		}
		
		/**
		 * Return command state
		 *
		 * @return Number
		 **/
		this.state = function() {
			return this.editor.hasClass(this._class) ? this._active : this._enabled;
		}
	}
	
	elRTE.prototype._commands.fullscreen.prototype = elRTE.prototype._command;

})(jQuery);