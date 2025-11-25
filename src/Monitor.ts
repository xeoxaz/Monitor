export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface MonitorOptions {
  enableFileLogging?: boolean;
  logFilePath?: string;
  logLevel?: LogLevel;
  disableConsole?: boolean;
  maxClassNameLength?: number;
}

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Symbol table (Braille-like symbols)
const SYMBOLS = [
  '⠁', '⠂', '⠃', '⠄', '⠅', '⠆', '⠇', '⠈', '⠉', '⠊', '⠋', '⠌', '⠍', '⠎', '⠏',
  '⠐', '⠑', '⠒', '⠓', '⠔', '⠕', '⠖', '⠗', '⠘', '⠙', '⠚', '⠛', '⠜', '⠝', '⠞', '⠟',
  '⠠', '⠡', '⠢', '⠣', '⠤', '⠥', '⠦', '⠧', '⠨', '⠩', '⠪', '⠫', '⠬', '⠭', '⠮', '⠯',
  '⠰', '⠱', '⠲', '⠳', '⠴', '⠵', '⠶', '⠷', '⠸', '⠹', '⠺', '⠻', '⠼', '⠽', '⠾', '⠿',
  '⡀', '⡁', '⡂', '⡃', '⡄', '⡅', '⡆', '⡇', '⡈', '⡉', '⡊', '⡋', '⡌', '⡍', '⡎', '⡏',
  '⡐', '⡑', '⡒', '⡓', '⡔', '⡕', '⡖', '⡗', '⡘', '⡙', '⡚', '⡛', '⡜', '⡝', '⡞', '⡟',
  '⡠', '⡡', '⡢', '⡣', '⡤', '⡥', '⡦', '⡧', '⡨', '⡩', '⡪', '⡫', '⡬', '⡭', '⡮', '⡯',
  '⡰', '⡱', '⡲', '⡳', '⡴', '⡵', '⡶', '⡷', '⡸', '⡹', '⡺', '⡻', '⡼', '⡽', '⡾', '⡿',
  '⢀', '⢁', '⢂', '⢃', '⢄', '⢅', '⢆', '⢇', '⢈', '⢉', '⢊', '⢋', '⢌', '⢍', '⢎', '⢏',
  '⢐', '⢑', '⢒', '⢓', '⢔', '⢕', '⢖', '⢗', '⢘', '⢙', '⢚', '⢛', '⢜', '⢝', '⢞', '⢟',
  '⢠', '⢡', '⢢', '⢣', '⢤', '⢥', '⢦', '⢧', '⢨', '⢩', '⢪', '⢫', '⢬', '⢭', '⢮', '⢯',
  '⢰', '⢱', '⢲', '⢳', '⢴', '⢵', '⢶', '⢷', '⢸', '⢹', '⢺', '⢻', '⢼', '⢽', '⢾', '⢿',
  '⣀', '⣁', '⣂', '⣃', '⣄', '⣅', '⣆', '⣇', '⣈', '⣉', '⣊', '⣋', '⣌', '⣍', '⣎', '⣏',
  '⣐', '⣑', '⣒', '⣓', '⣔', '⣕', '⣖', '⣗', '⣘', '⣙', '⣚', '⣛', '⣜', '⣝', '⣞', '⣟',
  '⣠', '⣡', '⣢', '⣣', '⣤', '⣥', '⣦', '⣧', '⣨', '⣩', '⣪', '⣫', '⣬', '⣭', '⣮', '⣯',
  '⣰', '⣱', '⣲', '⣳', '⣴', '⣵', '⣶', '⣷', '⣸', '⣹', '⣺', '⣻', '⣼', '⣽', '⣾', '⣿',
];

// Color codes
const SEPARATOR_COLOR = '\x1b[90m'; // Dark gray for separators
const TIME_COLOR = '\x1b[90m';       // Dark gray for time

// Color schemes for each log level (dark, mid, bright)
const COLOR_SCHEMES: Record<LogLevel, { classname: string; status: string; message: string }> = {
  debug: {
    classname: '\x1b[36m',  // Dark cyan
    status: '\x1b[96m',     // Bright cyan
    message: '\x1b[96m',    // Bright cyan
  },
  info: {
    classname: '\x1b[90m',  // Dark gray
    status: '\x1b[37m',     // Light gray
    message: '\x1b[97m',    // White
  },
  warn: {
    classname: '\x1b[33m',  // Dark yellow/orange
    status: '\x1b[93m',     // Bright yellow
    message: '\x1b[93m',    // Bright yellow
  },
  error: {
    classname: '\x1b[31m',  // Dark red
    status: '\x1b[91m',     // Bright red
    message: '\x1b[91m',    // Bright red
  },
};

const RESET = '\x1b[0m';

const LEVEL_NAMES: Record<LogLevel, string> = {
  debug: 'Debug',
  info: 'Info',
  warn: 'Warn',
  error: 'Error',
};

const STATE_COLUMN_WIDTH = 5; // Longest: "Debug"
const TIME_COLUMN_WIDTH = 10; // [HH:MM:SS]

export class Monitor {
  private className: string | null;
  private trimmedClassName: string | null;
  private classColumnWidth: number;
  private hasClassColumn: boolean;
  private options: Required<Omit<MonitorOptions, 'logFilePath'>> & { logFilePath: string };
  private minLogLevel: number;
  private fileWritePromise: Promise<void> = Promise.resolve();
  private symbols: {
    time: string;
    classname: string;
    status: string;
    message: string;
  };

  constructor(className?: string, options: MonitorOptions = {}) {
    // Process classname
    if (className && className.trim()) {
      const maxLength = options.maxClassNameLength ?? 20;
      this.trimmedClassName = className.length > maxLength
        ? className.substring(0, maxLength)
        : className;
      this.className = this.trimmedClassName;
      this.classColumnWidth = this.trimmedClassName.length;
      this.hasClassColumn = true;
    } else {
      this.className = null;
      this.trimmedClassName = null;
      this.classColumnWidth = 0;
      this.hasClassColumn = false;
    }

    // Set options with defaults
    this.options = {
      enableFileLogging: options.enableFileLogging ?? false,
      logFilePath: options.logFilePath ?? './logs/monitor.log',
      logLevel: options.logLevel ?? 'debug',
      disableConsole: options.disableConsole ?? false,
      maxClassNameLength: options.maxClassNameLength ?? 20,
    };

    this.minLogLevel = LOG_LEVEL_ORDER[this.options.logLevel];

    // Assign random symbols for each column (consistent per instance)
    this.symbols = {
      time: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      classname: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      status: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      message: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    };
  }

  private getTimestamp(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private stripAnsiCodes(text: string): string {
    // Remove ANSI escape codes
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  private formatMessage(level: LogLevel, message: string, withColor: boolean): string {
    const timestamp = this.getTimestamp();
    const levelName = LEVEL_NAMES[level];

    if (!withColor) {
      // Plain text version (for file output) - no symbols, just spaces
      if (this.hasClassColumn) {
        const classColumn = this.trimmedClassName!.padEnd(this.classColumnWidth);
        return `${timestamp} ${classColumn} ${levelName.padEnd(STATE_COLUMN_WIDTH)} ${message}`;
      } else {
        return `${timestamp} ${levelName.padEnd(STATE_COLUMN_WIDTH)} ${message}`;
      }
    }

    // Colored version (for console output) with symbols
    const colors = COLOR_SCHEMES[level];

    // Time in dark gray with symbol
    const timePart = `${TIME_COLOR}${timestamp}${RESET} ${SEPARATOR_COLOR}${this.symbols.time}${RESET}`;

    let formatted: string;

    if (this.hasClassColumn) {
      // Classname with color and symbol
      const classColumn = `${colors.classname}${this.trimmedClassName}${RESET}`.padEnd(this.classColumnWidth + colors.classname.length + RESET.length);
      const classPart = `${classColumn} ${SEPARATOR_COLOR}${this.symbols.classname}${RESET}`;

      // Status in mid/bright shade with symbol
      const plainStatus = levelName.padEnd(STATE_COLUMN_WIDTH);
      const statusPart = `${colors.status}${plainStatus}${RESET} ${SEPARATOR_COLOR}${this.symbols.status}${RESET}`;

      // Message in bright shade (symbol comes before message)
      const messagePart = `${SEPARATOR_COLOR}${this.symbols.message}${RESET} ${colors.message}${message}${RESET}`;

      formatted = `${timePart} ${classPart} ${statusPart} ${messagePart}`;
    } else {
      // Status in mid/bright shade with symbol
      const plainStatus = levelName.padEnd(STATE_COLUMN_WIDTH);
      const statusPart = `${colors.status}${plainStatus}${RESET} ${SEPARATOR_COLOR}${this.symbols.status}${RESET}`;

      // Message in bright shade (symbol comes before message)
      const messagePart = `${SEPARATOR_COLOR}${this.symbols.message}${RESET} ${colors.message}${message}${RESET}`;

      formatted = `${timePart} ${statusPart} ${messagePart}`;
    }

    return formatted;
  }

  private async writeToFile(message: string): Promise<void> {
    if (!this.options.enableFileLogging) return;

    try {
      const plainMessage = this.stripAnsiCodes(message) + '\n';
      const logPath = this.options.logFilePath;

      // Read existing content and append
      let existingContent = '';
      try {
        const file = Bun.file(logPath);
        if (await file.exists()) {
          existingContent = await file.text();
        }
      } catch {
        // File doesn't exist yet, that's fine
      }

      // Write existing content + new message (Bun.write creates directories automatically)
      await Bun.write(logPath, existingContent + plainMessage);
    } catch (error) {
      // Graceful error handling - log to console if possible
      if (!this.options.disableConsole) {
        const errorMsg = `[Monitor] Failed to write to log file: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMsg);
      }
    }
  }

  private log(level: LogLevel, message: string): void {
    // Check log level filtering
    if (LOG_LEVEL_ORDER[level] < this.minLogLevel) {
      return;
    }

    const coloredMessage = this.formatMessage(level, message, true);
    const plainMessage = this.formatMessage(level, message, false);

    // Console output
    if (!this.options.disableConsole) {
      console.log(coloredMessage);
    }

    // File output (always use plain message)
    if (this.options.enableFileLogging) {
      // Chain file writes to ensure sequential writes
      this.fileWritePromise = this.fileWritePromise.then(() =>
        this.writeToFile(plainMessage)
      ).catch(() => {
        // Error already handled in writeToFile
      });
    }
  }

  debug(message: string): void {
    this.log('debug', message);
  }

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }
}

