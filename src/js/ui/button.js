/**
 * @class Buttons prototype
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui._button = new function() {
	var self = this;
	// additional button class
	this.c   = '';
	// active button class
	this.ac  = 'elrte-active';
	// disabled button class
	this.dc  = 'elrte-disable';
	// hover button class
	this.hc  = 'elrte-hover';
	// cached command state
	this.state = 0;
	// command to which this button binded
	this.cmd;
	
	/**
	 * Initilize new button - create ui, bind events etc.
	 * @param Object  
	 * @return void
	 **/
	this.init = function(cmd) {
		var self = this,
			c = 'elrte-btn';
		
		this.rte = cmd.rte;
			
		this.btn = $('<div class="'+c+' '+c+'-'+cmd.name+' '+this.c+'" title="'+cmd.title+'"/>');
		this.ui = $('<li class="elrte-btn-wrp '+this.dc+'"/>')
			.append(this.btn)
			.hover(function() {
				self.state>0 && $(this).toggleClass(self.hc);
			}).mousedown(function(e) {
				self.click(e);
			});
		
		this.cmd = cmd.bind(function() {
			self.update();
		});
		this.onInit();
	}
	
	/**
	 * Called at the end of init method
	 * @return void
	 **/
	this.onInit = function() { }
	
	/**
	 * Button mousedown event handler
	 * @param  Event
	 * @return void
	 **/
	this.click = function(e) {
		e.preventDefault();
		this.cmd.rte.focus();
		if (this.cmd._state > 0) {
			this.cmd.exec();
		}
	}
	
	/**
	 * Update button state (command change event handler)
	 * @return void
	 **/
	this.update = function() {
		// this.state = this.cmd.state();
		switch ((this.state = this.cmd.state())) {
			case this.cmd.STATE_DISABLE : this.ui.removeClass(this.ac).addClass(this.dc); break;
			case this.cmd.STATE_ENABLE  : this.ui.removeClass(this.ac+' '+this.dc);       break;
			case this.cmd.STATE_ACTIVE  : this.ui.removeClass(this.dc).addClass(this.ac); 
		}
	}

}


/**
 * @class Ordinary button
 * @param  Object
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.button = function(cmd) {
	this.init(cmd);
}

elRTE.prototype.ui.button.prototype = elRTE.prototype.ui._button;

elRTE.prototype.ui._buttonWidget = function() {
	// this.init(cmd);
	
}

elRTE.prototype.ui._buttonWidget.prototype = elRTE.prototype.ui._button;

elRTE.prototype.ui._buttonWidget = new elRTE.prototype.ui._buttonWidget()
