$.fn.elrteInputNumber = function() {
	var keys = [8,46],
	 	input = $('<input type="text" size="5">')
		.keydown(function(e){
			if($.inArray(e.keyCode,keys) == -1) {
				e.stopPropogation();
				e.preventDefault();
			}
			
		})
	
	
	this.append(input);
	
	
	this.val = function(v) {
		return input.val(v === void(0) ? void(0) : parseInt(v) || ""); 
	}
	return this;
}