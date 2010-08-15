(function($) {
	/**
	 * @class elRTE history
	 * rise event historyChange
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
		 * Add new undo level if required and change active storage input state
		 * Trigger "historyChange" event in both cases
		 *
		 * @param  Number  new active storage input state
		 **/
		this.add = function(i) {
			var d = this.rte.active, c, bm, t = false;
			
			if (active && d) {
				t = active.input!=i;
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

					bm = this.rte.selection.getBookmark();
					active.levels.push({
						origin : c,
						html   : d.get('wysiwyg'),
						bm     : [bm[0].id, bm[1].id]
					});
					this.rte.selection.moveToBookmark(bm);
					active.index = active.levels.length-1;
					this.rte.debug('history', 'add level: '+active.levels.length);
					t = true;
				}
				t && this.rte.trigger('historyChange')
			}
		}
		
		/**
		 * Return true if undo is available
		 *
		 **/
		this.canUndo = function() {
			return active && (active.index>0 || active.input!=0);
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
				this.rte.trigger('historyChange').trigger('change');
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
				this.rte.debug('history', 'redo '+active.index);
				this.rte.set(active.levels[active.index].html, null, {raw : true, quiet : true});
				this.rte.selection.moveToBookmark(active.levels[active.index].bm);
				this.rte.trigger('historyChange').trigger('change');
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
			.bind('keydown', function(e) {
				var  i = self.inputType(e.keyCode);
				if (active.input != i) {
					// change from typing to delete or otherwise - save state before changes
					self.add(i);
				}
			})
			.bind('keyup', function(e) {
				// only update input type
				active.input = self.inputType(e.keyCode);;
			})
			.bind('change', function(e) {
				var i = e.data.originalEvent ? self.inputType(e.data.originalEvent.keyCode) : 0;
				if (i != -1 && active.input != -1) {
					// all changes except delete after delete
					self.add(i);
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