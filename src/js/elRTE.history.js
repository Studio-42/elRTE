(function($) {
	/**
	 * @class elRTE history
	 * @param elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 */
	elRTE.prototype.history = function(rte) {
		/**
		 * editor instance
		 **/
		this.rte    = rte;
		/**
		 * redo/undo levels size (0 - for not use history)
		 **/
		this.size   = parseInt(rte.options.historySize)||0;

		var self    = this,
			storage = {}, /* history storage */
			active;       /* active document history */
		
		/**
		 * Return 1 if c is char key, -1 if c is del key or 0
		 *
		 * @param  Number  key code
		 * @return Number
		 **/
		this.inputType = function(c) {
			if (self.rte.utils.isKeyChar(c)) {
				return 1;
			} else if (self.rte.utils.isKeyDel(c)) {
				return -1;
			}
			return 0;
		}
		
		/**
		 * Add new undo level if required and [change active storage input state]
		 * Trigger "historyChange" event on success
		 *
		 * @param  Number  new active storage input state
		 **/
		this.add = function(i) {
			var d = this.rte.active, c, bm;
			
			if (active && d) {
				active.input = i||0;
				c = d.get('wysiwyg');
				if (!active.levels.length || active.levels[active.index].origin != c) {
					if (active.index < active.levels.length-1) {
						active.levels.splice(active.index+1);
					}
					if (active.index >= self.size) {
						active.levels.shift();
						active.index--;
					}

					bm = rte.selection.getBookmark();
					active.levels.push({
						origin : c,
						html   : d.get('wysiwyg'),
						bm     : [bm[0].id, bm[1].id]
					});
					rte.selection.moveToBookmark(bm);
					active.index = active.levels.length-1;
					self.rte.debug('history', 'add level: '+active.levels.length)
				}
			}
		}
		
		/**
		 * Return true if undo is available
		 *
		 **/
		this.canUndo = function() {
			return active && (active.index>0 || active.input);
		}
		
		/**
		 * Return true if redo is available
		 *
		 **/
		this.canRedo = function() {
			return active && active.levels.length-active.index>1;
		}
		
		/**
		 * Produce undo action
		 * Trigger "change" and "historyChange" events on success
		 *
		 * @return  Boolean
		 **/
		this.undo = function() {
			if (this.canUndo()) {
				if (active.input) {
					this.add(0);
				}
				this.rte.debug('history', 'undo '+active.index);
				active.index--;
				active.input = 0;
				this.rte.set(active.levels[active.index].html, null, {raw : true, quiet : true});
				this.rte.selection.moveToBookmark(active.levels[active.index].bm);
				this.rte.trigger('change');
				return true;
			}
		}
		
		/**
		 * Produce redo action
		 * Trigger "change" and "historyChange" events on success
		 *
		 * @return  Boolean
		 **/
		this.redo = function() {
			if (this.canRedo()) {
				active.index++;
				active.input = 0;
				this.rte.debug('history', 'redo '+active.index)
				this.rte.set(active.levels[active.index].html, null, {raw : true, quiet : true});
				this.rte.selection.moveToBookmark(active.levels[active.index].bm);
				this.rte.trigger('change');
				return true;
			}
		}
		
		/* init */
		if (this.size>0) {
			rte.bind('open', function(e) {
				/* create storage for new document */
				storage[e.data.id] = { 
					levels : [], 
					index  : 0, 
					input  : 0 
				};
			})
			.bind('close', function(e) {
				/* remove storage for document */
				delete storage[e.elrteDocument.id];
			})
			.bind('wysiwyg', function() {
				/* set active storage and add initial level if not exists */
				active = storage[self.rte.active.id];
				!active.levels.length && self.add();
			})
			.bind('source', function() { 
				/* disable active storage for source mode */
				active = null; 
			})
			.bind('keyup', function(e) {
				var i = self.inputType(e.keyCode);
				if (active.input == -1 && i == 1) {
					// change from typing to delete (not catch by change event)
					self.add(i);
				} 
				active.input = i;
			})
			.bind('change', function(e) {
				if (e.data.originalEvent && e.data.originalEvent.type == 'keyup') {
					var i = self.inputType(e.data.originalEvent.keyCode);
					if (i == 0 || (active.input == 1 && i == -1)) {
						// all changes from keyboard except delete after delete
						self.add(i);
					}
				} else {
					// all other changes
					self.add(0);
				}
			})
			.shortcut((rte.macos ? 'meta' : 'ctrl')+'+z', 'Undo (Ctrl+Z)', function(e) {
				self.canUndo() && self.undo();
			})
			.shortcut((rte.macos ? 'meta' : 'ctrl')+'+shift+z', 'Redo (Ctrl+Shift+Z)', function(e) {
				self.canRedo() && self.redo();
			});
		}
	}
	
})(jQuery);