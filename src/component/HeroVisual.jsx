import React from 'react';
import { t } from '../utils/i18n';

export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-label={t('hero_visual.aria_label')}>
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
        <strong>{t('hero_visual.xp_gain')}</strong>
      </div>

      <div className="floating-chip chip-combo">
        <span>🔥</span>
        <strong>{t('hero_visual.combo')}</strong>
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
          alt={t('hero_visual.ship_alt')}
          className="hero-ship"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="visual-question-card">
        <div className="question-card-top">
          <span>{t('hero_visual.demo_step')}</span>
          <span className="live-dot">{t('hero_visual.demo_live')}</span>
        </div>

        <p>{t('hero_visual.demo_question')}</p>

        <div className="mini-options">
          <span>{t('hero_visual.demo_option_wrong')}</span>
          <span className="correct-option">{t('hero_visual.demo_option_correct')}</span>
        </div>
      </div>

      <div className="visual-label">
        <span className="label-pulse" />
        {t('hero_visual.mission_active')}
      </div>
    </div>
  );
}
