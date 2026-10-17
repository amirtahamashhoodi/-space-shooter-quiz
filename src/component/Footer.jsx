import React from 'react';
import Logo from './Logo';

export default function Footer({ onTeacherClick }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>یادگیری، این‌بار در قالب یک مأموریت هیجان‌انگیز.</p>
        </div>

        <div className="footer-links">
          <a href="#features">امکانات</a>
         <a href="#modes">مدل‌های بازی</a>
          <a href="#how-it-works">راهنمای استفاده</a>
          <button type="button" onClick={onTeacherClick}>
            ورود معلم
          </button>
        </div>

        <div className="footer-copy">
          <span>© CyberQuiz</span>
          <span>ساخته‌شده برای کلاس‌های آینده</span>
        </div>
      </div>
    </footer>
  );
}
