/**
 * @class elRTE User interface controller
 *
 * @param  elRTE  rte объект-редактор
 *
 * @author:    Dmitry Levashov (dio) dio@std42.ru
 * @todo: this.domElem.removeClass('disabled') - move to ui.update;
 * @todo: add dom and selection as button members
 * Copyright: Studio 42, http://www.std42.ru
 **/
(function($) {
elRTE.prototype.ui = function(rte) {
	this.rte      = rte;
	this._buttons = [];
	var self      = this,
		tb        = this.rte.options.toolbars[rte.options.toolbar && rte.options.toolbars[rte.options.toolbar] ? rte.options.toolbar : 'normal'],
		tbl       = tb.length,
		p, pname, pl, n, c, b, i;
	
	// add prototype to all buttons
	for (i in this.buttons) {
		if (this.buttons.hasOwnProperty(i) && i != 'button') {
			this.buttons[i].prototype = this.buttons.button.prototype;
		}
	}
	
	// create buttons and put on toolbar
	while (tbl--) {
		pname = tb[tbl];
		p = $('<ul class="panel-'+pname+(tbl == 0 ? ' first' : '')+'" />').prependTo(this.rte.toolbar);
		p.bind('mousedown', function(e) {
			e.preventDefault();
		})
		pl = this.rte.options.panels[pname].length;
		while (pl--) {
			n = this.rte.options.panels[pname][pl];
			c = this.buttons[n] || this.buttons.button;
			this._buttons.push((b = new c(this.rte, n)));
			p.prepend(b.domElem);
		}
	}
	

	/**
	 * Переключает вид редактора между окном редактирования и исходника
	 **/
	// this.rte.tabsbar.children('.tab').click(function(e) {
	// 
	// 	if (!$(e.target).hasClass('active')) {
	// 		self.rte.tabsbar.children('.tab').toggleClass('active');
	// 		self.rte.workzone.children().toggle();
	// 		if ($(e.target).hasClass('editor')) {
	// 			self.rte.updateEditor();
	// 		} else {
	// 			self.rte.updateSource();
	// 			$.each(self._buttons, function() {
	// 				!this.active && this.domElem.addClass('disabled');
	// 			});
	// 			self.rte.source.focus();
	// 		}
	// 	}
	// });

	this.update();
	
	this.disable = function() {
		$.each(self._buttons, function() {
			!this.active && this.domElem.addClass('disabled');
		});
	}
	
}

/**
 * Обновляет кнопки - вызывает метод update() для каждой кнопки
 *
 * @return void
 **/
elRTE.prototype.ui.prototype.update = function(cleanCache) {
	cleanCache && this.rte.selection.cleanCache();
	var n    = this.rte.selection.getNode(),
		p    = this.rte.dom.parents(n, '*'),
		path = '';
	if (p.length) {
		$.each(p.reverse(), function() {
			path += ' &raquo; '+ this.nodeName.toLowerCase();
		});
	}
	if (n && n.nodeType == 1 && n.nodeName != 'BODY') {
		path += ' &raquo; '+ n.nodeName.toLowerCase();
	}
	this.rte.statusbar.html(path)
	$.each(this._buttons, function() {
		this.update();
	});
	this.rte.window.focus();
}



elRTE.prototype.ui.prototype.buttons = {
	
	/**
	 * @class кнопка на toolbar редактора 
	 * реализует поведение по умолчанию и является родителем для других кнопок
	 *
	 * @param  elRTE  rte   объект-редактор
	 * @param  String name  название кнопки (команда исполняемая document.execCommand())
	 **/
	button : function(rte, name) {
		var self     = this;
		this.rte     = rte;
		this.active = false;
		this.name    = name;
		this.val     = null;
		this.domElem = $('<li style="-moz-user-select:-moz-none" class="'+name+' rounded-3" name="'+name+'" title="'+this.rte.i18n(this.rte.options.buttons[name] || name)+'" unselectable="on" />')
			.hover(
				function() { $(this).addClass('hover'); },
				function() { $(this).removeClass('hover'); }
			)
			.click( function(e) {
				e.stopPropagation();
				e.preventDefault();
				if (!$(this).hasClass('disabled')) {
					self.command();
				}
				self.rte.window.focus();
			});
	}
}

/**
 * Обработчик нажатия на кнопку на тулбаре. Выполнение команды или открытие окна|меню и тд
 *
 * @return void
 **/
elRTE.prototype.ui.prototype.buttons.button.prototype.command = function() {
	this.rte.history.add();
	try {
		this.rte.doc.execCommand(this.name, false, this.val);
	} catch(e) {
		return this.rte.log('commands failed: '+this.name);
	}
	
	this.rte.ui.update(true);
}

/**
 * Обновляет состояние кнопки
 *
 * @return void
 **/
elRTE.prototype.ui.prototype.buttons.button.prototype.update = function() {
	try {
		if (!this.rte.doc.queryCommandEnabled(this.name)) {
			return this.domElem.addClass('disabled');
		} else {
			this.domElem.removeClass('disabled');
		}
	} catch (e) {
		return;
	}
	try {
		if (this.rte.doc.queryCommandState(this.name)) {
			this.domElem.addClass('active');
		} else {
			this.domElem.removeClass('active');
		}
	} catch (e) { }
}

})(jQuery);