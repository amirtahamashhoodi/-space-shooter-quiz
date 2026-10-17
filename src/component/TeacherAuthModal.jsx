// src/components/TeacherAuthModal.jsx
import React, { useState } from 'react';

export default function TeacherAuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneOrEmail || !password) {
      alert('لطفاً فیلدها را کامل کنید.');
      return;
    }
    onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="بستن">
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-badge">
            {mode === 'login' ? 'خوش آمدید' : 'شروع ۳۰ ثانیه‌ای'}
          </span>
          <h3 className="modal-title">
            {mode === 'login' ? 'ورود به پنل طراح آزمون و معلم' : 'ایجاد حساب معلم'}
          </h3>
          <p className="modal-subtitle">
            مدیریت کوئیزها، بانک سوالات و اجرای لایو بازی‌ها در کلاس
          </p>
        </div>

        <div className="modal-tabs">
          <button 
            type="button" 
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            ورود
          </button>
          <button 
            type="button" 
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            ثبت‌نام جدید
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>نام و نام خانوادگی</label>
              <input
                type="text"
                placeholder="مثال: مریم کریمی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>شماره موبایل یا ایمیل</label>
            <input
              type="text"
              placeholder="0912xxxxxxx یا teacher@school.ir"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>کلمه عبور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'ورود به پنل مدیریت' : 'ساخت حساب و شروع'}
            <span>←</span>
          </button>
        </form>

        <div className="modal-footer-hint">
          💡 حالت تست سریع: با هر متنی وارد پنل می‌شوید.
        </div>
      </div>
    </div>
  );
}
