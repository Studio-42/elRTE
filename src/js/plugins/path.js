/**
 * @class elRTE plugin
 * Show path to selected node in status bar, 
 * highlight node on hover it's path,
 * select node on click on path
 *
 **/
elRTE.prototype.plugins.path = function(rte) {
	
	this.info = {
		name      : 'Selected element path',
		author    : 'Dmitry (dio) Levashov, dio@std42.ru',
		authorurl : 'http://www.std42.ru',
		url       : 'http://elrte.org/redmine/projects/elrte/wiki/'
	}
	
	var sep   = rte.lang.dir == 'rtl' ? '&laquo;' : '&raquo;',
		ec    = 'elrte-pl-path-el',
		hc    = 'elrte-highlight',
		title = rte.i18n('Click to select element'),
		panel = $('<div class="elrte-pl-path"/>')
			.delegate('.'+ec, 'click', function() {
				if (this.refNode) {
					rte.selection.select(this.refNode);
				}
			}),
		node;
	
	if (rte.pluginConf('path', 'hover')) {
		panel.delegate('.'+ec, 'hover', function(e) {
			if (this.refNode) {
				if (e.type == 'mouseenter') {
					node = $(this.refNode).addClass(hc);
				} else {
					$(this.refNode).removeClass(hc);
					node = false;
				}
			}
		});
	}
	
	rte.bind('load', function() {
		rte.statusbar.append(panel);
	})
	.bind('source close', function(e) {
		if (e.data.id == rte.active.id) {
			if (node) {
				node.removeClass(hc);
				node = false;
			}
			panel.text('')
		}
	})
	.bind('wysiwyg change changepos', function() {
		var n = rte.selection.node(), 
			p = [],// n.nodeType == 1 && !/^BODY|HTML$/.test(n.nodeName) ? [p] : [], 
			i, e;

		if (n && n.nodeType == 1 && !/^BODY|HTML$/.test(n.nodeName)) {
			p.push(n)
		}
		p = p.concat(rte.dom.parents(n)).reverse();

		if (node) {
			node.removeClass(hc);
		}
		
		panel.text('');
		
		for (i = 0; i < p.length; i++) {
			panel.append((e = $('<span class="'+ec+'" title="'+title+'">'+p[i].nodeName.toLowerCase()+'</span>')[0]));
			e.refNode = p[i];
			if (i < p.length-1) {
				panel.append('<span class="elrte-pl-path-sep">'+sep+'</span>');
			}
		}
	});
}
