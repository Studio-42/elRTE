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
	this.version = '1.0 RC4';
	this.build   = '20100330';
	this.options = $.extend(true, {}, this.options, opts);
	this.browser = $.browser;
	this.target  = $(target);
	
	
	this.toolbar   = $('<div class="toolbar"/>');
	this.iframe    = document.createElement('iframe');
	// this.source    = $('<textarea />').hide();
	this.workzone  = $('<div class="workzone"/>').append(this.iframe).append(this.source);
	this.statusbar = $('<div class="statusbar"/>');
	this.tabsbar   = $('<div class="tabsbar"/>');
	this.editor    = $('<div class="'+this.options.cssClass+'" />').append(this.toolbar).append(this.workzone).append(this.statusbar).append(this.tabsbar);
	
	this.doc     = null;
	this.$doc    = null;
	this.window  = null;
	
	this.utils     = new this.utils(this);
	this.dom       = new this.dom(this);
	this._i18n     = new eli18n({textdomain : 'rte', messages : { rte : this.i18Messages[this.options.lang] || {}} });	
	this.filter    = new this.filter(this)
	
	/* attach editor to document */
	this.editor.insertAfter(target);
	/* init editor textarea */
	var content = '';
	if (target.nodeName == 'TEXTAREA') {

		this.source = this.target.remove()
		this.source.insertAfter(this.iframe).hide();
		content = this.target.val();
	} else {
		this.source = $('<textarea />').insertAfter(this.iframe).hide()
		this.source.attr('name', this.target.attr('id')||this.target.attr('name'));
		content = this.target.hide().html();
	}

	content = $.trim(content);
	if (!content) {
		content = ' ';
	}

	/* add tabs */
	if (this.options.allowSource) {
		this.tabsbar.append('<div class="tab editor rounded-bottom-7 active">'+self.i18n('Editor')+'</div><div class="tab source rounded-bottom-7">'+self.i18n('Source')+'</div><div class="clearfix" style="clear:both"/>')
			.children('.tab').click(function(e) {
				if (!$(this).hasClass('active')) {
					self.tabsbar.children('.tab').toggleClass('active');
					self.workzone.children().toggle();

					if ($(this).hasClass('editor')) {
						self.updateEditor();
						self.window.focus();
						self.ui.update(true);
					} else {
						self.updateSource();
						self.source.focus();
						if ($.browser.msie) {
							// @todo
						} else {
							self.source[0].setSelectionRange(0, 0);
						}
						self.ui.disable();
						self.statusbar.empty();
						
					}
				}
				
			});
	}
	
	this.window = this.iframe.contentWindow;
	this.doc    = this.iframe.contentWindow.document;
	this.$doc   = $(this.doc);
	
	/* put content into iframe */
	html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
	$.each(self.options.cssfiles, function() {
		html += '<link rel="stylesheet" type="text/css" href="'+this+'" />';
	});
	this.doc.open();
	// var s = this.filter.fromSource(content)
	var s = this.filter.wysiwyg(content)
	this.doc.write(self.options.doctype+html+'</head><body>'+(s)+'</body></html>');
	this.doc.close();
	
	// this.source.val(this.filter.toSource(content));
	// this.log($(this.doc.body).html())
	/* make iframe editable */
	if ($.browser.msie) {
		this.doc.body.contentEditable = true;
	} else {
		try { this.doc.designMode = "on"; } 
		catch(e) { }
		this.doc.execCommand('styleWithCSS', false, this.options.styleWithCSS);
	}
	
	if (this.options.height>0) {
		this.workzone.height(this.options.height);
		$(this.iframe).height(this.options.height);
		this.source.height(this.options.height);
	}
	
	this.window.focus();
	
	this.history = new this.history(this)
	
	/* init selection object */
	this.selection = new this.selection(this);
	/* init buttons */
	this.ui = new this.ui(this);
	
	
	/* bind updateSource to parent form submit */
	this.target.parents('form').bind('submit', function() {
		self.beforeSave();
	});
	
	/* update buttons on click and keyup */
	this.$doc.bind('mouseup', function() {
		self.ui.update();
	}).bind('keyup', function(e) {
		if ((e.keyCode >= 8 && e.keyCode <= 13) || (e.keyCode>=32 && e.keyCode<= 40) || e.keyCode == 46 || (e.keyCode >=96 && e.keyCode <= 111)) {
			// self.log('keyup '+e.keyCode)
			self.ui.update();
		}
	}).bind('keydown', function(e) {
		if ((e.metaKey || e.ctrlKey) && e.keyCode == 65) {
			self.ui.update();
		} else if (e.keyCode == 13) {
			var n = self.selection.getNode();
			// self.log(n)
			if (self.dom.selfOrParent(n, /^PRE$/)) {
				self.selection.insertNode(self.doc.createTextNode("\r\n"));
				return false;
			} else if ($.browser.safari && e.shiftKey) {
				self.selection.insertNode(self.doc.createElement('br'))
				return false;
			}
		}
	})
	
	this.typing = false;
	this.lastKey = null;
	
	this.$doc.bind('keydown', function(e) {
		//@todo shortcuts
		
		if ((e.keyCode>=48 && e.keyCode <=57) || e.keyCode==61 || e.keyCode == 109 || (e.keyCode>=65 && e.keyCode<=90) || e.keyCode==188 ||e.keyCode==190 || e.keyCode==191 || (e.keyCode>=219 && e.keyCode<=222)) {
			if (!self.typing) {
				self.history.add(true);
			}
			self.typing = true;
			self.lastKey = null;
		} else if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 32 || e.keyCode == 13) {
			if (e.keyCode != self.lastKey) {
				self.history.add(true)
			}
			self.lastKey = e.keyCode
			self.typing = false
		}

	}).bind('mouseup', function() {
		self.typing = false;
		self.lastKey = null;
	}).bind('paste', function(e) {
		setTimeout( function() { 
			self.updateSource();
			$(self.doc.body).html(self.filter.fromSource(self.source.val()));
		}, 30);
	});
	
	if ($.browser.msie) {
		this.$doc.bind('keyup', function(e) {
			if (e.keyCode == 86 && (e.metaKey||e.ctrlKey)) {
				self.updateSource();
				$(self.doc.body).html(self.filter.fromSource(self.source.val()));
			}
		});
	}
	this.window.focus();
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
}

/**
 * Hide editor and display elements on wich editor was created
 *
 * @return void
 **/
elRTE.prototype.close = function() {
	this.editor.hide();
}

elRTE.prototype.updateEditor = function() {
	this.val(this.source.val());
}

elRTE.prototype.updateSource = function() {
	this.source.val(this.filter.source($(this.doc.body).html()));
}

/**
 * Return edited text
 *
 * @return String
 **/
elRTE.prototype.val = function(v) {
	if (typeof(v) == 'string') {
		v = ''+v;
		if (this.source.is(':visible')) {
			this.source.val(this.filter.source2source(v));
		} else {
			if ($.browser.msie) {
				this.doc.body.innerHTML = '<br />'+this.filter.wysiwyg(v);
				this.doc.body.removeChild(this.doc.body.firstChild);
			} else {
				this.doc.body.innerHTML = this.filter.wysiwyg(v);
			}
			
		}
	} else {
		if (this.source.is(':visible')) {
			return this.filter.source2source(this.source.val());
		} else {
			return this.filter.source($(this.doc.body).html());
		}
	}
}

elRTE.prototype.beforeSave = function() {
	this.source.val(this.val()||'');
}

/**
 * Submit form
 *
 * @return void
 **/
elRTE.prototype.save = function() {
	this.beforeSave();
	this.editor.parents('form').submit();
}

elRTE.prototype.log = function(msg) {
	if (window.console && window.console.log) {
		window.console.log(msg);
	}
        
}

elRTE.prototype.i18Messages = {};

$.fn.elrte = function(o, v) { 
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
			case 'updateSource':
				this.elrte.updateSource();
				break;
		}
	});
	
	if (cmd == 'val') {
		if (!this.length) {
			return '';
		} else if (this.length == 1) {
			return v ? this[0].elrte.val(v) : this[0].elrte.val();
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
