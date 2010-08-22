(function($) {
	elRTE.prototype.ui.prototype.buttons.about = function(rte, name)  {
		
		this.constructor.prototype.constructor.call(this, rte, name);
		this.active  = true;
		this.command = function() {
			var opts, d, txt;
			
			opts = {
				submit : function(e, d) {  d.close(); },
				dialog : {
					width : 510,
					title : this.rte.i18n('About this software'),
					buttons     : {
						Ok : function() { $(this).dialog('destroy'); }
					}
				}
			}
			
			txt = '<div class="elrte-logo"></div><h3>'+this.rte.i18n('About elRTE')+'</h3><br clear="all"/>'
				+'<div class="elrte-ver">'+this.rte.i18n('Version')+': '+this.rte.version+' ('+this.rte.build+')</div>' 
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
				+'<tr><td>Ricardo Obregón &lt;robregonm@gmail.com&gt;</td><td>'+this.rte.i18n('Spanish localization')+'</td></tr>'
				+'<tr><td>Tomoaki Yoshida &lt;info@yoshida-studio.jp&gt;</td><td>'+this.rte.i18n('Japanese localization')+'</td></tr>'
				+'<tr><td>Uldis Plotiņš &lt;uldis.plotins@gmail.com&gt;</td><td>'+this.rte.i18n('Latvian localization')+'</td></tr>'
				+'<tr><td>Vasiliy Razumnyh &lt;rvn@std42.ru&gt;</td><td>'+this.rte.i18n('German localization')+'</td></tr>'
				+'<tr><td>Артем Васильев</td><td>'+this.rte.i18n('Ukranian localization')+'</td></tr>'
				+'</table>'
				+'<div class="elrte-copy">Copyright &copy; 2009-2010, <a href="http://www.std42.ru">Studio 42 LTD</a></div>'
				+'<div class="elrte-copy">'+this.rte.i18n('For more information about this software visit the')+' <a href="http://www.elrte.org">'+this.rte.i18n('elRTE website')+'.</a></div>';
			
			d = new elDialogForm(opts);
			d.append(txt);
			d.open();
		}
		
		this.update = function() {
			this.domElem.removeClass('disabled');
		}
		
	}
	
})(jQuery);
