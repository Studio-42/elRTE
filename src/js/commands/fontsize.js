/**
 * @class elRTE command.
 * Change font size
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.fontsize = function() {
	var s = this.rte.i18n('Small'),
		l = this.rte.i18n('Large');
		
	this.title = 'Font size';
	this.value = '';
	this.css   = 'font-size';
	this.conf  = { 
		ui      : 'menu', 
		text : true,
		grid : true, 
		tpl   : '<span style="font-size:{value}">{label}</span>',
		gridtpl : '{label}',
		gridcols : 2
	};
	this.opts  = {
		'default'  : this.rte.i18n('Default'),
		'xx-small' : s + ' (8pt)',
		'x-small'  : s + ' (10pt)',
		'small'    : s + ' (12pt)',
		'medium'   : this.rte.i18n('Normal (14pt)'),
		'large'    : l + ' (18pt)',
		'x-large'  : l + ' (24pt)',
		'xx-large' : l + ' (36pt)'
	};
	
	this.test   = $.proxy(elRTE.prototype.mixins.font.test,   this);
	this.unwrap = $.proxy(elRTE.prototype.mixins.font.unwrap, this);
	this._exec  = $.proxy(elRTE.prototype.mixins.font.exec,   this);
	this._value = $.proxy(elRTE.prototype.mixins.font.value,  this);
	
	/**
	 * Translate font-size in px|pt|% into absolute value
	 * 
	 * @param  String  css font-size value
	 * @return String
	 **/
	this._parseVal = function(v) {
		var x = 100;
		
		function size2abs(s) {
			var x = 100;
			if (s.indexOf('pt') != -1) {
				x = 12;
			} else if (s.indexOf('px') != -1) {
				x = 16;
			} else if (s.indexOf('em') != -1) {
				x = 1;
			}
			s = Math.round((100*parseFloat(s, 1)/x)/10)*10;
			
			if (s > 0) {
				if (s <= 70) {
					return 'xx-small';
				}
				if (s <= 80) {
					return 'x-small';
				}
				if (s <= 100) {
					return 'small';
				}
				if (s <= 120) {
					return 'medium';
				}
				if (s <= 150) {
					return 'large';
				}
				if (s <= 200) {
					return 'x-large';
				}
				if (s > 200) {
					return 'xx-large';
				}
			}
			
			return '';
		}
		
		return this.opts[v] ? v : size2abs(v);
	}
	
	this._state = function() {
		return elRTE.CMD_STATE_ENABLED;
	}
}
	
