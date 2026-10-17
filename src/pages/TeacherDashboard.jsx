// src/pages/TeacherDashboard.jsx
import React from 'react';

export default function TeacherDashboard({ onLogout, onBackToHome }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container header-flex">
          <div className="brand">
            <span className="brand-dot" />
            <h2>پنل معلم سایبرکویز</h2>
          </div>
          <div className="actions">
            <button onClick={onBackToHome} className="btn-secondary">
              مشاهده صفحه اصلی
            </button>
            <button onClick={onLogout} className="btn-danger">
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main">
        <div className="dashboard-welcome">
          <h2>سلام همکار گرامی، به اتاق فرمان کلاس خوش آمدید! 🚀</h2>
          <p>از اینجا می‌توانید بسته سوالات طراحی کنید، خروجی آفلاین بگیرید یا اتاق بازی زنده ایجاد کنید.</p>
        </div>

        <div className="dashboard-cards-grid">
          <div className="dash-card">
            <div className="icon">🎮</div>
            <h3>ایجاد اتاق بازی زنده (Live Lobby)</h3>
            <p>ایجاد پین‌کد ۶ رقمی برای ورود سریع دانش‌آموزان در کلاس.</p>
            <button className="card-action-btn">استارت لابی جدید</button>
          </div>

          <div className="dash-card">
            <div className="icon">📝</div>
            <h3>طراحی بسته سوال جدید</h3>
            <p>افزودن سوال ۴ گزینه‌ای، هوش مصنوعی یا ایمپورت از اکسل/JSON.</p>
            <button className="card-action-btn">ساخت کوئیز</button>
          </div>

          <div className="dash-card">
            <div className="icon">💾</div>
            <h3>مدیریت بسته‌های آفلاین (بدون اینترنت)</h3>
            <p>دانلود فایل پکیج روی فلش مموری برای مدارس با اینترنت ضعیف.</p>
            <button className="card-action-btn">خروجی آفلاین (JSON/QR)</button>
          </div>
        </div>
      </main>
    </div>
  );
}
