// src/pages/GameOverScreen.jsx
import React from 'react';
import { t } from '../utils/i18n';

export default function GameOverScreen({ score, onRestart, onBackHome }) {
  return (
    <main className="gameover-page" dir="rtl">
      <div className="gameover-card">
        <div className="gameover-icon">💥</div>

        <span className="eyebrow">{t('game_over.eyebrow')}</span>

        <h1>{t('game_over.title')}</h1>

        <div className="final-score">
          <span>{t('game_over.final_score')}</span>
          <strong>{score}</strong>
          <small>{t('game_over.score_unit')}</small>
        </div>

        <p>{t('game_over.desc')}</p>

        <div className="gameover-actions">
          <button type="button" className="primary-button" onClick={onRestart}>
            {t('game_over.restart_btn')}
          </button>

          <button
            type="button"
            className="outline-button"
            onClick={onBackHome}
          >
            {t('game_over.home_btn')}
          </button>
        </div>
      </div>
    </main>
  );
}
