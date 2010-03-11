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
			
		
		this.version   = '1.0 RC2 dev';
		this.build     = '20100204';
		/* editor config */
		this.options   = $.extend(true, {}, this.options, o);
		/* editor DOM element id. Used as base part for inner elemnets ids */
		this.id        = 'elrte-'+_id(t);
		/* opened documents */
		this.documents = [];
		/* active(visible) document index */
		this.active    = 0;
		/* events listeners */
		this.listeners    = {
			/* called when new document added to editor */
			'open'   : [], 
			/* called when document set visible */
			'focus'  : [], 
			/* called when document set invisible */
			'blur'   : [],
			/* called when switch fron editor to source or back in active document */
			'toggle' : [], 
			/* called before send form */
			'save'   : []};
		/* editor view */
		this.view      = new this.view(this, t);
		/* DOM manipulation */
		this.dom       = new this.dom(this);
		/* selection and text text range */
		this.selection = null;
		this.filter    = null;
		/* pligins loaded in this instance */
		this.loadedPlugins = []
		
		/* on document blur hide source if visible and update editor */
		this.bind('blur', function(e) {
			if (self.documents[self.active].source.is(':visible')) {
				self.view.toggle();
			}
		});
		
		/* load documents */
		this.options.documents.unshift(t);
		$.each(this.options.documents, function() {
			this.nodeName && self.open(this);
		});
		
		/* focus selected or first document */
		this.focus(this.options.active>=0 && this.documents[this.options.active] ? this.options.active : 0);
		
		/* load plugins */
		$.each(this.plugins, function() {
			var p = new this(self);
			self.loadedPlugins[p.name] = p;
		});
		
		
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
				source : n.nodeName == 'TEXTAREA' ? $(n) : $('<textarea name="'+docName(n)+'" />').val($.trim($(n).html()))
			});
			d = this.documents[this.documents.length-1];
			/* render document */
			this.view.addDocument(d);
			
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
			(function(rte) { 
				var d = rte.documents[rte.active];
				setTimeout(function() {
					$(d.document.body).html(d.source.val())
				}, 10);
			})(this);

			
			this.trigger('open');

			return this.documents.length-1;
		}
		
	}

	/**
	 * Close document by index
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.close = function(i) {
		if (this.documents[i]) {
			this.view.removeDocument(this.documents[i].id);
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
		if (this.documents[i]) {
			/* blur if active document changed */
			if (this.active != i) {
				this.trigger('blur');
				this.active = i;
			}
			this.view.focusDocument(this.documents[i].id);
			this.documents[i].window.focus();
			this.documents[i].editor.focus();
			this.trigger('focus');
		}
	}

	/**
	 * Switch between editor and source in active document
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.toggle = function(n) {
		this.view.toggle();

		if (this.documents[this.active].editor.is(':visible')) {
			$(this.documents[this.active].document.body).html(this.documents[this.active].source.val());
			this.trigger('toggle');
			this.documents[this.active].window.focus();
			this.documents[this.active].editor.focus();
			this.trigger('focus');
		} else {
			var html = $(this.documents[this.active].document.body).html();
			if ($.browser.msie || $.browser.opera) {
				html = html.replace(/\<([a-z1-6]+)([^\>]*)\>/ig, function(s, tag, arg) { 
					arg = arg.replace(/([a-z\-]+)\:/ig, function(s, a) { return a.toLowerCase()+':' });
					return '<'+tag.toLowerCase()+arg+'>';
				});
				html = html.replace(/\<\/([a-z1-6]+)\>/ig, function(s, tag) { return '</'+tag.toLowerCase()+'>';});
			}
			
			this.documents[this.active].source[0].value = html;
			this.trigger('toggle');
			this.documents[this.active].source.focus();
		}
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
		if (this.listeners[e]) {
			this.listeners[e].push(c);
		} else {
			$.each(this.documents, function() {
				$(this.document.body).bind(e, c);
			})
		}
		
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
	}
	
	/**
	 * elRTE plugins
	 *
	 */
	elRTE.prototype.plugins = {}

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