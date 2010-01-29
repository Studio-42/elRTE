/**
 * @class button - justify text
 *
 * @param  elRTE  rte   объект-редактор
 * @param  String name  название кнопки 
 *
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 * @copyright: Studio 42, http://www.std42.ru
 **/
(function($) {
elRTE.prototype.ui.prototype.buttons.justifyleft = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);

	this.command = function() {
		var s = this.rte.selection.selected({ collapsed:true, blocks : true}),
			l = s.length;
		while (l--) {
			if (this.rte.dom.filter(s[l], 'textNodes')) {
				$(s[l]).css('text-align', this.name == 'justifyfull' ? 'justify' : this.name.replace('justify', ''))
			}
		}
	}
}

elRTE.prototype.ui.prototype.buttons.justifycenter = elRTE.prototype.ui.prototype.buttons.justifyleft;
elRTE.prototype.ui.prototype.buttons.justifyright  = elRTE.prototype.ui.prototype.buttons.justifyleft;
elRTE.prototype.ui.prototype.buttons.justifyfull   = elRTE.prototype.ui.prototype.buttons.justifyleft;

})(jQuery);
