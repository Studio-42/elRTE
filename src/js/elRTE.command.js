(function($) {
	/**
	 * @class Commands prototype
	 * Initilize by editor instance
	 * @param  elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.command = function(rte) {
		/* short command description for button title */
		this.title = '';
		/* editor instance */
		this.rte = rte;
		/* editor DOM object */
		this.dom = rte.dom;
		/* editor selection object */
		this.sel = rte.selection;
		// class "constants" - command states
		this.STATE_DISABLE = 0;
		this.STATE_ENABLE = 1;
		this.STATE_ACTIVE = 2;
		// ui class for disabled command
		this.uiDisableClass = 'elrte-ui-disabled'//rte.uiDisableClass;
		// ui class for active command
		this.uiActiveClass = 'elrte-ui-active'//rte.uiActiveClass;
		// class for hovered ui
		this.uiHoverClass = 'elrte-ui-hover'//rte.uiHoverClass;
		/* button/menu or other ui element placed on toolbar */
		this._ui;
		// currents command state
		this._state = 0;
		
		/**
		 * Bind to editor events
		 * By default, command listen "wysiwyg", "close" and "source" to switch between enable/disable states
		 * and "change" and "changePos" events to switch between enable/active states
		 *
		 * @return void
		 */
		this.bind = function() {
			var self = this;
			
			this.rte.bind('wysiwyg change changePos', function() {
				self._update();
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
			});
		}
		
		/**
		 * Return current command state
		 *
		 * @return Number
		 */
		this.state = function() {
			return this._state;
		}
		
		/**
		 * Return current command value
		 *
		 * @return Number
		 */
		this.value = function() {
			return this._val;
		}
		
		/**
		 * Create ui if not exists and return it
		 *
		 * @return jQuery
		 */
		this.ui = function() {
			return this._ui||this._createUI();
		}
		
		/**
		 * Exec command if possible and return if execed
		 *
		 * @param  mixed    command value if available
		 * @return Boolean
		 */
		this.exec = function(v) {
			return !!(this._state && this.rte.trigger('exec', {cmd : this.name}) && this._exec(v) && this.rte.trigger('change'));
		}
		
		/**
		 * Abstact method to real command action
		 *
		 * @return Boolean
		 */
		this._exec = function() {
			
		}
		
		/**
		 * Set command state
		 * Should not be called from outside
		 *
		 * @param  Number  command state. If not set - command check it's state and set
		 * @return void
		 */
		this._update = function(s) {
			this._state = s === void(0) ? this._getState() : s;
			this._ui && this._updateUI();
			if (this._state != this.STATE_DISABLE && this._setVal) {
				this._setVal();
			}
		}
		
		/**
		 * Check command state and return it
		 *
		 * @return Number
		 */
		this._getState = function() {
			return this.STATE_DISABLE;
		}
		
		/**
		 * Create ui (by default- simple button) and return it
		 *
		 * @return jQuery
		 */
		this._createUI = function() {
			var self = this,
				c    = 'elrte-ui';
			return this._ui = $('<li class="'+c+' '+c+'-'+this.name+' '+this.uiDisableClass+'" title="'+this.title+'" />')
				.mousedown(function(e) {
					e.preventDefault();
					e.stopPropagation();
					self.rte.focus();
					if (self._state > 0) {
						self.dialog ? self.dialog() : self.exec();
					}
					// self._state>0 && self.exec();
				});
		}
		
		/**
		 * Update ui classes based on current state
		 *
		 * @return void
		 */
		this._updateUI = function() {
			var d = this.uiDisableClass,
				a = this.uiActiveClass;
			if (this._ui) {
				switch (this._state) {
					case this.STATE_DISABLE : this._ui.removeClass(a).addClass(d); break;
					case this.STATE_ENABLE  : this._ui.removeClass(a+' '+d);       break;
					case this.STATE_ACTIVE  : this._ui.removeClass(d).addClass(a); break;
				}
			}
		}
		
	}
	
})(jQuery);