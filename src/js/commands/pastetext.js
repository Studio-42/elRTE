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
				txt  = $('<textarea cols="60" rows="14" class="elrte-pastetext" />'),
				opts = { title : rte.i18n(this.title), width : 520, buttons : {} };

			opts.buttons[rte.i18n('Paste')]  = function() { self._exec(txt.val()); $(this).dialog('close'); };
			opts.buttons[rte.i18n('Cancel')] = function() { $(this).dialog('close'); };
			new rte.ui.dialog(opts).append(txt).open();
		}
		
		this._exec = function(txt) {
			this.rte.focus();
			this.sel.deleteContents().insertHtml($.trim(txt).replace(/\r?\n/g, "\n<br>"));
			return true;
		}

	}
	
})(jQuery);