/**
 * @class 
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.button = function(cmd) {
	// @TODO move hover into elrte.view?
	var ac = 'elrte-ui-active',
		dc = 'elrte-ui-disabled', 
		btn = $('<li class="elrte-btn elrte-btn-'+cmd.name+' '+dc+'"/>')
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				cmd.rte.trigger('hideUI').focus();
				if (cmd._state > 0) {
					cmd.exec();
				}
			});
	
	cmd.bind(function(c) { 
		switch (c.state()) {
			case cmd.STATE_DISABLE : btn.removeClass(ac).addClass(dc); break;
			case cmd.STATE_ENABLE  : btn.removeClass(ac+' '+dc);       break;
			case cmd.STATE_ACTIVE  : btn.removeClass(dc).addClass(ac); break;
		}
	});
	
	return btn;
}

