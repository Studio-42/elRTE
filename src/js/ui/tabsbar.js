/**
 * jQuery plugin
 * elRTE tabsbar
 *
 */
$.fn.elrtetabsbar = function(rte) {
	var 
		tbc = 'elrte-tabsbar', // tabsbar class
		tc  = 'elrte-tab', // tab class
		bc  = 'ui-widget ui-state-default elrte-tabs-btn', // buttons class
		ac  = 'ui-tabs-selected ui-state-active', // active class
		dc  = 'ui-state-disabled', // disable class
		hc  = 'ui-state-hover',    // hover class
		ic  = 'ui-icon ui-icon-',  // icons class
		cc  = 'ui-corner-',        // rounded corners class
		ts  = '.'+tc,              // tab selector
		vs  = ':visible',
		hs  = ':hidden',
		fs  = ':first',
		ls  = ':last',
		vfs = vs+fs,
		vls = vs+ls,
		wo  = { type : 'outer', margins : true };  // default options to call $.fn.sumWidth()
	
	/**
	 * Return id of document next to active one or first document id
	 * Return void, if no documents
	 *
	 * @return Number
	 */
	this.getNext = function() {
		var d, t, n;
		
		if ((d = rte.document())) {
			t = this.children('[rel="'+d.id+'"]');
			return ((n = t.next(ts)).length ? n : this.children(ts+fs)).attr('rel');
		}
	}
	
	/**
	 * Return id of document previous to active one or last document id
	 * Return void, if no documents
	 *
	 * @return Number
	 */
	this.getPrev = function() {
		var d, t, n;
		
		if ((d = rte.document())) {
			t = this.children('[rel="'+d.id+'"]');
			return ((n = t.prev(ts)).length ? n : this.children(ts+ls)).attr('rel');
		}
	}
	
	
	function init(n) {
		var o     = rte.options,
			bw    = 0,
			back  = $('<div class="'+bc+' '+cc+'left"><span  class="'+ic+'triangle-1-w"/></div>'),
			fwd   = $('<div class="'+bc+' '+cc+'right"><span class="'+ic+'triangle-1-e"/></div>'),
			btns  = back.add(fwd)
				.hide()
				.hover(function() {
					var t = $(this);
					t.hasClass(dc) ? t.removeClass(hc) : t.toggleClass(hc);
				})
				.mousedown(function(e) {
					var b = this === back[0],
						tab = b ? tabs.filter(vfs).prev(ts+hs) : tabs.filter(vls).next(ts+hs);
						
					!$(this).hasClass(dc) && tab.length && showTab(tab.attr('rel'));
				}),
			$this = $(n).addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header '+cc+'all '+tbc)
				.append($('<li class="elrte-tabs-btns"/>').append(btns)),
			tabs  = $this.children()
			;
		
		if (o.sortableTabs && $.fn.sortable) {
			// make tabs sortable
			$this.sortable({ delay : 3, items : '>'+ts, helper : 'clone', axis : 'x' });
		}
		
		/**
		 * Return visible tabs total width
		 *
		 * @return Number
		 */
		function width() {
			return tabs.filter(vs).sumWidth(wo);
		}
		
		/* Return tabsbar width available for tabs
		 *
		 * @return Number
		 */
		function barWidth() {
			return Math.floor($this.width() - bw);
		}
		
		/**
		 * Make required tab visible
		 *
		 * @param  String  document id
		 * @return void
		 */
		function showTab(id) {
			var tab = tabs.filter('[rel="'+id+'"]'), 
				w   = barWidth(), 
				t, next, prev;
			
			if (tab.length && tab.is(hs)) {
				prev = tab.prevAll(ts);
				next = tab.nextAll(ts);
				t    = prev.filter(vs).length ? prev : next;
				// hide all tabs
				tabs.hide();
				tab.show();
				// show prev/next tabs as possible
				t.each(function() {
					var $t = $(this)
					if (width() + $t.outerWidth() > w) {
						return false;
					}
					$t.show();
				});
				// probably we have enough width to show another one hidden tab
				update();
			}
		}
			
		/**
		 * Update tabs visibility
		 *
		 * @return void
		 */
		function update() {
			var w, l, t;
			
			// cache tabs set
			tabs = $this.children(ts);
			l = tabs.length;

			if (!bw) {
				// calculate buttons width if not previous done
				bw = btns.sumWidth(wo);
			}
			
			if (l == 0 || (l == 1 && !o.alwaysShowTabs)) {
				// if no tabs or only one tab - hide tabsbar
				$this.hide();
			} else if (l > 1) {
				$this.show();
				// calculate width available for visible tabs
				w = barWidth();

				if (width() > w) {
					// there is not enough width for all tabs - hide some
					$.each(tabs.filter(vs).get().slice(1).reverse(), function(i) {
						if (width() < w) {
							return false;
						}
						$(this).hide();
					});
				} else if (tabs.filter(hs).length) {
					// if no visible tabs - show first
					if (!tabs.filter(vs).length) {
						// rte.log('show first')
						tabs.eq(0).show();
					}
					// show tabs while there is enough width
					$.each(tabs.filter(vls).nextAll(ts+hs).get().concat(tabs.filter(vfs).prevAll(ts+hs).get()), function() {
						if (width() + $(this).outerWidth(true) > w) {
							return false;
						}
						$(this).show();
					});
				}
				updateBtns();
			} 
		}
			
		/**
		 * Update buttons visibility and state
		 *
		 * @return void
		 */
		function updateBtns() {
			var hl = tabs.eq(0).is(hs),
				hr = tabs.filter(ls).is(hs);
				
			btns.addClass(dc);
			if (!hl && !hr) {
				btns.hide();
			} else {
				btns.show();
				hl && back.removeClass(dc);
				hr && fwd.removeClass(dc);
			}
		}
				
		rte.bind('open', function(e) {
			var d = rte.document(e.data.id), title, tab;

			// create tab if document exists and has not tab yet
			if (d && d.id && !tabs.filter('[rel="'+d.id+'"]').length) {
				title = d.title;
				tab = $('<li class="ui-state-default ui-corner-top '+tc+'" rel="'+d.id+'"><span title="'+title+'" class="elrte-ellipsis">'+title+'</span></li>')
					.hide()
					.hover(function() {
						$(this).toggleClass(hc);
					})
					.click(function(e) {
						rte.focus($(this).attr('rel'));
					});
					
				if (o.allowCloseDocs) {
					tab.prepend(
						$('<div class="'+ic+'close" title="'+rte.i18n('Close')+'"/>')
							.mousedown(function(e) {
								e.stopPropagation();
	 							e.preventDefault();
	 							if (confirm(rte.i18n('Close document')+' "'+title+'"?')) {
	 								rte.close(d.id);
	 							}
							})
					);
				}
				
				$this.append(tab);
				update();
			}
		})
		.bind('wysiwyg source', function(e) {
			// set tab active and visible
			if (tabs.removeClass(ac).filter('[rel="'+e.data.id+'"]').addClass(ac).is(hs)) {
				 showTab(e.data.id);
			}
		})
		.bind('close', function(e) {
			// remove tab
			tabs.filter('[rel="'+e.data.id+'"]').remove();
			update();
		})
		.bind('resize', function() {
			update();
		})
		;
	}
	
	return this.each(function() {
		if (!$(this).hasClass(tbc)) {
			init(this);
		}
	});

}

