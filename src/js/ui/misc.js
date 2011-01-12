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
	var w = 0, c;
	
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

$.fn.sumOuterHeight = function(m) {
	var h = 0;
	
	this.each(function() {
		h += $(this).outerHeight(m);
	});
	
	return Math.ceil(h)
}

/**
 * jQuery plugin
 * Return maximum width for all elements in set
 *
 * @return Number
 */
$.fn.maxWidth = function() {
	var w = 0;
	
	this.each(function() {
		w = Math.max(w, $(this).width());
	});
	return Math.ceil(w);
}

/**
 * jQuery plugin
 * Return maximum height for all elements in set
 *
 * @return Number
 */
$.fn.maxHeight = function(m) {
	var h = 0;
	
	this.each(function() {
		h = Math.max(h, $(this).height());
	});
	return Math.round(h);
}

$.fn.maxZIndex = function() {
	var i = 0;
	
	this.each(function() {
		var z = $(this).css('z-index');
		if (z > 0 && z > i) {
			i = parseInt(z);
		}
	});
	return i;
}

$.fn.elrtetable = function(o) {
	
	o = $.extend({ cellspacing : 0 }, o);
	
	function cell(v, a, h) {
		var c, l;

		if (v.nodeName == 'TD' || v.nodeName == 'TH' || (''+v).indexOf('<td') == 0 || (''+v).indexOf('<th') == 0) {
			c = $(v);
		} else if (v[0] && (v[0].nodeName == 'TD' || v[0].nodeName == 'TH')) {
			c = v;
		}  else {
			c = $('<t'+(h ? 'h' : 'd')+'/>');
			if ($.isArray(v)) {
				l = v.length;
				while (l--) {
					c.prepend(v[l]);
				}
			} else {
				c.append(v);
			}
		}
		a && c.attr(a);
		return c;
	}
	
	function table(n) {
		return n && n[0] && n[0].nodeName == 'TABLE' ? $(n[0]) : false;
	}
	
	this.cell = function(v, a, h) {
		var tb = table(this), r;
		
		if (tb) {
			if (!(r = tb.find('tr:last')).length) {
				r = $('<tr/>').appendTo(tb);
			}
			r.append(cell(v, a, h))
		}
		return this;
	}
	
	this.row = function(v, ca, h, ra) {
		var tb = table(this), r = $('<tr/>'), v = $.isArray(v) ? v : [v];
		
		if (tb) {
			ra && r.attr(ra);
			$.each(v, function(i, n) {
				r.append(cell(n, ca, h));
			});
			tb.append(r);
		}
		return this;
	}
	
	return this.each(function() {
		if (this.nodeName == 'TABLE') {
			$(this).attr(o||{}).addClass('elrte-dialog-table').css('border-collapse', 'collapse');
		}
	})
	
}

$.fn.elrtetabs = function() {
	
	this.reset = function() {
		return this.each(function() {
			$(this).children('ul:first').children(':first').children().click();
		});
	}
	
	return this.each(function() {
		var $this = $(this).addClass('ui-tabs ui-widget ui-widget-content ui-corner-all'),
			nav   = $this.children('ul:first').addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all'),
			tabs  = nav.children().addClass('ui-state-default ui-corner-top'),
			cont  = nav.nextAll('[id]').addClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');
			
		tabs.children()
			.click(function(e) {
				var t = $(this),
					a = 'ui-tabs-selected ui-state-active',
					h = 'ui-tabs-hide';
				
				e.preventDefault();
			
				tabs.removeClass(a);
				t.parent().addClass(a);
				cont.addClass(h).filter(t.attr('href')).removeClass(h);
			})
			.eq(0)
			.click();
	});
	
}

/**
 * jQuery plugin
 * Create control to select/create css classes names
 * Used by "link", "image" commands etc.
 *
 * @return jQuery
 */
$.fn.elrtecssclassselect = function(o) {
	var self = this,
		/**
		 * Split string by spaces, remove duplicates and empty elements 
		 *
		 * @param  String  css classes string
		 * @return Array
		 */
		parse = function(v) {
			v = $.trim(''+v).split(/\s+/);

			return $.map(v, function(e, i) {
				return e && $.inArray(e, v) == i ? e : null;
			});
		},
		/**
		 * plugin config
		 *
		 * @type  Object
		 */
		o = $.extend({ 
			notsetText : 'Not set',
			addText    : 'New css class',
			escText    : 'Cancel',
			size       : 4 
		}, o);
	
	/**
	 * Overload jQuery method for current set.
	 * Remove all labels except first one.
	 *
	 * @return jQuery
	 */
	this.empty = function() {
		this.eq(0).children('label').slice(1).remove();
		return this;
	}
	
	/**
	 * Overload jQuery method for current set.
	 * Create label with checkbox for each css class declaration in first argument
	 *
	 * @param  String  css classes string
	 * @return jQuery
	 */
	this.append = function(v) {
		var l = this.eq(0),
			c = l.children('label').children(':checkbox'),
			d = l.children('div'), p;
		
		$.each(parse(v), function(i, cl) {
			!c.filter('[value="'+cl+'"]').length && d.before('<label><input type="checkbox" value="'+cl+'" /> <a class="'+cl+'">'+cl+'</a></label>');
		});
		
		if (!l.hasClass('elrte-cselect-fixed') && l.children('label').length >= o.size) {
			
			if (!l.parents('body').length) {
				p = l.parent();
				l.addClass('elrte-notvisible')
					.appendTo('body')
					.height(l.children('label:first').outerHeight(true)*o.size)
					.addClass('elrte-cselect-fixed')
					.scrollTop(0)
					.appendTo(p)
					.removeClass('elrte-notvisible');
			}
		}
		
		return this;
	}
	
	/**
	 * Overload jQuery method for current set.
	 * As setter: check all checkboxes for each css class declaration in first argument, if no one checkbox checked - check first one (not set)
	 * As getter: Return all checkboxes values in string seperated by space (valid css classes declaration)
	 *
	 * @param  String|undefined  css classes string
	 * @return jQuery|String
	 */
	this.val = function(v) {
		var c = this.eq(0).children('label').children(':checkbox'), 
			l;

		if (v === void(0)) {
			v = '';
			c.filter(':checked:not([disabled])').each(function() {
				v += $(this).val() + ' ';
			});
			return v;
		} else {
			c.removeAttr('checked');
			v = parse(v);
			l = v.length;
			while (l--) {
				v[l] && c.filter('[value="'+v[l]+'"]').attr('checked', 'checked');
			}

			if (!c.filter(':checked').length) {
				c.eq(0).attr('checked', true).change();
			} 
		}
	}
	
	return this.each(function() {
		var $this = $(this).addClass('ui-widget-content ui-corner-all elrte-cselect'),
			/**
			 * "not set" checkbox
			 *
			 * @type  jQuery
			 */
			ch = $('<input type="checkbox" value="" checked="checked"/>')
				.change(function() {
					var c = ch.parent().nextAll('label').children(':checkbox');
					ch.attr('checked') ? c.attr('disabled', 'disabled') : c.removeAttr('disabled');
				}),
			/**
			 * "add new class" link
			 *
			 * @type  jQuery
			 */
			link = $('<a href="#"><span class="ui-state-default elrte-cselect-icon-plus"><span class="ui-icon ui-icon-circle-plus"/></span> '+o.addText+'</a>')
				.click(function(e) {
					e.preventDefault();
					link.hide();
					input.show().focus();
					esc.show();
					$this.scrollTop(1000);
				}),
			/**
			 * text field for new class
			 *
			 * @type  jQuery
			 */
			input = $('<input type="text" class="ui-widget-content ui-corner-all elrte-input-wide"/>')
				.blur(function() {
					self.append(input.val()).val(self.val()+' '+input.val());
					reset();
				})
				.keydown(function(e) {
					if (e.keyCode == 13 || e.keyCode == 27) {
						e.stopImmediatePropagation();
						e.keyCode == 13 && self.append(input.val()).val(self.val()+' '+input.val());
						reset();
					}
				}),
			/**
			 * icon "inside" text field to cancel input 
			 *
			 * @type  jQuery
			 */
			esc = $('<a href="#" class="ui-state-default elrte-cselect-icon-close" title="'+o.escText+'"><span class="ui-icon ui-icon-circle-close"/></a>')
				.mousedown(function(e) {
					e.preventDefault();
					reset();
				}),
			/**
			 * Hide text field and show "add new class" link
			 *
			 * @return  void
			 */
			reset = function() {
				link.show();
				input.hide().val('');
				esc.hide();
			};

		$this.append($('<label> '+o.notsetText+'</label>').prepend(ch))
			.append($('<div/>').append(link).append(input.hide()).append(esc.hide()));
	});
}
