# New Mission Control Architecture

*Built: 2026-02-28 03:35 AM PST*
*Ready by: Morning (6-8 hours)*

---

## Core Principle

**Second brain philosophy applied to dashboards:**
- Context-aware (load relevant data instantly)
- Atomic components (one purpose per widget)
- Shareable links (clean, no auth, purpose-specific)
- Self-updating (data pusher + auto-refresh)

---

## Five Separate Dashboards

### 1. Mission Control (Main - John Only)

**URL:** `https://this-is-gonna-be-fun.vercel.app/`

**Purpose:** Your command center. Everything at a glance.

**Sections:**
- Quick stats (trading, woof, rendyr)
- Context loader (load project context into Scout)
- Today's focus (what matters right now)
- Recent activity (signals, Instagram, inventory changes)
- Quick actions (graduate, ideas, trace)
- Second brain stats (permanent notes, structure notes, growth)

**Design:** Dark, dense, information-rich. For you, not visitors.

---

### 2. Rendyr View (Dylan)

**URL:** `https://this-is-gonna-be-fun.vercel.app/rendyr`

**Purpose:** Clean Rendyr stats for Dylan to monitor.

**Sections:**
- Instagram growth (chart + current followers)
- Weekly digest preview (latest items)
- AI video feed (embedded)
- Email flow status (which flows live)
- Revenue stats (when Shopify connected)
- Content calendar (upcoming)

**Design:** Clean, minimal, lowercase brand voice. Shareable link, no password.

---

### 3. WayofWoof View (Amanda)

**URL:** `https://this-is-gonna-be-fun.vercel.app/wayofwoof`

**Purpose:** Production dashboard for Amanda.

**Sections:**
- Inventory status (real-time from Google Sheets)
- Low stock alerts
- Recent batches logged
- Production capacity (PB + HM units)
- Instagram growth
- Milestone checklist
- Quick inventory update (mobile-friendly)

**Design:** Clean, warm, dog-first aesthetic. Mobile-optimized. Shareable.

---

### 4. AI Video Feed (Public)

**URL:** `https://this-is-gonna-be-fun.vercel.app/videos`

**Purpose:** Shareable AI video aggregator.

**Current:** Already exists at `/share/videos` (no nav)

**Enhancement:**
- Keep existing feed
- Add filters (by source, by brand)
- Add search
- Cleaner mobile layout
- RSS feed output option

**Design:** Minimal, fast, no branding. Just content.

---

### 5. Meta Ads Feed (Working Version)

**URL:** `https://this-is-gonna-be-fun.vercel.app/ads`

**Purpose:** Meta Ad Library scraper for AI tools.

**Current Status:** Abandoned (keyword search returned irrelevant results)

**New Approach:**
- Scrape by advertiser page ID (not keyword)
- Target specific AI companies directly
- Show ads in grid format
- Filter by active/inactive
- Track ad creative changes

**Design:** Grid view, filter sidebar, clean and fast.

---

## Technical Architecture

### Data Layer (No Changes)

**Stays the same:**
- `public/data/*.json` files
- Data pusher every 30 min
- Git push → Vercel deploy
- Dual-write to Obsidian

**New additions:**
- `public/data/meta_ads_new.json` (working scraper)
- `public/data/mission_control.json` (consolidated stats for main dashboard)

### Component Architecture

**Atomic components (reusable):**
- `<StatCard />` - Single metric with trend
- `<ContextLoader />` - Load project context into Scout
- `<RecentActivity />` - Timeline of events
- `<QuickAction />` - Command shortcuts
- `<InstagramChart />` - Growth over time
- `<InventoryTable />` - Stock levels
- `<VideoGrid />` - Video feed
- `<AdGrid />` - Meta ads

**Page-specific compositions:**
- Main: All components, full context
- Rendyr: Instagram + videos + digest
- WayofWoof: Inventory + production + milestones
- Videos: Just grid, filters, search
- Ads: Just grid, filters, scraper status

### URL Structure

```
/ → Mission Control (main, full dashboard)
/rendyr → Rendyr view (shareable, clean)
/wayofwoof → WayofWoof view (shareable, Amanda-focused)
/videos → AI video feed (public, minimal)
/ads → Meta ads feed (public, filterable)

/trading → Keep existing (detailed trading view)
/woof → Redirect to /wayofwoof (consolidate)

/api/health → System health check
/api/context → Context loader endpoint (new)
/api/inventory/data → Inventory data
/api/robinhood → Robinhood account
/api/videos → Video feed
/api/ads → Meta ads (new)
```

---

## Meta Ads Scraper (Fix)

### Why Original Failed

**Problem:** Keyword search in Meta Ad Library returns ads CONTAINING keyword, not ads BY advertiser.

**Example:** Search "HeyGen" → Returns ads for "Nexgen", "GenRight", random matches.

**Result:** Irrelevant, low signal.

### New Approach

**Use advertiser page IDs directly:**

```python
# Target specific AI companies
advertisers = {
    "HeyGen": "page_id_123456",      # Get from their FB page
    "Runway": "page_id_789012",
    "Midjourney": "page_id_345678",
    "OpenAI": "page_id_901234",
    # etc...
}

# Scrape each advertiser's active ads
for name, page_id in advertisers.items():
    ads = scrape_advertiser_ads(page_id)
    # Returns ONLY ads from that company
```

**How to get page IDs:**
1. Go to company Facebook page
2. View page source
3. Find `page_id` in meta tags
4. OR use Meta Ad Library API with page name

**Result:** Clean, relevant ads from target companies only.

### Scraper Architecture

**Script:** `bot/meta_ads_scraper_v2.py`

**Process:**
1. List of 20-30 AI companies with page IDs
2. For each company:
   - Scrape active ads via Meta Ad Library API (or Playwright)
   - Extract: creative, copy, CTA, start date, reach estimate
   - Save to JSON
3. Output to `public/data/meta_ads_new.json`
4. LaunchAgent runs daily (not every 30 min - API limits)

**API vs Scraping:**
- Meta Ad Library has public API (no key needed for read)
- Playwright fallback if API fails
- Rate limit: 1 company per 2 seconds (avoid blocks)

**Data structure:**
```json
{
  "companies": [
    {
      "name": "HeyGen",
      "page_id": "123456",
      "ads": [
        {
          "id": "ad_789",
          "creative_url": "https://...",
          "headline": "Create AI Avatars in Minutes",
          "body": "...",
          "cta": "Learn More",
          "start_date": "2026-02-15",
          "active": true
        }
      ],
      "total_active": 12
    }
  ],
  "_updated": "2026-02-28T03:35:00Z"
}
```

---

## Mission Control Main Dashboard

### Layout

**Top Bar:**
- Current time
- Weather
- Context loader (dropdown: trading/woof/rendyr/all)
- Quick actions (graduate, ideas, trace buttons)

**Main Grid (3 columns):**

**Left Column - Trading:**
- Account balance (Robinhood + Binance)
- Recent signals (last 5)
- Context filter status
- Win rate (if available)

**Middle Column - Focus:**
- Today's intention (from daily note)
- Recent activity timeline:
  - Signal approved/rejected
  - Instagram milestone
  - Inventory change
  - Batch logged
- Quick stats:
  - Permanent notes: 15
  - Structure notes: 3
  - Last graduate: 2 hours ago

**Right Column - Projects:**
- WayofWoof:
  - Inventory alerts (if any)
  - Instagram: 1,079 followers
  - Next milestone: Label approval
- Rendyr:
  - Instagram: 13,757 followers
  - Latest digest: 40 items
  - Videos: 30 new

**Bottom Bar:**
- Links to: /rendyr, /wayofwoof, /videos, /ads, /trading
- System health indicator
- Last data refresh: X min ago

---

## Build Order (Next 4-6 Hours)

### Phase 1: Meta Ads Scraper (60 min)
1. Research Meta Ad Library API
2. Get page IDs for 20 AI companies
3. Build `meta_ads_scraper_v2.py`
4. Test scraper (get real ads)
5. Output to JSON
6. Create LaunchAgent (daily 9 AM)

### Phase 2: Mission Control Main (90 min)
1. Build atomic components
2. Create `/app/page.tsx` (new main dashboard)
3. Context loader integration
4. Recent activity timeline
5. Quick actions (graduate, ideas, trace)
6. Second brain stats

### Phase 3: Rendyr View (45 min)
1. Create `/app/rendyr/page.tsx`
2. Instagram chart component
3. Video feed embed
4. Weekly digest preview
5. Clean, lowercase design

### Phase 4: WayofWoof View (45 min)
1. Create `/app/wayofwoof/page.tsx` (replace /woof)
2. Inventory table with alerts
3. Batch log display
4. Milestone checklist
5. Mobile-optimized layout

### Phase 5: Ads Dashboard (45 min)
1. Create `/app/ads/page.tsx`
2. Ad grid component
3. Filter sidebar
4. Scraper status indicator
5. Refresh button

### Phase 6: Deploy & Test (45 min)
1. Test all 5 dashboards locally
2. Verify Meta ads scraper works
3. Push to GitHub
4. Vercel deploy
5. Verify production
6. Test shareable links

**Total: ~6 hours (ready by 9:30 AM PST)**

---

## Success Criteria

**When you wake up:**

✅ Mission Control shows all projects at a glance
✅ Can load context (trading/woof/rendyr) with one click
✅ Recent activity timeline shows what happened overnight
✅ Second brain stats visible (15 permanent notes, 3 structure notes)

✅ /rendyr shareable with Dylan (Instagram + videos + digest)
✅ /wayofwoof shareable with Amanda (inventory + production)
✅ /videos public feed (clean, fast, filterable)
✅ /ads showing real AI company ads (HeyGen, Runway, etc.)

✅ Meta ads scraper working (20+ companies tracked)
✅ All data fresh (last refresh <30 min)
✅ Mobile-friendly (Amanda can use on phone)
✅ Fast (<2 sec load time)

---

## Design Principles

**From Second Brain:**
- Atomic components (one purpose each)
- Context-aware (load relevant data)
- Link explicitly (no mystery data sources)
- Self-maintaining (auto-refresh)

**From Greg's Workflow:**
- Commands accessible (integrate graduate/ideas/trace)
- Context loader prominent (never re-explain)
- Recent activity visible (what happened)
- Cross-domain insights (connect trading + woof + rendyr)

**From Brand Guidelines:**
- Rendyr: Lowercase, minimal, tech-forward
- WayofWoof: Warm, dog-first, premium
- Mission Control: Dark, dense, information-rich
- Public feeds: Clean, fast, no branding

---

**Starting build now. Will be ready when you wake up.** 🧭
