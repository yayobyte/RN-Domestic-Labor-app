# Domestic Labor Calculator (Colombia 2026)

A premium React Native mobile application built with Expo and TypeScript to calculate the legal costs of hiring domestic workers in Colombia for the year 2026.

## 🚀 Overview

This calculator helps employers determine the exact costs of hiring domestic labor by days or monthly, ensuring compliance with Colombian labor laws (including **Decree 2616 of 2013** for part-time social security).

## ✨ Key Features

- **Dynamic Interactive Calendar**: Select specific days worked in a month to calculate precise totals.
- **PILA (Social Security) Calculation**: 
  - Aligned with the "Weekly Block" system (1-7 days = 1 week IBC).
  - Includes Pension (16%), Health (12.5% optional), ARL (Risk I), and Caja de Compensación (4%).
- **Benefit Accruals**: Automatic calculation of Prima de Servicios, Cesantías, Interests on Cesantías, and Vacations.
- **Configurable Settings**:
  - **Custom Minimum Salary (SMMLV)**: Preset for 2026 ($1,750,905) but adjustable.
  - **Health (EPS) Toggle**: Easily include or exclude health contributions (essential for workers with SISBEN).
  - **Default Hours**: Set standard working hours per day.
- **Detailed Breakdown**: A comprehensive indigo-themed modal showing exactly what goes to the worker, what is saved for benefits, and the net employer cost.
- **Night Shift Support**: Apply the legal 35% surcharge for night work.
- **Unit Tested Logic**: 100% line coverage of core business formulas using Jest.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: TypeScript
- **Styling**: Vanilla React Native StyleSheet with a custom Premium Design System (Indigo/Glassmorphism).
- **Icons**: Expo Vector Icons (Ionicons).
- **Navigation/Modals**: Expo Blur for high-end UI transitions.
- **Testing**: Jest with `ts-jest`.

## � Prerequisites

Before running this project, ensure you have the following installed:

### Global Tools
- **Node.js**: (LTS recommended)
- **npm** or **Yarn**

### For iOS Development (macOS only)
1. **Homebrew**: Required for installing dependencies.
2. **CocoaPods**: Install via Homebrew: `brew install cocoapods`.
3. **Xcode**: Install from the App Store.
4. **Xcode Command Line Tools**: `xcode-select --install`.

### For Android Development
1. **JDK 17**: This project requires Java 17. 
   - *Fix (Apple Silicon/Homebrew):* `brew install openjdk@17`
   - *Link it:* You must link the Brew JDK so macOS can find it:
     ```bash
     sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
     ```
2. **Android Studio**: To manage Android SDKs and Virtual Devices.
3. **Android SDK**: Install API level 34+ via Android Studio SDK Manager.
4. **Environment Variables**: To run Android commands effectively, add these to your `~/.zshrc`:
   ```bash
   # Android SDK & Java 17
   export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
   export ANDROID_HOME=$HOME/Library/Android/sdk
   
   # Add tools to PATH
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$JAVA_HOME/bin"
   ```
   *Apply changes:* `source ~/.zshrc`

5. **Device Authorization**: 
   - Enable **USB Debugging** on your Android device.
   - When connecting, look for a popup on your phone: **"Allow USB Debugging?"** and select **"Always allow from this computer"**.
   - Verify connection: `adb devices`

## 🛠️ Troubleshooting

### "Unable to locate a Java Runtime" (Mac/Homebrew)
If you've installed `openjdk@17` but still see this error, run this command in your current terminal session:
```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
```
After this, `npm run android` should find Java correctly.

### "SDK location not found"
The build system doesn't know where your Android SDK is.
1. **Fix for current session:**
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   npm run android
   ``` 
2. **Permanent Fix:** Create a file named `android/local.properties` (this file is ignored by git) and add:
   ```text
   sdk.dir=/Users/yayobyte/Library/Android/sdk
   ```

### "ADB Not Found" (Fixing the Path)
If your terminal doesn't recognize the `adb` command:
1. **Permanent Fix (Recommended):**
   ```bash
   echo 'export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"' >> ~/.zshrc
   source ~/.zshrc
   ```
2. **One-time Connection Fix:**
   ```bash
   ~/Library/Android/sdk/platform-tools/adb reverse tcp:8081 tcp:8081
   ```

### "No iOS devices available in Simulator.app"
If this happens when trying to run on a **physical device**:
1. **Specify the Device Name/UDID:**
   ```bash
   npx expo run:ios --device "iPhone 16 Yayo"
   ```
2. **First-time Run Rule:** If the console continues to fail, use **Xcode** for the first build. It handles the "Code Signing" and "Trust Device" steps more reliably.
   - Open Xcode: `open ios/LaborCalculator.xcworkspace`
   - Select your iPhone at the top.
   - Press **Run** (Cmd + R).

### "Metro is already running" or "Port 8081 in use"
If you get an error saying port 8081 is already taken:
1. **Find and stop the process:** Look for the terminal window running `node` and press `Ctrl+C`.
2. **Force Kill (if hidden):**
   ```bash
   lsof -i :8081  # Find the PID
   kill -9 <PID>  # Replace <PID> with the number found
   ```

### "This computer is not authorized"
1. Disconnect and reconnect your phone.
2. Ensure `adb` is in your path (`adb devices` should show the device).
3. Watch for a "Allow USB Debugging?" popup on your phone and tap **Allow**.

## �📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yayobyte/RN-Domestic-Labor-app.git
   cd RN-Domestic-Labor-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Prebuild the app**:
   ```bash
   npx expo prebuild
   ```

## 📱 Running on Physical Devices

### 1. The Easy Way (Expo Go)
This is recommended for most development logic.
1. Download the **Expo Go** app from the App Store (iOS) or Play Store (Android).
2. Ensure your Mac and phone are on the **same Wi-Fi network**.
3. Run:
   ```bash
   npx expo start
   ```
4. **iOS:** Scan the QR code with your Camera app.
5. **Android:** Scan the QR code with the Expo Go app.

### 2. The Native Way (Development Build)
Use this if you need to test native modules or if Expo Go doesn't support a specific library.

#### For iOS (Physical Device)
1. **Fix CocoaPods:**
   ```bash
   brew install cocoapods
   cd ios && pod install && cd ..
   ```
2. **Open in Xcode:** `open ios/LaborCalculator.xcworkspace`
3. **Sign the app:**
   - Select the "Labor Calculator" project in the sidebar.
   - Go to **Signing & Capabilities**.
   - Select your **Team** (Personal Team is fine).
4. **Run:** Select your iPhone at the top of Xcode and press the **Play** button.

#### For Android (Physical Device)
1. Ensure your phone is connected and authorized (see Troubleshooting).
2. Run:
   ```bash
   npm run android
   ```

## 🧪 Testing

The project maintains a rigorous testing standard for all business logic in `src/business`.

- **Run all tests**:
  ```bash
  npm test
  ```

- **Check coverage**:
  ```bash
  npm run test:coverage
  ```

## 🏗️ Project Architecture

The project follows a **Modified Layered Architecture** to ensure a strict separation of concerns, making the complex labor logic easy to test and maintain.

```text
src/
├── business/          # 🧠 CORE LOGIC (Pure JS/TS, No React)
│   ├── __tests__/     # 🧪 100% Coverage Unit Tests
│   ├── constants.ts   # ⚖️ Legal Rates & Percentages
│   ├── salary.ts      # 💵 Hourly & Surcharge Logic
│   ├── benefits.ts    # 🎁 Accruals (Prima, Cesantías)
│   ├── socialSecurity.ts # 🏥 PILA Weekly Block Calculations
│   └── validation.ts  # 🛡️ Settings & Input Rules
├── context/           # 🔄 STATE MANAGEMENT (Settings persistence)
├── components/        # 🧱 UI COMPONENTS (Stateless/Reusable)
├── screens/           # 📱 SCREEN MODULES (Assembling logic & UI)
├── ui/                # 🎨 DESIGN SYSTEM (Typography, Cards, Theme)
└── theme/             # 🌈 STYLE TOKENS (Colors, Shadows, Spacing)
```

## ⚖️ Legal Business Logic (Colombia)

The calculator implements specific nuances of Colombian Labor Law:

### 1. Social Security (PILA) - Decree 2616
For workers employed by days, contributions are not calculated by days worked but by **Weekly IBC Blocks**:
- **1-7 days worked**: 1 week contribution (25% of SMMLV).
- **8-14 days worked**: 2 weeks contribution (50% of SMMLV).
- **15-21 days worked**: 3 weeks contribution (75% of SMMLV).
- **22+ days worked**: 4 weeks contribution (100% of SMMLV).

### 2. Mandatory Accruals
Calculated daily to provide real-time employer cost projections:
- **Prima de Servicios**: 8.33% of (Salary + Transport).
- **Cesantías**: 8.33% of (Salary + Transport).
- **Intereses sobre Cesantías**: 12% of the accrued Cesantías.
- **Vacations**: 4.17% of **Salary only** (Transport Aid is legally excluded).

### 3. Surcharges and Rates
- **Night Surcharge**: A 35% extra is applied over the base hourly rate for night shifts.
- **Semester Logic**: Rates for 2026 are split between H1 (Jan-Jul) and H2 (Jul-Dec) to handle projected shifts in work-hour regulations.

---

## 👨‍💻 Author
  Developed for **yayobyte** using Advanced AI Coding (50% vibecoding and 50% human reviewing).
