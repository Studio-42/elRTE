/**
 * jQuery plugin - elRTE button with drop-down menu - decorator for elrtebutton
 *
 * @param  elRTE.command  
 */
$.fn.elrtemenubutton = function(cmd) {

	return this.each(function() {
		var self  = this,
			$this = $(this),
			c     = 'elrte-btn-menu',
			ac    = 'elrte-active',
			wc    = 'elrte-widget',
			mc    = 'elrte-widget-menu',
			title = cmd.title,
			conf  = cmd.conf,
			label = conf.label ? $('<div class="'+c+'-label elrte-rnd-left">'+title+'</div>') : '',
			menu  = $('<div class="'+mc+' '+(conf.grid ? wc+'-grid' : '')+'"/>'),
			tmp   = '<div class="elrte-widget-header">'+title+'</div><div class="elrte-widget-menu-inner">',
			items;
			
		// update label text and menu selected item
		cmd.bind(function() {
			label && label.text(cmd.opts[cmd.value()]||title);
		});
			
		// append button content
		$this.elrtebutton(cmd)
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
			.append('<div class="'+c+'-control elrte-rnd-right" />')
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
					$this.mousedown();
					cmd.exec($(this).attr('name'));
				});
			
		}, 20);
		
	});
}

