/**
 * @class elRTE command.
 * Unwrap inline tags and remove class/style attributes from block tags
 * @TODO ignore protected tags
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.commands.removeformat = function() {
	this.title  = 'Clean format';
	this.regexp = /^(A|BR|EMBED|IMG|PARAM)$/;
	
	this._exec = function() {
		var d = this.dom,
			s = this.sel,
			r = this.regexp,
			t = function(n) { return d.is(n, 'block') || d.is(n, r) || $(n).hasClass('elrtebm'); }
			n = s.collapsed() ? this.rte.active.document.body.childNodes : s.get(),
			b = s.bookmark();
		
		function clean(n) {
			t(n) ? $(n).removeAttr('class').removeAttr('style') : d.unwrap(n);
		}
		
		$.each(d.filter(n, 'element'), function(i, n) {
			$(n).find('*').each(function() {
				clean(this);
			});
			clean(n);
		});
		s.toBookmark(b);
		return true;
	}
	
	this._state = function() {
		return elRTE.CMD_STATE_ENABLED;
	}
}
