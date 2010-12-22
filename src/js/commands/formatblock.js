/**
 * @class elRTE command.
 * Format block node
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.formatblock = function() {
	var h = this.rte.i18n('Heading');
	
	this.title  = 'Format block';
	this.regexp = /^(H[1-6]|P|PRE|ADDRESS|DIV)$/;
	this.value  = '';
	this.conf   = { 
		ui      : 'menu', 
		text    : true, 
		grid    : true,
		tpl     : '<{value}>{label}</{value}>', 
		gridtpl : '<{value}>AaBb</{value}>{label}'
	};
	this.opts   = {
		'h1'      : h+' 1',
		'h2'      : h+' 2',
		'h3'      : h+' 3',
		'h4'      : h+' 4',
		'h5'      : h+' 5',
		'h6'      : h+' 6',
		'p'       : this.rte.i18n('Paragraph'),
		'address' : this.rte.i18n('Address'),
		'pre'     : this.rte.i18n('Preformatted'),
		'div'     : this.rte.i18n('Normal (div)')
	};
	
	
	this._exec = function(v) {
		var dom = this.dom,
			sel = this.sel,
			b = sel.bookmark();
		
		if (this.value == v) {
			// remove existed format
			dom.unwrap(dom.closestParent(this.sel.node(), this.regexp, true));
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
	
	
	this._value = function() {
		var n = this.dom.closestParent(this.sel.node(), this.regexp, true);
		return n ? n.nodeName.toLowerCase() : false;

	}
	
	this._state = function() {
		return elRTE.CMD_STATE_ENABLED;
	}
}

