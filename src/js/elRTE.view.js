(function($) {
	/**
	 * Class. elRTE renderer
	 * 
	 */
	elRTE.prototype.view = function(rte) {
		var self       = this;
		this.rte       = rte;
		this.toolbar   = $('<div class="elrte-toolbar" />');
		this.tabsbar   = $('<ul class="elrte-tabsbar" />');
		this.workzone  = $('<div class="elrte-workzone" />');
		this.statusbar = $('<div class="elrte-statusbar" />');
		this.editor    = $('<div class="elrte '+(this.rte.options.cssClass||'')+'" id="'+this.rte.id+'" />')
			.append(this.toolbar.hide())
			.append($('<div class="elrte-tabsbar-wrapper"/>').append(this.tabsbar.hide()))
			.append(this.workzone)
			.append(this.statusbar.hide())
			.insertBefore(rte.target);
			
		if (rte.options.height>0) {
			this.workzone.height(this.rte.options.height);
		}
		if (!rte.options.showToolbar) {
			// this.toolbar.hide();
		}
		if ($.fn.sortable) {
			this.tabsbar.sortable({ delay : 10});
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
				tab  = $('<li class="elrte-doc-tab elrte-ib" rel="#'+d.id+'" title="'+d.title+'"><div class="elrte-doc-tab-title">'+d.title+'</div></li>')
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
				tab.append($('<span class="elrte-doc-tab-close" title="'+this.rte.i18n('Close')+'"/>').mousedown(function(e) {
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
			var self = this,
				pl = tb.length,
				pc = 'elrte-toolbar-panel',
				cn, cl, cmd, bn, button, panel;
			
			while (pl--) {
				panel = $('<ul class="'+pc+' '+pc+'-'+(pn = tb[pl])+'"/>');
				cn = this.rte.options.panels[pn]||[];
				cl = cn.length;
				while (cl--) {
					cmd = commands[cn[cl]]
					if (cmd) {
						bt = cmd.buttonType;
						button = this.rte.ui[bt]||this.rte.ui.button;
						// self.rte.log(button) 
						panel.prepend(button(cmd))
					}
				}
				if (panel.children().length) {
					this.toolbar.prepend(panel)
				}
			}
			
			if (this.toolbar.children().length) {
				this.toolbar.show()
			}
			
		}

		/**
		 * Add button on required toolbar's panel 
		 *
		 * @param  jQuery  button
		 * @param  String  panel name
		 * @return void
		 */
		this.addUI = function(ui, pn) {
			var cmd = this.rte.command,
				c = 'elrte-toolbar-panel',
				p = this.toolbar.show().children('.'+c+'-'+pn);
				
			if (!p.length) {
				p = $('<ul class="'+c+' '+c+'-'+pn+(!this.toolbar.children('.'+c).length ? ' '+c+'-first' : '')+'" />').appendTo(this.toolbar);
			}
			ui.hover(function() {
				var t = $(this);
				
				if (!t.hasClass(cmd.uiDisableClass)) {
					t.toggleClass(cmd.uiHoverClass);
				}
			})
			p.append(ui);
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
	
})(jQuery);
