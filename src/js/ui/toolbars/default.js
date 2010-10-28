/**
 * 
 */

$.fn.elrtetoolbar = function(rte) {
	return this.each(function() {
		var t  = $(this),
			o  = rte.options,
			pl = o.toolbars[o.toolbar] || o.toolbars['default'],
			l  = pl.length,
			c  = 'elrte-toolbar-panel',
			tmp= {},
			n, p, cl, btn;
			
		t.addClass('elrte-rnd elrte-toolbar');
		
		while (l--) {
			n    = pl[l];
			p    = $('<div class="elrte-ib elrte-rnd '+c+' '+c+'-'+n+'"/>');
			cmds = o.panels[n] || [];
			cl   = cmds.length;
			
			while (cl--) {
				if ((cmd = rte._commands[cmds[cl]]) && !tmp[cmd.name]) {
					btn = cmd.conf.ui || 'normal';
					btn = rte.ui.buttons[btn] || rte.ui.buttons['normal'];
					p.prepend(btn(cmd));
					tmp[cmd.name] = true;
				}
				
			}
			p.children().length && t.prepend(p);
		}
		
	});
}

