# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-12-21

### Changed
- **Package Rename**: Renamed from `react-zero-downtime-build` to `@karmick/rzd`
- **CLI Structure**: Consolidated `rzd-init` and `rzd-build` into a single `rzd` binary with subcommands
- **Workflow**: New simplified workflow using `npx @karmick/rzd init`
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
- Vite adapter
- Webpack adapter
- Advanced caching strategies
- Custom notification templates
