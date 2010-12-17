/**
 * @class elRTE document
 * As document source accept DOM Element or plain object or string, 
 * any other type will be treated as empty document
 *
 * @param  DOMElement|Object|String  document source
 * @param  elRTE                     editor instance
 * @return void
 */
elRTE.prototype.document = function(src, rte) {
	
	var o       = rte.options,
		ndx     = ++rte.ndx,
		id      = rte.id+'-'+ndx,
		title   = rte.i18n('Document')+' '+ndx,
		css     = [],
		content = '', 
		html    = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+o.charset+'" />', 
		$src;
	
	this.show = function() {
		this.container.siblings().hide().end().show();
		return this;
	}
	
	this.close = function() {
		var e = this.rte.event('beforeclose', {id : id});
		
		this.rte.trigger(e);

		if (!e.isPropagationStopped()) {
			delete this.rte.documents[this.id];
			this.rte.counter--;
			this.container.remove();
			return true;
		}
		return false;
	}
	
	this.wysiwyg = function() {
		return this.editor.css('display') != 'none';
	}
	
	this.focus = function() {
		this.wysiwyg() ? this.window.focus() : this.source[0].focus();
		return this;
	}
	
	this.toggle = function() {
		if (this.container.is(':visible') && this._tgl) {
			this.sync().editor.add(this.source).toggle();
			this.rte.trigger(this.wysiwyg() ? 'wysiwyg' : 'source');
		}
		return this;
	}
	
	this.sync = function() {
		var s = this.source,
			b = $(this.body),
			f = this.rte.filter;
		this.wysiwyg() ? s.val(f.source(b.html())) : b.html(f.wysiwyg(s.val()));
		return this;
	}
	
	this.val = function(v) {
		var w = this.wysiwyg(),
			s = this.source,
			b = $(this.body),
			f = this.rte.filter;

		if (v === void(0)) {
			return w ? f.source(b.html()) : f.source2source(s.val());
		} 

		w ? b.html(f.wysiwyg(v)) : s.val(f.source(v));
		this.focus();
		w && this.rte.trigger('change');
		return this;
	}	
		
	this.rte       = rte;
	this._tgl      = o.allowSource;
	this.id        = '';
	this.ndx       = ndx;
	this.title     = '';
	this.name      = '';
	this.source    = $('<textarea class="elrte-source"/>');
	this.editor    = $('<iframe frameborder="0" class="elrte-editor"/>');
	this.document  = null;
	this.window    = null;
	this.container = $('<div class="elrte-document"/>');
	
	if (src && src.nodeType == 1) {
		// fetch data from dom elelemnt
		$src       = $(src);
		css        = (''+$src.attr('rel')).split(/\n+/);
		this.id    = src.id || src.name || id;
		this.name  = src.name || this.id;
		this.title = src.title || title;
		
		if ($src.is('textarea,:text')) {
			content = src.value;
		} else if ($src.is('div,p,blockquote,span')) {
			content = $src.html();
		}
		
		if ($src.is('textarea,:input,select') && rte.form && rte.form[0] === $src.parents('form')[0]) {
			$src.attr('disabled', 'disabled');
		}
		o.hideDocSource && $src.hide();
	} else if ($.isPlainObject(src)) {
		// fetch data from plain object
		this.id    = src.id || src.name || id;
		this.name  = src.name || this.id;
		this.title = src.title || title;
		content    = ''+src.content;
		css        = $.isArray(src.css) ? src.css : [];
		
	} else {
		// wtf we get? :)
		this.id    = id;
		this.name  = id;
		this.title = title;
		content    = ''+src;
	}
	
	// check if document already loaded
	if (rte.documents[this.id]) {
		if (o.reopenDoc === false || o.reopenDoc == 'deny') {
			return alert(rte.i18n('This document alreay opened. Reload documents not allowed.'));
		} else if (o.reopenDoc == 'ask') {
			if (confirm(rte.i18n('This document alreay opened. Do you want to reload it?'))) {
				// close document before reopen
				rte.focus(this.id).close(this.id);
			} else {
				return;
			}
		}
	}
	
	// create document view and attach to editor
	this.container
		.append(this.editor)
		.append(this.source.attr('name', this.name).hide())
		.hide()
		.appendTo(rte.viewport);
		
	// after iframe attached to DOM - get its window/document
	this.window   = this.editor[0].contentWindow;
	this.document = this.window.document;
	
	// create iframe html
	$.each(o.cssfiles.concat(css), function(i, url) {
		if ((url = $.trim(url))) {
			html += '<link rel="stylesheet" type="text/css" href="'+url+'"/>';
		}
	});
	
	// write document body
	this.document.open();
	this.document.write(o.doctype+html+'</head><body>'+rte.filter.wysiwyg(content)+' </body></html>');
	this.document.close();
	this.body = this.document.body;
	
	// make iframe editable
	if ($.browser.msie) {
		this.document.body.contentEditable = true;
	} else {
		try { this.document.designMode = "on"; } 
		catch(e) { }
	}
	
	// bind events to document
	
	// @todo - move into opera plugin
	// rise cut/paste events on ctrl+x/v in opera, but not on mac :(
	// on mac opera think meta is a ctrl key
	// i hope only a few nerds use opera on mac :)
	// TODO test on linux/win
	if ($.browser.opera && !this.macos) {
		$(this.document).bind('keydown', function(e) {
			if ((e.keyCode == 88 || e.keyCode == 86) && e.ctrlKey) {
				e.stopPropagation();
				e.preventDefault();
				if (e.keyCode == 86 && !o.allowPaste) {
					return;
				}
				rte.trigger(e.keyCode == 88 ? 'cut' : 'paste');
			}
		});
	}
	
	$(this.document)
		.keydown(function(e) {
			var p, c = e.keyCode;
		
			rte.change  = false;
			rte.lastKey = rte.utils.keyType(e);
		
			// exec shortcut callback
			$.each(rte.shortcuts, function(n, s){
				p = s.pattern;
				if (p.keyCode == c && p.ctrlKey == e.ctrlKey && p.altKey == e.altKey && p.shiftKey == e.shiftKey && (p.meta ? p.metaKey == e.metaKey : true)) {
					e.stopPropagation();
					e.preventDefault();
					s.cmd && rte.trigger('exec', { cmd : s.cmd });
					s.callback(e) && rte.trigger('change', { cmd : s.cmd });
					return false;
				}
			});

			if (!e.isPropagationStopped()) {
				if (c == 9){
					// on tab pressed insert spaces
					// @todo - collapse before insertHtml?
					e.preventDefault();
					rte.selection.insertHtml("&nbsp;&nbsp;&nbsp;");
				} 
			
				if (rte.lastKey == rte.KEY_ENTER 
				||  rte.lastKey == rte.KEY_TAB 
				||  rte.lastKey == rte.KEY_DEL 
				|| (rte.lastKey == rte.KEY_CHAR && !rte.selection.collapsed())) {
					rte.trigger('exec');
					rte.change = true;
				} 
				rte.trigger(e);
			}
		})
		.keyup(function(e) {
			rte.trigger(e);
		
			if (rte.change) {
				rte.trigger('change', {event : e});
			} else if (rte.lastKey == rte.KEY_ARROW) {
				rte.trigger('changePos', {event : e});
			}
			rte.typing = rte.lastKey == rte.KEY_CHAR || rte.lastKey == rte.KEY_DEL;
			rte.lastKey = 0;
			rte.change = false;
		})
		.mouseup(function(e) {
			rte.lastKey = 0;
			rte.typing = false;
			// click on selection not collapse it at a moment
			setTimeout(function() { rte.trigger('changePos', {event : e}); }, 1);
			rte.trigger(e);
		})
		.bind('mousedown click dblclick', function(e) {
			rte.trigger(e);
		})
		.bind('dragstart dragend drop', function(e) {
			// disable drag&drop
			if (!o.allowDragAndDrop) {
				e.preventDefault();
				e.stopPropagation();
			} else if (e.type == 'drop') {
				rte.trigger('change');
			}
		})
		.bind('cut', function(e) {
			rte.trigger('cut')
			setTimeout(function() { rte.trigger('change'); }, 5);
		})
		.bind('paste', function(e) {
			// paste handler
			if (!rte.options.allowPaste) {
				// paste denied 
				e.stopPropagation();
				e.preventDefault();
			} else {
				// create sandbox for paste, clean it content and unwrap
				var dom = rte.dom,
					sel = rte.selection,
					filter = rte.filter,
					a   = rte.active,
					n = dom.create({name : 'div', css : {position : 'absolute', left : '-10000px',top : '0', width : '1px', height : '1px', overflow : 'hidden' }}),
					r = dom.createTextNode(' _ ')
					;

				rte.trigger('paste');
				n.appendChild(r);
				n = sel.deleteContents().insertNode(n);
				sel.select(n.firstChild);
				setTimeout(function() {
					if (n.parentNode && !r.parentNode) {
						// clean sandbox content
						$(n).html(filter.proccess('paste', $(n).html()));
						r = n.lastChild;
						dom.unwrap(n);
						if (r) {
							sel.select(r).collapse(false);
						}
					} else {
						// smth wrong - clean all doc
						n.parentNode && n.parentNode.removeChild(n);
						a.val(filter.wysiwyg(a.val()));
						sel.select(a.document.body).collapse(true);
					}
					rte.trigger('change');
				}, 15);
			}
		});
	
	
	
	// add to editor documents
	rte.documents[this.id] = this;
	rte.counter++;
	// trigger event for this document
	rte.trigger('open', { id : this.id });

}
