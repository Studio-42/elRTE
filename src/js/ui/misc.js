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

$.fn.elrtetabs = function(o) {
	
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
				if (o.click) {
					// var e = $.Event()
					o.click(e)
				}
			})
			.eq(0)
			.click();
	});
	
}

/*
 * jQuery.elrtemselect plugin 
 * modified jQuery.multiselect plugin http://www.std42.ru/jquery-multiselect/
 * 
 * Form control: allow select several values from list and add new value(s) to list
 *
 */
$.fn.elrtemselect = function(opts) {
	var o = $.extend({}, $.fn.elrtemselect.defaults, opts||{});
	
	this.filter('select[multiple]:not(.elrtemselect-src)').each(function() {
		var select = $(this).addClass('elrtemselect-src').hide(), 
			size   = select.attr('size') > 0 ? select.attr('size') : o.size,
			items  = (function() {
				var str = '';
				
				select.children('option').each(function(i, option) {
					option = $(option);
					
					str += o.item
						.replace(/%value%/gi,  option.val())
						.replace(/%checked%/i, option.attr('selected') ? 'checked="checked"' : '')
						.replace(/%label%/gi,  option.html());
				})
				return str;
			})(),
			html = o.layout
					.replace(/%items%/gi, items)
					.replace(/%addText%/gi, o.addText)
					.replace(/%cancelText%/gi, o.cancelText)
					.replace(/%inputTitle%/gi, o.inputTitle),
			widget = $(html)
				.insertAfter(this)
				.delegate(':checkbox', 'change', function() {
					var checkbox = $(this);
					select.children('option[value="'+checkbox.val()+'"]').attr('selected', !!checkbox.attr('checked'));
				})
				,
			list = widget.is('.elrtemselect-list') ? widget : widget.find('.elrtemselect-list'),
			buttonAdd = widget.find('.elrtemselect-button-add')
				.click(function(e) {
					e.preventDefault();
					o.toggleAddButton && buttonAdd.hide();
					container.show();
					input.focus();
					if (input.parents('.elrtemselect-list').length) {
						list.scrollTop(list.height());
					}
				})
				.hover(function() {
					buttonAdd.children('.elrtemselect-button-add-icon').toggleClass('ui-state-hover');
				}),
			container = widget.find('.elrtemselect-input-container'),
			input  = container.find(':text.elrtemselect-input')
				.change(function(e) {
					append(input.val());
				})
				.blur(function() {
					reset();
				})
				.bind($.browser.opera ? 'keypress' : 'keydown', function(e) {
					var c = e.keyCode;
					
					if (c == 13 || c == 27) {
						e.preventDefault();
						e.stopImmediatePropagation();
						c == 13 ? input.change() : reset();
					}
				}),
			buttonCancel = container.find('.elrtemselect-button-cancel')
				.mousedown(function(e) {
					input.val('');
				})
				.hover(function() {
					buttonCancel.toggleClass('ui-state-hover');
				}),
			append = function(v) {
				$.each(typeof(o.parse) == 'function' ? o.parse(v) : [$.trim(v)], function(i, v) {
					var item;
					
					if (v && !select.children('[value="'+v+'"]').length) {
						item = $(o.item.replace(/%value%|%label%/gi, v)).find(':checkbox').attr('checked', true).end();

						list.children('.elrtemselect-list-item').length
							? list.children('.elrtemselect-list-item:last').after(item)
							: list.prepend(item);

						select.append('<option value="'+v+'" selected="selected">'+v+'</option>');
					}
				});
				reset();
				list.scrollTop(list.height());
			},
			reset = function() {
				var ch = select.children(), p;
				
				input.val('');
				container.hide();
				buttonAdd.show();
				
				list[list.children().length ? 'show' : 'hide']();
				if (ch.length >= size && !list.hasClass('elrtemselect-fixed')) {
					if (list.is(':visible')) {
						list.height(list.children('.elrtemselect-list-item:first').outerHeight(true) * size);
					} else {
						p = list.parent();
						list.addClass('elrte-notvisible')
							.appendTo('body')
							.height(list.children('.elrtemselect-list-item:first').outerHeight(true)*o.size)
							.scrollTop(0)
							.appendTo(p)
							.removeClass('elrte-notvisible');
					}
					list.addClass('elrte-cselect-fixed');
					if ($.browser.msie) {
						container.css('margin-right', '1em');
					}
				}
			};
			
			if (o.itemHoverClass) {
				list.delegate('.elrtemselect-list-item', 'hover', function() {
					$(this).toggleClass(o.itemHoverClass);
				});
			}
			reset();

	});
	
	if (opts == 'destroy') {
		this.eq(0).removeClass('elrtemselect-src').next('.elrtemselect').remove();
	}
	
	return this;
	
}

/**
 * jQuery.multiselect default options
 *
 * @type  Object
 */
$.fn.elrtemselect.defaults = {
	/**
	 * Default widget layout template
	 *
	 * @type  String
	 */
	layout : '<div class="ui-widget ui-widget-content ui-corner-all elrtemselect elrtemselect-list">'
				+'%items%'
				+'<a href="#" class="elrtemselect-button-add"><span class="ui-state-default elrtemselect-button-add-icon"><span class="ui-icon ui-icon-plusthick"/></span>%addText%</a>'
				+'<div class="elrtemselect-input-container">'
					+'<input type="text" class="ui-widget-content ui-corner-all elrtemselect-input" title="%inputTitle%"/>'
					+'<a href="#" class="ui-state-default elrtemselect-button-cancel" title="%cancelText%"><span class="ui-icon ui-icon-closethick"/></a>'
				+'</div>'
			+'</div>',
	/**
	 * List item layout template
	 *
	 * @type  String
	 */
	item : '<div class="elrtemselect-list-item"><label><input type="checkbox" value="%value%" %checked%/>%label%</label></div>',
	/**
	 * Text for "New value" button/link
	 *
	 * @type  String
	 */
	addText : 'New value',
	/**
	 * Text for "Cancel" icon in text field
	 *
	 * @type  String
	 */
	cancelText : 'Cancel',
	/**
	 * Text for input tooltip
	 *
	 * @type  String
	 */
	inputTitle : 'Separate values by space',
	/**
	 * Widget height, owerwrited by select "size" attribute
	 *
	 * @type  Number
	 */
	size : 5,
	/**
	 * Hover class for list items
	 *
	 * @type  String
	 */
	itemHoverClass : 'ui-state-hover',
	/**
	 * Hide "New value" button when text field is visible
	 *
	 * @type  Boolean
	 */
	toggleAddButton : true,
	/**
	 * Parse new list value and return values array
	 * By default - split value by space(s)
	 *
	 * @param   String  user input
	 * @return  Array
	 */
	parse : function(v) { return v.split(/\s+/) }
}
