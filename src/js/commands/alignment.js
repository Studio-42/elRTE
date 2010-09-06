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
				v = self.val,
				n, f, l, s, e;
		

			if ((n = this.dom.closestParent(this.sel.node(), 'blockText', true))) {
				$(n).css('text-align', v).find('*').css('text-align', '');
			} else if (this.sel.collapsed()) {
				n = this.dom.parents(this.sel.node(), 'inline', true).pop();
				n = this.dom.prevAll(n, 'inline').reverse().concat([n]).concat(this.dom.nextAll(n, 'inline'));
				if (this.dom.filter(n, 'notEmpty').length) {
					this.dom.wrap(n, {name : 'p', css : { 'text-align' : v }});
				}
			
			} else {
				n = this.sel.get();
				f = n[0];
				l = n[n.length-1];
				if (!(s = this.dom.closestParent(f, 'blockText', true))) {
					s = this.dom.topParent(f, 'inline', true);
					s = [s].concat(this.dom.prevAll(s, 'inline')).pop();
				}
				if (!(e = this.dom.closestParent(l, 'blockText', true))) {
					e = this.dom.topParent(l, 'inline', true);
					e = [e].concat(this.dom.nextAll(e, 'inline')).pop();
				}
				n = this.dom.traverse(s, e);

				function test(n) {
					return self.dom.is('inline');
				}
			
				function align(n) {
					$(n).css('text-align', v);
				}
			
				function wrap(n) {
					self.dom.wrap(n, { name : self.dom.topParent(n[0], 'blockText') ? 'div' : 'p', css : { 'text-align' : v } });
				}
			
				$.each(n, function(i, n) {
					$(n).find('*').css('text-align', '');
				});
				this.dom.wrapSiblings(n, 'blockText', align, wrap, 'notEmpty');
				this.sel.select(f, l);
			}
			setTimeout(function() { self._setState(self.STATE_ACTIVE) }, 2);
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