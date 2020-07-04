.PHONY: all build test test-elm test-c test-python format clean verify-dashes

all: build test

build:
	@mkdir -p web
	elm make src/Main.elm --optimize --output=web/app.js

test: test-elm test-c test-python verify-dashes

test-elm:
	elm-test

test-c:
	@if [ -d c_fastpath ]; then \
		$(MAKE) -C c_fastpath test; \
	fi

test-python:
	@if [ -d tools ]; then \
		python3 -m unittest discover -s tools -p "test_*.py" -v; \
	fi

format:
	elm-format src/ tests/ --yes

verify-dashes:
	bash scripts/verify_no_em_dashes.sh

clean:
	rm -rf elm-stuff web/app.js c_fastpath/*.o c_fastpath/c_test_runner
