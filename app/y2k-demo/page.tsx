"use client";

import { useState } from "react";
import "./win98.css";

interface Launch {
  id: string;
  company: string;
  title: string;
  thumbnail: string;
  views: string;
  timeAgo: string;
  intel?: {
    ahaMoment: string;
    friction: string[];
    sentiment: number;
  };
}

const SAMPLE_LAUNCHES: Launch[] = [
  {
    id: "1",
    company: "OpenAI",
    title: "Sora Turbo - 10x Faster Video Generation",
    thumbnail: "https://placehold.co/240x135/10b981/white?text=Sora+Turbo",
    views: "420K",
    timeAgo: "3h ago",
    intel: {
      ahaMoment: "10x faster generation with improved motion consistency. First to ship real-time previews.",
      friction: [
        "No Android app available",
        "Pricing too high for indie creators",
        "Export resolution limited to 1080p"
      ],
      sentiment: 87
    }
  },
  {
    id: "2",
    company: "Runway",
    title: "Gen-3 Alpha Turbo Launch",
    thumbnail: "https://placehold.co/240x135/8b5cf6/white?text=Gen-3+Turbo",
    views: "85K",
    timeAgo: "8h ago",
    intel: {
      ahaMoment: "7x faster than Gen-2, same incredible quality. Real-time feedback during generation.",
      friction: [
        "Still no audio generation",
        "Credit system is confusing",
        "Can't extend clips beyond 5 seconds"
      ],
      sentiment: 74
    }
  },
  {
    id: "3",
    company: "HeyGen",
    title: "Avatar 3.0 - Hyper-Realistic Expressions",
    thumbnail: "https://placehold.co/240x135/6366f1/white?text=Avatar+3.0",
    views: "320K",
    timeAgo: "12h ago",
    intel: {
      ahaMoment: "Emotion-based voice modulation + natural hand gestures. First to nail micro-expressions.",
      friction: [
        "Voice cloning requires 30min of audio",
        "Background removal is janky",
        "No batch export option"
      ],
      sentiment: 92
    }
  }
];

export default function Y2KDemo() {
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleCardClick = (launch: Launch) => {
    setSelectedLaunch(launch);
    setShowAnalysis(true);
  };

  return (
    <div className="win98-desktop">
      {/* Main Window */}
      <div className="win98-window">
        {/* Title Bar */}
        <div className="win98-title-bar">
          <div className="win98-title-bar-text">
            <img src="/icons/ie-icon.png" alt="" className="win98-title-icon" />
            Launch Intel - Microsoft Internet Explorer
          </div>
          <div className="win98-title-bar-controls">
            <button className="win98-title-button">_</button>
            <button className="win98-title-button">□</button>
            <button className="win98-title-button">✕</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="win98-menu-bar">
          <span className="win98-menu-item">File</span>
          <span className="win98-menu-item">View</span>
          <span className="win98-menu-item">Favorites</span>
          <span className="win98-menu-item">Tools</span>
          <span className="win98-menu-item">Help</span>
        </div>

        {/* Toolbar */}
        <div className="win98-toolbar">
          <button className="win98-button win98-toolbar-button">◄</button>
          <button className="win98-button win98-toolbar-button">►</button>
          <button className="win98-button win98-toolbar-button">⟳</button>
          <button className="win98-button win98-toolbar-button">🏠</button>
          <div className="win98-address-bar">
            <span className="win98-address-label">Address</span>
            <input 
              type="text" 
              className="win98-text-input win98-address-input" 
              value="https://launch-intel.rendyr.com"
              readOnly
            />
            <button className="win98-button">Go</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="win98-content">
          {/* Sidebar */}
          <div className="win98-sidebar">
            <div className="win98-panel">
              <div className="win98-panel-title">🔍 Filters</div>
              <div className="win98-panel-content">
                <div className="win98-checkbox-group">
                  <label className="win98-checkbox">
                    <input type="checkbox" defaultChecked />
                    YouTube
                  </label>
                  <label className="win98-checkbox">
                    <input type="checkbox" defaultChecked />
                    Twitter/X
                  </label>
                  <label className="win98-checkbox">
                    <input type="checkbox" />
                    LinkedIn
                  </label>
                </div>
                
                <div className="win98-form-group">
                  <label>Company:</label>
                  <select className="win98-select">
                    <option>All Companies</option>
                    <option>OpenAI</option>
                    <option>Runway</option>
                    <option>HeyGen</option>
                    <option>Anthropic</option>
                  </select>
                </div>

                <button className="win98-button win98-button-primary">
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="win98-main">
            <div className="win98-panel">
              <div className="win98-panel-title">📺 Launch Feed</div>
              <div className="win98-scrollable-content">
                <div className="launch-grid">
                  {SAMPLE_LAUNCHES.map(launch => (
                    <div 
                      key={launch.id} 
                      className="launch-card"
                      onClick={() => handleCardClick(launch)}
                    >
                      <div className="launch-thumbnail">
                        <img src={launch.thumbnail} alt={launch.title} />
                        <div className="launch-play-button">▶</div>
                      </div>
                      <div className="launch-info">
                        <div className="launch-company">{launch.company}</div>
                        <div className="launch-title">{launch.title}</div>
                        <div className="launch-meta">
                          {launch.views} views • {launch.timeAgo}
                        </div>
                      </div>
                      <div className="launch-actions">
                        <button className="win98-button win98-button-small">
                          Watch 🎬
                        </button>
                        <button className="win98-button win98-button-small">
                          Analyze 🔍
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Panel (slides in when card clicked) */}
          {showAnalysis && selectedLaunch?.intel && (
            <div className="win98-analysis-panel">
              <div className="win98-window win98-analysis-window">
                <div className="win98-title-bar">
                  <div className="win98-title-bar-text">
                    Competitive Intel - {selectedLaunch.company}
                  </div>
                  <div className="win98-title-bar-controls">
                    <button 
                      className="win98-title-button"
                      onClick={() => setShowAnalysis(false)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="win98-analysis-content">
                  {/* Aha Moment */}
                  <div className="intel-section">
                    <div className="intel-section-title">📊 Aha Moment</div>
                    <div className="intel-section-content">
                      {selectedLaunch.intel.ahaMoment}
                    </div>
                  </div>

                  {/* Friction */}
                  <div className="intel-section">
                    <div className="intel-section-title">🚨 Friction & Complaints</div>
                    <div className="intel-section-content">
                      <ul className="intel-list">
                        {selectedLaunch.intel.friction.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="intel-section">
                    <div className="intel-section-title">💬 Community Vibe</div>
                    <div className="intel-section-content">
                      <div className="sentiment-meter">
                        <div className="sentiment-label">
                          Sentiment: {selectedLaunch.intel.sentiment}% Positive
                        </div>
                        <div className="sentiment-bar">
                          <div 
                            className="sentiment-fill"
                            style={{ width: `${selectedLaunch.intel.sentiment}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Briefing Generator */}
                  <div className="intel-section">
                    <button className="win98-button win98-button-large">
                      🎥 Generate 60-Sec Brief
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="win98-status-bar">
          <div className="win98-status-item">
            Ready
          </div>
          <div className="win98-status-item">
            {SAMPLE_LAUNCHES.length} launches loaded
          </div>
          <div className="win98-status-item">
            Analysis cache: 1.2s avg
          </div>
        </div>
      </div>
    </div>
  );
}
