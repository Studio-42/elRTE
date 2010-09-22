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
		this.STATE_ENABLE  = 1;
		this.STATE_ACTIVE  = 2;
		// currents command state
		this._state = 0;
		// command config
		this.conf = {};
		
		/**
		 * Initilize command
		 *
		 * @return void
		 */
		this.init = function(conf) {
			var self = this,
				rte  = this.rte;
				
			this.title = rte.i18n(this.title);
			this.conf = $.extend({}, this.conf, conf);
			// this.rte.log(this.name)
			// this.rte.log(this._conf)
			this._listeners = [];
			
			this._onInit && this._onInit();
			$.each(this.events, function(e, c) {
				rte.bind(e, $.proxy(c, self));
			});
			
			if (this.shortcut) {
				rte.shortcut(this.shortcut, this.name, this.title, function() { return self.exec(); });
			}
			return this;
		}
		
		/**
		 * Method for ui to bind to command change state event
		 *
		 * @param  Function  callback
		 * @return void
		 */
		this.bind = function(c) {
			if (typeof(c) === 'function') {
				this._listeners.push(c);
			}
			return this;
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
		 * Exec command if possible and return if execed
		 *
		 * @param  mixed    command value if available
		 * @return Boolean
		 */
		this.exec = function(v) {
			if (this._state > 0) {
				this.rte.focus();
				this.rte.trigger('exec', {cmd : this.name});
				
				if (v === void(0) && this.dialog) {
					this.dialog();
				} else {
					return !!(this._exec(v) && this.rte.trigger('change'));
				}
			}
			return false;
		}
		
		/**
		 * Update command state
		 *
		 * @return void
		 */
		this.update = function() {
			this._setState(this._getState());
		}
		
		/**
		 * Abstact method to real command action
		 *
		 * @return Boolean
		 */
		this._exec = function() {
			
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
		 * Set command state
		 * If it changed - notify listeners (ui)
		 *
		 * @param  Number  new state
		 * @return void
		 */
		this._setState = function(s) {
			var _s = this._state, 
				_v = this._val, l;
			this._state = s;
			
			this._updValue();
			
			if (this._state != _s || this._val != _v) {
				l = this._listeners.length;
				while (l--) {
					this._listeners[l](this);
				}
			}
		}
		
		this._updValue = function() { }
		
		/**
		 * Editor events to bind
		 *
		 */
		this.events = {
			'wysiwyg change changePos' : this.update,
			'close source' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}
		
	}
	
})(jQuery);