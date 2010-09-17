(function($) {
	
	/**
	 * @class History manager
	 * @param  elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.history = function(rte) {
		var self    = this,
			size    = parseInt(rte.options.historySize)||0,
			sel     = rte.selection,
			storage = {},
			reg     = /<span([^>]*class\s*=\s*"[^>]*elrtebm[^>]*)>\s*(<\/span>)?/gi,
			active;
			
		function add(force) {
			var doc, level, key, curKey, bm, sel;
			
			if (!active) {
				return;
			}
			
			key    = rte.lastKey == rte.KEY_CHAR || rte.lastKey == rte.KEY_DEL ? rte.lastKey: 0;
			curKey = active.key;
			doc    = rte.active;
			level  = active.levels[active.index];
			
			if (!level || force || ((key == 0 || (curKey != 0 && curKey != key)) && $.trim(level.html.replace(reg, '')) != $.trim(doc.get()) ) ) {
				// remove levels after then current
				if (active.index < active.levels.length-1) {
					active.levels.splice(active.index+1, active.levels.length-active.index-1);
				}
				// increase storage size till max allowed size
				if (active.index >= size) {
					active.levels.shift();
					active.index--;
				}

				sel = rte.selection;
				bm = sel.bookmark();
				
				active.levels.push({
					bm     : [bm[0].id, bm[1].id],
					html   : doc.get(),
					scroll : parseInt($(doc.document).scrollTop())
				});
				active.index = active.levels.length-1;
				
				sel.toBookmark(bm);
				rte.debug('history.change', ' index: '+active.index+' key: '+active.key);
			}
			
			active.key = key;
			rte.trigger('historyChange');
		}	
			
		/**
		 * Return true if undo can be done
		 * 
		 * @return Boolean
		 */
		this.canUndo = function() {
			return active && (active.index>0 || active.key > 0);
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
			var level, doc;
			
			if (this.canUndo()) {
				// add new level for pevious typing or del
				if (active.key > 0) {
					add(true);
				}
				
				level = active.levels[--active.index];
				doc   = rte.active;
				
				doc.set(level.html);
				sel.toBookmark(level.bm);
				$(doc.document).scrollTop(level.scroll);
				active.key = 0;
				
				rte.trigger('historyChange');
				rte.debug('history.undo', active.index+' key: '+active.key);
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
			var level, doc;
			
			if (this.canRedo()) {
				level = active.levels[++active.index];
				doc   = rte.active;
				
				doc.set(level.html);
				sel.toBookmark(level.bm);
				$(doc.document).scrollTop(level.scroll);
				active.key = 0;
				rte.trigger('historyChange');
				rte.debug('history', 'redo '+(active.index));
				return true;
			}
		}
			
		if (size > 0) {
			
			rte.bind('open', function(e) {
				/* create storage for new document */
				storage[e.data.id] = { 
					levels : [], 
					index  : 0, 
					key    : 0
				};
			})
			.bind('close', function(e) {
				/* remove storage for document */
				delete storage[e.data.id];
			})
			.bind('wysiwyg', function(e) {
				/* set active storage and add initial level if not exists */
				active = storage[e.data.id];
				add(0);
			})
			.bind('source', function() { 
				/* disable active storage for source mode */
				active = null; 
			})
			.bind('exec change', function(e) {
				if (e.data.cmd != 'undo' && e.data.cmd != 'redo') {
					add();
				}
			})
			.bind('keydown', function() {
				if (rte.lastKey == rte.KEY_CHAR || rte.lastKey == rte.KEY_DEL) {
					add();
				}
			})
			.bind('changePos', function() {
				add()
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