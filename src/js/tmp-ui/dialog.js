/**
 * @class jQuery UI dialog wrapper
 * 
 * @param  Object  options
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elRTE.prototype.ui.dialog = function(o) {
	
	o = $.extend({ modal : true, width: 400, autoOpen : false, position : ['center', 100], buttons : {} }, o)
	
	this.dialog = $('<div/>').dialog(o)
		.bind('dialogclose', function(e, ui) {
			$(this).dialog('destroy').remove();
		}).bind('dialogopen', function() {
			$(this).find(':text').bind('keyup', function(e) {
				if (e.keyCode == 13) {
					$(this).parents('.ui-dialog').eq(0).find('button').eq(0).click();
				}
			}).filter('[class!="small"]')/*.css('width', '100%')*/.eq(0).focus();
		});
	
	this.append = function(o) {
		this.dialog.append(o);
		return this;
	}
	
	this.open = function() {
		this.dialog.find('.elrte-tabs').tabs().end().dialog('open');
		return this;
	}
	
}
