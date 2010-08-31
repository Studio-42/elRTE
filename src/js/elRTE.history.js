(function($) {
	/**
	 * @class elRTE history
	 * rise event historyChange
	 *
	 * @param elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 */
	elRTE.prototype.history = function(rte) {
		var self      = this,
			size      = parseInt(rte.options.historySize)||0,
			sel       = rte.selection,
			storage   = {},
			keyupLock = false,
			reg       = /<span([^>]*class\s*=\s*"[^>]*elrtebm[^>]*)>\s*(<\/span>)?/gi,
			active;
		
		/**
		 * Add new level to document history. 
		 * Rise historyChange event
		 * 
		 * @param Number   change type
		 * @param Boolean  force add
		 * @return void
		 */
		function add(c, f) {
			if (!active) {
				return;
			}
			var d = rte.active, 
				l = active.levels[active.index],
				bm, html;
				
			// rte.log(active)
				
			if (!active.levels.length || f
			|| ((c == rte.CHANGE_CMD || (active.change != rte.CHANGE_CMD && active.change != c)) && $.trim(l.html.replace(reg, '')) != $.trim(d.get())) ) {
				if (active.index < active.levels.length-1) {
					active.levels.splice(active.index+1, active.levels.length-active.index-1);
				}
				if (active.index >= size) {
					active.levels.shift();
					active.index--;
				}
				bm = sel.bookmark();
				html = d.get();
				sel.toBookmark(bm);
				// rte.log($(d.document).scrollTop())
				active.levels.push({
					bm     : [bm[0].id, bm[1].id],
					html   : html,
					scroll : parseInt($(d.document).scrollTop())
				});
				active.index = active.levels.length-1;
				// rte.debug('history.add', active.levels.length+' '+active.index);
			}
			active.change = c;
			rte.trigger('historyChange');
			rte.debug('history.change', 'levels: '+active.levels.length+' index: '+active.index+' change: '+active.change);
		}
			
		/**
		 * Return true if undo can be done
		 * 
		 * @return Boolean
		 */
		this.canUndo = function() {
			return active && (active.index>0 || active.change != rte.CHANGE_CMD);
		}
		
		/**
		 * Return true if undo can be done
		 * 
		 * @return Boolean
		 */
		this.canRedo = function() {
			return active && active.levels.length-active.index>1;
		}
		
		/**
		 * Undo last changes in active document
		 * On success rise "historyChange" event
		 * 
		 * @return Boolean
		 */
		this.undo = function() {
			var l, d;
			if (this.canUndo()) {
				if (active.change != rte.CHANGE_CMD) {
					// add new level for pevious typing or del
					add(rte.CHANGE_CMD, true);
				}
				
				l = active.levels[--active.index];
				d = rte.active;
				
				d.set(l.html);
				sel.toBookmark(l.bm);
				$(d.document).scrollTop(l.scroll);
				active.change = rte.CHANGE_CMD;
				rte.trigger('historyChange');
				rte.debug('history.undo', (active.index));
				return true;
			}
		}
		
		/**
		 * Redo prev changes in active document
		 * On success rise "historyChange" event
		 * 
		 * @return Boolean
		 */
		this.redo = function() {
			var l, d;
			if (this.canRedo()) {
				l = active.levels[++active.index];
				d = rte.active;
				
				d.set(l.html);
				sel.toBookmark(l.bm);
				$(d.document).scrollTop(l.scroll);
				active.change = rte.CHANGE_CMD;
				rte.trigger('historyChange');
				rte.debug('history', 'redo '+(active.index));
				return true;
			}
		}
		
		if (size>0) {
			
			rte.bind('open', function(e) {
				/* create storage for new document */
				storage[e.data.id] = { 
					levels : [], 
					index  : 0, 
					change  : rte.CHANGE_CMD
				};
			})
			.bind('close', function(e) {
				/* remove storage for document */
				delete storage[e.data.id];
			})
			.bind('wysiwyg', function(e) {
				/* set active storage and add initial level if not exists */
				active = storage[e.data.id];
				add(rte.CHANGE_CMD);
			})
			.bind('source', function() { 
				/* disable active storage for source mode */
				active = null; 
			})
			.bind('keydown', function(e) {
				// save snapshot before changes except del after del
				if (rte.change != rte.CHANGE_NON && rte.change != rte.CHANGE_POS) {
					add(rte.change, rte.change != rte.CHANGE_DEL);
				}
			})
			.bind('exec cut paste', function(e) {
				// save snapshot before changes
				if (e.data.cmd != 'undo' && e.data.cmd != 'redo' && e.data.cmd != 'source') {
					// ? if false - lost selection, true - need to control cmd names
					add(rte.CHANGE_CMD, false);
					keyupLock = true
				}
			})
			.bind('change', function(e) {
				// save after changes
				add(e.data.type||rte.CHANGE_CMD);
				// block following keyup - keyCode on keyup event could not be detect correctly
				e.data.type && (keyupLock = true);
			})
			.bind('keyup', function(e) {
				if (!keyupLock) {
					if (rte.utils.isKeyChar(e.keyCode)) {
						add(rte.CHANGE_KBD);
					} else if (rte.utils.isKeyDel(e.keyCode)) {
						add(rte.CHANGE_DEL);
					}
				}
				keyupLock = false;
			})
			.bind('changePos', function(e) {
				// all except changePos after changePos to avoid extra html compare
				if (active.change != rte.CHANGE_CMD) {
					add(rte.CHANGE_CMD);
				}
			})
			.shortcut((rte.macos ? 'meta' : 'ctrl')+'+z', 'undo', 'Undo (Ctrl+Z)', function(e) {
				return self.undo();
			})
			.shortcut((rte.macos ? 'meta' : 'ctrl')+'+shift+z', 'redo', 'Redo (Ctrl+Shift+Z)', function(e) {
				return self.redo();
			});
		}
	}

})(jQuery);