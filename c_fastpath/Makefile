CC ?= gcc
CFLAGS ?= -O3 -Wall -Wextra -std=c11 -pedantic
LDFLAGS ?= -lm

TARGET = c_test_runner
OBJS = systole_dsp.o c_test_runner.o

.PHONY: all clean test

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET) $(LDFLAGS)

%.o: %.c systole_dsp.h
	$(CC) $(CFLAGS) -c $< -o $@

test: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(OBJS) $(TARGET)
