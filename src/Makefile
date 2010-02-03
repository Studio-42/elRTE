# build relese
# author: Troex Nevelin <troex@fury.scancode.ru>

Q=   @
CAT= cat
RM=  rm
CP=  cp
SRC= .
DST= ..
CSS=  ${DST}/css
JS=   ${DST}/js
I18N= ${DST}/js/i18n
IMG=  ${DST}/images

# used as ${COMPRESSOR} OUT IN
COMPRESSOR=    java -jar ../../../yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar \
					--charset utf8 -o

PHONY:     help
all:       elrte elrte-install
clean:     clean-elrte
install:   elrte-install
uninstall: ellib-uninstall elrte-uninstall
distclean: uninstall clean

help:
	@echo 'Makefile for release build automation'
	@echo ' Packages:'
	@echo '   elrte         - elRTE WYSIWYG html editor'
	@echo ''
	@echo ' MAKE targets:'
	@echo '   all           - build and install all packages'
	@echo '   help          - show this message'
	@echo '   install       - install all packages, will auto build'
	@echo '   uninstall     - remove all generated files from DST (${DST})'
	@echo '   clean         - remove generated files from SRC (${SRC})'
	@echo '   distclean     - preform uninstall and clean'
	@echo ''
	@echo ' Individual package targets are possible. To build single package replace PACKAGE'
	@echo ' with name from "Packages" section:'
	@echo '   PACKAGE'
	@echo '   PACKAGE-install'
	@echo '   PACKAGE-unstall'
	@echo '   clean-PACKAGE'


# define objects

# elLib
ellib_img_obj=		${SRC}/ellib/images/loading.gif
ellib_img_obj_dst=	${IMG}/loading.gif


# elRTE
elrte_css=        	elrte.full.css
elrte_css_obj=    	${SRC}/ellib/css/elcommon.css \
			${SRC}/ellib/css/elcolorpicker.css \
			${SRC}/ellib/css/eldialogform.css \
			${SRC}/ellib/css/elpaddinginput.css \
			${SRC}/ellib/css/elselect.css \
			${SRC}/elrte/css/elrte.css

elrte_js=         	elrte.full.js
elrte_js_min=     	elrte.min.js
elrte_js_obj=   	${SRC}/ellib/js/eli18n.js \
			${SRC}/ellib/js/eldialogform.js \
			${SRC}/ellib/js/jquery.elcolorpicker.js \
			${SRC}/ellib/js/jquery.elborderselect.js \
			${SRC}/ellib/js/jquery.elpaddinginput.js \
			${SRC}/ellib/js/jquery.elselect.js \
			${SRC}/elrte/js/elRTE.js \
			${SRC}/elrte/js/elRTE.*.js \
			${SRC}/elrte/js/ui/*.js


# elLib
ellib-install:
	${CP} ${ellib_img_obj} ${IMG}/

ellib-uninstall:
	${RM} -f ${ellib_img_obj_dst}


# elRTE
elrte: ${elrte_css} ${elrte_js}

elrte-install: elrte ellib-install
	${CP} ${elrte_css} ${SRC}/elrte/css/elrte-inner.css ${CSS}/
	${CP} ${elrte_js}  ${JS}/
	${CP} ${SRC}/elrte/js/i18n/elrte.??.js ${I18N}/
	${CP} ${SRC}/elrte/images/elrte-*      ${IMG}/

${elrte_css}:
	${CAT} ${elrte_css_obj} > $@

${elrte_js}:
	${CAT} ${elrte_js_obj} > $@

elrte-uninstall:
	${RM} -f ${CSS}/${elrte_css} ${CSS}/elrte-inner.css \
	         ${JS}/${elrte_js} ${JS}/${elrte_js_min} ${I18N}/elrte.??.js ${IMG}/elrte-* 

clean-elrte:
	${RM} -f ${elrte_css} ${elrte_js} ${elrte_js_min} 


# compressor
elrte-compress:
	${COMPRESSOR} ${elrte_js_min} ${elrte_js}

elrte-compress-install:
	${CP} ${SRC}/${elrte_js_min} ${JS}/


ifdef COMPRESSOR
elrte:                elrte-compress
elrte-install:        elrte-compress-install
endif

