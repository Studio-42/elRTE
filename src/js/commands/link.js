(function($) {
	
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