(function($) {
	/**
	 * Class. elRTE renderer
	 * 
	 */
	
	elRTE.prototype.view = function(rte, t) {
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
			.append(this.statusbar)
			.insertBefore(t);
			
		if (t.nodeName != 'TEXTAREA') {
			$(t).hide()
		}
			
		if (this.rte.options.height>0) {
			this.workzone.height(this.rte.options.height)
		}
			
			
		$('#'+this.rte.id+' .elrte-tabsbar li').live('click', function(e) {
			var t = $(this);
			if (!t.hasClass('active')) {
				self.rte.focus(self.rte.documentById(t.attr('rel').substr(1)));
			}
		});

			
	}
	
	
	/**
	 * Render new document
	 *
	 * @param Object  elRTE document
	 */
	elRTE.prototype.view.prototype.addDocument = function(d) {
		var doc = $('<div id="'+d.id+'" class="elrte-document" unselectable="on" />')
			.append($(d.editor).addClass('elrte-editor')).append(d.source.addClass('elrte-source').hide()); 
		
		this.rte.options.height>0 && $(d.editor).height(this.rte.options.height);
		d.source.height(this.workzone.height());
		this.tabsbar.append('<li class="elrte-tabsbar-tab inline-block active" rel="#'+d.id+'">'+d.title+'</li>').toggle(this.tabsbar.children().length>1);
		this.workzone.append(doc.hide());
	}
	
	/**
	 * Remove document by id
	 *
	 * @param String  document id
	 */
	elRTE.prototype.view.prototype.removeDocument = function(id) {
		this.tabsbar.find('[rel="#'+id+'"]').remove();
		this.workzone.find('#'+id).remove();
	}
	
	/**
	 * Set document with selected id visible
	 *
	 * @param String  document id
	 */
	elRTE.prototype.view.prototype.focusDocument = function(id) {
		this.tabsbar.children().removeClass('active').filter('[rel="#'+id+'"]').addClass('active');
		this.workzone.children('.elrte-document').hide().filter('#'+id).show();
	}
	
	/**
	 * Switch between editor and source view in active document
	 *
	 */
	elRTE.prototype.view.prototype.toggle = function() {
		var d = this.workzone.children('#'+this.rte.documents[this.rte.active].id);
		d.children('iframe').add(d.children('textarea')).toggle();
	}
	
})(jQuery);
