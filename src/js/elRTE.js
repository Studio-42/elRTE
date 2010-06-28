(function($) {
	
	/**
	 * Class
	 *
	 * @param DOMElement  
	 * @param Object  elrte options
	 */
	elRTE = function(t, o) {
		if (!t || !t.nodeName) {
			return alert('elRTE init failed! First argument should be DOMElement');
		}
		
		
		var self = this, tb, l, p, i;
		this.time('load')
		/* version */
		this.version   = '1.1 dev';
		/* build date */
		this.build     = '20100626';
		/* DOM element on witch elRTE created */
		this.target    = $(t).hide()[0];
		/* editor config */
		this.options   = $.extend(true, {}, this.options, o);
		this.toolbar   = '';
		this.commands  = {};
		this.plugins   = {};
		/* editor DOM element id. Used as base part for inner elements ids */
		this.id        = 'elrte-'+($(t).attr('id')||$(t).attr('name')||Math.random().toString().substr(2));
		/* inner flag - editor created and load documents */
		this._load      = false;    
		/* opened documents */
		this.documents = [];
		/* active(visible) document */
		this.active    = null;
		/* events listeners */
		this.listeners = {
			/* called after elRTE init and load all documents */
			'load'    : [],
			/* called after new document added to editor */
			'open'    : [], 
			/* called after document switch to wysiwyg mode */
			'focus'   : [], 
			/* called after document switch to source mode */
			'source'  : [],
			/* called after document set invisible */
			'blur'    : [],
			/* called before close document */
			'close'   : [],
			/* called after current position changes */
			'input'  : [],
			/* called after some changes was made in document */
			'change'  : [],
			
			/* called before send form */
			'save'    : [],
			/* called on click on editor document */
			'click'   : [],
			/* called on keydown on editor document */
			'keydown' : [],
			/* called on keyup on editor document */
			'keyup'   : [],
			'paste'   : []
			};
		/* editor view */
		this.view      = new this.view(this);
		/* DOM manipulation */
		this.dom       = new this.dom(this);
		/* selection and text text range */
		this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);

		this.filter = new this.filter(this)

		this.history = new this.history(this);
		
		/* load commands */
		this.loadToolbar(this.options.toolbar)

		/* load plugins */
		for (i=0; i < this.options.plugins.length; i++) {
			if ( (p = this._plugins[this.options.plugins[i]]) ) {
				this.plugins[p] = new p(this);
			}
		};
		
		/* load documents */
		this.options.loadTarget && this.options.documents.unshift(t);
		
		for (i=0; i<this.options.documents.length; i++) {
			this.open(this.options.documents[i]);
		}
		if (this.documents.length) {
			this.focus(this.documents[this.options.active] ? this.options.active : 0).trigger('focus');
		}
		this.view.editor.parents('form').bind('submit', function() { self.trigger('save'); })
		this.trigger('load');
		delete(this.listeners.load);

		this.timeEnd('load');
	}

	/* API */

	/**
	 * Load commands defined by required toolbar
	 * and display toolbar if allowed
	 *
	 * @param  String  toolbar name
	 * @return elRTE
	 **/
	elRTE.prototype.loadToolbar = function(tb) {
		var t, i, p, l;
		this.commands = {};
		this.toolbar = this.options.toolbars[tb] ? tb : 'default';
		t = this.options.toolbars[this.toolbar];
		i = t.length;
		
		while (i--) {
			p = this.options.panels[t[i]];
			if (typeof(p) != 'undefined' && (l = p.length)) {
				while (l--) {
					if (typeof(this._commands[p[l]]) == 'function') {
						this.commands[p[l]] = new this._commands[p[l]](this);
					}
				}
			}
		}
		this.view.cleanToolbar();
		this.options.allowToolbar && this.view.showToolbar(t);
		return this;
	}

	/**
	 * Return index of document by id or -1 if not exists
	 *
	 * @param  String  document id
	 * @return Number
	 **/
	elRTE.prototype.indexOf = function(id) {
		var l = this.documents.length;
		while (l--) {
			if (this.documents[l].id === id) {
				return l;
			}
		}
		return -1;
	}

	/**
	 * Return document by id or index
	 *
	 * @param  String|Number  document id/index
	 * @return Object
	 **/
	elRTE.prototype.getDocument = function(i) {
		if (typeof(i) == 'string') {
			i = this.indexOf(i);
		}
		if (typeof(i) == 'number' && typeof(this.documents[i]) != 'undefined') {
			return this.documents[i];
		}
	}

	/**
	 * Open document in editor and return its id.
	 * Document may be dom node or js object:
	 * {
	 *   id : document id - not required, if not set - generates automatically, 
	 *   name : name for textarea - not required - if not set - id used,
	 *   content : document text - required,
	 *   closable : allow close document
	 * }
	 *
	 * @param  DOMElement|Object  document
	 * @return String
	 **/
	elRTE.prototype.open = function(d) {

		if (!d || (d.nodeType != 1 && typeof(d.content) != 'string')) {
			return;
		}
		
		var self  = this,
			ndx   = this.documents.length+1,
			id    = this.id+'-document-'+ndx,
			title = this.i18n('Document')+' '+ndx,
			doc   = { id : id },
			e     = $.Event('open');
			
		doc.title = d.title||title;
		if (d.nodeType == 1) {
			doc.source = d.nodeName == 'TEXTAREA' ? $(d) : $('<textarea name="'+(d.name||id)+'" />').val($(d).html());
			doc.closeable = $(d).hasClass('closable') ? true : this.options.allowCloseDocs;
		} else {
			doc.source = $('<textarea name="'+(d.name||id)+'" />').val(d.content||'');
			doc.closeable = typeof(d.closable) != 'undefined' ? !!d.closable : this.options.allowCloseDocs;
		}
		
		doc.editor = $('<iframe frameborder="0" />');
		
		/* render document */
		this.view.add(doc);
		doc.window   = doc.editor[0].contentWindow;
		doc.document = doc.editor[0].contentWindow.document;
		
		/* add to opened documents */
		this.documents.push(doc);
		if (ndx == 1) {
			this.active = this.documents[0];
		}
		
		/* create body in iframe */
		html = this.options.doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+this.options.charset+'" />';
		$.each(self.options.cssfiles, function() {
			html += '<link rel="stylesheet" type="text/css" href="'+this+'"/>';
		});
		doc.document.open();
		doc.document.write(this.options.doctype+html+'</head><body> </body></html>');
		doc.document.close();
		/* set document content from textarea */
		$(doc.document.body).html(this.filter.fromSource(doc.source.val()));
		/* set textarea content */

		/* make iframe editable */
		if ($.browser.msie) {
			doc.document.body.contentEditable = true;
		} else {
			try { doc.document.designMode = "on"; } 
			catch(e) { }
		}



		$(doc.document).bind('paste', function(e) {
			self.trigger('paste').trigger('change');
		}).bind('keydown', function(e) {
			var ev;
			self.trigger(e);
			if (e.metaKey && e.keyCode==88) {
				ev = $.Event('change');
				self.log('cut')

			}
			
		}).bind('keyup', function(e) {
			var ev;
			self.trigger(e);
			if (!e.ctrlKey && !e.metaKey && self.utils.kbd.isChar(e.keyCode)) {
				ev = $.Event('input');
			} else if (self.utils.kbd.isDel(e.keyCode) || (e.keyCode == 13 && !e.shiftKey)) {
				ev = $.Event('change');
			}

			if (ev) {
				ev.originalEvent = e;
				self.trigger(ev);
			}

		})

		e.target = doc;
		this.trigger(e);
		return id;
	}

	/**
	 * Close document
	 *
	 * @param Number|String  document index/id
	 * @return elRTE
	 */
	elRTE.prototype.close = function(i) {
		var e   = $.Event('close'), 
			l   = this.documents.length, 
			tmp = [],
			d, next;
			
		if ((d = this.getDocument(i)) && d.closeable) {
			
			if (d.id == this.active.id && l>1) {
				next = this.getDocument((i = this.indexOf(d.id))==0 ? 1 : i-1);
			}

			e.target = d;
			this.trigger(e);
			this.view.remove(d.id);

			while (l--) {
				d.id != this.documents[l].id && tmp.push(this.documents[l]);
			}
			this.documents = tmp;
			next && this.focus(next.id)
		}
		return this;
	}

	/**
	 * Set document active (visible) if is not. 
	 * Set focus into document editor/source
	 *
	 * @param  String|Number  document id/index
	 * @return elRTE
	 **/
	elRTE.prototype.focus = function(i) {
		if (this.documents.length) {
			var a = this.active || this.documents[0],
				d = this.getDocument(i)||this.active;
				
			if (d && d.editor) {
				if (d.id != a.id) {
					this.isSource() && this.toggle();
					this.trigger('blur').view.focus(d.id);
				}
				(d.editor.is(':visible') ? d.window : d.source[0]).focus();
				if (d.id != a.id) {
					this.active = d;
					this.trigger('focus');
				}
			}
		}
		return this;
	}
	
	/**
	 * Switch between editor and source in active document 
	 * if source access eneabled
	 * @todo for firefox set curret to start of texarea
	 *
	 * @return elRTE
	 */
	elRTE.prototype.toggle = function() {
		if (this.options.allowSource && this.active) {
			this.sync(this.active.id).view.toggle();
			this.focus().trigger(this.isWysiwyg() ? 'focus' : 'source');
		}
		return this;
	}
	
	/**
	 * Sync data between editor/source in active document or in all documents
	 * If editor is visible for now, data copy from editor to source and other wise
	 *
	 * @param  String|Number  document id/index, not set for sync all documents 
	 * @return elRTE
	 **/
	elRTE.prototype.sync = function(i) {
		var d, l;
		d = typeof(i) != 'undefined' && (d = this.getDocument(i)) ? [d] : this.documents;
		l = d.length;

		while (l--) {
			if (d[l].source.is(':visible')) {
				$(d[l].document.body).html(this.filter.fromSource(d[l].source.val()));
			} else {
				d[l].source.val(this.filter.toSource($(d[l].document.body).html()));
			}
		}
		return this;
	}

	/**
	 * Return true if active document in wisiwyg mode
	 *
	 * @return Boolean
	 */
	elRTE.prototype.isWysiwyg = function() {
		return this.active && this.active.editor.is(':visible');
	}
	
	/**
	 * Return true if active document in source mode
	 *
	 * @return Boolean
	 */
	elRTE.prototype.isSource = function() {
		return this.active && this.active.source.is(':visible');
	}
	
	/**
	 * Return required document content
	 *
	 * @param  String|Number  document id/index
	 * @return String
	 */
	elRTE.prototype.getContent = function(i) {
		var d = this.getDocument(i);
		if (d && d.editor) {
			return d.source.is(':visible') ? d.source.val() : $(d.document.body).html();
		}
		return '';
	}

	elRTE.prototype.setContent = function(i) {
		
	}

	/**
	 * Bind callback to event(s)
	 * To bind multiply events at once, separate events names by space
	 *
	 * @param String    event name
	 * @param Function  callback
	 * @return elRTE
	 */
	elRTE.prototype.bind = function(e, c) {
		var event;
		if (typeof(c) == 'function') {
			e = e.split(' ');
			for (var i=0; i < e.length; i++) {
				event = $.trim(e[i]);
				if (typeof(this.listeners[event]) == 'undefined') {
					this.listeners[event] = [];
				}
				this.listeners[event].push(c);
			};
		}
		return this;
	}
	
	/**
	 * Send notification to all event subscribers
	 *
	 * @param String event name
	 */
	elRTE.prototype.trigger = function(e, d) {
		if (typeof(e) == 'string') {
			e = $.Event(e);
		}
		if (!e.elrteDocumentId && this.active) {
			e.elrteDocumentId = this.active.id;
		}
		// this.log(d)
		if (typeof(e.data) == 'undefined' && typeof(d) == 'object') {
			e.data = d;
		}

		this.debug(e.type+' '+e.elrteDocumentId);
		if (this.listeners[e.type] && this.listeners[e.type].length) {
			
			for (var i=0; i < this.listeners[e.type].length; i++) {
				if (e.isPropagationStopped()) {
					this.log(e.type+' stopped')
					break;
				}
				this.listeners[e.type][i](e);
			};
		}
		
		return this;
	}
	

	
	


	/**
	 * send message to console log if debug is enabled in config
	 *
	 * @param String  message
	 */
	elRTE.prototype.debug = function(m) {
		this.options.debug && this.log(m)
	}

	/**
	 * send message to console log
	 *
	 * @param String  message
	 */
	elRTE.prototype.log = function(m) {
		window.console && window.console.log && window.console.log(m);
	}

	elRTE.prototype.time = function(l) {
		window.console && window.console.time && window.console.time(l);
	}
	
	elRTE.prototype.timeEnd = function(l) {
		window.console && window.console.timeEnd && window.console.timeEnd(l);
	}

	elRTE.prototype.i18n = function(m) {
		return m;
	}

	elRTE.prototype.show = function() {
		
	}
	
	elRTE.prototype.hide = function() {
		
	}





	

	


	elRTE.prototype.exec = function(cmd, c) {
		switch (cmd) {
			
			case 'open':
			
				break;
				
			case 'close':
			
				break;
				
			case 'save':
			
				break;
				
			case 'focus':
			
				break;
				
			case 'sourceFocus':
			
				break;
			
		}
	}


	
	/**
	 * elRTE plugins
	 *
	 */
	elRTE.prototype._plugins = {};
	
	/**
	 * elRTE commands
	 *
	 */
	elRTE.prototype._commands = {};	

	/**
	 * jquery plugin
	 *
	 * @param Object|String  elrte options or command
	 */
	$.fn.elrte = function(o) {
		
		return this.each(function() {
			if (!this.elrte) {
				this.elrte = new elRTE(this, typeof(o) == 'object' ? o : {});
			}
			
			if (o.cmd && typeof o.cmd == 'string') {
				switch (o.cmd) {
					case 'open':
						window.console.log('open')
						break;
						
					case 'close':
						window.console.log('close')
						break;
						
					case 'val':
						window.console.log('val')
						break;
						
					case 'trigger':
						window.console.log('trigger')
						break;
				}
			}
			
			

		});
	}
	
})(jQuery);