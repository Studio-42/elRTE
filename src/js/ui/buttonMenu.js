/**
 * @class Button with drop-down menu
 * @param  Object
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.buttonMenu = function(cmd) {
	this.c      = 'elrte-btn-menu';
	this.widget = $('<div/>');
	
	/**
	 * Initilize menu and bind events
	 * 
	 * @return void
	 **/
	this.onInit = function() {
		var self = this,
			cmd  = this.cmd,
			o    = {
				'class'  : cmd.conf.uiClass || '',
				label    : cmd.title,
				tpl      : cmd.conf.tpl,
				opts     : cmd.opts,
				callback : function(v) { cmd.exec(v); }
			};
			
		this.control = $('<div class="elrte-btn-menu-control"/>');
		this.label   = this.cmd.conf.label ? $('<span class="elrte-btn-menu-label"/>') : '';
		this.btn.append(this.control).append(this.label);
		
		// Init widget with required jquery plugin
		setTimeout(function() {
			self.ui.append(self.widget.elrteWidgetMenu(o).hide());
		}, 20);
		
		this.rte.bind('hideUI', function() {
			self.widget.hide();
		});
	}
	
	/**
	 * Update label text if label exists.
	 * Update widget active(selected) items
	 *
	 * @return void
	 **/
	this.update = function() {
		var v = this.cmd.value();
		
		if (this.label) {
			this.label.text(this.cmd.opts[v] || this.cmd.title);
		}
		this.widget.val(v);
		this.rte.ui._button.update.call(this);
		
	}
	
	/**
	 * Button mousedown event handler. Toggle widget.
	 * 
	 * @param  Event
	 * @return void
	 **/
	this.click = function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.state) {
			if (this.widget.is(':hidden')) {
				this.cmd.rte.trigger('hideUI');
			}
			this.widget.toggle(128);
		}
	}
	
	this.init(cmd);
	
}

elRTE.prototype.ui.buttonMenu.prototype = elRTE.prototype.ui._button;
