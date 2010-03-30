(function($) {
	/**
	 * @class Clean html and make replace/restore for some patterns
	 *
	 * @param elRTE
	 * @author Dmitry (dio) Levashov dio@std42.ru
	 * @todo - replace/restore scripts
	 */
	elRTE.prototype.filter = function(rte) {
		var self     = this, chain, n;
		this.rte     = rte;
		/* make xhtml tags? */
		this._xhtml  = rte.options.doctype.match(/xhtml/i) ? true : false;
		/* chains of rules */
		this._chains = {};
		/* allowed tags */
		this._allow = rte.options.allowTags||[];
		/* deny tags */
		this._deny = rte.options.denyTags||[];
		/* swf placeholder class */
		this.swfClass = 'elrte-swf-placeholder';
		
		n = $('<span />').addClass(this.swfClass).appendTo(rte.editor).text('swf')[0];
		if (typeof n.currentStyle != "undefined") {
			url = n.currentStyle['backgroundImage'];
		} else {
			url = document.defaultView.getComputedStyle(n, null).getPropertyValue('background-image');
		}
		$(n).remove();
		/* swf placeholder url */
		this.swfSrc = url ? url.replace(/^url\("?([^"]+)"?\)$/, "$1") : '';

		/* create chains */
		for (chain in this.chains) {
			if (this.chains.hasOwnProperty(chain)) {
				this._chains[chain] = [];
				$.each(this.chains[chain], function() {
					if (typeof(self.rules[this]) == 'function') {
						self._chains[chain].push(self.rules[this]);
					}
				});
			}
		}
		/* check default chains exists */
		if (!this._chains.toSource || !this._chains.toSource.length) {
			this._chains.toSource = [this.rules.toSource]
		}
		if (!this._chains.fromSource || !this._chains.fromSource.length) {
			this._chains.fromSource = [this.rules.fromSource]
		}
		
		/**
		 * Procces html in required chains 
		 *
		 * @param String
		 * @param String  chain name
		 * @return String
		 */
		this.proccess = function(html, chain) {
			if (this._chains[chain]) {
				$.each(this._chains[chain], function() {
					html = this(self, html);
				});
			}
			return html;
		}
		
		/**
		 * Procces html in toSource chain 
		 *
		 * @param String
		 * @return String
		 */
		this.toSource = function(html) {
			return this.proccess(html, 'toSource');
		}
		
		/**
		 * Procces html in fromSource chain 
		 *
		 * @param String
		 * @return String
		 */
		this.fromSource = function(html) {
			return this.proccess(html, 'fromSource');
		}
		
		/**
		 * Add user methods for replace/restore any patterns in html
		 *
		 * @param Function  replace method
		 * @param Function  restore method
		 */
		this.addReplacement = function(rp, rs) {
			if (typeof(rp) == 'function') {
				this._chains.fromSource.unshift(rp);
			}
			if (typeof(rs) == 'function') {
				this._chains.toSource.unshift(rp);
			}
		}
		
	}
	
	/**
	 * Default rules
	 */
	elRTE.prototype.filter.prototype.rules = {
		/* common cleanup tags and attrs */
		cleanup : function(f, html) {
			var at    = f._allow.length,
				dt    = f._deny.length,
				fsize = ['', 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'],
				map   = {
					b      : ['strong'],
					big    : ['span', 'font-size:large'],
					center : ['div', 'text-align:center'],
					font   : ['span'],
					i      : ['em'],
					nobr   : ['span', 'white-space:nowrap'],
					small  : ['span', 'font-size:small'],
					u      : ['span', 'text-decoration:underline']
				};
			
			if ($.browser.opera||$.browser.msie) {
				html = f.rules.tagsToLower(f, html);
			}
				
			/* Replace non-semantic tags */
			html = html.replace(/\<(\/?)(b|i|u|font|center|nobr|big|small)(\s+[^>]*)?\>/gi, function(t, s, n, a) {
				n = n.toLowerCase(n);
				a = (a||'').toLowerCase(a);
				
				if (map[n]) {
					if (!s && map[n][1]) {
						a = a.indexOf('style="') == -1 ? a+' style="'+map[n][1]+'"' : a.replace('style="', 'style="'+map[n][1]+';');
					}
					return '<'+s+map[n][0]+a+'>';
				}
				return t;
			});

			/* Replace non-semantic attributes with css */
			html = html.replace(/\<([a-z1-6]+)\s+([^>]*(border|bordercolor|color|background|bgcolor|align|valign|hspace|vspace|clear|size|face)=[^>]*)\>/gi, function(t, n, a) {
				var attrs = {},
					m = a.match(/([a-z]+)="([^"]*)"/gi), _t, i;
				
				function style(v) {
					if (!attrs.style) {
						attrs.style = '';
					}
					attrs.style = v+';'+attrs.style;
				}
				if (m) {
					for (i=0; i<m.length; i++) {
						_t = m[i].split('=');
						attrs[_t[0]] = _t[1].replace(/"/g, '');
					}
				} 

				
				if (attrs.border) {
					style('border:'+attrs.border+'px solid '+(attrs.bordercolor||'#000'));
					delete attrs.border;
					delete attrs.bordercolor;
				}
				if (attrs.color) {
					style('color:'+attrs.color);
					delete attrs.color
				}
				if (attrs.background) {
					style('background-image:url('+attrs.background+')');
					delete attrs.background;
				}
				if (attrs.bgcolor) {
					style('background-color:'+attrs.bgcolor);
					delete attrs.bgcolor;
				}
				if (attrs.align) {
					if (n == 'img') {
						if (attrs.align.match(/(left|right)/)) {
							style('float:'+attrs.align);
						} else {
							style('vertical-align:'+attrs.align);
						}
					} else if (n == 'table') {
						if (attrs.align == 'center') {
							style('margin-left:auto;margin-right:auto');
						} else {
							style('float:'+attrs.align);
						}
					} else {
						style('text-align:'+attrs.align);
					}
					
					delete attrs.align;
				}
				if (attrs.valign) {
					style('vertical-align:'+attrs.valign);
					delete attrs.valign;
				}
				if (attrs.hspace) {
					style('margin-left:'+attrs.hspace+'px;margin-right:'+attrs.hspace+'px');
					delete attrs.hspace;
				}
				if (attrs.vspace) {
					style('margin-top:'+attrs.vspace+'px;margin-bottom:'+attrs.vspace+'px');
					delete attrs.vspace;
				}
				if (attrs.size && n != 'input') {
					if (n == 'hr') {
						style('height:'+attrs.size+'px')
					} else {
						style('font-size:'+(fsize[attrs.size]||'medium'));
					}
					delete attrs.size;
				} 
				if (attrs.clear) {
					style('clear:'+(attrs.clear=='all' ? 'both' : attrs.clear));
					delete attrs.clear;
				}
				if (attrs.face) {
					delete attrs.face;
				}
				
				
				a = '';
				for (i in attrs) {
					if (attrs.hasOwnProperty(i) && attrs[i]) {
						a += ' '+i+'="'+attrs[i]+'"';
					}
				}
				return '<'+n+a+'>';
			})
			
			/* Remove not allowed tags */
			if ( at || dt) {
				html = html.replace(/\<(\/?)([a-z1-6]+)([^>]*)\>/gi, function(t, s, n, a) {
					n = n.toLowerCase(n);
					return (at && $.inArray(n, f._allow) == -1) || (dt && $.inArray(n, f._deny) != -1) ? '' : '<'+s+n+a+'>';
				});
			}
			return html;
		},

		/* move tags to lowercase in ie and opera */
		tagsToLower : function(f, html) {
			return html.replace(/\<(\/?)([a-z1-6]+)([^\>]*)\>/ig, function(s, sl, tag, arg) { 
				arg = arg.replace(/([a-z\-]+)\:/ig, function(s, a) { return a.toLowerCase()+':' });
				arg = arg.replace(/([a-z\-]+)=/ig, function(s, a) { return a.toLowerCase()+'=' });
				arg = arg.replace(/([a-z\-]+)=([a-z1-9\-]+)/ig, function(s, a, v) { return a+'="'+v+'"' })
				return '<'+sl+tag.toLowerCase()+arg+'>';
			})//.replace(/\<\/([a-z1-6]+)\>/ig, function(s, tag) { return '</'+tag.toLowerCase()+'>';});
		},
		
		/* make xhtml tags */
		xhtmlTags : function(f, html) {
			return html.replace(/\<(img|hr|br)([^>\/]*)\>/gi, "<$1$2 />");
		},
		
		/* proccess html for textarea */
		toSource : function(f, html) { 

			
			html = f.rules.restore(f, html);


			/* clean tags & attributes */
			html = f.rules.cleanup(f, html);
			
			
			
			/* make xhtml tags if required */
			if (f._xhtml) {
				html = f.rules.xhtmlTags(f, html);
			}
			
			return html;
		},
		
		/* proccess html for editor */
		fromSource : function(f, html) { 

			html = f.rules.replace(f, html);
		
			/* clean tags & attributes */
			html = f.rules.cleanup(f, html);
			
			return html;
		},
		
		/* replace swf with placeholder */
		replace : function(f, html) { 
			var n = $('<div/>').html(html);
			
			n.find('object[classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"]')
				.each(function() {
				var t = $(this),
					url = t.children('param[name="'+($.browser.msie ? 'Movie' : 'movie')+'"]').attr('value'),
					st  = t.attr('style')||'',
					w   = parseInt(t.css('width')||0) || parseInt(t.attr('width')||0) || '',
					h   = parseInt(t.css('height')||0) || parseInt(t.attr('height')||0) || '',
					fl  = t.css('float') || t.attr('align'),
					a   = t.css('vertical-align'),
					img = $('<img src="'+f.swfSrc+'" class="'+f.swfClass+'" rel="'+url+'" />');

				img.attr('style', st).css({
					width            : w?(w+'px'):'auto',
					height           : h?h+'px':'auto',
					'float'          : fl,
					'vertical-align' : a
				});
				$(this).replaceWith(img);
			}).end().find('embed[type="application/x-shockwave-flash"]').each(function() {
				var t = $(this),
					url = t.attr('src'),
					st  = t.attr('style')||'',
					w   = parseInt(t.css('width')||0) || parseInt(t.attr('width')||0) || '',
					h   = parseInt(t.css('height')||0) || parseInt(t.attr('height')||0) || '',
					fl  = t.css('float') || t.attr('align'),
					a   = t.css('vertical-align'),
					img = $('<img src="'+f.swfSrc+'" class="'+f.swfClass+'" rel="'+url+'" />');
					img.attr('style', st).css({
						width            : w?(w+'px'):'auto',
						height           : h?h+'px':'auto',
						'float'          : fl,
						'vertical-align' : a
					});
					$(this).replaceWith(img);
			})
			
			return n.html();
		},
		
		/* restore swf from placeholder */
		restore : function(f, html) { 
			var n = $('<div/>').html(html);

			n.find('.'+f.swfClass).each(function() {
				var t = $(this),
					w = parseInt(t.css('width'))||'',
					h = parseInt(t.css('height'))||'',
					s = t.attr('style')
					obj = '<embed type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+t.attr('rel')+'" width="'+w+'" height="'+h+'" style="'+s+'" play="true" loop="true" menu="true"> </embed>';
					// obj = '<object style="'+(t.attr('style')||'')+'" width="'+parseInt(t.css('width'))+'" height="'+parseInt(t.css('height'))+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"><param name="quality" value="high" /><param name="movie" value="'+$(this).attr('rel')+'" /><embed pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="'+$(this).attr('rel')+'" type="application/x-shockwave-flash"></embed></object>';

				// f.rte.log(obj)
				t.replaceWith($(obj));
			})
			.end().find('.Apple-style-span').removeClass('Apple-style-span')
			.end().find('*').each(function() {
				var t = $(this);
				if (t.attr('class') == '') {
					t.removeAttr('class')
				}
				if (t.attr('style') == '') {
					t.removeAttr('style')
				}
			});
			return n.html();
		}
	}
	

	/**
	 * Default chains configuration
	 */
	elRTE.prototype.filter.prototype.chains = {
		toSource   : [ 'toSource' ],
		fromSource : [ 'fromSource' ]
	}
	

	
})(jQuery);