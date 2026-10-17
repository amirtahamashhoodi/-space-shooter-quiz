import React from 'react';
import { t } from '../utils/i18n';

export default function GameModes() {
  const GAME_ENGINES = [
    {
      id: 'space-blaster',
      title: t('game_modes.space_blaster.title'),
      enTitle: t('game_modes.space_blaster.enTitle'),
      theme: 'cyan',
      status: 'active',
      statusLabel: t('game_modes.space_blaster.statusLabel'),
      badge: t('game_modes.space_blaster.badge'),
      desc: t('game_modes.space_blaster.desc'),
      features: [
        t('game_modes.space_blaster.f1'),
        t('game_modes.space_blaster.f2'),
        t('game_modes.space_blaster.f3')
      ],
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.77 22.77 0 0 1-3.95 2z"/>
          <path d="M9 12H4s.55-3.03 2-4.5c1.45-1.47 4.5-2 4.5-2"/>
          <path d="M12 9V4s3.03.55 4.5 2c1.47 1.45 2 4.5 2 4.5"/>
        </svg>
      )
    },
    {
      id: 'cyber-vault',
      title: t('game_modes.cyber_vault.title'),
      enTitle: t('game_modes.cyber_vault.enTitle'),
      theme: 'purple',
      status: 'soon',
      statusLabel: t('game_modes.cyber_vault.statusLabel'),
      badge: t('game_modes.cyber_vault.badge'),
      desc: t('game_modes.cyber_vault.desc'),
      features: [
        t('game_modes.cyber_vault.f1'),
        t('game_modes.cyber_vault.f2'),
        t('game_modes.cyber_vault.f3')
      ],
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="3"/>
          <circle cx="12" cy="12" r="4"/>
          <path d="m15 9-6 6"/>
          <path d="m9 9 6 6"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
        </svg>
      )
    },
    {
      id: 'lab-defense',
      title: t('game_modes.lab_defense.title'),
      enTitle: t('game_modes.lab_defense.enTitle'),
      theme: 'green',
      status: 'soon',
      statusLabel: t('game_modes.lab_defense.statusLabel'),
      badge: t('game_modes.lab_defense.badge'),
      desc: t('game_modes.lab_defense.desc'),
      features: [
        t('game_modes.lab_defense.f1'),
        t('game_modes.lab_defense.f2'),
        t('game_modes.lab_defense.f3')
      ],
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L4.15 19.3A2 2 0 0 0 5.86 22h12.28a2 2 0 0 0 1.71-2.7L14 9.31V2"/>
          <path d="M8.5 2h7"/>
          <path d="M7 16h10"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'time-bomb',
      title: t('game_modes.time_bomb.title'),
      enTitle: t('game_modes.time_bomb.enTitle'),
      theme: 'pink',
      status: 'soon',
      statusLabel: t('game_modes.time_bomb.statusLabel'),
      badge: t('game_modes.time_bomb.badge'),
      desc: t('game_modes.time_bomb.desc'),
      features: [
        t('game_modes.time_bomb.f1'),
        t('game_modes.time_bomb.f2'),
        t('game_modes.time_bomb.f3')
      ],
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8"/>
          <path d="M12 9v4l2.5 2.5"/>
          <path d="m17.5 4.5 1.5-1.5"/>
          <path d="M16 2h4v4"/>
          <path d="M7 3 4 5"/>
        </svg>
      )
    }
  ];

  return (
    <section className="modes-section" id="modes">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">{t('game_modes.eyebrow')}</span>
          <h2>{t('game_modes.title')}</h2>
          <p>{t('game_modes.subtitle')}</p>
        </div>

        <div className="modes-grid">
          {GAME_ENGINES.map((engine) => {
            const isActive = engine.status === 'active';
            return (
              <div
                key={engine.id}
                className={`mode-card mode-${engine.theme} ${isActive ? 'is-active' : 'is-upcoming'}`}
              >
                <div className="mode-card-glow" />

                <div className="mode-card-header">
                  <div className={`status-pill ${isActive ? 'status-pill-active' : 'status-pill-soon'}`}>
                    <span className="status-dot" />
                    <span>{engine.statusLabel}</span>
                  </div>
                  <span className="engine-badge">{engine.badge}</span>
                </div>

                <div className="mode-icon-box">
                  {engine.icon}
                </div>

                <div className="mode-info">
                  <span className="mode-en-title">{engine.enTitle}</span>
                  <h3>{engine.title}</h3>
                  <p className="mode-description">{engine.desc}</p>
                </div>

                <ul className="mode-features">
                  {engine.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="feature-bullet" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mode-card-footer">
                  {isActive ? (
                    <a href="#hero-join" className="mode-action-btn active-btn">
                      <span>{t('game_modes.space_blaster.action')}</span>
                      <span className="arrow-sym">←</span>
                    </a>
                  ) : (
                    <div className="mode-action-btn lock-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span>{t('game_modes.locked_btn')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
