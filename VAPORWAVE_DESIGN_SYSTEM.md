# 80s Vaporwave / Retro-Futuristic Design System

## 🎮 Aesthetic

**Vibe:** 80s CRT control center + VHS vaporwave + retro-futuristic command console

**References:**
- 80s CRT control rooms (mission control, data centers)
- VHS tracking artifacts + chromatic aberration
- Synthwave / vaporwave album covers
- Tron / Blade Runner UI aesthetics
- Retro computer terminals

---

## 🎨 Color Palette

### Neon Colors (Primary)
```css
--neon-cyan: #00FFFF      /* Primary UI color */
--neon-magenta: #FF00FF   /* Accent, highlights */
--neon-orange: #FF8800    /* Headers, labels */
--neon-lime: #00FF00      /* Status, success */
--neon-pink: #FF10F0      /* Secondary accent */
--neon-blue: #00D4FF      /* Links, interactive */
--neon-purple: #9D00FF    /* Tertiary accent */
--neon-yellow: #FFFF00    /* Warnings, alerts */
```

### Dark Theme (Background)
```css
--bg-black: #000000       /* Deep black background */
--bg-dark: #0a0a0a        /* Slightly lighter black */
--surface-dark: #111111   /* Panel backgrounds */
--surface-darker: #0d0d0d /* Card backgrounds */
```

---

## ✨ Core Effects

### 1. **Text Glow**
All text has neon glow using `text-shadow`:

```css
/* Cyan glow */
text-shadow: 0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF;

/* Orange glow */
text-shadow: 0 0 10px #FF8800, 0 0 20px #FF8800;

/* Lime glow */
text-shadow: 0 0 5px #00FF00;
```

**Usage:**
- Primary text: Cyan glow
- Headers/labels: Orange glow
- Status/success: Lime glow
- Interactive: Magenta glow

---

### 2. **CRT Scanlines**
Horizontal scanlines across entire viewport:

```css
background: repeating-linear-gradient(
  0deg,
  rgba(255, 255, 255, 0.03) 0px,
  rgba(255, 255, 255, 0.03) 1px,
  transparent 1px,
  transparent 2px
);
```

**Animation:** Slow vertical scroll (8s loop)

---

### 3. **CRT Glow / Vignette**
Radial gradient overlay for screen glow:

```css
background: radial-gradient(
  ellipse at center,
  rgba(0, 255, 255, 0.05) 0%,
  transparent 50%
);
```

**Animation:** Subtle pulse (4s ease-in-out)

---

### 4. **VHS Chromatic Aberration**
RGB split effect on images:

```css
background: linear-gradient(
  90deg,
  rgba(255, 0, 0, 0.05) 0%,
  rgba(0, 255, 0, 0.05) 50%,
  rgba(0, 0, 255, 0.05) 100%
);
mix-blend-mode: screen;
```

**Usage:** Overlay on video thumbnails

---

### 5. **Neon Borders**
All panels/cards have glowing borders:

```css
border: 2px solid var(--neon-cyan);
box-shadow: 
  0 0 20px rgba(0, 255, 255, 0.3),
  inset 0 0 30px rgba(0, 255, 255, 0.05);
```

**Hover state:**
```css
border-color: var(--neon-magenta);
box-shadow: 
  0 0 30px rgba(255, 0, 255, 0.6),
  inset 0 0 40px rgba(255, 0, 255, 0.1);
```

---

### 6. **Glitch Effect**
Subtle on hover:

```css
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  33% { transform: translate(-2px, 1px); }
  66% { transform: translate(2px, -1px); }
}
```

**Usage:** Apply to images on hover (0.3s steps animation)

---

## 🖥️ Typography

### Primary Font: Share Tech Mono
```css
font-family: 'Share Tech Mono', 'Courier New', monospace;
```

**Usage:**
- Body text
- Data displays
- Monospace content
- Status text

### Accent Font: Orbitron
```css
font-family: 'Orbitron', sans-serif;
font-weight: 900; /* Ultra-bold */
```

**Usage:**
- Main titles
- Headers
- Badges
- Buttons
- Important labels

---

## 🎯 Component Patterns

### Control Panel Header
```tsx
<div className="control-panel-header">
  <h1 className="control-panel-title">LAUNCH INTEL</h1>
  <p className="control-panel-subtitle">
    AI Competitive Intelligence • Real-Time Monitoring
  </p>
</div>
```

**Style:**
- Orbitron font, 36px, 900 weight
- UPPERCASE + letter-spacing: 4px
- Cyan glow text-shadow
- Gradient background with cyan border

---

### Status Bar
```tsx
<div className="status-bar">
  <div className="status-item">◉ SYSTEM: ONLINE</div>
  <div className="status-item active">▸ LAUNCHES: 15</div>
  <div className="status-item">⚡ ENGINE: ACTIVE</div>
</div>
```

**Style:**
- Lime green text with glow
- `.active` class = pulsing animation
- Symbols: ◉ ▸ ⚡ ▪ ◆

---

### CRT Monitor Card
```tsx
<div className="crt-monitor">
  <div className="crt-screen">
    <img src={thumbnail} />
  </div>
  <div className="crt-info">
    <div className="crt-company">{company}</div>
    <div className="crt-title">{title}</div>
    <div className="crt-meta">
      <span className="sentiment-badge">87% POSITIVE</span>
    </div>
  </div>
</div>
```

**Style:**
- Dark gradient background
- Cyan border with glow
- Hover: magenta border + lift effect
- VHS chromatic aberration on image

---

### Sentiment Meter
```tsx
<div className="sentiment-meter">
  <div className="sentiment-label">
    COMMUNITY RESPONSE: 87% POSITIVE
  </div>
  <div className="sentiment-bar">
    <div className="sentiment-fill" style={{ width: '87%' }} />
  </div>
</div>
```

**Style:**
- Bar: dark bg + cyan border
- Fill: gradient (lime → cyan → magenta)
- Animated glow + shimmer effect
- Pulsing box-shadow

---

### Analysis Panel (Slide-in)
```tsx
<div className="analysis-panel">
  <div className="analysis-header">
    <div className="analysis-title">INTEL ANALYSIS</div>
    <button className="close-button">×</button>
  </div>
  
  <div className="intel-section">
    <div className="intel-section-title">▸ AHA MOMENT</div>
    <div className="intel-section-content">...</div>
  </div>
</div>
```

**Style:**
- Fixed right position, 450px wide
- Slide-in animation (0.3s)
- Dark gradient + cyan glow border
- Sections: orange title, cyan content

---

## 🎭 Animations

### Pulse Glow (Status Indicators)
```css
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 5px var(--neon-lime); }
  50% { text-shadow: 0 0 15px var(--neon-lime), 0 0 25px var(--neon-lime); }
}
```

**Duration:** 2s ease-in-out infinite

---

### Scanline Movement
```css
@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); }
}
```

**Duration:** 8s linear infinite

---

### Sentiment Pulse
```css
@keyframes sentiment-pulse {
  0%, 100% { box-shadow: 0 0 20px var(--neon-cyan); }
  50% { box-shadow: 0 0 30px var(--neon-cyan), 0 0 40px var(--neon-lime); }
}
```

**Duration:** 2s ease-in-out infinite

---

### Shimmer (Loading Effect)
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

**Usage:** Overlay on loading bars, sentiment fills

---

### Badge Glow
```css
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 15px var(--neon-magenta); }
  50% { box-shadow: 0 0 25px var(--neon-magenta), 0 0 35px var(--neon-cyan); }
}
```

**Duration:** 3s ease-in-out infinite

---

## 🔧 Usage Guidelines

### When to Use Each Color

**Cyan (#00FFFF):**
- Primary text
- Borders
- Main UI elements
- Data displays

**Orange (#FF8800):**
- Section headers
- Labels
- Company names
- Warnings (secondary)

**Magenta (#FF00FF):**
- Hover states
- Interactive elements
- Badges
- Accent highlights

**Lime (#00FF00):**
- Status indicators
- Success states
- Meta information
- Active states

---

### Text Hierarchy

1. **Main Title:** Orbitron 900, 36px, UPPERCASE, cyan glow
2. **Section Headers:** Orbitron 700, 14px, UPPERCASE, orange glow
3. **Body Text:** Share Tech Mono, 13px, cyan glow
4. **Meta Text:** Share Tech Mono, 11px, lime glow
5. **Labels:** Orbitron 700, 10px, UPPERCASE, orange glow

---

### Spacing System

```css
/* Tight spacing */
gap: 12px;
padding: 12px;

/* Medium spacing */
gap: 20px;
padding: 20px;

/* Large spacing */
gap: 30px;
padding: 30px;

/* Section spacing */
margin-bottom: 30px;
```

---

## 📐 Layout Patterns

### Grid System
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
gap: 20px;
```

**Responsive:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

---

### Panel Layout
```css
background: linear-gradient(180deg, var(--surface-dark) 0%, var(--bg-darker) 100%);
border: 2px solid var(--neon-cyan);
padding: 20px;
box-shadow: var(--glow-cyan), inset 0 0 30px rgba(0, 255, 255, 0.1);
```

---

## 🎬 Special Effects

### VHS Tracking Lines
```css
.tracking-line {
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: vhs-tracking 8s linear infinite;
}
```

**Usage:** Add 1-2 horizontal lines at different vertical positions

---

### CRT Curvature (Optional)
```css
.vaporwave-container {
  border-radius: 20px; /* Subtle screen curve */
}
```

---

## 🚀 Performance

**Optimizations:**
- CSS animations use `transform` (GPU-accelerated)
- Glow effects use `box-shadow` (not filters)
- Scanlines use pseudo-elements (no extra DOM)
- One fixed overlay for CRT glow (not per-element)

**Frame rate:** Smooth 60fps on modern devices

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  .control-panel-title { font-size: 24px; }
  .analysis-panel { width: 100%; }
  .crt-grid { grid-template-columns: 1fr; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .crt-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1025px) {
  .crt-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
}
```

---

## 🎯 Key Takeaways

1. **Everything glows** - text, borders, interactive elements
2. **Dark background** - pure black (#000) with subtle gradients
3. **Neon colors** - cyan primary, orange labels, magenta accents, lime status
4. **CRT effects** - scanlines, vignette, chromatic aberration
5. **Retro fonts** - Orbitron (bold), Share Tech Mono (body)
6. **Subtle animations** - pulse, shimmer, glow (not distracting)
7. **VHS artifacts** - tracking lines, glitch effect (rare)

---

**Result:** Retro-futuristic CRT control center that feels like you're monitoring AI launches from a 1980s space station. 🎮✨
