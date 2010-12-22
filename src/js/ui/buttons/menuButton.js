/**
 * jQuery plugin - elRTE button with drop-down menu - decorator for elrtebutton
 *
 * @param  elRTE.command  
 */
$.fn.elrtemenubutton = function(cmd) {
	
	return this.each(function() {
		var title = cmd.title,
			conf  = cmd.conf,
			cols  = parseInt(conf.gridcols),
			menu  = $('<ul class="ui-menu ui-widget ui-widget-content ui-corner-all elrte-menu"/>'),
			html  = '<li class="ui-widget-header ui-corner-all">'+title+'</li>',
			$this = $(this).elrtebutton(cmd)
				.append(menu.hide())
				.append('<span class="ui-state-default ui-corner-right elrte-menu-opener"><span class="ui-icon ui-icon-triangle-1-s"></span></span>'),
			label, items, width;
		
		
		if (conf.text) {
			$this.addClass('elrte-button-menu-text').append((label = $('<span class="elrte-button-text elrte-ellipsis">'+title+'</span>')));
			
			cmd.change(function() {
				label.text(cmd.opts[cmd.value]||title);
			});
		} else {
			$this.addClass('elrte-button-menu');
		}
		
		// close menu on click/keydown outside
		cmd.rte.bind('editorfocus editorblur mousedown keydown', function(e) {
			menu.hide();
		});
		
		/**
		 * Button mousedown event handler
		 * Toggle menu
		 *
		 * @return void
		 **/
		this.click = function(e) {
			var r;
			
			e.stopPropagation();
			e.preventDefault();
			
			if (menu.is(':hidden')) {
				cmd.rte.trigger('editorfocus');
				r = $(window).width() - $this.offset().left - menu.outerWidth() < 0;
				menu.css({
					left  : r ? '' : 0,
					right : r ? 0  : ''
				});
				items.removeClass('ui-state-highlight').filter('[href="#'+(cmd.value||'default')+'"]').addClass('ui-state-highlight');
			}
			menu.slideToggle(128);
		}
			
		// add content to menu
		setTimeout(function() {
			
			tpl = (conf.grid ? conf.gridtpl : '') || conf.tpl || '{label}';
			
			$.each(cmd.opts||[], function(v, l) {
				html += '<li class="ui-menu-item"><a class="ui-corner-all" href="#'+v+'">'+tpl.replace(/\{value\}/g, v).replace(/\{label\}/g, l)+'</a></li>';
			});

			items = menu.html(html)
				.css('top', $this.height()-3)
				.children()
				.children('a')
				.mousedown(function() {
					cmd.exec($(this).attr('href').substr(1));
				});
				
			// if menu is grid set items and menu width
			if (conf.grid && items.length) {
				menu.addClass('elrte-menu-grid').css('left', '-10000px').show();
				width = items.addClass('ui-state-default').width(items.maxWidth()).height(items.maxHeight()).eq(0).outerWidth(true);
				menu.width(width * (cols>0 ? cols : width < 51 ? 3 : 2)).hide();
			}
		}, 50);
			
	});
	
}

