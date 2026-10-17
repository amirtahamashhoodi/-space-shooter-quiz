import React from 'react';
import Logo from './Logo';
import { t } from '../utils/i18n';

export default function Footer({ onTeacherClick }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="footer-links">
          <a href="#features">{t('footer.features')}</a>
          <a href="#modes">{t('footer.modes')}</a>
          <a href="#how-it-works">{t('footer.how_it_works')}</a>
          <button type="button" onClick={onTeacherClick}>
            {t('footer.teacher_login')}
          </button>
        </div>

        <div className="footer-copy">
          <span>{t('footer.brand_name')}</span>
          <span>{t('footer.made_for')}</span>
        </div>
      </div>
    </footer>
  );
}
