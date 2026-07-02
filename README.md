# SafeSite AI — Construction Safety Compliance Platform

                                              https://safesite-ai-nine.vercel.app/

**SafeSite AI** is a premium, enterprise-grade Construction Safety Operating System designed for site supervisors, safety marshals, and operations managers. It acts as an automated safety gatekeeper, verifying personnel identities, auditing trade guidelines, and classifying PPE compliance in real-time.

Designed with an **Enterprise Industrial Design System** inspired by Honeywell Forge, Autodesk Construction Cloud, and Procore, this platform enforces a strict Zero-Harm compliance perimeter at construction entry points and hazardous zones.

---

## 🚀 Key Platform Capabilities

### 1. Biometric Inspection Terminal
- **Live Video Scanner:** Integrates with local webcam feeds to paint real-time facial and item boundary coordinate overlays.
- **In-Browser Pixel Classifier:** Employs a real-time pixel analysis heuristic that downscales frames and maps HSL values to identify **White**, **Yellow**, **Blue**, **Green**, **Red**, and **Orange** helmets and reflective neon vests.
- **Checklist Scan Timeline:** Ticks timestamped diagnostic log entries step-by-step as checkpoints clear.

### 2. Speech Synthesis Voice Guidance
- Powered by the native Web Speech API (`SpeechSynthesis`) to announce checks vocally.
- Welcomes recognized workers by name, announces trade rule loadups, calls out omitted items, and reads final access approvals/denials.

### 3. AI Safety Copilot
- An interactive natural language assistant panel built into the command deck.
- Performs client-side NLP query parsing to filter logs, flag repeat offenders, count safety violations, and compile CSV report spreadsheets.

### 4. CCTV Site Monitors & Siren Alerts
- Multi-cam continuous feed panel monitoring scaffolding, excavation, crane, and electrical zones.
- **Critical Siren Alarms:** Simulates fall accidents by triggering a continuous Web Audio siren loop, flashing red overlays, loading medical profile details (blood groups, emergency contacts), and dispatching safety alerts.

### 5. Notion/Jira Style Databases
- Features information-dense, high-contrast tables and directories.
- Built-in search, trade group configuration filters, details inspector drawers, and CSV compilers.

---

## 🎨 Design System Specifications

SafeSite AI avoids the typical flashy SaaS aesthetics and implements a structured, trustworthy HMI console layout:

- **55% Neumorphism:** Precision-machined cards (`neumorph-card`) and inset boxes (`neumorph-inset`) utilizing tight `12px` and `14px` border radii and double outset/inset shadows.
- **30% Glassmorphism:** Glass filters are restricted strictly to sticky headers (`glass-nav`), collapsible sidebars, and alerts popups.
- **15% Minimalist Layout:** Spacing conforms to an 8-point grid with 24px container padding and 12px margins, prioritizing raw data visibility over empty whitespace.
- **Bold Stat Typography:** Key values dominate grids (large counts are rendered on top, with subtext labels directly below).

---

## 🛠️ Technology Stack

- **Core Framework:** React 18, TypeScript, Vite
- **Styling Engine:** Tailwind CSS v4, Vanilla CSS variables
- **Motion & Transitions:** Framer Motion (subtle Native-style 150ms scales and fades)
- **Visual Telemetry:** Recharts (restrained single-stroke, no gradients, minimal grids)
- **Audio Synthesizer:** Web Audio API (custom sound oscillators for scans and siren loops)
- **Voice Guidance:** Web Speech Synthesis API
- **Iconography:** Lucide React

---

## 📂 Folder Architecture

```
/safe-site-ai
├── dist/                     # Clean production bundles (HTML, CSS, JS)
├── src/
│   ├── components/
│   │   ├── Layout.tsx        # Collapsible Sidebar & System Clock TopNav
│   │   ├── GlassCard.tsx     # Neumorphic precision panel wrapper
│   │   ├── SafetyCopilot.tsx # Natural language assistant chat widget
│   │   └── WebcamScanner.tsx # Inspection console video pixel classifier
│   ├── context/
│   │   ├── AppContext.tsx    # State database, local storage synchronizer
│   │   └── ThemeContext.tsx  # Dark / Light theme controllers
│   ├── pages/
│   │   ├── LandingPage.tsx   # Operational Gate Entrance portal
│   │   ├── Login.tsx         # Credentials gatekeeper login panel
│   │   ├── Dashboard.tsx     # Command center stats and charts
│   │   ├── LiveCamera.tsx    # Terminal webcam wrapper
│   │   ├── CCTV.tsx          # Multi-cam site monitor alerts panel
│   │   ├── WorkerManagement.tsx # Access profile creation directory
│   │   ├── Departments.tsx   # Trade PPE rules editor card grid
│   │   ├── EntryLogs.tsx     # Audit trails filter tables
│   │   ├── Incidents.tsx     # Access violations logs
│   │   ├── Settings.tsx      # Hub sites and database wipes
│   │   └── Profile.tsx       # Operator clearance cards
│   ├── utils/
│   │   ├── mockData.ts       # Type definitions & blank data arrays
│   │   ├── sound.ts          # Synthesized sweep chimes
│   │   ├── speech.ts         # Voice synthesis engine
│   │   └── helpers.ts        # CSV download compiler
│   ├── App.tsx               # Route guard maps
│   ├── main.tsx              # React mounting root
│   └── index.css             # Theme style presets
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
Clone or open the workspace folder in your shell and install packages:
```bash
npm install
```

### 2. Launch Local Console
Run the local Vite development server:
```bash
npm run dev
```
Navigate to the local address (usually `http://localhost:5173`) in your browser.

### 3. Compile Production Bundle
To build a minified, type-safe production package:
```bash
npm run build
```
The compiled assets will be built inside the `/dist` directory.

---

## ☁️ Vercel Deployment

This repository is pre-configured with a root `vercel.json` rewrite routing parameter to seamlessly deploy to Vercel as a single-page application.

### Build and Deploy Settings:
* **Framework Preset:** `Vite` (or `Other` if Vite is not pre-listed)
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Install Command:** `npm install`

Direct navigation and browser refreshes on internal sub-pages (e.g. `/dashboard`, `/login`) will route correctly back to the main console view.

---

## 🧪 Testing Scenarios

1. **Pristine State:** The application initializes empty of any mock transaction records.
2. **Access Profile Creation:** Navigate to **Worker Access**, click **Register Access Profile**, and create a worker (e.g. assigning them a Trade Group like *Civil Labour* or *Electrical Engineer*).
3. **Run Safety Checks:** Navigate to **Live Inspection** and click **Run Safety Scan**. You can test the browser's pixel color computer vision by selecting **Live Pixel CV** and holding up colored cards, or toggle **Scenario Presets** to test check-in violations.
4. **Natural Language Queries:** Return to the **Dashboard** and type *"Show today's denied entries"* or click *"Flag Repeat Offenders"* inside the Safety Copilot widget.
5. **Continuous Sirens:** Open **CCTV Site Monitors** and click **Simulate Fall Event** to trigger the Web Audio saw-wave siren loops.
