/**
 * @class elRTE command.
 * Insert non breakable space into selection
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.textcolor = function() {
	this.title = 'Text color';
	this.conf = { ui : 'color' };
	this.cssProp = 'color';
	this.cssVal = '';
	this.node = { node : 'span', css :{}}
	
	
	this.test = function(n) {
		return n.nodeType == 1 && this.dom.css(n, this.cssProp);
	}
	
	this.test = $.proxy( function(n) { return n.nodeType == 1 && this.dom.css(n, this.cssProp); }, this)
	
	this._exec_ = function(v) {
		this.rte.log(v)
		// return this.sel.insertHtml('&nbsp;');
		var dom = this.dom,
			sel = this.sel,
			self = this,
			b, n;
		if (v === '' && (n = this._find())) {
			$(n).css('color', '');
			if (dom.is(n, 'emptySpan')) {
				b = sel.bookmark();
				dom.unwrap(n);
				sel.toBookmark(b);
			}
		} else if (v) {
			this.cssProp = 'color';
			this.cssVal = v;
			this.node = { name : 'span', css : { 'color' : v } }
			this.useCss = true;
			this.rte.log('here')

			if (sel.collapsed()) {
				sel.surroundContents(dom.create(this.node))
			} else {
				var node = this.node;
				o = { 
					wrap : function(n) { dom.wrap(n, node) }, 
					inner  : false,
					testCss : 'textElement',
					setCss  : function(n) { $(n).css(self.cssProp, self.cssVal).find('*').css(self.cssProp, ''); }
				};
				dom.smartWrap(sel.get(true), o);
			}
		}
		return true;
	}
	
	this.exec = function() {
		var dom = this.dom,
			sel = this.sel,
			col = sel.collapsed();
			
		if (this.isActive()) {
			this.rte.log('active')
		} else {
			
		}
	}
	
	this._find = function() {
		var dom = this.dom;
		
		return dom.closestParent(this.sel.node(), function(n) { return n.nodeType == 1 && dom.css(n, 'color') }, true);
	}
	
	this._updValue = function() { 
		
		this._val = this.utils.color2Hex(this.dom.css(this._find(), 'color'))
	}
	
	this._getState = function() {
		var dom = this.dom,
			self = this;
		
		return dom.is(this.sel.node(), 'text')
			? (dom.testSelection(self.test) ? this.STATE_ACTIVE : this.STATE_ENABLE)
			: this.STATE_DISABLE;
		
		return this.dom.is(this.sel.node(), 'text') ? this.STATE_ENABLE : this.STATE_DISABLE;
	}

}
