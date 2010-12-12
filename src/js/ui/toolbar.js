/**
 * jQuery plugin - elRTE toolbar
 * Create buttons for all loaded editor commands, group them in panels and append to toolbar
 *
 * @param  elRTE  editor instance 
 */
$.fn.elrtetoolbar = function(rte) {
	
	return this.each(function() {
		var $this = $(this).addClass('ui-widget ui-state-default ui-corner-all ui-helper-clearfix elrte-toolbar'),
			o     = rte.options,
			g     = o.presets[o.preset]||[], // commands groups names
			gl    = g.length,
			pc    = 'elrte-toolbar-panel',
			ex    = {},
			p, pa, gn, cmdn, cl, cmd, btn;
			
		while (gl--) {
			// cmd group name
			gn = g[gl];
			// commands names from group
			cmdn = o.commands[gn] || [];
			cl = cmdn.length;
			// toolbar panel contains commands from group
			p = $('<div class="elrte-ib '+pc+' '+pc+'-'+gn+'"/>');
			pa = false
			while (cl--) {
				if ((cmd = rte._commands[cmdn[cl]]) && !ex[cmd.name] && (btn = rte.ui.buttons[cmd.conf.ui])) {
					p.prepend(btn(cmd));
					ex[cmd.name] = true;
					pa = true;
				}
			}
			pa && $this.prepend(p);
		}
		!$this.children().length && $this.hide();
	});
}

elRTE.prototype.ui.toolbars['default'] = function(rte) {
	return $('<div/>').elrtetoolbar(rte);
}


