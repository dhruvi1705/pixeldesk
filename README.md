# 👾 PixelDesk — Retro Productivity Workspace

> A browser-based, pixel-art productivity operating system combining 8-bit desktop aesthetics with modern, distraction-free workflow tools.

PixelDesk delivers a retro desktop computing experience built entirely with modern web technologies. It features window management, a behavior-driven desktop companion, comprehensive productivity applications (Tasks, Notes, Calendar, Focus, Finance, Analytics), and a local-query AI Copilot foundation—all running locally in your browser with zero external tracking.

---

## 🎨 Design System & Visual Identity

PixelDesk is designed around a curated, mature 8-bit color palette with crisp pixel borders, hard drop shadows, and high-contrast readable typography:

- **Deep Navy (`#24324A`)** — Desktop canvas, system chrome, primary text, and solid borders
- **Warm Cream (`#F7F1E3`)** — Application surfaces, window bodies, and content cards
- **Muted Teal (`#4E9F9A`)** — Productivity highlights, completed states, and active focus mode
- **Coral (`#E76F51`)** — Primary call-to-action buttons, timers, and critical alerts
- **Golden Yellow (`#E9C46A`)** — Highlights, achievements, and calendar accents
- **Muted Lavender (`#8D86C9`)** — AI Copilot, notes pad, and creative personalization

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/) (Functional components, hooks, custom state management)
- **Bundler & Build Tool:** [Vite 8](https://vite.dev/)
- **Language:** JavaScript (ES Modules)
- **Styling:** Vanilla CSS with custom pixel design tokens (`src/styles/pixel.css`)
- **Icons:** Unicode retro emojis & [Lucide React](https://lucide.dev/)
- **Linter:** [Oxlint](https://oxc.rs/) for high-speed static code analysis
- **Data Persistence:** Browser `localStorage` (Client-side, privacy-first)

---

## 🚀 Implemented Applications & Features

PixelDesk currently includes 13 fully functional applications and system modules:

### 1. 🖥️ Launch & Boot Sequence
- Interactive retro boot loader with system diagnostic checks and animated launch sequences.

### 2. 🔐 Authentication UI Prototype
- Standalone retro login and signup window prototype (`AuthWindow`) simulating user profile switching with client-side form validation.

### 3. 🪟 Desktop Workspace & Window Manager
- Movable, focusable, minimizable retro windows powered by `PixelWindow`.
- Dynamic bottom **Dock** for one-click app launching and active state tracking.
- Top system **TopBar** featuring a live 12h/24h digital clock, theme controls, and device battery level indicator.

### 4. ⚙️ Settings
- System theme switcher (Default Navy/Cream, Warm Cream, Midnight Navy).
- Animation toggles, 12h / 24h clock format toggle, reduced motion accessibility mode, and factory reset actions.

### 5. 👤 Avatar Studio
- 8-bit character customizer allowing full styling of skin tone, hairstyle, hair color, eye expression, outfits, and accessories.
- Real-time sprite preview that persists to your desktop profile.

### 6. 🐾 Pixel Companion
- An interactive desktop companion residing on the wallpaper that dynamically reacts to your actions across the operating system:
  - **States:** `IDLE`, `WORKING`, `FOCUSING`, `BREAK`, `SLEEPING`, `WAKING`, `CELEBRATING`, `WRITING`, `CALENDAR`, `FINANCE`, `ANALYTICS`, and `ALERT`.
  - Reacts to completed tasks, active focus sessions, overdue items, note typing, and inactivity sleep timers.

### 7. 📋 Tasks App
- Task management with priority badges (`HIGH`, `MED`, `LOW`), categories (`Study`, `Work`, `Personal`, `Other`), and due dates.
- Filter tabs (`ALL`, `TODAY`, `UPCOMING`, `COMPLETED`), instant search, dynamic completion progress bars, and overdue warnings.

### 8. 📝 Notes App
- Retro scratchpad supporting pinned notes precedence, tag filters, color accents, and fast search.

### 9. 📅 Calendar App
- Monthly calendar grid with day agenda drawer.
- Create all-day or timed events, category labeling, and one-click "Today" navigation.

### 10. ⏱️ Focus / Pomodoro Timer
- Configurable Pomodoro focus timer with `Focus` (25m), `Short Break` (5m), and `Long Break` (15m) modes.
- Link active tasks directly to focus sessions, play completion chimes, persist running timer states across page reloads, and review today's deep work metrics.

### 11. 💰 Finance & Expense Tracker
- Personal expense and income logging with category breakdowns (`Food`, `Transport`, `Education`, `Shopping`, `Bills`, `Salary`, `Freelance`, etc.).
- Formatted in Indian Rupees (`₹`), monthly expense/income summaries, surplus/deficit calculation, and date filters.

### 12. 📊 Analytics Dashboard
- Productivity overview aggregating data from all local stores over `7d`, `30d`, `Current Month`, or `All Time`.
- 100% CSS-based pixel chart visualizations for task completion rates, daily focus distributions, and expense category breakdowns.

### 13. 🤖 AI Copilot (v0.9 Foundation)
- Native chat interface with retro robot styling and live conversation thread.
- **Deterministic Local Workspace Query Engine:** Instant answers for supported workspace queries derived directly from real local data:
  - *"What tasks are due today?"*
  - *"Summarize my upcoming calendar."*
  - *"How much focus time did I complete this week?"*
  - *"Summarize my spending this month."*
  - *"Give me an overview of my productivity."*
- **Live Context Inspector Panel:** Read-only snapshot of all connected stores.
- **AI Service Boundary:** Prepared architectural interface (`src/utils/copilotService.js`) designed to route to a secure backend endpoint in future versions without exposing frontend secrets.
- **Honest Mode:** Clearly explains when an unsupported query requires a connected AI backend model, without using fake canned replies.

---

## 💾 Data Architecture & Storage

All user data is stored strictly in client-side `localStorage` with zero network transmission. Missing or malformed data is handled gracefully with safe parsing fallbacks.

| Key | Description |
| :--- | :--- |
| `pixeldesk_avatar` | User avatar customization config (skin, hair, outfit, accessories) |
| `pixeldesk_tasks` | User task list, priorities, categories, and completion states |
| `pixeldesk_notes` | Notes records, tags, pinned status, and content |
| `pixeldesk_events` | Calendar event records with dates and time slots |
| `pixeldesk_focus_sessions` | Completed Pomodoro focus session history |
| `pixeldesk_focus_settings` | Focus timer durations and chime preferences |
| `pixeldesk_focus_timer_state` | Snapshot of active running/paused timer state |
| `pixeldesk_transactions` | Financial income and expense transaction records |
| `pixeldesk_settings` | System preferences (theme, clock format, animations) |

> ℹ️ **Note on Persistence:** Current data is stored entirely in the local browser session. Multi-user cloud synchronization and backend database storage are planned for future versions.

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/dhruvi1705/pixeldesk.git
cd pixeldesk
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Code Linting

Run Oxlint to check code quality and static typing rules:

```bash
npm run lint
```

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📸 Portfolio Showcase & Screenshots Guide

When capturing screenshots for portfolio presentations or documentation:
1. **Launch Screen (`/`)**: Showcases retro typewriter boot loader.
2. **Desktop Workspace (`/desktop`)**: Displays full retro window desktop with tiled wallpaper, active top bar, and bottom dock.
3. **Avatar Studio & Companion**: Highlights 8-bit avatar customization and responsive behavior-driven desktop companion.
4. **Productivity Apps**: Showcases Tasks, Notes, Calendar, Pomodoro Timer, Finance Tracker, and Analytics dashboard.
5. **AI Copilot (Local Query Engine)**: Demonstrates deterministic workspace calculations (tasks due today, weekly focus, monthly expenses).

---

## 🗺️ Roadmap & Limitations

### Current Version (v0.9)
- ✅ Fully client-side retro desktop operating system
- ✅ 13 functional productivity & creative applications
- ✅ Local deterministic workspace query engine
- ✅ Behavior-driven desktop avatar companion
- ✅ Zero-tracking local storage architecture

### Planned Future Work
- 🔮 **Backend API Services:** Secure multi-user authentication and session management
- 🔮 **Cloud Database:** PostgreSQL persistence and cross-device sync
- 🔮 **Connected AI Models:** Backend-mediated LLM integration for open-ended brainstorming, note structuring, and natural language workspace management
