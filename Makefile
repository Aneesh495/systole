.PHONY: all build test test-elm test-c test-python bench verify-dashes clean serve verify-all

all: verify-all build

build:
	@mkdir -p web
	elm make src/Main.elm --optimize --output=web/elm.js

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

bench:
	@echo "Running C fastpath test suite..."
	$(MAKE) -C c_fastpath test
	@echo "\nRunning Python DSP throughput benchmark..."
	python3 tools/benchmark_dsp.py 1000000

verify-dashes:
	bash scripts/verify_no_em_dashes.sh

verify-all: test bench
	@echo "\nALL SYSTOLE CONTINUOUS INTEGRATION VERIFICATIONS PASSED WITH ZERO ERRORS."

serve: build
	@echo "Serving Systole ICU Clinical Telemetry Workstation at http://localhost:8080"
	python3 -m http.server 8080 --directory web

clean:
	rm -rf elm-stuff web/elm.js c_fastpath/*.o c_fastpath/c_test_runner
