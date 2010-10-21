elRTE.prototype.ui.toolbars.default = function(rte) {
	
	var o = rte.options,
		tb = rte.options.toolbar,
		// panels length
		pl = o.toolbars[tb] || o.toolbars['default'],
		l = pl.length,
		pc = 'elrte-toolbar-panel',
		pn, pui, cmds, cl, cmd, btn; 
	
	this.ui = $('<div class="elrte-toolbar"/>');
	
	
	
	while (l--) {
		pn = pl[l];
		pui = $('<ul class="'+pc+' '+pc+'-'+pn+'"/>');
		cmds = o.panels[pn]||[];
		cl = cmds.length;
		// console.log(cl)
		while (cl--) {
			if ((cmd = rte._commands[cmds[cl]])) {
				btn = rte.ui['button'+cmd.conf.ui]||rte.ui.button;
				btn = new btn(cmd)
				pui.prepend(btn.ui);
			}
		}
		pui.children().length && this.ui.prepend(pui);
	}
	
	return this.ui.children().length ? this.ui : '';
	
	var pl = conf.length,
		pc = 'elrte-toolbar-panel',
		pn, pnl, cn, cl, cmd, btn;
	
	this.ui = $('<div class="elrte-toolbar"/>');
	
	console.log(conf)
	while (pl--) {
		pn  = tb[pl];
		pnl = $('<ul class="'+pc+' '+pc+'-'+pn+'"/>');
		cn  = this.rte.options.panels[pn]||[];
		cl  = cn.length;
		while (cl--) {
			
			if ((cmd = commands[cn[cl]])) {
				btn = this.rte.ui['button'+cmd.conf.ui]||this.rte.ui.button;
				btn = new btn(cmd)
				pnl.prepend(btn.ui);
			}
		}
		pnl.children().length && this.toolbar.prepend(pnl);
	}
	
	return this.ui
}

