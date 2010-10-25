
elRTE.prototype.ui.buttonStyle = function(cmd) {
	
	var self = this,
		rte = cmd.rte,
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
		
	this.onInit = function() {
		this.widget = $('<div class="'+c+'"/>')
		rte.bind('hideSidebar', function() { self.ui.removeClass(self.ac); }).view.appendToSidebar(this.widget);
		
		rte.bind('source', function() {
			if (self.widget.is(':visible')) {
				rte.view.toggleSidebar(cmd.title, self.widget);
			}
		})
		
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
		this.items = this.widget.html(html).children('.'+ic).mousedown(function(e) {
			var t = $(this);
			!t.hasClass(self.dc) && cmd.exec($(this).attr('name'));
		});
		
		this.widget.children('.'+gc).mousedown(function(e) {
			$(this).toggleClass('elrte-expanded').nextUntil('.'+gc).toggle();
		})
		
	}
		
		
	this.click = function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.state) {
			rte.trigger('hideUI')
			rte.view.toggleSidebar(cmd.title, self.widget);
			if (this.widget.is(':visible')) {
				this.ui.addClass(self.ac);
			}
		}
	}
	
	this.update = function() {
		var v = this.cmd.value(),
			d = this.cmd.disabled;;
		
		this.rte.ui._button.update.call(this);
		
		if (this.state) {
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
		} else {
			
		}
		
	}

	this.init(cmd);
}

elRTE.prototype.ui.buttonStyle.prototype = elRTE.prototype.ui._button;
