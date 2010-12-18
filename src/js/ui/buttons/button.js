/**
 * jQuery plugin - default elRTE button
 * Create button, subscribe to command update event, add click event handler
 *
 * @param  elRTE.command  
 */
$.fn.elrtebutton = function(cmd) {
	
	return this.each(function() {
		var self  = this,
			$this = $(this),
			// base button class
			c  = 'elrte-btn',
			// active button class
			ac = elRTE.CSS_CLASS_ACTIVE,
			// disabled button class
			dc = elRTE.CSS_CLASS_DISABLED,
			// hover button class
			hc = elRTE.CSS_CLASS_HOVER;

		// cached command state
		this.state = 0;
		// command to which this button binded
		this.cmd = cmd;

		/**
		 * Button mousedown event handler
		 * @return void
		 **/
		this.click = function() {
			cmd.exec();
		}
		
		// bind to command update event
		this.cmd.change(function() {
			switch ((self.state = self.cmd.state)) {
				case elRTE.CMD_STATE_DISABLED : $this.removeClass(ac).addClass(dc); break;
				case elRTE.CMD_STATE_ENABLED : $this.removeClass(ac+' '+dc);       break;
				case elRTE.CMD_STATE_ACTIVE  : $this.removeClass(dc).addClass(ac); 
			}
			// cmd.rte.log($this.attr('class'))
		});
		
		$this.addClass('elrte-ib ui-state-default ui-corner-all '+c+' '+c+'-'+cmd.name)
			.mousedown(function(e) {
				e.preventDefault();
				self.click();
			})
			.hover(function() {
				self.state && $this.toggleClass(hc);
			})
			.append('<div class="'+c+'-inner" title="'+cmd.title+'"/>');
	});
	
}


