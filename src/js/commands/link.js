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
		target   : false
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
		var self = this,
			rte  = this.rte,
			conf = this.conf,
			links = this._links,
			bm   = this._bookmarks,
			reg  = /^([a-z0-9]{3,}:\/\/)|#/i,
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
						
						switch ($(this).val()) {
							case 'url':
								if (!reg.test(v)) {
									i.val('http://');
								}
								i.show().focus();
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
				element : $('<input type="text" />')
			},
			title : {
				label   : rte.i18n('Title'),
				element :  $('<input type="text" />')
			},
			target : {
				label   : rte.i18n('Open link in'),
				element : $('<select>'
					+ '<option value="">'+rte.i18n('Same window')+'</option>'
					+ '<option value="_blank">'+rte.i18n('New window')+'</option>'
					+ '</select>')
			}
			
		};
		
		if (rte.xhtml && !conf.target) {
			delete this._attr.target
		}
		
		if (conf.popup) {
			tabs.popup = {
				label   : rte.i18n('Popup window'),
				element : $('<table/>').elrtetable()
			}
		}
		
		if (this.conf.advanced) {
			this._attr.id = {
				label   : 'ID',
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			
			this._attr['class'] = {
				label   : rte.i18n('Css class'),
				element :  $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.style = {
				label   : rte.i18n('Css style'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.dir = {
				label   : rte.i18n('Script direction'),
				element : $('<select>'
					+ '<option value="">'+rte.i18n('Not set')+'</option>'
					+ '<option value="ltr">'+rte.i18n('Left to right')+'</option>'
					+ '<option value="rtl">'+rte.i18n('Right to left')+'</option>'
					+ '</select>'),
				pos     : 'advanced'
			};
			this._attr.language = {
				label   : rte.i18n('Language'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.language = {
				label   : rte.i18n('Charset'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.type = {
				label   : rte.i18n('Target MIME type'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.rel = {
				label   : rte.i18n('Relationship page to target (rel)'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.rev = {
				label   : rte.i18n('Relationship target to page (rev)'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.tabindex = {
				label   : rte.i18n('Tab index'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			this._attr.accesskey = {
				label   : rte.i18n('Access key'),
				element : $('<input type="text" />'),
				pos     : 'advanced'
			};
			
			tabs.advanced = {
				label   : rte.i18n('Advanced'),
				element : $('<table/>').elrtetable()
			}
			
		}
		
		if (conf.events) {
			this._attr._onclick = {
				label   : 'onclick',
				element : $('<input type="text" />'),
				pos     : 'events'
			};
			this._attr._ondblclick = {
				label   : 'ondblclick',
				element : $('<input type="text" />'),
				pos     : 'events'
			}
			
			tabs.events = {
				label   : rte.i18n('Events'),
				element : $('<table/>').elrtetable(),
				pos     : 'events'
			}
		}
		
		$.each(this._attr, function(n, a) {
			tabs[a.pos||'main'].element.row([a.label, a.element])
		});
		
		// fill links list from config
		$.each(conf.links||[], function(i, l) {
			if (l && l[0] && l[1]) {
				links.append('<option value="'+l[0]+'">'+l[1]+'</option>');
			}
		});
		
		this._content = conf.advanced || conf.events || conf.popup ? rte.ui.tabs(tabs) : tabs.main.element;
		
		this._attr.href.element.after(links).after(bm);

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
			attr  = $.each(this._attr, function(n, a) { a.element.val(link.attr(n));	}),
			label = attr.href.label;
		
		// find anchors and add to bookmarks list	
		$(rte.active.document.body)
			.find('a[name]')
			.each(function(i, l) {
				rte.log(l)
				bm.append('<option value="#'+l.name+'">'+l.name+'</option>');
			});
			
		attr.href.label.children('[value="bookmark"]')[bm.children().length ? 'show' : 'hide']();
		
		// sync href label with value
		if (href.indexOf('mailto:') == 0) {
			label.val('mailto');
		} else if (href.indexOf('#') == 0 && bm.children('[value="'+href+'"]').length) {
			label.val('bookmark');
		} else {
			label.val('url');
		}
		label.change();
		
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
