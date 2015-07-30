SRC = index.js

default:
	@echo "No default task"

test:
	@node --harmony test

include node_modules/make-lint/index.mk
