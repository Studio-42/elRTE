/**
 * @class elRTE command.
 * Create/edit anchor
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.link = function() {
	var self = this,
		rte = this.rte;
		
	/**
	 * Command description
	 * 
	 * @type String
	 */
	this.title = 'Link';

	/**
	 * Command configuration
	 * 
	 * @type Object
	 */
	this.conf = { 
		// allow edit popup window open parameters
		popup    : true,
		// allow edit advanced properies
		advanced : true, 
		// allow edit events
		events   : true,
		// force display link target options in xhtml mode
		target   : false,
		classes  : []
	};
	
	/**
	 * Object contains link edit controls (see _prepare())
	 * 
	 * @type Object
	 */
	this._attr = {};
	
	/**
	 * Dialog content
	 * 
	 * @type JQuery
	 */
	this._content = '';
	
	/**
	 * Links list control
	 * 
	 * @type JQuery
	 */
	this._links = $('<select/>');
	
	/**
	 * Bookmarks list
	 * 
	 * @type JQuery
	 */
	this._bookmarks = $('<select/>');

	this._fm = $('<span class="ui-state-default ui-corner-all elrte-fm-button"><span class="ui-icon ui-icon-folder-collapsed"/></span>');
	

	/**
	 * Dialog options
	 * 
	 * @type Object
	 */
	this._opts = { 
		title   : this.title, 
		width : 500,
		buttons : { } 
	};

	this._opts.buttons[rte.i18n('Apply')] = function() { 
			var attr = {};
			$(this).dialog('close');
			$.each(self._attr, function(n, a) {
				attr[n] = a.element.val();
			})
			self._exec(attr)
		};

	this._opts.buttons[rte.i18n('Cancel')] = function() { 
		$(this).dialog('close');
		rte.focus();
	};

	this._links.add(this._bookmarks)
		.change(function() {
			self._attr.href.element.val($(this).val());
		});


	/**
	 * Init this._attr, this._links, this._bookmarks and this._content
	 * 
	 * @return void
	 */
	this._prepare = function() {
		var self  = this,
			rte   = this.rte,
			fm    = rte.options.filemanager,
			conf  = this.conf,
			links = this._links,
			bm    = this._bookmarks,
			inp   = '<input type="text" class="ui-widget-content ui-corner-all elrte-input-wide"/>',
			reg   = /^([a-z0-9]{3,}:\/\/)|#/i,
			adv   = {
				id        : 'ID',
				// 'class'   : 'Css class',
				style     : 'Css style',
				dir       : 'Script direction',
				language  : 'Language',
				charset   : 'Charset',
				type      : 'Target MIME type',
				rel       : 'Relationship page to target (rel)',
				rev       : 'Relationship target to page (rev)',
				tabindex  : 'Tab index',
				accesskey : 'Access key'
			},
			evt  = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseleave', 'keydown', 'keyup', 'keypress', 'blur', 'focus'],
			tabs = {
				main : {
					label : rte.i18n('Properties'),
					element : $('<table/>').elrtetable()
				}
			};
			
		this._attr = {
			href : {
				label : $('<select>'
					+ '<option value="url">'+rte.i18n('Link URL')+'</option>'
					+ '<option value="mailto">'+rte.i18n('Email address')+'</option>'
					+ '<option value="link">'+rte.i18n('Link from list')+'</option>'
					+ '<option value="bookmark">'+rte.i18n('Bookmark')+'</option>'
					+ '</select>')
					.change(function() {
						var i = self._attr.href.element.hide(),
							v = i.val(),
							l = self._links.hide(),
							b = self._bookmarks.hide();
						self._fm.hide()
						switch ($(this).val()) {
							case 'url':
								if (!reg.test(v)) {
									i.val('http://');
								}
								i.show().focus();
								self._fm.show()
								break;
								
							case 'mailto':
								if (v.indexOf('mailto:') != 0) {
									i.val('mailto:').focus();
								}
								i.show().focus();
								break;
								
							case 'link':
								l.val(v).change().show().focus();
								break;
								
							case 'bookmark':
								b.val(v).change().show();
						}
					}),
				element : $(inp)
			},
			title : {
				label   : rte.i18n('Title'),
				element :  $(inp)
			},
			target : {
				label   : rte.i18n('Open link in'),
				element : $('<select  class="elrte-input-wide">'
					+ '<option value="">'+rte.i18n('Same window')+'</option>'
					+ '<option value="_blank">'+rte.i18n('New window')+'</option>'
					+ '</select>')
			},
			'class' :{
				label : rte.i18n('Css classes'),
				element :  rte.ui.classSelect()
			}
			
		};
		
		if (rte.xhtml && !conf.target) {
			delete this._attr.target;
		}
		
		// add Popup window tab if enabled
		if (conf.popup) {
			
			this._popup = {
				url        : $(inp),
				name       : $(inp),
				width      : $('<input type="text" size="5"/>'),
				height     : $('<input type="text" size="5"/>'),
				top        : $('<input type="text" size="5"/>'),
				left       : $('<input type="text" size="5"/>'),
				location   : $('<input type="checkbox"/>'),
				menubar    : $('<input type="checkbox"/>'),
				toolbar    : $('<input type="checkbox"/>'),
				status     : $('<input type="checkbox"/>'),
				scrollbars : $('<input type="checkbox"/>'),
				resizable  : $('<input type="checkbox"/>'),
				dependent  : $('<input type="checkbox"/>'),
				retfalse   : $('<input type="checkbox"/>')
			}
			
			tabs.popup = {
				label   : rte.i18n('Popup window'),
				element : $('<table/>').elrtetable()
			}
			var p = this._popup;
			var l = $('<label style="display:block"/>');
			var ch = $('<input type="checkbox"/>').change(function() {
				var inputs = $(this).parents('tr').eq(0).nextAll('tr').find('input'); 

				ch.attr('checked') 
					? inputs.removeAttr('disabled').removeClass('ui-state-disabled').eq(0).focus() 
					: inputs.attr('disabled', true).addClass('ui-state-disabled');
			})
			tabs.popup.element.cell($('<label/>').append(ch).append(' '+rte.i18n('Open link in popup window')), { colspan : 2 })
				.row(['<div class="ui-widget-content elrte-widget-content-separator"/>'], { colspan : 2 })
				.row(['URL', this._popup.url])
				.row([rte.i18n('Window name'), this._popup.name])
				.row([rte.i18n('Window size'), $('<div style="text-align:center"/>').append(this._popup.width).append(' x ').append(this._popup.height)])
				.row([rte.i18n('Window position'), this._popup.top.add('<span> x </span>').add(this._popup.left)])
				.row(['<div class="ui-widget-content elrte-widget-content-separator"/>'], { colspan : 2 })
				.row([$('<div/>').append(l.clone().append(p.location).append(' '+rte.i18n('Location bar'))), $('<div/>')])
			ch.change()
		}
		
		// add Advanced tab if enabled
		if (this.conf.advanced) {
			
			// append attributes
			$.each(adv, function(i, n) {
				self._attr[i] = {
					label   : rte.i18n(n),
					element : $(i == 'dir' ? '<select class="elrte-input-wide"><option value="">'+rte.i18n('Not set')+'</option><option value="ltr">'+rte.i18n('Left to right')+'</option><option value="rtl">'+rte.i18n('Right to left')+'</option></select>' : inp),
					pos     : 'advanced'
				};
			});
			
			// add tab
			tabs.advanced = {
				label   : rte.i18n('Advanced'),
				element : $('<table/>').elrtetable()
			};
		}
		
		// add Events tab if enabled
		if (conf.events) {
			// append attributes
			$.each(evt, function(i, n) {
				self._attr['_on'+n] = {
					label   : n,
					element : $(inp),
					pos     : 'events'
				};
			});
			// add tab
			tabs.events = {
				label   : rte.i18n('Events'),
				element : $('<table/>').elrtetable(),
				pos     : 'events'
			};
		}
		
		// add elements to tabs tables
		$.each(this._attr, function(n, a) {
			tabs[a.pos||'main'].element.row([a.label, a.element]);
		});
		
		// fill links list from config
		$.each(conf.links||[], function(i, l) {
			if (l && l[0] && l[1]) {
				links.append('<option value="'+l[0]+'">'+l[1]+'</option>');
			}
		});
		
		this._content = conf.advanced || conf.events || conf.popup ? rte.ui.tabs(tabs) : tabs.main.element;
		
		// add links and bookmarks lists
		this._attr.href.element.after(links).after(bm);
		
		// add button to open filemanager after url input field
		if (fm) {
			this._fm
				.hover(function(e) {
					$(this).toggleClass('ui-state-hover');
				})
				.click(function() {
					fm(function(url) {
						self._attr.href.label.val('url');
						self._attr.href.element.val(url);
					})
				});
			this._attr.href.element
				.css('width', '85%')
				.before(this._fm);
		}

		this._attr.href.label.children('[value="link"]')[links.children().length ? 'show' : 'hide']();
		
		delete this._prepare;
	}

	/**
	 * Open dialog
	 * 
	 * @return void
	 */
	this.dialog = function() {
		!this._content && this._prepare();
		
		var self  = this,
			rte   = this.rte,
			conf  = this.conf,
			link  = $(this._find() || this.dom.create('a')),
			href  = link.attr('href')||'',
			bm    = this._bookmarks.empty(),
			attr  = $.each(this._attr, function(n, a) { 
				var v = link.attr(n);
				
				n == 'class' && a.element.empty().append(conf.classes+' '+v);
				a.element.val(v); 
			}),
			label = attr.href.label, 
			val   = 'url';
	
		
		// find anchors and add to bookmarks list	
		$(rte.active.document.body)
			.find('a[name]')
			.each(function(i, l) {
				bm.append('<option value="#'+l.name+'">'+l.name+'</option>');
			});
			
		attr.href.label.children('[value="bookmark"]')[bm.children().length ? 'show' : 'hide']();
		
		// sync href label with value
		if (href.indexOf('mailto:') == 0) {
			val = 'mailto';
		} else if (href.indexOf('#') == 0 && bm.children('[value="'+href+'"]').length) {
			val = 'bookmark';
		} 
		label.val(val).change();
		
		// set first tab active
		this._content.reset && this._content.reset();
		// create dialog
		rte.ui.dialog($('<div/>').append(this._content), this._opts);
	}


	/**
	 * Return selected link if exists
	 *
	 * @return DOMElement
	 **/
	this._find = function() {
		var sel = this.sel,
			dom = this.dom,
			n   = sel.node(), l, ch;

		if ((n = dom.closestParent(n, 'link', true))) {
			return n;
		}

		n = sel.get(true).reverse();
		l = n.length;
		while (l--) {
			if (dom.is(n[l], 'link')) {
				return n[l];
			} else if ((ch = dom.closest(n[l], 'link')).length) {
				return ch.pop();
			}
		}
	}

	/**
	 * Create/update/remove link
	 * If there are several links in selection - works with first
	 *
	 * @param  Object|String  link attributes/link url
	 * @return void
	 **/
	this._exec = function(o) {
		var rte  = this.rte,
			sel  = this.sel,
			dom  = this.dom, 
			n    = this._find(), 
			attr = { href : '' }, 
			a;
		
		rte.focus();
		
		if (typeof(o) == 'object') {
			attr = $.extend(attr, o);
		} else {
			attr.href = ''+o;
		}
		
		if (!attr.href) {
			if (n) {
				n = dom.unwrap(n);
				sel.select(n[0], n[n.length-1]);
			}
		} else if (n) {
			n = $(n);
			$.each(attr, function(name, val) {
				val ? n.attr(name, val) : n.removeAttr(name);
			});
			sel.select(n[0]);
		} else {
			a = {};
			$.each(attr, function(name, val) {
				val && (a[name] = val);
			})
			dom.smartWrap(sel.get(), { wrap : function(n) { dom.wrap(n, { name : 'a', attr : a }); } });
		}
		rte.trigger('change');
	}

	/**
	 * Return command state
	 *
	 * @return Number
	 **/
	this._state = function() {
		return this.dom.testSelection('link') ? elRTE.CMD_STATE_ACTIVE : (this.sel.collapsed() ? elRTE.CMD_STATE_DISABLED: elRTE.CMD_STATE_ENABLED);
	}

}
