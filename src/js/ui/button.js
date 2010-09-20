(function($) {

	/**
	 * @class 
	 * 
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.button = function(cmd) {
		// @TODO move hover into elrte.view?
		var aclass = 'elrte-ui-active',
			dclass = 'elrte-ui-disabled', 
			button = $('<li class="elrte-ui elrte-ui-'+cmd.name+' '+dclass+'"/>')
				.hover(function() {
					!button.hasClass(dclass) && button.toggleClass('elrte-ui-hover');
				})
				.mousedown(function(e) {
					e.preventDefault();
					e.stopPropagation();
					cmd.rte.focus();
					if (cmd._state > 0) {
						cmd.exec();
					}
				});
		
		cmd.bind(function(c) { 
			switch (c.state()) {
				case cmd.STATE_DISABLE : button.removeClass(aclass).addClass(dclass); break;
				case cmd.STATE_ENABLE  : button.removeClass(aclass+' '+dclass);       break;
				case cmd.STATE_ACTIVE  : button.removeClass(dclass).addClass(aclass); break;
			}
		});
		
		return button;
	}

})(jQuery);