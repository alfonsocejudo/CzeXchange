# CzeXchange

A Czech crown (CZK) exchange rate viewer and currency converter built with React Native. Features an industrial dark UI inspired by physical LED exchange boards.

## Features

- **Exchange Rates** -- Live CZK exchange rates displayed in a glass panel with LED-glow styling, sortable by Default, Alphabetical, Highest, or Lowest rates
- **Convert** -- Currency converter with numeric input, modal currency picker, slot machine result animation, and a tactile convert button with press states
- **Settings** -- Selectable exchange rate sources: Czech National Bank, FloatRates, or ExchangeRate-API

## Tech Stack

- React Native 0.84
- TypeScript
- styled-components/native
- React Navigation (bottom tabs)
- TanStack React Query

## Getting Started

### Prerequisites

Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) for your platform.

### Install

```sh
npm install
```

For iOS:

```sh
bundle install
bundle exec pod install
```

### Run

```sh
npm start
```

In a separate terminal:

```sh
# iOS
npm run ios

# Android
npm run android
```

### Test

**Unit and component tests** -- runs all tests except integration tests. Covers screen rendering, component behavior, API client logic, and mock-based hook tests.

```sh
npm test
```

**Integration tests** -- runs only `*.integration.test.*` files. These hit real external APIs (CNB, FloatRates, ExchangeRate-API) to verify response parsing and validation against live data.

```sh
npm run test:integration
```

## Project Structure

```
src/
  api/            # API clients and exchange rate fetchers
  app/            # App root and navigation
  assets/         # Images (background, button assets)
  components/
    atoms/        # Label, SlotText (slot machine digits)
    molecules/    # CurrencyRow, PickerModal
    organisms/    # ExchangeBoard, GlassPanel
    templates/    # AppScreen layout
  constants/      # Currency maps and flag utilities
  context/        # Source selection context
  hooks/          # useExchangeRates
  screens/        # ExchangeRates, Convert, Settings
  theme/          # Dark industrial color tokens and spacing
  types/          # TypeScript interfaces
```
