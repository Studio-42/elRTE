/**
 * @class 
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
// elRTE.prototype.ui.button = function(cmd) {
// 	var ac  = 'elrte-ui-active',
// 		dc  = 'elrte-ui-disabled', 
// 		btn = $('<li class="elrte-btn elrte-btn-'+cmd.name+' '+dc+'"/>')
// 			.mousedown(function(e) {
// 				e.preventDefault();
// 				e.stopPropagation();
// 				cmd.rte.trigger('hideUI').focus();
// 				if (cmd._state > 0) {
// 					cmd.exec();
// 				}
// 			});
// 	
// 	
// 	
// 	cmd.bind(function(c) { 
// 		switch (c.state()) {
// 			case cmd.STATE_DISABLE : btn.removeClass(ac).addClass(dc); break;
// 			case cmd.STATE_ENABLE  : btn.removeClass(ac+' '+dc);       break;
// 			case cmd.STATE_ACTIVE  : btn.removeClass(dc).addClass(ac); break;
// 		}
// 	});
// 	
// 	return btn;
// }

// elRTE.prototype.ui.button = function(cmd, rte) {
// 	var ac  = 'elrte-ui-active',
// 		dc  = 'elrte-ui-disable', 
// 		btn = $('<li class="elrte-btn elrte-btn-'+cmd.name+' '+dc+'"/>')
// 			.hover(function() {
// 				cmd.state() > 0 && $(this).toggleClass('elrte-ui-hover')
// 			}),
// 		wdg, lbl, opts, wn = cmd.conf.widget;
// 	
// 	if (wn) {
// 		
// 		wn = 'elrte'+wn;
// 		wn = $.fn[wn] ? wn : 'elrtemenu';
// 		opts = {
// 			label    : cmd.title,
// 			tpl      : cmd.tpl,
// 			opts     : cmd.opts,
// 			callback : function(v) { cmd.exec(v); }
// 		}
// 		if (cmd.conf.widgetClass) {
// 			opts.cssClass = cmd.conf.widgetClass; 
// 		}
// 		lbl = wn == 'elrtemenu' && cmd.conf.label ? $('<div class="elrte-btn-menu-label">'+cmd.title+'</div>') : '';
// 		btn.addClass('elrte-btn-menu').append($('<div class="elrte-btn-menu-inner"><div class="elrte-btn-menu-control"/></div>').append(lbl));
// 
// 		wdg = $('<div/>')//[wn](opts)
// 		
// 		// setTimeout(function() {
// 			wdg[wn](opts,rte);
// 			if (!wdg.parents().length) {
// 				btn.append(wdg.hide())
// 			}
// 		// }, 20)
// 		
// 		
// 
// 		rte.bind('hideUI', function() {
// 			wdg.hide();
// 		});
// 
// 	} 
// 	
// 	btn.mousedown(function(e) {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		
// 		if (cmd._state > 0) {
// 			if (wdg) {
// 				// rte.log(cmd.name)
// 				if (wdg.is(':hidden')) {
// 					wdg.val(cmd.value());
// 					rte.trigger('hideUI');
// 				} 
// 				wdg.toggle(128);
// 			} else {
// 				rte.trigger('hideUI').focus();
// 				cmd.exec();
// 			}
// 
// 		}
// 	})
// 	
// 	cmd.bind(function(c) { 
// 		lbl && lbl.text(c.opts[c.value()]||c.title);
// 		wdg && wdg.is(':visible') && wdg.val(c.value());
// 		switch (c.state()) {
// 			case cmd.STATE_DISABLE : btn.removeClass(ac).addClass(dc); break;
// 			case cmd.STATE_ENABLE  : btn.removeClass(ac+' '+dc);       break;
// 			case cmd.STATE_ACTIVE  : btn.removeClass(dc).addClass(ac); break;
// 		}
// 	});
// 	
// 	return btn;
// }

elRTE.prototype.ui._button = new function() {
	this.ac  = 'elrte-ui-active';
	this.dc  = 'elrte-ui-disable';
	this.state = 0;
	this.node;
	this.$;
	this.cmd;
	
	this.init = function(cmd) {
		var self = this;
		this.cmd = cmd;
		this.$ = $('<li class="elrte-btn elrte-btn-'+cmd.name+' '+this.dc+'"/>').hover(function() {
			self.state && $(this).toggleClass('elrte-ui-hover')
		})
		this.node = this.$[0]
		
		this.cmd.bind(function() {
			self.update()
		});
		
	}
	
	this.update = function() {
		this.state = this.cmd.state();
		
		switch (this.state) {
			
			case this.cmd.STATE_DISABLE : this.$.removeClass(this.ac).addClass(this.dc); break;
			case this.cmd.STATE_ENABLE  : this.$.removeClass(this.ac+' '+this.dc);       break;
			case this.cmd.STATE_ACTIVE  : this.$.removeClass(this.dc).addClass(this.ac); break;
		}
	}
	
}

elRTE.prototype.ui.button = function(cmd) {

	this.init(cmd)
	
	this.$.mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		cmd.rte.trigger('hideUI').focus();
		if (cmd._state > 0) {
			cmd.exec();
		}
	});

}

elRTE.prototype.ui.button.prototype = elRTE.prototype.ui._button;

elRTE.prototype.ui.menuButton = function(cmd) {
	var self = this;
	this.init(cmd);
	this.label = cmd.conf.label ? $('<span class="elrte-btn-menu-label">'+cmd.title+'</span>') : '';
	
	this.menu = $('<div/>');

	this.$.addClass('elrte-btn-menu')
		.append($('<div class="elrte-btn-menu-inner"><div class="elrte-btn-menu-control"/></div>')
		.append(this.label))
		.append(this.menu.hide())
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (self.state) {
				if (self.menu.is(':hidden')) {
					cmd.rte.trigger('hideUI')
					self.menu.val(cmd.value());
				}
				self.menu.toggle(128);
			}
		});
	
	cmd.rte.bind('hideUI', function() {
		self.menu.hide();
	});
	
	// setTimeout(function() {
		self.menu.elrtemenu({
			label    : cmd.title,
			tpl      : cmd.conf.tpl,
			opts     : cmd.opts,
			callback : function(v) { cmd.exec(v); }
		});
	// }, 20)
	
	this.update = function() {
		var v = this.cmd.value();
		elRTE.prototype.ui._button.update.call(this);
		if (this.label) {
			this.label.text(this.cmd.opts[v] || this.cmd.title);
		}
		this.menu.val(v);
	}
	
}

elRTE.prototype.ui.menuButton.prototype = elRTE.prototype.ui._button;

elRTE.prototype.ui.gridButton = function(cmd) {
	var self = this;
	this.init(cmd);

	this.menu = $('<div/>');

	this.$.addClass('elrte-btn-menu')
		.append($('<div class="elrte-btn-menu-inner"><div class="elrte-btn-menu-control"/></div>')
		.append(this.label))
		.append(this.menu.hide())
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (self.state) {
				if (self.menu.is(':hidden')) {
					cmd.rte.trigger('hideUI')
					self.menu.val(cmd.value());
				}
				self.menu.toggle(128);
			}
		});
		
		cmd.rte.bind('hideUI', function() {
			self.menu.hide();
		});

		// setTimeout(function() {
			self.menu.elrtemenu({
				label    : cmd.title,
				cssClass : 'elrte-ui-widget-grid',
				tpl      : cmd.conf.tpl,
				opts     : cmd.opts,
				callback : function(v) { cmd.exec(v); }
			});
		// }, 10)
}

elRTE.prototype.ui.gridButton.prototype = elRTE.prototype.ui._button;

elRTE.prototype.ui.styleButton = function(cmd) {
	var self = this,
		rte  = cmd.rte,
		c    = 'elrte-widget-sidebar',
		gc   = 'elrte-widget-sidebar-group',
		ic   = 'elrte-widget-sidebar-item',
		html = '',
		tmp  = {
			inline : {
				label : rte.i18n('Inline'),
				html : ''
			},
			block  : {
				label : rte.i18n('Block'),
				html : ''
			},
			table  : {
				label : rte.i18n('Table'),
				html : ''
			},
			obj    : {
				label : rte.i18n('Objects'),
				html : ''
			}
		}, i;
		
	this.init(cmd);
	
	this.menu = $('<div class="'+c+'"/>');
	rte.view.appendToSidebar(this.menu);
	
	this.$.mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (self.state) {
			rte.trigger('hideUI')
			rte.view.toggleSidebar('style', self.menu);
			if (self.menu.is(':visible')) {
				self.$.addClass(self.ac);
				self._update();
			} else {
				self.$.removeClass(self.ac);
			}
		}
	});
	
	// setTimeout(function() {
		html += '<div class="'+ic+'" name="clean">Clean style</div>';
		for (i = 0; i < cmd.opts.length; i++) {
			v = cmd.opts[i];
			tmp[v.type].html += '<div class="'+ic+'" name="'+i+'"><span'+(v.style ? ' style="'+v.style+'"' : (v['class'] ? ' class="'+v['class']+'"' : '') )+'>'+v.name+'</span></div>'
		}
		
		$.each(tmp, function() {
			if (this.html.length) {
				html += '<div class="'+gc+'">'+this.label+'</div>'+this.html;
			}
		});
		delete tmp;
		self.items = self.menu.html(html).children('.'+ic).mousedown(function(e) {
			var t = $(this);
			!t.hasClass(self.dc) && cmd.exec($(this).attr('name'));
		});
		self.menu.children('.'+gc).mousedown(function(e) {
			$(this).nextUntil('.'+gc).toggle();
		})
	// }, 20)
	
	this._update = function() {
		var v = this.cmd.value(),
			d = this.cmd.disabled;

		$.each(this.items.removeClass(this.ac+' '+this.dc), function(i, n) {
			var t = $(this), 
				name = parseInt(t.attr('name'));
			
			if ($.inArray(name, d) != -1) {
				t.addClass(self.dc)
			} else if ($.inArray(name, v) != -1) {
				t.addClass(self.ac);
			}
		});
		// disable clean if no active styles
		if (!v.length) {
			this.items.filter('[name="clean"]').addClass(this.dc);
		}
	}
	
	this.update = function() {
		elRTE.prototype.ui._button.update.call(this);
		
		if (this.menu.is(':visible')) {
			this.state == this.cmd.STATE_DISABLE ? this.cmd.rte.view.hideSidebar() : this._update();
		}
	}
	
}

elRTE.prototype.ui.styleButton.prototype = elRTE.prototype.ui._button;




