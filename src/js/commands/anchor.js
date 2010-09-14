(function($) {
	
	/**
	 * @class elRTE command.
	 * Create/edit anchor
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.anchor = function() {
		this.title = 'Bookmark';
		
		/**
		 * Return selected anchor if exists
		 *
		 * @return DOMElement
		 **/
		this._find = function() {
			var sel = this.sel,
				dom = this.dom,
				n   = sel.node(), l, ch;

			if (dom.is(n, 'anchor')) {
				return n;
			}

			n = sel.get(true).reverse();
			l = n.length;
			while (l--) {
				if (dom.is(n[l], 'anchor')) {
					return n[l];
				} else if ((ch = dom.closest(n[l], 'anchor')).length) {
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
			var self = this,
				rte  = this.rte,
				n    = this._find(),
				d    = $('<div/>'),
				name;
			
			function ok() {
				self._exec(name.val());
				d.dialog('close');
			}
			
			name = $('<input type="text" size="22" />').val(n ? $(n).attr('name') : '').keyup(function(e) { e.keyCode == 13 && ok(); });
			
			d.append(rte.i18n('Name')+' ').append(name).dialog({
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
		 * Insert anchor or change anchor name or remove anchor.
		 *
		 * @param  String  anchor name
		 * @return void
		 **/
		this._exec = function(name) {
			var sel = this.sel,
				dom = this.dom, n;
			
			this.rte.focus();
			
			if ((n = this._find())) {
				name ? $(n).attr('name', name) : dom.remove(n);
			} else if (name) {
				sel.select(sel.collapse(true).insertNode(dom.create({ name: 'a', attr : { name : 'test', 'class' : 'elrte-anchor' }})));
			}
			
			return true;
		}

		this._getState = function() {
			return this.dom.testSelection('anchor') ? this.STATE_ACTIVE : this.STATE_ENABLE;
		}

	}
	
})(jQuery);