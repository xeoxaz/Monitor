# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-25

### Added
- Initial release of Monitor logger module
- Color-coded output (debug: cyan, warn: orange, error: red, info: default)
- 24-hour timestamp format `[HH:MM:SS]`
- Column-aligned output format
- Optional classname support (class column skipped if not provided)
- Classname trimming (max 20 characters, configurable)
- File logging with automatic directory creation
- Log level filtering (debug < info < warn < error)
- Error handling with graceful degradation
- TypeScript support with full type definitions
- Comprehensive test suite (22 tests)
- GitHub Actions CI workflow
- Complete documentation and examples

[1.0.0]: https://github.com/xeoxaz/Monitor/releases/tag/v1.0.0

