/**
 * jQuery plugin - default elRTE button
 * Create button, bind to command "change" event
 *
 * @param  elRTE.command  
 */
$.fn.elrtebutton = function(cmd) {
	
	return this.each(function() {
		var self  = this,
			$this = $(this).addClass('ui-widget ui-state-default ui-state-disabled ui-corner-all elrte-button elrte-button-'+cmd.name)
				.append('<span class="elrte-icon elrte-icon-'+cmd.name+'" title="'+cmd.title+'"/>')
				.mousedown(function(e) {
					!$this.hasClass('ui-state-disabled') && self.click(e);
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


