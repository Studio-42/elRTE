(function($) {
	
	elRTE.prototype.ui.prototype.buttons.flash = function(rte, name) {
		this.constructor.prototype.constructor.call(this, rte, name);
		var self = this;
		this.swf = null;
		this.placeholder = null;
		this.src = {
			url    : $('<input type="text" name="url" />').css('width', '99%'),
			width  : $('<input type="text" />').attr('size', 5).css('text-align', 'right'),
			height : $('<input type="text" />').attr('size', 5).css('text-align', 'right'),
			align  : $('<select />').css('width', '100%')
						.append($('<option />').val('').text(this.rte.i18n('Not set', 'dialogs')))
						.append($('<option />').val('left'       ).text(this.rte.i18n('Left')))
						.append($('<option />').val('right'      ).text(this.rte.i18n('Right')))
						.append($('<option />').val('top'        ).text(this.rte.i18n('Top')))
						.append($('<option />').val('text-top'   ).text(this.rte.i18n('Text top')))
						.append($('<option />').val('middle'     ).text(this.rte.i18n('middle')))
						.append($('<option />').val('baseline'   ).text(this.rte.i18n('Baseline')))
						.append($('<option />').val('bottom'     ).text(this.rte.i18n('Bottom')))
						.append($('<option />').val('text-bottom').text(this.rte.i18n('Text bottom'))),
			margin : $('<div />')
		}
		
		this.command = function() {

			var n = this.rte.selection.getEnd(), opts, url='', w='', h='', f, a, d;
			this.src.margin.elPaddingInput({ type : 'margin' });
			this.placeholder = null;
			this.swf = null;
			if ($(n).hasClass('elrte-swf-placeholder')) {
				this.placeholder = $(n);
				url = $(n).attr('rel');
				w = parseInt($(n).css('width'))||'';
				h = parseInt($(n).css('height'))||'';
				f = $(n).css('float');
				a = $(n).css('vertical-align');
				this.src.margin.val(n);
			} 
			this.src.url.val(url);
			this.src.width.val(w);
			this.src.height.val(h);
			this.src.align.val(f||a);

			

			var opts = {
				submit : function(e, d) { e.stopPropagation(); e.preventDefault(); self.set(); d.close(); },
				dialog : {
					width    : 550,
					position : 'top',
					title    : this.rte.i18n('Flash')
				}
			}
			var d = new elDialogForm(opts);
			
			if (this.rte.options.fmAllow && this.rte.options.fmOpen) {
				var src = $('<span />').append(this.src.url.css('width', '85%'))
						.append(
							$('<span />').addClass('ui-state-default ui-corner-all')
								.css({'float' : 'right', 'margin-right' : '3px'})
								.attr('title', self.rte.i18n('Open file manger'))
								.append($('<span />').addClass('ui-icon ui-icon-folder-open'))
									.click( function() {
										self.rte.options.fmOpen( function(url) { self.src.url.val(url).change(); } );
									})
									.hover(function() {$(this).addClass('ui-state-hover')}, function() { $(this).removeClass('ui-state-hover')})
							);
			} else {
				var src = this.src.url;
			}
			
			d.append([this.rte.i18n('URL'), src], null, true);
			d.append([this.rte.i18n('Size'), $('<span />').append(this.src.width).append(' x ').append(this.src.height).append(' px')], null, true)
			d.append([this.rte.i18n('Alignment'), this.src.align], null, true);
			d.append([this.rte.i18n('Margins'), this.src.margin], null, true);
			
			
			
			d.open();
			setTimeout( function() {self.src.url.focus()}, 100)
			
			
			var fs = $('<fieldset />').append($('<legend />').text(this.rte.i18n('Preview')))
			d.append(fs, 'main');
			var frame = document.createElement('iframe');
			$(frame).attr('src', '#').addClass('el-rte-preview').appendTo(fs);
			html = this.rte.options.doctype+'<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body style="padding:0;margin:0;font-size:9px"> Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin</body></html>';
			frame.contentWindow.document.open();
			frame.contentWindow.document.write(html);
			frame.contentWindow.document.close();
			this.frame = frame.contentWindow.document;
			this.preview = $(frame.contentWindow.document.body);
			 				 

			this.src.width.change(function() {
				if (self.swf) {
					var w = parseInt($(this).val())||'';
					$(this).val(w);
					self.swf.css('width', w);
					self.swf.children('embed').css('width', w);
				} else {
					$(this).val('');
				}
			});

			this.src.height.change(function() {
				if (self.swf) {
					var h = parseInt($(this).val())||'';
					$(this).val(h);
					self.swf.css('height', w);
					self.swf.children('embed').css('height', h);
				} else {
					$(this).val('');
				}
			});
			
			this.src.align.change(function() {
				var v = $(this).val(), f = v=='left' || v=='right';
				if (self.swf) {
					self.swf.css({
						'float' : f ? v : '',
						'vertical-align' : f ? '' : v
					});
				} else {
					$(this).val('');
				}
			});
			
			this.src.margin.change(function() {
				if (self.swf) {
					var m = self.src.margin.val();
					if (m.css) {
						self.swf.css('margin', m.css);
					} else {
						self.swf.css('margin-top', m.top);
						self.swf.css('margin-right', m.right);
						self.swf.css('margin-bottom', m.bottom);
						self.swf.css('margin-left', m.left);						
					}
				}

				
			});
			
			this.src.url.change(function() {
				var url = self.rte.utils.absoluteURL($(this).val());
				if (url) {
					var swf = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" style="border:1px solid #111"><param name="quality" value="high" /><param name="movie" value="'+url+'" /><embed pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="'+url+'" type="application/x-shockwave-flash"></embed></object>';
					self.preview.prepend(swf)
					self.swf = self.preview.children('object').eq(0)
				} else if (self.swf){
					self.swf.remove();
					self.swf = null;
				}
				self.src.width.trigger('change');
				self.src.height.trigger('change');
				self.src.align.trigger('change');

			}).trigger('change');
		}
		
		this.set = function() {
			self.swf = null
			var url = this.rte.utils.absoluteURL(this.src.url.val()),
				w = parseInt(this.src.width.val()) || 'auto',
				h = parseInt(this.src.height.val()) || 'auto'
				a = this.src.align.val(),
				f = a == 'left' || a == 'right' ? a : '';

			if (url) {
				var m = this.src.margin.val(),
					css = {
						width : w,
						height : h,
						'float' : f,
						'vertical-align' : f ? '' : a 
					};
				if (m.css) {
					css['margin'] = m.css;
				} else {
					css['margin-top'] = m.top;
					css['margin-right'] = m.right;
					css['margin-bottom'] = m.bottom;
					css['margin-left'] = m.left;
				}

				if (self.placeholder) {
					self.placeholder.css(css).attr('rel', url);
				} else {
					this.placeholder = $(this.rte.dom.create('img'))
						.attr('src', this.rte.filter.swfSrc)
						.attr('rel', url)
						.css(css)
						.addClass('elrte-swf-placeholder');
					this.rte.selection.insertNode(this.placeholder.get(0));
				}

			} else {
				if (self.placeholder) {
					self.placeholder.remove();
				}
			}
			
			
		}
		

		
		this.update = function() {
			this.domElem.removeClass('disabled');
			var n = this.rte.selection.getNode();
			this.domElem.toggleClass('active', n.nodeName == 'IMG' && $(n).hasClass('elrte-swf-placeholder'))
			
		}
		
		
	}
})(jQuery);