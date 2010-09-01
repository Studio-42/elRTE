(function($) {
	// @TODO - autobind cmd shortcut
	elRTE.prototype.command2 = new function() {
		
		/* short command description for button title */
		this.title = '';
		/* editor instance */
		this.rte = null;
		/* editor DOM object */
		this.dom = null;
		/* editor selection object */
		this.sel = null;
		
		
		this.STATE_DISABLE = 0;
		this.STATE_ENABLE = 1;
		this.STATE_ACTIVE = 2;
		
		this._dClass = 'elrte-ui-disabled';
		this._aClass = 'elrte-ui-active';
		this._hClass = 'elrte-ui-hover';
		/* button/menu or other ui element placed on toolbar */
		this._ui;
		this._state = 0;
		
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.selection;
		}
		
		this.bind = function() {
			var self = this;
			
			this.rte.bind('wysiwyg', function() {
				self._setState(self._getState());
			}).bind('source', function() {
				self._setState(self.STATE_DISABLE);
			}).bind('close', function(e) {
				e.data.id == self.rte.active.id && self._setState(self.STATE_DISABLE);
			}).bind('change changePos', function() {
				self.rte.isWysiwyg() && self._setState(self._getState());
			});
		}
		
		this.state = function() {
			return this._state;
		}
		
		this.ui = function() {
			return this._ui||this._createUI();
		}
		
		this.exec = function() {
			return !!(this._state && this.rte.trigger('exec', {cmd : this.name}) && this._exec() && this.rte.trigger('change'));
		}
		
		this._exec = function() {
			
		}
		
		this._setState = function(s) {
			this._state = s;
			this._ui && this._updateUI();
		}
		
		this._getState = function() {
			return this.STATE_DISABLE;
		}
		
		this._createUI = function() {
			var self = this;
			return $('<li class="elrte-ib elrte-ui-button elrte-ui-'+this.name+' '+this._dClass+'" title="'+this.title+'" />')
				.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					self.rte.focus();
					self._state>0 && self.exec();
				}).hover(function(e) {
					$(this).toggleClass(self._hClass, e.type == 'mouseenter' && self._state);
				});
		}
		
		this._updateUI = function() {
			switch (this._state) {
				case this.STATE_DISABLE : this._ui.removeClass(this._aClass).addClass(this._dClass); break;
				case this.STATE_ENABLE  : this._ui.removeClass(this._aClass+' '+this._dClass);       break;
				case this.STATE_ACTIVE  : this._ui.removeClass(this._dClass).addClass(this._aClass); break;
			}
		}
		
	}
	
	/**
	 * @class command parent class for editor commands
	 *
	 * @author Dmitry (dio) Levashov, dio@std42.ru
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
		
		this.STATE_DISABLE = 0;
		this.STATE_ENABLE = 1;
		this.STATE_ACTIVE = 2;
		this._state = 0;

		/**
		 * Initilize object
		 *
		 * @param  elRTE  editor instance
		 **/
		this.init = function(rte) {
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.selection;
		}
		
		
		this.bind = function() {
			this.rte.log(this.name+' bind')
			var self = this;
			
			this.rte.bind('wysiwyg', function() {
				// self.updateUI(self.state());
			}).bind('source', function() {
				// self.updateUI(self._disabled);
			}).bind('close', function(e) {
				// e.data.id == self.rte.active.id && self.updateUI(self._disabled);
			}).bind('change changePos', function() {
				// self.rte.isWysiwyg() && self.updateUI(self.state());
			})
		}
		
		this.updateState = function(s) {
			this._state = s;
			if (this._ui) {
				this._updateUI();
			}
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
			return this._disabled;
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
					if (!$(this).hasClass(self.classDisabled)) {
						self.rte.trigger('exec', { cmd : self.name});
						self.exec() && self.rte.trigger('change')
					}
					// !$(this).hasClass(this.classDisabled) && self.exec() && self.rte.trigger('change');
				}).hover(function(e) {
					$(this).toggleClass('elrte-ui-hover', e.type == 'mouseenter' && !$(this).hasClass(this.classDisabled));
				});
		}
		
		/**
		 * Bind update ui methods
		 *
		 * @return void
		 **/
		this._bind = function() {
			var self = this;
			
			this.rte.bind('wysiwyg', function() {
				self.updateUI(self.state());
			}).bind('source', function() {
				self.updateUI(self._disabled);
			}).bind('close', function(e) {
				e.data.id == self.rte.active.id && self.updateUI(self._disabled);
			}).bind('change changePos', function() {
				self.rte.isWysiwyg() && self.updateUI(self.state());
			})
			
			// this.rte.bind('wysiwyg change changePos', function(e) {
			// 	self.updateUI(self.state());
			// }).bind('close source', function(e) {
			// 	if (e.type == 'source' || e.data.id == self.rte.active.id) {
			// 		self.updateUI(self._disabled);
			// 	}
			// });
		}
	}

	
})(jQuery);