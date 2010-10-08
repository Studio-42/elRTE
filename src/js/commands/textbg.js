/**
 * @class elRTE command.
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.textbg = function() {
	this.title   = 'Text background';
	this.conf    = { ui : 'Color' };
	this.cssProp = 'background-color';
	this.node    = { name : 'span', css :{ 'background-color' : '' }}
	this._val = '';

	/**
	 * Set color for selected text
	 *
	 * @param  String  color value in hex/rgb
	 * @return Boolean
	 */
	this.exec = function(color) {
		var self = this,
			dom  = this.dom,
			sel  = this.sel,
			col  = sel.collapsed(),
			b    = sel.bookmark(), 
			p    = b[1].parentNode, o;

		color = this.utils.color2Hex(color.toLowerCase());
		// color is the same as document default one
		if (color == this._val) {
			color = '';
		}
		this.node.css[this.cssProp] = color;

		/**
		 * Return true if node has required css property
		 * @param DOMElement
		 * @return Boolean
		 */
		function test(n) {
			return n.nodeType == 1 && dom.css(n, self.cssProp);
		}

		/**
		 * Check if node or parents has the same color as required
		 * @param DOMElement
		 * @return Boolean
		 */
		function allow(n) {
			var n = dom.parents(n, test, true).shift();
			return !(n && self.utils.color2Hex(dom.css(n, self.cssProp)) == color);
		}

		// selection collapsed
		if (col) {
			// cursor at the end of colored node after user typing text - move cursor after this node
			if (this.rte.typing && dom.is(p, test) && dom.is(b[1], 'last') && allow(p)) {
				b = sel.selectNext(p, true).rmBookmark(b).bookmark();
			} else if (!color) {
				// there is no required color - remove color from all parents
				$.each(dom.parents(b[0], test), function(i, n) {
					if (dom.is($(n).css(self.cssProp, '')[0], 'emptySpan')) {
						dom.unwrap(n);
					}
				});
			}
			// color is set and not equal parent color
			if (color && allow(b[0])) {
				sel.surroundContents(dom.create(this.node));
			} 
		} 

		// unwrap nodes with color except nodes with required color
		o = {
			accept : function(n) {
				var c;
				return n.nodeType == 1 && (c = dom.css(n, self.cssProp)) && self.utils.color2Hex(c) != color;
			},
			unwrap : function(n) { $(n).css(self.cssProp, ''); dom.is(n, 'emptySpan') && dom.unwrap(n);}
		}
		dom.smartUnwrap(sel.get(true), o);
		b = sel.toBookmark(b).bookmark();
		
		if (color) {
			// wrap nodes with color node
			o = {
				accept : function(n) { return dom.is(n, 'textOrBr') && allow(n); },
				wrap   : function(n) { 
					$.each(dom.find(dom.wrap(n, self.node), test), function(i, n) {
						if (dom.is($(n).css(self.cssProp, '')[0], 'emptySpan')) {
							dom.unwrap(n);
						}
					});
				}
			}
			dom.smartWrap(sel.get(true), o);
		}

		sel.toBookmark(b);	
		this.rte.trigger('change');
		return true;
	}
	

	/**
	 * Store active document default color
	 *
	 * @return void
	 */
	this._updValue = function() { 
		this._val = this.utils.color2Hex($(this.rte.active.document.body).css('background-color'))||'#fff';
		// this.rte.log(this._val)
	}

	this._getState = function() {
		return this.STATE_ENABLE;
	}
	
	this.events = {
		'wysiwyg'      : function() { this._val = '';  var self = this; setTimeout(function() { self.update();}, 100)   },
		'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
	}
	
}