/**
 * jQuery plugin - default elRTE button
 * Create button, bind to command "change" event
 *
 * @param  elRTE.command  
 */
$.fn.elrtebutton = function(cmd) {
	
	return this.each(function() {
		var self  = this,
			// base button class
			c  = elRTE.BUTTON_CLASS,
			// active button class
			ac = elRTE.CSS_CLASS_ACTIVE,
			// disabled button class
			dc = elRTE.CSS_CLASS_DISABLED,
			// hover button class
			hc = elRTE.CSS_CLASS_HOVER,
			$this = $(this).addClass('elrte-ib ui-state-default ui-corner-all '+c+' '+c+'-'+cmd.name)
				.append('<div class="'+c+'-inner" title="'+cmd.title+'"/>')
				.mousedown(function(e) {
					e.preventDefault();
					// cmd.rte.log('here')
					self.click();
				});

		// command to which this button binded
		this.cmd = cmd;
		// cmd.rte.log(self)
		/**
		 * Button mousedown event handler
		 * @return void
		 **/
		this.click = function() {
			cmd.rte.log(self.state)
			cmd.exec();
		}
		
		// bind to command update event
		this.cmd.change(function() {
			switch ((self.cmd.state)) {
				case elRTE.CMD_STATE_DISABLED : $this.removeClass(ac).addClass(dc); break;
				case elRTE.CMD_STATE_ENABLED  : $this.removeClass(ac+' '+dc);       break;
				case elRTE.CMD_STATE_ACTIVE   : $this.removeClass(dc).addClass(ac); 
			}
		});
		
	});
	
}


