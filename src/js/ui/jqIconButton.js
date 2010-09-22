/**
 * Return div with jqueryUI icon and click/hover callbacks
 * 
 * @param  String  icon(class) name
 * @param  String  title
 * @param  Function  click callback
 * @return jQuery
 **/
elRTE.prototype.ui.jqIconButton = function(icon, title, callback) {
	return $('<div class="ui-state-default ui-corner-all" title="'+title+'"><div style="width:16px;height:16px;margin:2px" class="ui-icon '+icon+'"></div></div>')
		.click( callback )
		.hover(function() { $(this).toggleClass('ui-state-hover') });
}