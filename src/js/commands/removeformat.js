(function($) {

	/**
	 * @class elRTE command.
	 * Unwrap inline tags and remove class/style attributes from block tags
	 * @TODO ignore protected tags
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.removeformat = function() {
		this.title = 'Clean format';
		this.regExp = /^(A|BR|EMBED|IMG|PARAM)$/;
		
		this._exec = function() {
			var d = this.dom,
				r = this.regExp,
				t = function(n) { return d.is(n, 'block') || d.is(n, r) || $(n).hasClass('elrtebm'); }
				n = this.sel.collapsed() ? this.rte.active.document.body.childNodes : this.sel.get(),
				b = this.sel.bookmark();
			
			function clean(n) {
				t(n) ? $(n).removeAttr('class').removeAttr('style') : d.unwrap(n);
			}
			
			$.each(d.filter(n, 'element'), function(i, n) {
				$(n).find('*').each(function() {
					clean(this);
				});
				clean(n);
			});
			this.sel.toBookmark(b);
			return true;
		}
		
		this._getState = function() {
			return this.STATE_ENABLE;
		}
	}
	
})(jQuery);