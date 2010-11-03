

$.fn.elrtetabsbar = function(rte) {
	
	/**
	 * Return id of document next of active one
	 *
	 * @return Number
	 **/
	this.getNext = function() {
		var id = false, ch;
		
		if (rte.count()>1) {
			ch = this.children();
			id = ch.filter('[rel="'+rte.active.id+'"]').next().attr('rel') || ch.eq(0).attr('rel');
		}
		return id;
	}
	
	/**
	 * Return id of document previous to active one
	 *
	 * @return Number
	 **/
	this.getPrev = function() {
		var id = false, ch;
		
		if (rte.count()>1) {
			ch = this.children();
			id = ch.filter('[rel="'+rte.active.id+'"]').prev().attr('rel') || ch.filter(':last').attr('rel');
		}
		return id;
	}
	
	return this.each(function() {
		var $this = $(this),
			o     = rte.options,
			ic    = 'elrte-ib',
			tc    = 'elrte-tabsbar',
			bc    = tc+'-arrow',
			ac    = 'elrte-active', 
			dc    = 'elrte-disable',
			delta = 10,
			back  = $('<div class="'+ic+' '+bc+' '+bc+'-back"/>'),
			fwd   = $('<div class="'+ic+' '+bc+' '+bc+'-fwd"/>'),
			btns  = back.add(fwd).mousedown(function(e) {
				var w    = $this.innerWidth()-delta,
					ch   = $this.children(),
					b    = $(this).hasClass(bc+'-back'),
					hsel = ':visible' + (b ? ':first' : ':last'),
					hm   = b ? 'prev' : 'next',
					vsel = b ? ':visible:last' : ':visible:first',
					hid  = ch.filter(hsel)[hm](),
					hidw, vsb;

				e.preventDefault();
				e.stopPropagation();

				if (!$(this).hasClass(dc) && hid.length) {
					// show next hidden tab
					hid.show();
					// hide tabs on other side until showed tab set visible
					while ((vsb = ch.filter(vsel)).length && width() > w) {
						vsb.hide();
					}
					// if there is enough width - show next hidden tab if exists
					while ((hid = ch.filter(hsel)[hm]()).length && width() + hid.outerWidth() < w) {
						hid.show();
					}
					
					updateButtons();
				}
			}),
			nav   = $('<div class="elrte-rnd '+tc+'-nav"/>').append(btns),
			tb    = $('<div class="'+tc+'"/>').append(nav), w;
			
		$this.addClass(tc+'-tabs')
			.before(tb)
			.appendTo(tb)
			.change(function() {
				var ch = $this.children(), 
					l = ch.length, w, t;

				if (l == 0 || (l == 1 && !rte.options.alwaysShowTabs)) {
					// hide tabsbar when no tabs or only one tab and editor option alwaysShowTabs == false
					tb.hide();
				} else {
					// show tabsbar
					tb.show();
					w = $this.innerWidth() - delta;
					if (width() > w) {
						// tabs summary width greater then tabsbar width
						// hide tabs at the end
						while (ch.filter(':visible').length >1 && (t = ch.filter(':visible:last')) && width() > w) {
							t.hide();
						}
					} else if (ch.filter(':hidden').length) {
						// tabs summary width less then tabsbar width
						// show hidden tabs at the tabsbar's begin
						while ((t = ch.filter(':visible:first').prev(':hidden')).length && width() + t.outerWidth() < w) {
							t.show();
						}
						// show hidden tabs at the tabsbar's end
						while ((t = ch.filter(':visible:last').next(':hidden')).length && width() + t.outerWidth() < w) {
							t.show();
						}
					}

					updateButtons();
				}

			});
	
		rte.bind('open', function(e) {
			var d = rte.document(e.data.id),
				t = d.title,
				c = 'elrte-tab',
				tab;
				
			if (d.id) {
				// create tab for new document
				tab = $('<div class="'+ic+' elrte-rnd-top '+c+'" rel="'+d.id+'" title="'+t+'"><div class="'+c+'-title">'+t+'</div></div>')
					.appendTo($this)
					.mousedown(function(e) {
						e.preventDefault();
						rte.focus($(this).attr('rel'));
					});
				if (o.allowCloseDocs) {
					// add close button on tab
					$('<div class="elrte-close" title="'+rte.i18n('Close')+'"/>')
						.prependTo(tab)
						.mousedown(function(e) {
							var p = $(this).parent();
							e.stopPropagation();
							e.preventDefault();
							confirm(rte.i18n('Close')+' "'+p.text()+'"?') && rte.close(p.attr('rel'));
						});
				}
				$this.change();
			}
		}).bind('wysiwyg source', function(e) {
			// update active tab on change active document
			var t = $this.children().removeClass(ac).filter('[rel="'+e.data.id+'"]').addClass(ac),
				btn;
				
			if (t.is(':hidden')) {
				// if active tab is hidden "click" on back/fwd button until it will be visible
				btn = t.nextAll(':visible').length ? back : fwd;
				while (t.is(':hidden')) {
					btn.mousedown();
				}
			}
		}).bind('close', function(e) {
			// remove tab for closing document
			$this.children().filter('[rel="'+e.data.id+'"]').remove();
			$this.change();
		});
		
		/**
		 * Return visible tabs width
		 *
		 * @return Number
		 */
		function width() {
			var w = 0;
			$this.children(':visible').each(function() {
				w += $(this).outerWidth();
			});
			return w;
		}

		/**
		 * Show/hide buttons and update its state
		 *
		 * @return void
		 */
		function updateButtons() {
			var ch = $this.children(),
				fh = ch.eq(0).is(':hidden'),
				lh = ch.filter(':last').is(':hidden');
			
			if (fh || lh) {
				btns.show();
				back.toggleClass(dc, !fh);
				fwd.toggleClass(dc,  !lh);
			} else {
				btns.hide();
			}
		}

		// resize event handler
		setInterval(function() {
			var _w = $this.width();
			if (_w != w) {
				$this.change();
			}
			w = _w;
		}, 250);
		
	});
}

$.fn.elrtetabsbar.defaults = {
	alwaysShow : true,
	sortable   : true
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
	this.tabsbar   = $('<div/>')//.elrtetabsbar(); //$('<ul class="elrte-tabsbar-top"/>');
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
		.append(this.tabsbar)
		// .append($('<div class="elrte-tabsbar-wrp"/>').append(this.tabsbar))
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
		// this.tabsbar.sortable({ delay : 10});
	}
	
	// rte.bind('load', function() {
	// self.tabsbar.elrtetabsbar({ 
	// 	alwaysShow : o.alwaysShowTabs,
	// 	sortable   : !!(o.sortableTabs && $.fn.sortable)
	// })
		// self.tabsbar.test()
		// self.tabsbar.add('kokoni')
	// })
	
	
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
			rte = this.rte,
			h    = this.workzone.height(),
			c = 'elrte-tab',
			t = d.title,
			tab  = $('<div class="elrte-ib elrte-rnd-top '+c+'" rel="'+d.id+'" title="'+t+'"><div class="'+c+'-title">'+t+'</div></div>')
				.mousedown(function(e) {
					e.preventDefault();
					rte.focus($(this).attr('rel'));
				});
		
		if (rte.options.allowCloseDocs) {
			tab.prepend(
				$('<div class="elrte-close" title="'+rte.i18n('Close')+'"/>')
					.mousedown(function(e) {
						var p = $(this).parent();
						
						e.preventDefault();
						if (confirm(rte.i18n('Close')+' "'+p.text()+'"?')) {
							rte.close(p.attr('rel'));
						}
					})
			)
		}
		
		// this.tabsbar.append(tab);
		// this.tabsbar.add(tab)
			
		$('<div id="'+d.id+'" class="elrte-document"/>')
			.append(d.editor.height(h))
			.append(d.source.height(h).hide())
			.hide()
			.appendTo(this.workzone);
		
		// this.updateTabsbar();
	}

	/**
	 * Set document with required id visible and hide others
	 *
	 * @param String  document id
	 * @return void
	 */
	this.showDoc = function(id) {
		this.workzone.children('.elrte-document').hide().filter('#'+id).show();
		this.tabsbar.focus(id)
		// this.tabsbar.children().removeClass('elrte-tab-active').filter('[rel="#'+id+'"]').addClass('elrte-tab-active');
	}

	/**
	 * Remove document by id
	 *
	 * @param String  document id
	 * @return void
	 */
	this.remove = function(id) {
		this.workzone.find('#'+id).remove();
		
		// this.workzone.find('#'+id).add(this.tabsbar.find('[rel="#'+id+'"]')).remove();
		this.tabsbar.rm(id)
		// this.updateTabsbar();
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
		return this.tabsbar.getNext(rte.active.id);
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
		// if (self.sidebar.is(':visible')) {
		// 	self.sidebar.outerHeight(self.main.height())
		// }
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

