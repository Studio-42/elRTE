(function($) {


	elRTE.prototype.ui.menu = function(o, rte) {
		var self = this;
		this.val = '';
		this.opts = $.extend({
			name : 'menu',
			abs : false,
			label : 'Select',
			vars : {},
			callback : function(v) { }
		}, o)
		
		rte.bind('click keyup', function() {
			self._menu && self._menu.hide();
		})
		
		this._menu; // = $('<div class="elrte-ui-menu-container"></div>').hide();
		this._label = $('<div class="elrte-ui-menu-label">'+this.opts.label+'</div>')
		
	
		this.ui = $('<li class="elrte-ui elrte-ui-menu elrte-ui-'+this.opts.name+'" />')
			.append('<div class="elrte-ui-menu-control" />')
			.append(this._label)
			.mousedown(function(e) {
				var v;
				if (!$(this).hasClass(rte.command._dClass)) {
					e.preventDefault();

					if (!self._menu) {
						self.init();
					}
					// v = self._menu.is(':visible');
					if (!(v = self._menu.is(':visible'))) {
						self._menu.find('.elrte-ui-menu-item').removeClass('elrte-ui-menu-item-sel').filter('[rel="'+self.val+'"]').addClass('elrte-ui-menu-item-sel');
					} 
					self._menu.slideToggle(256);

					!v && setTimeout(function() {
						$(document).one('click keyup', function(e) {
							e.target !== self.ui[0] && e.target.parentNode !== self.ui[0] && self._menu.hide();
						});
					}, 2);
				}
				
			})
		

		
		this.init = function() {
			var m = '<div class="elrte-rnd-3 elrte-ui-menu-container"><div class="elrte-ui-menu-inner">', 
				cb = this.opts.callback;
			$.each(this.opts.vars, function(v, o) {
				// var a = (o.css ? ' style="'+o.css+'"' : '') + (o['class'] ? ' class="'+o['class']+'"' : '');
				m += '<div class="elrte-ui-menu-item" rel="'+v+'" style="'+(o.style||'')+'" class="'+(o['class']||'')+'">'+(o.tag ? '<'+o.tag+'>'+o.label+'</'+o.tag+'>' : o.label)+'</div>';
			})
			this._menu = $(m + '</div></div>').hide()
				.appendTo(self.ui)
				.find('.elrte-ui-menu-item')
				.hover(function() { $(this).toggleClass('elrte-ui-hover') })
				.mousedown(function() { 
					var v = $(this).attr('rel');
					v != self.val && cb(v); 
				})
				.end();
		}
		
		// this._menu.appendTo(this.opts.abs ? document.body : this.ui);
		// 
		// $.each(this.opts.list, function(n, v) {
		// 	self._menu.append('<div>'+v+'</div>')
		// })
		
		
		
		
		this.get = function() {
			return this.val;
		}
		
		this.set = function(v) {
			this.val = this.opts.vars[v] ? v : '';
			this._label.text(this.opts.vars[this.val] ? this.opts.vars[this.val].label : this.opts.label)
		}
		
	}

})(jQuery);