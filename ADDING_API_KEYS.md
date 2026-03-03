# Adding API Keys for Real Launch Intel Analysis

Currently, Launch Intel uses **sample data** generated with heuristics. To enable **real analysis**, add these API keys:

---

## 🔑 Required API Keys

### 1. OpenAI API Key (GPT-4)
**For:** Sentiment analysis, marketing angle detection

**Get it:**
1. Go to https://platform.openai.com/api-keys
2. Create account or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Set it:**
```bash
export OPENAI_API_KEY="sk-..."
```

**Cost:** ~$0.01-0.03 per launch analyzed (GPT-4)

---

### 2. YouTube Data API Key
**For:** Video transcripts, comment scraping

**Get it:**
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create API Key
5. Copy the key (starts with `AIza...`)

**Set it:**
```bash
export YOUTUBE_API_KEY="AIza..."
```

**Cost:** Free (10,000 quota units/day = ~100 videos)

---

## 🚀 Running Real Analysis

### Step 1: Set Environment Variables

```bash
# On macOS/Linux
export OPENAI_API_KEY="sk-..."
export YOUTUBE_API_KEY="AIza..."

# Or add to ~/.bashrc or ~/.zshrc for persistence
echo 'export OPENAI_API_KEY="sk-..."' >> ~/.zshrc
echo 'export YOUTUBE_API_KEY="AIza..."' >> ~/.zshrc
source ~/.zshrc
```

### Step 2: Run Analyzer

```bash
cd ~/.openclaw/workspace/bot
python3 launch_intel_analyzer.py
```

This will:
- Load first 10 videos from `youtube_videos.json`
- Extract real transcripts (YouTube captions)
- Scrape comments for sentiment
- Analyze with GPT-4
- Save to `launch_intel/youtube_intel.json`

### Step 3: Verify Results

Check the output:
```bash
cat ../dashboard/public/data/launch_intel/youtube_intel.json
```

You should see:
- Real transcripts (3000+ chars)
- GPT-4 sentiment analysis
- Actual user complaints from comments
- Marketing angle analysis

### Step 4: Refresh Dashboard

The Y2K demo will automatically load the new intel data:
```
http://localhost:3000/y2k-demo
```

---

## ⚙️ Configuration Options

### Analyze More Videos

Edit `launch_intel_analyzer.py`:
```python
# Change this line (line ~250)
for video in videos[:10]:  # Default: 10 videos
```

To:
```python
for video in videos[:50]:  # Analyze 50 videos
```

### Faster Analysis (Use GPT-4 Mini)

Edit `launch_intel_analyzer.py`:
```python
# Change this line (line ~80)
"model": "gpt-4",
```

To:
```python
"model": "gpt-4o-mini",  # 10x cheaper, still good
```

### Skip Comment Scraping (Faster)

Edit `launch_intel_analyzer.py`:
```python
# Comment out this line (line ~230)
comments = scrape_video_comments(video_id, source)
```

To:
```python
comments = []  # Skip comments, use transcript only
```

---

## 🔄 Automating Analysis

### Daily Cron Job

Add to crontab:
```bash
# Analyze new launches every day at 9 AM
0 9 * * * cd /path/to/workspace/bot && python3 launch_intel_analyzer.py
```

### Webhook Trigger

Set up a webhook to trigger analysis when new YouTube videos are uploaded:
```bash
# Example: GitHub Actions workflow
name: Analyze Launches
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:  # Manual trigger

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: python3 bot/launch_intel_analyzer.py
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
```

---

## 💸 Cost Estimation

### YouTube API (Free Tier)
- **Quota:** 10,000 units/day
- **Cost per video:** ~100 units (transcript + comments)
- **Daily capacity:** ~100 videos analyzed
- **Price:** $0

### OpenAI GPT-4
- **Input tokens:** ~1,500 tokens/video (transcript + comments)
- **Output tokens:** ~300 tokens/video (analysis)
- **Cost:** ~$0.015/video
- **100 videos/day:** ~$1.50/day = ~$45/month

### OpenAI GPT-4 Mini (Cheaper Alternative)
- **Cost:** ~$0.0015/video (10x cheaper)
- **100 videos/day:** ~$0.15/day = ~$4.50/month
- **Quality:** Still excellent for sentiment + basic analysis

---

## 🐛 Troubleshooting

### "OPENAI_API_KEY not set"
```bash
# Check if set
echo $OPENAI_API_KEY

# If empty, export it
export OPENAI_API_KEY="sk-..."
```

### "YOUTUBE_API_KEY not set"
```bash
# Check if set
echo $YOUTUBE_API_KEY

# If empty, export it
export YOUTUBE_API_KEY="AIza..."
```

### "Could not extract transcript"
Video might not have captions. Analyzer will fall back to description.

### "GPT-4 error: 401"
Invalid OpenAI API key. Double-check the key starts with `sk-`.

### "YouTube API quota exceeded"
Daily limit reached (10,000 units). Wait 24 hours or upgrade to paid quota.

---

## 🎯 Recommended Setup

**For Development/Testing:**
- Use sample data generator (no API keys)
- Or analyze 5-10 videos with real keys

**For Production:**
- Set API keys in environment
- Run analyzer daily (cron job)
- Use GPT-4 Mini for cost efficiency
- Cache results (don't re-analyze same videos)

---

## 📊 Sample vs Real Data Comparison

### Sample Data (Current):
- ✅ Fast (instant)
- ✅ Free
- ✅ Realistic (heuristic templates)
- ❌ Not actual user sentiment
- ❌ Generic marketing analysis

### Real Data (With API Keys):
- ✅ Actual user comments analyzed
- ✅ Real transcripts from videos
- ✅ GPT-4 competitive intelligence
- ❌ Costs ~$0.015/video
- ❌ Slower (30-60s per video)

---

**Next Step:** Decide if you need real analysis or if sample data is enough for your use case. For demo/prototyping, sample data works great. For production competitive intel, add API keys.
