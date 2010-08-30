(function($) {
	
	/**
	 * @class elRTE command stopfloat
	 * Insert br tag with style="clear:both"
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 *
	 **/
	elRTE.prototype.commands.stopfloat = function(n) {
		var self   = this;
		this.name  = n;
		this.title = 'Stop element floating';
		
		// this.init(rte);
		
		this.exec = function() {
			this.sel.insertNode(this.dom.create({name : 'br', css : { clear : 'both' }}));
			return true;
		}
		
		this.state = function() {
			return this._enabled;
		}
	}
	
	elRTE.prototype.commands.stopfloat.prototype = elRTE.prototype.command;
	
})(jQuery);