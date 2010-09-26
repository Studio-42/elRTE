elRTE.prototype.ui.tableButton = function(cmd) {
	var self = this,
		rte  = cmd.rte,
		id   = 'wt-'+(''+Math.random()).substr(2);

	this.init(cmd);
	

	this.table  = $('<table id="'+id+'" title="Click to create table"><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></table>')
	this.status = $('<div class="elrte-widget-table-status"/>')
	this.button = $('<div class="elrte-widget-table-button" title="">'+rte.i18n('Open table dialog')+"</div>")
		.hover(function() {
			$(this).toggleClass(self.hc);
		})
		.mousedown(function() {
			cmd.dialog()
		})
	this.menu = $('<div class="elrte-widget-table"></div>')
		.append(this.table)
		.append(this.status).append(this.button)

	
	
	this.$.append(this.menu.hide());
	
	
	
	this.table.mousemove(function(e) {
		var t  = self.table,
			r  = t.find('tr');
			rn = r.length,
			cn = r.eq(0).children('td').length;

		if (t.offset().top + t.outerHeight() - e.clientY < 10) {
			t.append('<tr>'+(new Array(cn+1).join('<td/>'))+'</tr>');
		}
		if (t.offset().left + t.outerWidth() - e.clientX < 10) {
			t.find('tr').each(function() {
				$(this).append('<td/>');
			});
		}
	})
	.mousedown(function(e) {
		var v = self.status.text().split('x');
		
		cmd.exec({ rows : parseInt(v[0]), cols : parseInt(v[1]) });
		
	});
	
	$('#'+id+' td').live('mouseenter', function(e) {
		var $t = $(this),
			cn = $t.prevAll('td').length,
			rn = $t.parent().prevAll('tr').length;

		self.table.find('tr').each(function(i, r) {
			if (i > rn) {
				$(r).children('td').removeClass('elrte-ui-active');
			} else {
				$.each($(r).children(), function(i, c) {
					$(c).toggleClass('elrte-ui-active', i <= cn);
				});
			}
		});
		self.status.text(rn+1+' x '+(cn+1));
	})
	
	
	this.$.mousedown(function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (self.menu.is(':hidden')) {
			rte.trigger('hideUI');
			self.table.html( new Array(4).join('<tr>'+(new Array(5).join('<td/>'))+'</tr>'));
			self.status.text('');
		}
		self.menu.toggle(128);
	})
	
	rte.bind('hideUI', function() {
		self.menu.hide();
	});
	
}

elRTE.prototype.ui.tableButton.prototype = elRTE.prototype.ui._button;