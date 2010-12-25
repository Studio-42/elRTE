/**
 * jQuery plugin
 * elRTE statusbar
 *
 */
$.fn.elrtestatusbar = function() {
	var c  = 'elrte-statusbar',
		ic = c+'-inner';
	
	this.append = function(cont, pos) {
		$(this).show().children('.'+ic+'-'+($.inArray(pos, ['left', 'center', 'right']) != -1 ? pos : 'left')).append(cont);
	}
	
	return this.each(function() {
		var $this = $(this);
		
		if (!$this.hasClass(c)) {
			$(this).hide().addClass('ui-widget ui-state-default ui-corner-all '+c)
				.append('<div class="'+ic+' '+ic+'-right"/><div class="'+ic+' '+ic+'-left"/><div class="'+ic+' '+ic+'-center">&nbsp;</div><div class="ui-helper-clearfix"/>');
		}
		
	});
}


$.fn.elrtestatusbar_ = function(o) {
	var c  = 'elrte-statusbar',
		ic = c+'-inner';
	
	var methods = {
			init : function() {
				$(this).addClass('ui-widget ui-state-default ui-corner-all '+c)
					.append('<div class="'+ic+' '+ic+'-right"/><div class="'+ic+' '+ic+'-left"/><div class="'+ic+' '+ic+'-center"/><div class="ui-helper-clearfix"/>');
			},
			append : function(cont, pos) {
				$(this).children('.'+ic+'-'+($.inArray(pos, ['left', 'center', 'right']) != -1 ? pos : 'left')).append(cont);
			}
		},
		a= arguments;

	return this.each(function() {
		(methods[o] || methods['init']).apply( this, Array.prototype.slice.call(a, 1));
	});

}
	

