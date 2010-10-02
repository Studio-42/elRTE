/**
 * @class Button with menu
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.colorButton = function(cmd) {
	var self = this,
		rte = cmd.rte;
	
	
	this.auto = '';
	this.val = '';
	
	this.init(cmd);
	
	this.menu = $('<div/>').elrteWdgColor({
		label : cmd.title,
		callback : function(v) { self.color = v; cmd._val = v; self.ind.css('background-color', v); }
	}, rte);
	

	this.ind = $('<div class="elrte-color-indicator"/>');
	
	this.$.addClass('elrte-btn-menu')
		.html('<div class="elrte-btn-menu-inner"><div class="elrte-btn-menu-control"/></div>')
		.append(this.ind)
		.append(this.menu.hide())
		.mousedown(function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (self.state) {
				if (self.menu.is(':hidden')) {
					rte.trigger('hideUI');
				}
				self.menu.toggle(128);
			}
			
		});
	
	rte.bind('hideUI', function() {
		self.menu.hide();
	});
	
	this.update = function() {
		elRTE.prototype.ui._button.update.call(this);
		// rte.log('update')
		// this.color = cmd.value();
		// this.ind.css('background-color', cmd.value());
		this.menu.val(cmd.value())
	}
	
	return;

}

elRTE.prototype.ui.colorButton.prototype = elRTE.prototype.ui._button;