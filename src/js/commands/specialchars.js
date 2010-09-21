/**
 * @class elRTE command.
 * Insert non breakable space into selection
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.specialchars = function() {
	this.title = 'Insert special character';
	this.button = 'buttonMenu';
	this.widgetClass = 'elrte-ui-widget-grid';
	this.tpl    = '<span title="{label}">{value}</span>';
	this.opts = {
		'&amp;' : 'Ampersand',
		'&quot;' : 'Quotation mark',
		'&lsquo;' : 'Left single qoutation mark',
		'&rsquo;' : 'Right single qoutation mark',
		'&ldquo;' : 'Left double qoutation mark',
		'&rdquo;' : 'Right double qoutation mark',
		'&lsaquo;' : 'Single left angle qoutation mark',
		'&rsaquo;' : 'Single right angle qoutation mark',
		'&laquo;' : 'Left pointing guillimet',
		'&raquo;' : 'Right pointing guillimet',
		'&sbquo;' : 'Single low-9 qoutation mark',
		'&bdquo;' : 'Double low-9 qoutation mark',
		'&ndash;' : 'En dash',
		'&mdash;' : 'Em dash',
		'&macr;' : 'Macron',
		'&oline' : 'Overline',
		'&hellip;' : 'Tree dot leader',
		'&middot;' : 'Middle dot',
		'&bull;' : 'Bullet',
		'&sect;' : 'Section sign',
		'&para;' : 'Paragraph sign',
		'&acute;' : 'Acute accent',
		'&cedil;' : 'Cedilla',
		'&szlig;' : 'Sharp-s / es-zid',
		'&brvbar;' : 'Broken bar',
		
		'&copy;' : 'Copyright sign',
		'&reg;' : 'Registered sign',
		'&trade;' : 'Trade mark sign',
		'&curren;' : 'Currency sign',
		'&cent;' : 'Cent sign',
		'&euro;' : 'Euro sign',
		'&pound;' : 'Pound sign',
		'&yen;' : 'Yen sign',
		
		
		
		'&lt;' : 'Less-then sign',
		'&gt;' : 'Grater-then sign',
		'&le;' : 'Less-then or equal sign',
		'&ge;' : 'Grater-then or equal sign',
		'&minus;' : 'Minus sign',
		'&plusmn;' : 'Plus-minus sign',
		'&divide;' : 'Division sign',
		'&frasl;' : 'Fraction slash',
		'&times;' : 'Multiplication sign',
		'&sup1;' : 'Superscript 1',
		'&sup2;' : 'Superscript 2',
		'&sup3;' : 'Superscript 3',
		'&frac14;' : 'Fractation one quorter',
		'&frac12;' : 'Fractation one half',
		'&frac34;' : 'Fractation three quorters',	
		'&fnof;' : 'Function / florin',
		'&int;' : 'Integral',
		'&sum;' : 'N-ary summation',
		'&infin;' : 'Infinity',
		'&radic;' : 'Square root',
		'&asymp;' : 'Almost equal',
		'&ne;' : 'Not equal',
		'&equiv;' : 'Idential',
		'&prod' : 'N-ary product',			
		'&not;' : 'Not sign',
		'&cap;' : 'Intersection',
		'&part;' : 'Partial differential',
		'&permil;' : 'Per mille sign',
		'&micro;' : 'Micro sign',
		'&ordf;' : 'Feminine ordinal indicator',
		'&ordm;' : 'Masculine ordinal indicator',
		
		
		
		
		
	}
	
	this._exec = function() {
		// return this.sel.insertHtml('&nbsp;');
	}
	
	this.events = {
		'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
		'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
	}

}
