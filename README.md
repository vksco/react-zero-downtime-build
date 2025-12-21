# React Zero Downtime Build

> Eliminate chunk load errors and 404s during deployments with automatic version detection and user prompts.

[![npm version](https://img.shields.io/npm/v/@thisisayande/rzd.svg)](https://www.npmjs.com/package/@thisisayande/rzd)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## The Problem

When you deploy a new version of your React app:
- Users on old versions get **chunk load errors** (ChunkLoadError)
- Static assets return **404 errors** because old chunks are deleted
- Users have to manually refresh, leading to poor UX

## The Solution

`react-zero-downtime-build` automatically:
1. Checks for new versions every minute (configurable)
2. Detects when a new build is deployed
3. Shows a user-friendly prompt with two options:
   - **Refresh**: Standard page reload
   - **Hard Refresh**: Clears cache and reloads

## Features

- ✅ **Adapter-based architecture** - Works with react-scripts, Vite, and Webpack
- ✅ **Zero configuration** - Works out of the box with sensible defaults
- ✅ **Git Integration** - Automatically captures commit author, message, and hash
- ✅ **Premium UI** - Styled with modern glassmorphism and clear visual hierarchy
- ✅ **No-Dismiss Enforcement** - Ensures users always stay on the latest version
- ✅ **TypeScript support** - Full type safety
- ✅ **Customizable UI** - Use built-in components or build your own

## Installation

**One-command setup** (recommended):

```bash
npx @thisisayande/rzd init
```

This will automatically:
- Install `@thisisayande/rzd` package
- Create `rzd.config.js` in your project root
- Update your `package.json` build script to use `rzd build`
- Backup your original build script as `build:original`

**Or install manually:**

```bash
npm install @thisisayande/rzd
npx rzd init
```

## Quick Start

### Step 1: Initialize

```bash
npx @thisisayande/rzd init
```

This will:
- Install the package (if not already installed)
- Create `rzd.config.js` in your project root
- Update your `package.json` build script to use `rzd build`
- Backup your original build script as `build:original`

### Step 2: Wrap Your App

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { VersionProvider } from '@thisisayande/rzd';
// Import the auto-generated version info
import { 
  CURRENT_VERSION, 
  CURRENT_BUILD_ID, 
  CURRENT_COMMIT, 
  CURRENT_BUILD_TIME 
} from './version';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <VersionProvider
      intervalMs={10000} // Check every 10 seconds
      currentVersion={CURRENT_VERSION}
      currentBuildId={CURRENT_BUILD_ID}
      currentCommit={CURRENT_COMMIT}
      currentBuildTime={CURRENT_BUILD_TIME}
    >
      <App />
    </VersionProvider>
  </React.StrictMode>
);
```

### Step 3: Commit and Build

To ensure git metadata (author, message) is captured:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: your amazing feature"
   ```

2. **Run the build**:
   ```bash
   npm run build
   ```

The build process will automatically fetch the latest git info and embed it into your build!

The build process will automatically:
1. Generate a version file (`app-version.json`)
2. Build your application
3. Place the version file in your build output

## Configuration

Edit `rzd.config.js` in your project root:

```javascript
module.exports = {
  // Build adapter: 'react-scripts', 'vite', or 'webpack'
  adapter: 'react-scripts',

  // Output directory
  outputDir: 'build',

  // Check for updates every 60 seconds
  checkInterval: 60000,

  // Version endpoint
  versionEndpoint: '/app-version.json',

  // Enable debug logging
  debug: false,

  // Environment variables for build
  env: {
    REACT_APP_API_URL: 'https://api.example.com',
  },
};
```

## API Reference

### VersionProvider

Provides version checking context to your app.

```tsx
<VersionProvider intervalMs={60000}>
  {/* Your app */}
</VersionProvider>
```

**Props:**
- `intervalMs` (optional): Check interval in milliseconds (default: 60000)
- `currentVersion` (optional): The initial version string
- `currentBuildId` (optional): The initial build ID (git hash)
- `currentCommit` (optional): The initial commit hash
- `currentAuthor` (optional): The initial git author
- `currentCommitMessage` (optional): The initial git commit message
- `currentBuildTime` (optional): The initial build timestamp
- `autoPrompt` (optional): Automatically show the update prompt (default: true)
- `children`: React nodes

### useVersion Hook

Access version information and control functions.

```tsx
const {
  current,          // Current version info
  latest,           // Latest version from server
  updateAvailable,  // Boolean indicating if update is available
  checkNow,         // Manually trigger version check
  reload,           // Standard page refresh
  hardReload,       // Clear cache and refresh
} = useVersion();
```

### UpdateBanner Component

Banner-style notification at top or bottom of screen.

```tsx
<UpdateBanner
  show={updateAvailable}
  onRefresh={reload}
  onHardRefresh={hardReload}
  position="top"
  message="A customized message"
  commitAuthor="John Doe"
  buildId="a1b2c3d"
  commitMessage="feat: added something awesome"
/>
```

### UpdatePrompt Component

Modal-style dialog in center of screen.

```tsx
<UpdatePrompt
  show={showPrompt}
  onRefresh={reload}
  onHardRefresh={hardReload}
  message="A customized message"
  commitAuthor="John Doe"
  buildId="a1b2c3d"
  commitMessage="feat: added something awesome"
/>
```

## Advanced Usage

### Custom Update UI

Build your own update notification:

```tsx
import { useVersion } from '@thisisayande/rzd';

function CustomUpdateNotification() {
  const { updateAvailable, current, latest, reload, hardReload } = useVersion();

  if (!updateAvailable) return null;

  return (
    <div className="custom-notification">
      <p>New version available: {latest?.version}</p>
      <p>Current version: {current.version}</p>
      <button onClick={reload}>Update Now</button>
      <button onClick={hardReload}>Force Update</button>
    </div>
  );
}
```

### Manual Version Check

```tsx
const { checkNow } = useVersion();

// Trigger check on user action
<button onClick={checkNow}>
  Check for Updates
</button>
```

## How It Works

1. **Build Time**: During build, a `app-version.json` file is generated with version info and timestamp
2. **Runtime**: The app periodically fetches this file to check for updates
3. **Detection**: If the version/timestamp differs, `updateAvailable` becomes `true`
4. **User Action**: User clicks "Refresh" or "Hard Refresh" to update

## Supported Build Tools

- ✅ **Create React App** (react-scripts)
- ✅ **Vite** (coming soon)
- ✅ **Webpack** (coming soon)

## Browser Support

Works in all modern browsers that support:
- Fetch API
- LocalStorage
- ES6+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

[vksco](https://github.com/vksco)

## Support

- [GitHub Issues](https://github.com/vksco/react-zero-downtime-build/issues)
- [Documentation](https://github.com/vksco/react-zero-downtime-build)
