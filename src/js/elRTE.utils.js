(function($) {
	
	elRTE.prototype.utils = function(rte) {
		this.rte = rte;
		
		this.keyIsArrow = function(e) { 
			return (e.keyCode>=34 && e.keyCode<=40) || (e.ctrlKey && e.keyCode == 69) || (this.rte.macos && e.ctrlKey && e.keyCode == 65); 
		}
		
		this.keyIsSelectAll = function(e) { 
			return (this.rte.macos ? e.metaKey : e.ctrlKey) && e.keyCode == 65; 
		}
		
		this.keyIsChar = function(e) {
			return !e.ctrlKey && $.inArray(e.keyCode, [109, 188, 190, 191, 192, 219, 220, 221, 222, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]) != -1; 
		}
		
		this.keyIsDel = function(e) {
			return e.keyCode == 8 || (e.ctrlKey && e.keyCode == 68);
		}
		
		this.keyIsCut = function(e) {
			// this.rte.log(this.rte.macos)
			return (this.rte.macos ? e.metaKey : e.ctrlKey) && e.keyCode == 88;
		}
		
	}
	
	

	
})(jQuery);