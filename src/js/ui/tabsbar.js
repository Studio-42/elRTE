/**
 * jQuery plugin
 * elRTE tabsbar
 *
 */
$.fn.elrtetabsbar = function(rte) {

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

