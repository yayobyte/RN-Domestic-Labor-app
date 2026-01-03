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

## ⚖️ Legal Note

The values and formulas are based on projected labor regulations for Colombia in 2026. This tool is for informational and planning purposes. Users should verify final government decrees for exact official figures.

## 👨‍💻 Author

Developed for **yayobyte** using Advanced AI Coding.
