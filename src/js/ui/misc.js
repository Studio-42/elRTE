(function($) {

	/**
	 * @class Create table, add data to table cells
	 * 
	 * @param  Object  table attributes
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.ui.table = function(attr) {
		this.table = $('<table/>').attr(attr||{});
		this.row = false;
		
		this.append = function(el, newRow, attr) {
			var i, _td;
			
			function td(o) {
				_td = $('<td/>').append(o);
				attr && _td.attr(attr);
				return _td;
			}
			
			if (newRow || !this.row) {
				this.row = $('<tr/>').appendTo(this.table);
			}
			if (!$.isArray(el)) {
				this.row.append(td(el));
			} else {
				for (i = 0; i < el.length; i++) {
					this.row.append(td(el[i]));
				}
			}
			return this;
		}
		
		this.get = function() {
			return this.table;
		}
	}
	
	/**
	 * Return select from given options and add change callback
	 * 
	 * @param  Object    options
	 * @param  Function  change callback
	 * @return jQuery
	 **/
	elRTE.prototype.ui.select = function(opts, change) {
		var s = '<select>';
		$.each(opts, function(v, l) {
			s += '<option value="'+v+'">'+l+'</option>';
		});
		s = $(s+'</select>');
		change && s.change(change);
		return s;
	}
	
	/**
	 * Return div with jqueryUI icon and click/hover callbacks
	 * 
	 * @param  String  icon(class) name
	 * @param  String  title
	 * @param  Function  click callback
	 * @return jQuery
	 **/
	elRTE.prototype.ui.iconButton = function(icon, title, callback) {
		return $('<div class="ui-state-default ui-corner-all" title="'+title+'"><div style="width:16px;height:16px;margin:2px" class="ui-icon '+icon+'"></div></div>')
			.click( callback )
			.hover(function() { $(this).toggleClass('ui-state-hover') });
	}
	
	elRTE.prototype.ui.button = function(cmd, type, widget) {
		var name  = cmd.name,
			title = cmd.title, 
			c     = 'elrte-ui elrte-ui-'+name+' elrte-ui-disabled',
			b     = '';
		
		if (type == 'menu') {
			c += ' elrte-ui-menu';
			b = '<div class="elrte-ui-menu-control"/><span class="elrte-ui-menu-label">'+title+'</span>';
		} else if (type == 'compact-menu') {
			c += ' elrte-ui-menu-icon';
			b = '<div class="elrte-ui-menu-wrp"><div class="elrte-ui-menu-control"/>'+title+'</div>';
		}

		b = $('<li class="'+c+'">'+b+'</li>')
		return widget ? b.elrtebutton(widget) : b;
		
	}
	
	
	elRTE.prototype.ui.menuButton = function(name, title, compact) {
		var c    = 'elrte-ui',
			mc   = c+'-menu',
			bc = c+' '+mc+(compact ? '-icon ' : ' ')+c+'-'+name,
			label = compact ? '' : '<span class="'+mc+'-label">'+title+'</span>';
			
		return 	$('<li class="'+bc+'" title="'+title+'"><div class="'+mc+'-wrp"><div class="'+mc+'-control"/>'+label+'</div></li>');
		
			
	}
	
})(jQuery);