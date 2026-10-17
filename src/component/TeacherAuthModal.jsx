// src/component/TeacherAuthModal.jsx
import React, { useState } from 'react';
import { t } from '../utils/i18n';

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
      alert(t('auth_modal.validation_alert'));
      return;
    }
    resetForm();
    onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label={t('auth_modal.close_aria')}>
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-badge">
            {mode === 'login' ? t('auth_modal.login_badge') : t('auth_modal.register_badge')}
          </span>
          <h3 className="modal-title">
            {mode === 'login' ? t('auth_modal.login_title') : t('auth_modal.register_title')}
          </h3>
          <p className="modal-subtitle">
            {t('auth_modal.subtitle')}
          </p>
        </div>

        <div className="modal-tabs">
          <button 
            type="button" 
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            {t('auth_modal.tab_login')}
          </button>
          <button 
            type="button" 
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            {t('auth_modal.tab_register')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {mode === 'register' && (
            <div className="form-group">
              <label>{t('auth_modal.full_name_label')}</label>
              <input
                type="text"
                placeholder={t('auth_modal.full_name_placeholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{t('auth_modal.phone_email_label')}</label>
            <input
              type="text"
              name="teacher_login_identifier"
              placeholder={t('auth_modal.phone_email_placeholder')}
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('auth_modal.password_label')}</label>
            <input
              type="password"
              name="teacher_login_secret"
              placeholder={t('auth_modal.password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? t('auth_modal.submit_login') : t('auth_modal.submit_register')}
            <span>←</span>
          </button>
        </form>

        <div className="modal-footer-hint">
          {t('auth_modal.hint')}
        </div>
      </div>
    </div>
  );
}
