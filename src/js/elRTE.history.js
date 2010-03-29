(function($) {
	/**
	 * @class elRTE history manager
	 */
	elRTE.prototype.history = function(rte) {

		var load      = false, /* flag, true if rte is loaded */
			size      = rte.options.historySize, /* max allowed history size */
			storage   = {}, /* store documents states */
			listeners = []; /* callbacks for history size changes */
		
		/**
		 * Save state of active document in history
		 *
		 * @param  Object   active elRTE document
		 * @param  Boolean  flag, if true previous state not propagate in history
		 */
		function save(d, np) {
			var s  = storage[d.id],
				bm = rte.selection.getBookmark(),
				ps = storage[d.id].pre.length,
				ns = storage[d.id].nxt.length;

			/* move current state to prev states and check prev size */
			if (s.cur.html && (!np || s.pre.length == 0)) {
				s.pre.unshift(s.cur);
				if (s.pre.length > size) {
					s.pre.pop();
				}
			}
			/* clear next states */
			s.nxt = [];
			/* store current state */
			s.cur = {
				html : $(d.document.body).html(),
				bm   : [bm[0].id, bm[1].id]
			}
			rte.selection.moveToBookmark(bm);
			if (ps != s.pre.length || ns != s.nxt.length) {
				trigger();
			}
		}
		
		/**
		 * Set special flags on active document
		 *
		 * @param Boolean  flag, means prevoius action was typing symbols
		 * @param Boolean  flag, means prevoius action was deleting 
		 */
		function flags(t, d) {
			rte.active.document.elrteTyping = t;
			rte.active.document.elrteDel = d;
		}

		/**
		 * Send notification to listeners
		 *
		 */
		function trigger() {
			for (var i=0; i < listeners.length; i++) {
				var e = $.Event('historyChange');
				e.data = {
					undo : storage[rte.active.id].pre.length>0,
					redo : storage[rte.active.id].nxt.length>0
				}
				listeners[i](e);
			};
		}

		/* If history allowed subscribe to events */
		if (rte.options.historySize>0) {
			
			rte.bind('open', function(e) {
				/* create storage for document */
				storage[e.target.id] = {
					cur : {},
					pre : [],
					nxt : []
				}
			}).bind('close', function(e) {
				/* remove document storage */
				if (storage[e.target.id]) {
					delete storage[e.target.id];
				}
			}).bind('load', function() {
				/* we ready */
				load = true;
			}).bind('focus', function(e) {
				/* save cuurent document state if not saved prevoiusly */
				load && !storage[e.target.id].cur.html && save(e.target);
			}).bind('blur source', function() {
				flags(false, false);
			}).bind('change', function(e) {
				/* save if allowed */
				load && !e.data.noHistory && save(e.target);
				flags(false, false);
			}).bind('keyup', function(e) {
				/* minor magic for saving whole sequence of typed/removed symbols as one state */
				var t = e.currentTarget;

				if (rte.utils.isSymbolKey(e.keyCode)) {
					save(rte.active, t.elrteTyping);
					flags(true, false);
				} else if (rte.utils.isDelKey(e.keyCode)) {
					save(rte.active, t.elrteDel);
					flags(false, true);
				} 
			}).bind('update', function(e) {
				/* yet another part of minor magic */
				var t = e.originalEvent ? e.originalEvent.type : false;
				
				if (t == 'mouseup' || t == 'keyup') {
					flags(false, false);
				}
			});
		}

		/**
		 * Add callback to listeners list
		 *
		 * @param Function
		 */
		this.bind = function(f) {
			listeners.push(f);
		}
		
		/**
		 * Return true in undo can be done for current documnet
		 *
		 * @return  Boolean
		 */
		this.canUndo = function() {
			return load && rte.active.id ? storage[rte.active.id].pre.length>0 : false;
		}
		
		/**
		 * Return true in redo can be done for current documnet
		 *
		 * @return  Boolean
		 */
		this.canRedo = function() {
			return load && rte.active.id ? storage[rte.active.id].nxt.length>0 : false;
		}
		
		/**
		 * Restore current document to prevoius state
		 *
		 */
		this.undo = function() {
			if (load) {
				var doc = rte.active||null, 
					s = doc && storage[doc.id] ? storage[doc.id] : false;

				if (s && s.pre.length) {
					s.nxt.unshift(s.cur);
					s.cur = s.pre.shift();
					$(doc.document.body).html(s.cur.html);
					rte.selection.moveToBookmark(s.cur.bm);
					s.nxt.length > size && s.nxt.pop();
					rte.trigger('change', {noHistory : true});
					trigger();
				}
			}

		}
		
		/**
		 * Restore current document to next undone state
		 *
		 */
		this.redo = function() {
			if (load) {
				var doc = rte.active||null, 
					s = doc && storage[doc.id] ? storage[doc.id] : false;

				if (s && s.nxt.length) {
					s.pre.unshift(s.cur);
					s.cur = s.nxt.shift();
					$(doc.document.body).html(s.cur.html);
					rte.selection.moveToBookmark(s.cur.bm);
					s.pre.length > size && s.pre.pop();
					rte.trigger('change', {noHistory : true});
					trigger();
				}
			}

		}

	}
	
})(jQuery);