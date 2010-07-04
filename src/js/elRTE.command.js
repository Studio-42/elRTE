(function($) {
	/**
	 * @class elRTE parent class for editor commands
	 *
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype._command = new function() {
		this.name      = 'command';
		this.title     = '';
		/* editor instance */
		this.rte       = null;
		/* editor DOM object */
		this.dom       = null;
		/* editor selection object */
		this.sel       = null;
		/* button/menu or other ui element on toolbar */
		this._ui       = null;
		/* smth like constant:) command disabled at now */
		this._disabled = -1;
		/* command enabled */
		this._enabled  = 0;
		/* command active, for example command 'bold' when carret inside 'strong' node */
		this._active   = 1;

		/**
		 * Init command
		 *
		 * @param  elRTE  editor instance
		 **/
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.sel;
		}
		
		/**
		 * Create and return command ui (button)
		 *
		 * @return  jQuery
		 **/
		this.ui = function() {
			if (!this._ui) {
				this._ui = this._createUI();
				this._bind();
			}
			return this._ui;
		}
		
		/**
		 * Execute command (abstract method)
		 *
		 * @param Object  command arguments
		 * @return Boolean
		 **/
		this.exec = function(o) {
			this.rte.trigger('exec');
			this.rte.log('exec command '+this.name)
		}
		
		/**
		 * Return command state (this._disabled/this._enabled/this._active)
		 * (abstract method)
		 *
		 * @return Number
		 **/
		this.state = function() {
			return this._enabled;
		}
		
		/**
		 * Return current command value (selected node state for example) if enabled
		 * (abstract method)
		 *
		 * @return Object
		 **/
		this.value = function() {
			return null;
		}
		
		/**
		 * Create and return ui element (button)
		 *
		 * @return jQuery
		 **/
		this._createUI = function() {
			var self = this;
			return $('<li unselectable="on" class="elrte-ib elrte-ui-disabled elrte-ui-button elrte-ui-'+this.name+'" title="'+this.title+'" />')
				.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					self.rte.focus();
					!$(this).hasClass('elrte-ui-disabled') && self.exec() && self.rte.trigger('change');
				}).hover(function(e) {
					$(this).toggleClass('elrte-ui-hover', e.type == 'mouseenter' && !$(this).hasClass('disabled'));
				});
		}
		
		/**
		 * Bind update ui methods
		 *
		 * @return jQuery
		 **/
		this._bind = function() {
			var self = this;
			this.rte.bind('change focus', function(e) {
				switch (self.state()) {
					case self._disabled: self._ui.removeClass('elrte-ui-active').addClass('elrte-ui-disabled'); break;
					case self._enabled : self._ui.removeClass('elrte-ui-active elrte-ui-disabled');             break;
					case self._active  : self._ui.removeClass('elrte-ui-disabled').addClass('elrte-ui-active'); break;
				}
			}).bind('blur close', function(e) {
				self._ui.removeClass('elrte-ui-active').addClass('elrte-ui-disabled');
			});
		}
	}
	
})(jQuery);