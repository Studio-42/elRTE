(function($) {
	/**
	 * @class elRTE plugin
	 * Automatically save documents
	 * Interval set in editor options.pluginConf.autosave.interval (in minutes)
	 *
	 **/
	elRTE.prototype.plugins.autosave = function(rte) {
		var self = this, intId, panel;
		this.name        = 'autosave';
		this.description = 'Auto save documents';
		this.author      = 'Dmitry (dio) Levashov, dio@std42.ru';
		this.authorURL   = 'http://www.std42.ru';
		this.docURL      = '';
		
		rte.bind('load', function(e) {
			var i    = parseInt(rte.pluginConf('autosave', 'interval')),
				url  = rte.form.attr('action'),
				type = rte.form.attr('method')||'post',
				name = rte.id+'_atrg',
				u, t;
			
			if (i>0) {
				panel = $('<div class="elrte-statusbar-autosave">'+rte.i18n('saving')+'</div>').hide().prependTo(rte.view.statusbar.show())
				intId = setInterval(function() {
					panel.show();
					rte.updateSource();
					t = $('<iframe name="'+name+'" style="position:absolute;left:-1000px"/>').appendTo('body');
					
					$.each(rte.documents, function(id, d) {
						if ((u = d.url||url)) {
							$('<form action="'+u+'" method="'+(d.type||type)+'" target="'+name+'" />')
								.append(d.source.clone().val(''+d.source.val()))
								.appendTo('body')
								.submit();
						}
					});
					
					t.remove();
					setTimeout(function() { panel.hide() }, 2000);
					
				}, 60000*i);
			}
		}).bind('save', function() {
			clearInterval(intId);
		});
		
	}
})(jQuery);