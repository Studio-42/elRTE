(function($) {
	
	// close any menu on document click
	$(document).bind('click', function(e) {
		$('.elrte-ui-menu-container').hide();
	});

	/**
	 * @class elRTE ui menu.
	 * Create castomized drop-down menu
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.menu = function(o, rte) {
		var self         = this,
			activeClass  = rte.command.uiActiveClass,
			disableClass = rte.command.uiDisableClass,
			hoverClass   = rte.command.uiHoverClass;
			
		o = $.extend({
			name     : 'menu',
			label    : 'Select',
			opts     : {},
			callback : function() {}
		}, o||{});
		
		// ui name	
		this.name  = o.name;
		// default text
		this.label = o.label;
		// options
		this.opts = o.opts;
		// callback
		this.cb = o.callback;
		// curent values (active options)
		this._val = [];
		// disabled options
		this._disabled = [];
		
		
		
		// @TODO move into elRTE ?
		rte.bind('click keyup', function() {
			self._menu && self._menu.hide();
		});
		
		rte.bind('openMenu', function(e) {
			if (e.data.menu != self.opts.name && self._menu) {
				self._menu.hide()
			}
		})
		
		// menu content
		this._menu; 
		// selected element text container
		this._label = $('<div class="elrte-ui-menu-label">'+this.label+'</div>');
		// control element
		this.ui = $('<li class="elrte-ui elrte-ui-menu elrte-ui-'+this.name+'" />')
			.append('<div class="elrte-ui-menu-control"/>')
			.append(this._label)
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				if (!$(this).hasClass(disableClass)) {
					
					!self._menu && self.init();

					if (!self._menu.is(':visible')) {
						
						self._items.each(function() {
							var t = $(this), 
								v = t.attr('rel');
								
							t.removeClass(activeClass+' '+disableClass);
							if ($.inArray(v, self._disabled) != -1) {
								t.addClass(disableClass);
							} else if ($.inArray(v, self._val) != -1) {
								t.addClass(activeClass);
							} 
						})
						rte.trigger('openMenu', { menu : self.opts.name });
					} 
					self._menu.slideToggle(256);
				}
				rte.focus();
			});

		/**
		 * Create menu
		 * @return void
		 **/
		this.init = function() {
			var self = this,
				cl = 'elrte-ui-menu',
				headerClass = cl+'-header',
				itemClass = cl+'-item',
				m = '<div class="elrte-rnd-3 '+cl+'-container"><div class="'+cl+'-inner"><div class="'+headerClass+'">'+this.label+'</div>', 
				cb = this.cb, l, t, s, c;

			$.each(this.opts, function(v, o) {
				l = o.label;
				s = o.style||'';
				c = o['class']||'';
				m += (t = o.tag)
					? '<div class="'+itemClass+'" rel="'+v+'"><'+t+' style="'+s+'" class="'+c+'">'+l+'</'+t+'></div>'
					: '<div class="'+itemClass+' '+c+'" style="'+s+'" rel="'+v+'">'+l+'</div>';

			});
			
			this._menu = $(m + '</div></div>')
				.hide()
				.appendTo(self.ui)
				.bind('mousedown click', function(e) {
					// prevent close menu on click on header and disabled items 
					e.preventDefault();
					e.stopPropagation();
				});
				
			this._items = this._menu.children().children('.'+itemClass)
				.hover(function() { 
					var t = $(this);

					if (!t.hasClass(disableClass)) {
						t.toggleClass(hoverClass); 
					}
				})
				.click(function(e) {
					var t = $(this);
					
					if (!t.hasClass(disableClass)) {
						self._menu.hide();
						cb(t.attr('rel'));
					}
				});
		}
		
		/**
		 * Set active (selected) and disabled items and update control text
		 * @param  String|Array  active items
		 * @param  Array         disabled items
		 * @return void
		 **/
		this.set = function(v, d) {
			var o = this.opts;
			
			this._val = v;
			v = this._val[0]||'';
			this._label.text(o[v] ? o[v].label : this.label);
			this._disabled = d||[];
		}
		
	}

})(jQuery);