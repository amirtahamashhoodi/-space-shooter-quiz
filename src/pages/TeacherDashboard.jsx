// src/pages/TeacherDashboard.jsx
import React from 'react';
import { t } from '../utils/i18n';

export default function TeacherDashboard({ onLogout, onBackToHome }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container header-flex">
          <div className="brand">
            <span className="brand-dot" />
            <h2>{t('teacher_dashboard.badge')}</h2>
          </div>
          <div className="actions">
            <button onClick={onBackToHome} className="btn-secondary">
              {t('teacher_dashboard.view_home')}
            </button>
            <button onClick={onLogout} className="btn-danger">
              {t('teacher_dashboard.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main">
        <div className="dashboard-welcome">
          <h2>{t('teacher_dashboard.welcome')}</h2>
          <p>{t('teacher_dashboard.subtitle')}</p>
        </div>

        <div className="dashboard-cards-grid">
          <div className="dash-card">
            <div className="icon">🎮</div>
            <h3>{t('teacher_dashboard.lobby_card.title')}</h3>
            <p>{t('teacher_dashboard.lobby_card.desc')}</p>
            <button className="card-action-btn">
              {t('teacher_dashboard.lobby_card.btn')}
            </button>
          </div>

          <div className="dash-card">
            <div className="icon">📝</div>
            <h3>{t('teacher_dashboard.quiz_card.title')}</h3>
            <p>{t('teacher_dashboard.quiz_card.desc')}</p>
            <button className="card-action-btn">
              {t('teacher_dashboard.quiz_card.btn')}
            </button>
          </div>

          <div className="dash-card">
            <div className="icon">💾</div>
            <h3>{t('teacher_dashboard.offline_card.title')}</h3>
            <p>{t('teacher_dashboard.offline_card.desc')}</p>
            <button className="card-action-btn">
              {t('teacher_dashboard.offline_card.btn')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
