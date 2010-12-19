/**
 * jQuery plugin - elRTE button with drop-down menu - decorator for elrtebutton
 *
 * @param  elRTE.command  
 */
$.fn.elrtemenubutton = function(cmd) {

	return this.each(function() {
		var title = cmd.title,
			conf  = cmd.conf,
			grid  = cmd.conf.menu == 'grid',
			ic    = 'elrte-widget-menu-item ' + (grid ? 'ui-state-default' : ''),
			menu  = $('<div class="ui-widget ui-corner-all elrte-widget-menu elrte-widget-menu-'+(grid ? 'grid' : 'default')+'"/>'),
			$this = $(this).elrtebutton(cmd)
				.addClass('elrte-btn-menu')
				.append(menu.hide())
				.prepend('<div class="ui-state-default ui-corner-right elrte-btn-menu-control" />'),
			inner = $this.children('.elrte-btn-inner').addClass('ui-corner-left'),
			html  = '<div class="ui-widget-header">'+title+'</div><div class="ui-widget-content ui-corner-bottom">',
			items;
				
		if (conf.uilabel && !grid) {
			$this.addClass('elrte-btn-menu-labeled');
			inner.text(title);
			cmd.change(function() {
				inner.text(cmd.opts[cmd.value]||title);
			});
		}
		
		setTimeout(function() {
			$.each(cmd.opts||[], function(v, l) {
				html += '<div class="'+ic+'" name="'+v+'">'+conf.uitpl.replace(/\{value\}/g, v).replace(/\{label\}/g, l)+'</div>';
			});
			items = menu.html(html+'<div class="ui-helper-clearfix"/></div>')
				.children(':last')
				.children()
				.hover(function() {
					$(this).toggleClass('ui-state-hover');
				})
				.mousedown(function(e) {
					cmd.exec($(this).attr('name'));
				});
		}, 50);
		
		cmd.rte.bind('editorfocus editorblur mousedown keydown', function(e) {
			menu.hide();
		});	

		
		this.click = function(e) {
			var l = '', r = '';
			
			e.stopPropagation();
			e.preventDefault();
			
			if (menu.is(':hidden')) {
				cmd.rte.trigger('editorfocus');
				if ($(window).width() - $this.offset().left - menu.outerWidth() < 0) {
					r = '0';
				} else {
					l = '0';
				}
				menu.css({
					left : l,
					right : r
				})
				items.removeClass('ui-state-highlight').filter('[name="'+(cmd.value||'default')+'"]').addClass('ui-state-highlight');
			}
			menu.toggle(128);
		}
		
	});
}

