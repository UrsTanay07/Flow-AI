<div align="center">

# 🛣️ FlowAI Traffic

**Software-Only Traffic Optimization for Bharat**

*Find Your Flow: Advanced City Control System & Traffic AI Engine*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation \& Setup](#installation--setup)
  - [Available Scripts](#available-scripts)
- [Demo Credentials](#-demo-credentials)
- [Architecture \& Security](#-architecture--security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About The Project

**FlowAI Traffic** is an advanced, software-only traffic optimization platform designed to serve as a comprehensive **City Control System**. It delivers real-time traffic monitoring, AI-assisted rerouting, signal light optimization, and deep performance analytics without requiring expensive proprietary hardware. 

Designed for scalability and modern urban logistics, FlowAI empowers city administrators, traffic engineers, and observers with data-driven decision-making tools.

---

## ✨ Key Features

- 🔴 **Live City Dashboard**: Real-time traffic flow monitoring, speed indices, and city-wide status overview.
- 🚦 **AI Signal Optimizer**: Dynamic traffic light sequencing recommendations to alleviate congestion.
- 🗺️ **Interactive Heat Maps**: Visual representation of high-density corridors and bottlenecks using Leaflet maps.
- 🔄 **Smart Rerouting**: Intelligent diversion advisories for emergency services and peak congestion hours.
- 📈 **Performance Analytics**: Historical trend tracking, signal efficiency metrics, and delay reductions.
- 🌗 **Cinematic UI/UX**: Ultra-modern interface featuring WebGL background animations, glassmorphism, and seamless Dark/Light mode support.

---

## 🛠️ Technology Stack

| Domain | Tech / Tools |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Motion, GSAP, Radix / Base UI |
| **Mapping & 3D** | Leaflet, React-Leaflet, Three.js, React Three Fiber, OGL |
| **Charts & Icons** | Recharts, Lucide React, React Icons |
| **Backend API** | Node.js, Express (TypeScript engine) |
| **Security & Auth** | HttpOnly Cookie Sessions, CSRF Tokens, Login Throttling, Security Headers |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v22.6` or higher (`v24` recommended)
- **Package Manager**: `npm` (included with Node.js)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/UrsTanay07/Flow-AI.git
   cd Flow-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** *(Optional)*:
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   *Note: If no external telemetry credentials are set, FlowAI automatically runs with a calibrated demonstration dataset. Set `TRAFFIC_PROVIDER=here`, `HERE_API_KEY`, and `HERE_BBOX` for native HERE flow data. Set the signal-controller variables only for an authorized municipal endpoint.*

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open the URL printed in the terminal. FlowAI starts at `http://localhost:3000` and automatically tries the next available port when it is occupied.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server & Vite dev environment with hot-reloading |
| `npm run build` | Compiles production-ready bundle into `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run test` | Runs server test suite using native Node test runner |
| `npm run check` | Runs lint, unit tests, and production build together |

---

## 🔐 Demo Credentials

Use the pre-configured role accounts below to log into the **City Control Panel**:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@flowai.in` | `flowai123` | Full Control, Emergency Override & User Management |
| 🛠️ **Engineer** | `tanay@flowai.in` | `tanay123` | Signal & Reroute Optimizations |
| 👁️ **Observer** | `demo@flowai.in` | `demo123` | Read-only Dashboards & Analytics |

*All password verifications take place on the server side using session cookies.*

---

## 🛡️ Architecture & Security

- **Server-Side Sessions**: Authentication state is stored securely using HttpOnly cookies with CSRF defense.
- **Rate-Limiting & Throttling**: Protects endpoints against brute-force login attempts.
- **Provider Abstraction**: Telemetry integrations decouple live data providers from fallback simulation models seamlessly.
- **Operational Safety**: Engineer requests require administrator approval, with rejection and rollback controls.
- **Durable Audit Store**: Operations and their latest state survive server restarts in the local `data/` store.
- **Production Container**: Build with `docker build -t flowai .` and run with a mounted data volume.

---

## 🤝 Contributing

Contributions are what make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ for **Bharat** by the **FlowAI Team**

</div>
