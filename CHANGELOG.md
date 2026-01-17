# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-18

### Breaking Changes
- **API Cleanup**: Removed redundant `commit` field from version data structures
- **VersionProvider**: Removed `currentCommit` prop (redundant with `buildId`)
- **Constants**: Removed `CURRENT_COMMIT` generation (always null)
- **Data Structure**: Fixed version comparison inconsistencies

### Added
- **Full Vite Support**: Vite adapter now fully implemented
- **Full Webpack Support**: Webpack adapter now fully implemented

### Changed
- **Version Comparison**: Now uses `buildId` consistently for update detection
- **Data Consistency**: Fixed `timestamp` vs `buildTime` field mismatches
- **Documentation**: Updated README with accurate API examples

### Removed
- **Legacy Code**: Removed unused `generate-version.ts` and `build-merge.ts` files
- **Redundant Fields**: Eliminated duplicate commit information

### Fixed
- **Type Safety**: Resolved TypeScript inconsistencies
- **Build Process**: Cleaned up version generation logic

## [0.1.2] - 2025-12-21

### Changed
- **Package Rename**: Renamed package to `@thisisayande/rzd`
- **Build ID**: Changed build ID generation to use git commit hash for better accuracy

## [0.1.1] - 2025-12-21

### Changed
- **Package Rename**: Renamed from `react-zero-downtime-build` to `@thisisayande/rzd`
- **CLI Structure**: Consolidated `rzd-init` and `rzd-build` into a single `rzd` binary with subcommands
- **Workflow**: New simplified workflow using `npx @thisisayande/rzd init`
- **Node Support**: Updated minimum Node.js version to 16.0.0
- **Dependencies**: Removed React from `devDependencies` to avoid conflicts (kept in `peerDependencies`)

## [0.1.0] - 2025-12-05

### Added
- Initial release of react-zero-downtime-build
- VersionProvider context for version checking
- useVersion hook for accessing version information
- UpdateBanner component for banner-style notifications
- UpdatePrompt component for modal-style notifications
- CLI tools: `rzd-init` for initialization and `rzd-build` for building
- Support for react-scripts adapter (Create React App)
- Automatic version file generation
- Configurable check intervals
- Hard refresh capability with cache clearing
- TypeScript support with full type definitions
- Zero-configuration setup with sensible defaults

### Supported
- React 18+
- Create React App (react-scripts)
- TypeScript projects

### Coming Soon
- Advanced caching strategies
- Custom notification templates
