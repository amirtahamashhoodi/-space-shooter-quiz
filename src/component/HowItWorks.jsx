import React from 'react';
import { t } from '../utils/i18n';

export default function HowItWorks() {
  const steps = [
    {
      step: '۰۱',
      title: t('how_it_works.step1_title'),
      desc: t('how_it_works.step1_desc'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      )
    },
    {
      step: '۰۲',
      title: t('how_it_works.step2_title'),
      desc: t('how_it_works.step2_desc'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      )
    },
    {
      step: '۰۳',
      title: t('how_it_works.step3_title'),
      desc: t('how_it_works.step3_desc'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">{t('how_it_works.eyebrow')}</span>
          <h2>{t('how_it_works.title')}</h2>
          <p>{t('how_it_works.subtitle')}</p>
        </div>

        <div className="how-grid">
          {steps.map((item, idx) => (
            <div key={idx} className="how-card">
              <div className="how-card-top">
                <span className="how-step-badge">{item.step}</span>
                <div className="how-icon-wrap">{item.icon}</div>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
