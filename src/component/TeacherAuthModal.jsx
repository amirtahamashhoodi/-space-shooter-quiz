// src/component/TeacherAuthModal.jsx
import React, { useState } from 'react';

export default function TeacherAuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // پاک کردن فرم
  const resetForm = () => {
    setPhoneOrEmail('');
    setPassword('');
    setFullName('');
  };

  const handleTabSwitch = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneOrEmail || !password || (mode === 'register' && !fullName)) {
      alert('لطفاً فیلدها را کامل کنید.');
      return;
    }
    resetForm();
    onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="بستن">
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
            onClick={() => handleTabSwitch('login')}
          >
            ورود
          </button>
          <button 
            type="button" 
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            ثبت‌نام جدید
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {mode === 'register' && (
            <div className="form-group">
              <label>نام و نام خانوادگی</label>
              <input
                type="text"
                placeholder="مثال: مریم کریمی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>شماره موبایل یا ایمیل</label>
            <input
              type="text"
              name="teacher_login_identifier"
              placeholder="0912xxxxxxx یا teacher@school.ir"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label>کلمه عبور</label>
            <input
              type="password"
              name="teacher_login_secret"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
