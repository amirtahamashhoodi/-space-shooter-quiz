// src/component/TeacherCTA.jsx
import React from 'react';
import { t } from '../utils/i18n';

export default function TeacherCTA({ onTeacherClick }) {
  return (
    <section className="teacher-cta-section">
      <div className="container">
        <div className="teacher-cta">
          <div className="cta-decoration cta-decoration-one" />
          <div className="cta-decoration cta-decoration-two" />

          <div className="cta-content">
            <span className="eyebrow">{t('teacher_cta.eyebrow')}</span>
            <h2>{t('teacher_cta.title')}</h2>
            <p>{t('teacher_cta.subtitle')}</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onTeacherClick}
          >
            {t('teacher_cta.btn')}
            <span>←</span>
          </button>
        </div>
      </div>
    </section>
  );
}
