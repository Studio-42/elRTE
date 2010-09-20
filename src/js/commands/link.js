(function($) {
	
	/**
	 * @class elRTE command.
	 * Create/edit anchor
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.link = function() {
		this.title = 'Link';
		this.simple = this.rte.commandConf('link', 'simple');

		/**
		 * Open dialog 
		 *
		 * @return void
		 **/
		this.dialog = function() {
			this.simple ? this._simpleDialog() : this._fullDialog();
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
		this._init = function() {
			var self = this,
				rte = this.rte,
				inputText = '<input type="text" />';
			
			this._src = {
				main : {
					href : {
						label   : rte.i18n('Link URL'),
						element : $(inputText)
					},
					bookmark : {
						label : rte.i18n('Bookmark'),
						element : $('<select/></select>')
					},
					title : {
						label   : rte.i18n('Title'),
						element : $(inputText)
					},
					target : {
						label   : rte.i18n('Target'),
						element : new rte.ui.select({ '' : rte.i18n('This window'), '_blank' : rte.i18n('New window')})
					}
				}
			}
			
			if (rte.xhtml) {
				delete this._src.main.target;
			}
			
			if (!rte.commandConf(this.name, 'disableAdvanced')) {
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
						element : n == 'dir' ? rte.ui.select({ '' : rte.i18n('Not set'), 'ltr' : rte.i18n('Left to right'), 'rtel' : rte.i18n('Right to left') }) : $(inputText)
					}
				});
			}
			
			if (!rte.commandConf(this.name, 'disableEvents')) {
				this._src.events = {}
				$.each(['blur', 'focus', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseleave', 'keydown', 'keypup'], function(i, n) {
					n = 'on'+n;
					self._src.events[n] = {
						label : rte.i18n(n),
						element : $(inputText)
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
				tb = new rte.ui.table(), 
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
							.append(e.element)
							.append(rte.ui.iconButton('ui-icon-mail-closed', rte.i18n('Link to e-mail address'), $.proxy(function() { this.val('mailto:').focus(); }, e.element)));
			
						if (rte.options.fmOpen) {
							b = rte.ui.button('ui-icon-folder-open', rte.i18n('Open file manger'), $.proxy(function() { this.rte.options.fmOpen( function(url) { this.src.main.href.val(url).change(); } ); }, this) );
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
			
			// create "Events" tab if allowed
			if (src.events) {
				tb = new rte.ui.table();
				$.each(src.events, function(a, e) {
					var ev = $(n).attr(a);
					if (ev)
						rte.log(''+ev)
					tb.append([e.label, e.element.val($(n).attr(a)||'')], true);
				});
				tabs.append(rte.i18n('Events'), tb.get());
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
			var self = this,
				sel  = this.sel,
				dom  = this.dom, 
				n    = this._find(), 
				attr = { href : '' }, 
				a;
			
			this.rte.focus();
			
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
			
			return true;
		}

		this._getState = function() {
			return this.dom.testSelection('link') ? this.STATE_ACTIVE : (this.sel.collapsed() ? this.STATE_DISABLE: this.STATE_ENABLE);
		}

	}
	
})(jQuery);