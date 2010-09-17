(function($) {
	
	/**
	 * @class elRTE command.
	 * Format block node
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.formatblock = function() {
		this.title = 'Format';
		this._regExp=/^(H[1-6]|P|PRE|ADDRESS|DIV)$/;
		this._val  = '';
		this._opts = {
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
			this.rte.log(v)
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
		
		this._createUI = function() {
			var rte  = this.rte,
				c    = 'elrte-ui',
				mc   = c+'-menu',
				name = this.name,
				cmp  = rte.commandConf(this.name, 'compact'),
				lbl  = rte.i18n(this.title),
				l    = cmp ? '' : '<span class="'+mc+'-label">'+lbl+'</span>',
				conf = {
					label    : lbl,
					name     : name,
					callback : $.proxy(this.exec, this),
					opts     : {}
				};
			
			$.each(this._opts, function(t, l) {
				conf.opts[t] = { 
					label : l, 
					tag   : t
				};
			});
			
			return this._ui = $('<li class="'+c+' '+mc+(cmp ? '-icon ' : ' ')+c+'-'+name+'" title="'+lbl+'"><div class="'+mc+'-wrp"><div class="'+mc+'-control"/>'+l+'</div></li>').elrtemenu(conf, rte);
		}
		
		this._setVal = function() {
			var n = this.dom.closestParent(this.sel.node(), /^(H[1-6]|P|PRE|ADDRESS|DIV)$/, true);
			this._val = n ? n.nodeName.toLowerCase() : false;
			this._ui.val([this._val]);
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}

})(jQuery);