import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { Monitor } from '../src/Monitor';
import { existsSync, unlinkSync, rmdirSync } from 'fs';
import { join } from 'path';

describe('Monitor', () => {
  const testLogPath = './test-logs/monitor.test.log';

  beforeEach(() => {
    // Clean up test log file before each test
    if (existsSync(testLogPath)) {
      unlinkSync(testLogPath);
    }
    const testLogDir = './test-logs';
    if (existsSync(testLogDir)) {
      try {
        rmdirSync(testLogDir);
      } catch {
        // Directory might not be empty, ignore
      }
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (existsSync(testLogPath)) {
      unlinkSync(testLogPath);
    }
  });

  describe('Basic Functionality', () => {
    test('should create Monitor instance with classname', () => {
      const monitor = new Monitor('TestClass');
      expect(monitor).toBeInstanceOf(Monitor);
    });

    test('should create Monitor instance without classname', () => {
      const monitor = new Monitor();
      expect(monitor).toBeInstanceOf(Monitor);
    });

    test('all four log methods should exist', () => {
      const monitor = new Monitor('TestClass');
      expect(typeof monitor.debug).toBe('function');
      expect(typeof monitor.info).toBe('function');
      expect(typeof monitor.warn).toBe('function');
      expect(typeof monitor.error).toBe('function');
    });

    test('timestamp format should be HH:MM:SS', () => {
      const monitor = new Monitor('TestClass');
      const timestampRegex = /\d{2}:\d{2}:\d{2}/;
      
      // Capture console.log output
      const originalLog = console.log;
      let loggedMessage = '';
      console.log = (message: string) => {
        loggedMessage = message;
      };

      monitor.info('Test message');
      
      // Strip ANSI codes for comparison
      const stripped = loggedMessage.replace(/\x1b\[[0-9;]*m/g, '');
      expect(timestampRegex.test(stripped)).toBe(true);

      console.log = originalLog;
    });
  });

  describe('Classname Features', () => {
    test('should trim long classnames to max length', () => {
      const monitor = new Monitor('VeryLongClassNameThatExceedsLimit', { maxClassNameLength: 20 });

      const originalLog = console.log;
      let loggedMessage = '';
      console.log = (message: string) => {
        loggedMessage = message;
      };

      monitor.info('Test');

      // Strip ANSI codes for comparison
      const stripped = loggedMessage.replace(/\x1b\[[0-9;]*m/g, '');
      // Should contain trimmed classname (20 chars max) - no brackets
      expect(stripped).toMatch(/VeryLongClassNameTh[a-z]?/);
      expect(stripped).not.toContain('VeryLongClassNameThatExceedsLimit');

      console.log = originalLog;
    });

    test('should use custom maxClassNameLength', () => {
      const monitor = new Monitor('VeryLongClassName', { maxClassNameLength: 10 });

      const originalLog = console.log;
      let loggedMessage = '';
      console.log = (message: string) => {
        loggedMessage = message;
      };

      monitor.info('Test');

      // Strip ANSI codes for comparison
      const stripped = loggedMessage.replace(/\x1b\[[0-9;]*m/g, '');
      expect(stripped).toContain('VeryLongCl');

      console.log = originalLog;
    });

    test('should skip class column when no classname provided', () => {
      const monitor = new Monitor();

      const originalLog = console.log;
      let loggedMessage = '';
      console.log = (message: string) => {
        loggedMessage = message;
      };

      monitor.info('Test message');

      // Strip ANSI codes for comparison
      const stripped = loggedMessage.replace(/\x1b\[[0-9;]*m/g, '');
      // Should not contain classname (no class column when no classname provided)
      // Should only contain timestamp, status, and message
      expect(stripped).toContain('Info');
      expect(stripped).toContain('Test message');
      expect(stripped).toMatch(/\d{2}:\d{2}:\d{2}/); // Timestamp format
      // Should contain timestamp and level
      expect(loggedMessage).toContain('Info');
      expect(loggedMessage).toContain('Test message');

      console.log = originalLog;
    });

    test('should skip class column for empty string classname', () => {
      const monitor = new Monitor('');

      const originalLog = console.log;
      let loggedMessage = '';
      console.log = (message: string) => {
        loggedMessage = message;
      };

      monitor.info('Test');

      // Strip ANSI codes for comparison
      const stripped = loggedMessage.replace(/\x1b\[[0-9;]*m/g, '');
      // Should not contain class brackets (only timestamp brackets)
      // Timestamp is [HH:MM:SS], so we check for brackets with word chars (classname)
      expect(stripped).not.toMatch(/\[\w+\]/);

      console.log = originalLog;
    });
  });

  describe('Column Alignment', () => {
    test('should align columns with classname', () => {
      const monitor1 = new Monitor('Short');
      const monitor2 = new Monitor('VeryLongClassName');

      const originalLog = console.log;
      const messages: string[] = [];
      console.log = (message: string) => {
        messages.push(message);
      };

      monitor1.info('Message 1');
      monitor2.info('Message 2');

      // Strip ANSI codes for comparison
      const stripped1 = messages[0].replace(/\x1b\[[0-9;]*m/g, '');
      const stripped2 = messages[1].replace(/\x1b\[[0-9;]*m/g, '');
      
      // Both should have consistent structure (no brackets, with symbols)
      expect(stripped1).toMatch(/^\d{2}:\d{2}:\d{2}.*Short.*Info.*Message 1/);
      expect(stripped2).toMatch(/^\d{2}:\d{2}:\d{2}.*VeryLongClassName.*Info.*Message 2/);

      console.log = originalLog;
    });

    test('should align columns without classname', () => {
      const monitor = new Monitor();

      const originalLog = console.log;
      let loggedMessage = '';
      console.log = (message: string) => {
        loggedMessage = message;
      };

      monitor.info('Test message');

      // Strip ANSI codes for comparison
      const stripped = loggedMessage.replace(/\x1b\[[0-9;]*m/g, '');
      
      // Format should be time Level Message (no brackets)
      expect(stripped).toMatch(/^\d{2}:\d{2}:\d{2}.*Info.*Test message/);

      console.log = originalLog;
    });
  });

  describe('Log Level Filtering', () => {
    test('should filter out debug when logLevel is info', () => {
      const monitor = new Monitor('Test', { logLevel: 'info' });

      const originalLog = console.log;
      let loggedCount = 0;
      console.log = () => {
        loggedCount++;
      };

      monitor.debug('Debug message');
      monitor.info('Info message');
      monitor.warn('Warn message');
      monitor.error('Error message');

      // Should log info, warn, error (3 messages), not debug
      expect(loggedCount).toBe(3);

      console.log = originalLog;
    });

    test('should filter out debug and info when logLevel is warn', () => {
      const monitor = new Monitor('Test', { logLevel: 'warn' });

      const originalLog = console.log;
      let loggedCount = 0;
      console.log = () => {
        loggedCount++;
      };

      monitor.debug('Debug');
      monitor.info('Info');
      monitor.warn('Warn');
      monitor.error('Error');

      expect(loggedCount).toBe(2); // Only warn and error

      console.log = originalLog;
    });

    test('should only log error when logLevel is error', () => {
      const monitor = new Monitor('Test', { logLevel: 'error' });

      const originalLog = console.log;
      let loggedCount = 0;
      console.log = () => {
        loggedCount++;
      };

      monitor.debug('Debug');
      monitor.info('Info');
      monitor.warn('Warn');
      monitor.error('Error');

      expect(loggedCount).toBe(1); // Only error

      console.log = originalLog;
    });

    test('should log all levels when logLevel is debug (default)', () => {
      const monitor = new Monitor('Test');

      const originalLog = console.log;
      let loggedCount = 0;
      console.log = () => {
        loggedCount++;
      };

      monitor.debug('Debug');
      monitor.info('Info');
      monitor.warn('Warn');
      monitor.error('Error');

      expect(loggedCount).toBe(4); // All levels

      console.log = originalLog;
    });
  });

  describe('File Logging', () => {
    test('should create log file when enabled', async () => {
      const monitor = new Monitor('TestClass', {
        enableFileLogging: true,
        logFilePath: testLogPath,
        disableConsole: true,
      });

      monitor.info('Test message');

      // Wait a bit for async file write
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(existsSync(testLogPath)).toBe(true);
    });

    test('should write log entries to file', async () => {
      const monitor = new Monitor('TestClass', {
        enableFileLogging: true,
        logFilePath: testLogPath,
        disableConsole: true,
      });

      monitor.info('Test message 1');
      monitor.warn('Test message 2');

      await new Promise(resolve => setTimeout(resolve, 100));

      const file = Bun.file(testLogPath);
      const content = await file.text();

      expect(content).toContain('Test message 1');
      expect(content).toContain('Test message 2');
      expect(content).toContain('TestClass');
    });

    test('should strip colors from file output', async () => {
      const monitor = new Monitor('TestClass', {
        enableFileLogging: true,
        logFilePath: testLogPath,
        disableConsole: true,
      });

      monitor.debug('Debug message');
      monitor.error('Error message');

      await new Promise(resolve => setTimeout(resolve, 100));

      const file = Bun.file(testLogPath);
      const content = await file.text();

      // Should not contain ANSI escape codes
      expect(content).not.toMatch(/\x1b\[/);
      expect(content).toContain('Debug message');
      expect(content).toContain('Error message');
    });

    test('should use custom log file path', async () => {
      const customPath = './test-logs/custom.log';
      const monitor = new Monitor('Test', {
        enableFileLogging: true,
        logFilePath: customPath,
        disableConsole: true,
      });

      monitor.info('Custom path test');

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(existsSync(customPath)).toBe(true);

      // Cleanup
      if (existsSync(customPath)) {
        unlinkSync(customPath);
      }
    });

    test('should create directory if it does not exist', async () => {
      const deepPath = './test-logs/deep/nested/path/monitor.log';
      const monitor = new Monitor('Test', {
        enableFileLogging: true,
        logFilePath: deepPath,
        disableConsole: true,
      });

      monitor.info('Deep path test');

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(existsSync(deepPath)).toBe(true);

      // Cleanup
      if (existsSync(deepPath)) {
        unlinkSync(deepPath);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle file write errors gracefully', async () => {
      // Use an invalid path that should fail
      const monitor = new Monitor('Test', {
        enableFileLogging: true,
        logFilePath: '/invalid/path/that/does/not/exist/monitor.log',
        disableConsole: false,
      });

      const originalError = console.error;
      let errorLogged = false;
      console.error = () => {
        errorLogged = true;
      };

      monitor.info('Should handle error');

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not throw, but may log error
      // The exact behavior depends on the system, but it shouldn't crash
      expect(monitor).toBeInstanceOf(Monitor);

      console.error = originalError;
    });

    test('should continue operation even if file logging fails', async () => {
      const monitor = new Monitor('Test', {
        enableFileLogging: true,
        logFilePath: testLogPath,
      });

      const originalLog = console.log;
      let consoleLogged = false;
      console.log = () => {
        consoleLogged = true;
      };

      monitor.info('Test message');

      await new Promise(resolve => setTimeout(resolve, 100));

      // Console output should still work
      expect(consoleLogged).toBe(true);

      console.log = originalLog;
    });
  });

  describe('Console Output Control', () => {
    test('should disable console output when disableConsole is true', () => {
      const monitor = new Monitor('Test', { disableConsole: true });

      const originalLog = console.log;
      let loggedCount = 0;
      console.log = () => {
        loggedCount++;
      };

      monitor.info('Message');
      monitor.warn('Warning');
      monitor.error('Error');

      expect(loggedCount).toBe(0);

      console.log = originalLog;
    });
  });
});

