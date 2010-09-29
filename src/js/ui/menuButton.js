/**
 * @class Button with menu
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.menuButton = function(cmd) {
	var self = this,
		o = {
			label    : cmd.title,
			tpl      : cmd.conf.tpl,
			opts     : cmd.opts,
			callback : function(v) { cmd.exec(v); }
		};
	if (cmd.conf.uiClass) {
		o.cssClass = cmd.conf.uiClass;
	}
		
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

	setTimeout(function() {
		self.menu.elrtemenu(o);
	}, 20);

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

$.fn.elrtemenu = function(o) {
	o = $.extend({}, $.fn.elrtemenu.defaults, o||{});
	var self = this,
		ac   = 'elrte-ui-active',
		mc   = o.cssClass,
		ic   = o.cssClass+'-item',
		s    = (o.label ? '<div class="elrte-ui-header">'+o.label+'</div>' : '')+'<div class="'+mc+'-wrp">';
	
	$.each(o.opts, function(v, l) {
		s += '<div class="'+ic+'" name="'+v+'">'+o.tpl.replace(/\{value\}/g, v).replace(/\{label\}/g, l)+'</div>';
	});
	
	this.items = this.addClass(mc)
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.append(s+'</div>')
		.find('.'+ic)
		.hover(function() {
			$(this).toggleClass('elrte-ui-hover');
		})
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			self.hide();
			o.callback($(this).attr('name'));
		});
	
	this.val = function(v) {
		this.items.removeClass(ac).filter('[name="'+v+'"]').addClass(ac);
	}

	return this;
}


$.fn.elrtemenu.defaults = {
	label    : '',
	cssClass : 'elrte-ui-widget-menu',
	tpl      : '{label}',
	opts     : {},
	callback : function() { }
}


