/**
 * @class elRTE command.
 * Create/edit anchor
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.link = function() {
	this.title = 'Link';
	this.conf = { advanced : true };
	/**
	 * Open dialog 
	 *
	 * @return void
	 **/
	this.dialog = function() {
		return this._dialog()
		// this.conf.simple ? this._simpleDialog() : this._fullDialog();
		var self = this,
			tb = $('<table/>').elrtetable({'class' : 'elrte-dialog-table'}),
			link = this._find(),
			name = $('<input type="text" value="'+(link ? link.href : '')+'" />'),
			opts = {
				buttons : {}
			};
		
		opts.buttons.Cancel = function() { $(this).dialog('close') }
		opts.buttons.Apply = function() { self._exec({ href : name.val()}); $(this).dialog('close') }
		
		tb.row([this.rte.i18n('URL'), name])
		
		$('<div/>').append(tb).elrtedialog(opts)
	}

	this.main = {
		href : {
			label : $('<select>'
				+ '<option value="url">'+this.rte.i18n('Link URL')+'</option>'
				+ '<option value="mailto">'+this.rte.i18n('Email address')+'</option>'
				+ '<option value="link">'+this.rte.i18n('Link')+'</option>'
				+ '<option value="bookmark">'+this.rte.i18n('Bookmark')+'</option>'
				+ '</select>'),
			element : '<input type="text" />'
		},
		title : {
			label : this.rte.i18n('Title'),
			element :  '<input type="text" />'
		},
		target : {
			label : this.rte.i18n('Open link in'),
			element : '<select><option value="">'+this.rte.i18n('Same window')+'</option><option value="_blank">'+this.rte.i18n('New window')+'</option></select>'
		},
		'class' : {
			label : this.rte.i18n('Css class'),
			element :  '<input type="text" />'
		}
	}

	

	this._attr = function() {
		var self = this,
			rte = this.rte,
			conf = this.conf,
			cont = {
				main : {
					label : rte.i18n('Properties'),
					element : $('<table/>').elrtetable()
				}
			};
		
		this.attr = {
			href : {
				label : $('<select>'
					+ '<option value="url">'+rte.i18n('Link URL')+'</option>'
					+ '<option value="mailto">'+rte.i18n('Email address')+'</option>'
					+ '<option value="link">'+rte.i18n('Link')+'</option>'
					+ '<option value="bookmark">'+rte.i18n('Bookmark')+'</option>'
					+ '</select>'),
				element : $('<input type="text" />')
			},
			title : {
				label : rte.i18n('Title'),
				element :  $('<input type="text" />')
			},
			target : {
				label : rte.i18n('Open link in'),
				element : $('<select>'
					+ '<option value="">'+rte.i18n('Same window')+'</option>'
					+ '<option value="_blank">'+rte.i18n('New window')+'</option>'
					+ '</select>')
			},
			'class' : {
				label : rte.i18n('Css class'),
				element :  $('<input type="text" />')
			}
		};
		
		if (this.conf.advanced) {
			this.attr.id = {
				label : 'ID',
				element : $('<input type="text" />'),
				pos : 'advanced'
			};
			this.attr.style = {
				label : rte.i18n('Css style'),
				element : $('<input type="text" />'),
				pos : 'advanced'
			};
			this.attr.dir = {
				label : rte.i18n('Script direction'),
				element : $('<select>'
					+ '<option value="">'+rte.i18n('Not set')+'</option>'
					+ '<option value="ltr">'+rte.i18n('Left to right')+'</option>'
					+ '<option value="rtl">'+rte.i18n('Right to left')+'</option>'
					+ '</select>'),
				pos : 'advanced'
			};
			
			cont.advanced = {
				label : rte.i18n('Advanced'),
				element : $('<table/>').elrtetable()
			}
			
			// $.each(['id', 'style', 'dir'], function(i, n) {
			// 	cont.advanced.element.row([self.attr[n].label, self.attr[n].element])
			// })
		}
		
		if (conf.events) {
			this.attr._onclick = {
				label : 'onclick',
				element : $('<input type="text" />'),
				pos : 'events'
			};
			this.attr._ondblclick = {
				label : 'ondblclick',
				element : $('<input type="text" />'),
				pos : 'events'
			}
			cont.events = {
				label : rte.i18n('Events'),
				element : $('<table/>').elrtetable(),
				pos : 'events'
			}
		}
		
		$.each(this.attr, function(n, a) {
			cont[a.pos||'main'].element.row([a.label, a.element])
		})
		
		this.dialogContent = rte.ui.tabs(cont)
		
	}

	this._init = function() {

		if (this.rte.xhtml && !this.conf.target) {
			delete this.main.target;
		}
	}

	this._dialog = function() {
		var self = this,
			rte = this.rte,
			conf = this.conf,
			content = {
				main : {
					label : rte.i18n('Properties'),
					element : $('<table/>').elrtetable()
				},
				advanced : {
					label : rte.i18n('Advanced'),
					element : $('<table/>').elrtetable()
				},
				events : {
					label : rte.i18n('Events'),
					element : $('<table/>').elrtetable()
				},
			},
			link = $(this._find() || this.dom.create('a')),
			links = (function() {
				var ln = $('<select><option value="">'+rte.i18n('Select link')+'</option></select>');
				$.each(conf.links||[], function(i, l) {
					ln.append('<option value="'+l[0]+'">'+l[1]+'</option>')
				});
				return ln.children().length > 1 ? ln.hide() : '';
			})(),
			bookmarks = (function() {
				var bm = $('<select><option value="">'+rte.i18n('Select bookmark')+'</option></select>');
				$(rte.active.document.body).find('a[name]').each(function(i, l) {
					if (!l.href) {
						bm.append('<option value="#'+l.name+'">'+l.name+'</option>');
					}
				});
				return bm.children().length > 1 ? bm.hide() : '';
			})(),
			attr = {},
			opts = { buttons: {}},
			c
			;

		if (!this.attr) {
			this._attr();
		}

		this.attr.href.label.children('[value="link"]')[links ? 'show' : 'hide']();
		this.attr.href.label.children('[value="bookmark"]')[bookmarks ? 'show' : 'hide']();
			
		$.each(this.attr, function(n, a) {
			a.element.val(link.attr(n));
		})
		
		// if (content.advanced || content.events) {
		// 	c = rte.ui.tabs(content)
		// } else {
		// 	c = content.main
		// }
		
		opts.buttons[rte.i18n('Cancel')] = function() { $(this).dialog('close') }
		opts.buttons[rte.i18n('Apply')] = function() { $(this).dialog('close') }
		
		$('<div/>').append(this.dialogContent).elrtedialog(opts);
	}

	this._dialog_ = function() {
		var self = this,
			rte = this.rte, 
			link = $(this._find() || this.dom.create('a')),
			tb = $('<table/>').elrtetable(),
			type = $('<select>'
				+'<option value="url">'+rte.i18n('Link URL')+'</option>'
				+'<option value="mailto">'+rte.i18n('Email address')+'</option>'
				+'</select>'),
			links = $('<select><option value="">'+rte.i18n('Select link')+'</option></select>').hide(),
			bookmarks = $('<select><option value="">'+rte.i18n('Select bookmark')+'</option></select>').hide(),
			attr = {
				href    : $('<input type="text" />').val(link.attr('href')),
				title   : $('<input type="text" />').val(link.attr('title')),
				target  : $('<select></select>').val(link.attr('target')),
				'class' : $('<input type="text" />').val(link.attr('class'))
			},
			anchors = (function() {
				var a = [];
				$(rte.active.document.body).find('a[name]').each(function() {
					if (!this.href) {
						a.push(this.name)
					}
				});
				return a;
			})(),
			opts = { buttons : {} };
		
		if (this.conf.links && this.conf.links.length) {
			$.each(this.conf.links, function() {
				links.append('<option value="'+this[0]+'">'+this[1]+'</option>')
			});
			type.append('<option value="link">'+rte.i18n('Link')+'</option>')
		}
		
		if (anchors.length) {
			$.each(anchors, function() {
				bookmarks.append('<option value="#'+this+'">'+this+'</option>');
			});
			type.append('<option value="bookmark">'+rte.i18n('Bookmark')+'</option>')
		}
		
		links.add(bookmarks).change(function() {
			attr.href.val($(this).val());
		})
		
		type.change(function() {
			var h = attr.href,
				v = h.val();
			
			// $(this).parent().next().children
			
			attr.href.add(links).add(bookmarks).hide()
			
			switch ($(this).val()) {
				case 'url':
					if (!(/^[a-z0-9]{3,}:/i.test(v)) || v.indexOf('#') != 0) {
						h.val('http://');
					}
					h.show();
					break;
					
				case 'mailto':
					if (v.indexOf('mailto:') != 0) {
						h.val('mailto:');
					}
					h.show();
					break;
					
				case 'link':
					links.show().val(v);
					break;
					
				case 'bookmark':
					bookmarks.show().val(v);
					break;
			}
		})
		
			
		tb.row([type, attr.href.add(links).add(bookmarks)]);
		tb.row(['title', attr.title]);
		tb.row(['Class', attr['class']]);
		
		opts.buttons[rte.i18n('Cancel')] = function() { $(this).dialog('close'); }
		opts.buttons[rte.i18n('Apply')] = function() { 
			var a = {
				href : attr.href.val(),
				title : attr.title.val(),
				'class' :attr['class'].val()
			}
			$(this).dialog('close'); 
			self._exec(a)
		}
		
		$('<div/>').append(tb).elrtedialog(opts);
		if (!link[0].href) {
			type.change()
		}
	}

	/**
	 * Return selected anchor if exists
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
	 * Create data for dialog
	 *
	 * @return void
	 **/
	this._init_ = function() {
		var self  = this,
			rte   = this.rte,
			input = '<input type="text" />';
		
		this._src = {
			main : {
				href : {
					label   : rte.i18n('Link URL'),
					element : $(input)
				},
				bookmark : {
					label : rte.i18n('Bookmark'),
					element : $('<select/></select>')
				},
				title : {
					label   : rte.i18n('Title'),
					element : $(input)
				}
			}
		}
		
		if (!rte.xhtml) {
			this._src.main.target = {
				label   : rte.i18n('Target'),
				element : new rte.ui.select({ '' : rte.i18n('This window'), '_blank' : rte.i18n('New window') })
			}
		}
		
		if (this.conf.advanced) {
			this._src.adv = {};
			var o = {
				id        : 'ID',
				'class'   : 'Css class',
				style     : 'Css style',
				lang      : 'Language',
				charset   : 'Charset',
				dir       : 'Script direction',
				type      : 'Target MIME type',
				rel       : 'Relationship page to target (rel)',
				rev       : 'Relationship target to page (rev)',
				tabindex  : 'Tab index',
				accesskey : 'Access key'
			};
			$.each(o, function(n, l) {
				self._src.adv[n] = {
					label : rte.i18n(l),
					element : n == 'dir' 
						? rte.ui.select({ '' : rte.i18n('Not set'), 'ltr' : rte.i18n('Left to right'), 'rtel' : rte.i18n('Right to left') }) 
						: $(input)
				}
			});
		}
		
	}
	
	/**
	 * Return dialog options
	 *
	 * @param  Function  Ok button callback
	 * @return Object
	 **/
	this._dialogOpts = function(cb) {
		var opts = { title : this.rte.i18n(this.title), buttons : {} };
		
		opts.buttons[this.rte.i18n('Apply')] = cb;
		opts.buttons[this.rte.i18n('Cancel')] = function() { $(this).dialog('close') };
		return opts;
	}
	
	/**
	 * Open dialog for only link url
	 *
	 * @return void
	 **/
	this._simpleDialog = function() {
		var self = this,
			rte  = this.rte,
			n    = $(this._find()||document.createElement('a')),
			url  = $('<input type="text"/>').val(n.attr('href')||''),
			tb   = new rte.ui.table().append([rte.i18n('Link URL'), url]),
			opts = this._dialogOpts( function() { self._exec(url.val()); $(this).dialog('close'); } );

		new rte.ui.dialog(opts).append(tb.get()).open();
	}

	/**
	 * Open full featured dialog
	 *
	 * @return void
	 **/
	this._fullDialog = function() {
		var self = this,
			rte  = this.rte,
			n    = $(this._find()||document.createElement('a')),
			bm   = this.dom.find(rte.active.document.body, 'anchor'),
			tabs = new rte.ui.tabs(), 
			tb   = new rte.ui.table(), 
			opts = opts = this._dialogOpts(function() {
				var attr = {};
				$.each(self._src, function(i, group) {
					$.each(group, function(a, e) {
						attr[a] = e.element.val();
					});
				});
				$(this).dialog('close');
				self._exec(attr);
			}),
			d = new rte.ui.dialog(opts), 
			src, i, opts, itb, b;
			
		if (!this._src) {
			this._init();
		}
		src = this._src;
		
		// create "Properties" 
		$.each(src.main, function(attr, e) {
			if (attr == 'bookmark') {
				if (!bm.length) {
					return;
				}
				b = { '' : rte.i18n('Select bookmark') };
				for (i = 0; i < bm.length; i++) {
					b['#'+bm[i].name] = bm[i].name;
				}
				e.element = rte.ui.select(b, $.proxy(function() { this.href.element.val(this.bookmark.element.val()) }, src.main));
				tb.append([e.label, e.element], true);
				attr = 'href';
			} else {
				if (attr == 'href') {
					itb = new rte.ui.table()
						.append(e.element);

		
					if (rte.options.fmOpen) {
						b = rte.ui.jqIconButton('ui-icon-folder-open', rte.i18n('Open file manger'), $.proxy(function() { this.rte.options.fmOpen( function(url) { this.src.main.href.val(url).change(); } ); }, self) );
						itb.append(b);
					}
					tb.append([e.label, itb.get()]);
				} else {
					tb.append([e.label, e.element], true);
				}
			}
			e.element.val($(n).attr(attr)||'');
		});

		tabs.append(rte.i18n('Properties'), tb.get());
		
		// create "Advanced" tab if allowed
		if (src.adv) {
			tb = new rte.ui.table();
			$.each(src.adv, function(a, e) {
				tb.append([e.label, e.element.val($(n).attr(a)||'')], true);
			});
			tabs.append(rte.i18n('Advanced'), tb.get());
		}
		
		d.append(tabs.get()).open();
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

	this._state = function() {
		return this.dom.testSelection('link') ? elRTE.CMD_STATE_ACTIVE : (this.sel.collapsed() ? elRTE.CMD_STATE_DISABLED: elRTE.CMD_STATE_ENABLED);
	}

}
