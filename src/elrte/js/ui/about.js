(function($) {
	elRTE.prototype.ui.prototype.buttons.about = function(rte, name)  {
		
		this.constructor.prototype.constructor.call(this, rte, name);
		this.active  = true;
		this.command = function() {
			var opts, d, txt;
			
			opts = {
				rtl : rte.rtl,
				submit : function(e, d) {  d.close(); },
				dialog : {
					width : 560,
					title : this.rte.i18n('About this software'),
					buttons     : {
						Ok : function() { $(this).dialog('destroy'); }
					}
				}
			}

			txt = '<div class="elrte-logo"></div><h3>'+this.rte.i18n('About elRTE')+'</h3><br clear="all"/>'
				+'<div class="elrte-ver">'+this.rte.i18n('Version')+': '+this.rte.version+' ('+this.rte.build+')</div>' 
				+'<div class="elrte-ver">jQuery: '+$('<div/>').jquery+'</div>' 
				+'<div class="elrte-ver">jQueryUI: '+$.ui.version+'</div>' 
				+'<div class="elrte-ver">'+this.rte.i18n('Licence')+': BSD Licence</div>'
				+'<p>'
				+this.rte.i18n('elRTE is an open-source JavaScript based WYSIWYG HTML-editor.')+'<br/>'
				+this.rte.i18n('Main goal of the editor - simplify work with text and formating (HTML) on sites, blogs, forums and other online services.')+'<br/>'
				+this.rte.i18n('You can use it in any commercial or non-commercial projects.')
				+'</p>'
				+'<h4>'+this.rte.i18n('Authors')+'</h4>'
				+'<table class="elrte-authors">'
				+'<tr><td>Dmitry (dio) Levashov &lt;dio@std42.ru&gt;</td><td>'+this.rte.i18n('Chief developer')+'</td></tr>'
				+'<tr><td>Troex Nevelin &lt;troex@fury.scancode.ru&gt;</td><td>'+this.rte.i18n('Developer, tech support')+'</td></tr>'
				+'<tr><td>Valentin Razumnyh &lt;content@std42.ru&gt;</td><td>'+this.rte.i18n('Interface designer')+'</td></tr>'
				+'<tr><td>Evgeny eSabbath &lt;sabbath.codemg@gmail.com&gt;</td><td>'+this.rte.i18n('Developer')+'</td></tr>'
				+'<tr><td>Andrzej Borowicz &lt;eltre@borowicz.info&gt;</td><td>'+this.rte.i18n('Polish localization')+'</td></tr>'
				+'<tr><td>Artem Vasiliev</td><td>'+this.rte.i18n('Ukranian localization')+'</td></tr>'
				+'<tr><td>Francois Mazerolle &lt;fmaz008@gmail.com&gt;</td><td>'+this.rte.i18n('French localization')+'</td></tr>'
				+'<tr><td>Kurt Aerts</td><td>'+this.rte.i18n('Dutch localization')+'</td></tr>'
				+'<tr><td>Michal Marek &lt;fmich.marek@gmail.com&gt;</td><td>'+this.rte.i18n('Czech localization')+'</td></tr>'
				+'<tr><td>Ricardo Obregón &lt;robregonm@gmail.com&gt;</td><td>'+this.rte.i18n('Spanish localization')+'</td></tr>'
				+'<tr><td>Saleh Souzanchi &lt;saleh.souzanchi@gmail.com&gt;</td><td>'+this.rte.i18n('Persian (farsi) localization')+'</td></tr>'
				+'<tr><td>Tawfek Daghistani &lt;tawfekov@gmail.com&gt;</td><td>'+this.rte.i18n('Arabic localization')+', '+this.rte.i18n('RTL support')+'</td></tr>'
				+'<tr><td>Tad &lt;tad0616@gmail.com&gt;</td><td>'+this.rte.i18n('Traditional Chinese localization')+'</td></tr>'
				+'<tr><td>Tomoaki Yoshida &lt;info@yoshida-studio.jp&gt;</td><td>'+this.rte.i18n('Japanese localization')+'</td></tr>'
				+'<tr><td>Uldis Plotiņš &lt;uldis.plotins@gmail.com&gt;</td><td>'+this.rte.i18n('Latvian localization')+'</td></tr>'
				+'<tr><td>Vasiliy Razumnyh &lt;rvn@std42.ru&gt;</td><td>'+this.rte.i18n('German localization')+'</td></tr>'
				+'<tr><td>Viktor Tamas &lt;tamas.viktor@totalstudio.hu&gt;</td><td>'+this.rte.i18n('Hungarian localization')+'</td></tr>'
				+'<tr><td>Ugo Punzolo, &lt;sadraczerouno@gmail.com&gt;</td><td>'+this.rte.i18n('Italian localization')+'</td></tr>'
				+'</table>'
				+'<div class="elrte-copy">Copyright &copy; 2009-2010, <a href="http://www.std42.ru">Studio 42 LTD</a></div>'
				+'<div class="elrte-copy">'+this.rte.i18n('For more information about this software visit the')+' <a href="http://elrte.org">'+this.rte.i18n('elRTE website')+'.</a></div>'
				+'<div class="elrte-copy">Twitter: <a href="http://twitter.com/elrte_elfinder">elrte_elfinder</a></div>';
			
			d = new elDialogForm(opts);
			d.append(txt);
			d.open();
		}
		
		this.update = function() {
			this.domElem.removeClass('disabled');
		}
		
	}
	
})(jQuery);
