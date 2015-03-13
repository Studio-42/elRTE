/**
 * @class button - outdent text
 * уменьшает padding/margin/самомнение ;)
 *
 * @param  elRTE  rte   объект-редактор
 * @param  String name  название кнопки 
 * @todo decrease lists nesting level!
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 * @copyright: Studio 42, http://www.std42.ru
 **/
(function($) {
elRTE.prototype.ui.prototype.buttons.outdent = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);
	var self = this;

	this.command = function() {
		var v = this.find();
		if (v.node) {
			this.rte.history.add();
			var $node = $(v.node);
			if (v.type == "list") {
				var $myPar = $node.parent();
				var imFirst = !$node.prev().length;
				$node.insertAfter($myPar.parent());
				if (!$myPar.children().length) {
					$myPar.remove();
				} else if (imFirst) {
					$myPar.appendTo($node);
				}
				this.rte.selection.selectContents(v.node);
			} else {
				$node.css(v.type, (v.val > 40 ? v.val - 40 : 0) + 'px');
			}
			this.rte.ui.update();
		}
	}
	
	this.find = function(n) {
		function checkNode(n) {
			var ret = {type : '', val : 0};
			var s;
			if ((s = self.rte.dom.attr(n, 'style'))) {
				ret.type = s.indexOf('padding-left') != -1
					? 'padding-left'
					: (s.indexOf('margin-left') != -1 ? 'margin-left' : '');
				ret.val = ret.type ? parseInt($(n).css(ret.type))||0 : 0;
			}
			if (n.nodeName == "LI" && (!$(n).next().length || !$(n).prev().length) && (n.parentNode.nodeName == "UL" || n.parentNode.nodeName == "OL") && $(n.parentNode).parent().is('li')) {
				ret.type = "list";
				ret.val = 1;
			}
			return ret;
		}
		
		var n = this.rte.selection.getNode();
		var ret = checkNode(n);
		if (ret.val) {
			ret.node = n;
		} else {
			$.each(this.rte.dom.parents(n, '*'), function() {
				ret = checkNode(this);
				if (ret.val) {
					ret.node = this;
					return false;
				}
				return true;
			})
		}
		return ret;
	}
	
	this.update = function() {
		var v = this.find();
		if (v.node) {
			this.domElem.removeClass('disabled');
		} else {
			this.domElem.addClass('disabled');
		}
	}

	
}

})(jQuery);
