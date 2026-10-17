import React from 'react';
import { GAME_MODES } from '../data/quizData';

export default function GameModes() {
  return (
    <section className="game-modes-section" id="game-modes">
      <div className="container">
        <div className="section-heading section-heading-inline">
          <div>
            <span className="eyebrow">یک سؤال، چند تجربه متفاوت</span>
            <h2>موتورهای بازی CyberQuiz</h2>
          </div>
          <p>
            بازی‌ها موضوع‌محور نیستند؛ هر درس می‌تواند در قالب‌های مختلف بازی
            اجرا شود.
          </p>
        </div>

        <div className="game-modes-grid">
          {GAME_MODES.map((mode, index) => (
            <article
              className={`mode-card mode-${mode.color} ${
                index === 0 ? 'mode-active' : ''
              }`}
              key={mode.subtitle}
            >
              <div className="mode-card-top">
                <span className="mode-icon">{mode.icon}</span>
                {index === 0 && <span className="available-badge">نسخه دمو</span>}
              </div>

              <span className="mode-subtitle">{mode.subtitle}</span>
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>

              <div className="mode-line" />
              <span className="mode-status">
                {index === 0 ? 'قابل اجرا' : 'به‌زودی'}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
