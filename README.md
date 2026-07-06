# Viji University Portal Hub

A modern, high-performance, responsive Full-Stack University Portal Hub designed to handle high-scale institutional content layouts. This platform features a decoupled architecture with a fast, dynamic Vite + React frontend ecosystem, complete with rich animations, optimized navigation systems, interactive components, and state management.

## 🌐 Live Deployment
The frontend of this application is fully optimized, compiled, and deployed on the cloud:
👉 **[Live Demo Link](https://viji-university-portal.vercel.app/)**

---

## 🚀 Key Features

*   **Dynamic UI Layout & Deep Navigation:** Features multi-level dropdown matrices, sliding search overlays, dynamic stats counting hooks (`useCountUp`), and layout elements tracking `useInView` triggers.
*   **Decoupled Full-Stack Architecture:** Built to support an independent, asynchronous backend API pattern using FastAPI (Python) alongside a responsive single-page application layout.
*   **Geographic Integration:** Features interactive location services including optimized map embed states targeting Chennai Main Campus coordinates.
*   **Production-Ready Asset Pipeline:** Integrated image preloader engine to eliminate asset layout shifts and ensure an instantaneous initial load time.
*   **Secure Infrastructure Configuration:** Fully isolated secret management environment leveraging `.env` configurations to prevent accidental exposure of cryptographic signatures or connection strings.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Vite, Tailwind CSS, Lucide React (Icons), Framer Motion / Custom Hooks (Animations)
*   **Backend (Optional/Extensible):** Python, FastAPI, Uvicorn
*   **Database (Optional/Extensible):** MongoDB / Motor (Async driver)
*   **Deployment:** Vercel (Frontend Hosting), Git/GitHub (Version Control)

---

## 📁 Repository Structure

```text
viji-university-portal/
├── srm-v6/
│   ├── backend/             # FastAPI Engine & Route Control
│   │   ├── routers/         # Authentication and Directory API endpoints
│   │   ├── main.py          # Server Entry Point
│   │   ├── requirements.txt # Python Packages Dependencies
│   │   └── .env.example     # Private environment keys template
│   └── frontend/            # Vite + React Interface Ecosystem
│       ├── public/          # Production Assets & Logo Files
│       ├── src/             # Core Core App Logic
│       │   ├── App.jsx      # Portal Views Engine
│       │   ├── main.jsx     # DOM Mounting Configuration
│       │   └── index.css    # Tailwind Core Declarations
│       └── package.json     # Node Package Requirements
├── .gitignore               # Multi-layer global file security exclusion mask
└── README.md                # System documentation

```
## ▶️ Run Application (Local Setup)

### 1️⃣ Start Backend
```bash
cd srm-v6/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
### 2️⃣ Start Frontend (New Terminal)
```bash
cd srm-v6/frontend
npm install
npm run dev
```
