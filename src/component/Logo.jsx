// src/component/Logo.jsx
import React from 'react';
import { t } from '../utils/i18n';

export default function Logo() {
  return (
    <a href="#top" className="brand" aria-label={t('logo.aria_label')}>
      <span className="brand-mark">⚡</span>
      <span className="brand-text">
        <strong>{t('logo.name')}</strong>
        <small>{t('logo.sub')}</small>
      </span>
    </a>
  );
}
