"use client"

import { Crosshair, Gamepad2, Trophy, Users } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Friend Insights",
    description: "See how your friends stack up across CS2",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Rank your friend group by kills, K/D, wins, and more",
  },
  {
    icon: Crosshair,
    title: "Weapon Stats",
    description: "Discover everyone's favorite weapons and playstyles",
  },
  {
    icon: Gamepad2,
    title: "Fun Facts",
    description: "Uncover surprising stats you never knew about",
  },
]

export default function LandingPage() {
  return (
    <div className="win2k-desktop">
      {/* Desktop background */}
      <div className="win2k-desktop-area">
        {/* Main window */}
        <div className="win2k-window">
          {/* Title bar */}
          <div className="win2k-titlebar">
            <div className="win2k-titlebar-left">
              <Crosshair className="win2k-titlebar-icon" />
              <span>Steam Stats — Welcome</span>
            </div>
            <div className="win2k-titlebar-buttons">
              <button className="win2k-tbtn" aria-label="Minimize">_</button>
              <button className="win2k-tbtn" aria-label="Maximize">□</button>
              <button className="win2k-tbtn win2k-tbtn-close" aria-label="Close">✕</button>
            </div>
          </div>

          {/* Menu bar */}
          <div className="win2k-menubar">
            <span className="win2k-menu-item">File</span>
            <span className="win2k-menu-item">View</span>
            <span className="win2k-menu-item">Help</span>
          </div>

          {/* Window body */}
          <div className="win2k-body">
            {/* Left panel */}
            <div className="win2k-sidebar">
              <div className="win2k-sidebar-header">
                <Crosshair className="win2k-sidebar-icon" />
                <span>Steam Stats</span>
              </div>
              <div className="win2k-sidebar-divider" />
              <p className="win2k-sidebar-desc">
                Log in with Steam to discover fun stats about you and your
                friends in Counter-Strike 2.
              </p>
              <div className="win2k-sidebar-divider" />
              <div className="win2k-sidebar-tip">
                <span className="win2k-tip-icon">ℹ</span>
                <span>Your Steam data is only used during your session. Nothing is stored.</span>
              </div>
            </div>

            {/* Right content */}
            <div className="win2k-content">
              {/* Hero area */}
              <div className="win2k-hero">
                <div className="win2k-hero-icon">
                  <Crosshair style={{ width: 40, height: 40, color: "#000080" }} />
                </div>
                <div>
                  <h1 className="win2k-title">Welcome to Steam Stats</h1>
                  <p className="win2k-subtitle">
                    Discover fun stats about you and your friends in Counter-Strike 2.
                  </p>
                </div>
              </div>

              <div className="win2k-section-divider" />

              {/* Feature boxes */}
              <div className="win2k-features-label">Features:</div>
              <div className="win2k-features-grid">
                {features.map((feature) => (
                  <div key={feature.title} className="win2k-feature-box">
                    <div className="win2k-feature-icon-wrap">
                      <feature.icon style={{ width: 20, height: 20 }} />
                    </div>
                    <div>
                      <p className="win2k-feature-title">{feature.title}</p>
                      <p className="win2k-feature-desc">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="win2k-section-divider" />

              {/* Sign in button area */}
              <div className="win2k-action-row">
                <a href="/api/auth/steam/login" className="win2k-btn-primary">
                  <SteamIcon style={{ width: 18, height: 18 }} />
                  Sign in with Steam
                </a>
                <span className="win2k-action-help">
                  Requires a valid Steam account
                </span>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="win2k-statusbar">
            <div className="win2k-status-item">Ready</div>
            <div className="win2k-status-item">steam-stats.app</div>
            <div className="win2k-status-item">Internet Zone</div>
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="win2k-taskbar">
        <button className="win2k-start-btn">
          <span className="win2k-start-logo">⊞</span>
          <span>Start</span>
        </button>
        <div className="win2k-taskbar-divider" />
        <div className="win2k-taskbar-task active">
          <Crosshair style={{ width: 14, height: 14 }} />
          <span>Steam Stats — Welcome</span>
        </div>
        <div className="win2k-taskbar-clock">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <style>{`
        .win2k-desktop {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          background-color: #008080;
          background-image:
            radial-gradient(ellipse at 30% 40%, #009999 0%, transparent 60%),
            radial-gradient(ellipse at 70% 70%, #006666 0%, transparent 50%);
          font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
          font-size: 11px;
          color: #000000;
        }

        .win2k-desktop-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* ── Window ── */
        .win2k-window {
          width: 100%;
          max-width: 720px;
          background: #d4d0c8;
          border-top: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #808080;
          border-bottom: 2px solid #808080;
          box-shadow: 2px 2px 0 #000000;
        }

        /* ── Title bar ── */
        .win2k-titlebar {
          background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
          padding: 4px 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
          font-weight: bold;
          font-size: 12px;
          user-select: none;
        }
        .win2k-titlebar-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .win2k-titlebar-icon {
          width: 14px;
          height: 14px;
        }
        .win2k-titlebar-buttons {
          display: flex;
          gap: 2px;
        }
        .win2k-tbtn {
          width: 18px;
          height: 16px;
          background: #d4d0c8;
          border-top: 1px solid #ffffff;
          border-left: 1px solid #ffffff;
          border-right: 1px solid #808080;
          border-bottom: 1px solid #808080;
          color: #000000;
          font-size: 9px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .win2k-tbtn:active {
          border-top: 1px solid #808080;
          border-left: 1px solid #808080;
          border-right: 1px solid #ffffff;
          border-bottom: 1px solid #ffffff;
        }
        .win2k-tbtn-close {
          background: #d4d0c8;
        }

        /* ── Menu bar ── */
        .win2k-menubar {
          background: #d4d0c8;
          padding: 2px 4px;
          display: flex;
          gap: 0;
          border-bottom: 1px solid #808080;
        }
        .win2k-menu-item {
          padding: 3px 8px;
          cursor: pointer;
          font-size: 11px;
        }
        .win2k-menu-item:hover {
          background: #000080;
          color: #ffffff;
        }

        /* ── Body layout ── */
        .win2k-body {
          display: flex;
          min-height: 340px;
        }

        /* ── Sidebar ── */
        .win2k-sidebar {
          width: 180px;
          min-width: 180px;
          background: #ece9d8;
          border-right: 2px solid #808080;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .win2k-sidebar-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: bold;
          font-size: 12px;
          color: #000080;
        }
        .win2k-sidebar-icon {
          width: 16px;
          height: 16px;
        }
        .win2k-sidebar-divider {
          height: 1px;
          background: #808080;
          margin: 4px 0;
          box-shadow: 0 1px 0 #ffffff;
        }
        .win2k-sidebar-desc {
          font-size: 11px;
          color: #444444;
          line-height: 1.5;
        }
        .win2k-sidebar-tip {
          display: flex;
          gap: 4px;
          font-size: 10px;
          color: #555555;
          line-height: 1.4;
        }
        .win2k-tip-icon {
          color: #000080;
          font-weight: bold;
          flex-shrink: 0;
        }

        /* ── Content ── */
        .win2k-content {
          flex: 1;
          padding: 16px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .win2k-hero {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .win2k-hero-icon {
          width: 56px;
          height: 56px;
          background: #ece9d8;
          border: 2px inset #808080;
          border-top-color: #808080;
          border-left-color: #808080;
          border-right-color: #ffffff;
          border-bottom-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .win2k-title {
          font-size: 18px;
          font-weight: bold;
          color: #000080;
          margin: 0 0 4px;
          font-family: 'Tahoma', Arial, sans-serif;
        }
        .win2k-subtitle {
          font-size: 11px;
          color: #444444;
          margin: 0;
        }

        .win2k-section-divider {
          height: 1px;
          background: #808080;
          box-shadow: 0 1px 0 #ffffff;
        }

        /* ── Features ── */
        .win2k-features-label {
          font-size: 11px;
          font-weight: bold;
          color: #000000;
        }
        .win2k-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .win2k-feature-box {
          background: #ece9d8;
          border-top: 1px solid #ffffff;
          border-left: 1px solid #ffffff;
          border-right: 1px solid #808080;
          border-bottom: 1px solid #808080;
          padding: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .win2k-feature-icon-wrap {
          color: #000080;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .win2k-feature-title {
          font-size: 11px;
          font-weight: bold;
          color: #000000;
          margin: 0 0 2px;
        }
        .win2k-feature-desc {
          font-size: 10px;
          color: #555555;
          margin: 0;
          line-height: 1.4;
        }

        /* ── Action row ── */
        .win2k-action-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .win2k-btn-primary {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: #d4d0c8;
          border-top: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #808080;
          border-bottom: 2px solid #808080;
          color: #000000;
          font-family: 'Tahoma', Arial, sans-serif;
          font-size: 11px;
          font-weight: bold;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
        }
        .win2k-btn-primary:hover {
          background: #e0ddd5;
        }
        .win2k-btn-primary:active {
          border-top: 2px solid #808080;
          border-left: 2px solid #808080;
          border-right: 2px solid #ffffff;
          border-bottom: 2px solid #ffffff;
        }
        .win2k-action-help {
          font-size: 10px;
          color: #808080;
          font-style: italic;
        }

        /* ── Status bar ── */
        .win2k-statusbar {
          background: #d4d0c8;
          border-top: 1px solid #808080;
          box-shadow: inset 0 1px 0 #ffffff;
          padding: 2px 4px;
          display: flex;
          gap: 0;
        }
        .win2k-status-item {
          padding: 2px 8px;
          font-size: 10px;
          color: #000000;
          border-right: 1px solid #808080;
        }
        .win2k-status-item:last-child {
          border-right: none;
        }

        /* ── Taskbar ── */
        .win2k-taskbar {
          height: 30px;
          background: linear-gradient(180deg, #1f6fbf 0%, #3a8dd6 8%, #245eab 50%, #1a4d96 51%, #1058b3 100%);
          display: flex;
          align-items: center;
          padding: 2px 4px;
          gap: 4px;
          border-top: 1px solid #0831a3;
        }
        .win2k-start-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: linear-gradient(180deg, #57a43a 0%, #4a9030 40%, #3d7a26 100%);
          border: 1px solid #2a5a18;
          border-radius: 2px;
          color: #ffffff;
          font-family: 'Tahoma', Arial, sans-serif;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          height: 24px;
        }
        .win2k-start-btn:hover {
          background: linear-gradient(180deg, #6ab84a 0%, #57a43a 40%, #4a9030 100%);
        }
        .win2k-start-logo {
          font-size: 14px;
        }
        .win2k-taskbar-divider {
          width: 1px;
          height: 22px;
          background: rgba(255,255,255,0.3);
          margin: 0 2px;
        }
        .win2k-taskbar-task {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 10px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 2px;
          color: #ffffff;
          font-size: 11px;
          height: 24px;
          max-width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .win2k-taskbar-task.active {
          background: rgba(0,0,0,0.4);
          border-color: rgba(0,0,0,0.5);
        }
        .win2k-taskbar-clock {
          margin-left: auto;
          padding: 2px 8px;
          color: #ffffff;
          font-size: 11px;
          background: rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,80,0.4);
          height: 22px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

function SteamIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.387 3.387 0 0 1 1.912-.59c.064 0 .128.002.191.006l2.861-4.142V8.91a4.528 4.528 0 0 1 4.524-4.524 4.528 4.528 0 0 1 4.524 4.524 4.528 4.528 0 0 1-4.524 4.524h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396a3.404 3.404 0 0 1-3.362-2.88L.309 15.062C1.747 20.15 6.419 24 11.979 24 18.627 24 24 18.627 24 11.979 24 5.373 18.627 0 11.979 0z" />
    </svg>
  )
}
