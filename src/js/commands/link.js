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
		// css classes list for links
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

	/**
	 * Dialog options
	 * 
	 * @type Object
	 */
	this._opts = { 
		title   : this.title, 
		width   : 500,
		buttons : { } 
	};

	/**
	 * Dialog button "Apply" callback
	 * 
	 * @type Function
	 */
	this._opts.buttons[rte.i18n('Apply')] = function() { 
			var attr = {};
			$(this).dialog('close');
			$.each(self._attr, function(n, a) {
				attr[n] = a.element.val();
			});
			self._exec(attr);
		};

	/**
	 * Dialog button "Cancel" callback
	 * 
	 * @type Function
	 */
	this._opts.buttons[rte.i18n('Cancel')] = function() { 
		$(this).dialog('close');
		rte.focus();
	};

	// add change event callback to links and bookmarks lists
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
			conf  = this.conf,
			fm    = conf.filemanager || rte.options.filemanager,
			links = this._links,
			bm    = this._bookmarks,
			reg   = /^([a-z0-9]{3,}:\/\/)|#/i,
			names = {
				popup : {
					name       : 'Window name',
					size       : 'Window size',
					position   : 'Window position',
					location   : 'Location bar',
					menubar    : 'Menu bar',
					toolbar    : 'Toolbar',
					statusbar  : 'Status bar',
					scrollbars : 'Scrollbars',
					resizable  : 'Resizable',
					dependent  : 'Dependent',
					retfalse   : 'Add return false',
				},
				advanced : {
					id        : 'ID',
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
				events : 'click,dblclick,mousedown,mousedown,mouseover,mouseout,mouseleave,keydown,keyup,keypress,blur,focus'.split(',')
			},
			textFull  = '<input type="text" class="ui-widget-content ui-corner-all elrte-input-wide"/>',
			textSmall = '<input type="text" class="ui-widget-content ui-corner-all" size="5"/>',
			checkbox  = '<input type="checkbox"/>',
			separator = '<div class="ui-widget-content elrte-widget-content-separator"/>',
			x         = '<span> x </span>',
			tabs      = {
				main : {
					label : rte.i18n('Properties'),
					element : $('<table/>').elrtetable()
				}
			},
			fmbutton = function(cb) {
				return fm 
					? $('<span class="ui-state-default ui-corner-all elrte-fm-button"><span class="ui-icon ui-icon-folder-collapsed"/></span>')
						.hover(function(e) {
							$(this).toggleClass('ui-state-hover');
						})
						.click(function() {
							if (!$(this).hasClass('ui-state-disabled')) {
								fm(cb);
							}
						})
					: false;
			},
			b;
			
		this._attr = {
			href : {
				label : $('<select><option value="url">'+rte.i18n('Link URL')+'</option><option value="mailto">'+rte.i18n('Email address')+'</option><option value="link">'+rte.i18n('Link from list')+'</option><option value="bookmark">'+rte.i18n('Bookmark')+'</option></select>')
					.change(function() {
						var i = self._attr.href.element.hide(),
							v = $.trim(i.val()),
							l = self._links.hide(),
							b = self._bookmarks.hide(),
							f = i.siblings('.elrte-fm-button').hide();

						switch ($(this).val()) {
							case 'url':
								if (!v || v.indexOf('mailto:') == 0) {
									i.val('http://');
								}
								i.show().focus();
								f.show();
								break;
								
							case 'mailto':
								if (v.indexOf('mailto:') != 0) {
									i.val('mailto:');
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
				element : $(textFull)
			},
			title : {
				label   : rte.i18n('Title'),
				element : $(textFull)
			},
			'class' :{
				label   : rte.i18n('Css classes'),
				element :  rte.ui.classSelect()
			}
		};
		
		// Create link target if editor in html mode or config required it
		if (!rte.xhtml || conf.target) {
			this._attr.target = {
				label   : rte.i18n('Open link in'),
				element : $('<select class="elrte-input-wide"><option value="">'+rte.i18n('Same window')+'</option><option value="_blank">'+rte.i18n('New window')+'</option></select>')
			}
		}
		
		// add Popup window tab if required
		if (conf.popup) {
			/**
			 * Store "Popup window"tab inputs
			 *
			 * @type  Object
			 */
			this._popup = {
				allow      : $('<input type="checkbox"/>')
					.change(function() {
						var inputs = $(this).parents('tr').eq(0).nextAll('tr').find('input,span.elrte-fm-button'); 

						$(this).attr('checked') 
							? inputs.removeAttr('disabled').removeClass('ui-state-disabled').eq(0).focus() 
							: inputs.attr('disabled', true).addClass('ui-state-disabled');
					}),
				url        : $(textFull),
				name       : $(textFull),
				width      : $(textSmall),
				height     : $(textSmall),
				top        : $(textSmall),
				left       : $(textSmall),
				location   : $(checkbox),
				statusbar  : $(checkbox),
				menubar    : $(checkbox),
				resizable  : $(checkbox),
				toolbar    : $(checkbox),
				dependent  : $(checkbox),
				scrollbars : $(checkbox),
				retfalse   : $(checkbox).attr('checked', true)
			}
			
			// create tabs
			tabs.popup = {
				label   : rte.i18n('Popup window'),
				element : $('<table/>').elrtetable()
			}

			// Append data into table
			tabs.popup.element
				.cell($('<label/>').append(this._popup.allow).append(' '+rte.i18n('Open link in popup window')), { colspan : 2 })
				.row(separator, { colspan : 2 })
				.row(['URL', this._popup.url])
				.row([rte.i18n(names.popup.name), this._popup.name])
				.row([rte.i18n(names.popup.size), this._popup.width.add(x).add(this._popup.height)])
				.row([rte.i18n(names.popup.position), this._popup.top.add(x).add(this._popup.left)])
				.row(separator, { colspan : 2 })
				.row([(function() {
					var p = 'location,statusbar,menubar,resizable,toolbar,dependent,scrollbars,retfalse'.split(','),
						l = p.length,
						r = [];
						
					while (l--) {
						r.unshift($('<label class="elrte-ib" style="width:50%"/>').append(self._popup[p[l]]).append(' '+rte.i18n(names.popup[p[l]])))
					}
					return r;	
				})()], { colspan : 2 });

			// if filemanager callback exists - add button after url
			if ((b = fmbutton(function(url) { self._popup.url.val(url) }))) {
				self._popup.url.before(b).css('width', '85%');
			}

			this._popup.allow.change();
		}
		
		// add Advanced tab if required
		if (this.conf.advanced) {
			
			// append attributes
			$.each(names.advanced, function(i, n) {
				self._attr[i] = {
					label   : rte.i18n(n),
					element : $(i == 'dir' ? '<select class="elrte-input-wide"><option value="">'+rte.i18n('Not set')+'</option><option value="ltr">'+rte.i18n('Left to right')+'</option><option value="rtl">'+rte.i18n('Right to left')+'</option></select>' : textFull),
					pos     : 'advanced'
				};
			});
			
			// add tab
			tabs.advanced = {
				label   : rte.i18n('Advanced'),
				element : $('<table/>').elrtetable()
			};
		}
		
		// add Events tab if required
		if (conf.events) {
			// append attributes
			$.each(names.events, function(i, n) {
				self._attr['_on'+n] = {
					label   : n,
					element : $(textFull),
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
		
		// append elements to tabs tables
		$.each(this._attr, function(n, a) {
			tabs[a.pos||'main'].element.row([a.label, a.element]);
		});
		
		// fill links list from config
		$.each(conf.links||[], function(i, l) {
			if (l && l[0] && l[1]) {
				links.append('<option value="'+l[0]+'">'+l[1]+'</option>');
			}
		});
		
		// hide option-links, if links list is empty
		this._attr.href.label.children('[value="link"]')[links.children().length ? 'show' : 'hide']();
		
		// add links and bookmarks lists
		this._attr.href.element.after(links).after(bm);
		
		// if filemanager callback exists - add buttons to open filemanager after link url
		if ((b = fmbutton(function(url) { self._attr.href.label.val('url').change(); self._attr.href.element.val(url); }))) {
			this._attr.href.element.css('width', '85%').before(b);
		}

		// create tabs widget if number of tabs> 1, otherwise use first tab element as dialog content
		this._content = conf.advanced || conf.events || conf.popup ? rte.ui.tabs(tabs) : tabs.main.element;
		
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
