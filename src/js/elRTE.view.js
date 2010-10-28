$.fn.elrtetabsbar = function() {
	return this.each(function() {
		var t = $(this);
		
		t.addClass('elrte-tabsbar')
		
		t.resize(function() {
			window.console.log('resize')
		})
		
	});
}


/**
 * @Class. elRTE renderer
 */
elRTE.prototype.view = function(rte) {
	var self = this,
		o = rte.options,
		c = rte.options.cssClass||'';
		
	this.rte       = rte;
	this.toolbar   = $('<div class="elrte-toolbar"/>');
	this.workzone  = $('<div class="elrte-workzone"/>')
	this.tabsbar   = $('<div/>').elrtetabsbar(); //$('<ul class="elrte-tabsbar-top"/>');
	// this.sbheader  = $('<div class="elrte-widget-header"/>');
	// this.sbinner   = $('<div class="elrte-sidebar-inner"/>');
	// this.sbclose   = $('<div class="elrte-sidebar-close"/>')
	// 	.mousedown(function(e) {
	// 		e.preventDefault();
	// 		e.stopPropagation();
	// 		self.hideSidebar();
	// 	});
	// this.sidebar   = $('<div class="elrte-sidebar"/>').append(this.sbclose).append(this.sbheader).append(this.sbinner)
	// 	.mousedown(function(e) {
	// 		e.preventDefault();
	// 		e.stopPropagation();
	// 		self.rte.focus();
	// 	});
	
	this.main      = $('<div class="elrte-main"/>')
		.append($('<div class="elrte-tabsbar-wrp"/>').append(this.tabsbar))
		.append(this.workzone);
	this.container = $('<div class="elrte-container"/>')
		// .append(this.sidebar)
		.append(this.main)
	this.statusbar = $('<div class="elrte-statusbar" />');
	
	this.editor    = $('<div class="elrte clearfix '+c+'" id="'+rte.id+'" />')
		.append(this.container)
		.append(this.statusbar.hide())
		.append('<div class="clearfix"/>')
		.insertBefore(rte.target);
	

		
	if (o.height>0) {
		this.workzone.height(o.height);
	}
	
	if ($.fn.sortable) {
		this.tabsbar.sortable({ delay : 10});
	}
	
	this.setToolbar = function(t) {
		this.editor.prepend(this.toolbar = t);
	}
	
	/**
	 * Add new document into editor
	 *
	 * @param  Object  document
	 * @return void
	 **/
	this.add = function(d) {
		var self = this,
			h    = this.workzone.height(),
			c = 'elrte-tab',
			btn = this.rte.options.allowCloseDocs
				? $('<div class="elrte-close" title="'+this.rte.i18n('Close')+'"/>')
					.mousedown(function(e) {
						var p = $(this).parent();
						e.preventDefault();
						e.stopPropagation();
						if (confirm(self.rte.i18n('Close')+' "'+p.text()+'"?')) {
							self.rte.close(p.attr('rel').substr(1));
						}
					})
				: '',
			tab  = $('<div class="elrte-ib elrte-rnd-top '+c+'" rel="#'+d.id+'" title="'+d.title+'"><div class="'+c+'-title">'+d.title+'</div></div>')
				.appendTo(this.tabsbar)
				.append(btn)
				.mousedown(function(e) {
					e.preventDefault();
					self.rte.focus($(this).attr('rel').substr(1));
				});
			
		$('<div id="'+d.id+'" class="elrte-document"/>')
			.append(d.editor.height(h))
			.append(d.source.height(h).hide())
			.hide()
			.appendTo(this.workzone);
		
		this.updateTabsbar();
	}

	/**
	 * Set document with required id visible and hide others
	 *
	 * @param String  document id
	 * @return void
	 */
	this.showDoc = function(id) {
		this.workzone.children('.elrte-document').hide().filter('#'+id).show();
		this.tabsbar.children().removeClass('elrte-tab-active').filter('[rel="#'+id+'"]').addClass('elrte-tab-active');
	}

	/**
	 * Remove document by id
	 *
	 * @param String  document id
	 * @return void
	 */
	this.remove = function(id) {
		this.workzone.find('#'+id).add(this.tabsbar.find('[rel="#'+id+'"]')).remove();
		this.updateTabsbar();
	}
	
	/**
	 * Update tabsbar visibility
	 *
	 * @return void
	 **/
	this.updateTabsbar = function() {
		if (self.workzone.children('.elrte-document').length > 1 || self.rte.options.alwaysShowTabs) {
			this.tabsbar.show();
		} else {
			this.tabsbar.hide();
			// @TODO check tabs length and create tabs slider if required
		}
	}
	
	/**
	 * Returns next documents id after active one
	 *
	 * @return String
	 */
	this.getNext = function() {
		var n = this.tabsbar.children('.elrte-tab-active').next();
		return n.length ? n.attr('rel').substr(1) : false;
	}

	/**
	 * Returns previous documents id after active one
	 *
	 * @return String
	 */
	this.getPrev = function() {
		var n = this.tabsbar.children('.elrte-tab-active').prev();
		return n.length ? n.attr('rel').substr(1) : false;
	}

	/**
	 * Returns first document in editor
	 *
	 * @return String
	 */
	this.getFirst = function() {
		var n = this.tabsbar.children('.elrte-doc-tab').eq(0);
		return n.length ? n.attr('rel').substr(1) : false;
	}
	
	/**
	 * Returns last document in editor
	 *
	 * @return String
	 */
	this.getLast = function() {
		var n = this.tabsbar.children('.elrte-doc-tab:last-child');
		return n.length ? n.attr('rel').substr(1) : false;
	}

	

	this.appendToSidebar = function(o) {
		this.sbinner.append(o)
	}

	this.toggleSidebar = function(title, widget) {
		if (widget.is(':hidden')) {
			if (this.sidebar.is(':hidden')) {
				this.container.addClass('elrte-show-sidebar');
				this.workzone.css('width', 'auto')
				this.sidebar.outerHeight(this.main.height()).show();
			}
			this.sbheader.text(title);
			widget.show()
		} else {
			this.hideSidebar()
		}
	}

	this.hideSidebar = function() {
		if (this.sidebar.is(':visible')) {
			this.container.removeClass('elrte-show-sidebar')
			this.sidebar.hide()
			this.sbinner.children().hide();
			this.rte.trigger('hideSidebar');
			this.workzone.css('width', 'auto')
		}
	}


	/**
	 * Sync iframes/textareas height with workzone height 
	 *
	 * @return void
	 */
	this.updateHeight = function() {
		self.workzone.find('.elrte-editor,.elrte-source').height(self.workzone.height());
		if (self.sidebar.is(':visible')) {
			self.sidebar.outerHeight(self.main.height())
		}
	}
	
	/**
	 * Turn editor resizable on/off if allowed
	 *
	 * @param  Boolean 
	 * @return void
	 **/
	this.resizable = function(r) {
		if (this.rte.options.resizable && $.fn.resizable) {
			if (r) {
				this.editor.resizable({handles : 'se', alsoResize : this.workzone, minWidth :300, minHeight : 200 }).bind('resize', this.updateHeight);
			} else {
				this.editor.resizable('destroy').unbind('resize', this.updateHeight);
			}
		}
	}
	
	this.resizable(true);

}

