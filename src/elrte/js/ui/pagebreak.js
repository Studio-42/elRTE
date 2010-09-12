(function($) {
	elRTE.prototype.ui.prototype.buttons.pagebreak = function(rte, name) {
		this.constructor.prototype.constructor.call(this, rte, name);
		
		this.command = function() {
			
			var img = '<img id="_tmp_img" src="'+this.rte.filter.url+'pixel.gif" style="height:15px;width:100%;border:1px solid #111" />'
			var self = this;
			this.rte.selection.insertHtml(img, true);
			
			var img = $(this.rte.doc.body).find('img#_tmp_img').attr('contentEditable', 'false')
				
			
			$(this.rte.doc.body).bind('mousedown', function(e) {
				// self.log(e)
				e.preventDefault()
			})
			
			this.rte.log(img.removeAttr('_moz_resizing'))
		}
		
		this.update = function() {
			this.domElem.removeClass('disabled');
		}
	}
	
})(jQuery);