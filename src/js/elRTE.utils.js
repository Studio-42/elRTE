(function($) {
	/**
	 * @class Various utilits, required by elRTE
	 * @param elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 */
	elRTE.prototype.utils = function(rte) {
		/**
		 * editor instance
		 **/
		this.rte         = rte;
		/**
		 * keabord chars codes
		 **/
		this._charsKeys  = [109, 188, 190, 191, 192, 219, 220, 221, 222, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]; 
		
		/**
		 * Return true if code is char code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyChar = function(c) { return $.inArray(c, this._charsKeys) != -1; }
		
		/**
		 * Return true if code is delete/backspace code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyDel = function(c) { return c == 8 || c == 46; }
		
		/**
		 * Return true if code is arrows/home/end etc. code
		 *
		 * @param   Number  key code
		 * @return  Boolean
		 **/
		this.isKeyArrow = function(c) { return c >= 33 && c <= 40; }
	
	}
	
	

	
})(jQuery);