(function($) {
	

	/**
	 * @class elRTE command.
	 * Change font size
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.fontsize = function() {
		this.title = 'Font size';
		this._val  = '';
		this._css  = 'font-size';
		this._opts = {
			'default'  : 'Default',
			'xx-small' : 'Small (8pt)',
			'x-small'  : 'Small (10pt)',
			'small'    : 'Small (12pt)',
			'medium'   : 'Normal (14pt)',
			'large'    : 'Large (18pt)',
			'x-large'  : 'Large (24pt)',
			'xx-large' : 'Large (36pt)'
		};
		
		this._exec = $.proxy(elRTE.prototype.mixins.font.exec, this);
		
		this._createUI = $.proxy(elRTE.prototype.mixins.font.ui, this);
		
		this._setVal = $.proxy(elRTE.prototype.mixins.font.val, this);
		
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
			
			return this._opts[v] ? v : size2abs(v);
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	

	
})(jQuery);