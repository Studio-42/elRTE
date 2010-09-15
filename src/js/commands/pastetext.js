(function($) {
	
	/**
	 * @class elRTE command.
	 * Insert text into selection using dialog window
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.pastetext = function() {
		this.title = 'Paste only text';
		
		this.bind = function() {
			var self = this;

			this.rte.bind('wysiwyg', function() {
				self._update(self.STATE_ENABLE);
			}).bind('source close', function(e) {
				e.data.id == self.rte.active.id && self._update(self.STATE_DISABLE);
			});
		}
		
		this.dialog = function() {
			var self = this,
				rte  = this.rte,
				txt  = $('<textarea cols="48" rows="14" style="width:100%" />'),
				tb   = new rte.ui.table().append(txt),
				opts = { title : rte.i18n(this.title), width : 420, buttons : {} };

			opts.buttons[rte.i18n('Apply')]  = function() { self._exec(txt.val()); $(this).dialog('close'); };
			opts.buttons[rte.i18n('Cancel')] = function() { $(this).dialog('close'); };
			new rte.ui.dialog(opts).append(tb.get()).open();
		}
		
		this._exec = function(txt) {
			this.rte.focus();
			this.sel.deleteContents().insertHtml($.trim(txt).replace(/\r?\n/g, "\n<br>"));
			return true;
		}

	}
	
})(jQuery);