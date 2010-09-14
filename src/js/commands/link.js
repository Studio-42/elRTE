(function($) {
	
	elRTE.prototype.ui.table = function(attr) {
		this.table = $('<table/>');
		this.row = false;
		
		if (attr) {
			this.table.attr(attr);
		}
		
		this.add = function(el, newRow) {
			var i;
			
			if (newRow || !this.row) {
				this.row = $('<tr/>').appendTo(this.table);
			}
			if (!$.isArray(el)) {
				this.row.append($('<td/>').append(el));
			} else {
				for (i = 0; i < el.length; i++) {
					this.row.append($('<td/>').append(el[i]));
				}
			}
			return this;
		}
		
		this.get = function() {
			return this.table;
		}
	}
	
	elRTE.prototype.ui.tabs = function() {
		this.nav = $('<ul/>');
		this.tabs = $('<div class="elrte-tabs"/>').append(this.nav);
		this.cnt = 1;
		
		this.add = function(title, cont) {
			this.nav.append($('<li><a href="#elrte-tab-'+this.cnt+'">'+title+'</a></li>'));
			this.tabs.append($('<div id="elrte-tab-'+this.cnt+'""/>').append(cont));
			this.cnt++;
			return this;
		}

		this.get = function() {
			return this.tabs;
		}

	}
	
	elRTE.prototype.ui.dialog = function(o) {
		var self =this;
		
		this.dialog = $('<div/>').dialog($.extend({}, { modal : true, autoOpen : false, buttons : {} }, o))
			.bind('dialogclose', function(e, ui) {
				$(this).dialog('destroy').remove();
			}).bind('dialogopen', function() {
				$(this).find('.elrte-tabs').tabs();
			});
		
		this.append = function(o) {
			this.dialog.append(o);
			return this;
		}
		
		this.open = function() {
			this.dialog.dialog('open');
		}
		
	}
	
	
	
	/**
	 * @class elRTE command.
	 * Create/edit anchor
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.link = function() {
		this.title = 'Link';
		this.quick = this.rte.commandConf('link', 'quick');

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
		 * Open dialog 
		 *
		 * @return void
		 **/
		this.dialog = function() {
			this.quick ? this._quickDialog() : this._fullDialog();
		}

		/**
		 * Open dialog for only link url
		 *
		 * @return void
		 **/
		this._quickDialog = function() {
			var self = this,
				rte  = this.rte,
				n    = this._find(),
				d    = $('<div/>'),
				url;
			
			function ok() {
				self._exec(url.val());
				d.dialog('close');
			}
			
			url = $('<input type="text" size="27" />').val(n ? $(n).attr('href') : '').keyup(function(e) { e.keyCode == 13 && ok(); });
			
			d.append(rte.i18n('Link URL')+' ').append(url).dialog({
				modal   : true,
				width   : 350,
				title   : rte.i18n(self.title),
				buttons : {
					Ok : ok,
					Cancel : function() { $(this).dialog('close'); }
				}
			});
		}

		this._fullDialog = function() {
			var self = this,
				rte  = this.rte,
				n    = this._find(),
				d    = $('<div/>'),
				tb   = new rte.ui.table(),
				src = {
					url : {
						label : rte.i18n('Link URL'),
						element : $('<input type="text" size="27" />').val(n ? $(n).attr('href') : '').keyup(function(e) { e.keyCode == 13 && ok(); })
					},
					title : {
						label : rte.i18n('Title'),
						element : $('<input type="text" size="27" />').keyup(function(e) { e.keyCode == 13 && ok(); })
					},
					target : {
						label : rte.i18n('Title'),
						element : $('<select name="target"><option val="">'+rte.i18n('This window')+'</option><option val="_blank">'+rte.i18n('New window')+'</option></select>')
					}
				};
				
				var tabs = '<div>'
					+ '<ul>'
					+ '<li><a href="#main">Properties</a></li>'
					+ '<li><a href="#adv">Advanced</a></li>'
					+'</ul>'
					+'</div>'
								
				if (rte.xhtml) {
					// delete src.target;
				}

				$.each(src, function(i, o) {
					tb.add([o.label, o.element], true);
				})

				// tabs = $(tabs).append('<div id="main">main</div><div id="adv">adv</div>')
				
				// tb =new rte.ui.table();
				// tb.add('test')
				// tabs.append(($('<div id="tab-adv"/>').append(tb.get())))
				
				// tabs = $('<div id="tabs"><ul><li><a href="#tabs-1">Nunc tincidunt</a></li><li><a href="#tabs-2">Proin dolor</a></li><li><a href="#tabs-3">Aenean lacinia</a></li></ul><div id="tabs-1"><p>Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.</p></div><div id="tabs-2"><p>Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut dolor. Aenean aliquet fringilla sem. Suspendisse sed ligula in ligula suscipit aliquam. Praesent in eros vestibulum mi adipiscing adipiscing. Morbi facilisis. Curabitur ornare consequat nunc. Aenean vel metus. Ut posuere viverra nulla. Aliquam erat volutpat. Pellentesque convallis. Maecenas feugiat, tellus pellentesque pretium posuere, felis lorem euismod felis, eu ornare leo nisi vel felis. Mauris consectetur tortor et purus.</p></div><div id="tabs-3"><p>Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.</p><p>Duis cursus. Maecenas ligula eros, blandit nec, pharetra at, semper at, magna. Nullam ac lacus. Nulla facilisi. Praesent viverra justo vitae neque. Praesent blandit adipiscing velit. Suspendisse potenti. Donec mattis, pede vel pharetra blandit, magna ligula faucibus eros, id euismod lacus dolor eget odio. Nam scelerisque. Donec non libero sed nulla mattis commodo. Ut sagittis. Donec nisi lectus, feugiat porttitor, tempor ac, tempor vitae, pede. Aenean vehicula velit eu tellus interdum rutrum. Maecenas commodo. Pellentesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit.</p></div></div>')
				
				tabs = new rte.ui.tabs();
				tabs.add('Main', 'main').add('Anvanced', 'adv')
				tabs = tabs.get()
				
				var dialog = new rte.ui.dialog()
				dialog.append(tabs)
				dialog.open()
				
				// $('body').append(tabs)
				// tabs.tabs()
				// d.append(tabs).dialog({
				// 	modal   : true,
				// 	width   : 350,
				// 	title   : rte.i18n(self.title),
				// 	buttons : {
				// 		Ok : function() { $(this).dialog('close'); },
				// 		Cancel : function() { $(this).dialog('close'); }
				// 	}
				// });
				// tabs.tabs()
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
				dom  = this.dom, n, attr = { href : '' };
			
			this.rte.focus();
			
			if (typeof(o) == 'object') {
				attr = $.extend(attr, o);
			} else {
				attr.href = ''+o;
			}
			
			n = this._find();
			
			if (!attr.href) {
				if (n) {
					n = dom.unwrap(n);
					sel.select(n[0], n[n.length-1]);
				}
			} else if (n) {
				$(n).attr(attr);
				sel.select(n);
			} else {
				dom.smartWrap(sel.get(), { wrap : function(n) { dom.wrap(n, { name : 'a', attr : attr }); } });
			}
			
			return true;
		}

		this._getState = function() {
			return this.dom.testSelection('link') ? this.STATE_ACTIVE : (this.sel.collapsed() ? this.STATE_DISABLE: this.STATE_ENABLE);
		}

	}
	
})(jQuery);