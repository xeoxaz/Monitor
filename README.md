# Monitor

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/Bun-1.0+-black?logo=bun)

A simple, colorful logger class for Bun with TypeScript support, file logging, and column-aligned output.

## Features

- 🎨 **Color-coded output** - Debug (cyan), Warn (orange), Error (red), Info (default)
- ⏰ **24-hour timestamps** - Formatted as `[HH:MM:SS]`
- 📊 **Column-aligned output** - Consistent, readable log format
- 📝 **File logging** - Optional file output with automatic directory creation
- 🔍 **Log level filtering** - Control which log levels are output
- ✂️ **Classname trimming** - Automatic trimming of long classnames
- 🎯 **Optional classname** - Use with or without classname identifier
- 🛡️ **Error handling** - Graceful degradation if file logging fails

## Installation

### Option 1: Install from GitHub (Recommended)

Bun can install directly from GitHub:

```bash
bun add github:xeoxaz/Monitor
```

Or with a specific version/tag:

```bash
bun add github:xeoxaz/Monitor@v1.0.1
```

### Option 2: Install from npm (if published)

If published to npm:

```bash
bun add @frostal/monitor
```

### Option 3: Clone and install locally

```bash
git clone https://github.com/xeoxaz/Monitor.git
cd Monitor
bun install
```

## Quick Start

```typescript
import { Monitor } from '@frostal/monitor';

// Basic usage with classname
const monitor = new Monitor('MyClass');

monitor.info('This is an info message');
monitor.warn('This is a warning');
monitor.error('This is an error');
monitor.debug('This is a debug message');
```

**Output:**
```
[14:30:45] [MyClass] Info  This is an info message
[14:30:45] [MyClass] Warn  This is a warning
[14:30:45] [MyClass] Error This is an error
[14:30:45] [MyClass] Debug This is a debug message
```

## Usage

### Basic Usage

```typescript
import { Monitor } from '@frostal/monitor';

const monitor = new Monitor('MyClass');

monitor.info('Hello, world!');
monitor.warn('Warning message');
monitor.error('Error message');
monitor.debug('Debug message');
```

### Without Classname

If you don't provide a classname, the class column is skipped:

```typescript
const monitor = new Monitor();

monitor.info('Simple message');
monitor.warn('Warning without classname');
```

**Output:**
```
[14:30:45] Info  Simple message
[14:30:45] Warn  Warning without classname
```

### File Logging

Enable file logging to save logs to a file:

```typescript
const monitor = new Monitor('MyClass', {
  enableFileLogging: true,
  logFilePath: './logs/monitor.log', // Optional, defaults to ./logs/monitor.log
});

monitor.info('This will be logged to both console and file');
```

The log file will contain plain text (no colors) with the same column alignment.

### Log Level Filtering

Control which log levels are output:

```typescript
// Only show warnings and errors
const monitor = new Monitor('MyClass', {
  logLevel: 'warn',
});

monitor.debug('Hidden');    // Won't appear
monitor.info('Hidden');     // Won't appear
monitor.warn('Visible');    // Will appear
monitor.error('Visible');   // Will appear
```

Log levels in order: `debug` < `info` < `warn` < `error`

### Classname Trimming

Long classnames are automatically trimmed:

```typescript
const monitor = new Monitor('VeryLongClassNameThatExceedsLimit', {
  maxClassNameLength: 20, // Optional, defaults to 20
});

monitor.info('Classname will be trimmed');
```

**Output:**
```
[14:30:45] [VeryLongClassNameTh] Info  Classname will be trimmed
```

### Console-Only Mode

Disable console output (useful for file-only logging):

```typescript
const monitor = new Monitor('MyClass', {
  enableFileLogging: true,
  disableConsole: true,
});

monitor.info('Only logged to file');
```

## API Reference

### Constructor

```typescript
new Monitor(className?: string, options?: MonitorOptions)
```

**Parameters:**
- `className?: string` - Optional class name identifier
  - If provided: class column appears in output
  - If omitted: class column is skipped entirely

**Options:**
- `enableFileLogging?: boolean` - Enable file output (default: `false`)
- `logFilePath?: string` - Custom log file path (default: `./logs/monitor.log`)
- `logLevel?: LogLevel` - Minimum log level to output (default: `'debug'`)
- `disableConsole?: boolean` - Disable console output (default: `false`)
- `maxClassNameLength?: number` - Maximum classname length before trimming (default: `20`)

### Methods

#### `debug(message: string): void`
Logs a debug message with cyan color.

#### `info(message: string): void`
Logs an info message with default color.

#### `warn(message: string): void`
Logs a warning message with orange color.

#### `error(message: string): void`
Logs an error message with red color.

## Output Format

### With Classname
```
[HH:MM:SS] [ClassName] Level Message
```

### Without Classname
```
[HH:MM:SS] Level Message
```

### Column Alignment

The output is column-aligned for readability:
- **Time column**: Fixed 10 characters `[HH:MM:SS]`
- **Class column**: Dynamic width (only shown if classname provided)
- **State column**: Fixed 5 characters (longest: "Debug")
- **Output column**: Left-aligned, variable width

**Example with alignment:**
```
[14:30:45] [ServiceA]    Info  Message from Service A
[14:30:46] [ServiceB]    Warn  Warning from Service B
[14:30:47] [ServiceC]    Error Error from Service C
```

## Color Support

- **Debug**: Cyan (`\x1b[36m`)
- **Warn**: Orange/Yellow (`\x1b[33m`)
- **Error**: Red (`\x1b[31m`)
- **Info**: Reset/Default (`\x1b[0m`)

Colors are automatically stripped when writing to log files.

## Examples

See the [examples](./examples/basic.ts) directory for more usage examples.

Run examples:
```bash
bun run examples/basic.ts
```

## Testing

Run the test suite:
```bash
bun test
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Repository

GitHub: https://github.com/frostal/Monitor

