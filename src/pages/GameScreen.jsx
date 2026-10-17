import React from 'react';

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
          → بازگشت به صفحه اصلی
        </button>

        <div className="game-brand-small">
          <span>⚡</span> CyberQuiz
        </div>
      </div>

      <div className="game-shell">
        <div className="game-header">
          <div className="game-stat-group">
            <span className="game-score">⭐ {score}</span>
            {combo > 1 && <span className="combo-badge">کمبو ×{combo} 🔥</span>}
          </div>

          <div className="game-question-title">
            <span className="question-progress">سؤال {qIndex + 1}</span>
            <strong>{currentQuestion?.q || 'در حال آماده‌سازی...'}</strong>
          </div>

          <div className="game-lives" aria-label={`${lives} جان باقی مانده`}>
            {lives > 0 ? '❤️'.repeat(lives) : '💔'}
          </div>
        </div>

        <div className="phaser-wrapper">
          <div ref={containerRef} className="phaser-container" />
        </div>

        <div className="game-help">
          <span>حرکت: کلیدهای جهت‌نما یا W A S D</span>
          <span>شلیک: Space</span>
          <span>بمب EMP: B</span>
        </div>
      </div>
    </main>
  );
}
