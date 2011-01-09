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
		var c;

		if (v.nodeName == 'TD' || v.nodeName == 'TH' || (''+v).indexOf('<td') == 0 || (''+v).indexOf('<th') == 0) {
			c = $(v);
		} else if (v[0] && (v[0].nodeName == 'TD' || v[0].nodeName == 'TH')) {
			c = v;
		}  else {
			c = $('<t'+(h ? 'h' : 'd')+'/>').append(v);
		}
		return c.attr(a||{});
	}
	
	function table(n) {
		return n && n[0] && n[0].nodeName == 'TABLE' ? $(n[0]) : false;
	}
	
	this.cell = function(v, a, h) {
		var tb, r;
		
		if ((tb = table(this))) {
			if (!(r = tb.find('tr:last')).length) {
				r = $('<tr/>').appendTo(tb);
			}
			r.append(cell(v, a, h))
		}
		return this;
	}
	
	this.row = function(v, attr) {
		var tb, r;
		
		if ((tb = table(this))) {
			r = $('<tr/>').attr(attr||{});
			$.each(v||[], function(i, n) {
				r.append(cell(n));
			});
			r.appendTo(tb);
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


$.fn.elrtedinamicselect = function(o) {
	
	var self = this,
		sc = 'elrte-mdselect',
		lc = 'elrte-mdselect-list';
		
	o = $.extend({ notset : 'Not set', newval : 'Add value', split : /\s+/, size : 5 }, o);
	
	this.empty = function() {
		this.eq(0).children('label').slice(1).remove();
	}
	
	this.append = function(value) {
		var list = this.eq(0);
		
		$.each($.trim(''+value).split(/\s+/), function(i, v) {
			v && list.append('<label><input type="checkbox" value="'+v+'" checked="on" />'+v+'</label>');
		});
		return this;
	}
	
	
	

	
	this.val = function(v) {
		var list, label, button;
		return this
		if (v === void(0)) {
		
		} else {
			
		}
		return this
	}
	
	return this.each(function() {
		var 
			input = $('<input type="text" class="ui-widget-content ui-rounded-all elrte-input-wide"/>')
				.hide()
				.blur(function() {
					self.append($(this).val());
					reset();
				})
				.keydown(function(e) {
					if (e.keyCode == 13 || e.keyCode == 27) {
						e.preventDefault();
						e.stopImmediatePropagation();
						e.stopPropagation();
						e.keyCode == 13 && self.append($(this).val());
						reset()
					}
				}),
			button = $('<span class="ui-icon ui-icon-circle-plus elrte-mdselect-button" title="'+o.newval+'" />')
				.mousedown(function(e) {
					var l = $this.children('label');
					e.stopPropagation();
					e.preventDefault()
					if (button.hasClass('ui-icon-circle-close')) {
						input.hide().val('');
						l.show()
					} else {
						l.hide();
						input.show().focus();
					
					}
					button.toggleClass('ui-icon-circle-close')
				}),
			option = $('<label>'+o.notset+'</label>')
				.prepend(
					$('<input type="checkbox" value="" checked="on" />')
						.change(function() {
							var ch = option.nextAll('label').children(':checkbox');
							$(this).attr('checked') ? ch.attr('disabled', 'disabled') : ch.removeAttr('disabled');
						})
				),
				
			$this = $(this).addClass('elrte-mdselect').append(input).append(button).append(option),
			reset = function() {
				var l = $this.children('label').show(),
					c = l.children(':checkbox');
				
				input.hide().val('');
				
				button.removeClass('ui-icon-circle-close');
				
				c.eq(0).attr('checked') ? c.slice(1).attr('disabled', 'disabled') : c.slice(1).removeAttr('disabled')
				
			}
			;
		
		// $this.append(list).append(esc).append(input).append(button)
		
	})
	
	
}

$.fn.elrteadvselect = function(o) {
	o = $.extend({ label : 'other', split : /\s+/ }, o);
	
	return this.each(function() {
		if (this.nodeName == 'SELECT') {
			var $this = $(this),
				m     = !!$this.attr('multiple'),
				v     = '_value_'+Math.random(),
				opt   = $('<option value="'+v+'">'+o.label+'</option>');
				
			opt.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation()
				
				
				var input = $('<input type="text"/>');
				
				function set() {
					var v = $.trim(input.val()), i;
					
					if (v) {
						v = m && o.split ? v.split(o.split) : [v];
						for (i=0; i < v.length; i++) {
							opt.before('<option value="'+v[i]+'">'+v[i]+'</option>');
						}
						$this.val(m ? v.concat($this.val()) : v[0]);
					}
					input.remove();
					$this.show();
				}
				
				$this.hide().after(input)
				input.focus()
					.blur(set)
					.keyup(function(e) {
						e.keyCode == 13 && set();
					})
					.keydown(function(e) {
						if (e.keyCode == 27) {
							e.stopPropagation();
							input.remove();
							$this.show();
						}
					});
			})
				
			$(this).append(opt);
		}
	});
	
}


