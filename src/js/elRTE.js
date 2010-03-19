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
		
		function _id(n) {
			return n && n.nodeName 
				? $(n).attr('id')||$(n).attr('name')||Math.random().toString().substr(2)
				: Math.random().toString().substr(2)
		}
		
		var self = this;
			
		
		this.version   = '1.0 RC4 dev';
		this.build     = '20100204';
		/* editor config */
		this.options   = $.extend(true, {}, this.options, o);
		/* editor DOM element id. Used as base part for inner elemnets ids */
		this.id        = 'elrte-'+_id(t);
		/* opened documents */
		this.documents = [];
		/* active(visible) document index */
		this.active    = 0;
		this.wysiwyg   = true;
		/* events listeners */
		this.listeners = {
			/* called when new document added to editor */
			'open'   : [], 
			/* called when document set visible or clicked */
			'focus'  : [], 
			/* called when document set invisible */
			'blur'   : [],
			/* called when switch fron editor to source or back in active document */
			'toggle' : [], 
			/* called after exec command or click */
			'update' : [],
			/* called before send form */
			'save'   : []};
		/* editor view */
		this.view      = new this.view(this, t);
		/* DOM manipulation */
		this.dom       = new this.dom(this);
		/* selection and text text range */
		this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);

		

		
		/* on document blur hide source if visible and update editor */
		this.bind('blur', function(e) {
			if (self.documents[self.active].source.is(':visible')) {
				self.toggle();
			}
		});
		

		
		/* load documents */
		this.options.documents.unshift(t);
		$.each(this.options.documents, function() {
			this.nodeName && self.open(this);
		});
		
		/* focus selected or first document */
		this.focus(this.options.active>=0 && this.documents[this.options.active] ? this.options.active : 0);
		
		/* load plugins and commands */
		var plugins = [], i, j, p, commands = [], pn, n, cmd;
		for (i=0; i < this.options.plugins.length; i++) {
			if ( (p = this.plugins[this.options.plugins[i]]) ) {
				plugins.push(new p(this));
			}
		};
		this.plugins = plugins;
		
		/* load commands */
		var d = new Date().getMilliseconds()
		
		if (!this.options.toolbars[this.options.toolbar]) {
			this.options.toolbar = 'default';
		}
		
		panels = this.options.toolbars[this.options.toolbar];
		for (i=0; i < panels.length; i++) {
			var	pn = panels[i],
				n  = this.options.panels[pn],
				p  = this.view.createPanel(pn);

			for (j=0; j < n.length; j++) {
				this.debug('command '+n[j]+' loaded')
				if (typeof(this.commands[n[j]]) == 'function') {
					cmd = new this.commands[n[j]](this);
					p.append(cmd.button);
				}
			};
			
			this.view.addPanel(p);
		};
		this.log(new Date().getMilliseconds() - d)

		this.trigger('update');
		// this.log($.browser)
	}



	/**
	 * send message to console log
	 *
	 * @param String  message
	 */
	elRTE.prototype.log = function(m) {
		window.console && window.console.log && window.console.log(m);
	}

	/**
	 * send message to console log if debug is enabled in config
	 *
	 * @param String  message
	 */
	elRTE.prototype.debug = function(m) {
		this.options.debug && this.log(m)
	}

	elRTE.prototype.i18n = function(m) {
		return m;
	}

	elRTE.prototype.show = function() {
		
	}
	
	elRTE.prototype.hide = function() {
		
	}


	/**
	 * Open document (convert node into editor document)
	 *
	 * @todo  blur for current opened document
	 * @param  DOMElement  node to convert into editor document
	 * @return Number      document index
	 */
	elRTE.prototype.open = function(n) {
		var self = this;
		
		function docId() {
			return self.id+'-document-'+(self.documents.length+1);
		}
		
		function docName(n) {
			return n && n.nodeName ? $(n).attr('name')||docId() : docId(); 
		}
		
		function docTitle(n) {
			var t;
			return n && n.nodeName && (t = $(n).attr('title')) ? t : 'Document-'+(self.documents.length+1);
		}
		
		/* add new document */
		if (n && n.nodeName) {
			this.documents.push({
				id     : docId(),
				title  : docTitle(n),
				editor : $('<iframe frameborder="0" />'),
				source : n.nodeName == 'TEXTAREA' ? $(n) : $('<textarea name="'+docName(n)+'" />').val(this.filter($(n).html(), 'html'))
			});
			d = this.documents[this.documents.length-1];
			/* render document */
			this.view.add(d);
			
			d.window   = d.editor[0].contentWindow;
			d.document = d.editor[0].contentWindow.document;

			/* create body in iframe */
			html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
			$.each(self.options.cssfiles, function() {
				html += '<link rel="stylesheet" type="text/css" href="'+this+'" />';
			});
			d.document.open();
			d.document.write(this.options.doctype+html+'</head><body></body></html>');
			d.document.close();
			
			/* make iframe editable */
			if ($.browser.msie) {
				d.document.body.contentEditable = true;
			} else {
				try { d.document.designMode = "on"; } 
				catch(e) { }
			}
			
			/* set this document as active */
			this.active = this.documents.length-1;

			/* set document content from textarea */
			$(d.document.body).html(d.source.val());
			

			$(d.document)
				.bind('mouseup', function(e) {
					setTimeout( function() { self.trigger('update') }, 5);
				})
				.bind('keydown', function(e) {
					if ((e.keyCode == 65 && e.metaKey||e.ctrlKey) /* ctrl+A meta+A */
					||  (e.keyCode == 69 && e.ctrlKey)            /* ctrl+E */
					||  (e.keyCode >= 35 && e.keyCode<=40         /* arrows */
					||   e.keyCode == 13)                        /* enter*/
					) {
						setTimeout( function() { self.trigger('update') }, 5);
					}
				});
				
			if ($.browser.webkit) {
				$(d.document).bind('keydown', function(e) {

					if (e.keyCode == 13) {
						var n = self.selection.getNode();
						if (n.nodeName == 'BODY' 
						|| self.dom.parent(n, /^DIV$/, null, true) 
						|| (self.dom.parent(n, /^P$/, null, true) && e.shiftKey)) {
							e.preventDefault();
							self.selection.select( self.selection.insertNode(this.createElement('br')) ).collapse(false);
							
						}
					}
				})
			}
			
			this.trigger('open');

			return this.active;
		}
		
	}

	/**
	 * Close document by index
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.close = function(i) {
		if (this.documents[i]) {
			this.view.remove(this.documents[i].id);
			var tmp = [];
			while (this.documents.length >= i) {
				tmp.push(this.documents.pop())
			}
			this.documents.pop();
			while (tmp.length) {
				this.documents.push(tmp.pop());
			}
		}
	}

	/**
	 * Open document tab
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.focus = function(i) {
		var self = this;
		
		function focus(i) {
			if (self.documents[i].editor.is(':visible')) {
				/* set focus to editor */
				self.documents[i].editor.focus();
				self.documents[i].window.focus();
				
			} else {
				/* set focus to textarea */
				self.documents[i].source[0].focus();
			}
		}
		/* if active document changed */
		if (this.documents[i] && this.active != i) {
			/* blur active document */
			this.trigger('blur');
			/* change active document */
			this.active = i;
			/* show active document */
			this.view.focus(this.documents[i].id);
			focus(i);
			
			this.trigger('focus').trigger('update');
		} else {
			focus(this.active)
		}

	}

	/**
	 * Switch between editor and source in active document
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.toggle = function(n) {
		var d = this.documents[this.active];
		
		this.view.toggle();

		if (d.editor.is(':visible')) {
			$(d.document.body).html(this.filter(d.source.val(), 'dom'));
			this.wysiwyg = true;
		} else {
			d.source[0].value = this.filter($(d.document.body).html(), 'html');
			this.wysiwyg = false;
		}
		this.focus();
		this.trigger('toggle');
	}

	/**
	 * Find document by id and return document index
	 *
	 * @param  String  document id
	 * @return Number  document index
	 */
	elRTE.prototype.documentById = function(id) {
		
		for (var i=0; i < this.documents.length; i++) {
			if (this.documents[i].id == id) {
				return i;
			}
		};
	}

	/**
	 * return true if wswing editor is visible
	 *
	 * @return Boolean
	 */
	elRTE.prototype.editorMode = function() {
		return this.documents[this.active].editor.is(':visible');
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
	 * Bind callback to event
	 * If event is "open", "focus", "blur" or "save" - bind to elrte events,
	 * otherwise bind to all documents bodies event
	 *
	 * @param String    event name
	 * @param Function  callback
	 */
	elRTE.prototype.bind = function(e, c) {
		e = e.split(',');
		for (var i=0; i < e.length; i++) {
			e[i] = $.trim(e[i]);
			if (this.listeners[e[i]]) {
				this.listeners[e[i]].push(c);
			} else {
				$.each(this.documents, function() {
					$(this.document).bind(e[i], c);
				})
			}
		};
		
		
		return this;
	} 

	/**
	 * Notify all fired event listeners
	 *
	 * @param String event name
	 */
	elRTE.prototype.trigger = function(e) {
		if (this.listeners[e]) {
			var event = {
				name   : e,
				target : this.documents[this.active]
			}

			for (var i=0; i < this.listeners[e].length; i++) {
				this.listeners[e][i](event);
			};
			this.debug('trigger: '+e+' '+this.active);
		}
		return this;
	}
	
	elRTE.prototype.filter = function(d, t) {
		var i;
		d = $.trim(d);
		for (i=0; i< this.rules.html.length; i++) {
			d = this.rules.html[i](d);
		}
		d = $('<div/>').html(d);
		for (i=0; i< this.rules.dom.length; i++) {
			d = this.rules.dom[i](d);
		}
		d = $(d).html();
		
		if (t == 'dom') {
			
		} else {
			d = this.rules.tagsLower(d)
		}

		return d;
	}
	
	elRTE.prototype.rules = {
		
		dom : [
			function(n) {
				// window.console.log('dom rule')
				return n
			}
		],
		
		html : [
			function(html) {
				// window.console.log('html rule')
				return html
			}
		],
		
		tagsLower : function(html) {

			html = html.replace(/\<([a-z1-6]+)([^\>]*)\>/ig, function(s, tag, arg) { 
				arg = arg.replace(/([a-z\-]+)\:/ig, function(s, a) { return a.toLowerCase()+':' });
				arg = arg.replace(/([a-z\-]+)="/ig, function(s, a) { return a.toLowerCase()+'="' });
				return '<'+tag.toLowerCase()+arg+'>';
			});
			return html.replace(/\<\/([a-z1-6]+)\>/ig, function(s, tag) { return '</'+tag.toLowerCase()+'>';});
		}
		
	}
	
	/**
	 * elRTE plugins
	 *
	 */
	elRTE.prototype.plugins = {}
	
	/**
	 * elRTE commands
	 *
	 */
	elRTE.prototype.commands = {}

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