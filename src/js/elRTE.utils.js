(function($) {
	/**
	 * @class Various utilits, required by elRTE
	 * @param elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 */
	elRTE.prototype.utils = function(rte) {
		/**
		 * editor instance
		 **/
		this.rte = rte;
		
		this.serviceKeys = [
			16, //shift
			17, //ctrl
			18, //alt
			20, //caps
			22, 24, 26, //opera hack
			27, // esc
			//37, 38, 39, 40, //arrows
			//33, 34, //page-up/page-down
			//35, 36, //home/end
			45, //ins
			91, //left cmd|win
			93, //right cmd|win
			112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, //f1-12
			144, //num
			224 //cmd as firefox think 
		]
		
		if ($.browser.opera) {
			this.serviceKeys.push(0)
		}
		
		/**
		 * entities map
		 **/
		this.entities = {'&' : '&amp;', '"' : '&quot;', '<' : '&lt;', '>' : '&gt;'};
		/**
		 * entities regexp
		 **/
		this.entitiesRegExp = /[<>&\"]/g;
		/**
		 * media info
		 **/
		this.media = [{ 
				type     : 'application/x-shockwave-flash', 
				classid  : ['clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'], 
				codebase : 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0' 
			}, { 
				type     : 'application/x-director', 
				classid  : ['clsid:166b1bca-3f9c-11cf-8075-444553540000'], 
				codebase : 'http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,1,0' 
			}, { 
				type     : 'application/x-mplayer2', 
				classid  : ['clsid:6bf52a52-394a-11d3-b153-00c04f79faa6', 'clsid:22d6f312-b0f6-11d0-94ab-0080c74c7e95', 'clsid:05589fa1-c356-11ce-bf01-00aa0055595a'], 
				codebase : 'http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701' 
			}, { 
				type     : 'video/quicktime', 
				classid  : ['clsid:02bf25d5-8c17-4b23-bc80-d3488abddc6b'], 
				codebase : 'http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0' 
			}, { 
				type     : 'audio/x-pn-realaudio-plugin', 
				classid  : ['clsid:cfcdaa03-8be4-11cf-b84b-0020afbbccfa'], 
				codebase : 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0'
			}];
		
		// rgb color regexp
		this.rgbRegExp = /\s*rgb\s*?\(\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?\)\s*/i;
		// regexp to detect color in border/background properties
		this.colorsRegExp = /aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|rgb\s*\([^\)]+\)/i;
		
		// named colors
		this.colors = {
			aqua    : '#00ffff',
			black   : '#000000',
			blue    : '#0000ff',
			fuchsia : '#ff00ff',
			gray    : '#808080',
			grey    : '#808080',
			green   : '#008000',
			lime    : '#00ff00',
			maroon  : '#800000',
			navy    : '#000080',
			olive   : '#808000',
			orange  : '#ffa500',
			purple  : '#800080',
			red     : '#ff0000',
			silver  : '#c0c0c0',
			teal    : '#008080',
			white   : '#ffffff',
			yellow  : '#ffff00'
		}
		
		// a, e, p, n
		this.arrowKeys = [65, 69, 78, 80];
		
		this.keyType = function(e) {
			var rte = this.rte,
				c    = e.keyCode,
				ctrl = e.ctrlKey,
				meta = rte.macos &&e.metaKey,
				type = e.type,
				r = rte.KEY_UNKNOWN;

			if (type == 'keydown' || type == 'keyup') {
				// del|backspace|ctrl+d|ctrl+k
				if (c == 8 || c == 46 || (ctrl && (c == 68 || c == 75))) {
					return rte.KEY_DEL;
				} 
				if (c == 13) {
					return rte.KEY_ENTER;
				}
				// ctrl|sift etc
				if ($.inArray(c, this.serviceKeys) != -1) {
					return rte.KEY_SERVICE;
				}
				// arrows or ctrl+a|e|p|n or meta+a
				if ((c >= 33 && c <= 40) || (c == 65 && (ctrl || meta)) || ((c == 69 || c == 78 || c == 80) && ctrl)) {
					return rte.KEY_ARROW;
				}
				if (c == 9) {
					return rte.KEY_TAB;
				} 
				return rte.KEY_CHAR;
				
				
			}
			return rte.KEY_UNKNOWN;
		}
		
		/**
		 * Return true if code is char code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyChar = function(e) { return this.keyType(e) == this.rte.KEY_CHAR; }
		
		/**
		 * Return true if code is delete/backspace code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyDel = function(e) { return this.keyType(e) == this.rte.KEY_DEL; }
		
		/**
		 * Return true if code is arrows/home/end etc. code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyArrow = function(e) { return this.keyType(e) == this.rte.KEY_ARROW; }
		
		this.isKeyService = function(e) { return this.keyType(e) == this.rte.KEY_SERVICE; }
		
		this.strRepeat = function(s, m) {
			var str = '';
			while (m--) {
				str += s;
			}
			return str;
		}
		
		/**
		 * Encode entities in string
		 *
		 * @param   String
		 * @return  String
		 **/
		this.encode = function(s) {
			var e = this.entities;
			return (''+s).replace(this.entitiesRegExp, function(c) {
				return e[c];
			});
		}
		
		/**
		 * Decode entities in string
		 *
		 * @param   String
		 * @return  String
		 **/
		this.decode = function(s) {
			return $('<div/>').html(s||'').text();
		}
		
		/**
		 * Create object (map) from array
		 *
		 * @param   Array
		 * @return  Object
		 **/
		this.makeObject = function(o) {
			var m = {};
			$.each(o, function(i, e) {
				m[e] = e;
			});
			return m;
		}
	
		/**
		 * Parse style string into object
		 *
		 * @param   String
		 * @return  Object
		 **/
		this.parseStyle = function(s) {
			var st = {}, a = this.rte.options.allowBrowsersSpecStyles, t, n, v;
			
			if (typeof(s) == 'string' && s.length) {
				$.each(s.split(';'), function() {
					t = this.toString().split(':');
					if (t[0] && t[1]) {
						n = $.trim(t[0]).toLowerCase();
						v = $.trim(t[1]);
						if (n == 'color' || n == 'background-color') {
							v = v.toLowerCase();
						}
						if (n && v && (a || n.substring(0, 1) != '-')) {
							st[n] = v;
						}
					}
				});
			}
			return st;
		}
	
		/**
		 * Compact some style properties and convert colors in hex
		 *
		 * @param   Object
		 * @return  Object
		 **/
		this.compactStyle = function(s) {
			var self = this;

			if (s.border == 'medium none') {
				delete s.border;
			}
			
			$.each(s, function(n, v) {
				if (/color$/i.test(n)) {
					s[n] = self.color2Hex(v);
				} else if (/^(border|background)$/i.test(n)) {
					s[n] = v.replace(self.colorsRegExp, function(m) {
						return self.color2Hex(m);
					});
				}
			});
			
			if (s['border-width']) {
				s.border = s['border-width']+' '+(s['border-style']||'solid')+' '+(s['border-color']||'#000');
				delete s['border-width'];
				delete s['border-style'];
				delete s['border-color'];
			}
			
			if (s['background-image']) {
				s.background = (s['background-color']+' ')||''+s['background-image']+' '+s['background-position']||'0 0'+' '+s['background-repeat']||'repeat';
				delete s['background-image'];
				delete['background-image'];
				delete['background-position'];
				delete['background-repeat'];
			}
			
			if (s['margin-top'] && s['margin-right'] && s['margin-bottom'] && s['margin-left']) {
				s.margin = s['margin-top']+' '+s['margin-right']+' '+s['margin-bottom']+' '+s['margin-left'];
				delete s['margin-top'];
				delete s['margin-right'];
				delete s['margin-bottom'];
				delete s['margin-left'];
			}
			
			if (s['padding-top'] && s['padding-right'] && s['padding-bottom'] && s['padding-left']) {
				s.padding = s['padding-top']+' '+s['padding-right']+' '+s['padding-bottom']+' '+s['padding-left'];
				delete s['padding-top'];
				delete s['padding-right'];
				delete s['padding-bottom'];
				delete s['padding-left'];
			}
			
			if (s['list-style-type'] || s['list-style-position'] || s['list-style-image']) {
				s['list-style'] = $.trim(s['list-style-type']||' '+s['list-style-position']||''+s['list-style-image']||'');
				delete s['list-style-type'];
				delete s['list-style-position'];
				delete s['list-style-image'];
			}
			
			return s;
		}
	
		/**
		 * Serialize style object into string
		 *
		 * @param   Object  style map
		 * @param   Boolean flag - compact style?
		 * @return  String
		 **/
		this.serializeStyle = function(o, c) {
			var s = [];
			// c=true
			$.each(c ? this.compactStyle(o) : o, function(n, v) {
				v && s.push(n+':'+v);
			});
			return s.join(';');
		}
	
		/**
		 * Parse class string into object
		 *
		 * @param   String
		 * @return  Object
		 **/
		this.parseClass = function(c) {
			c = $.trim(c); 
			// this.rte.log(c)
			return c.length ? this.makeObject(c.split(/\s+/)) : {};
			return c.length ? c.split(/\s+/) : [];
		}
	
		/**
		 * Serialize class object into string
		 *
		 * @param   Object
		 * @return  String
		 **/
		this.serializeClass = function(c) {
			// return c.join(' ')
			var s = [];
			$.each(c, function(n) {
				s.push(n);
			});
			return s.join(' ');
		}
	
		/**
		 * Return required media type info
		 *
		 * @param   String  mimetype
		 * @param   String  classid
		 * @return  Object
		 **/
		this.mediaInfo = function(t, c) {
			var l = this.media.length;
			
			while (l--) {
				if (t === this.media[l].type || (c && $.inArray(c, this.media[l].classid) != -1)) {
					return this.media[l];
				}
			}
		}
	
		this.isColorHex = function(c) {
			return /^\#([0-9a-f]){3,6}$/i.test(c)
		}
	
		/**
		 * Return color hex value
		 *
		 * @param   String   color name or rgb
		 * @return  String
		 **/
		this.color2Hex = function(c) {
			var m;
			
			c = ''+c.toLowerCase();
			
			function hex(s) {
				s = parseInt(s).toString(16);
				return s.length > 1 ? s : '0' + s; 
			};
			
			if (this.isColorHex(c)) {
				return c;
			}
			
			if (this.colors[c]) {
				return this.colors[c];
			}
			
			return (m = c.match(this.rgbRegExp)) ? '#'+hex(m[1])+hex(m[2])+hex(m[3]) : '';
		}
	
		this.fontsize2percents = function(s) {
			var x = 100;
			if (s.indexOf('pt') != -1) {
				x = 12;
			} else if (s.indexOf('px') != -1) {
				x = 16;
			} else if (s.indexOf('em') != -1) {
				x = 1;
			}
			return Math.round((100*parseFloat(s, 1)/x)/10)*10;
		}
	
	
	}
	
	
})(jQuery);