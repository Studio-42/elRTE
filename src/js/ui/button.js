/**
 * @class 
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.button = function(cmd) {
	var ac  = 'elrte-ui-active',
		dc  = 'elrte-ui-disabled', 
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

elRTE.prototype.ui.toolbarButton = function(cmd, rte) {
	var ac  = 'elrte-ui-active',
		dc  = 'elrte-ui-disable', 
		btn = $('<li class="elrte-btn elrte-btn-'+cmd.name+' '+dc+'"/>')
			.hover(function() {
				cmd.state() > 0 && $(this).toggleClass('elrte-ui-hover')
			}),
		wdg, lbl, opts, wn = cmd.conf.widget;
	
	if (wn) {
		
		wn = 'elrte'+wn;
		wn = $.fn[wn] ? wn : 'elrtemenu';
		opts = {
			label    : cmd.title,
			tpl      : cmd.tpl,
			opts     : cmd.opts,
			callback : function(v) { cmd.exec(v); }
		}
		if (cmd.conf.widgetClass) {
			opts.cssClass = cmd.conf.widgetClass; 
		}
		lbl = wn == 'elrtemenu' && cmd.conf.label ? $('<div class="elrte-btn-menu-label">'+cmd.title+'</div>') : '';
		btn.addClass('elrte-btn-menu').append($('<div class="elrte-btn-menu-inner"><div class="elrte-btn-menu-control"/></div>').append(lbl));

		wdg = $('<div/>')//[wn](opts)
		
		// setTimeout(function() {
			wdg[wn](opts,rte);
			if (!wdg.parents().length) {
				btn.append(wdg.hide())
			}
		// }, 20)
		
		

		rte.bind('hideUI', function() {
			wdg.hide();
		});

	} 
	
	btn.mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		if (cmd._state > 0) {
			if (wdg) {
				// rte.log(cmd.name)
				if (wdg.is(':hidden')) {
					wdg.val(cmd.value());
					rte.trigger('hideUI');
				} 
				wdg.toggle(128);
			} else {
				rte.trigger('hideUI').focus();
				cmd.exec();
			}

		}
	})
	
	cmd.bind(function(c) { 
		lbl && lbl.text(c.opts[c.value()]||c.title);
		wdg && wdg.is(':visible') && wdg.val(c.value());
		switch (c.state()) {
			case cmd.STATE_DISABLE : btn.removeClass(ac).addClass(dc); break;
			case cmd.STATE_ENABLE  : btn.removeClass(ac+' '+dc);       break;
			case cmd.STATE_ACTIVE  : btn.removeClass(dc).addClass(ac); break;
		}
	});
	
	return btn;
}

elRTE.prototype.ui._button = new function() {
	this.ac  = 'elrte-ui-active';
	this.dc  = 'elrte-ui-disabled';
	this.state = 0;
	this.node;
	this.$;
	this.cmd;
	
	this.init = function(cmd) {
		var self = this;
		this.cmd = cmd;
		this.$ = $('<li class="elrte-btn elrte-btn-'+cmd.name+' '+this.dc+'"/>').hover(function() {
			$(this).toggleClass('elrte-ui-hover')
		})
		this.node = this.$[0]
		
		this.cmd.bind(function() {
			self.update()
		});
		
	}
	
	this.update = function() {
		switch (this.cmd.state()) {
			case this.cmd.STATE_DISABLE : this.$.removeClass(this.ac).addClass(this.dc); break;
			case this.cmd.STATE_ENABLE  : this.$.removeClass(this.ac+' '+this.dc);       break;
			case this.cmd.STATE_ACTIVE  : this.$.removeClass(this.dc).addClass(this.ac); break;
		}
	}
	
}

elRTE.prototype.ui.testButton = function(cmd) {

	this.init(cmd)
	cmd.rte.log(this.cmd)
	
	this.$.mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		cmd.rte.trigger('hideUI').focus();
		if (cmd._state > 0) {
			cmd.exec();
		}
	});
	// this.constructor.prototype.init.call(this, cmd)
}

elRTE.prototype.ui.testButton.prototype = elRTE.prototype.ui._button;