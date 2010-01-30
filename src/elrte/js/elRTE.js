/*
 * elRTE - WSWING editor for web
 *
 * Usage:
 * var opts = {
 *	.... // see elRTE.options.js
 * }
 * var editor = new elRTE($('#my-id').get(0), opts)
 * or
 * $('#my-id').elrte(opts)
 *
 * $('#my-id) may be textarea or any DOM Element with text
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 * Copyright: Studio 42, http://www.std42.ru
 */
(function($) {

elRTE = function(target, opts) {
	if (!target || !target.nodeName) {
		return alert('elRTE: argument "target" is not DOM Element');
	}
	var self     = this, html;
	this.version = '1.0 RC1';
	this.options = $.extend(true, {}, this.options, opts);
	this.browser = $.browser;
	this.target  = $(target);
	
	
	this.toolbar   = $('<div class="toolbar"/>');
	this.iframe    = document.createElement('iframe');
	this.source    = $('<textarea />').hide();
	this.workzone  = $('<div class="workzone"/>').append(this.iframe).append(this.source);
	this.statusbar = $('<div class="statusbar"/>');
	this.tabsbar   = $('<div class="tabsbar"/>');
	this.editor    = $('<div class="'+this.options.cssClass+'" />').append(this.toolbar).append(this.workzone).append(this.statusbar).append(this.tabsbar);
	
	this.doc     = null;
	this.window  = null;
	
	this.utils     = new this.utils(this);
	this.dom       = new this.dom(this);
	this._i18n     = new eli18n({textdomain : 'rte', messages : { rte : this.i18Messages[this.options.lang] || {}} });	

	
	/* attach editor to document */
	this.editor.insertAfter(target);
	/* init editor textarea */
	if (target.nodeName == 'TEXTAREA') {
		this.source.remove();
		this.source = this.target.appendTo(this.workzone);
	} else {
		this.source.val(this.target.hide().html()).attr('name', this.target.attr('id')||this.target.attr('name'));
	}
	/* clean content */
	this.source.val(this.filter(this.source.val(), true));
	/* add tabs */
	if (this.options.allowSource) {
		this.tabsbar.append('<div class="tab editor rounded-bottom-7 active">'+self.i18n('Editor')+'</div><div class="tab source rounded-bottom-7">'+self.i18n('Source')+'</div><div class="clearfix"/>');
	}
	
	this.window = this.iframe.contentWindow;
	this.doc    = this.iframe.contentWindow.document;
	var t = new Date().getMilliseconds();
	/* put content into iframe */
	html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
	$.each(self.options.cssfiles, function() {
		html += '<link rel="stylesheet" type="text/css" href="'+this+'" />';
	});
	this.doc.open();
	this.doc.write(self.options.doctype+html+'</head><body>'+(this.source.val()||'&nbsp;')+'</body></html>');
	this.doc.close();
	
	/* make iframe editable */
	if ($.browser.msie) {
		this.doc.body.contentEditable = true;
	} else {
		try { this.doc.designMode = "on"; } 
		catch(e) { }
		this.doc.execCommand('styleWithCSS', false, this.options.styleWithCSS);
	}
	this.window.focus();
	/* init selection object */
	this.selection = new this.selection(this);
	/* init buttons */
	this.ui = new this.ui(this);
	

	
	this.init = function() {
		this.options.height>0 && this.workzone.height(this.options.height);
		var src = this.filter(target.nodeName == 'TEXTAREA' ? $(target).val() : $(target).html(), true);
		this.source.val(src);
		this.source.attr('name', $(target).attr('name')||$(target).attr('id'));
		if (this.options.allowSource) {
			this.tabsbar.append($('<div />').text(self.i18n('Editor')).addClass('tab editor rounded-bottom-7 active'))
						.append($('<div />').text(self.i18n('Source')).addClass('tab source rounded-bottom-7'))
						.append($('<div />').addClass('clearfix'));
		}
		this.target = $(target).replaceWith(this.editor);
		this.window = this.iframe.contentWindow;
		this.doc    = this.iframe.contentWindow.document;
		
		html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
		if (self.options.cssfiles.length) {
			$.each(self.options.cssfiles, function() {
				html += '<link rel="stylesheet" type="text/css" href="'+this+'" />';
			});
		}
		html = self.options.doctype+html+'</head><body>'+src+'</body></html>';
		this.doc.open();
		this.doc.write(html);
		this.doc.close();
		if(!this.doc.body.firstChild) {
			this.doc.body.appendChild(this.doc.createElement('br'));
		}
		if (this.browser.msie) {
			//this.source.attr('rows', parseInt(this.options.height/17));
			this.doc.body.contentEditable = true;
		} else {
			try { this.doc.designMode = "on"; } 
			catch(e) { }
			this.doc.execCommand('styleWithCSS', false, this.options.styleWithCSS);
		}
		 
		this.window.focus();
		this.selection = new this.selection(this);
		this.ui = new this.ui(this);
		this.editor.parents('form').eq(0).submit(function(e) {
			if (self.source.css('display') == 'none') {
				self.updateSource();
			}
			self.toolbar.find(':hidden').remove();
		});
		
		$(this.doc)
			.keydown(function(e) {
				if (self.browser.safari && e.keyCode == 13) {
			
					if (e.shiftKey || !self.dom.parent(self.selection.getNode(), /^(P|LI)$/)) {
						self.selection.insertNode(self.doc.createElement('br'))
						return false;
					}
				}
			})
			.bind('keyup mouseup', function(e) {
				if (e.type == 'mouseup' || e.ctrlKey || e.metaKey || (e.keyCode >= 8 && e.keyCode <= 13) || (e.keyCode>=32 && e.keyCode<= 40) || e.keyCode == 46 || (e.keyCode >=96 && e.keyCode <= 111)) {
					self.ui.update();
				}
			});
	}
	
	// this.init();
	
	

}

/**
 * Return message translated to selected language
 *
 * @param  string  msg  message text in english
 * @return string
 **/
elRTE.prototype.i18n = function(msg) {
	return this._i18n.translate(msg);
}



/**
 * Display editor
 *
 * @return void
 **/
elRTE.prototype.open = function() {
	this.editor.show();
	// this.target.hide();
}

/**
 * Hide editor and display elements on wich editor was created
 *
 * @return void
 **/
elRTE.prototype.close = function() {
	this.editor.hide();
	// this.target.show();
}

elRTE.prototype.updateEditor = function() {
	$(this.doc.body).html( this.filter(this.source.val(), true) );
	this.window.focus();
	this.ui.update(true);
	this.selection.collapse()
}

elRTE.prototype.updateSource = function() {
	this.source.val(this.filter($(this.doc.body).html()));
	
}

/**
 * Return edited text
 *
 * @return String
 **/
elRTE.prototype.val = function(v, raw) {
	if (typeof(v) == 'string') {
		v = raw ? v : this.filter(v, true)
		$(this.doc.body).html(v);
		this.source.val(v);
	} else {
		this.updateSource();
		return this.source.val();
	}
}

/**
 * Submit form
 *
 * @return void
 **/
elRTE.prototype.save = function() {
	this.editor.parents('form').submit();
}


elRTE.prototype.filter = function(v, input) {
	var html = '';
	var node = $('<span />');
	if (!v.nodeType) {
		html = $.trim(v);
	} else {
		html = $.trim(v.nodeType == 1 ? $(v).html() : v.nodeValue);
	}
	var sw = this.options.stripWhiteSpace;
	$.each(this.filters.html, function() {
		html = this(html, sw);
	});
	
	node.html(html);

	if (input) {
		node.find('a').each(function() {
			if ($(this).attr('name')) {
				$(this).addClass('el-rte-anchor');
			}
		});
		
	} else {
		node.find('a.el-rte-anchor').each(function() {
			if ($.trim($(this).attr('class')) == 'el-rte-anchor') {
				$(this).removeAttr('class');
			} else {
				$(this).removeClass('el-rte-anchor');
			}
		});
	}

	$.each(this.filters.dom, function() {
		node = this(node);
	});
	return node.html();
}



elRTE.prototype.filters = {
	dom  : [
		function(n) { 
			n.find('[align]').not('tbody,tr').each(function() {
				var a = ($(this).attr('align')||'').toLowerCase();
				if ((this.nodeName != 'TD' && this.nodeName != 'TH') || a != 'left') {
					$(this).css('text-align', a).removeAttr('align');
				}
			})
			.end().end().find('[border],[bordercolor]').each(function() {
				var w = parseInt($(this).attr('border')) || 1,
					c = $(this).attr('bordercolor') || '#000';
				$(this).css('border', w+'px solid '+c).removeAttr('border').removeAttr('bordercolor');
			})
			.end().find('[bgcolor]').each(function() {
				$(this).css('background-color', $(this).attr('bgcolor')).removeAttr('bgcolor');
			}).end().find('[background]').each(function() {
				$(this).css('background', 'url('+$(this).attr('background')+')' ).removeAttr('background');
			})
			.end().find('img[hspace],[vspace]').each(function() {
				var v = parseInt($(this).attr('vspace'))||0,
					h = parseInt($(this).attr('hspace'))||0;
				if (v>0 || h>0) {
					$(this).css('margin', (v>0?v:0)+'px '+(h>0?h:0)+'px');
				}
				$(this).removeAttr('hspace').removeAttr('vspace');
			})
			.end().find('[clear]').each(function() {
				var c = ($(this).attr('clear')||"").toLowerCase();
				$(this).css('clear', c == 'all' ? 'both' : c);
			});
			
			if ($.browser.safari) {
				n.find('.Apple-style-span').removeClass('Apple-style-span');
			}
			return n;
		}
	],
	html : [
		function(html, stripWhiteSpace) { 
			var fsize = {
				1 : 'xx-small',
				2 : 'x-small',
				3 : 'small',
				4 : 'medium',
				5 : 'large',
				6 : 'x-large',
				7 : 'xx-large'
			}
			
			html = html.replace(/<font([^>]*)/i, function(str, attr) {
				var css = '', m = attr.match(/size=('|")(\d)/i);
				if (m && m[2] && fsize[m[2]]) {
					css = 'font-size: '+fsize[m[2]]+'; ';
				}
				m = attr.match(/face=('|")([a-z0-9\s,]+)/i);
				if (m && m[2]) {
					css += 'font-family: '+m[2];
				}
				return '<span'+(css ? ' style="'+css+'"' : '');
			})
			.replace(/<\/font/i, '</span')
			.replace(/<b(\s[^>]*)?>/i, '<strong$1>')
			.replace(/<\/b\s*>/i, '</strong>')
			.replace(/<i(\s[^>]*)?>/i, '<em$1>')
			.replace(/<\/i\s*>/i, '</em>')
			.replace(/((class|style)="")/i, '');
			
			//.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, '')
			if (stripWhiteSpace) {
				html = html.replace(/\r?\n(\s)*/mg, "\n");
			}
			return html 
		}
	]
}

elRTE.prototype.log = function(msg) {
	if (window.console && window.console.log) {
		window.console.log(msg);
	}
        
}

elRTE.prototype.i18Messages = {};

$.fn.elrte = function(o) { 
	var cmd = typeof(o) == 'string' ? o : '', ret;
	
	this.each(function() {
		if (!this.elrte) {
			this.elrte = new elRTE(this, typeof(o) == 'object' ? o : {});
		}
		switch (cmd) {
			case 'open':
			case 'show':
				this.elrte.open();
				break;
			case 'close':
			case 'hide':
				this.elrte.close();
				break;
		}
	});
	
	if (cmd == 'val') {
		if (!this.length) {
			return '';
		} else if (this.length == 1) {
			return this[0].elrte.val();
		} else {
			ret = {}
			this.each(function() {
				ret[this.elrte.source.attr('name')] = this.elrte.val();
			});
			return ret;
		}
	}
	return this;
}

})(jQuery);
