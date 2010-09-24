
/**
 * @Class. elRTE renderer
 * @TODO move class namesito variables
 */
elRTE.prototype.view = function(rte) {
	var self       = this,
		o = rte.options, 
		bt = o.bottomTabs||true,
		tc = 'elrte-tabsbar-wrp-'+(o.bottomTabs ? 'bottom' : 'top');
	this.rte       = rte;
	this.toolbar   = $('<div class="elrte-toolbar"/>');
	
	
	
	
	this.workzone  = $('<div class="elrte-workzone"/>')
	this.tabsbar   = $('<ul class="elrte-tabsbar-top"/>');
	this.sbheader  = $('<div class="elrte-ui-header"/>');
	this.sbinner   = $('<div class="elrte-sidebar-inner"/>');
	this.sbclose   = $('<div class="elrte-sidebar-close"/>');
	this.sidebar   = $('<div class="elrte-sidebar"/>').append(this.sbclose).append(this.sbheader).append(this.sbinner)
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			self.rte.focus()
		});
	this.main      = $('<div class="elrte-main"/>').append($('<div class="elrte-tabsbar-top-wrp"/>').append(this.tabsbar)).append(this.workzone);
	this.container = $('<div class="elrte-container"/>').append(this.sidebar).append(this.main)
	this.statusbar = $('<div class="elrte-statusbar" />');
	
	this.editor    = $('<div class="elrte clearfix '+(this.rte.options.cssClass||'')+'" id="'+this.rte.id+'" />')
		.append(this.toolbar.hide())
		.append(this.container)
		.append(this.statusbar.hide())
		.append('<div class="clearfix"/>')
		.insertBefore(rte.target);
	

		
	if (rte.options.height>0) {
		this.workzone.height(this.rte.options.height);
	}
	
	if ($.fn.sortable) {
		// this.tabsbar.sortable({ delay : 10});
	}
	
	rte.bind('source', function() {
		self.hideSidebar()
	})
	
	/**
	 * Add new document into editor
	 *
	 * @param  Object  document
	 * @return void
	 **/
	this.add = function(d) {
		var self = this,
			h    = this.workzone.height(),
			tab  = $('<li class="elrte-tab" rel="#'+d.id+'" title="'+d.title+'"><div class="elrte-tab-title">'+d.title+'</div></li>')
				.appendTo(this.tabsbar)
				.mousedown(function(e) {
					e.preventDefault();
					self.rte.focus($(this).attr('rel').substr(1));
				});
			
		$('<div id="'+d.id+'" class="elrte-document"/>')
			.append(d.editor.height(h))
			.append(d.source.height(h).hide())
			.hide()
			.appendTo(this.workzone);
		
		if (this.rte.options.allowCloseDocs) {
			tab.append($('<span class="elrte-tab-close" title="'+this.rte.i18n('Close')+'"/>').mousedown(function(e) {
				var p = $(this).parent();
				e.preventDefault();
				e.stopPropagation();
				if (confirm(self.rte.i18n('Close')+' "'+p.text()+'"?')) {
					self.rte.close(p.attr('rel').substr(1));
				}
			}));
		}
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
		self.tabsbar.toggle(self.workzone.children('.elrte-document').length > 1 || self.rte.options.alwaysShowTabs);
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

	this.buildUI = function(tb, commands) {
		var pl = tb.length,
			pc = 'elrte-toolbar-panel',
			pn, pnl, cn, cl, cmd, btn;
		
		while (pl--) {
			pn  = tb[pl];
			pnl = $('<ul class="'+pc+' '+pc+'-'+pn+'"/>');
			cn  = this.rte.options.panels[pn]||[];
			cl  = cn.length;
			while (cl--) {
				
				if ((cmd = commands[cn[cl]])) {
					// btn = this.rte.ui[cmd.button]||this.rte.ui.button;
					btn = new this.rte.ui.testButton(cmd)
					pnl.prepend(btn.node);
				}
			}
			pnl.children().length && this.toolbar.prepend(pnl);
		}

		if (this.toolbar.children().length) {
			this.toolbar.show()
			// .children().children().hover(function(e) {
			// 	$(this).toggleClass('elrte-ui-hover');
			// });
		}
		
	}

	this.appendToSidebar = function(o) {
		this.sbinner.append(o)
	}

	this.toggleSidebar = function(title, widget) {
		if (widget.is(':hidden')) {
			if (this.sidebar.is(':hidden')) {
				this.container.addClass('elrte-show-sidebar');
				// this.sidebar.css('height', this.main.height()+'px').show()
				this.sidebar.outerHeight(this.main.height()).show();
				// this.rte.log(this.sidebar.outerHeight()-this.sidebar.height())
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
		}
	}


	/**
	 * Sync iframes/textareas height with workzone height 
	 *
	 * @return void
	 */
	this.updateHeight = function() {
		self.workzone.find('.elrte-editor,.elrte-source').height(self.workzone.height());
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

