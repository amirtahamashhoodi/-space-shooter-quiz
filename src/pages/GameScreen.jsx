import React from 'react';
import { t } from '../utils/i18n';

export default function GameScreen({
  score,
  lives,
  combo,
  currentQuestion,
  qIndex,
  containerRef,
  onBackHome
}) {
  return (
    <main className="game-page" dir="rtl">
      <div className="game-page-bg" />

      <div className="game-top-actions">
        <button type="button" className="back-home-button" onClick={onBackHome}>
          {t('game_screen.back_to_home')}
        </button>

        <div className="game-brand-small">
          <span>⚡</span> {t('game_screen.brand_name')}
        </div>
      </div>

      <div className="game-shell">
        <div className="game-header">
          <div className="game-stat-group">
            <span className="game-score">⭐ {score}</span>
            {combo > 1 && (
              <span className="combo-badge">
                {t('game_screen.combo_label', { combo })}
              </span>
            )}
          </div>

          <div className="game-question-title">
            <span className="question-progress">
              {t('game_screen.question_progress', { index: qIndex + 1 })}
            </span>
            <strong>
              {currentQuestion?.q || t('game_screen.loading_question')}
            </strong>
          </div>

          <div
            className="game-lives"
            aria-label={t('game_screen.lives_aria', { lives })}
          >
            {lives > 0 ? '❤️'.repeat(lives) : '💔'}
          </div>
        </div>

        <div className="phaser-wrapper">
          <div ref={containerRef} className="phaser-container" />
        </div>

        <div className="game-help">
          <span>{t('game_screen.help_movement')}</span>
          <span>{t('game_screen.help_shoot')}</span>
          <span>{t('game_screen.help_emp')}</span>
        </div>
      </div>
    </main>
  );
}
