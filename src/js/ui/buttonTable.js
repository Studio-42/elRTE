elRTE.prototype.ui.buttonTable = function(cmd) {
	
	var rte = cmd.rte,
		self = this,
		id = 'wt-'+(''+Math.random()).substr(2);;
	
	this.table  = $('<table title="'+rte.i18n('Click to create table')+'" class="elrte-widget-table-create" id="'+id+'"/>')
		.mousemove(function(e) {
			var t  = self.table,
				r  = t.find('tr');
				rn = r.length,
				cn = r.eq(0).children('td').length;

			if (t.offset().top + t.outerHeight() - e.clientY < 15) {
				t.append('<tr>'+(new Array(cn+1).join('<td/>'))+'</tr>');
			}
			if (t.offset().left + t.outerWidth() - e.clientX < 15) {
				t.find('tr').each(function() {
					$(this).append('<td/>');
				});
			}
		})
		.mousedown(function(e) {
			var v = self.status.text().split('x');

			cmd.exec({ rows : parseInt(v[0]), cols : parseInt(v[1]) });

		});;
	this.status = $('<div class="elrte-widget-table-status"/>')
	this.button = $('<div class="elrte-widget-table-button">'+rte.i18n('Open table dialog')+"</div>")
		.hover(function() {
			$(this).toggleClass(self.hc);
		})
		.mousedown(function() {
			cmd.dialog();
		});
	this.widget = $('<div class="elrte-widget-menu"/>')
		.append(this.table)
		.append(this.status)
		.append(this.button)
	
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
	
	this.onInit = function() {
		var self = this;
		this.ui.append(this.widget.hide())
		
		this.rte.bind('hideUI', function() {
			self.widget.hide();
		});
	}
	
	this.click = function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.state) {
			if (this.widget.is(':hidden')) {
				this.cmd.rte.trigger('hideUI');
				this.status.text('')
				this.table.html(new Array(4).join('<tr>'+(new Array(5).join('<td/>'))+'</tr>'))
			}
			this.widget.toggle(128);
		}
	}
	
	this.init(cmd);
}

elRTE.prototype.ui.buttonTable.prototype = elRTE.prototype.ui._buttonWidget;
