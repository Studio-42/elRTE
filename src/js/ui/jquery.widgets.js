$.fn.elrtemenu = function(o) {
	o = $.extend({}, $.fn.elrtemenu.defaults, o||{});
	var self = this,
		ac   = 'elrte-ui-active',
		mc   = o.cssClass,
		ic   = o.cssClass+'-item',
		s    = o.label ? '<div class="elrte-ui-header">'+o.label+'</div>' : '';
	
	s += '<div class="'+mc+'-wrp">';
	$.each(o.opts, function(v, l) {
		s += '<div class="'+ic+'" name="'+v+'">'+o.tpl.replace(/\{value\}/g, v).replace(/\{label\}/g, l)+'</div>';
	});
	s += '</div>'
	
	this.items = this.addClass(mc)
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.append(s)
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


$.fn.elrtestyleslist = function(o, rte) {
	o = $.extend({}, $.fn.elrtemenu.defaults, o||{});
	var self = this,
		t = $(this),
		opts = o.opts,
		items,
		s = '',
		tmp = {
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
		}, i, v;
		
	rte.log(o.opts)
	
	for (i = 0; i < opts.length; i++) {
		v = opts[i];
		tmp[v.type].html += '<div class="elrte-widget-sidebar-item" name="'+i+'"><span>'+v.name+'</span></div>'
	}
	
	t.html('<div class="elrte-widget-sidebar-item" name="clean">Clean style</div>').addClass('elrte-widget-sidebar')
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			rte.focus();
		})
	
	$.each(tmp, function() {
		if (this.html.length) {
			t.append('<div class="elrte-widget-sidebar-group">'+this.label+'</div>'+this.html)
				
		}
	})
	
	rte.log(tmp)
	
	items = t.children('.elrte-widget-sidebar-group').mousedown(function(e) {
		rte.log(this)
		$(this).nextUntil('.elrte-widget-sidebar-group').toggle()
	}).end().children('.elrte-widget-sidebar-item').mousedown(function() {
		o.callback($(this).attr('name'))
	})
	
	rte.view.appendToSidebar(this)
	
	this.toggle = function() {
		// rte.log(rte.view)
		rte.view.toggleSidebar('Styles', this)
	}
	
	this.hide = function() { }
	
	this.val = function(v) {
		rte.log(v)
	}
	
	return this;
}

$.fn.elrtestyleslist.defaults = {
	label    : '',
	opts     : {},
	callback : function() { }
}





