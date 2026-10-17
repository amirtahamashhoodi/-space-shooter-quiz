import React from 'react';

export default function TeacherCTA({ onTeacherClick }) {
  return (
    <section className="teacher-cta-section">
      <div className="container">
        <div className="teacher-cta">
          <div className="cta-decoration cta-decoration-one" />
          <div className="cta-decoration cta-decoration-two" />

          <div className="cta-content">
            <span className="eyebrow">ویژه معلمان و مدارس</span>
            <h2>کلاس بعدی‌تان را متفاوت برگزار کنید.</h2>
            <p>
              سؤال بسازید، بازی اجرا کنید و پیشرفت دانش‌آموزان را با وضوح بیشتری
              ببینید.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onTeacherClick}
          >
            ورود به پنل معلم
            <span>←</span>
          </button>
        </div>
      </div>
    </section>
  );
}
