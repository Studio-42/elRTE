/**
 * @class Create button with menu
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.buttonMenu = function(cmd) {
	var ac = 'elrte-ui-active',
		dc = 'elrte-ui-disabled', 
		bc = 'elrte-btn',
		mc = bc + '-menu',
		o = {
			label    : cmd.title,
			tpl      : cmd.tpl,
			opts     : cmd.opts,
			callback : function(v) { cmd.exec(v); }
		},
		wn = $.fn['elrte'+cmd.widget] ? 'elrte'+cmd.widget : 'elrtemenu',

		lbl = wn == 'elrtemenu' && cmd.conf.label ? $('<div class="'+mc+'-label">'+cmd.title+'</div>') : '',
		wrp = $('<div class="'+mc+'-inner"><div class="'+mc+'-control"/></div>').append(lbl),
		wdg = $('<div/>'), 
		btn = $('<li class="'+bc+' '+bc+'-'+cmd.name+' '+mc+' '+dc+'"></li>')
			.append(wrp)
			.append(wdg.hide())
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (cmd.state()) {
					if (wdg.is(':hidden')) {
						wdg.val(cmd.value());
						cmd.rte.trigger('hideUI');
					} 
					wdg.toggle(128);
				}
			});
	
	if (cmd.widgetClass) {
		o.cssClass = cmd.widgetClass; 
	}

	setTimeout(function() { wdg[wn](o); }, 20);
			
	cmd.bind(function(c) { 
		lbl && lbl.text(c.opts[c.value()]||c.title);
		switch (c.state()) {
			case cmd.STATE_DISABLE : btn.removeClass(ac).addClass(dc); break;
			case cmd.STATE_ENABLE  : btn.removeClass(ac+' '+dc);       break;
			case cmd.STATE_ACTIVE  : btn.removeClass(dc).addClass(ac); break;
		}
	})
	.rte.bind('click hideUI', function() {
		wdg.hide();
	});
	
	return btn;
}

