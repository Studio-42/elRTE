
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
