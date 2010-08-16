(function($) {
	/**
	 * @class elRTE parent class for editor commands
	 *
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.command = new function() {
		/* command name */
		this.name = 'command';
		/* short command description for button title */
		this.title = '';
		/* editor instance */
		this.rte = null;
		/* editor DOM object */
		this.dom = null;
		/* editor selection object */
		this.sel = null;
		/* button/menu or other ui element placed on toolbar */
		this._ui = null;
		/* smth like constant:) command disabled at now */
		this._disabled = -1;
		/* command enabled */
		this._enabled  = 0;
		/* command active, for example command 'bold' when carret inside 'strong' node */
		this._active   = 1;
		/* class for active button */
		this.classActive = 'elrte-ui-active';
		/* class for disabled button */
		this.classDisabled = 'elrte-ui-disabled';
		

		/**
		 * Initilize object
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
			this.rte.trigger('exec', { cmd : this.name });
			this.rte.log('exec command '+this.name);
			return false;
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
		 * Change button classes based on command state
		 *
		 * @param  Number  command state
		 * @return void
		 **/
		this.updateUI = function(s) {
			switch (s) {
				case this._disabled: this._ui.removeClass(this.classActive).addClass(this.classDisabled); break;
				case this._enabled : this._ui.removeClass(this.classActive+' '+this.classDisabled);       break;
				case this._active  : this._ui.removeClass(this.classDisabled).addClass(this.classActive); break;
			}
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
			return $('<li '+($.browser.msie ? 'unselectable="on" ' : '')+'class="elrte-ib elrte-ui-button elrte-ui-'+this.name+' '+this.classDisabled+'" title="'+this.title+'" />')
				.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					self.rte.focus();
					!$(this).hasClass(this.classDisabled) && self.exec() && self.rte.trigger('change');
				}).hover(function(e) {
					$(this).toggleClass('elrte-ui-hover', e.type == 'mouseenter' && !$(this).hasClass(this.classDisabled));
				});
		}
		
		/**
		 * Bind update ui methods
		 *
		 * @return jQuery
		 **/
		this._bind = function() {
			var self = this;
			this.rte.bind('wysiwyg change changePos', function(e) {
				self.updateUI(self.state())
			}).bind('close source', function(e) {
				if (e.type == 'source' || e.data.id == self.rte.active.id) {
					self.updateUI(self._disabled);
				}
			});
		}
	}
	
})(jQuery);