(function($) {
	elRTE.prototype.ui.prototype.buttons.youtube = function(rte, name) {
		this.constructor.prototype.constructor.call(this, rte, name);

		this.youtube_url = $('<input type="text" />px').attr('name', 'youtube_url').attr('size', '40');
		this.youtube_w = $('<input type="text" />').attr('name', 'youtube_w').attr('size', '12').val("560");
		this.youtube_h = $('<input type="text" />').attr('name', 'youtube_h').attr('size', '12').val("315");
		//antoinek: needs to be commented out to prevent the button to be active in fullscreen mode
		//this.active  = true;
		var self = this;

		this.command = function() {
			var opts, d;

			opts = {
				rtl : rte.rtl,
				submit : function(e, d) { e.stopPropagation(); e.preventDefault(); d.close(); self.set($("input[name=youtube_url]").val(), $("input[name=youtube_w]").val(),$("input[name=youtube_h]").val()); },
				dialog : {
					width : 460,
					title : this.rte.i18n('Insert YouTube video')
				}
			}

			this.rte.selection.saveIERange();
			d = new elDialogForm(opts);
			d.append([this.rte.i18n('Youtube URL'),this.youtube_url], null, true)
			d.append([this.rte.i18n('Width'),$('<span />').append(this.youtube_w).append(' px')], null, true)
			d.append([this.rte.i18n('Height'),$('<span />').append(this.youtube_h).append(' px')], null, true)
			d.open();
			this.rte.ui.update(true);
		}

		this.update = function() {
			this.domElem.removeClass('disabled active');
		}

		this.set = function(url, w, h) {
			var youtubeID = (url.match(/youtu\.be\/([^&\?]+)/) || url.match(/youtube.com\/watch\?(?:[^&]+&)*v=([^&\?]+)/) || [])[1];
			if (youtubeID) {
				var toinsert = '<iframe width="'+w+'" height="'+h+'" src="http://www.youtube.com/embed/'+youtubeID+'?wmode=transparent" frameborder="0" allowfullscreen="true"> </iframe>';
				var id = 'youtube-'+Math.random().toString().substring(2);
				this.rte.filter.scripts[id] = toinsert;
				var img = '<img id="'+id+'" src="'+this.rte.filter.url+'pixel.gif" class="elrte-protected elrte-iframe" style="width:'+w+'; height:'+h+'">';

				this.rte.history.add();
				this.rte.selection.insertHtml(img);
			}
		}
	}
})(jQuery);
elRTE.prototype.options.buttons.youtube = 'Insert Youtube video';
