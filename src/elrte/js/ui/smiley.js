/**
 * @class button - insert smiley (open dialog window)
 *
 * @param  elRTE  rte   объект-редактор
 * @param  String name  название кнопки
 *
 * @author:    eSabbath
 *
 **/
elRTE.prototype.ui.prototype.buttons.smiley = function(rte, name) {
	this.constructor.prototype.constructor.call(this, rte, name);
	var self = this;
        this.img = null,
		this.url = this.rte.filter.url+'smileys/';
		this.smileys = {
			'smile' : 'smile.gif',
			'wink' : 'wink.gif',
			'give_heart' : 'give_heart.gif',
			'give_rose' : 'give_rose.gif',
			'heart' : 'heart.gif',
			'acute' : 'acute.gif',
			'air_kiss' : 'air_kiss.gif',
			'angel' : 'angel.gif',
			'blum' : 'blum.gif',
			'blush' : 'blush.gif',
			'clapping' : 'clapping.gif',
			'crazy' : 'crazy.gif',
			'dance' : 'dance.gif',
			'dance4' : 'dance4.gif',
			'dash1' : 'dash1.gif',
			'diablo' : 'diablo.gif',
			'dirol' : 'dirol.gif',
			'drinks' : 'drinks.gif',
			'first_move' : 'first_move.gif',
			'focus' : 'focus.gif',
			'girl_hide' : 'girl_hide.gif',
			'girl_witch' : 'girl_witch.gif',
			'good' : 'good.gif',
			'help' : 'help.gif',
			'kiss2' : 'kiss2.gif',
			'kiss3' : 'kiss3.gif',
			'lol' : 'lol.gif',
			'mamba' : 'mamba.gif',
			'mosking' : 'mosking.gif',
			'music2' : 'music2.gif',
			'ok' : 'ok.gif',
			'paint3' : 'paint3.gif',
			'pardon' : 'pardon.gif',
			'preved' : 'preved.gif',
			'sad' : 'sad.gif',
			'scare' : 'scare.gif',
			'scratch_one-s_head' : 'scratch_one-s_head.gif',
			'secret' : 'secret.gif',
			'shok' : 'shok.gif',
			'spruce_up' : 'spruce_up.gif',
			'tender' : 'tender.gif',
			'unknw' : 'unknw.gif',
			'victory' : 'victory.gif',
			'wacko2' : 'wacko2.gif',
			'whistle3' : 'whistle3.gif',
			'yahoo' : 'yahoo.gif',
			'yes3' : 'yes3.gif',
			'bomb' : 'bomb.gif',
			'bye' : 'bye.gif'
			
		};


	this.command = function() {
		var self = this, url = this.url, d, opts, img;
		
		this.rte.browser.msie && this.rte.selection.saveIERange();

		opts = {
			dialog : {
				height  : 'auto',
				width   : 430,
				title   : this.rte.i18n('Smiley'),
				buttons : {}
			}
		}
		d = new elDialogForm(opts);

		$.each(this.smileys, function(name, img) {
			d.append($('<img src="'+url+img+'" title="'+name+'" id="'+name+'" class="elSmiley"/>').click(function() { self.set(this.id, d);	}));
		});

		d.open();

	}

	this.update = function() {
		this.domElem.removeClass('disabled');
		this.domElem.removeClass('active');
	}


	this.set = function(s, d) {
		this.rte.browser.msie && this.rte.selection.restoreIERange();
		if (this.smileys[s]) {
			this.img = $(this.rte.doc.createElement('img'));
			this.img.attr({
				src    : this.url + this.smileys[s],
				title  : s,
				alt    : s
			});
			this.rte.selection.insertNode(this.img.get(0));
			this.rte.ui.update();
		}
		d.close();
	}

}
