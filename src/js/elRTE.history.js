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
				// self.rte.log('undo')
				if (active.input) {
					active.levels.push({});
					active.index++;
				}
				active.index--;
				active.input = 0;
				self.rte.set(active.levels[active.index].html, null, {raw : true, quiet : true});
				self.rte.selection.moveToBookmark(active.levels[active.index].bm);
				self.rte.trigger('change').trigger('historyChange');
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
				// self.rte.log('redo')
				active.index++;
				active.input = 0;
				self.rte.set(active.levels[active.index].html, null, {raw : true, quiet : true});
				self.rte.selection.moveToBookmark(active.levels[active.index].bm);
				self.rte.trigger('change').trigger('historyChange');
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
				/* change active storage */
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
						// all changes except delete after delete
						self.add(i);
					}
				} else {
					self.add(0);
				}
			})
			// .bind('change', function(e) { 
			// 	/* on press delete keys - update active input state, otherwise - add new level */
			// 	if (e.data.originalEvent && e.data.originalEvent.type == 'keyup' && self.rte.utils.isKeyDel(e.data.originalEvent.keyCode)) {
			// 		// self.rte.log('input del')
			// 		setInput(self._del)
			// 	} else {
			// 		self.add(0);
			// 	}
			// 	// e.isDel ? setInput(self._del) : self.add(0);
			// })
			// .bind('input', function(e) {
			// 	/* if symbol key pressed - update active input state */
			// 	// self.rte.log(e.data)
			// 	setInput(self._input);
			// })
			// .bind('keydown', function(e) {
			// 	if (active) {
			// 		self.rte.log(self.rte.utils.isKeyDel(e.keyCode)+' '+(active.input == self._input))
			// 		if (self.rte.utils.isKeyDel(e.keyCode) && active.input == self._input) {
			// 			
			// 			self.add(self._del);  /* change from typing to delete */
			// 		} else if (self.rte.utils.isKeyChar(e.keyCode) && active.input == self._del) {
			// 			self.add(self._input); /* change from delete to typing */
			// 		} else if (e.keyCode == 13 && active.input) {
			// 			self.add(); /* enter after typing/delete */
			// 		}
			// 	}
			// })
			.shortcut((rte.macos ? 'meta' : 'ctrl')+'+z', 'Undo (Ctrl+Z)', function(e) {
				if (self.canUndo()) {
					self.undo();
				}
			})
			.shortcut((rte.macos ? 'meta' : 'ctrl')+'+shift+z', 'Redo (Ctrl+Shift+Z)', function(e) {
				if (self.canRedo()) {
					self.redo();
				}
			});
		}
	}
	
})(jQuery);