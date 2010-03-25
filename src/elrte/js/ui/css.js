(function($) {
	
	elRTE.prototype.ui.prototype.buttons.css = function(rte, name) {
		var self = this;
		this.constructor.prototype.constructor.call(this, rte, name);
		this.cssStyle = $('<input type="text" />').attr('name', 'style').css('width', '100%');
		this.cssClass = $('<input type="text" />').attr('name', 'class').css('width', '100%');
		
		
		this.command = function() {
			var n = this.node(), opts;
			if (n) {
				var opts = {
					
					submit : function(e, d) { e.stopPropagation(); e.preventDefault(); d.close(); self.set();  },
					dialog : {
						title : this.rte.i18n('Style'),
						width : 450,
						resizable : true,
						modal : true
					}
				}
				this.cssStyle.val($(n).attr('style'));
				this.cssClass.val($(n).attr('class'));
				var d = new elDialogForm(opts);
				d.append([this.rte.i18n('Css style'), this.cssStyle], null, true).open();
				d.append([this.rte.i18n('Css class'), this.cssClass], null, true).open();
			}
		}
		
		this.set = function() {
			var n = this.node();
			if (n) {
				$(n).attr('style', this.cssStyle.val());
				$(n).attr('class', this.cssClass.val());
				this.rte.ui.update();
			}
		}
		
		this.node = function() {
			var n = this.rte.selection.getNode();
			if (n.nodeType != 1) {
				n = n.parentNode;
			}
			return n.nodeType == 1 && n.nodeName != 'BODY' ? n : null;
		}
		
		this.update = function() {
			this.domElem.toggleClass('disabled', this.node()?false:true);
		}
		
	}
	
})(jQuery);