"use client";

import { useState, useEffect } from "react";
import "./vaporwave.css";

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

// Launch data loaded from API
interface LaunchIntelData {
  video_id: string;
  company: string;
  title: string;
  sentiment_score: number;
  aha_moment: string;
  top_complaints: string[];
  marketing: {
    positioning: string;
    target_audience: string;
    distribution_strategy: string;
  };
}

export default function LaunchIntelPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Load intel data from API
  useEffect(() => {
    fetch("/api/launch-intel")
      .then(res => res.json())
      .then(data => {
        if (data.launches) {
          // Convert to Launch format
          const launchData: Launch[] = data.launches.map((intel: LaunchIntelData) => ({
            id: intel.video_id,
            company: intel.company,
            title: intel.title,
            thumbnail: `https://i.ytimg.com/vi/${intel.video_id}/hqdefault.jpg`,
            views: "N/A",
            timeAgo: "Recent",
            intel: {
              ahaMoment: intel.aha_moment,
              friction: intel.top_complaints,
              sentiment: intel.sentiment_score
            }
          }));
          setLaunches(launchData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load intel:", err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (launch: Launch) => {
    setSelectedLaunch(launch);
    setShowAnalysis(true);
  };

  return (
    <div className="vaporwave-container">
      {/* Tracking Line VHS Effect */}
      <div className="tracking-line" style={{ top: '20%' }}></div>
      
      {/* Control Panel Header */}
      <div className="control-panel-header">
        <h1 className="control-panel-title">LAUNCH INTEL</h1>
        <p className="control-panel-subtitle">
          AI Competitive Intelligence • Real-Time Monitoring System
        </p>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          ◉ SYSTEM STATUS: {loading ? "SCANNING..." : "ONLINE"}
        </div>
        <div className="status-item active">
          ▸ LAUNCHES TRACKED: {launches.length}
        </div>
        <div className="status-item">
          ⚡ ANALYSIS ENGINE: ACTIVE
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-screen">
          <div className="loading-text">
            INITIALIZING NEURAL NETWORK<span className="loading-dots">...</span>
          </div>
        </div>
      ) : (
        /* Launch Grid */
        <div className="crt-grid">
          {launches.map(launch => (
            <div 
              key={launch.id}
              className="crt-monitor"
              onClick={() => handleCardClick(launch)}
            >
              {/* CRT Screen */}
              <div className="crt-screen">
                <img 
                  src={launch.thumbnail} 
                  alt={launch.title}
                />
              </div>

              {/* Monitor Info */}
              <div className="crt-info">
                <div className="crt-company">{launch.company}</div>
                <div className="crt-title">{launch.title}</div>
                <div className="crt-meta">
                  <span>
                    {launch.intel && (
                      <span className="sentiment-badge">
                        {launch.intel.sentiment}% POSITIVE
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Panel (slides in when card clicked) */}
      {showAnalysis && selectedLaunch?.intel && (
        <div className="analysis-panel">
          <div className="analysis-header">
            <div className="analysis-title">INTEL ANALYSIS</div>
            <button 
              className="close-button"
              onClick={() => setShowAnalysis(false)}
            >
              ×
            </button>
          </div>

          {/* Company Name */}
          <div className="intel-section">
            <div className="intel-section-title">◉ TARGET</div>
            <div className="intel-section-content">
              {selectedLaunch.company}
            </div>
          </div>

          {/* Aha Moment */}
          <div className="intel-section">
            <div className="intel-section-title">▸ AHA MOMENT</div>
            <div className="intel-section-content">
              {selectedLaunch.intel.ahaMoment}
            </div>
          </div>

          {/* Friction Points */}
          {selectedLaunch.intel.friction.length > 0 && (
            <div className="intel-section">
              <div className="intel-section-title">⚠ USER FRICTION</div>
              <div className="intel-section-content">
                <ul className="intel-list">
                  {selectedLaunch.intel.friction.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          <div className="intel-section">
            <div className="intel-section-title">📊 SENTIMENT ANALYSIS</div>
            <div className="intel-section-content">
              <div className="sentiment-meter">
                <div className="sentiment-label">
                  COMMUNITY RESPONSE: {selectedLaunch.intel.sentiment}% POSITIVE
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

          {/* System Footer */}
          <div style={{ 
            marginTop: '40px', 
            paddingTop: '20px', 
            borderTop: '1px solid rgba(0, 255, 255, 0.2)',
            fontSize: '10px',
            color: 'rgba(0, 255, 255, 0.5)',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            ◉ NEURAL ANALYSIS COMPLETE ◉
          </div>
        </div>
      )}
    </div>
  );
}
