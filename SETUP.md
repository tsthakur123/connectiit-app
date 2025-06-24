# Project Setup

This guide will walk you through the steps to set up the project locally.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

## 1. Clone the Repository

Clone the project repository to your local machine.

```bash
git clone <repository-url>
cd connectiit-app
```
Replace `<repository-url>` with the actual URL of the GitHub repository.

## 2. Install Dependencies

Install the project dependencies using npm or yarn.

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

## 3. Running the Project

Once the dependencies are installed, you can run the project using the following commands:

To start the development server:
```bash
npm start
```
or
```bash
expo start
```

This will open the Expo DevTools in your web browser. From there, you can:

- **Run on an Android device/emulator:**
  - Make sure you have Android Studio and an emulator set up.
  - Press `a` in the terminal running the development server.

- **Run on an iOS simulator:**
  - (macOS only) Make sure you have Xcode and the command-line tools installed.
  - Press `i` in the terminal running the development server.

- **Run in a web browser:**
  - Press `w` in the terminal running the development server.

You can also scan the QR code from the Expo DevTools with the Expo Go app on your physical device.

## 4. Linting

To check the code for linting errors, run:
```bash
npm run lint
```

## 5. Testing

To run the test suite, use the following command:
```bash
npm run test
``` 