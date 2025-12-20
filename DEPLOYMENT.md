# Deployment Checklist

Before publishing `@karmick/rzd` to npm, go through this checklist:

## Pre-Publishing Checklist

### 1. Code Quality ✅
- [x] All TypeScript files compile without errors
- [x] No console errors or warnings
- [x] Code follows consistent style
- [x] All functions have proper types
- [x] JSDoc comments added for public APIs

### 2. Build & Compilation ✅
- [x] `npm run build` completes successfully
- [x] `dist/` folder contains all required files
- [x] TypeScript definitions (`.d.ts`) generated
- [x] No build warnings or errors

### 3. Package Configuration ✅
- [x] `package.json` has correct metadata
  - [x] name
  - [x] version
  - [x] description
  - [x] main entry point
  - [x] types entry point
  - [x] bin executables
  - [x] keywords
  - [x] repository URL
  - [x] author
  - [x] license
- [x] `files` field includes only necessary files
- [x] `peerDependencies` set correctly
- [x] `engines` specifies Node version

### 4. CLI Tools ✅
- [x] `rzd init` command works
- [x] `rzd build` command works
- [x] CLI shows helpful error messages
- [x] Help text is clear and accurate

### 5. Documentation ✅
- [x] README.md is comprehensive
- [x] Installation instructions clear
- [x] Quick start guide included
- [x] API documentation complete
- [x] Examples provided
- [x] CHANGELOG.md created
- [x] CONTRIBUTING.md present

### 6. Templates & Assets ✅
- [x] `templates/rzd.config.js` is complete
- [x] `templates/app-version.json` is valid JSON
- [x] All template files documented

### 7. Testing (Before Publishing)
- [ ] Test installation locally with `npm link`
- [ ] Create a test React app
- [ ] Run `npx @karmick/rzd init` in test app
- [ ] Verify config file created
- [ ] Test build process
- [ ] Verify version file generated
- [ ] Test version checking in browser
- [ ] Test update banner appears
- [ ] Test refresh functionality
- [ ] Test hard refresh functionality

## Testing Instructions

### Local Testing

```bash
# In the package directory
npm link

# In a test React app
npm link @karmick/rzd

# Test initialization
npx @karmick/rzd init

# Test build
npm run build

# Verify files created
ls build/app-version.json

# Start app and test
npm start
```

### Test Scenarios

1. **Initial Load**
   - App loads without errors
   - No update banner shown
   - Console logs look correct

2. **Version Check**
   - Wait 60 seconds
   - Check network tab for version fetch
   - Verify proper cache headers

3. **Update Detection**
   - Build new version
   - Deploy to same location
   - Wait for check interval
   - Verify banner appears

4. **Refresh Actions**
   - Click "Refresh" button
   - Verify page reloads
   - Click "Hard Refresh"
   - Verify cache cleared

## Publishing to npm

### First Time Setup

```bash
# Login to npm
npm login

# Verify credentials
npm whoami
```

### Publishing Steps

```bash
# 1. Final verification
./scripts/verify-package.sh

# 2. Test pack (see what will be published)
npm pack

# 3. Inspect the tarball
tar -tzf karmick-rzd-0.1.1.tgz

# 4. Dry run
npm publish --dry-run

# 5. Publish (for real)
npm publish

# 6. Verify on npm
npm view @karmick/rzd
```

### Post-Publishing

```bash
# 1. Create git tag
git tag v0.1.0
git push origin v0.1.0

# 2. Create GitHub release
# Go to: https://github.com/vksco/react-zero-downtime-build/releases/new

# 3. Test installation from npm
mkdir test-install
cd test-install
npm install @karmick/rzd
```

## Version Updates

When releasing new versions:

### Patch (0.1.X) - Bug Fixes
```bash
npm version patch
npm publish
git push && git push --tags
```

### Minor (0.X.0) - New Features
```bash
npm version minor
npm publish
git push && git push --tags
```

### Major (X.0.0) - Breaking Changes
```bash
npm version major
npm publish
git push && git push --tags
```

## Post-Release Tasks

- [ ] Announce on GitHub
- [ ] Update documentation site (if any)
- [ ] Share on social media
- [ ] Monitor issues and feedback
- [ ] Respond to questions

## Emergency Unpublish

If something goes wrong within 72 hours:

```bash
npm unpublish @karmick/rzd@0.1.1
```

⚠️ **Warning:** Unpublishing is permanent and should only be used for critical issues.

## Support Channels

After publishing, monitor:
- GitHub Issues
- npm downloads
- User feedback
- Bug reports

## Success Metrics

Track:
- Weekly downloads
- GitHub stars
- Issues reported/resolved
- Pull requests
- Community engagement

---

**Ready to publish?** Make sure all items are checked! ✅
