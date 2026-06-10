# Capacitor Setup — saccoFlow

React + Vite + TypeScript mobile app using Capacitor v8.

- **App ID:** `com.saccoflow.app`
- **Web dir:** `dist`
- **Platforms:** Android, iOS

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Android Studio | Ladybug (2024.2) or newer |
| JDK | 17 |
| Xcode (macOS only) | 15+ |
| CocoaPods (macOS only) | 1.14+ |

---

## Initial Setup (first time)

```bash
# 1. Install dependencies
npm install

# 2. Build the web app
npm run build

# 3. Sync web assets to native platforms
npx cap sync
```

> `npx cap sync` copies `dist/` into both `android/` and `ios/` and installs any Capacitor plugins.

---

## Development Workflow

```bash
# Build web assets then sync to native platforms
npm run build && npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

Run the app from the IDE (Android Studio / Xcode) after opening.

### Live Reload (optional)

To use the dev server instead of a built bundle during development:

1. Find your machine's local IP (e.g. `192.168.1.x`).
2. Add `server.url` to [capacitor.config.ts](capacitor.config.ts):

```ts
const config: CapacitorConfig = {
  appId: 'com.saccoflow.app',
  appName: 'saccoflow',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.x:5173',
    cleartext: true,
  },
};
```

3. Start the Vite dev server: `npm run dev`
4. Sync config and run from the IDE: `npx cap sync`

**Remove `server.url` before building for production.**

---

## Android

### Requirements
- Android Studio with Android SDK (API 23+)
- `ANDROID_HOME` or `ANDROID_SDK_ROOT` environment variable set

### Run on device / emulator

```bash
npm run build && npx cap sync android
npx cap open android
# Press ▶ Run in Android Studio
```

### Build a release APK

```bash
npm run build
npx cap sync android
# In Android Studio: Build → Generate Signed Bundle/APK
```

Key config files:
- [android/app/build.gradle](android/app/build.gradle) — `minSdkVersion`, `targetSdkVersion`, `versionCode`
- [android/variables.gradle](android/variables.gradle) — SDK version variables

---

## iOS (macOS only)

### Requirements
- Xcode 15+ with Command Line Tools
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer account (for device builds)

### Run on device / simulator

```bash
npm run build && npx cap sync ios
npx cap open ios
# Select a simulator or device, press ▶ Run in Xcode
```

### First-time iOS dependency install

```bash
cd ios/App
pod install
cd ../..
```

`npx cap sync` runs this automatically when CocoaPods is available.

---

## Adding Capacitor Plugins

```bash
npm install @capacitor/<plugin-name>
npx cap sync
```

Example — Camera plugin:

```bash
npm install @capacitor/camera
npx cap sync
```

Then follow the plugin's native permission setup (AndroidManifest.xml / Info.plist).

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npx cap sync` | Build + sync web assets to all platforms |
| `npx cap copy` | Copy web assets only (skip plugin updates) |
| `npx cap update` | Update native platform files after Capacitor version bump |
| `npx cap open android` | Open Android project in Android Studio |
| `npx cap open ios` | Open iOS project in Xcode |
| `npx cap run android` | Build and run on connected Android device |
| `npx cap doctor` | Check environment for missing tools |

---

## Troubleshooting

**`npx cap sync` fails — "webDir does not exist"**
Run `npm run build` first to generate the `dist/` folder.

**Android build fails — SDK not found**
Set `ANDROID_SDK_ROOT` in your shell profile:
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
```

**iOS — CocoaPods version conflict**
```bash
sudo gem install cocoapods
pod repo update
```

**White screen on device**
Check that `server.url` is not set in `capacitor.config.ts` for production builds.

**`npx cap doctor`**
Run this to get a full diagnostic of missing tools or misconfigured paths.
