# Launch Intel × Rendyr Feed Sync Plan

## Vision
Merge Launch Intel's competitive analysis capabilities with Rendyr's AI launch feed, wrapped in a **Y2K/Windows 98/early MySpace** aesthetic that's blazing fast and interactive.

---

## What Launch Intel Does (from transcript)

**Core Features:**
1. **Auto-monitors** AI launches across Twitter, YouTube, LinkedIn
2. **Real-time filtering & classification** (signal, not noise)
3. **Deep analysis** of each launch:
   - **"Aha" Moment** - What makes it scroll-stopping
   - **Friction/Complaints** - User pain points from replies
   - **Timeline Structure** - Second-by-second pacing breakdown
   - **Marketing Strategy** - Positioning + distribution engine
   - **Target Audience** - Who + how they're distributing
   - **Community Reaction** - Real-time sentiment + top 3 user asks
4. **One-click briefing generation** - 60-sec competitive brief script
5. **HeyGen video generation** - Renders briefing as video inline
6. **Speed** - 2 minutes total (vs hours manual work)

---

## What Rendyr Feed Currently Does

**Current:**
- Aggregates YouTube videos (94 videos, real API data)
- Aggregates X posts (5 sample posts)
- Aggregates Meta ads (10 sample ads)
- Simple grid layout with thumbnails
- Filters by company
- Tabs for "Product Launches" vs "Meta Ads"

**Missing:**
- No competitive analysis
- No sentiment tracking
- No marketing strategy breakdown
- No briefing generation
- No inline video playback
- Modern dark theme (not Y2K vibes)

---

## Sync Strategy: 3-Phase Rollout

### Phase 1: Data Model Expansion ⚡
**Goal:** Add Launch Intel analysis fields to each video entry

**New data structure:**
```typescript
interface LaunchEntry {
  // Existing fields
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
  source: "youtube" | "x" | "linkedin";
  
  // NEW: Launch Intel analysis
  intel?: {
    ahaмомент: string;                    // What makes it scroll-stopping
    friction: string[];                   // Top pain points from replies
    timeline: TimelineBreakdown[];        // Second-by-second structure
    marketingStrategy: {
      positioning: string;
      distributionEngine: string;
    };
    targetAudience: {
      who: string;
      distributionChannels: string[];
    };
    communityReaction: {
      sentiment: "positive" | "mixed" | "negative";
      topAsks: string[];                  // Top 3 things users want
    };
    
    // Auto-generated assets
    briefingScript?: string;              // 60-sec script
    briefingVideoUrl?: string;            // HeyGen video URL
    generatedAt?: string;
  };
}
```

**Implementation:**
- Extend YouTube/X scrapers to capture reply threads
- Add sentiment analysis (GPT-4 mini or Claude Haiku for speed)
- Store analysis in separate `launch_intel.json` files per video
- API route merges base video data + intel analysis

---

### Phase 2: Y2K UI Redesign 🎨
**Goal:** Windows 98 aesthetic with modern speed

**Design Language:**
- **Colors:** Light gray (#C0C0C0), Windows blue (#0000A0), system fonts
- **Borders:** 2px outset/inset borders (classic 3D effect)
- **Fonts:** `font-family: "MS Sans Serif", Tahoma, Arial, sans-serif`
- **Buttons:** Raised 3D buttons with hover states
- **Windows:** Draggable title bars with minimize/maximize/close
- **Scrollbars:** Custom chunky scrollbars (Windows 98 style)
- **Icons:** 16x16 pixel art icons
- **Animations:** Instant (no slow fades), but smooth drag/drop

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│  Launch Intel - [Microsoft Internet     │ ← Title bar
│  Explorer]                         _ □ X │
├─────────────────────────────────────────┤
│ File  View  Favorites  Tools  Help      │ ← Menu bar
├─────────────────────────────────────────┤
│ ← → ⟳ 🏠 🔍  Address: launch-intel.com  │ ← Toolbar
├─────────────────────────────────────────┤
│ ┌─ Filters ──────┐  ┌─ Feed ──────────┐│
│ │ ☑ YouTube      │  │ [Video Card 1]  ││
│ │ ☑ Twitter      │  │ [Video Card 2]  ││
│ │ ☐ LinkedIn     │  │ [Video Card 3]  ││
│ │                │  │ [Video Card 4]  ││
│ │ Company:       │  └─────────────────┘│
│ │ [All ▼]        │                      │
│ │                │  ┌─ Analysis Panel ─┐│
│ │ [Apply Filter] │  │ (Slides in when  ││
│ └────────────────┘  │  you click card) ││
│                     └──────────────────┘│
├─────────────────────────────────────────┤
│ Status: Ready | 94 launches loaded      │ ← Status bar
└─────────────────────────────────────────┘
```

**Video Cards (Y2K style):**
```
┌─────────────────────────────┐
│ ┌─ [Thumbnail] ────────────┐│
│ │                          ││
│ │  [Play button overlay]   ││
│ │                          ││
│ └──────────────────────────┘│
│                              │
│ OpenAI - Sora Turbo Launch  │
│ 3 hours ago • 2.4K views    │
│                              │
│ ┌──────────┐  ┌───────────┐│
│ │ Watch 🎬 │  │ Analyze 🔍││
│ └──────────┘  └───────────┘│
└─────────────────────────────┘
```

**Analysis Panel (slides from right):**
```
┌─ Competitive Intel ───────────────── □ X ┐
│                                           │
│ 📊 Aha Moment                             │
│ ─────────────────────────────────────────│
│ 7x faster video generation with same     │
│ quality. First to ship instant previews. │
│                                           │
│ 🚨 Friction & Complaints                  │
│ ─────────────────────────────────────────│
│ • "Still no Android app"                  │
│ • "Pricing too high for indie creators"   │
│ • "Export takes forever"                  │
│                                           │
│ 🎯 Marketing Strategy                     │
│ ─────────────────────────────────────────│
│ Positioning: Speed as core differentiator│
│ Distribution: Twitter → YouTube → Reddit  │
│                                           │
│ 👥 Target Audience                        │
│ ─────────────────────────────────────────│
│ Content creators, agencies, marketers    │
│                                           │
│ 💬 Community Vibe                         │
│ ─────────────────────────────────────────│
│ Sentiment: 😊 Positive (87%)              │
│ Top Asks:                                 │
│ 1. Android app                            │
│ 2. Lower pricing tiers                    │
│ 3. Faster exports                         │
│                                           │
│ ┌─────────────────────────────────────┐  │
│ │ Generate 60-Sec Brief 🎥            │  │
│ └─────────────────────────────────────┘  │
│                                           │
│ Status: Analysis complete (1.2s)          │
└───────────────────────────────────────────┘
```

---

### Phase 3: Briefing Generation Integration 🎥
**Goal:** One-click competitive briefing (script → HeyGen video)

**Flow:**
1. User clicks "Generate Brief" button
2. GPT-4 writes 60-sec script using intel data
3. Script displays in panel (editable)
4. "Generate Video" button appears
5. Calls HeyGen API (your existing integration)
6. Video renders inline with progress bar
7. When done, plays in panel with share button

**Tech Stack:**
- **Script generation:** GPT-4 (fast, high quality)
- **Video generation:** HeyGen API (you already have this)
- **Video player:** HTML5 `<video>` with custom controls (Y2K styled)

---

## Y2K Design System Details

### Color Palette
```css
--win98-gray: #C0C0C0;
--win98-blue: #0000A0;
--win98-dark-gray: #808080;
--win98-light-gray: #DFDFDF;
--win98-white: #FFFFFF;
--win98-black: #000000;
--win98-teal: #008080;  /* Active title bar */
```

### Typography
```css
font-family: "MS Sans Serif", "Microsoft Sans Serif", Tahoma, Arial, sans-serif;
font-size: 11px;  /* System default */
```

### Borders (3D effect)
```css
/* Raised (buttons, panels) */
border-top: 2px solid #FFFFFF;
border-left: 2px solid #FFFFFF;
border-bottom: 2px solid #808080;
border-right: 2px solid #808080;

/* Sunken (text inputs, scrollable areas) */
border-top: 2px solid #808080;
border-left: 2px solid #808080;
border-bottom: 2px solid #FFFFFF;
border-right: 2px solid #FFFFFF;
```

### Scrollbar Styling
```css
/* Custom chunky scrollbar */
::-webkit-scrollbar {
  width: 16px;
  background: #C0C0C0;
}

::-webkit-scrollbar-thumb {
  background: #DFDFDF;
  border: 2px outset #C0C0C0;
}

::-webkit-scrollbar-button {
  height: 16px;
  background: #C0C0C0;
  border: 2px outset #C0C0C0;
}
```

### Buttons
```css
.win98-button {
  background: #C0C0C0;
  border: 2px solid;
  border-top-color: #FFFFFF;
  border-left-color: #FFFFFF;
  border-bottom-color: #808080;
  border-right-color: #808080;
  padding: 4px 12px;
  font-family: "MS Sans Serif", sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.win98-button:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-bottom-color: #FFFFFF;
  border-right-color: #FFFFFF;
}
```

---

## Implementation Checklist

### Data & Backend
- [ ] Extend video data model with `intel` fields
- [ ] Add reply scraping to YouTube/X scrapers
- [ ] Implement sentiment analysis (GPT-4 mini)
- [ ] Create `/api/launch-intel` endpoint
- [ ] Add briefing script generation endpoint
- [ ] Integrate HeyGen video generation

### UI Components
- [ ] Create `<Window98>` component (draggable, title bar, etc.)
- [ ] Create `<Button98>` component (3D borders, hover states)
- [ ] Create `<ScrollArea98>` component (chunky scrollbars)
- [ ] Create `<LaunchCard98>` component (video cards with Y2K styling)
- [ ] Create `<AnalysisPanel>` component (slides from right)
- [ ] Create `<BriefingGenerator>` component (script → video flow)
- [ ] Add custom cursor (Windows pointer)

### Styling
- [ ] Import MS Sans Serif font (or close alternative)
- [ ] Create Y2K color palette CSS variables
- [ ] Style all borders with 3D inset/outset
- [ ] Custom scrollbar styling
- [ ] Add pixel art icons (16x16)

### Features
- [ ] Launch Intel analysis on all video entries
- [ ] Clickable cards open analysis panel (slide animation)
- [ ] "Generate Brief" button triggers script generation
- [ ] "Generate Video" button triggers HeyGen render
- [ ] Video plays inline when ready
- [ ] Share button copies brief URL

### Performance
- [ ] Lazy load video thumbnails
- [ ] Cache intel analysis (don't regenerate every load)
- [ ] Debounce filter changes
- [ ] Virtual scrolling for long lists
- [ ] Prefetch analysis on hover

---

## File Structure

```
dashboard/
├── app/
│   └── (share)/
│       └── launch-intel/
│           ├── page.tsx          # Main Y2K interface
│           ├── components/
│           │   ├── Window98.tsx
│           │   ├── Button98.tsx
│           │   ├── ScrollArea98.tsx
│           │   ├── LaunchCard98.tsx
│           │   ├── AnalysisPanel.tsx
│           │   └── BriefingGenerator.tsx
│           └── styles/
│               └── win98.css      # Y2K design system
├── public/
│   ├── data/
│   │   └── launch_intel/
│   │       ├── youtube_intel.json
│   │       └── x_intel.json
│   └── icons/
│       └── win98/                # 16x16 pixel art icons
└── api/
    ├── launch-intel/
    │   ├── route.ts              # Fetch intel analysis
    │   ├── generate-brief/
    │   │   └── route.ts          # GPT-4 script generation
    │   └── generate-video/
    │       └── route.ts          # HeyGen video render
```

---

## Speed Optimizations (Keep It Fast!)

1. **Instant analysis cache** - Store intel in JSON, regenerate only on new launches
2. **Streaming script generation** - Show script as GPT-4 writes (SSE)
3. **HeyGen queue** - Background video generation, notify when ready
4. **Virtual scrolling** - Only render visible cards (react-window)
5. **Prefetch on hover** - Load analysis panel before click
6. **Service worker** - Cache static assets, offline support

---

## MVP Feature Parity

**Launch Intel features to include:**
- ✅ Auto-monitor launches (YouTube + X already done)
- ✅ Real-time filtering (company dropdown exists)
- ⏳ Deep analysis (NEW - intel fields)
- ⏳ One-click briefing (NEW - GPT-4 script)
- ⏳ Video generation (NEW - HeyGen integration)
- ⏳ Inline video playback (NEW - custom player)

**Timeline:**
- Phase 1 (Data Model): 2-3 days
- Phase 2 (Y2K UI): 3-4 days
- Phase 3 (Briefing Gen): 2-3 days
- **Total: ~1.5 weeks to MVP**

---

## Example: Full Launch Intel Card (Y2K Style)

```tsx
<Window98 title="OpenAI - Sora Turbo Launch" width={800}>
  <div className="win98-panel">
    {/* Video Preview */}
    <div className="win98-sunken-border">
      <VideoPlayer src="..." />
    </div>
    
    {/* Analysis Tabs */}
    <TabStrip98>
      <Tab98 label="📊 Aha Moment">
        <p>7x faster generation, instant previews...</p>
      </Tab98>
      <Tab98 label="🚨 Friction">
        <ul>
          <li>No Android app</li>
          <li>Pricing too high</li>
        </ul>
      </Tab98>
      <Tab98 label="🎯 Strategy">
        <p>Positioning: Speed as differentiator...</p>
      </Tab98>
      <Tab98 label="💬 Community">
        <SentimentMeter value={87} />
      </Tab98>
    </TabStrip98>
    
    {/* Briefing Generator */}
    <BriefingGenerator launch={launch} />
  </div>
</Window98>
```

---

## Y2K Inspiration References

**Visual Style:**
- Windows 98 desktop/explorer
- Early MySpace (2003-2005) profile pages
- AIM (AOL Instant Messenger) buddy list
- WinAmp skins (Milkdrop visualizer)
- GeoCities personal websites
- MSN Messenger conversations

**Key Aesthetic Elements:**
- Chunky 3D borders everywhere
- Light gray backgrounds (#C0C0C0)
- Blue title bars with white text
- 16x16 pixel icons
- System fonts (MS Sans Serif, Tahoma)
- No smooth animations (instant state changes)
- Draggable windows with minimize/maximize
- Custom cursor (Windows pointer)

---

## Next Steps

1. **Review this plan** - Make sure vision aligns
2. **Prioritize features** - What's MVP vs nice-to-have?
3. **Design mockup** - Create 1-2 screens in Y2K style (Figma/Sketch/hand-drawn)
4. **Data model first** - Extend video entries with intel fields
5. **Build Y2K design system** - Create reusable components
6. **Implement analysis pipeline** - GPT-4 sentiment + strategy extraction
7. **Wire up briefing gen** - Script → HeyGen → inline player
8. **Polish & ship** - Fast, interactive, Y2K vibes ✨

---

**Questions?**
- Which Phase do you want to tackle first?
- Should we prototype the Y2K UI in a separate `/y2k-demo` route?
- Do you have HeyGen API already set up, or need integration help?
- Any specific Launch Intel features that are highest priority?

Ready to build when you are. 🧭
