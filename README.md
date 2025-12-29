# 🏋️ KSOFit - AI Powered Fitness Coach

**KSOFit** (Killer Skinny Obese Fit) is a next-generation mobile fitness application designed specifically for **"Skinny Fat"** and **"Obese"** beginners.

Unlike generic fitness apps, KSOFit uses **Google Gemini AI** to analyze your physical stats (age, weight, height) and goals to generate a 100% personalized, weekly workout plan with dynamic visual guides.

---

## 📱 Screenshots

| Login Screen | Onboarding | Workout Plan |
|:---:|:---:|:---:|
| <img src="./assets/screenshot-login.png" width="200" /> | <img src="./assets/screenshot-onboarding.png" width="200" /> | <img src="./assets/screenshot-plan.png" width="200" /> |

*(Note: Replace the image paths above with your actual screenshots)*

---

## ✨ Key Features

* **🧬 AI-Driven Customization:** Uses Google's **Gemini Pro** model to create tailored workout routines based on user prompts.
* **🎯 Targeted Flows:** Specific onboarding paths for users wanting to "Lose Weight", "Bulk", or "Recomp" (Burn fat & build muscle).
* **🎨 Premium Aesthetic:** Modern "Dark Gym" theme with glassmorphism effects, linear gradients, and a cohesive design system.
* **🖼️ Dynamic Visuals:** Automatically fetches exercise images based on the generated plan keywords.
* **🔐 Authentication UI:** Complete simulation of Login/Register flows with validation logic.

---

## 🛠 Tech Stack & Architecture

This project is built with a scalable **Component-Based Architecture** using **TypeScript**.

| Technology | Purpose |
| :--- | :--- |
| **Expo (React Native)** | Cross-platform mobile development framework. |
| **TypeScript (.tsx)** | Static type checking for robust and error-free code. |
| **Google Gemini API** | Large Language Model (LLM) for workout generation logic. |
| **React Navigation** | Handling stack navigation and screen transitions. |
| **Component Architecture** | Reusable UI elements (`Button`, `Input`, `Layout`) for DRY code. |
| **Expo Linear Gradient** | For creating the immersive dark-themed backgrounds. |

---

## 📂 Project Structure

```bash
KSOFit/
├── assets/                  # Images and static files
├── src/
│   ├── components/          # Reusable UI (Button.tsx, Input.tsx, Layout.tsx)
│   ├── screens/             # App screens (Login, Onboarding, WorkoutPlan)
│   ├── services/            # API Integrations (geminiService.ts)
│   ├── types/               # TypeScript interfaces and types
│   └── utils/               # Helper functions
├── App.tsx                  # Main entry point & Navigation setup
└── package.json
