(function($) {

	/**
	 * @class Set/unset bold text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.bold = function() {
		this.title      = 'Bold';
		this.node       = 'strong';
		this.regExp     = /^(B|STRONG)$/;
		this.cssProp    = 'font-weight';
		this.cssVal     = 'bold';
		this.shortcut   = 'ctrl+b';
		this.test       = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._textElement.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._textElement.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
		
	}
	
	/**
	 * @class Set/unset italic text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.italic = function() {
		this.title      = 'Italic';
		this.node       = 'em';
		this.regExp     = /^(I|EM)$/;
		this.cssProp    = 'font-style';
		this.cssVal     = 'italic';
		this.shortcut   = 'ctrl+i';
		this.test       = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._textElement.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._textElement.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);	
	}
	
	/**
	 * @class Set/unset underlined text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.underline = function() {
		this.title      = 'Underline';
		this.regExp     = /^(U|INS)$/;
		this.cssProp    = 'text-decoration';
		this.cssVal     = 'underline';
		this.shortcut   = 'ctrl+u';
		this.test       = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._textElement.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._textElement.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
	/**
	 * @class Set/unset strike text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.strike = function() {
		this.title      = 'Strike';
		this.regExp     = /^(S|STRIKE|DEL)$/;
		this.cssProp    = 'text-decoration';
		this.cssVal     = 'line-through';
		this.test       = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._textElement.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._textElement.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
	/**
	 * @class Set/unset Subscript text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.sub = function() {
		this.title      = 'Subscript';
		this.node       = 'sub';
		this.regExp     = /^SUB$/;
		this.cssProp    = 'vertical-align';
		this.cssVal     = 'sub';
		this.test       = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._textElement.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._textElement.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
	/**
	 * @class Set/unset Superscript text
	 * @param  String  command name
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.sup = function() {
		this.title      = 'Superscript';
		this.node       = 'sup';
		this.regExp     = /^SUP$/;
		this.cssProp    = 'vertical-align';
		this.cssVal     = 'super';
		this.test       = $.proxy(this.rte.commands._textElement.test, this);
		this.unwrap     = $.proxy(this.rte.commands._textElement.unwrap, this);
		this.wrap       = $.proxy(this.rte.commands._textElement.wrap, this);
		this.acceptWrap = $.proxy(this.rte.commands._textElement.acceptWrap, this);
		this.innerWrap  = $.proxy(this.rte.commands._textElement.innerWrap, this);
		this._exec      = $.proxy(this.rte.commands._textElement.exec, this);
		this._getState  = $.proxy(this.rte.commands._textElement.getState, this);
	}
	
})(jQuery);