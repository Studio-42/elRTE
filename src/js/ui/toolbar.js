/**
 * jQuery plugin - elRTE toolbar
 * Create buttons for all loaded editor commands, group them in panels and add panels on toolbar
 *
 * @param  elRTE  editor instance 
 */
$.fn.elrtetoolbar = function(rte) {
	return this.each(function() {
		var $this = $(this).addClass('elrte-rnd elrte-toolbar'),
			o     = rte.options,
			pl    = o.toolbars[o.toolbar] || o.toolbars['default'], // active toolbar's panels
			l     = pl.length,
			c     = 'elrte-toolbar-panel',
			tmp   = {},
			n, p, cl, btn, cmd, cmds;
		
		while (l--) {
			// panel name
			n    = pl[l];
			// panel
			p    = $('<div class="elrte-ib elrte-rnd '+c+' '+c+'-'+n+'"/>');
			// commands for panel
			cmds = o.panels[n] || [];
			cl   = cmds.length;
			
			while (cl--) {
				if ((cmd = rte._commands[cmds[cl]]) && !tmp[cmd.name]) {
					if ((btn = rte.ui.buttons[cmd.conf.ui || 'normal'])) {
						p.prepend(btn(cmd));
					}
					tmp[cmd.name] = true;
				}
				
			}
			p.children().length && $this.prepend(p);
		}
		if (!$this.children('.'+c)) {
			$this.hide();
		}
		
	});
}

