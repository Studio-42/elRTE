
elRTE.prototype.ui.styleButton = function(cmd) {
	var self = this,
		rte  = cmd.rte,
		c    = 'elrte-widget-sidebar',
		gc   = 'elrte-widget-sidebar-group',
		ic   = 'elrte-widget-sidebar-item',
		html = '',
		tmp  = {
			inline : {
				label : rte.i18n('Inline'),
				html : ''
			},
			block  : {
				label : rte.i18n('Block'),
				html : ''
			},
			list : {
				label : rte.i18n('Lists'),
				html : ''
			},
			table  : {
				label : rte.i18n('Table'),
				html : ''
			},
			obj    : {
				label : rte.i18n('Objects'),
				html : ''
			}
		}, i;
		
	this.init(cmd);
	
	this.menu = $('<div class="'+c+'"/>');
	rte.bind('hideSidebar', function() { self.$.removeClass(self.ac); }).view.appendToSidebar(this.menu);
	
	this.$.mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (self.state) {
			rte.trigger('hideUI')
			rte.view.toggleSidebar('style', self.menu);
			if (self.menu.is(':visible')) {
				self.$.addClass(self.ac);
				self._update();
			} 
		}
	});
	
	// setTimeout(function() {
		html += '<div class="'+ic+'" name="clean">Clean style</div>';
		for (i = 0; i < cmd.opts.length; i++) {
			v = cmd.opts[i];
			tmp[v.type].html += '<div class="'+ic+'" name="'+i+'"><span'+(v.style ? ' style="'+v.style+'"' : (v['class'] ? ' class="'+v['class']+'"' : '') )+'>'+v.name+'</span></div>'
		}
		
		$.each(tmp, function() {
			if (this.html.length) {
				html += '<div class="'+gc+'">'+this.label+'</div>'+this.html;
			}
		});
		delete tmp;
		self.items = self.menu.html(html).children('.'+ic).mousedown(function(e) {
			var t = $(this);
			!t.hasClass(self.dc) && cmd.exec($(this).attr('name'));
		});
		self.menu.children('.'+gc).mousedown(function(e) {
			$(this).toggleClass('elrte-expanded').nextUntil('.'+gc).toggle();
		})
	// }, 20)
	
	this._update = function() {
		var v = this.cmd.value(),
			d = this.cmd.disabled;

		$.each(this.items.removeClass(this.ac+' '+this.dc), function(i, n) {
			var t = $(this), 
				name = parseInt(t.attr('name'));
			
			if ($.inArray(name, d) != -1) {
				t.addClass(self.dc)
			} else if ($.inArray(name, v) != -1) {
				t.addClass(self.ac);
			}
		});
		// disable clean if no active styles
		if (!v.length) {
			this.items.filter('[name="clean"]').addClass(this.dc);
		}
	}
	
	this.update = function() {
		elRTE.prototype.ui._button.update.call(this);

		if (this.menu.is(':visible')) {
			if (this.state == this.cmd.STATE_DISABLE) {
				this.cmd.rte.view.hideSidebar()
			} else {
				this.$.addClass(this.ac);
				this._update();
			}
		}
	}
	
}

elRTE.prototype.ui.styleButton.prototype = elRTE.prototype.ui._button;




