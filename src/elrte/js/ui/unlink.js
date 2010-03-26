/**
 * @class button - remove link
 *
 * @param  elRTE  rte   объект-редактор
 * @param  String name  название кнопки
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 * @copyright: Studio 42, http://www.std42.ru 
 **/
(function($) {

	elRTE.prototype.ui.prototype.buttons.unlink = function(rte, name) {
		this.constructor.prototype.constructor.call(this, rte, name);

		this.command = function() {
			var n = this.rte.selection.getNode(),
			l = n.nodeName == "A" ? n : this.rte.dom.selfOrParentLink(n);
			if (!l && !this.rte.selection.collapsed()) {
				l = this.rte.dom.childLinks(n)[0];
			}
			
			if (l) {
				this.rte.history.add();
				this.rte.selection.select(l);
				this.rte.doc.execCommand('unlink', false, null);
				this.rte.ui.update(true);
			}
		
		}
	
		this.update = function() {
			var n = this.rte.selection.getNode();

			if ((n.nodeName == "A") || this.rte.dom.selfOrParentLink(n) 
			|| (!this.rte.selection.collapsed() && this.rte.dom.childLinks(n).length)) {
				this.domElem.removeClass('disabled').addClass('active');
			}
			else {
				this.domElem.removeClass('active').addClass('disabled');
			}
		}
	}

})(jQuery);

