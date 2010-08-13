(function($) {
	/**
	 * @class elRTE command fullscreen
	 * Toggle editor between normal/fullscreen view
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.fullscreen = function(rte) {
		var self   = this;
		this.rte   = rte;
		this.name  = 'fullscreen';
		this.title = 'Full screen';
		/* view object */
		this.view = rte.view;
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
		
		/* remember height, delta and parents with position=relative */
		rte.bind('load', function() {
			self.height = self.wz.height();
			self.delta  = self.editor.outerHeight()-self.height;
			self.editor.parents().each(function() {
				if (this.nodeName != 'BODY' && this.nodeName != 'HTML' && $(this).css('position') == 'relative') {
					self.parents.push(this);
				}
			});
		});
		
		/**
		 * Update editor height on window resize in fullscreen view
		 *
		 **/
		function resize() {
			self.wz.height($(window).height()-self.delta);
			self.view.updateHeight();
		}
		
		/**
		 * Toggle between normal/fullscreen view
		 *
		 **/
		this.exec = function() {
			var l = this.parents.length;
			
			if (this.editor.hasClass(this._class)) {
				// set normal view
				this.view.resizable(true);
				this.editor.removeClass(this._class);
				this.wz.height(this.height).css('width', '');
				this.view.updateHeight();
				$(window).unbind('resize', resize);
				while (l--) {
					$(this.parents[l]).css('position', 'relative');
				}
			} else {
				// set fullscreen view
				this.view.resizable(false);
				while (l--) {
					$(this.parents[l]).css('position', 'static');
				}
				this.editor.addClass(this._class).removeAttr('style');
				this.wz.css('width', '100%');
				this.wz.height($(window).height()-this.delta);
				this.view.updateHeight();
				$(window).bind('resize', resize);
			}
			this.updateUI(this.state());
		}
		
		/**
		 * Override parent method. No need to bind to events.
		 * Remove disabled class instead, so this button always enabled
		 *
		 **/
		this._bind = function() { 
			this._ui.removeClass(this.classDisabled);
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
	
	elRTE.prototype.commands.fullscreen.prototype = elRTE.prototype.command;

})(jQuery);