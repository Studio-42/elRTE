/**
 * jQuery plugin
 * Return total width for all elements in set
 * @usage
 * var w = $('selector').sumWidth() - return sum of .width()
 * var w = $('selector').sumWidth({ type : 'inner' }) - return sum of .innerWidth()
 * var w = $('selector').sumWidth({ type : 'outer' }) - return sum of .outerWidth()
 * var w = $('selector').sumWidth({ type : 'outer', margins : true }) - return sum of .outerWidth(true) - include margins
 * @param  Object  plugin options
 * @return Number
 */
$.fn.sumWidth = function(o) {
	var w=0, c;
	
	o = $.extend({ type : '', margins : false }, o||{});
	
	if (o.type == 'outer') {
		o.margins = !!o.margins;
		c = 'outerWidth';
	} else {
		o.margins = void(0);
		c = o.type == 'inner' ? 'innerWidth' : 'width';
	}

	this.each(function() {
		w += $(this)[c](o.margins);
	});

	return parseInt(w);
}

/**
 * jQuery plugin
 * elRTE tabsbar
 *
 */
$.fn.elrtetabsbar = function(rte) {
	var o = rte.options,
		ac = 'ui-tabs-selected ui-state-active',
		hc = 'ui-state-hover',
		ic = 'ui-icon ui-icon-',
		wo = { type : 'outer', margins : true }
		;
	
	/**
	 * Return id of document next to active one or first document
	 * Return void, if no documents or only one document
	 *
	 * @return Number
	 */
	this.getNext = function() {
		var d, c, a;
		
		if ((d = rte.document())) {
			c = this.children('.elrte-tab');
			a = c.filter(':has(a[href="#'+d.id+'"])');
			
			if (c.length > 1) {
				return (a.length && a.next('.elrte-tab').length ? a.next('.elrte-tab') : c.eq(0)).children('a').attr('href').substr(1)
				
			}
		}
	}
	
	/**
	 * Return id of document previous to active one or last document
	 * Return void, if no documents or only one document
	 *
	 * @return Number
	 */
	this.getPrev = function() {
		var d, c, a;
		
		if ((d = rte.document())) {
			c = this.children('.elrte-tab');
			a = c.filter(':has(a[href="#'+d.id+'"])');
			
			if (c.length > 1) {
				return (a.length && a.prev('.elrte-tab').length ? a.prev('.elrte-tab') : c.filter(':last')).children('a').attr('href').substr(1)
				
			}
		}
	}
	
	return this.each(function() {
		var $this = $(this).addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all'),
			nav = $('<li class="elrte-tabs-nav "/>'),
			back = $('<div class="ui-widget ui-state-default ui-corner-left elrte-tabs-btn"><span class="ui-icon ui-icon-triangle-1-w"/></div>'),
			// back = $('<div class="ui-state-default ui-corner-all" style="float:left"><span class="ui-icon ui-icon-triangle-1-w"  style="margin:5px 0"/></div>'),
			fwd = $('<div class="ui-widget ui-state-default ui-corner-right elrte-tabs-btn"><span class="ui-icon ui-icon-triangle-1-e"/></div>'),
			btns = back.add(fwd).hover(function() { $(this).toggleClass('ui-state-hover') }),
			tabs = $this.children('.elrte-tab')
		;

		rte.log(tabs)
		// btns.append(back)
		nav.append(btns)
		
		$this.append(nav)
		
		if ($.fn.sortable) {

			$this.sortable({ 
				delay  : 10, 
				items  : '>li.elrte-tab', 
				helper : 'clone'
			});
		}
		
		function find(id) {
			return tabs.filter(':has(a[href="#'+id+'"])');
		}
		
		$this.change(function() {
			var w = Math.ceil($this.width()), l, t;
			
			tabs = $this.children('.elrte-tab');
			
			l = tabs.length;
			
			if (l == 0 || (l == 1 && !o.alwaysShowTabs)) {
				$this.hide();
			} else if (l > 1) {
				$this.show();

				if (w < tabs.sumWidth(wo)) {
					
					while ((t = tabs.filter(':visible')).length > 1 && w < t.sumWidth(wo)) {
						t.filter(':last').hide();
					}
					
				} else if (tabs.filter(':hidden').length) {
					rte.log('show tabs')
				}
				
			}
			
			
			// rte.log(tabs)
		})
		
		rte.bind('open', function(e) {
			var d = rte.document(e.data.id),
				t, tab;
				
			if (d.id && !find(d.id).length) {
				t = d.title;
				tab = $('<li class="ui-state-default ui-corner-top elrte-tab" rel="'+d.id+'"/>')
					.hover(function() {
						$(this).toggleClass(hc);
					})
					.append(
						$('<a href="#'+d.id+'" title="'+t+'">'+t+'</a>')
							.click(function(e) {
								e.preventDefault();
								rte.focus($(this).attr('href').substr(1));
							})
						
					)
					.appendTo($this);
				
				
				if (o.allowCloseDocs) {
					 $('<div class="'+ic+'circle-close" title="'+rte.i18n('Close')+'"/>')
						.mousedown(function(e) {
							e.stopPropagation();
							e.preventDefault()
							if (confirm(rte.i18n('Close document')+' "'+t+'"?')) {
								rte.close(d.id);
							}
						})
						.prependTo(tab);
				}
				$this.change()
				// $this.append(tab)

			}
		})
		.bind('wysiwyg source', function(e) {
			tabs.removeClass(ac);
			find(e.data.id).addClass(ac);
		})
		.bind('close', function(e) {
			find(e.data.id).remove();
			$this.change()
		})
		
		$(window).resize(function(e) {
			// rte.log('inner width: '+Math.ceil($this.width())+' tabs width: '+$this.children('.elrte-tab:visible').sumWidth())
		})
	})
}


$.fn.elrtetabsbar_ = function(rte) {

	this.getNext = function() {
		var ch;
		
		if (rte.count()>1) {
			ch = this.children('.elrte-tabsbar-tabspanel').children();
			return ch.filter('[rel="'+rte.active.id+'"]').next().attr('rel') || ch.eq(0).attr('rel');
		}
	}
	
	this.getPrev = function() {
		var ch;
		
		if (rte.count()>1) {
			ch = this.children('.elrte-tabsbar-tabspanel').children();
			return ch.filter('[rel="'+rte.active.id+'"]').prev().attr('rel') || ch.filter(':last').attr('rel');
		}
	}

	return this.each(function() {
		var $this = $(this),
	 		o     = rte.options,
			ic    = 'elrte-ib',
			tc    = 'elrte-tabsbar',
			bc    = tc+'-btn',
			ac    = 'elrte-active', 
			dc    = 'elrte-disable',
			delta = 10,
			panel = $('<div class="elrte-tabsbar-tabspanel"/>'),
			back  = $('<div class="'+ic+' '+bc+' '+bc+'-back"/>'),
			fwd   = $('<div class="'+ic+' '+bc+' '+bc+'-fwd"/>'),
			btns  = back.add(fwd).mousedown(function(e) {
				var w    = panel.innerWidth()-delta,
					ch   = panel.children(),
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
			nav   = $('<div class="elrte-rnd '+tc+'-nav"/>').append(btns), w
			;
		
		$this.addClass(tc)
			.append(nav)
			.append(panel)
			.change(function() {
				var ch = panel.children(), 
					l = ch.length, w, t;

				if (l == 0 || (l == 1 && !rte.options.alwaysShowTabs)) {
					// hide tabsbar when no tabs or only one tab and editor option alwaysShowTabs == false
					$this.hide();
				} else {
					// show tabsbar
					$this.show();
					w = panel.innerWidth() - delta;
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
				
			})
		
		rte.bind('open', function(e) {
			var d = rte.document(e.data.id),
				t = d.title,
				c = 'elrte-tab',
				tab;
				
			if (d.id) {
				// create tab for new document
				tab = $('<div class="'+ic+' elrte-rnd-top '+c+'" rel="'+d.id+'" title="'+t+'"><div class="'+c+'-title">'+t+'</div></div>')
					.appendTo(panel)
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
		})
		.bind('wysiwyg source', function(e) {
			// update active tab on change active document
			var t = panel.children().removeClass(ac).filter('[rel="'+e.data.id+'"]').addClass(ac),
				btn;
				
			if (t.is(':hidden')) {
				// if active tab is hidden "click" on back/fwd button until it will be visible
				btn = t.nextAll(':visible').length ? back : fwd;
				while (t.is(':hidden')) {
					btn.mousedown();
				}
			}
		})
		.bind('close', function(e) {
			// remove tab for closing document
			panel.children().filter('[rel="'+e.data.id+'"]').remove();
			$this.change();
		});
		
		/**
		 * Return visible tabs width
		 *
		 * @return Number
		 */
		function width() {
			var w = 0;
			panel.children(':visible').each(function() {
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
			var ch = panel.children(),
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

