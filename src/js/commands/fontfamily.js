/**
 * @class elRTE command.
 * Change font family
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.fontfamily = function() {
	this.title  = 'Font family';
	this._val   = '';
	this.conf   = { widget : 'menu', label : true };
	this.css    = 'font-family';
	this.tpl    = '<span style="font-family:{value}">{label}</span>';
	this.opts   = {
		'default'                                       : this.rte.i18n('Default'),
		'andale mono,sans-serif'                        : 'Andale Mono',
		'arial,helvetica,sans-serif'                    : 'Arial',
		'arial black,gadget,sans-serif'                 : 'Arial Black',
		'book antiqua,palatino,sans-serif'              : 'Book Antiqua',
		'comic sans ms,cursive'                         : 'Comic Sans MS',
		'courier new,courier,monospace'                 : 'Courier New',
		'georgia,palatino,serif'                        : 'Georgia',
		'helvetica,sans-serif'                          : 'Helvetica',
		'impact,sans-serif'                             : 'Impact',
		'lucida console,monaco,monospace'               : 'Lucida console',
		'lucida sans unicode,lucida grande,sans-serif'  : 'Lucida grande',
		'tahoma,sans-serif'                             : 'Tahoma',
		'times new roman,times,serif'                   : 'Times New Roman',
		'trebuchet ms,lucida grande,verdana,sans-serif' : 'Trebuchet MS',
		'verdana,geneva,sans-serif'                     : 'Verdana',
		'fantasy'                                       : 'fantasy'
	}
	
	this._fonts = [
		{ regexp : /andale/i,                    name : 'andale mono,sans-serif' },
		{ regexp : /arial,/i,                    name : 'arial,helvetica,sans-serif' },
		{ regexp : /(arial\s+black|gadget)/i,    name : 'arial black,gadget,sans-serif' },
		{ regexp : /(book\s+antiqua)/i,          name : 'book antiqua,palatino,sans-serif' },
		{ regexp : /comic\s+sans/i,              name : 'comic sans ms,cursive' },
		{ regexp : /courier/i,                   name : 'courier new,courier,monospace' },
		{ regexp : /georgia/i,                   name : 'georgia,palatino,serif' },
		{ regexp : /impact/i,                    name : 'impact,sans-serif' },
		{ regexp : /(lucida\s+console|monaco)/i, name : 'lucida console,monaco,monospace' },
		{ regexp : /lucida\s+sans/i,             name : 'lucida sans unicode,lucida grande,sans-serif' },
		{ regexp : /times/i,                     name : 'times new roman,times,serif' },
		{ regexp : /tahoma/i,                    name : 'tahoma,sans-serif' },
		{ regexp : /trebuchet/i,                 name : 'trebuchet ms,lucida grande,verdana,sans-serif' },
		{ regexp : /verdana/i,                   name : 'verdana,geneva,sans-serif' },
		{ regexp : /palatino/i,                  name : 'book antiqua,palatino,sans-serif' },
		{ regexp : /helvetica/i,                 name : 'helvetica,sans-serif' },
		{ regexp : /lucida grande/i,             name : 'trebuchet ms,lucida grande,verdana,sans-serif' },
		{ regexp : /,serif/i,                    name : 'times new roman,times,serif' },
		{ regexp : /sans-serif/i,                name : 'arial,helvetica,sans-serif' },
		{ regexp : /monospace/i,                 name : 'courier new,courier,monospace' },
		{ regexp : /cursive/i,                   name : 'comic sans ms,cursive' },
		{ regexp : /fantasy/i,                   name : 'fantasy' }
	].reverse();
	
	this.test      = $.proxy(this.rte.mixins.font.test,   this);
	this.unwrap    = $.proxy(this.rte.mixins.font.unwrap, this);
	this._exec     = $.proxy(this.rte.mixins.font.exec,   this);
	this._updValue = $.proxy(this.rte.mixins.font.update, this);
	
	/**
	 * Check given css font-family property for known fonts
	 * and return closests font set
	 * 
	 * @param  String  css font-family value
	 * @return String
	 **/
	this._parseVal = function(v) {
		var l, f;
		
		v = $.trim(v);
		if (v.length) {
			v = ','+v.replace(/'|"/g, '').replace(/\s*,\s*/g, ',')+',';
			l = this._fonts.length;
			while (l--) {
				f = this._fonts[l];
				if (f.regexp.test(v)) {
					return f.name;
				}
			}
		}
		return '';
	}
	
	this._getState = function() {
		return this.STATE_ENABLE;
	}
}

