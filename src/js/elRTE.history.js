(function($) {
	
	elRTE.prototype.history = function(rte) {
		var self = this,
			storage = {},
			size = parseInt(rte.options.historySize)||0,
			active,
			keyupLock = false;
		
		function add(i) {
			var d = self.rte.active, 
				l = active.levels[active.index],
				level, bm, html, origin, 
				add = i == 0 || (active.input != 0 && active.input != i);
			
			
			if (!active.levels.length || (add && l.origin != d.get())) {
				rte.log('add')
				bm = rte.selection.bookmark();
				html = d.get();
				rte.selection.toBookmark(bm)
				
				level = {
					bm : bm,
					html : html,
					origin : d.get()
				}
				active.levels.push(level);
				active.index = active.levels.length-1;
				
				rte.debug('history.add', active.index)
				
			}
			active.input = i
		}
			
		this.rte = rte;
		
		this.canUndo = function() {
			return false;
		}
		
		this.canRedo = function() {
			return false;
		}
		
		this.undo = function() {
			
		}
		
		this.redo = function() {
			
		}
		
		function input(e) {
			var c = e ? e.keyCode : void(0);
			// rte.log(c)
			if (c !== void(0)) {
				return rte.utils.isKeyChar(c) ? rte.CHANGE_KBD : rte.utils.isKeyDel(c) ? rte.CHANGE_DEL : rte.CHANGE_CMD;
			}
			return rte.CHANGE_CMD;
		}
		
		if (size>0) {
			
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
				delete storage[e.data.id];
			})
			.bind('wysiwyg', function(e) {
				/* set active storage and add initial level if not exists */
				active = storage[e.data.id];
				!active.levels.length && add(0);
			})
			.bind('source', function() { 
				/* disable active storage for source mode */
				active = null; 
			})
			.bind('change', function(e) {
				rte.log('change add '+e.data.type)
				keyupLock = true;
				// add(input(e.data.keyCode))
			})
			.bind('keyup', function(e) {
				if (!keyupLock) {
					if (rte.utils.isKeyChar(e.keyCode)) {
						rte.log('keyup add 1')
					} else if (rte.utils.isKeyDel(e.keyCode)) {
						rte.log('keyup add 2')
					}
				}
				keyupLock = false;
			})
			.bind('changePos', function(e) {
				rte.log('changePos add 3')

			})
		}
		
	}
	
	
	/**
	 * @class elRTE history
	 * rise event historyChange
	 * @param elRTE editor instance
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 */
	elRTE.prototype._history = function(rte) {
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
			return self.rte.utils.isKeyChar(c) && c != 13 ? 1 : (self.rte.utils.isKeyDel(c) ? -1 : 0);
		}
		
		/**
		 * Add new undo level if required and change active storage input state
		 * Trigger "historyChange" event in both cases
		 *
		 * @param  Number  new active storage input state
		 * @param  Boolean  force add new level
		 * @param  Boolean  replace last level
		 **/
		this.add = function(i, f, r) {
			var d = this.rte.active, c, bm, t = false, l;
			// this.rte.debug('history.add', 'called')
			if (active && d) {
				t = active.input!=i;
				active.input = i;
				c = d.get('wysiwyg');
				if (!active.levels.length || f || active.levels[active.index].origin != c) {
					if (active.index < active.levels.length-1) {
						active.levels.splice(active.index+1, active.levels.length-active.index-1);
					}
					if (active.index >= self.size) {
						active.levels.shift();
						active.index--;
					}

					bm = this.rte.selection.bookmark();
					
					l = {
						origin : c,
						html   : d.get('wysiwyg'),
						bm     : [bm[0].id, bm[1].id]
					}
					this.rte.selection.toBookmark(bm);

					if (r && active.levels.length) {
						active.levels[active.levels.length-1] = l;
					} else {
						active.levels.push(l);
					}
					
					active.index = active.levels.length-1;
					this.rte.debug('history.add', 'level: '+active.levels.length);
					this.rte.log(active)
					t = true;
				}
				t && this.rte.trigger('historyChange');
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
				active.input && this.add(0, true);
				active.index--;
				active.input = 0;
				this.rte.active.set(active.levels[active.index].html);
				self.rte.selection.toBookmark(active.levels[active.index].bm[0], active.levels[active.index].bm[1]);
				this.rte.trigger('historyChange').trigger('change');
				this.rte.debug('history.undo', (active.index+1));
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
				this.rte.active.set(active.levels[active.index].html);
				self.rte.selection.toBookmark(active.levels[active.index].bm);
				this.rte.trigger('historyChange').trigger('change');
				this.rte.debug('history', 'redo '+(active.index));
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
				delete storage[e.data.id];
			})
			.bind('wysiwyg', function() {
				/* set active storage and add initial level if not exists */
				active = storage[self.rte.active.id];
				!active.levels.length && self.add(0);
			})
			.bind('source', function() { 
				/* disable active storage for source mode */
				active = null; 
			})
			.bind('cut paste', function(e) {
				// save snapshot before changes
				self.add(0, true, active.input == 0);
			})
			.bind('keydown', function(e) {
				var i;
				flag = false
				// e.preventDefault()
				// e.stopPropagation()
				// save snapshot before changes
				if (!self.rte.utils.isKeyService(e.keyCode)) {
					i = self.inputType(e.keyCode);
					if (self.rte.change && i != -1 && !e.ctrlKey && !e.metaKey) {
						self.add(self.inputType(e.keyCode), true, active.input == 0);
					} else if (i != active.input) {
						self.add(e.ctrlKey||e.metaKey?0:i, active.levels.length==1||e.ctrlKey||e.metaKey, active.input==0);
					} else {
						active.input = self.inputType(e.keyCode);
					}
				}
			}, true)
			.bind('change', function(e) {
				if (!e.data.originalEvent || self.inputType(e.data.originalEvent.keyCode) == 0) {
					// save snapshot on dom changes
					self.add(0);
				}
			})
			// .shortcut((rte.macos ? 'meta' : 'ctrl')+'+z', 'Undo (Ctrl+Z)', function(e) {
			// 	self.canUndo() && self.undo();
			// })
			// .shortcut((rte.macos ? 'meta' : 'ctrl')+'+shift+z', 'Redo (Ctrl+Shift+Z)', function(e) {
			// 	self.canRedo() && self.redo();
			// });
		}
	}
	
})(jQuery);