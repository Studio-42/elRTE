/**
 * jQuery plugin - default elRTE button
 * Create button, bind to command "change" event
 *
 * @param  elRTE.command  
 */
$.fn.elrtebutton = function(cmd) {
	
	return this.each(function() {
		var self  = this,
			$this = $(this).addClass('ui-state-default ui-corner-all elrte-btn elrte-btn-'+cmd.name)
				.append('<div class="elrte-btn-inner" title="'+cmd.title+'"/>')
				.mousedown(function(e) {
					self.click(e);
				});

		// command to which this button binded
		this.cmd = cmd;

		/**
		 * Button mousedown event handler
		 * Call cmd.exec()
		 *
		 * @return void
		 **/
		this.click = function(e) {
			cmd.exec();
		}

		// bind to command update event
		this.cmd.change(function() {
			switch ((self.cmd.state)) {
				case elRTE.CMD_STATE_DISABLED : $this.removeClass('ui-state-active').addClass('ui-state-disabled'); break;
				case elRTE.CMD_STATE_ENABLED  : $this.removeClass('ui-state-active ui-state-disabled');             break;
				case elRTE.CMD_STATE_ACTIVE   : $this.removeClass('ui-state-disabled').addClass('ui-state-active'); 
			}
		});
		
	});
	
}


