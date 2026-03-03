# Y2K Launch Intel Demo

## 🖥️ Windows 98 Aesthetic Demo

Interactive prototype showing the Y2K design vision for Launch Intel.

---

## View the Demo

**URL:** `http://localhost:3000/y2k-demo`

(Or whatever port your Next.js dev server is running on)

---

## What's Included

### UI Components (Y2K Styled)
✅ Windows 98 window frame with title bar  
✅ Internet Explorer-style menu bar + toolbar  
✅ Address bar with "Go" button  
✅ Chunky 3D buttons with press states  
✅ Sunken text inputs  
✅ Classic checkboxes and dropdowns  
✅ Retro scrollbars (chunky thumbs)  
✅ Status bar with sunken panels  

### Launch Intel Features
✅ Launch feed grid with video cards  
✅ Company logos + thumbnails  
✅ Play button overlays  
✅ "Watch" and "Analyze" buttons  
✅ Analysis panel (slides from right when you click a card)  
✅ Competitive intel sections:
   - 📊 Aha Moment  
   - 🚨 Friction & Complaints  
   - 💬 Community Vibe (sentiment meter)  
   - 🎥 Generate Brief button (UI only)

### Sample Data
- 3 sample launches (OpenAI, Runway, HeyGen)
- Each has intel analysis data
- Sentiment scores + friction lists

---

## How to Use

1. **Start dev server** (if not already running):
   ```bash
   cd ~/.openclaw/workspace/dashboard
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000/y2k-demo
   ```

3. **Interact with the UI:**
   - Click launch cards to open analysis panel
   - Use filter checkboxes + dropdown
   - Click "Apply Filter" button
   - Browse with toolbar buttons (aesthetic only)
   - Click "Generate Brief" button (UI only)

---

## Y2K Design System

### Color Palette
```css
--win98-gray: #C0C0C0       /* Main background */
--win98-dark-gray: #808080  /* Shadows, borders */
--win98-light-gray: #DFDFDF /* Highlights */
--win98-blue: #000080       /* Title bars */
--win98-white: #FFFFFF      /* Highlights */
--win98-black: #000000      /* Shadows */
--win98-teal: #008080       /* Desktop background */
```

### Typography
```css
font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
font-size: 11px;
```

### 3D Border Effect
```css
/* Raised (buttons, panels) */
border-top: 2px solid #FFFFFF;
border-left: 2px solid #FFFFFF;
border-bottom: 2px solid #808080;
border-right: 2px solid #808080;

/* Sunken (inputs, content areas) */
border-top: 2px solid #808080;
border-left: 2px solid #808080;
border-bottom: 2px solid #FFFFFF;
border-right: 2px solid #FFFFFF;
```

---

## File Structure

```
dashboard/app/y2k-demo/
├── page.tsx       # Main demo component
└── win98.css      # Y2K design system
```

---

## Next Steps

This is a **static UI prototype** demonstrating the aesthetic. To make it fully functional:

### 1. Data Integration
- [ ] Connect to real `/api/videos` endpoint
- [ ] Add `/api/launch-intel` endpoint for competitive analysis
- [ ] Load intel data dynamically (not hardcoded sample)

### 2. Interactive Features
- [ ] Make filters actually filter the feed
- [ ] Wire up video player when "Watch" clicked
- [ ] Implement briefing script generation (GPT-4)
- [ ] Add HeyGen video generation integration
- [ ] Video plays inline when render completes

### 3. Performance
- [ ] Virtual scrolling for long lists
- [ ] Lazy load thumbnails
- [ ] Cache intel analysis
- [ ] Prefetch on hover

### 4. Polish
- [ ] Draggable analysis panel
- [ ] Minimize/maximize window buttons work
- [ ] Add pixel art icons (16x16)
- [ ] Custom cursor (Windows pointer)
- [ ] Loading states (Y2K styled spinners)

---

## Comparison: Current vs Y2K

### Current Feed (`/share/videos`)
- Modern dark theme
- Smooth animations
- Clean minimalist cards
- Mobile-first responsive

### Y2K Demo (`/y2k-demo`)
- Windows 98 light gray
- Instant state changes (no smooth fades)
- Chunky 3D bordered cards
- Desktop-first (but responsive)
- Nostalgic retro vibes

---

## Design References

**Visual Style:**
- Windows 98 desktop/explorer
- Early MySpace (2003-2005)
- AIM buddy list
- WinAmp player
- GeoCities websites
- MSN Messenger

**Key Elements:**
- ✅ Chunky 3D borders everywhere
- ✅ Light gray backgrounds
- ✅ Blue gradient title bars
- ✅ System fonts (MS Sans Serif)
- ✅ No smooth animations
- ✅ Sunken inputs, raised buttons
- ⏳ 16x16 pixel icons (TODO)
- ⏳ Custom cursor (TODO)
- ⏳ Draggable windows (TODO)

---

## Screenshots

*(Coming soon - take screenshots after viewing demo)*

---

## Feedback Questions

1. Does the Y2K aesthetic match your vision?
2. Should the final version be this retro, or dial it back?
3. Which Launch Intel features are highest priority?
4. Should we keep the draggable window frame, or simplify?
5. Do you want real Windows 98 sounds? (clicks, errors, startup)

---

**Built with:** React + Next.js + CSS  
**Inspiration:** Windows 98, early MySpace, GeoCities  
**Vibe:** Fast, interactive, nostalgic 🖥️✨
