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
		/**
		 * smth like class constant - user typed symbol
		 **/
		this._input = 1;
		/**
		 * smth like class constant - user pressed delete/backspace
		 **/
		this._del   = 2;

		var self    = this,
			storage = {}, /* history storage */
			active;       /* active document history */
		
		/**
		 * change active storage input state
		 *
		 * @param  Number  new active storage input state
		 **/
		function setInput(i) {
			if (active) {
				var ch = i != active.input;
				active.input = i;
				ch && self.rte.trigger('historyChange');
			}
		}
		
		/**
		 * Add new undo level if required and [change active storage input state]
		 *
		 * @param  Number  new active storage input state
		 **/
		this.add = function(i) {
			var c = self.rte.getContent(null, true), bm;
			
			if (typeof(i) == 'number') {
				active.input = i;
			}
			
			if (active && (!active.levels.length || active.levels[active.index].origin != c)) {
				self.rte.time('add')
				
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
					html   : self.rte.getContent(null, true),
					bm     : [bm[0].id, bm[1].id]
				});
				active.index = active.levels.length-1;
				rte.selection.moveToBookmark(bm);
				self.rte.timeEnd('add')
				self.rte.log(active.levels.length+' '+active.index)
				self.rte.trigger('historyChange');
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
		 *
		 * @return  Boolean
		 **/
		this.undo = function() {
			if (this.canUndo()) {
				self.rte.log('undo')
				if (active.input) {
					active.levels.push({});
					active.index++;
				}
				active.index--;
				active.input = 0;
				self.rte.setContent(active.levels[active.index].html, null, true);
				self.rte.selection.moveToBookmark(active.levels[active.index].bm);
				self.rte.trigger('change').trigger('historyChange');
				return true;
			}
		}
		
		/**
		 * Produce redo action
		 *
		 * @return  Boolean
		 **/
		this.redo = function() {
			if (this.canRedo()) {
				self.rte.log('redo')
				active.index++;
				active.input = 0;
				self.rte.setContent(active.levels[active.index].html, null, true);
				self.rte.selection.moveToBookmark(active.levels[active.index].bm);
				self.rte.trigger('change').trigger('historyChange');
				return true;
			}
			
		}
		
		if (this.size>0) {
			rte.bind('open', function(e) {
				/* create storage for new document */
				storage[e.elrteDocument.id] = { 
					levels : [], 
					index  : 0, 
					input  : 0 
				};
			}).bind('close', function(e) {
				/* remove storage for document */
				delete storage[e.elrteDocument.id];
			})
			.bind('focus', function() {
				/* set active storage and add initial level if not exists */
				active = storage[self.rte.active.id];
				!active.levels.length && self.add();
			}).bind('blur source', function() { 
				/* change active storage */
				active = null; 
			})
			.bind('exec change', function(e) { 
				/* on press delete keys - update active input state, otherwise - add new level */
				e.isDel ? setInput(self._del) : self.add(0);
			}).bind('input', function(e) {
				/* if symbol key pressed - update active input state */
				setInput(self._input);
			}).bind('keydown', function(e) {
				if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
					e.stopPropagation();
					e.preventDefault();
					e.shiftKey ? self.redo() : self.undo();
					return;
				}
				if (active) {
					if (self.rte.utils.isKeyDel(e.keyCode) && active.input == self._input) {
						self.add(self._del);  /* change from typing to delete */
					} else if (self.rte.utils.isKeyChar(e.keyCode) && active.input == self._del) {
						self.add(self._input); /* change from delete to typing */
					} else if (e.keyCode == 13 && active.input) {
						self.add(); /* enter after typing/delete */
					}
				}
			});
		}
	}
	
})(jQuery);