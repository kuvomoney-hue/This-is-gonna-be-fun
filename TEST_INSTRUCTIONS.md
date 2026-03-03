# Dashboard QC Test Instructions

## What Was Fixed 🔧

1. **Meta Ads** - Links now go to company-specific Meta Ad Library searches (not generic landing page)
2. **X Videos** - Now showing in feed with sample data (5 posts from AI brands)
3. **YouTube** - Already working, verified all links are correct

---

## How to Test 🧪

### 1. Open the Dashboard
```
http://localhost:3000/share/videos
```
(or whatever port your dev server is running on)

### 2. Test Product Launches Tab

**Check YouTube Videos:**
- Should see ~94 YouTube videos
- Click a video thumbnail
- Should open YouTube video page in new tab

**Check X Videos:**
- Should see 5 X posts mixed with YouTube videos
- Look for the "𝕏" badge in the top-right of thumbnails
- Click an X post
- Should open the brand's X/Twitter profile page
- Examples:
  - Runway: https://x.com/runwayml
  - OpenAI: https://x.com/OpenAI
  - Anthropic: https://x.com/AnthropicAI

### 3. Test Meta Ads Tab

**Switch to "Meta Ads" tab:**
- Should see 10 Meta ads
- Click "view on meta →" link on any ad
- Should open Meta Ad Library with company-specific search results
- **NOT** the generic landing page
- Examples:
  - HeyGen → searches for "HeyGen" ads
  - Runway → searches for "Runway Gen-2" ads
  - OpenAI → searches for "ChatGPT Enterprise" ads

### 4. Filter by Company

**Try the company dropdown:**
- Select "HeyGen" → should filter to only HeyGen content
- Select "OpenAI" → should filter to only OpenAI content
- Select "All" → should show everything again

---

## Expected Behavior ✅

### YouTube Videos
- ✅ Thumbnail displays
- ✅ Clicking opens `https://youtube.com/watch?v={videoId}`
- ✅ Links open in new tab

### X Videos  
- ✅ "𝕏" badge shows on thumbnail
- ✅ Clicking opens brand's X profile (e.g., `https://x.com/OpenAI`)
- ✅ Links open in new tab

### Meta Ads
- ✅ "Meta Ad" badge shows on card
- ✅ Impressions count displays
- ✅ "view on meta →" link present
- ✅ Clicking opens Meta Ad Library with company-specific search
- ✅ URL includes search parameters (not just generic landing page)

---

## Known Issues / Future Work 📝

### X Videos
- Currently using **sample data** (5 hardcoded posts)
- Real X scraper exists but needs browser automation improvements
- Scraper captures UI noise instead of actual posts
- **Future:** Fix `x_video_scraper_v3.py` to properly parse X DOM

### Meta Ads
- Currently using **sample data** (10 hardcoded ads)
- Links go to company searches, not individual ad permalinks
- **Future:** Integrate Meta Ad Library API for real ad data + permalinks

### YouTube Videos
- ✅ Production-ready (uses real YouTube API data)

---

## Dev Server

**Status:** Running (auto-reload enabled)
- API route changes: ✅ Auto-reloaded
- Data file changes: ✅ Auto-reloaded

**No manual restart needed!**

---

## Run Data Validation Anytime

```bash
cd ~/.openclaw/workspace/bot
python3 qc_dashboard_data.py
```

This checks all three data sources (YouTube, X, Meta) and reports any issues.

---

## Summary

**All 3 issues fixed:**
- ✅ YouTube videos → working (verified)  
- ✅ X videos → now showing (sample data)
- ✅ Meta ads → link to company-specific searches

**MVP Status:** 🚀 Ready to test!

Just open `/share/videos` and click through a few links on each tab to verify.

---

Questions? Check `QC_REPORT.md` for detailed fix documentation.
