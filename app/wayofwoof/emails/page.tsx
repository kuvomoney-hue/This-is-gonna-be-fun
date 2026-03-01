'use client';

import { useState } from 'react';

export default function EmailLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEmail = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const emails = {
    prePurchase: {
      title: "📬 Pre-Purchase Flows",
      count: 8,
      sections: [
        {
          title: "Welcome Series (3 emails)",
          emails: [
            { id: "welcome-1", badge: "Email 1", title: "Welcome to the Pack", meta: "Immediate • Introduce brand + 15% off" },
            { id: "welcome-2", badge: "Email 2", title: "Why We Do Things Differently", meta: "Day 2 • Build trust through ingredients" },
            { id: "welcome-3", badge: "Email 3", title: "Your Dog Deserves This", meta: "Day 4 • Social proof + urgency" },
          ]
        },
        {
          title: "Abandoned Cart (3 emails)",
          emails: [
            { id: "cart-1", badge: "Email 1", title: "You Left Something Behind", meta: "1 hour • Gentle reminder" },
            { id: "cart-2", badge: "Email 2", title: "Still Thinking It Over?", meta: "24 hours • Address objections + free shipping" },
            { id: "cart-3", badge: "Email 3", title: "Last Chance - Here's 10% Off", meta: "48 hours • Final incentive" },
          ]
        },
        {
          title: "Browse Abandonment (2 emails)",
          emails: [
            { id: "browse-1", badge: "Email 1", title: "We Noticed You Checking Out [Product]", meta: "4 hours • Re-engage warm leads" },
            { id: "browse-2", badge: "Email 2", title: "What You Should Know About [Product]", meta: "24 hours • Education + final nudge" },
          ]
        }
      ]
    },
    postPurchase: {
      title: "📦 Post-Purchase Flows",
      count: 13,
      sections: [
        {
          title: "Hot Milk Collection (4 emails)",
          emails: [
            { id: "hotmilk-1", badge: "Email 1", title: "Your Hot Milk Has Arrived!", meta: "1 day after delivery • Usage guide" },
            { id: "hotmilk-2", badge: "Email 2", title: "Hot Milk Rituals: Making It Special", meta: "Day 3 • Creative recipes + rituals" },
            { id: "hotmilk-3", badge: "Email 3", title: "The Science Behind the Sip", meta: "Day 7 • Gut health education" },
            { id: "hotmilk-4", badge: "Email 4", title: "Running Low? Restock & Save", meta: "Day 20 • Restock reminder" },
          ]
        },
        {
          title: "Peanut Butter (4 emails)",
          emails: [
            { id: "pb-1", badge: "Email 1", title: "Your Peanut Butter is Here!", meta: "1 day after delivery • 5 ways to use it" },
            { id: "pb-2", badge: "Email 2", title: "Beyond the Spoon: Creative Uses", meta: "Day 3 • Recipes + enrichment" },
            { id: "pb-3", badge: "Email 3", title: "Inside Every Jar: The Ingredient Story", meta: "Day 7 • Ingredient deep dive" },
            { id: "pb-4", badge: "Email 4", title: "Time to Restock!", meta: "Day 25 • Restock reminder" },
          ]
        },
        {
          title: "Bundle VIP (5 emails)",
          emails: [
            { id: "bundle-1", badge: "Email 1", title: "Welcome to the Full Experience", meta: "1 day • VIP treatment + complete guide" },
            { id: "bundle-2", badge: "Email 2", title: "Morning Ritual: Hot Milk Magic", meta: "Day 3 • Hot Milk focus" },
            { id: "bundle-3", badge: "Email 3", title: "Anytime Enrichment: PB Power", meta: "Day 5 • PB focus" },
            { id: "bundle-4", badge: "Email 4", title: "The Complete Wellness Routine", meta: "Day 10 • Combined wellness" },
            { id: "bundle-5", badge: "Email 5", title: "VIP Restock Offer", meta: "Day 22 • Exclusive 20% off" },
          ]
        }
      ]
    },
    engagement: {
      title: "💬 Engagement & Retention",
      count: 4,
      emails: [
        { id: "review", badge: "Review", title: "How's It Going? (Review Request)", meta: "7-10 days • Photo upload incentive" },
        { id: "winback-30", badge: "Winback", title: "We Miss You! (30 days inactive)", meta: "30 days • What's new" },
        { id: "winback-60", badge: "Winback", title: "Is Everything Okay? (60 days)", meta: "60 days • 15% off" },
        { id: "winback-90", badge: "Winback", title: "One More Try (90 days)", meta: "90 days • 20% off + free shipping" },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            🐾 WayofWoof Email Flow Library
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Complete email collection ready for OmniSend
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-[#667eea] mb-1">25</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Total Emails</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-[#667eea] mb-1">8</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Pre-Purchase</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-[#667eea] mb-1">13</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Post-Purchase</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-[#667eea] mb-1">4</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Engagement</div>
          </div>
        </div>

        {/* Email Sections */}
        {Object.entries(emails).map(([key, category]) => (
          <div key={key} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
              <span className="bg-[#667eea] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                {category.count} emails
              </span>
            </div>

            {/* Sections or direct emails */}
            {('sections' in category ? category.sections : [{ title: '', emails: category.emails }]).map((section: any, idx: number) => (
              <div key={idx} className="mb-6 last:mb-0">
                {section.title && (
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 pl-3 border-l-4 border-[#667eea]">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-3">
                  {section.emails.map((email: any) => (
                    <div
                      key={email.id}
                      className="bg-gray-50 rounded-lg p-5 border-2 border-transparent hover:border-[#667eea] transition-all cursor-pointer flex justify-between items-center group"
                      onClick={() => {
                        window.open(`https://github.com/kuvomoney-hue/This-is-gonna-be-fun/blob/main/public/emails/wayofwoof/${email.id}.html`, '_blank');
                      }}
                    >
                      <div className="flex-1">
                        <span className="inline-block bg-[#667eea] text-white px-3 py-1 rounded-lg text-xs font-semibold mb-2">
                          {email.badge}
                        </span>
                        <div className="font-semibold text-gray-800 mb-1">{email.title}</div>
                        <div className="text-sm text-gray-500">{email.meta}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Open ~/Documents/Obsidian Vault/WayofWoof/Marketing/woof_email_flows.md to access full email content');
                        }}
                        className="bg-[#667eea] hover:bg-[#764ba2] text-white px-6 py-2 rounded-lg font-semibold transition-all"
                      >
                        View →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Footer */}
        <footer className="text-center text-white mt-12 opacity-80">
          <p className="mb-2">Made with 🐾 for WayofWoof • Ready for OmniSend</p>
          <p className="text-sm opacity-70">
            Full email content in: ~/Documents/Obsidian Vault/WayofWoof/Marketing/woof_email_flows.md
          </p>
        </footer>
      </div>
    </div>
  );
}
