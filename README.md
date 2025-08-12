# 🩺 AI Doctor App – React Native (Expo)

A mobile application prototype for a **primary care chatbot**. Built with **React Native** and **Expo**, featuring a smooth onboarding flow and a starter chat interface.

## 📱 Features

- **Welcome Screen** – New or Existing patient entry  
- **Registration Screen** – Account creation with basic validation  
- **Chat Intro Screen** – Disclaimers + message input bar  
- **Modern UI** – Clean, minimal design matching medical app standards  
- **Navigation** – Powered by `@react-navigation/native-stack`  

## 🛠 Tech Stack

- [Expo](https://expo.dev/) – Easy development & deployment  
- [React Native](https://reactnative.dev/) – Cross-platform mobile app framework  
- [React Navigation](https://reactnavigation.org/) – Smooth screen transitions  
- JavaScript (ready to convert to TypeScript if needed)

## 🚀 Getting Started

1. **Install prerequisites**
   - [Node.js LTS](https://nodejs.org/) (includes npm)
   - [Expo Go](https://expo.dev/client) app on your phone (optional for quick testing)

2. **Clone & install**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-doctor-app.git
   cd ai-doctor-app
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```
   - Press **i** to launch iOS Simulator (macOS only)  
   - Press **a** to launch Android emulator  
   - Or scan the QR code in Expo Go

## 📂 Project Structure

```
ai-doctor-app/
├─ App.js
├─ screens/
│  ├─ WelcomeScreen.js
│  ├─ RegisterScreen.js
│  └─ ChatIntroScreen.js
├─ components/
│  └─ PrimaryButton.js
└─ assets/
   └─ logo.png
```

## ⚡ Next Steps

- Integrate chatbot backend (e.g., Flask, FastAPI, Node.js)
- Add secure authentication (Firebase, Auth0, or custom API)
- Implement real-time chat + streaming responses
- Add HIPAA compliance and encryption for sensitive data

## 📜 Disclaimer

> **This application is for demonstration purposes only** and is not a substitute for professional medical advice. In case of emergency, call 911 or your local emergency number.
