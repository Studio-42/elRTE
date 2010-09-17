(function($) {
	
	// close any menu on document click
	$(document).bind('mousedown', function(e) {
		$('.elrte-ui-menu-container').hide();
	});

	
	/**
	 * @jQuery plugin
	 * Create castomized drop-down menu
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	$.fn.elrtemenu = function(o, rte) {
		
		var self = this,
			aclass   = rte.command.uiActiveClass,
			dclass   = rte.command.uiDisableClass,
			hclass   = rte.command.uiHoverClass,
			val      = [],
			disabled = [],
			o = $.extend({}, $.fn.elrtemenu.defaults, o||{});
		
		rte.bind('click keyup', function() {
			self._menu && self._menu.hide();
		})
		.bind('openMenu', function(e) {
			if (e.data.menu != o.name && self._menu) {
				self._menu.hide();
			}
		});
		
		function init() {
			var mc = 'elrte-ui-menu',
				ic = mc+'-item',
				l, t, s, c;
			
			self._menu = '<div class="elrte-rnd-3 '+mc+'-container"><div class="'+mc+'-inner"><div class="'+mc+'-header">'+o.label+'</div>';
			
			$.each(o.opts, function(v, o) {
				l = o.label;
				s = o.style||'';
				c = o['class']||'';

				self._menu += (t = o.tag)
					? '<div class="'+ic+'" rel="'+v+'"><'+t+' style="'+s+'" class="'+c+'">'+l+'</'+t+'></div>'
					: '<div class="'+ic+' '+c+'" style="'+s+'" rel="'+v+'">'+l+'</div>';
			});

			self._menu = $(self._menu + '</div></div>')
				.hide()
				.appendTo(self)
				.bind('mousedown', function(e) {
					// prevent close menu on click on header and disabled items 
					e.preventDefault();
					e.stopPropagation();
				});
				
			self._items = self._menu.children().children('.'+ic)
				.hover(function() { 
					var t = $(this);
					!t.hasClass(dclass) && t.toggleClass(hclass); 
				})
				.click(function(e) {
					var t = $(this);
					
					if (!t.hasClass(dclass)) {
						self._menu.hide();
						o.callback(t.attr('rel'));
					}
				});
			
		}
		
		this._label = $(this).find('.elrte-ui-menu-label')
		
		$(this).mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (!$(this).hasClass(dclass)) {
				
				!self._menu && init();
	
				if (self._menu.is(':hidden')) {
					self._items.each(function() {
						var t = $(this).removeClass(aclass+' '+dclass), 
							v = t.attr('rel');
							
						if ($.inArray(v, self._disabled) != -1) {
							t.addClass(dclass);
						} else if ($.inArray(v, self._val) != -1) {
							t.addClass(aclass);
						} 
					})
					rte.trigger('openMenu', { menu : o.name });
				} 
				
				self._menu.slideToggle(128);
			}
			rte.focus();
		});
		
		this.val = function(v, d) {
			if (v === void(0)) {
				return this._val;
			} else {
				this._val = v;
				this._disabled = d||[];
				if (this._label.length) {
					v = this._val[0]||'';
					this._label.text(o.opts[v] ? o.opts[v].label : o.label);
				}
			}
		}
		
		return this;
	}

	$.fn.elrtemenu.defaults = {
		name     : '',
		label    : '',
		opts     : {},
		callback : function() { },
		abs	     : false
	}


})(jQuery);