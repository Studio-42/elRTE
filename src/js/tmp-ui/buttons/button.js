
$.fn.elrtebutton = function(cmd) {
	
	return this.each(function() {
		var self  = this,
			t = $(self),
			// base button class
			c  = 'elrte-btn',
			// active button class
			ac = 'elrte-active',
			// disabled button class
			dc = 'elrte-disable',
			// hover button class
			hc = 'elrte-hover';

		// cached command state
		this.state = 0;
		// command to which this button binded
		this.cmd = cmd;
		
		/**
		 * Button mousedown event handler
		 * @return void
		 **/
		this.click = function() {
			cmd.exec();
		}
		
		// bind to command update event
		this.cmd.bind(function() {
			switch ((self.state = self.cmd.state())) {
				case cmd.STATE_DISABLE : t.removeClass(ac).addClass(dc); break;
				case cmd.STATE_ENABLE  : t.removeClass(ac+' '+dc);       break;
				case cmd.STATE_ACTIVE  : t.removeClass(dc).addClass(ac); 
			}
		});
		
		t.addClass('elrte-ib elrte-rnd '+c+' '+c+'-'+cmd.name)
			.mousedown(function(e) {
				e.preventDefault();
				self.click();
			})
			.hover(function() {
				self.state && t.toggleClass(hc);
			})
			.append('<div class="'+c+'-inner" title="'+cmd.title+'"/>');
	});
	
}



$.fn.elrtebuttonmenu = function(cmd) {
	return this.each(function() {
		var self  = this,
			t     = $(this),
			c     = 'elrte-btn-menu',
			ac    = 'elrte-active',
			wc    = 'elrte-widget',
			mc    = 'elrte-widget-menu',
			title = cmd.title,
			conf  = cmd.conf,
			label = conf.label ? $('<div class="'+c+'-label">'+title+'</div>') : '',
			menu  = $('<div class="'+mc+' '+(conf.grid ? wc+'-grid' : '')+'"/>'),
			tmp   = '<div class="elrte-widget-header">'+title+'</div><div class="elrte-widget-menu-inner">',
			items;
			
		// update label text and menu selected item
		cmd.bind(function() {
			label && label.text(cmd.opts[cmd.value()]||title);
		});
			
		// append button content
		t.elrtebutton(cmd)
			.addClass(c)
			.append(menu.hide())
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (self.state) {
					menu.is(':hidden') && items.removeClass(ac).filter('[name="'+cmd.value()+'"]').addClass(ac);
					menu.toggle(128);
				}
			})
			.children().eq(0)
			.append('<div class="'+c+'-control" />')
			.append(label);
		
		// set menu content and bind events
		setTimeout(function() {
			$.each(cmd.opts, function(v, l) {
				tmp += '<div class="elrte-widget-menu-item" name="'+v+'">'+conf.tpl.replace(/\{value\}/g, v).replace(/\{label\}/g, l)+'</div>';
			});
			
			items = menu.attr('title', '')
				.mousedown(function(e) {
					e.preventDefault();
					e.stopPropagation();
				})
				.append(tmp+'</div>')
				.children().eq(1).children()
				.hover(function() {
					$(this).toggleClass('elrte-hover');
				})
				.mousedown(function() {
					t.mousedown();
					cmd.exec($(this).attr('name'));
				});
			
		}, 20);
		
	});
}

