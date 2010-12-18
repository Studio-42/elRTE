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
	
	var self   = this,
		o       = rte.options,
		ndx     = ++rte.ndx,
		id      = rte.id+'-'+ndx,
		title   = rte.i18n('Document')+' '+ndx,
		css     = [],
		content = '', 
		html    = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+o.charset+'" />', 
		$src, d;
	
	/**
	 * Set document visible and hide others
	 *
	 * @return elRTE.document
	 */
	this.show = function() {
		this.container.siblings().hide().end().show();
		return this;
	}
	
	/**
	 * Fire beforclose event. If event is not stoped - 
	 * remove document node from editor and remove from this.rte.documents
	 * and fire close event
	 *
	 * @return Boolean
	 */
	this.close = function() {
		var e = this.rte.event('beforeclose', {id : id});
		
		this.rte.trigger(e);

		if (!e.isPropagationStopped()) {
			
			this.rte.counter--;
			this.container.remove();
			delete this.rte.documents[this.id];
			return true;
		}
		return false;
	}
	
	/**
	 * Return true if document iframe(editor) is not hide
	 * Attension! wysiwyg() on not active document may return true
 	 *
	 * @return Boolean
	 */
	this.wysiwyg = function() {
		return this.editor.css('display') != 'none';
	}
	
	/**
	 * Set focus into document iframe/textarea
	 *
	 * @return elRTE.document
	 */
	this.focus = function() {
		this.wysiwyg() ? this.window.focus() : this.source[0].focus();
		return this;
	}
	
	/**
	 * Toggle document iframe/textarea
	 *
	 * @return elRTE.document
	 */
	this.toggle = function() {
		if (this.container.is(':visible') && o.allowSource) {
			this.sync().editor.add(this.source).toggle();
			this.rte.trigger(this.wysiwyg() ? 'wysiwyg' : 'source');
		}
		return this;
	}
	
	/**
	 * Sync data between iframe/textarea
	 *
	 * @return elRTE.document
	 */
	this.sync = function() {
		var s = this.source,
			b = $(this.body),
			f = this.rte.filter;
		this.wysiwyg() ? s.val(f.source(b.html())) : b.html(f.wysiwyg(s.val()));
		return this;
	}
	
	/**
	 * Return document iframe/textarea content
	 *
	 * @return String
	 */
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
	
	/**
	 * Set document content to initial value
	 *
	 * @return void
	 */	
	this.reload = function() {
		switch (o.reloadDocs) {
			case 'ask':
				if (!confirm(rte.i18n('This document alreay opened. Do you want to reload it?'))) {
					return
				}
				
			case true:
			case 'allow':
				this.val(content);
		}
		return;
	}
	
	/**
	 * Editor instance
	 * 
	 * @type elRTE
	 */
	this.rte = rte;
	
	/**
	 * Document id
	 * If document create from DOMElement or Object, id = src.id || src.name || random id,
	 * otherwise id = random id 
	 * 
	 * @type String
	 */
	this.id = '';
	
	/**
	 * Document name (source textarea name attribute)
	 * If document create from DOMElement or Object, name = src.name || this.id,
	 * otherwise id = this.id 
	 * 
	 * @type String
	 */
	this.name      = '';
	
	/**
	 * Document number
	 * 
	 * @type Number
	 */
	this.ndx       = ndx;
	
	/**
	 * Document title, show in tab
	 * 
	 * @type String
	 */
	this.title     = '';
	
	/**
	 * Source textarea
	 * 
	 * @type jQuery
	 */
	this.source    = $('<textarea class="elrte-source"/>');
	
	/**
	 * Editable iframe
	 * 
	 * @type jQuery
	 */
	this.editor    = $('<iframe frameborder="0" class="elrte-editor"/>');
	
	/**
	 * Iframe document
	 * 
	 * @type document
	 */
	this.document  = null;

	/**
	 * Iframe window
	 * 
	 * @type contentWindow
	 */
	this.window    = null;
	
	/**
	 * Document container
	 * 
	 * @type jQuery
	 */
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
	if ((d = rte.documents[this.id])) {
		return rte.documents[this.id].reload();
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
	
	// create document body
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

	// bind events handlers to document
	d = $(this.document);
	$.each(['keydown keyup mousedown mouseup click dblclick dragstart dragend drop cut paste'], function(i, t) {
		d.bind(t, function(e) {
			rte.trigger(e);
		});
	});
	
	// add to editor documents
	rte.documents[this.id] = this;
	rte.counter++;
	// trigger event for this document
	rte.trigger('open', { id : this.id });

}
