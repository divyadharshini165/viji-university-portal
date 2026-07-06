# SRM University Portal — v6.0 (Final Production)

Full-length, deep-scrollable university homepage for **SRMIST Kattankulathur**.

**Stack:** React 18 + Vite + Tailwind CSS (frontend) · FastAPI + JWT (backend)

---

## Quick Start

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

Backend (optional — all content reads from LOCAL_TOPIC_DATA, no backend needed):
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Local Assets Required

Place these files in `frontend/public/` before running:

| File | Used In |
|---|---|
| `srm-ktr.jpg` | Hero campus photograph (already included) |
| `logo.png` | SRM official seal/logo in navbar and footer |
| `students-class.jpg` | 🎓 Students audience panel |
| `faculty-lab.jpg` | 👩‍🏫 Faculty & Staff audience panel |
| `parents-view.jpg` | 👨‍👩‍👧 Parents audience panel |
| `visitors-gate.jpg` | 🏛️ Visitors audience panel |
| `alumni-network.jpg` | 🤝 Alumni audience panel |
| `academic-research.jpg` | Research section — Academic Research card |
| `raman-block.jpg` | Research section — Sir C.V. Raman Block card |
| `recent-projects.jpg` | Research section — Recent Projects card |
| `innovation-hub.jpg` | Research section — Innovation Hub card |

> All images have Unsplash fallback URLs. The app renders perfectly even without local files.

---

## Architecture

All content lives in `App.jsx` — **zero backend dependency for the landing page**.

| Constant | Contents |
|---|---|
| `NAV_MENUS` | 5 headers, 21 slugs |
| `LOCAL_TOPIC_DATA` | 21 slugs × {title, image, alt, overview, specs[8]} |
| `AUDIENCE_PORTALS` | 5 portals × {image, fallback, heading, intro, links[5]} |
| `RESEARCH_HIGHLIGHTS` | 4 cards with local image + Unsplash fallback |
| `PROGRAM_CARDS` | 5 row cards with Unsplash images |
| `INTL_STATS` | 900+ students · 170+ MoUs · 95+ nationalities · 60+ collaborations |

### Key Components

- **`ImagePreloader`** — pre-fetches all 30+ images on mount (zero render lag)
- **`SmartImage`** — tries local src → Unsplash fallback → gradient (never breaks)
- **`AudiencePanel`** — inline slide-open section below hero (no popups)
- **`TopicPanel`** — inline side-by-side topic view (no popups)
- **`useCountUp`** + **`useInView`** — declared in top-level scope, no initialization errors
- **Google Maps iframe** — live embed at 12.8239° N, 80.0442° E

---

## File Map
```
srm-v6/
├── frontend/
│   ├── public/
│   │   ├── srm-ktr.jpg          ✅ included
│   │   ├── logo.png             ← ADD
│   │   ├── students-class.jpg   ← ADD
│   │   ├── faculty-lab.jpg      ← ADD
│   │   ├── parents-view.jpg     ← ADD
│   │   ├── visitors-gate.jpg    ← ADD
│   │   ├── alumni-network.jpg   ← ADD
│   │   ├── academic-research.jpg← ADD
│   │   ├── raman-block.jpg      ← ADD
│   │   ├── recent-projects.jpg  ← ADD
│   │   └── innovation-hub.jpg   ← ADD
│   └── src/
│       ├── App.jsx              ← 1563 lines, complete, zero truncations
│       ├── main.jsx
│       └── index.css
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── routers/
│       ├── auth_router.py
│       └── info_router.py
└── docker-compose.yml
```
