(function($) {
	/**
	 * Class. elRTE renderer
	 * 
	 */
	
	elRTE.prototype.view = function(rte) {
		var self       = this;
		this.rte       = rte;
		this.toolbar   = $('<div class="elrte-toolbar" />');
		this.tabsbar   = $('<ul class="elrte-tabsbar" />');
		this.workzone  = $('<div class="elrte-workzone" />');
		this.statusbar = $('<div class="elrte-statusbar" />');
		this.editor    = $('<div class="elrte '+(this.rte.options.cssClass||'')+'" id="'+this.rte.id+'" />')
			.append(this.toolbar)
			.append(this.tabsbar)
			.append(this.workzone)
			.append(this.statusbar.hide())
			.insertBefore(rte.target);
		

			
		if (this.rte.options.height>0) {
			this.workzone.height(this.rte.options.height);
		}

	}
	
	
	/**
	 * Render new document
	 *
	 * @param Object  elRTE document
	 */
	elRTE.prototype.view.prototype.add = function(d) {
		var self = this, 
			t = $('<li class="elrte-tab inline-block active" rel="#'+d.id+'">'+d.title+(this.rte.options.allowCloseDocs ? '<span class="elrte-tab-close" title="Close"/>' : '')+'</li>').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if ($(e.target).hasClass('elrte-tab-close')) {
					if (confirm('Do you want to close "'+$(this).parent().text()+'"?')) {
						self.rte.close($(this).attr('rel').substr(1));
					}
				} else {
					self.rte.focus($(this).attr('rel').substr(1));
				}
			});

		
		if (this.rte.options.height>0) {
			$(d.editor).height(this.rte.options.height);
		}

		this.workzone.append(
			$('<div id="'+d.id+'" class="elrte-document"/>')
				.hide()
				.append($(d.editor).addClass('elrte-editor'))
				.append(d.source.height(this.workzone.height()).addClass('elrte-source').hide())
			);
		this.tabsbar.children('.active')
			.removeClass('active')
			.end()
			.append(t)
			.toggle(this.rte.options.allowCloseDocs||this.tabsbar.children().length>1);
	}
	
	/**
	 * Remove document by id
	 *
	 * @param String  document id
	 */
	elRTE.prototype.view.prototype.remove = function(id) {
		this.tabsbar.find('[rel="#'+id+'"]').remove();
		this.workzone.find('#'+id).remove();
	}
	
	/**
	 * Set document with selected id visible
	 *
	 * @param String  document id
	 */
	elRTE.prototype.view.prototype.focus = function(id) {
		this.tabsbar.children().removeClass('active').filter('[rel="#'+id+'"]').addClass('active');
		this.workzone.children('.elrte-document').hide().filter('#'+id).show();
	}
	
	/**
	 * Switch between editor and source view in active document
	 *
	 */
	elRTE.prototype.view.prototype.toggle = function() {
		var d = this.workzone.children(':visible');
		d.children('iframe').add(d.children('textarea')).toggle();
	}
	
	elRTE.prototype.view.prototype.createPanel = function(n) {
		var p = $('<ul class="elrte-toolbar-panel inline-block" id="'+this.rte.id+'-pahel-'+n+'"><li class="elrte-toolbar-sep inline-block"></li></ul>');
		
		return p
	}
	
	elRTE.prototype.view.prototype.addPanel = function(p) {
		if (p.children('.elrte-button').length) {
			this.toolbar.append(p);
			this.toolbar.children().length == 1 && p.children().eq(0).remove();
		}
	}

})(jQuery);
