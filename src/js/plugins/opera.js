/**
 * @class elRTE plugin
 * Fired cut/paste events on ctrl+x/v in opera, but not on mac :(
 * on mac opera think meta is a ctrl key
 * i hope only a few nerds use opera on mac :)
 * @TODO test on linux/win
 *
 **/
elRTE.prototype.plugins.mozilla = function(rte) {
	this.name        = 'opera';
	this.description = 'Fired cut/paste events on ctrl+x/v in opera';
	this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
	
	
	if ($.browser.opera && !rte.macos) {
		rte.bind('keydown', function(e) {
			var type = '';
			
			if (e.ctrlKey) {
				if (e.keyCode == 88) {
					type = 'cut'; 
				} else if (e.keyCode == 86) {
					type = 'paste';
				}
			}
			
			if (type) {
				e.stopPropagation();
				e.preventDefault();
				
				if (type == 'paste' && !rte.options.allowPaste) {
					return;
				}
				rte.trigger(type);
			}
		}, true);
	}
}
