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
			ac = 'elrte-active',
			// disabled button class
			dc = 'elrte-disable',
			// hover button class
			hc = 'elrte-hover';

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
		this.cmd.bind(function() {
			switch ((self.state = self.cmd.state())) {
				case cmd.STATE_DISABLE : $this.removeClass(ac).addClass(dc); break;
				case cmd.STATE_ENABLE  : $this.removeClass(ac+' '+dc);       break;
				case cmd.STATE_ACTIVE  : $this.removeClass(dc).addClass(ac); 
			}
		});
		
		$this.addClass('elrte-ib elrte-rnd '+c+' '+c+'-'+cmd.name)
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


