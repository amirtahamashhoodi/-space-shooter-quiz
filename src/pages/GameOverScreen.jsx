import React from 'react';

export default function GameOverScreen({ score, onRestart, onBackHome }) {
  return (
    <main className="gameover-page" dir="rtl">
      <div className="gameover-card">
        <div className="gameover-icon">💥</div>

        <span className="eyebrow">ماموریت به پایان رسید</span>

        <h1>نتیجه مأموریت</h1>

        <div className="final-score">
          <span>امتیاز نهایی</span>
          <strong>{score}</strong>
          <small>XP</small>
        </div>

        <p>
          عملکردت ثبت شد. می‌توانی دوباره تلاش کنی و امتیاز بیشتری بگیری.
        </p>

        <div className="gameover-actions">
          <button type="button" className="primary-button" onClick={onRestart}>
            تلاش مجدد 🔄
          </button>

          <button
            type="button"
            className="outline-button"
            onClick={onBackHome}
          >
            صفحه اصلی
          </button>
        </div>
      </div>
    </main>
  );
}
