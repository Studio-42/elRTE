(function($) {
	
	elRTE.prototype.filter = function(rte) {
		this.rte = rte;
		this._chains = {}
		this.tagRegex = /<(\/?)(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)(\s*\/?)>/g;
		this.attrRegex = /(\w+)(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^\s]+))?/g;
		
		this.denyTagsReg = this.rte.options.denyTags.length 
			? new RegExp('<(\/?)('+this.rte.options.denyTags.join('|')+')((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>\s]+))?)*)(\s*\/?)>', 'g') 
			: null;
		
		var self = this;
		
		var _nst = [];
		$.each(this.nonSemanticTags, function(t) {
			
			_nst.push(t)
		})
		
		this.nsTagRegex = _nst.length ? new RegExp('<(\/?)('+_nst.join('|')+')(\s+[^>]*)?>', 'gi') : null;
		
		if (!this.chains.fromSource.length) {
			this.chains.fromSource = ['clean'];
		}
		if (!this.chains.toSource.length) {
			this.chains.toSource = ['clean'];
		}
		
		// cache existed chains
		$.each(this.chains, function(n) {
			self._chains[n] = [];
			$.each(this, function() {
				var r = this.toString();
				typeof(self.rules[r]) == 'function' && self._chains[n].push(self.rules[r]);
			});
		});
		
		// filter through required chain
		this.filter = function(chain, html) {
			$.each(this._chains[chain]||[], function() {
				html = this.call(self, html);
			});
			return html;
		}
		
		// wrapper for "toSource" chain
		this.toSource = function(html) {
			return this.filter('toSource', html);
		}
		
		// wrapper for "fromSource" chain
		this.fromSource = function(html) {
			return this.filter('fromSource', html);
		}
	}
	
	elRTE.prototype.filter.prototype.nonSemanticTags = {
		b      : { tag : 'strong' },
		big    : { tag : 'span', style : 'font-size:xx-large'},
		center : { tag : 'div', style : 'text-align:center' },
		i      : { tag : 'em' },
		u      : { tag : 'span', style : 'text-decoration:underline' },
		font   : { tag : 'span' },
		xmp    : { tag : 'pre' }
	}
	
	// 1 allowed/denied tags
	// 2 ms office
	// 3 non semantic tags
	// 4 non semantic attrs
	// 5 custom replace/restore
	// 6 replace/restore (flash/google maps/video/audio protected nodes)
	// 7 empty spans
	// 8 nested spans
	// browser specific attrs
	// 9 xhtml tags
	// 10 tagsToLower (IE || opera)
	
	elRTE.prototype.filter.prototype.rules = {
		/**
		 * If this.rte.options.allowTags is set - remove all except this ones
		 * If this.rte.options.denyTags is set - remove all deny tags
		 *
		 * @param String  html code
		 * return String
		 **/
		allowedTags : function(html) {
			var a = this.rte.options.allowTags;
			if (a.length) {
				html = html.replace(this.tagRegex, function(t, c, n) {
					return $.inArray(n, a) != -1 ? t : '';
				});
			}
			return this.denyTagsReg ? html.replace(this.denyTagsReg, '') : html;
		},
		/**
		 * Clean ms/open office special stuffs
		 *
		 * @param String  html code
		 * return String
		 **/
		msOffice : function(html) {
			return html;
		},
		/**
		 * Replace non semantic tags
		 *
		 * @param String  html code
		 * return String
		 **/
		tags : function(html) {
			// this.rte.log(this.nsTagRegex)
			var self = this
				tags = this.nonSemanticTags;
			
			
			var tagRegExp = /<(\/?)(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)(\s*\/?)>/g;
			// var attrRegExp = /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
			var attrRegExp = /(\w+)(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^\s]+))?/g
			// var attrRegExp = /(\w+)((\s*=\s*)('|")?(.*)(\4)?)?/gi
			function attrs(a) {
				var m = a.match(attrRegExp),
					attrs = {};
				
				// self.rte.log(m)
				if (m) {
					$.each(m, function() {
						var t = this.toString().split('='),
						 	n = $.trim(t[0]);
						attrs[n] = t[1] ? $.trim(t[1]).replace(/^('|")(.*)(\1)$/, "$2") : n;
					});
				}
				self.rte.log(attrs)
			}
			
			

			

			
			return html;
		},
		tagsToLower : function(html) {
			return html;
		},
		customReplace : function(html) {
			
		},
		clean : function(html) {
			this.rte.log('clean called')
			return 'clean'+html
		},
		replace : function(html) {
			return 'replace'+html
		},
	}
	
	elRTE.prototype.filter.prototype.chains = {
		fromSource : ['allowedTags', 'msOffice', 'tags'],
		toSource   : ['allowedTags', 'msOffice', 'tags']
	}
	
	
	//////////////////////////////////
	
	elRTE.prototype._filter_ = function(rte) {
		this.rte = rte;
		/**
		 * Allowed tags list
		 **/
		this.allow = rte.options.allowTags.length ? rte.options.allowTags : [];
		/**
		 * Deny tags regexp
		 **/
		this.deny  = rte.options.denyTags.length ? new RegExp('<(\/?)('+rte.options.denyTags.join('|')+')([^>]*)>', 'gi') : null;
		
		// rte.log(this.denyTags)
		
		this.chains = {};
		var self = this;
		$.each(this.chainsConf, function(n) {
			self.chains[n] = [];
			$.each(this, function() {
				typeof(self.rules[this]) == 'function' && self.chains[n].push(self.rules[this]);
			});
		});

		// rte.log(self.chains)

		this._apply = function(html, chain) {
			// rte.lo
			var i, c = this.chains[chain]
			if (c) {
				for (var i=0; i<c.length; i++) {
					html = c[i](this, html);
					// this.rte.log(this)
				}
			}
			return html;
		}

		this.toSource = function(html) {
			return this._apply(html, 'toSource');
		}
		
		this.fromSource = function(html) {
			return this._apply(html, 'fromSource');
		}
		
		this.appendStyle = function(a, s) {
			return a.indexOf('style="') == -1 ? ' style="'+s+'"' : a.replace('style="', 'style="'+s+';')
		}
		
	}
	
	function appendStyle(a, s) {
		return a.indexOf('style="') == -1 ? ' style="'+s+'"'+a : a.replace('style="', 'style="'+s+';')
	}
	
	function fontSize(f) {
		var s = ['', 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
		return s[f]||'medium';
	}
	
	// function fontFamily = function(f) {
		// var fonts = 
	// }
	
	elRTE.prototype._filter_.prototype.cleanRules = {
		b : [/<(\/?)b(\s[^>]*)*>/gi, "<$1strong$2>"],
		big : [/<(\/?)big([^>]*)>/gi, function(m, c, a) { return '<'+c+'span'+(!c ? appendStyle(a, 'font-size:large') : '')+'>'; } ],
		center : [/<(\/?)center([^>]*)>/gi, function(m, c, a) { return '<'+c+'div'+(!c ? appendStyle(a, 'text-align:center') : '')+'>'; } ],
		
		dir : [/<(\/?)(dir|menu)(\s[^>]*)*>/gi, "<$1ul$3>"],
		i : [/<(\/?)i(\s[^>]*)*>/gi, "<$1em$2>"],
		font : [/<(\/?)font([^>]*)>/gi, function(m, s, a) {
			
			m.replace(/(color|face|size)=(?:'|")([^'"]+)('|")/gi, function(m, a, v) { window.console.log(a+' '+v)  })
			return m
		}],
		xmp : [/<(\/?)xmp(\s[^>]*)*>/gi, "<$1pre$2>"],
		dummy : function(html) { return html }
	}
	
	elRTE.prototype._filter_.prototype.replaceRules = {
		flash : [function(html) { return html; }, function(html) { return html; }]
	}
	
	elRTE.prototype._filter_.prototype.rules = {
		allowTags : function(f, html) {
			if (f.allow.length) {
				html = html.replace(/<(?:\/?)([a-z0-9:]+)([^>]*)>/gi, function(m, t) {
					return $.inArray(t, f.allow) != -1 ? m : '';
				});
			} else if (f.deny) {
				html = html.replace(f.deny, '');
			}
			return html;
		},
		clean : function(f, html) {
			$.each(f.cleanRules, function(n) {
				switch (this.constructor) {
					case RegExp: 
						html = html.replace(this, '');
						break;
					case Function: 
						html = this(html);
						break;
					case Array: 
						html = html.replace(this[0], this[1]||'');
						break;
				}
			});
			return html;
		},
		msClean : function(f, html) {
			return html;
		},
		replace : function(f, html) {
			return html;
		},
		restore : function(f, html) {
			return html;
		}
	}
	
	elRTE.prototype._filter_.prototype.chainsConf = {
		'toSource'   : ['allowTags', 'msClean', 'clean', 'restore'],
		'fromSource' : ['allowTags', 'msClean', 'clean', 'replace']
	}
	
	/**
	 * @class Clean html and make replace/restore for some patterns
	 *
	 * @param elRTE
	 * @author Dmitry (dio) Levashov dio@std42.ru
	 * @todo - replace/restore scripts
	 */
	elRTE.prototype._filter = function(rte) {
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
		/* swf placeholder url */
		var url, n = $('<span />').addClass(this.swfClass).appendTo(rte.view.editor).text('swf')[0];
		if (typeof n.currentStyle != "undefined") {
			url = n.currentStyle['backgroundImage'];
		} else {
			url = document.defaultView.getComputedStyle(n, null).getPropertyValue('background-image');
		}
		this.swfSrc = url ? url.replace(/^url\("?([^"]+)"?\)$/, "$1") : '';
		$(n).remove();
		
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
	elRTE.prototype._filter.prototype.rules = {
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
			return html;
			
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
			return html;
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
				
				t.replaceWith(obj);
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
	elRTE.prototype._filter.prototype.chains = {
		toSource   : [ 'toSource' ],
		fromSource : [ 'fromSource' ]
	}
	

	
})(jQuery);