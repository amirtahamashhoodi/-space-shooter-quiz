import React from 'react';
import { t } from '../utils/i18n';

export default function FeatureStrip() {
  const features = [
    {
      icon: '⚡',
      title: t('feature_strip.f1_title'),
      text: t('feature_strip.f1_text')
    },
    {
      icon: '📱',
      title: t('feature_strip.f2_title'),
      text: t('feature_strip.f2_text')
    },
    {
      icon: '📊',
      title: t('feature_strip.f3_title'),
      text: t('feature_strip.f3_text')
    },
    {
      icon: '🛡️',
      title: t('feature_strip.f4_title'),
      text: t('feature_strip.f4_text')
    }
  ];

  return (
    <section className="feature-strip" id="features">
      <div className="container feature-grid">
        {features.map((feature) => (
          <div className="feature-item" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
