(function($) {
	var _matchEmbedUrl = function(url) {
		var youtubeID = (url.match(/youtu\.be\/([^&\?]+)/) || url.match(/youtube.com\/watch\?(?:[^&]+&)*v=([^&\?]+)/) || [])[1];
		if (youtubeID) {
			return '//www.youtube.com/embed/'+youtubeID+'?wmode=transparent';
		}

		var vimeoID = (url.match(/vimeo\.com\/([\w\-]+)/) || [])[1];
		if (vimeoID) {
			return '//player.vimeo.com/video/'+vimeoID+'?wmode=transparent';
		}

		var rutubeId = (url.match(/rutube\.ru\/video\/([\w\-]+)/) || [])[1];
		if (rutubeId) {
			return '//rutube.ru/play/embed/'+rutubeId;
		}

		var instagramID = (url.match(/instagram\.com\/p\/([\w\-]+)/) || [])[1];
		if (instagramID) {
			return '//instagram.com/p/'+instagramID+'/embed/';
		}

		var vkMatch = url.match(/vk\.com\/video_ext\.php\?oid=(\w+)&id=(\w+)&hash=(\w+)/);
		if (vkMatch) {
			return '//vk.com/video_ext.php?oid='+vkMatch[1]+'&id='+vkMatch[2]+'&hash='+vkMatch[3]+'&hd=2';
		}

		return null;
	};

	elRTE.prototype.ui.prototype.buttons.embedmedia = function(rte, name) {
		this.constructor.prototype.constructor.call(this, rte, name);

		this.embedmedia_url = $('<input type="text" />').attr('name', 'embedmedia_url').attr('size', '40');
		this.embedmedia_w = $('<input type="text" />').attr('name', 'embedmedia_w').attr('size', '12').val("560");
		this.embedmedia_h = $('<input type="text" />').attr('name', 'embedmedia_h').attr('size', '12').val("315");
		//antoinek: needs to be commented out to prevent the button to be active in fullscreen mode
		//this.active  = true;
		var self = this;

		this.command = function() {
			var opts, d;

			opts = {
				rtl : rte.rtl,
				submit : function(e, d) {
					e.stopPropagation();
					e.preventDefault();
					self.set(
						d,
						self.embedmedia_url.val(),
						self.embedmedia_w.val(),
						self.embedmedia_h.val()
					);
				},
				dialog : {
					width : 460,
					title : this.rte.i18n('Insert Embedded Media (YouTube, Vimeo, Rutube, Instagram, VK)')
				}
			};

			this.rte.selection.saveIERange();
			d = new elDialogForm(opts);
			d.append([this.rte.i18n('Media URL/code'), this.embedmedia_url.val('')], null, true);
			d.append([this.rte.i18n('Width'), $('<span />').append(this.embedmedia_w).append(' px')], null, true);
			d.append([this.rte.i18n('Height'), $('<span />').append(this.embedmedia_h).append(' px')], null, true);
			d.open();
			this.rte.ui.update(true);
		};

		this.update = function() {
			this.domElem.removeClass('disabled active');
		};

		this.set = function(d, url, w, h) {
			var embedHref = _matchEmbedUrl(url)
			if (embedHref) {
				var toinsert = '<iframe width="'+w+'" height="'+h+'" src="'+embedHref+'" frameborder="0" allowfullscreen="true"> </iframe>';
				var id = 'embedmedia-'+Math.random().toString().substring(2);
				this.rte.filter.scripts[id] = toinsert;
				var img = '<img id="'+id+'" src="'+this.rte.filter.url+'pixel.gif" class="elrte-protected elrte-iframe" style="width:'+w+'; height:'+h+'">';

				this.rte.history.add();
				this.rte.selection.insertHtml(img);
				d.close();
			} else {
				d.showError(this.rte.i18n('Unknown or incorrect media source URL'));
			}
		};
	}
})(jQuery);
elRTE.prototype.options.buttons.embedmedia = 'Insert Embedded Media';
