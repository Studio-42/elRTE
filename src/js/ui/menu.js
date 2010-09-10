(function($) {
	
	// close any menu on document click
	$(document).bind('click', function(e) {
		var t = e.target;
		if (!$(t).hasClass('elrte-ui-menu') || !$(t.parentNode).hasClass('elrte-ui-menu')) {
			$('.elrte-ui-menu-container').hide();
		}
	});

	/**
	 * @class elRTE ui menu.
	 * Create castomized drop-down menu
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.menu = function(o, rte) {
		var self = this;
		// curent value
		this.val = '';
		// menu config
		this.opts = $.extend({
			name     : 'menu',
			abs      : false,
			label    : 'Select',
			vars     : {},
			callback : function(v) { }
		}, o)
		// @TODO move into elRTE ?
		rte.bind('click keyup', function() {
			self._menu && self._menu.hide();
		});
		// menu content
		this._menu; 
		// selected element text container
		this._label = $('<div class="elrte-ui-menu-label">'+this.opts.label+'</div>');
		// control element
		this.ui = $('<li class="elrte-ui elrte-ui-menu elrte-ui-'+this.opts.name+'" />')
			.append('<div class="elrte-ui-menu-control" />')
			.append(this._label)
			.mousedown(function(e) {
				if (!$(this).hasClass(rte.command._dClass)) {
					e.preventDefault();

					!self._menu && self.init();

					if (!self._menu.is(':visible')) {
						self._menu.find('.elrte-ui-menu-item').removeClass('elrte-ui-menu-item-sel').filter('[rel="'+self.val+'"]').addClass('elrte-ui-menu-item-sel');
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
			var m = '<div class="elrte-rnd-3 elrte-ui-menu-container"><div class="elrte-ui-menu-inner">', 
				cb = this.opts.callback;

			$.each(this.opts.vars, function(v, o) {
				m += '<div class="elrte-ui-menu-item" rel="'+v+'" style="'+(o.style||'')+'" class="'+(o['class']||'')+'">'+(o.tag ? '<'+o.tag+'>'+o.label+'</'+o.tag+'>' : o.label)+'</div>';
			});
			
			this._menu = $(m + '</div></div>')
				.hide()
				.appendTo(self.ui)
				.mousedown(function(e) { 
					// stop click on scroller
					e.preventDefault();
					e.stopPropagation();
				})
				.find('.elrte-ui-menu-item')
				.hover(function() { $(this).toggleClass('elrte-ui-hover'); })
				.mousedown(function() { 
					cb($(this).attr('rel')); 
				})
				.end();
		}
		
		/**
		 * Set selected item and update control text
		 * @return void
		 **/
		this.set = function(v) {
			this.val = this.opts.vars[v] ? v : '';
			this._label.text(this.val && this.opts.vars[this.val] ? this.opts.vars[this.val].label : this.opts.label);
		}
		
	}

})(jQuery);