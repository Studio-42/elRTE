(function($) {
	
	/**
	 * Commin methods for align text commands
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands._alignment = {
		
		getState : function() {
			var self = this,
				n = this.dom.closestParent(this.sel.node(), function(n) { return self.dom.is(n, 'blockText') && $(n).css('text-align'); }, true);
			return $(n).css('text-align') == this.val ? this.STATE_ACTIVE : this.STATE_ENABLE;
		},
		
		exec : function() {
			var self = this, 
				sel  = self.sel,
				dom  = self.dom,
				n    = sel.collapsed() ? [sel.node()] : sel.get(), 
				v    = self.val,
				f    = n[0], 
				l    = n[n.length-1],
				s, e, o;
				
			if (!(s = dom.closestParent(f, 'blockText', true))) {
				s = dom.topParent(f, 'inline', true);
				s = [s].concat(dom.prevUntil(s, 'any', 'block')).pop();
			}

			if (!(e = dom.closestParent(l, 'blockText', true))) {
				e = dom.topParent(l, 'inline', true);
				e = [e].concat(dom.nextUntil(e, 'any', 'block')).pop();
			}
			n = dom.traverse(s, e);
			$.each(n, function() {
				$(this).find('*').css('text-align', '');
			});
			o = { 
				accept  : 'any', 
				wrap    : function(n) { self.dom.wrap(n, { name : self.dom.topParent(n[0], 'blockText') ? 'div' : 'p', css : { 'text-align' : v } }); }, 
				inner   : false, 
				testCss : 'blockText', 
				setCss  : function(n) { $(n).css('text-align', v); } 
			};
			dom.smartWrap(n, o);
			this.sel.select(f, l);
			setTimeout(function() { self._update(self.STATE_ACTIVE) }, 2);
			return true;
		}
	}
	
	/**
	 * @class elRTE command - align text to left
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.left = function() {
		this.title     = 'Align left';
		this.val       = 'left';
		this._exec     = $.proxy(elRTE.prototype.commands._alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.commands._alignment.getState, this);
	}
	
	/**
	 * @class elRTE command - align text center
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.center = function() {
		this.title     = 'Align center';
		this.val       = 'center';
		this._exec     = $.proxy(elRTE.prototype.commands._alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.commands._alignment.getState, this);
	}
	
	/**
	 * @class elRTE command - align text to right
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.right = function() {
		this.title     = 'Align right';
		this.val       = 'right';
		this._exec     = $.proxy(elRTE.prototype.commands._alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.commands._alignment.getState, this);
	}
	
	/**
	 * @class elRTE command - align text justify
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.justify = function() {
		this.title     = 'Align justify';
		this.val       = 'justify';
		this._exec     = $.proxy(elRTE.prototype.commands._alignment.exec, this);
		this._getState = $.proxy(elRTE.prototype.commands._alignment.getState, this);
	}
	
})(jQuery);