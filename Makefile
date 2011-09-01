DEVELINCFILTER = "s/^(\s*__import\s*\\(\s*'([^']+)'.*|.*)$$/\\2/"
JSFILES = $(shell \
	cat devel_includes.js |\
	sed -E $(DEVELINCFILTER) )

all: deploy/FastJS.js deploy/FastJS.min.js

srcfiles:
	@echo "JS files: " $(JSFILES)

clean:
	rm -f deploy/FastJS.js
	rm -f deploy/FastJS.min.js

deploy/FastJS.js: devel_includes.js $(JSFILES)
	mkdir -p deploy
	cat $^ > $@

deploy/FastJS.min.js: deploy/FastJS.js
	yui-compressor --type js deploy/FastJS.js > $@