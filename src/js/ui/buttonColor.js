/**
 * @class Button with color selection drop-down menu
 * @param  Object
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.buttonColor = function(cmd) {
	this.c      = 'elrte-btn-menu';
	this.widget = $('<div/>');
	this.color  = '';
	
	/**
	 * Initilize widget and color indicator
	 * @return void
	 **/
	this.onInit = function() {
		var self = this,
			o    = {
				'class'  : '',
				label    : this.cmd.title,
				callback : function(c) { self.setColor(c); }
			}, c;
		
		// control toggle widget while button - exec cmd
		this.control = $('<div class="elrte-btn-menu-control"/>')
			.hover(function() {
				self.state>0 && $(this).toggleClass(self.hc);
			})
			.mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (self.state) {
					self.widget.is(':hidden') && self.cmd.rte.trigger('hideUI');
					self.widget.toggle(128);
				}
			});
		
		this.btn.append(this.control);
		this.ui.append((this.ind = $('<div class="elrte-btn-color-ind"/>')));
		
		// init widget and set automatic color
		setTimeout(function() {
			self.ui.append(self.widget.elrteWidgetColor(o, self.rte).hide());
			self.setColor((c = self.cmd.value()));
			self.widget.val(c);
		}, 10);
		
		this.rte.bind('hideUI', function() {
			self.widget.hide();
		});
	}
	
	/**
	 * Store selected color and update color indicator
	 * @param  String
	 * @return void
	 **/
	this.setColor = function(c) {
		this.ind.css('background', (this.color = c));
	}
	
	/**
	 * Button mousedown event handler
	 * Call cmd.exec()
	 * @param  Event
	 * @return void
	 **/
	this.click = function(e) {
		e.preventDefault();
		if (this.state) {
			this.rte.focus();
			this.cmd.exec(this.color);
		}
	}
	
	/**
	 * Update button state and set automatic color for widget
	 * @return void
	 **/
	this.update = function() {
		this.rte.ui._button.update.call(this);
		this.state && this.widget.val(this.cmd.value());
	}
	
	this.init(cmd);
}

elRTE.prototype.ui.buttonColor.prototype = elRTE.prototype.ui._button;

