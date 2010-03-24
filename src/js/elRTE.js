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
		
		var self = this;
		window.console.time('load')
		this.version   = '1.0 RC4 dev';
		this.build     = '20100204';
		this.target    = t;
		/* editor config */
		this.options   = $.extend(true, {}, this.options, o);
		/* editor DOM element id. Used as base part for inner elements ids */
		this.id        = 'elrte-'+($(t).attr('id')||$(t).attr('name')||Math.random().toString().substr(2));
		this.load      = false;    
		/* opened documents */
		this.documents = [];
		/* active(visible) document index */
		this.active    = null;
		/* is editor in wysiwyg mode */
		this.wysiwyg   = true;
		/* events listeners */
		this.listeners = {
			/* called after elRTE init and load all documents */
			'load'    : [],
			/* called after new document added to editor */
			'open'    : [], 
			/* called after document set editable in wysiwyg mode */
			'focus'   : [], 
			/* called after document set editable in source mode */
			'source'  : [],
			/* called after some changes was made in document */
			'change'  : [],
			/* called after document set invisible */
			'blur'    : [],
			/* called before close document */
			'close'   : [],
			/* called before send form */
			'save'    : [],
			'disable' : [],
			/* called on click on editor document */
			'click'   : [],
			/* called on keydown on editor document */
			'keydown' : [],
			/* called on keyup on editor document */
			'keyup'   : []
			};
		/* editor view */
		this.view      = new this.view(this);
		/* DOM manipulation */
		this.dom       = new this.dom(this);
		/* selection and text text range */
		this.selection = $.browser.msie ? new this.msSelection(this) : new this.selection(this);

		this.filter = new this.filter(this)

		if (!this.options.toolbars[this.options.toolbar]) {
			this.options.toolbar = 'default';
		}
		
		/* load plugins and commands */
		var plugins = [], 
			commands = [],
		 	p = self.options.toolbars[self.options.toolbar], 
			i, j, pn, clist;
		
		for (i=0; i < p.length; i++) {
			clist = this.options.panels[p[i]];
			if (clist && clist.length) {
				pn = this.view.createPanel(p[i]);
				for (j=0; j < clist.length; j++) {
					if (typeof(this.commands[clist[j]]) == 'function') {
						commands.push(new this.commands[clist[j]](this));
						pn.append(commands[commands.length-1].button||'');
					}
				};
				this.view.addPanel(pn);
			}
		};
		this.commands = commands;
		
		for (i=0; i < this.options.plugins.length; i++) {
			if ( (p = this.plugins[this.options.plugins[i]]) ) {
				plugins.push(new p(this));
			}
		};
		this.plugins = plugins;
		
		/* load documents */
		this.options.documents.unshift(t);
		$.each(this.options.documents, function() { self.open(this); });
		
		/* focus required or first document */
		this.focus(this.options.active);
		this.load = true;
		this.trigger('load').trigger('focus');
		delete this.listeners.load;
		// this.log(this.listeners)
		window.console.timeEnd('load')

		// this.filter.toSource('')
	}

	/**
	 * Find document by id and return one
	 *
	 * @param  String  document id
	 * @return Object  document 
	 */
	elRTE.prototype.document = function(id) {
		var l = this.documents.length;
		while (l--) {
			if (this.documents[l].id == id) {
				return this.documents[l];
			}
		}
	}

	/**
	 * Open document (convert node into editor document)
	 *
	 * @todo  blur for current opened document
	 * @param  DOMElement  node to convert into editor document
	 * @return Number      document index
	 */
	elRTE.prototype.open = function(n) {
		var self = this, d, 
			id = this.id+'-document-'+(this.documents.length+1);
		
		if (n && n.nodeType == 1) {
			
			this.documents.push({
				id     : id,
				title  : $(n).attr('title')||'Document-'+(self.documents.length+1),
				editor : $('<iframe frameborder="0" />'),
				source : n.nodeName == 'TEXTAREA' ? $(n) : $('<textarea name="'+($(n).attr('name')||id)+'" />').val($(n).html())
			});
			
			d = this.documents[this.documents.length-1];
			
			/* render document */
			this.view.add(d);
			
			d.window   = d.editor[0].contentWindow;
			d.document = d.editor[0].contentWindow.document;

			/* create body in iframe */
			html = this.options.doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
			$.each(self.options.cssfiles, function() {
				html += '<link rel="stylesheet" type="text/css" href="'+this+'"/>';
			});
			d.document.open();
			d.document.write(this.options.doctype+html+'</head><body> </body></html>');
			d.document.close();
			
			/* set document content from textarea */
			$(d.document.body).html(this.filter.fromSource(d.source.val()));
			
			/* make iframe editable */
			if ($.browser.msie) {
				d.document.body.contentEditable = true;
			} else {
				try { d.document.designMode = "on"; } 
				catch(e) { }
			}

			/* bind events */
			$(d.document)
				.bind('mouseup', function(e) {
					setTimeout( function() { self.trigger('change') }, 2);
				})
				.bind('keydown', function(e) {
					if ((e.keyCode == 65 && e.metaKey||e.ctrlKey) /* ctrl+A meta+A */
					||  (e.keyCode == 69 && e.ctrlKey)            /* ctrl+E */
					||  (e.keyCode >= 35 && e.keyCode<=40         /* arrows */
					||   e.keyCode == 13)                         /* enter*/
					) {
						setTimeout( function() { self.trigger('change') }, 2);
					}
				})
				.bind('click keydown keyup', function(e) {
					self.trigger(e)
				});
				

			
			/* set this document as active */
			this.trigger('open').focus(id);

			return this.active;
		}
		
	}
	

	/**
	 * Open document or/and give focus to it
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.focus = function(id) {
		var d, t, docs = this.documents;

		if (docs.length) {
			d = (typeof(id) == 'number' ? docs[id] : this.document(id))||this.active||docs[0];

			if (this.active != d) {
				if (this.active) {
					this.active.source.is(':visible') && this.toggle();
					this.trigger('blur');
				}
				this.active = d;
				this.view.focus(d.id);
				t = true;
			}
			d.editor.is(':visible') ? d.window.focus() : d.source[0].focus();
			t && this.trigger('focus');
		}
		return this
	}

	/**
	 * Switch between editor and source in active document
	 *
	 * @todo for firefox set curret to start of texarea
	 *
	 */
	elRTE.prototype.toggle = function() {
		if (this.active && this.options.allowSource) {
			var d = this.active;
			this.view.toggle();
			
			if (d.editor.is(':visible')) {
				$(d.document.body).html(this.filter.fromSource(d.source.val()));
				this.wysiwyg = true;
				this.focus().trigger('focus');
			} else {
				d.source[0].value = this.filter.toSource($(d.document.body).html());
				this.wysiwyg = false;
				this.focus().trigger('source');
			}
		}
		return this;
	}

	
	/**
	 * Close document by index
	 *
	 * @param Number  document index
	 */
	elRTE.prototype.close = function(id) {
		var d, tmp = [], l = this.documents.length, n, e;
		
		if (l) {
			var d = (typeof(id) == 'number' ? this.documents[id] : this.document(id))||this.active;

			/* before close active doc, move focus to nex/prev doc */
			if (this.active == d && this.documents.length>1) {
				n = $.inArray(this.active, this.documents);
				this.focus(this.documents[n<l-1 ? n+1 : n-1].id);
			}
			/* call trigger and remove doc from DOM */
			e = $.Event('close');
			e.target = d;
			this.trigger(e);
			this.view.remove(d.id);
			/* update docs list */
			while (l--) {
				this.documents[l] != d && tmp.push(this.documents[l]);
			}
			this.documents = tmp;
			/* If no docs - call trigger */
			if (!this.documents.length) {
				this.active = null;
				this.trigger('disable');
			}
		}
		return this;
	}
	
	/**
	 * Bind callback to event
	 *
	 * @param String    event name
	 * @param Function  callback
	 */
	elRTE.prototype.bind = function(e, c) {
		if (typeof(c) == 'function') {
			e = e.split(' ');
			for (var i=0; i < e.length; i++) {
				e[i] = $.trim(e[i]);
				if (this.listeners[e[i]]) {
					this.listeners[e[i]].push(c);
				} 
			};
		}
		return this;
	}
	
	/**
	 * Send notification to all event subscribers
	 *
	 * @param String event name
	 */
	elRTE.prototype.trigger = function(e) {
		
		if (this.load) {
			
			if (typeof(e) == 'string') {
				e = $.Event(e);
				e.target = this.active;
			}
			
			this.debug(e);
			if (this.listeners[e.type] && this.listeners[e.type].length) {
				
				for (var i=0; i < this.listeners[e.type].length; i++) {
					if (e.isPropagationStopped()) {
						this.log(e.type+' stopped')
						break;
					}
					this.listeners[e.type][i](e);
				};
			}
		}
		
		return this;
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
	elRTE.prototype.plugins = {};
	
	/**
	 * elRTE commands
	 *
	 */
	elRTE.prototype.commands = {};

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