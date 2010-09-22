elRTE.prototype.ui.buttonMenu_ = function(cmd) {
	var ac = 'elrte-ui-active',
		dc = 'elrte-ui-disabled', 
		bc = 'elrte-btn',
		mc = bc + '-menu',
		wn = $.fn['elrte'+cmd.widget] ? 'elrte'+cmd.widget : 'elrtemenu',
		lbl = '',
		wdg = $('<div/>'),
		wrp = $('<div class="'+mc+'-wrp"><div class="'+mc+'-control"/></div>')
		btn = $('<li class="'+bc+' '+bc+'-'+cmd.name+' '+mc+' '+dc+'"/>')
			.append(wrp)
			.append(wdg.hide())
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (cmd.state() > 0) {
					if (wdg.is(':hidden')) {
						wdg.val(cmd.value());
						cmd.rte.trigger('hideUI');
					} 
					wdg.toggle(128);
				}
			}),
		o = {
			label    : cmd.title,
			tpl      : cmd.tpl,
			opts     : cmd.opts,
			callback : function(v) { cmd.exec(v); }
		};
		
	if (cmd._conf.widgetClass) {
		o.cssClass = cmd._conf.widgetClass; 
	}
		
	wdg[wn](o)
		
	cmd.bind(function(c) { 
		// lbl && lbl.text(c.opts[c.value()]||c.title);
		switch (c.state()) {
			case cmd.STATE_DISABLE : btn.removeClass(ac).addClass(dc); break;
			case cmd.STATE_ENABLE  : btn.removeClass(ac+' '+dc);       break;
			case cmd.STATE_ACTIVE  : btn.removeClass(dc).addClass(ac); break;
		}
	})
	.rte.bind('click hideUI', function() {
		wdg.hide();
	});
		
	return btn
}

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
		wrp = $('<div class="'+mc+'-wrp"><div class="'+mc+'-control"/></div>').append(lbl),
		wdg = $('<div/>'), //.elrteWidgetMenu(o),
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
	// cmd.rte.log(o)
	setTimeout(function() {
		// wdg.elrtemenu(o)
		wdg[wn](o)
	}, 20)
			
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



elRTE.prototype.ui.buttonMenu_ = function(cmd) {

	var aclass = 'elrte-ui-active',
		dclass = 'elrte-ui-disabled', 
		
		o = {
			label    : cmd.title,
			tpl      : cmd.tpl,
			opts     : cmd.opts,
			callback : function(v) { cmd.exec(v); }
		},
		label  = $('<span class="elrte-ui-menu-label">'+cmd.title+'</span>'),
		widget = $('<div/>').elrteWidgetMenu(o),
		button = $('<li class="elrte-ui elrte-ui-'+cmd.name+' elrte-ui-menu '+dclass+'"><div class="elrte-ui-menu-control"/></li>')
			.append(label)
			.append(widget.hide())
			.hover(function() {
				!button.hasClass(dclass) && button.toggleClass('elrte-ui-hover');
			})
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (widget.is(':hidden')) {
					widget.val(cmd.value());
					cmd.rte.trigger('hideUI', { cmd : cmd.name});
				} 
				widget.toggle(128);
			})

	cmd.bind(function(c) { 
		label.text(c.opts[c.value()]||c.title);
		switch (c.state()) {
			case cmd.STATE_DISABLE : button.removeClass(aclass).addClass(dclass); break;
			case cmd.STATE_ENABLE  : button.removeClass(aclass+' '+dclass);       break;
			case cmd.STATE_ACTIVE  : button.removeClass(dclass).addClass(aclass); break;
		}
	})
	.rte.bind('click hideUI', function() {
		widget.hide();
	})
	
	return button;
}



