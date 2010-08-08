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
		this.rte         = rte;
		/**
		 * keabord chars codes
		 **/
		this._charsKeys  = [109, 188, 190, 191, 192, 219, 220, 221, 222, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]; 
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
		
		/**
		 * Return true if code is char code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyChar = function(c) { return $.inArray(c, this._charsKeys) != -1; }
		
		/**
		 * Return true if code is delete/backspace code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyDel = function(c) { return c == 8 || c == 46; }
		
		/**
		 * Return true if code is arrows/home/end etc. code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyArrow = function(c) { return c >= 33 && c <= 40; }
		
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
						if (n && v && (!a || n.substring(0, 1) != '-')) {
							st[n] = v;
						}
					}
				});
			}
			return st;
		}
	
		/**
		 * Compact some style properties
		 *
		 * @param   Object
		 * @return  Object
		 **/
		this.compactStyle = function(s) {
			if (s['border-width']) {
				s.border = s['border-width']+' '+(s['border-style']||'solid')+' '+(s['border-color']||'#000');
				delete s['border-width'];
				delete s['border-style'];
				delete s['border-color'];
			}
			return s;
		}
	
		/**
		 * Serialize style object into string
		 *
		 * @param   Object
		 * @return  String
		 **/
		this.serializeStyle = function(o) {
			var s = [];
			$.each(this.compactStyle(o), function(n, v) {
				if (v) {
					s.push(n+':'+v);
				}
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
			return c.length ? c.split(/\s+/) : [];
		}
	
		/**
		 * Serialize class object into string
		 *
		 * @param   Object
		 * @return  String
		 **/
		this.serializeClass = function(c) {
			return c.join(' ')
			var s = [];
			$.each(c, function(n) {
				s.push(n)
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
	
	
	}
	
	
})(jQuery);