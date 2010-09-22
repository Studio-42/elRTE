(function($) {
	
	/**
	 * @class elRTE command.
	 * Format block node
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.formatblock = function() {
		this.title   = 'Format';
		this.button  = 'buttonMenu';
		this.tpl     = '<{value}>{label}</{value}>';
		this._regExp = /^(H[1-6]|P|PRE|ADDRESS|DIV)$/;
		this._val    = '';
		this.opts    = {
			'h1'      : this.rte.i18n('Heading')+' 1',
			'h2'      : this.rte.i18n('Heading')+' 2',
			'h3'      : this.rte.i18n('Heading')+' 3',
			'h4'      : this.rte.i18n('Heading')+' 4',
			'h5'      : this.rte.i18n('Heading')+' 5',
			'h6'      : this.rte.i18n('Heading')+' 6',
			'p'       : this.rte.i18n('Paragraph'),
			'address' : this.rte.i18n('Address'),
			'pre'     : this.rte.i18n('Preformatted'),
			'div'     : this.rte.i18n('Normal (div)')
		};
		
		this._exec = function(v) {
			var dom = this.dom,
				sel = this.sel,
				b = sel.bookmark();
			
			if (this._val == v) {
				// remove existed format
				dom.unwrap(dom.closestParent(this.sel.node(), /^(H[1-6]|P|PRE|ADDRESS|DIV)$/, true));
			} else {
				// reformat block
				try {
					this.rte.active.document.execCommand('formatblock', false, v);
				} catch(e) {
					this.rte.debug('error.command', this.name);
				}
			}
			sel.toBookmark(b);
			return true;
		}
		
		
		this._updValue = function() {
			var n = this.dom.closestParent(this.sel.node(), /^(H[1-6]|P|PRE|ADDRESS|DIV)$/, true);
			this._val = n ? n.nodeName.toLowerCase() : false;

		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}

})(jQuery);