/**
 * @class Button with menu
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.paletteButton = function(cmd) {
	var self = this,
		rte = cmd.rte;
	this.colors = [
		'800000', '8b4513', '006400', '2f4f4f', '000080', '4b0082', '800080', '000000', 
		'ff0000', 'daa520', '6b8e23', '708090', '0000cd', '483d8b', 'c71585', '696969',
		'ff4500', 'ffa500', '808000', '4682b4', '1e90ff', '9400d3', 'ff1493', 'a9a9a9',
		'ff6347', 'ffd700', '32cd32', '87ceeb', '00bfff', '9370db', 'ff69b4', 'dcdcdc',
		'ffdab9', 'ffffe0', '98fb98', 'e0ffff', '87cefa', 'e6e6fa', 'dda0dd', 'ffffff'
		]
	this.init(cmd);
	
	this.menu = $('<div class="elrte-ui-widget-menu elrte-widget-palette"/>').append('<div class="elrte-ui-header">'+cmd.title+'</div>')
	
	this.sw = $('<div class="elrte-widget-palette-switch elrte-rnd-3">'+rte.i18n('More colors...')+'</div>');
	
	this.indicator = $('<div class="elrte-ib elrte-widget-palette-color elrte-widget-palette-indicator"/>');
	this.input = $('<input type="text" size="8"/>')
	this.reset = $('<div class="elrte-ib elrte-widget-palette-color elrte-widget-palette-reset"/>');
	
	this.status = $('<div class="elrte-widget-palette-status elrte-rnd-3"/>')
		.append(this.reset)
		.append(this.indicator)
		.append(this.input)
		
	this.paletteSmall = '<div class="elrte-widget-palette-small elrte-rnd-3">';
	$.each(this.colors, function(i, c) {
		c = '#'+c;
		self.paletteSmall += '<div name="'+c+'" class="elrte-ib elrte-widget-palette-color" style="background:'+c+';"/>'
	})
	this.paletteSmall += '</div>'
	this.menu.append(this.sw).append($(this.paletteSmall)).append(this.status)
	
	this.$.append(this.menu.hide()).mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		self.menu.toggle(128)
	})
	
	
}

elRTE.prototype.ui.paletteButton.prototype = elRTE.prototype.ui._button;