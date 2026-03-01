# 🐾 WayofWoof Email Flow Library

**Complete email collection for OmniSend integration**

## 📍 Live URL

**Mission Control Email Library:**  
`https://[your-vercel-domain]/emails/wayofwoof/`

## 🎯 What's Inside

✅ **25 Complete Email Flows**
- 8 Pre-Purchase emails
- 13 Post-Purchase emails  
- 4 Engagement/Retention emails

✅ **Beautiful Dashboard Interface**
- Visual browsing of all flows
- Organized by category
- One-click access to each email

✅ **Copy-Ready Format**
- Click "Copy for OmniSend" button
- Paste directly into OmniSend editor
- Includes subject lines, preheaders, timing

## 🚀 How to Use

1. **Browse:** Open `index.html` to see all 25 emails
2. **Select:** Click any email card to view full content
3. **Copy:** Hit the "Copy for OmniSend" button
4. **Paste:** Paste into OmniSend email editor
5. **Customize:** Adjust merge tags ([First Name], [Dog Name]) in OmniSend
6. **Launch:** Set triggers and send!

## 📊 Progress Tracking

Mark emails as complete using the CLI tracker:

```bash
cd /Users/koovican/.openclaw/workspace/bot
python3 update_email_flow.py done prePurchase welcomeSeries 1
python3 update_email_flow.py status
```

Progress auto-syncs to Mission Control dashboard.

## 📝 Email Source

Full email content with detailed copy lives in:
`~/Documents/Obsidian Vault/WayofWoof/Marketing/woof_email_flows.md`

- 2,500+ lines of complete email copy
- Subject lines + preheaders + body copy
- Timing triggers + goals + CTAs
- Customer testimonials + social proof

## 🎨 Features

- **Responsive Design:** Works on mobile, tablet, desktop
- **Visual Stats:** See flow breakdown at a glance
- **Color-Coded:** Pre/Post/Engagement flows clearly distinguished
- **One-Click Copy:** Instant clipboard access
- **Professional Layout:** Beautiful presentation for team review

## 📦 What's Ready Now

1. ✅ Welcome Series (Email 1) - **Full Content**
2. ⏳ All other emails - **Linked to Obsidian source**

### To Add Full Content

Run the email generator script to populate from Obsidian:

```bash
cd /Users/koovican/.openclaw/workspace/bot
python3 generate_all_emails.py
```

This will extract all 25 emails from the markdown and create beautiful HTML versions.

## 🔄 Deployment

Changes auto-deploy via Vercel:

```bash
cd /Users/koovican/.openclaw/workspace/dashboard
git add .
git commit -m "Update email content"
git push
```

Vercel builds and deploys within 60 seconds.

## 🎯 Next Steps

1. **Review** all email content in Obsidian vault
2. **Customize** merge tags for your OmniSend setup
3. **Test** one flow end-to-end before launching all
4. **Track** progress using the CLI tool
5. **Iterate** based on open rates and engagement

---

**Built with 🐾 for WayofWoof**  
*Ready to turn email flows into customer journeys*
