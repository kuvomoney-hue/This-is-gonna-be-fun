# 🎯 Mission Control

Personal command center dashboard for Big Papa — crypto trader & creative director.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

---

## Quick Start

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard overview — bot status, trading summary, schedule, weather |
| `/trading` | Full trading view — chart, signal log, context filter |
| `/tasks` | Task manager with Today / This Week / Someday groups |
| `/projects` | Project cards with progress sliders |
| `/scout` | Scout AI agent status, activity log, stats |

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom forest-green dark palette)
- **Recharts** (account value line chart)
- **Lucide React** (icons)

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0f0a` | Page background |
| Surface | `#111811` | Cards |
| Primary | `#14591D` | Active nav, buttons |
| Primary Bright | `#1a7a27` | Hover states |
| Text Primary | `#e8f5e9` | Main text |
| Text Secondary | `#81c784` | Labels, muted text |
| Border | `#1e3320` | Card borders |
| Success | `#4caf50` | Positive P&L, approved |
| Danger | `#ef5350` | Negative P&L, rejected |

---

## File Structure

```
dashboard/
├── app/
│   ├── layout.tsx           # Root layout with sidebar
│   ├── page.tsx             # Dashboard home
│   ├── trading/page.tsx     # Trading page
│   ├── tasks/page.tsx       # Tasks page
│   ├── projects/page.tsx    # Projects page
│   ├── scout/page.tsx       # Scout agent page
│   └── globals.css          # Global styles + Google Fonts
├── components/
│   ├── Sidebar.tsx          # Fixed left nav (desktop) / bottom tab bar (mobile)
│   ├── Card.tsx             # Reusable dark card with green glow hover
│   ├── Badge.tsx            # Status badges (Online, APPROVED, LONG, CHOPPY…)
│   ├── StatCard.tsx         # Number + label + optional change %
│   ├── ProgressBar.tsx      # Green gradient progress bar
│   └── SignalRow.tsx        # Signal log table row
├── lib/
│   └── mockData.ts          # All mock data (swap with API later)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Adding Real Data

All mock data lives in `lib/mockData.ts`. To plug in real data:

1. Replace exports with API calls (use `async` server components or SWR/React Query)
2. Keep the same TypeScript interfaces — components won't need changes
3. Add `.env.local` for API keys

---

## Roadmap (V2)

- [ ] Live BTC price via CoinGecko API
- [ ] Connect Scout agent via API
- [ ] Google Tasks sync
- [ ] WebSocket for real-time signal updates
- [ ] Dark/light theme toggle
- [ ] Auth (Clerk or NextAuth)
