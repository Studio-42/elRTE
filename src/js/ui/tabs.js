(function($) {

	/**
	 * @class jQuery UI tabs wrapper
	 * 
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.tabs = function() {
		this.nav = $('<ul/>');
		this.tabs = $('<div class="elrte-tabs"/>').append(this.nav);
		this.cnt = 1;
		
		this.append = function(title, cont) {
			this.nav.append($('<li><a href="#elrte-tab-'+this.cnt+'">'+title+'</a></li>'));
			this.tabs.append($('<div id="elrte-tab-'+this.cnt+'""/>').append(cont));
			this.cnt++;
			return this;
		}

		this.get = function() {
			return this.tabs;
		}

	}

})(jQuery);