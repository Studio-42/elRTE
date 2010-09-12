(function($) {
	
	// close any menu on document click
	$(document).bind('click', function(e) {
		// $('.elrte-ui-menu-container').hide();
	});

	/**
	 * @class elRTE ui menu.
	 * Create castomized drop-down menu
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.menu = function(o, rte) {
		var self = this,
			aclass = rte.uiActiveClass,
			dclass = rte.uiDisableClass;
		// curent value
		this._val = [];
		this._disabled = [];
		
		this.name = o.name||'menu';
		this.label = o.label||'Select';
		this.opts  = o.opts||{};
		this.cb    = o.callback||function() {}
		
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
				
				if (!$(this).hasClass(dclass)) {
					
					!self._menu && self.init();

					if (!self._menu.is(':visible')) {
						
						self._items.each(function() {
							var t = $(this), 
								v = t.attr('rel');
								
							t.removeClass(aclass+' '+dclass)
							if ($.inArray(v, self._disabled) != -1) {
								t.addClass(dclass);
							} else if ($.inArray(v, self._val) != -1) {
								t.addClass(aclass);
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
				m = '<div class="elrte-rnd-3 elrte-ui-menu-container"><div class="elrte-ui-menu-inner">', 
				cb = this.cb, l, t, s, c;

			m += '<div class="elrte-ui-menu-header">'+this.label+'</div>'

			$.each(this.opts, function(v, o) {
				l = o.label;
				s = o.style||'';
				c = o['class']||'';
				m += (t = o.tag)
					? '<div class="elrte-ui-menu-item" rel="'+v+'"><'+t+' style="'+s+'" class="'+c+'">'+l+'</'+t+'></div>'
					: '<div class="elrte-ui-menu-item '+c+'" style="'+s+'" rel="'+v+'">'+l+'</div>';

			});
			
			this._menu = $(m + '</div></div>')
				.hide()
				.appendTo(self.ui)
				.mousedown(function(e) { 
					// stop click on scroller
					e.preventDefault();
					e.stopPropagation();
					// rte.log('menu click')
				});
				
			this._items = this._menu.children().children('.elrte-ui-menu-item')
				.hover(function() { 
					var t = $(this);
					if (!t.hasClass(dclass)) {
						t.toggleClass(rte.uiHoverClass); 
					}
					
				})
				.mousedown(function(e) {
					var t = $(this);
					if (!t.hasClass(dclass)) {
						self._menu.hide()
						cb(t.attr('rel'))
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