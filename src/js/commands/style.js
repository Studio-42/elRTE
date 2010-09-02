(function($) {
	
	elRTE.prototype.commands._style = {
		unwrap : function(n) {
			if (this.regExp.test(n.nodeName)) {
				this.dom.unwrap(n);
			} else {
				$(n).css(this.cssProp, '');
				this.dom.is(n, 'emptySpan') && this.dom.unwrap(n);
			}
		},
		
		exec : function() {
			var self = this,
			 	c = this.sel.collapsed(), 
				n = this.sel.node(), p, b;
			
			if (this._state == this.STATE_ACTIVE) {
				if (c) {
					p = this.dom.parents(n, this.test, true);
					b = this.sel.bookmark();
					// carret at the end of node and user is typing - move selection after node
					if (this.dom.parent(b[1], this.test) == p[0] && this.typing && !this.dom.nextAll(b[1], 'notEmpty').length) {

						b = this.sel.rmBookmark(b).selectNext(p[0], true).bookmark();
						p.shift();
					}
					// unwrap parents
					$.each(p, function() { self.unwrap(this); });
					this.sel.toBookmark(b).collapse(true);
				} else {
					n = this.dom.smartUnwrap(this.sel.get(true), this.test, 'inline', this.unwrap);
					this.rte.log(n)
					this.sel.select(n[0], n[1]);
				}
			} else {
				if (c) {
					this.sel.surroundContents(this.dom.create(this.node));
				} else {
					var n = this.sel.get();
					// this.rte.log(n)
					this.dom.smartWrap(n, 'block', this.node);
					
					this.sel.select(n[0], n[n.length-1]);
					
					// var bm = this.sel.bookmark();
					// this.rte.log(bm)
					// this.sel.toBookmark(bm)
					
				}
			}
			return true;
			
		},
		
		getState : function() {
			return this.dom.testSelection(this.test) ? this.STATE_ACTIVE : this.STATE_ENABLE;
		},
		
		test : function(n) {
			return n.nodeType == 1 && (this.regExp.test(n.nodeName) || this.dom.css(n, this.cssProp) == this.cssVal);
		}
	}
	
	elRTE.prototype.commands.bold = function(name) {
		this.name      = name;
		this.title     = 'Bold';
		this.node      = { name : 'strong' };
		this.regExp    = /^(B|STRONG)$/;
		this.cssProp   = 'font-weight';
		this.cssVal    = 'bold';
		this.test      = $.proxy(this.rte.commands._style.test, this)
		this.unwrap    = $.proxy(this.rte.commands._style.unwrap, this)
		this._exec     = $.proxy(this.rte.commands._style.exec, this)
		this._getState = $.proxy(this.rte.commands._style.getState, this)
	}
	
	/**
	 * @class create/remove "em" nodes
	 *
	 * @param  elRTE
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.italic = function(name) {
		this.name      = name;
		this.title     = 'Italic';
		this.node      = { name : 'em' };
		this.regExp    = /^(I|EM)$/;
		this.cssProp   = 'font-style';
		this.cssVal    = 'italic';
		this.test      = $.proxy(this.rte.commands._style.test, this);
		this.unwrap    = $.proxy(this.rte.commands._style.unwrap, this);
		this._exec     = $.proxy(this.rte.commands._style.exec, this);
		this._getState = $.proxy(this.rte.commands._style.getState, this);
	}
	
	elRTE.prototype.commands.underline = function(name) {
		this.name    = name;
		this.title   = 'Underline';
		this.node    = {name : 'span', css : {'text-decoration' : 'underline'}};
		this.regExp  = /^U$/;
		this.cssProp = 'text-decoration';
		this.cssVal  = 'underline';
		this.test    = $.proxy(this.rte.commands._style.test, this)
		this.unwrap  = $.proxy(this.rte.commands._style.unwrap, this)
		this._exec   = $.proxy(this.rte.commands._style.exec, this)
		this._getState = $.proxy(this.rte.commands._style.getState, this)
	}
	
	elRTE.prototype.commands.strike = function(name) {
		this.name    = name;
		this.title   = 'Strike';
		this.node    = {name : 'span', css : {'text-decoration' : 'line-through'}};
		this.regExp  = /^(S|STRIKE)$/;
		this.cssProp = 'text-decoration';
		this.cssVal  = 'line-through';
		this.test    = $.proxy(this.rte.commands._style.test, this)
		this.unwrap  = $.proxy(this.rte.commands._style.unwrap, this)
		this._exec   = $.proxy(this.rte.commands._style.exec, this)
		this._getState = $.proxy(this.rte.commands._style.getState, this)
	}
	
	elRTE.prototype.commands.sub = function(name) {
		this.name    = name;
		this.title   = 'Subscript';
		this.node    = {name : 'sub'};
		this.regExp  = /^SUB$/;
		this.cssProp = 'vertical-align';
		this.cssVal  = 'sub';
		this.test    = $.proxy(this.rte.commands._style.test, this)
		this.unwrap  = $.proxy(this.rte.commands._style.unwrap, this)
		this._exec   = $.proxy(this.rte.commands._style.exec, this)
		this._getState = $.proxy(this.rte.commands._style.getState, this)
	}
	
	elRTE.prototype.commands.sup = function(name) {
		this.name    = name;
		this.title   = 'Superscript';
		this.node    = {name : 'sup'};
		this.regExp  = /^SUP$/;
		this.cssProp = 'vertical-align';
		this.cssVal  = 'super';
		this.test    = $.proxy(this.rte.commands._style.test, this)
		this.unwrap  = $.proxy(this.rte.commands._style.unwrap, this)
		this._exec   = $.proxy(this.rte.commands._style.exec, this)
		this._getState = $.proxy(this.rte.commands._style.getState, this)
	}
	

})(jQuery);