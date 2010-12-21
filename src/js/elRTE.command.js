/**
 * @class Commands prototype
 * Initilized by editor instance
 *
 * @param  elRTE editor instance
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.command = function(rte) {

	/**
	 * Short command description for button title
	 * 
	 * @type String
	 */
	this.title = '';
	
	/**
	 * Command author
	 * 
	 * @type String
	 */
	this.author = 'Dmitry (dio) Levashov, dio@std42.ru';
	
	/**
	 * Editor instance
	 * 
	 * @type elRTE
	 */
	this.rte = rte;

	/**
	 * DOM manipulations object
	 * 
	 * @type elRTE.DOM
	 */
	this.dom = rte.dom;

	/**
	 * Selection/textrange manipulations object
	 * 
	 * @type elRTE.Selection
	 */
	this.sel = rte.selection;
	
	/**
	 * Object contains misc utilites
	 * 
	 * @type elRTE.utils
	 */
	this.utils = rte.utils;

	/**
	 * Current command state
	 * 
	 * @type    Number
	 * @default elRTE.CMD_STATE_DISABLED
	 */
	this.state = elRTE.CMD_STATE_DISABLED;
	
	/**
	 * Current command value
	 * 
	 * @type    mixed
	 * @default undefined
	 */
	this.value;
	
	/**
	 * Command configuration
	 * 
	 * @type    Object
	 * @default {}
	 */
	this.conf = { };
	
	/**
	 * Events handlers
	 * 
	 * @type Object
	 */
	this.events = {
		'wysiwyg change changepos' : function(e) { this.update(); },
		'close source'             : function(e) { e.data.id == this.rte.active.id && this.update(elRTE.CMD_STATE_DISABLED); }
	}
	
	/**
	 * Initilize command
	 *
	 * @return elRTE.command
	 */
	this.init = function(conf) {
		var self = this;
			
		this.title      = rte.i18n(this.title);
		this.conf       = $.extend({ ui : 'button' }, this.conf, conf);
		this._listeners = [];
		
		this._init && this._init();
		
		$.each(this.events, function(e, c) {
			rte.bind(e, $.proxy(c, self));
		});
		
		if (this.shortcut) {
			rte.shortcut(this.shortcut, this.name, this.title, function() { return self.exec(); });
		}
		return this;
	}
	
	/**
	 * Without argument - notify listeners,
	 * With argument of type function - add new listener
	 *
	 * @param  Function  callback
	 * @return elRTE.command
	 */
	this.change = function(c) {
		var l = this._listeners.length;
		
		if (c === void(0)) {
			while (l--) {
				this._listeners[l](this);
			}
		} else if (typeof(c) === 'function') {
			this._listeners.push(c);
		}
		return this;
	}
	
	/**
	 * Update command state/value
	 *
	 * @param  Number   new command state or undefined to detect state
	 * @return elRTE.command
	 */
	this.update = function(state) {
		var s = this.state, 
			v = this.value;
		
		this.state = state === void(0) ? this._state() : state;
		
		if (this.state != elRTE.CMD_STATE_DISABLED) {
			this.value = this._value();
		}
		
		if (this.state != s || this.value != v) {
			this.change();
		}
		return this;
	}
	
	/**
	 * Exec command if allowed
	 *
	 * @param  mixed    command value 
	 * @return Boolean
	 */
	this.exec = function(v) {
		if (this.state != elRTE.CMD_STATE_DISABLED) {
			this.rte.focus().trigger('exec', {cmd : this.name});
			
			if (v === void(0) && this.dialog) {
				this.dialog();
			} else if (this._exec(v)) {
				return !!this.rte.trigger('change');
			}
		}
		return false;
	}
	
	/**
	 * Detect and return command state
	 *
	 * @return Number
	 */
	this._state = function(s) {
		return elRTE.CMD_STATE_DISABLE;
	}
	
	/**
	 * Detect and return command value
	 *
	 * @return mixed
	 */
	this._value = function() { }
	
}
	
