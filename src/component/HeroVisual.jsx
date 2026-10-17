import React from 'react';

export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="پیش‌نمایش نبرد فضایی">
      <div className="visual-glow visual-glow-one" />
      <div className="visual-glow visual-glow-two" />

      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />

      <div className="planet planet-large">
        <span />
      </div>

      <div className="planet planet-small" />

      <div className="floating-chip chip-score">
        <span>⭐</span>
        <strong>+۲۵۰ XP</strong>
      </div>

      <div className="floating-chip chip-combo">
        <span>🔥</span>
        <strong>COMBO ×۳</strong>
      </div>

      <div className="space-stars">
        {Array.from({ length: 22 }).map((_, index) => (
          <i key={index} style={{ '--i': index }} />
        ))}
      </div>

      <div className="ship-wrap">
        <div className="ship-energy" />
        <img
          src="/images/player_ship.png"
          alt="سفینه فضایی سایبرکوییز"
          className="hero-ship"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="visual-question-card">
        <div className="question-card-top">
          <span>سؤال ۳ از ۲۰</span>
          <span className="live-dot">LIVE</span>
        </div>

        <p>کدام ذره در هسته اتم قرار ندارد؟</p>

        <div className="mini-options">
          <span>پروتون</span>
          <span className="correct-option">الکترون ✓</span>
        </div>
      </div>

      <div className="visual-label">
        <span className="label-pulse" />
        مأموریت فعال است
      </div>
    </div>
  );
}
