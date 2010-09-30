/**
 * @class Button with menu
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.colorButton = function(cmd) {
	var self = this,
		rte = cmd.rte;
	
	
	this.color = cmd.conf.color||'#000';
	this.val = '';
	
	this.init(cmd);
	
	this.menu = $('<div/>').elrteWdgColor({
		label : cmd.title,
		callback : function(v) { cmd.exec(v) }
	}, rte);
	

	this.ind = $('<div class="elrte-color-indicator"/>')
	
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
		this.val = cmd.value();
		this.ind.css('background-color', this.val||this.color);
		this.menu.val(this.val);
	}
	
	return;

}

elRTE.prototype.ui.colorButton.prototype = elRTE.prototype.ui._button;