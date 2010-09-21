(function($) {
	
	/**
	 * @class elRTE command.
	 * Paste formatted text into selection using dialog window
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.pasteformattext = function() {
		this.title = 'Paste formatted text';
		
		this.dialog = function() {
			var self    = this,
				rte     = this.rte,
				charset = rte.options.charset,
				doctype = rte.options.doctype,
				iframe  = $('<iframe frameborder="0" class="elrte-pasteformattext"/>'),
				opts    = { title : this.rte.i18n(this.title), width : 520, buttons : {} },
				win, doc;

			opts.buttons[this.rte.i18n('Paste')]  = function() { self._exec($(doc.body).html()); $(this).dialog('close'); };
			opts.buttons[this.rte.i18n('Cancel')] = function() { $(this).dialog('close'); };
			
			new rte.ui.dialog(opts).append(iframe).open();
			
			win = iframe[0].contentWindow;
			doc = win.document;
			/* create body in iframe */
			doc.open();
			doc.write(doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset='+charset+'" /></head><body> &nbsp; </body></html>');
			doc.close();
			/* make iframe editable */
			if ($.browser.msie) {
				doc.body.contentEditable = true;
			} else {
				try { doc.designMode = "on"; } 
				catch(e) { }
			}
			win.focus();
		}
		
		this._exec = function(html) {
			this.rte.focus();
			this.sel.deleteContents().insertHtml(this.rte.filter.proccess('paste', html));
			return true;
		}

		this.events = {
			'wysiwyg'      : function() { this._setState(this.STATE_ENABLE); },
			'source close' : function(e) { e.data.id == this.rte.active.id && this._setState(this.STATE_DISABLE); }
		}

	}
	
})(jQuery);