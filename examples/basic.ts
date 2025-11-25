import { Monitor } from '../src/Monitor';

// Example 1: Basic usage with classname
console.log('=== Example 1: Basic Usage with Classname ===');
const monitor = new Monitor('MyClass');

monitor.debug('This is a debug message');
monitor.info('This is an info message');
monitor.warn('This is a warning message');
monitor.error('This is an error message');

// Example 2: Usage without classname
console.log('\n=== Example 2: Usage without Classname ===');
const simpleMonitor = new Monitor();

simpleMonitor.info('Simple info message');
simpleMonitor.warn('Simple warning message');
simpleMonitor.error('Simple error message');

// Example 3: File logging
console.log('\n=== Example 3: File Logging ===');
const fileMonitor = new Monitor('FileLogger', {
  enableFileLogging: true,
  logFilePath: './logs/example.log',
});

fileMonitor.info('This will be logged to both console and file');
fileMonitor.warn('This warning is also saved to the log file');
fileMonitor.error('Errors are logged too');

// Example 4: Log level filtering
console.log('\n=== Example 4: Log Level Filtering (warn and above) ===');
const filteredMonitor = new Monitor('Filtered', {
  logLevel: 'warn',
});

filteredMonitor.debug('This debug message will not appear');
filteredMonitor.info('This info message will not appear');
filteredMonitor.warn('This warning will appear');
filteredMonitor.error('This error will appear');

// Example 5: Long classname trimming
console.log('\n=== Example 5: Long Classname Trimming ===');
const longNameMonitor = new Monitor('VeryLongClassNameThatExceedsTheDefaultLimit', {
  maxClassNameLength: 20,
});

longNameMonitor.info('Notice how the classname is trimmed');

// Example 6: Custom max classname length
console.log('\n=== Example 6: Custom Max Classname Length ===');
const customTrimMonitor = new Monitor('ThisIsAVeryLongClassName', {
  maxClassNameLength: 10,
});

customTrimMonitor.info('Classname trimmed to 10 characters');

// Example 7: Console-only mode (no file logging)
console.log('\n=== Example 7: Console Only Mode ===');
const consoleOnlyMonitor = new Monitor('ConsoleOnly', {
  enableFileLogging: false,
});

consoleOnlyMonitor.info('This only goes to console');

// Example 8: File-only mode (no console output)
console.log('\n=== Example 8: File Only Mode ===');
const fileOnlyMonitor = new Monitor('FileOnly', {
  enableFileLogging: true,
  logFilePath: './logs/file-only.log',
  disableConsole: true,
});

fileOnlyMonitor.info('This only goes to file (check ./logs/file-only.log)');
fileOnlyMonitor.warn('Another file-only message');

// Example 9: Different log levels
console.log('\n=== Example 9: Different Log Levels ===');
const levelMonitor = new Monitor('Levels');

levelMonitor.debug('Debug level - most verbose');
levelMonitor.info('Info level - general information');
levelMonitor.warn('Warn level - warnings');
levelMonitor.error('Error level - errors only');

// Example 10: Multiple instances with different classnames
console.log('\n=== Example 10: Multiple Instances ===');
const monitor1 = new Monitor('ServiceA');
const monitor2 = new Monitor('ServiceB');
const monitor3 = new Monitor('ServiceC');

monitor1.info('Message from Service A');
monitor2.warn('Warning from Service B');
monitor3.error('Error from Service C');

console.log('\n=== Examples Complete ===');

