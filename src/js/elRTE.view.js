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
			.append(this.tabsbar.hide())
			.append(this.workzone)
			.append(this.statusbar.hide())
			.insertBefore(rte.target);
			
		// this.editor.resizable({handles : 'se', alsoResize : this.workzone})
		// .bind('resize', function() {
		// 	self.rte.log('resize')
		// 	self.workzone.find('iframe, textarea').height(self.workzone.height())
		// })
		if (this.rte.options.height>0) {
			this.workzone.height(this.rte.options.height);
		}

		/**
		 * Update tabsbar visibility
		 *
		 * @return void
		 **/
		function updateTabsbar() {
			self.tabsbar.toggle(self.workzone.children('.elrte-document').length > 1 || self.rte.options.alwaysShowTabs);
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
				tab  = $('<li class="elrte-doc-tab elrte-ib" rel="#'+d.id+'">'+d.title+'</li>')
					.appendTo(this.tabsbar)
					.mousedown(function(e) {
						e.preventDefault();
						e.stopPropagation();
						self.rte.focus($(this).attr('rel').substr(1));
					});
				
			$('<div id="'+d.id+'" class="elrte-document"/>')
				.append(d.editor.height(h))
				.append(d.source.height(h).hide())
				.hide()
				.appendTo(this.workzone);
			
			if (d.closeable) {
				tab.append($('<span class="elrte-doc-tab-close" title="'+this.rte.i18n('Close')+'"/>').mousedown(function(e) {
					var p = $(this).parent();
					e.preventDefault();
					e.stopPropagation();
					if (confirm(self.rte.i18n('Close')+' "'+p.text()+'"?')) {
						self.rte.close(p.attr('rel').substr(1));
					}
				}));
			}
			updateTabsbar();
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
			updateTabsbar();
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
			var n = this.tabsbar.children('.elrte-tab-active:first-child');
			return n.length ? n.attr('rel').substr(1) : false;
		}
		
		/**
		 * Returns last document in editor
		 *
		 * @return String
		 */
		this.getLast = function() {
			var n = this.tabsbar.children('.elrte-tab-active:last-child');
			return n.length ? n.attr('rel').substr(1) : false;
		}

		// this.setWorkzoneHeight = function(h) {
		// 	this.workzone.add(this.workzone.find('.elrte-editor,.elrte-source')).height(h);
		// }
	}
	
	// elRTE.prototype.view.prototype.cleanToolbar = function() {
	// 	this.toolbar.empty();
	// }
	
	/**
	 * Create toolbar, add buttons and show
	 *
	 * @param  String  toolbar name
	 * @return void
	 **/
	elRTE.prototype.view.prototype.showToolbar = function(tb) {
		var i = tb.length, l, pname, p, panel, cname, b;
		
		while (i--) {
			pname = tb[i];
			p = this.rte.options.panels[pname];
			panel = $('<ul class="elrte-toolbar-panel elrte-ib '+(i==0 ? 'elrte-toolbar-panel-first' : '')+'" id="'+this.rte.id+'-panel-'+pname+'"></ul>');
			if (typeof(p) != undefined && (l = p.length)) {
				while (l--) {
					cname = p[l];
					if (this.rte.commands[cname] && (b = this.rte.commands[cname].ui())) {
						panel.prepend(b);
					}
				}
			}
			if (panel.children().length) {
				this.toolbar.prepend(panel);
			}
		}
		if (this.toolbar.children().length) {
			this.toolbar.show();
		}
	}
	
	
})(jQuery);
