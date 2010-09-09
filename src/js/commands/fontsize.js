(function($) {
	
	/**
	 * @class elRTE command.
	 * Change font size
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.fontsize = function() {
		this.title = 'Font size';
		
		
		this._createUI = function() {
			var self = this,
				i18n = self.rte.i18n,
				o = {
					name : this.name,
					label : this.rte.i18n('Font size'),
					callback : function(v) { self.rte.log(v) },
					vars : {
						'xx-small' : { style : 'font-size: xx-small', label : this.rte.i18n('Small')+' (8pt)' },
						'x-small' : { style : 'font-size: x-small', label : this.rte.i18n('Small')+' (10pt)' },
						'small' : { style : 'font-size: small', label : this.rte.i18n('Small')+' (12pt)' },
						'medium' : { style : 'font-size: medium', label : this.rte.i18n('Normal')+' (14pt)' },
						'large' : { style : 'font-size: large', label : this.rte.i18n('Large')+' (18pt)' },
						'x-large' : { style : 'font-size: x-large', label : this.rte.i18n('Large')+' (24pt)' },
						'xx-large' : { style : 'font-size: xx-large', label : this.rte.i18n('Large')+' (36pt)' },
					}
				};
			
			this._menu = new this.rte.ui.menu(o, this.rte)
			return this._ui = this._menu.ui
		}
		

		this._getState = function() {
			var dom = this.dom,
				n = dom.closestParent(this.sel.node(), function(n) {
				return dom.css(n, 'font-size')
			});
			this._menu.set(n ? dom.css(n, 'font-size') : '')
			return this.STATE_ENABLE;
		}
	}
	
})(jQuery);