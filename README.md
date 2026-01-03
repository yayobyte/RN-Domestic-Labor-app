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

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yayobyte/RN-Domestic-Labor-app.git
   cd domestic-labor-calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
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
