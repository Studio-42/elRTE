(function($) {
	
	elRTE.prototype.utils = {
	
		kbd : {
			isArrow : function(c) { return c>=37 && c<=40; },
			isChar  : function(c) { return $.inArray(c,  [109, 188, 190, 191, 192, 219, 220, 221, 222, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]) != -1; },
			isDel   : function(c) { return c == 8; }
		},
	
		isArrowKey : function(c) { return c>=37 && c<=40; },
		
		isDelKey   : function(c) { return false; },
		
		isSymbolKey : function(c) { return false; }
		
	}
	
})(jQuery);