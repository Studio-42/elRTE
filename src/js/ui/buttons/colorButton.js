$.fn.elrtecolorbutton = function(cmd) {
	
	return this.each(function() {
		var self   = this,
			color  = '',
			colors = [
				'#800000', '#8b4513', '#006400', '#2f4f4f', '#000080', '#4b0082', '#800080', '#000000', 
				'#ff0000', '#daa520', '#6b8e23', '#708090', '#0000cd', '#483d8b', '#c71585', '#696969',
				'#ff4500', '#ffa500', '#808000', '#4682b4', '#1e90ff', '#9400d3', '#ff1493', '#a9a9a9',
				'#ff6347', '#ffd700', '#32cd32', '#87ceeb', '#00bfff', '#9370db', '#ff69b4', '#dcdcdc',
				'#ffdab9', '#ffffe0', '#98fb98', '#e0ffff', '#87cefa', '#e6e6fa', '#dda0dd', '#ffffff'
			],
			menu = $('<div class="ui-widget ui-widget-content ui-corner-all elrte-menu elrte-menu-color"/>'),
			html = '<div class="ui-widget-header ui-corner-all">'+cmd.title+'</div>'
				+ '<div class="ui-widget ui-state-default ui-corner-all ui-helper-clearfix elrte-menu-color-button"><span class="elrte-menu-color-auto"/>'+cmd.rte.i18n('Automatic')+'</div>'
				+ '<div class="ui-helper-clearfix elrte-menu-color-palete">',
			arrow = $('<span class="ui-state-default ui-corner-right elrte-menu-opener"><span class="ui-icon ui-icon-triangle-1-s"></span></span>')
				.mousedown(function(e) {
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
						if (!init) {
							init = true;
							auto.css('background-color', color);
						}
					}
					menu.slideToggle(128);
				}),
			ind   = $('<span class="elrte-button-color-indicator"/>'),
			$this = $(this).elrtebutton(cmd)
				.addClass('elrte-button-menu')
				.append(ind)
				.append(arrow)
				.append(menu.hide()),
			init = false,
			set  = function(c) {
				color = c;
				ind.css('background', c);
			},
			auto, i, p;
				
				
		setTimeout(function() {
			$.each(colors, function(i, c) {
				html += '<a href="'+c+'" style="background-color:'+c+'" />'
			})

			p = menu.html(html + '</div><div class="ui-widget ui-state-default ui-corner-all elrte-menu-color-button">'+cmd.rte.i18n('More colors')+'...</div>')
				.css('top', $this.height()-3)
				.children('.elrte-menu-color-palete');
				
			i = p.children('a')
				.mousedown(function(e) {
					set($(this).attr('href'));
				})
				.hover(function(e) { 
					var $this = $(this),
						css   = '', c;

					if (e.type == 'mouseenter') {
						c   = $this.attr('href');
						css = '1px solid '+(c == '#ffffff' ? '#ccc' : c);
					}
					$this.css('outline', css);
				})
				.eq(0);
				
			p.width((i.outerWidth() + parseInt(i.css('margin-left'))*2)*8);

			auto = menu.children().eq(1).children(':first');


			menu.children('.elrte-menu-color-button')
				.add(arrow)
				.hover(function() {
					$(this).toggleClass('ui-state-hover');
				})
				.end().eq(0)
				.mousedown(function() {
					set(cmd.value);
				})
				.end().eq(1)
				.mousedown(function(e) {
					e.stopPropagation();
					var opts = {
						title : cmd.title,
						modal : true,
						width : 320,
						color : color,
						callback : function(c) {
							set(c);
							self.click();
						}
					}
					var d = cmd.rte.ui.dialogs.color(cmd.rte, opts)
				});
		}, 50);
				
			
		cmd.change(function() {
			set(cmd.value);
		});
		
		// close menu on click/keydown outside
		cmd.rte.bind('editorfocus editorblur mousedown keydown', function() {
			menu.hide();
		});
		
		this.click = function() {
			cmd.rte.focus();
			cmd.exec(color);
		}
		
	})
	
	
	
}